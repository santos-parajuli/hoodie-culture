import Category from '@/utils/models/Category';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { serializeCategories } from '@/utils/types/types';

export async function GET() {
	await dbConnect();
	try {
		const categories = await Category.find({}).populate('parentId');
		return NextResponse.json(serializeCategories(categories));
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
