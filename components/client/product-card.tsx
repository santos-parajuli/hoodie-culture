'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import StarRating_Fractions from '../ui/rating';
import { formatPrice } from '@/utils/helpers/formatPrice';
import { toast } from 'sonner';
import { useAppStore } from '@/lib/store';

interface ProductCardProps {
	product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
	const addItem = useAppStore((state) => state.addItem);
	const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		event.preventDefault();
		console.log(product);
		const itemToAdd = {
			productId: product,
			name: product.title,
			price: product.price,
			qty: 1,
			image: product.images?.[0]?.url || '',
		};
		addItem(itemToAdd);
		toast.success(`${itemToAdd.name} added to cart!`);
	};

	return (
		<div className='w-full flex'>
			<Link href={`/products/${product.slug}`} className='w-full'>
				<Card className='w-full h-full flex flex-col rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card text-card-foreground'>
					{/* Image */}
					<div className='aspect-square rounded-t-lg bg-muted overflow-hidden relative'>
						{product.images?.[0]?.url ? (
							<Image src={product.images[0].url} alt={product.title} fill className='object-cover' sizes='(max-width: 768px) 100vw,(max-width: 1200px) 50vw, 25vw' />
						) : (
							<div className='flex items-center justify-center h-full text-muted-foreground text-sm'>No Image</div>
						)}
					</div>
					{/* Content */}
					<CardContent className='p-4 flex flex-col flex-grow'>
						{/* Title & Description */}
						<div className='space-y-1 mb-4'>
							<CardTitle className='text-sm font-semibold'>{product.title}</CardTitle>
							<CardDescription className='text-xs text-muted-foreground line-clamp-2'>{product.aboutItem?.[0]}</CardDescription>
						</div>
						{/* Bottom Section (rating + price) */}
						<div className='mt-auto space-y-2'>
							{/* Rating */}
							<div className='flex items-center space-x-1'>
								<StarRating_Fractions readOnly value={product.rating} maxStars={5} />
								<span className='text-xs text-muted-foreground ml-1'>{product.rating}</span>
							</div>
							{/* Price & Button */}
							<div className='flex items-center justify-between'>
								<span className='text-base font-bold'>{formatPrice(product.price)}</span>
								<Button size='sm' className='text-xs px-3 h-8 rounded-md' onClick={handleAddToCart}>
									Add
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</Link>
		</div>
	);
}
