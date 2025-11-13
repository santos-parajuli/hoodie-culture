import { NextRequest, NextResponse } from 'next/server';

import User from '@/utils/models/User';
import { dbConnect } from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { serializeUser } from '@/utils/types/types';

export async function PUT(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.AUTH_SECRET });
	if (!token || !token.id) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	await dbConnect();
	try {
		const { name, image } = await req.json();
		console.log('Request Body:', { name, image });
		const updateData: { name?: string; image?: string } = {};
		if (name) {
			updateData.name = name;
		}
		if (image) {
			updateData.image = image;
		}
		if (Object.keys(updateData).length === 0) {
			return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
		}
		const updatedUser = await User.findByIdAndUpdate(token.id, { $set: updateData }, { new: true });
		if (!updatedUser) {
			return NextResponse.json({ message: 'User not found' }, { status: 404 });
		}
		return NextResponse.json(serializeUser(updatedUser));
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
