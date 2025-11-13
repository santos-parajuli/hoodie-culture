'use client';

import { AdminAPI, CategoryAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryInterface, ImageInterface, ProductVariantInterface } from '@/utils/types/types';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ImageUpload from '@/components/shared/ImageUpload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export default function UploadProductPage() {
	const [title, setTitle] = useState('');
	const [slug, setSlug] = useState('');
	const [manualSlug, setManualSlug] = useState(false);
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState<string>('');
	const [categories, setCategories] = useState<CategoryInterface[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<CategoryInterface[]>([]);
	const [images, setImages] = useState<ImageInterface[]>([]);
	const [variants, setVariants] = useState<ProductVariantInterface[]>([]);
	const [aboutItem, setAboutItem] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	const router = useRouter();

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const cats = await CategoryAPI.getCategories();
				setCategories(cats);
			} catch (err) {
				toast.error(err instanceof Error ? err.message : 'Unknown error');
			} finally {
				setLoading(false);
			}
		};
		fetchCategories();
	}, []);

	useEffect(() => {
		if (title && !manualSlug) {
			setSlug(
				title
					.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/[^\w-]+/g, '')
			);
		}
	}, [title, manualSlug]);

	const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setManualSlug(true);
		setSlug(e.target.value);
	};

	const handleImageUpload = (uploaded: ImageInterface[]) => setImages(uploaded);

	const handleVariantImageUpload = (index: number, uploaded: ImageInterface[]) => {
		const newVariants = [...variants];
		newVariants[index].image = uploaded[0];
		setVariants(newVariants);
	};

	const handleAddVariant = () => {
		setVariants([...variants, { colorName: '', image: { url: '', public_id: '' }, sizes: [], public_id: '' }]);
	};

	const handleRemoveVariant = (index: number) => {
		const newVariants = [...variants];
		newVariants.splice(index, 1);
		setVariants(newVariants);
	};

	const handleSizeToggle = (variantIndex: number, sizeLabel: string, checked: boolean) => {
		const newVariants = [...variants];
		const variant = newVariants[variantIndex];
		if (checked) variant.sizes.push({ label: sizeLabel, stock: 0 });
		else variant.sizes = variant.sizes.filter((s) => s.label.toLowerCase() !== sizeLabel.toLowerCase());
		setVariants(newVariants);
	};

	const handleSizeStockChange = (variantIndex: number, sizeLabel: string, stock: number) => {
		const newVariants = [...variants];
		const size = newVariants[variantIndex].sizes.find((s) => s.label.toLowerCase() === sizeLabel.toLowerCase());
		if (size) size.stock = stock;
		setVariants(newVariants);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		const totalStock = variants.reduce((sum, v) => sum + v.sizes.reduce((s, size) => s + size.stock, 0), 0);
		try {
			await AdminAPI.createProduct({
				title,
				slug,
				description,
				price: price ? parseFloat(price) : 0,
				categoryIds: selectedCategories.map((c) => c.id),
				images,
				variants,
				inventory: { stock: totalStock },
				aboutItem,
			});
			toast.success('Product created successfully');
			router.push('/admin/products');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Unknown error');
		} finally {
			setSubmitting(false);
		}
	};
	if (loading) return <div>Loading...</div>;
	return (
		<Card className='w-full rounded-none p-2 md:p-5 mx-auto'>
			<CardHeader>
				<CardTitle>Upload Product</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-6'>
					<div>
						<Label className='mb-2'>Title</Label>
						<Input value={title} onChange={(e) => setTitle(e.target.value)} required />
					</div>
					<div>
						<Label className='mb-2'>Slug</Label>
						<Input disabled value={slug} onChange={handleSlugChange} required />
					</div>
					<div>
						<Label className='mb-2'>Description</Label>
						<Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
					</div>
					<div className='flex gap-8'>
						<div>
							<Label className='mb-2'>Price</Label>
							<Input type='number' step='0.1' value={price} onChange={(e) => setPrice(e.target.value)} min={0} required />
						</div>
						<div>
							<Label className='mb-2'>Categories</Label>
							<MultiSelect
								options={categories.map((c) => ({ label: c.name, value: c.id }))}
								value={selectedCategories.map((c) => c.id)}
								onChange={(ids) => setSelectedCategories(categories.filter((c) => ids.includes(c.id)))}
								placeholder='Select categories'
							/>
						</div>
					</div>
					<div>
						<Label className='mb-2'>Images</Label>
						<ImageUpload onUpload={handleImageUpload} initialImages={images} maxFiles={5} />
					</div>
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold'>Variants</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1'>
							{variants.map((variant, index) => (
								<Card key={index} className='p-4'>
									<CardContent className='space-y-4'>
										<Input
											value={variant.colorName}
											onChange={(e) => {
												const newVariants = [...variants];
												newVariants[index].colorName = e.target.value;
												setVariants(newVariants);
											}}
											placeholder='Color Name'
										/>
										<div>
											<Label className='mb-2'>Variant Image</Label>
											<ImageUpload initialImages={variant.image.url ? [variant.image] : []} onUpload={(imgs) => handleVariantImageUpload(index, imgs)} maxFiles={1} />
										</div>
										<div className='grid grid-cols-3 gap-4'>
											{AVAILABLE_SIZES.map((sizeLabel) => {
												const isSelected = variant.sizes.some((s) => s.label.toLowerCase() === sizeLabel.toLowerCase());
												const selectedSize = variant.sizes.find((s) => s.label.toLowerCase() === sizeLabel.toLowerCase());
												return (
													<div key={sizeLabel}>
														<div className='flex'>
															<Checkbox checked={isSelected} onCheckedChange={(val) => handleSizeToggle(index, sizeLabel, val as boolean)} />
															<Label className='ml-2'>{sizeLabel}</Label>
														</div>
														{isSelected && (
															<div className='mt-2'>
																<Label className='mb-2'>Stock</Label>
																<Input type='number' value={selectedSize?.stock ?? 0} onChange={(e) => handleSizeStockChange(index, sizeLabel, parseInt(e.target.value))} min={0} />
															</div>
														)}
													</div>
												);
											})}
										</div>

										<Button type='button' variant='destructive' onClick={() => handleRemoveVariant(index)}>
											Remove Variant
										</Button>
									</CardContent>
								</Card>
							))}
						</div>
						<Button type='button' onClick={handleAddVariant}>
							Add Variant
						</Button>
					</div>
					<div>
						<Label className='mb-2'>About Item</Label>
						<Textarea value={aboutItem.join('\n')} onChange={(e) => setAboutItem(e.target.value.split('\n'))} rows={5} />
					</div>
					<Button type='submit' disabled={submitting} className='w-full'>
						{submitting ? 'Creating...' : 'Create Product'}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
