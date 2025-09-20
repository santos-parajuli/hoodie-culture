/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import Product from '@/utils/models/Product';
import { dbConnect } from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { serializeProduct } from '@/utils/types/types';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
	const token = await getToken({ req, secret: process.env.AUTH_SECRET });
	if (!token || token.role !== 'admin') {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	await dbConnect();
	const { id } = await context.params;
	try {
		const product = await Product.findById(id).populate('categoryIds');
		if (!product) {
			return NextResponse.json({ message: 'Product not found' }, { status: 404 });
		}
		return NextResponse.json(serializeProduct(product));
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
		const { title, slug, description, price, compareAtCents, categoryIds, images, variants, aboutItem } = await req.json();
		if (!title || !slug || price == null) {
			return NextResponse.json({ message: 'Title, slug, and price are required' }, { status: 400 });
		}
		// Ensure slug is unique
		const existingProduct = await Product.findOne({ slug, _id: { $ne: id } });
		if (existingProduct) {
			return NextResponse.json({ message: 'Slug must be unique' }, { status: 400 });
		}
		const stock = variants?.reduce((sum: number, v: any) => sum + v.sizes.reduce((s: number, size: any) => s + (size.stock || 0), 0), 0) ?? 0;
		const updatedProduct = await Product.findByIdAndUpdate(
			id,
			{
				title,
				slug,
				description,
				priceCents: Math.round(price * 100),
				compareAtCents: compareAtCents ?? null,
				categoryIds: categoryIds || [],
				images: images || [],
				variants: variants || [],
				stock: stock,
				aboutItem: aboutItem || [],
			},
			{ new: true }
		);
		if (!updatedProduct) {
			return NextResponse.json({ message: 'Product not found' }, { status: 404 });
		}
		return NextResponse.json(serializeProduct(updatedProduct));
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
		const productToDelete = await Product.findById(id);
		if (!productToDelete) {
			return NextResponse.json({ message: 'Product not found' }, { status: 404 });
		}
		// Collect public_ids from images
		const publicIds = [...productToDelete.images.map((img: any) => img.public_id).filter(Boolean), ...productToDelete.variants.map((v: any) => v.image?.public_id).filter(Boolean)];

		if (publicIds.length > 0) {
			const cloudinaryDeleteRes = await fetch(`${req.nextUrl.origin}/api/cloudinary/delete`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(publicIds.length === 1 ? { public_id: publicIds[0] } : { public_ids: publicIds }),
				credentials: 'include',
			});
			if (!cloudinaryDeleteRes.ok) {
				console.error('Failed to delete images from Cloudinary', await cloudinaryDeleteRes.json());
			}
		}

		const deletedProduct = await Product.findByIdAndDelete(id);
		if (!deletedProduct) {
			return NextResponse.json({ message: 'Product not found after deletion attempt' }, { status: 404 });
		}

		return NextResponse.json({ message: 'Product and associated images deleted successfully' });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
