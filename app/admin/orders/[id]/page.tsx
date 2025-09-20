'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';

import { OrderInterface } from '@/utils/types/types';
import { formatPrice } from '@/utils/helpers/formatPrice';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';

export default function OrderDetailsPage() {
	const [order, setOrder] = useState<OrderInterface | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const params = useParams();
	const { id } = params;

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				const res = await fetch(`/api/admin/orders/${id}`);
				if (!res.ok) {
					throw new Error(`Error: ${res.status} ${res.statusText}`);
				}
				const data = await res.json();
				setOrder(data);
			} catch (err: unknown) {
				if (err instanceof Error) {
					toast.error(err.message);
					setError(err.message);
				} else {
					setError('An unknown error occured');
					toast.error('An unknown error occurred');
				}
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			fetchOrder();
		}
	}, [id]);

	if (loading) return <div>Loading order details...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!order) return <div>Order not found.</div>;

	return (
		<div className='container mx-auto p-4'>
			<Card>
				<CardHeader>
					<CardTitle>Order Details - {order.id}</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div>
						<h3 className='text-lg font-semibold'>Customer Information</h3>
						<p>Name: {order.userId.name}</p>
						<p>Email: {order.userId.email}</p>
					</div>

					<div>
						<h3 className='text-lg font-semibold'>Shipping Address</h3>
						<p>{order.shippingAddress?.line1}</p>
						{order.shippingAddress?.line2 && <p>{order.shippingAddress.line2}</p>}
						<p>
							{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
						</p>
						<p>{order.shippingAddress?.country}</p>
					</div>

					<div>
						<h3 className='text-lg font-semibold'>Order Summary</h3>
						<p>Total: {formatPrice(order.total)}</p>
						<p>Status: {order.status}</p>
						<p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
					</div>
					<div>
						<h3 className='text-lg font-semibold'>Items</h3>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Product</TableHead>
									<TableHead>Quantity</TableHead>
									<TableHead>Price</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{order.items.map((item, index) => (
									<TableRow key={index}>
										<TableCell>{item.productId.title}</TableCell>
										<TableCell>{item.qty}</TableCell>
										<TableCell>{formatPrice(item.price)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
