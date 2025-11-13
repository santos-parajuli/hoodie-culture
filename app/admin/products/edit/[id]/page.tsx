'use client';

import { AdminAPI, CategoryAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryInterface, ImageInterface, ProductInterface, ProductSizeInterface, ProductVariantInterface } from '@/utils/types/types';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ImageUpload from '@/components/shared/ImageUpload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export default function EditProductPage() {
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
	const params = useParams();
	const productId = params?.id as string;
	// Fetch categories and product
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const cats = await CategoryAPI.getCategories();
				setCategories(cats);
			} catch (err) {
				toast.error(err instanceof Error ? err.message : 'Unknown error occurred');
			}
		};
		const fetchProduct = async () => {
			if (!productId) return;
			try {
				const data: ProductInterface = await AdminAPI.getProduct(productId);
				setTitle(data.title);
				setSlug(data.slug);
				setDescription(data.description || '');
				setPrice(data.price?.toString() || '');
				setSelectedCategories(data.categoryIds);
				setImages(data.images || []);
				setVariants(data.variants || []);
				setAboutItem(data.aboutItem || []);
			} catch (err) {
				toast.error(err instanceof Error ? err.message : 'Unknown error occurred');
			} finally {
				setLoading(false);
			}
		};
		Promise.all([fetchCategories(), fetchProduct()]);
	}, [productId]);
	// Auto-generate slug
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
	// Image handlers
	const handleImageUpload = (uploaded: ImageInterface[]) => setImages(uploaded);
	const handleVariantImageUpload = (index: number, uploaded: ImageInterface[]) => {
		const newVariants = [...variants];
		newVariants[index].image = uploaded[0];
		setVariants(newVariants);
	};

	// Variants
	const handleAddVariant = () => {
		const newVariant: ProductVariantInterface = {
			colorName: '',
			image: { url: '', public_id: '' },
			sizes: [] as ProductSizeInterface[],
			public_id: '',
		};
		setVariants([...variants, newVariant]);
	};

	const handleRemoveVariant = (index: number) => {
		const updated = [...variants];
		updated.splice(index, 1);
		setVariants(updated);
	};

	// Sizes
	const handleSizeToggle = (variantIndex: number, sizeLabel: string, checked: boolean) => {
		const newVariants = [...variants];
		const variant = newVariants[variantIndex];

		if (checked) {
			const newSize: ProductSizeInterface = { label: sizeLabel, stock: 0 };
			variant.sizes.push(newSize);
		} else {
			variant.sizes = variant.sizes.filter((s) => s.label.toLowerCase() !== sizeLabel.toLowerCase());
		}

		setVariants(newVariants);
	};

	const handleSizeStockChange = (variantIndex: number, sizeLabel: string, stock: number) => {
		const newVariants = [...variants];
		const size = newVariants[variantIndex].sizes.find((s) => s.label.toLowerCase() === sizeLabel.toLowerCase());
		if (size) size.stock = stock;
		setVariants(newVariants);
	};

	// Submit
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);

		const totalStock = variants.reduce((sum, v) => sum + v.sizes.reduce((s, size) => s + size.stock, 0), 0);

		try {
			const updatedProduct = await AdminAPI.updateProduct(productId, {
				title,
				slug,
				description,
				price: price ? parseFloat(price) : 0,
				categoryIds: selectedCategories.map((cat) => cat.id),
				images,
				variants,
				inventory: { stock: totalStock },
				aboutItem,
			});

			if (!updatedProduct) throw new Error('Failed to update product');
			toast.success('Product updated successfully');
			router.push('/admin/products');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Unknown error occurred');
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) return <div>Loading...</div>;

	return (
		<Card className='w-full rounded-none p-2 md:p-5 mx-auto'>
			<CardHeader>
				<CardTitle>Edit Product</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-6'>
					{/* Title */}
					<div>
						<Label className='mb-2'>Title</Label>
						<Input value={title} onChange={(e) => setTitle(e.target.value)} required />
					</div>

					{/* Slug */}
					<div>
						<Label className='mb-2'>Slug</Label>
						<Input disabled value={slug} onChange={handleSlugChange} required />
					</div>

					{/* Description */}
					<div>
						<Label className='mb-2'>Description</Label>
						<Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
					</div>

					{/* Price & Categories */}
					<div className='flex gap-8'>
						<div>
							<Label className='mb-2'>Price</Label>
							<Input type='number' step='0.1' value={price} onChange={(e) => setPrice(e.target.value)} min={0} required />
						</div>
						<div>
							<Label className='mb-2'>Categories</Label>
							<MultiSelect
								options={categories.map((cat) => ({ label: cat.name, value: cat.id }))}
								value={selectedCategories.map((cat) => cat.id)}
								onChange={(selectedIds: string[]) => setSelectedCategories(categories.filter((cat) => selectedIds.includes(cat.id)))}
								placeholder='Select categories'
							/>
						</div>
					</div>

					{/* Images */}
					<div>
						<Label className='mb-2'>Images</Label>
						<ImageUpload onUpload={handleImageUpload} initialImages={images} />
					</div>

					{/* Variants */}
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
											<ImageUpload initialImages={variant.image?.url ? [variant.image] : []} onUpload={(imgs) => handleVariantImageUpload(index, imgs)} maxFiles={1} />
										</div>
										{/* Sizes */}
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

					{/* About Item */}
					<div>
						<Label className='mb-2'>About Item</Label>
						<Textarea value={aboutItem.join('\n')} onChange={(e) => setAboutItem(e.target.value.split('\n'))} placeholder='Enter about the items' rows={5} />
					</div>

					<Button type='submit' disabled={submitting} className='w-full'>
						{!submitting ? 'Update Product' : 'Updating...'}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
