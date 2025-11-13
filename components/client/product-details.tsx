'use client';

import { CartItemInterface, ProductInterface, ProductSizeInterface, ProductVariantInterface } from '@/utils/types/types';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAppStore } from '@/lib/store';

export default function ProductDetails({ product }: { product: ProductInterface }) {
	const [selectedVariant, setSelectedVariant] = useState<ProductVariantInterface | null>(product.variants.length > 0 ? product.variants[0] : null);
	const [selectedSize, setSelectedSize] = useState<ProductSizeInterface | null>(selectedVariant && selectedVariant.sizes.length > 0 ? selectedVariant.sizes[0] : null);
	const [quantity, setQuantity] = useState(1);
	const [mainImage, setMainImage] = useState<string>(selectedVariant?.image?.url || product.images[0]?.url || '');
	const [hoverImage, setHoverImage] = useState<string | null>(null);
	const addItem = useAppStore((state) => state.addItem);
	const currentStock = selectedSize ? selectedSize.stock : product.stock;
	const [showFullDesc, setShowFullDesc] = useState(false);
	const toggleDescription = () => setShowFullDesc(!showFullDesc);
	useEffect(() => {
		setQuantity(1);
	}, [selectedSize]);
	const handleVariantClick = (variant: ProductVariantInterface) => {
		setSelectedVariant(variant);
		setSelectedSize(variant.sizes[0] || null);
		setMainImage(variant.image?.url || product.images[0]?.url || '');
	};
	const handleSizeClick = (size: ProductSizeInterface) => {
		setSelectedSize(size);
	};
	const handleAddToCart = () => {
		if (!selectedVariant || !selectedSize) {
			toast.error('Please select a color and size');
			return;
		}
		const itemToAdd: CartItemInterface = {
			productId: product,
			name: `(${selectedVariant.colorName}, ${selectedSize.label})${product.title} `,
			price: product.price,
			qty: quantity,
			image: selectedVariant.image?.url || product.images[0]?.url,
			variantId: selectedVariant.colorName,
		};
		console.log(itemToAdd);
		addItem(itemToAdd);
		toast.success(`${itemToAdd.name} added to cart!`);
	};
	return (
		<div className='container mx-auto p-4'>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
				{/* Images */}
				<div className='space-y-4'>
					<div className='relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden'>
						{mainImage ? <Image src={hoverImage || mainImage} alt={product.title} fill className='object-contain transition-all' /> : <div className='flex items-center justify-center h-full text-muted-foreground'>No Image</div>}
					</div>
					{/* Gallery Thumbnails */}
					<div className='flex gap-2 overflow-x-auto'>
						{product.images.map((img, index) => (
							<div
								key={index}
								className={`relative w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer border ${mainImage === img.url ? 'border-black' : 'border-transparent'}`}
								onClick={() => setMainImage(img.url)}>
								<Image src={img.url} alt={img.alt || `Product image ${index + 1}`} fill className='object-cover' />
							</div>
						))}
					</div>
				</div>

				{/* Details */}
				<div className='space-y-6'>
					<h1 className='text-4xl font-bold'>{product.title}</h1>

					{/* Description with See More / See Less */}
					{product.description && (
						<div className='text-gray-600 text-lg'>
							{showFullDesc ? product.description : product.description.slice(0, 250)}
							{product.description.length > 250 && (
								<button onClick={toggleDescription} className='ml-2 text-blue-600 underline'>
									{showFullDesc ? 'See less' : 'See more'}
								</button>
							)}
						</div>
					)}

					<p className='text-3xl font-bold text-green-600'>${product.price.toFixed(2)}</p>

					{/* Variant Selection */}
					{product.variants.length > 0 && (
						<div className='space-y-2'>
							<Label>Select Color:</Label>
							<div className='flex gap-3'>
								{product.variants.map((variant, idx) => (
									<div
										key={idx}
										className={`relative w-16 h-16 rounded-md overflow-hidden cursor-pointer border ${selectedVariant?.colorName === variant.colorName ? 'border-black' : 'border-gray-300'}`}
										onClick={() => handleVariantClick(variant)}
										onMouseEnter={() => setHoverImage(variant.image?.url || null)}
										onMouseLeave={() => setHoverImage(null)}>
										{variant.image?.url ? (
											<Image src={variant.image.url} alt={variant.image.alt || variant.colorName} fill className='object-cover' />
										) : (
											<div className='flex items-center justify-center h-full text-xs text-muted-foreground'>{variant.colorName}</div>
										)}
									</div>
								))}
							</div>
						</div>
					)}

					{/* Size Selection */}
					{selectedVariant && selectedVariant.sizes.length > 0 && (
						<div className='space-y-2'>
							<Label>Select Size:</Label>
							<div className='flex gap-2 flex-wrap'>
								{selectedVariant.sizes.map((size, idx) => (
									<Button
										key={idx}
										variant={selectedSize?.label === size.label ? 'default' : 'outline'}
										size='sm'
										disabled={size.stock === 0} // disabled if out of stock
										onClick={() => handleSizeClick(size)}>
										{size.label} {size.stock === 0 ? '(Out of stock)' : ''}
									</Button>
								))}
							</div>
						</div>
					)}

					{/* Quantity */}
					<div className='space-y-2'>
						<Label htmlFor='quantity'>Quantity:</Label>
						<Input id='quantity' type='number' value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.min(currentStock, parseInt(e.target.value) || 1)))} min={1} max={currentStock} className='w-24' />
					</div>

					<Button onClick={handleAddToCart} disabled={currentStock === 0}>
						{currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
					</Button>
				</div>
			</div>
		</div>
	);
}
