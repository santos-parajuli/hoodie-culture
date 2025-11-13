import { NextResponse } from 'next/server';
import Order from '@/utils/models/Order';
import Product from '@/utils/models/Product';
import { dbConnect } from '@/lib/db';
import { serializeOrders } from '@/utils/types/types';

export async function GET(req: Request, context: { params: Promise<{ userId: string }> }) {
	await dbConnect();
	const { userId } = await context.params;
	console.log(userId);
	if (!userId) {
		return NextResponse.json({ message: 'No Users' }, { status: 404 });
	}
	try {
		const orders = await Order.find({ userId: userId }).populate({ path: 'items.productId', model: Product });
		if (!orders) {
			return NextResponse.json({ message: 'Order not found' }, { status: 404 });
		}
		return NextResponse.json(serializeOrders(orders));
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
