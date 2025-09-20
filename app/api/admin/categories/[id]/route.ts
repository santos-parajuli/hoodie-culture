import Category from '@/utils/models/Category';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { serializeCategory } from '@/utils/types/types';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
	const token = await getToken({ req, secret: process.env.AUTH_SECRET });

	if (!token || token.role !== 'admin') {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	await dbConnect();
	const { id } = await context.params;

	try {
		const category = await Category.findById(id).populate('parentId');
		if (!category) {
			return NextResponse.json({ message: 'Category not found' }, { status: 404 });
		}
		return NextResponse.json(serializeCategory(category));
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
		const { name, slug, parentId, image } = await req.json();
		if (!name || !slug) {
			return NextResponse.json({ message: 'Name and slug are required' }, { status: 400 });
		}
		const existingCategory = await Category.findOne({ slug, _id: { $ne: id } });
		if (existingCategory) {
			return NextResponse.json({ message: 'Slug must be unique' }, { status: 400 });
		}
		const updatedCategory = await Category.findByIdAndUpdate(id, { name, slug, parentId: parentId || null, image }, { new: true });
		if (!updatedCategory) {
			return NextResponse.json({ message: 'Category not found' }, { status: 404 });
		}
		return NextResponse.json(updatedCategory);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
	const token = await getToken({ req, secret: process.env.AUTH_SECRET });
	if (!token || token.role !== 'admin') {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	await dbConnect();
	const { id } = await context.params;

	try {
		const categoryToDelete = await Category.findById(id);
		if (!categoryToDelete) {
			return NextResponse.json({ message: 'Category not found' }, { status: 404 });
		}
		// If category has an image, delete from Cloudinary
		if (categoryToDelete.image?.public_id) {
			const cloudinaryDeleteRes = await fetch(`${req.nextUrl.origin}/api/cloudinary/delete`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ public_id: categoryToDelete.image.public_id }),
				credentials: 'include',
			});
			if (!cloudinaryDeleteRes.ok) {
				console.error('Failed to delete category image from Cloudinary', await cloudinaryDeleteRes.json());
			}
		}
		const deletedCategory = await Category.findByIdAndDelete(id);
		if (!deletedCategory) {
			return NextResponse.json({ message: 'Category not found after deletion attempt' }, { status: 404 });
		}
		return NextResponse.json({ message: 'Category and associated image deleted successfully' });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
