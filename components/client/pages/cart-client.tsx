/* eslint-disable @next/next/no-img-element */
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';

export default function CartClient() {
	const cartItems = useAppStore((state) => state.cartItems);
	const removeItem = useAppStore((state) => state.removeItem);
	const updateItemQuantity = useAppStore((state) => state.updateItemQuantity);
	const getCartTotal = useAppStore((state) => state.getCartTotal);
	const clearCart = useAppStore((state) => state.clearCart);
	const truncate = (str: string, length: number) => {
		if (str.length <= length) return str;
		return str.slice(0, length) + '...';
	};
	if (cartItems.length === 0) {
		return (
			<div className='text-center text-gray-600'>
				<p>Your cart is empty.</p>
				<Link href='/products'>
					<Button className='mt-4'>Continue Shopping</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
			<div className='lg:col-span-2'>
				<Card>
					<CardContent className='p-0'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Product</TableHead>
									<TableHead>Price</TableHead>
									<TableHead>Quantity</TableHead>
									<TableHead>Total</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{cartItems.map((item) => (
									<TableRow key={item.customization ? `${item.productId.id}-${item.variantId}-${crypto.randomUUID()}` : `${item.productId.id}-${item.variantId}`}>
										<TableCell className='flex items-center gap-4'>
											{item.image && <img src={item.image} alt={item.name} width={60} height={60} className='object-cover rounded' />}
											<span>{truncate(item.name, 20)}</span>
										</TableCell>
										<TableCell>${item.price.toFixed(2)}</TableCell>
										<TableCell>
											<Input type='number' value={item.qty} onChange={(e) => updateItemQuantity(item.productId.id, parseInt(e.target.value), item.variantId)} min={1} className='w-20' />
										</TableCell>
										<TableCell>${(item.price * item.qty).toFixed(2)}</TableCell>
										<TableCell>
											<Button variant='destructive' size='sm' onClick={() => removeItem(item.productId.id, item.variantId)}>
												Remove
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
			<div className='lg:col-span-1'>
				<Card>
					<CardHeader>
						<CardTitle>Order Summary</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='flex justify-between text-lg font-semibold'>
							<span>Subtotal:</span>
							<span>${getCartTotal().toFixed(2)}</span>
						</div>
						<Button className='w-full' asChild>
							<Link href='/checkout'>Proceed to Checkout</Link>
						</Button>
						<Button variant='outline' className='w-full' onClick={clearCart}>
							Clear Cart
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
