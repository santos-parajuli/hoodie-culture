/* eslint-disable @next/next/no-img-element */
// app/(client)/order/[slug]/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { OrderAPI } from '@/lib/api';
import { OrderInterface } from '@/utils/types/types';
import { TruncateWithTooltip } from '@/components/shared/truncate-with-tooltip';

export default async function OrderConfirmationPage({ params }: { params: { slug: string } }) {
	const orderId = params.slug;
	const order: OrderInterface = await OrderAPI.getOrder(orderId);
	const subtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
	const tax = subtotal * 0.13;
	const total = subtotal + tax;

	return (
		<div className='container mx-auto p-6 space-y-6'>
			<h1 className='text-3xl font-bold'>Thank You for Your Order!</h1>
			<p className='text-gray-500'>Order #{order.id}</p>

			<div className='grid md:grid-cols-2 gap-6'>
				{/* Order Status */}
				<Card>
					<CardHeader>
						<CardTitle>Order Received</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-gray-600'>Status: {order.status}</p>
						<Button className='mt-4'>Track Order</Button>
						<div className='mt-6'>
							<h3 className='font-semibold'>Shipping Address</h3>
							<p className='text-gray-600'>
								{order.shippingAddress?.line1}
								{order.shippingAddress?.line2 && `, ${order.shippingAddress.line2}`} <br />
								{order.shippingAddress?.city}, {order.shippingAddress?.state} <br />
								{order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Order Details */}
				<Card>
					<CardHeader>
						<CardTitle>Order Details</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						{order.items.map((item) => (
							<div key={item.name + item.variantId} className='flex justify-between items-center'>
								<div className='flex items-center gap-3'>
									{item.productId?.images?.[0] && <img src={item.image} alt={item.productId.title} className='w-12 h-12 rounded' />}
									<span className='mr-2'>
										<TruncateWithTooltip text={`${item.qty} × ${item.productId?.title || 'Product'}`} maxLength={30} />
									</span>
								</div>
								<span>${(item.price * item.qty).toFixed(2)}</span>
							</div>
						))}
						<hr />
						<div className='flex justify-between'>
							<span>Subtotal</span>
							<span>${subtotal.toFixed(2)}</span>
						</div>
						<div className='flex justify-between'>
							<span>Tax</span>
							<span>${tax.toFixed(2)}</span>
						</div>
						<div className='flex justify-between font-bold'>
							<span>Total</span>
							<span>${total.toFixed(2)}</span>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
