import { OrderAPI } from '@/lib/api';
import OrdersClient from '@/components/client/pages/orders-client';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function OrdersPage() {
	const session = await auth();

	if (!session?.user) {
		redirect('/login?callbackUrl=/profile/orders');
	}
	const orders = await OrderAPI.getUserOrders(session.user.id);
	return (
		<div className='container mx-auto p-4 md:p-8'>
			<div className='mb-6'>
				<h1 className='text-3xl font-bold'>My Orders</h1>
				<p className='text-muted-foreground'>Here is a list of your past orders.</p>
			</div>
			<OrdersClient orders={orders} />
		</div>
	);
}
