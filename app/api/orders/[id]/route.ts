import { NextResponse } from 'next/server';
import Order from '@/utils/models/Order';
import Product from '@/utils/models/Product';
import { dbConnect } from '@/lib/db';
import { serializeOrder } from '@/utils/types/types';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
	await dbConnect();
	const { id } = await context.params;

	try {
		const orders = await Order.findOne({ _id: id }).populate({ path: 'items.productId', model: Product });
		if (!orders) {
			return NextResponse.json({ message: 'Order not found' }, { status: 404 });
		}
		return NextResponse.json(serializeOrder(orders));
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
