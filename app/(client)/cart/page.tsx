import CartClient from '@/components/client/pages/cart-client';

export default function CartPage() {
	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-3xl font-bold mb-6'>Your Cart</h1>
			<CartClient />
		</div>
	);
}
