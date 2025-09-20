import { NextResponse } from 'next/server';
import User from '@/utils/models/User';
import bcrypt from 'bcrypt';
import { dbConnect } from '@/lib/db';

export async function POST(req: Request) {
	try {
		const { name, email, password } = await req.json();
		if (!name || !email || !password) {
			return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
		}
		await dbConnect();
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
		}
		const passwordHash = await bcrypt.hash(password, 10);
		const newUser = new User({
			name,
			email,
			passwordHash,
		});
		await newUser.save();
		return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
