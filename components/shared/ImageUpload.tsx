'use client';

import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ImageInterface } from '@/utils/types/types';
import { Progress } from '@/components/ui/progress';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
	onUpload: (images: ImageInterface[]) => void;
	initialImages?: ImageInterface[];
	maxFiles?: number;
}

export default function ImageUpload({ onUpload, initialImages = [], maxFiles = 3 }: ImageUploadProps) {
	const [uploading, setUploading] = useState(false);
	const [uploadedImages, setUploadedImages] = useState<ImageInterface[]>(initialImages);
	const [progress, setProgress] = useState<Record<string, number>>({});
	const fileInputRef = useRef<HTMLInputElement>(null);

	const isAtMaxFiles = uploadedImages.length >= maxFiles;

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement> | FileList) => {
		const files = e instanceof FileList ? e : e.target.files;
		if (!files) return;
		const filesToUpload = Array.from(files).slice(0, maxFiles - uploadedImages.length);
		if (filesToUpload.length === 0) return;
		setUploading(true);
		const newImages: ImageInterface[] = [];
		let uploadedCount = 0;
		for (const file of filesToUpload) {
			try {
				const { signature, timestamp } = await fetch('/api/cloudinary/sign', {
					method: 'POST',
				}).then((res) => res.json());
				const formData = new FormData();
				formData.append('file', file);
				formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string);
				formData.append('timestamp', timestamp);
				formData.append('signature', signature);
				const xhr = new XMLHttpRequest();
				xhr.open('POST', `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, true);
				xhr.upload.onprogress = (event) => {
					setProgress((prev) => ({
						...prev,
						[file.name]: Math.round((event.loaded / event.total) * 100),
					}));
				};
				xhr.onreadystatechange = () => {
					if (xhr.readyState === 4 && xhr.status === 200) {
						const data = JSON.parse(xhr.responseText);
						const newImage: ImageInterface = {
							url: data.secure_url,
							public_id: data.public_id,
						};
						newImages.push(newImage);
						uploadedCount++;
						if (uploadedCount === filesToUpload.length) {
							const finalImages = [...uploadedImages, ...newImages];
							setUploadedImages(finalImages);
							onUpload(finalImages);
							setUploading(false);
							setProgress({});
						}
					}
				};
				xhr.send(formData);
			} catch (error) {
				console.error('Upload error:', error);
				setUploading(false);
			}
		}
	};

	const handleRemoveImage = async (public_id: string) => {
		try {
			await fetch('/api/cloudinary/delete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ public_id }),
			});
		} catch (error) {
			console.error('Failed to delete image from Cloudinary:', error);
		}
		const updatedImages = uploadedImages.filter((img) => img.public_id !== public_id).map((img) => ({ ...img }));
		setUploadedImages(updatedImages);
		onUpload(updatedImages);
	};
	const onDragOver = (e: React.DragEvent) => e.preventDefault();
	const onDrop = (e: React.DragEvent) => {
		e.preventDefault();
		if (isAtMaxFiles) return;
		handleFileChange(e.dataTransfer.files);
	};

	return (
		<div>
			{/* Drag-and-drop / Click area */}
			<div
				className='group flex flex-col items-center justify-center gap-2 border-dashed border rounded-md p-6 cursor-pointer hover:bg-muted/50 transition-colors'
				onClick={() => fileInputRef.current?.click()}
				onDragOver={onDragOver}
				onDrop={onDrop}>
				<Upload className='w-6 h-6 text-muted-foreground' />
				<p className='text-sm font-semibold text-foreground'>Drop images here</p>
				<p className='text-xs text-muted-foreground'>
					or <span className='text-primary font-medium'>click to browse</span> (Max {maxFiles} images)
				</p>
				<input ref={fileInputRef} type='file' className='hidden' accept='image/png,image/jpeg,image/gif' multiple={maxFiles > 1} onChange={handleFileChange} disabled={uploading || isAtMaxFiles} />
			</div>

			{/* Uploading progress */}
			{uploading && <div className='mt-4'>Uploading...</div>}
			{Object.entries(progress).map(([fileName, p]) => (
				<div key={fileName} className='mt-2'>
					<p className='text-xs'>{fileName}</p>
					<Progress value={p} />
				</div>
			))}

			{/* Uploaded images */}
			<div className='flex flex-wrap gap-4 mt-4'>
				{uploadedImages.map((image) => (
					<div key={image.url} className='relative group'>
						<Image src={image.url} alt='uploaded' width={100} height={100} className='object-cover rounded' />
						<Button type='button' variant='destructive' size='sm' className='absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity' onClick={() => handleRemoveImage(image.public_id ? image.public_id : '')}>
							X
						</Button>
					</div>
				))}
			</div>
		</div>
	);
}
