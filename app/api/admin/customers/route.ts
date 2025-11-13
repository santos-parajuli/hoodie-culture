import { NextRequest, NextResponse } from 'next/server';

import Order from '@/utils/models/Order';
import User from '@/utils/models/User';
import { dbConnect } from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { serializeUser } from '@/utils/types/types';

export async function GET(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.AUTH_SECRET });
	if (!token || token.role !== 'admin') {
		return NextResponse.json({ message: 'Unauthorized from customer route' }, { status: 401 });
	}
	await dbConnect();
	try {
		const users = await User.find();
		const customerData = await Promise.all(
			users.map(async (user) => {
				const orderCount = await Order.countDocuments({ userId: user._id });
				return {
					...serializeUser(user),
					orderCount,
				};
			})
		);
		return NextResponse.json(customerData);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
