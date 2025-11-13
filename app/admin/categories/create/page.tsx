'use client';

import { CategoryInterface, ImageInterface } from '@/utils/types/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';

import { AdminAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/shared/ImageUpload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CreateCategoryPage() {
	const [name, setName] = useState('');
	const [slug, setSlug] = useState('');
	const [parentId, setParentId] = useState<string>('');
	const [categories, setCategories] = useState<CategoryInterface[]>([]);
	const [loading, setLoading] = useState(false);
	const [image, setImage] = useState<ImageInterface | null>(null);
	const router = useRouter();

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const data = await AdminAPI.getCategories();
				setCategories(data);
			} catch (err: unknown) {
				toast.error(err instanceof Error ? err.message : 'Unknown error');
			}
		};
		fetchCategories();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const newCategory = await AdminAPI.createCategory({
				name,
				slug,
				parentId: parentId === '' || parentId === 'false' ? undefined : parentId,
				image: image ?? undefined,
			});

			if (!newCategory) {
				throw new Error(`Error: `);
			}

			toast.success('Category created successfully');
			router.push('/admin/categories');
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : 'Unknown error');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='p-6'>
			<h1 className='mb-6 text-2xl'>Create Category</h1>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='name'>Category Name</Label>
					<Input id='name' type='text' value={name} onChange={(e) => setName(e.target.value)} required />
				</div>
				<div className='space-y-2'>
					<Label htmlFor='slug'>Slug</Label>
					<Input id='slug' type='text' value={slug} onChange={(e) => setSlug(e.target.value)} required />
				</div>
				{categories.length !== 0 && (
					<div className='space-y-2'>
						<Label htmlFor='parentId'>Parent Category (Optional)</Label>
						<Select onValueChange={setParentId} value={parentId}>
							<SelectTrigger>
								<SelectValue placeholder='Select a parent category' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='false'>No Parent</SelectItem>
								{categories.map((cat) => (
									<SelectItem key={cat.id} value={cat.id}>
										{cat.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}
				<div className='space-y-2'>
					<Label>Category Image</Label>
					<ImageUpload initialImages={image ? [image] : []} onUpload={(imgs) => setImage(imgs[0] ?? null)} maxFiles={1} />
				</div>
				<Button type='submit' className='w-full' disabled={loading}>
					{loading ? 'Creating...' : 'Create Category'}
				</Button>
			</form>
		</div>
	);
}
