'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OrderAPI } from '@/lib/api';
import { toast } from 'sonner';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function CheckoutPage() {
	const router = useRouter();
	const cartItems = useAppStore((state) => state.cartItems);
	const getCartTotal = useAppStore((state) => state.getCartTotal);
	const clearCart = useAppStore((state) => state.clearCart);
	const { data: session } = useSession();

	const [shippingAddress, setShippingAddress] = useState({
		line1: '',
		line2: '',
		city: '',
		state: '',
		postalCode: '',
		country: '',
	});
	const [loading, setLoading] = useState(false);
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setShippingAddress((prev) => ({
			...prev,
			[id]: value,
		}));
	};
	const handleCheckout = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		if (cartItems.length === 0) {
			toast.error('Your cart is empty.');
			setLoading(false);
			return;
		}
		if (!session?.user?.id) {
			toast.error('Please log in to proceed with checkout.');
			setLoading(false);
			return;
		}
		try {
			const newOrder = await OrderAPI.createOrder({
				items: cartItems,
				shippingAddress,
				userId: session.user.id,
				total: getCartTotal(),
			});
			toast.success('Order placed successfully!');
			clearCart();
			router.push(`/order/${newOrder?.id}`);
		} catch (err: unknown) {
			console.log(err instanceof Error, JSON.stringify(err));
			toast.error(err instanceof Error ? err.message : 'Problem Placing order..');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-3xl font-bold mb-6'>Checkout</h1>
			<Card className='w-full max-w-2xl mx-auto'>
				<CardHeader>
					<CardTitle>Shipping Information</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleCheckout} className='space-y-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='line1'>Address Line 1</Label>
								<Input id='line1' type='text' value={shippingAddress.line1} onChange={handleInputChange} required />
							</div>
							<div className='space-y-2'>
								<Label htmlFor='line2'>Address Line 2 (Optional)</Label>
								<Input id='line2' type='text' value={shippingAddress.line2} onChange={handleInputChange} />
							</div>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='city'>City</Label>
								<Input id='city' type='text' value={shippingAddress.city} onChange={handleInputChange} required />
							</div>
							<div className='space-y-2'>
								<Label htmlFor='state'>State</Label>
								<Input id='state' type='text' value={shippingAddress.state} onChange={handleInputChange} required />
							</div>
							<div className='space-y-2'>
								<Label htmlFor='postalCode'>Postal Code</Label>
								<Input id='postalCode' type='text' value={shippingAddress.postalCode} onChange={handleInputChange} required />
							</div>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='country'>Country</Label>
							<Input id='country' type='text' value={shippingAddress.country} onChange={handleInputChange} required />
						</div>

						<div className='flex justify-between items-center pt-4 border-t'>
							<span className='text-xl font-bold'>Total: ${getCartTotal().toFixed(2)}</span>
							<Button type='submit' disabled={loading || cartItems.length === 0}>
								{loading ? 'Processing...' : 'Place Order'}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
