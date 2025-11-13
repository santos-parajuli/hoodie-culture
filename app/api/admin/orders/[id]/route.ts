import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import Order from '@/utils/models/Order';
import { dbConnect } from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { serializeOrder } from '@/utils/types/types';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
	const token = await getToken({ req, secret: process.env.AUTH_SECRET });
	if (!token || token.role !== 'admin') {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	await dbConnect();
	const { id } = await context.params;
	try {
		const order = await Order.findById(id).populate('userId').populate('items.productId');
		if (!order) {
			return NextResponse.json({ message: 'Order not found' }, { status: 404 });
		}
		return NextResponse.json(serializeOrder(order));
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
	const token = await getToken({ req, secret: process.env.AUTH_SECRET });
	if (!token || token.role !== 'admin') {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	await dbConnect();
	const { id } = await context.params;
	try {
		const { status } = await req.json();
		if (!status) {
			return NextResponse.json({ message: 'Status is required' }, { status: 400 });
		}
		const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
		if (!updatedOrder) {
			return NextResponse.json({ message: 'Order not found' }, { status: 404 });
		}
		return NextResponse.json(updatedOrder);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
