import { NextResponse } from 'next/server';
import Order from '@/utils/models/Order';
import { dbConnect } from '@/lib/db';
import { serializeOrder } from '@/utils/types/types';

export async function GET(req: Request, context: { params: Promise<{ slug: string }> }) {
	console.log('insisde here');
	await dbConnect();
	const { slug } = await context.params;
	console.log(slug);
	try {
		const order = await Order.findOne({ _id: slug }).populate('items.productId');
		if (!order) {
			return NextResponse.json({ message: 'Order not found' }, { status: 404 });
		}
		return NextResponse.json(serializeOrder(order));
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
