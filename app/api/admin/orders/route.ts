import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import Order from '@/utils/models/Order';
import { dbConnect } from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { serializeOrders } from '@/utils/types/types';

export async function GET(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.AUTH_SECRET });

	if (!token || token.role !== 'admin') {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	await dbConnect();

	try {
		const orders = await Order.find({}).populate('userId', 'name email').populate('items.productId');
		console.log(orders[0].items);
		return NextResponse.json(serializeOrders(orders));
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
