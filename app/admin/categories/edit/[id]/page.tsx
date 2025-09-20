'use client';

import { CategoryInterface, ImageInterface } from '@/utils/types/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { AdminAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/shared/ImageUpload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function EditCategoryPage() {
	const [name, setName] = useState('');
	const [slug, setSlug] = useState('');
	const [parentId, setParentId] = useState<string>('');
	const [categories, setCategories] = useState<CategoryInterface[]>([]);
	const [image, setImage] = useState<ImageInterface | null>(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	const router = useRouter();
	const params = useParams();
	const id = Array.isArray(params.id) ? params.id[0] : params.id; // ensure string

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!id) return;
				// Fetch category + all categories in parallel
				const [categoryData, allCategoriesData] = await Promise.all([AdminAPI.getCategory(id), AdminAPI.getCategories()]);

				setName(categoryData.name);
				setSlug(categoryData.slug);
				setParentId(categoryData.parentId ? categoryData.parentId.id : '');
				setImage(categoryData.image ?? null);

				// Exclude self from list
				setCategories(allCategoriesData.filter((cat) => cat.id !== id));
			} catch (err: unknown) {
				toast.error(err instanceof Error ? err.message : 'Unknown error');
			} finally {
				setLoading(false);
			}
		};

		if (id) fetchData();
	}, [id]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			if (!id) return;
			await AdminAPI.updateCategory(id, {
				name,
				slug,
				parentId: parentId === '' || parentId === 'false' ? undefined : parentId,
				image: image ?? undefined,
			});

			toast.success('Category updated successfully');
			router.push('/admin/categories');
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : 'Unknown error');
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) return <div>Loading category...</div>;

	return (
		<div className='w-full p-6 mx-auto'>
			<h1 className='mb-6 text-2xl'>Edit Category</h1>

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
				<Button type='submit' className='w-full' disabled={submitting}>
					{submitting ? 'Updating...' : 'Update Category'}
				</Button>
			</form>
		</div>
	);
}
