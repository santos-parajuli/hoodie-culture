import Category from '@/utils/models/Category';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { serializeCategories } from '@/utils/types/types';

export async function GET(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.AUTH_SECRET });
	if (!token || token.role !== 'admin') {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	await dbConnect();
	try {
		const categories = await Category.find({}).populate('parentId');
		return NextResponse.json(serializeCategories(categories));
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
export async function POST(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.AUTH_SECRET });
	if (!token || token.role !== 'admin') {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	await dbConnect();
	try {
		const { name, slug, parentId, image } = await req.json(); // ✅ include image
		if (!name || !slug) {
			return NextResponse.json({ message: 'Name and slug are required' }, { status: 400 });
		}
		const existingCategory = await Category.findOne({ slug });
		if (existingCategory) {
			return NextResponse.json({ message: 'Slug must be unique' }, { status: 400 });
		}
		const newCategory = new Category({
			name,
			slug,
			parentId: parentId || null,
			image: image || null,
		});
		await newCategory.save();
		return NextResponse.json(newCategory, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
