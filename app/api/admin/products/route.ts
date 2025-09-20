import { serializeProduct, serializeProducts } from '@/utils/types/types';

import Category from '@/utils/models/Category';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import Product from '@/utils/models/Product';
import { dbConnect } from '@/lib/db';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.AUTH_SECRET });
	if (!token || token.role !== 'admin') {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	await dbConnect();
	try {
		const products = await Product.find({}).populate({ path: 'categoryIds', model: Category });
		return NextResponse.json(serializeProducts(products));
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
		const { title, slug, description, price, active, categoryIds, images, variants, aboutItem } = await req.json();
		if (!title || !slug || typeof price !== 'number') {
			return NextResponse.json({ message: 'Title, slug, and price are required' }, { status: 400 });
		}
		// calculate stock from variants
		const stock = variants?.reduce((sum: number, v: any) => sum + v.sizes.reduce((s: number, size: any) => s + (size.stock || 0), 0), 0) ?? 0;
		// ensure slug is unique
		const existingProduct = await Product.findOne({ slug });
		if (existingProduct) {
			return NextResponse.json({ message: 'Slug must be unique' }, { status: 400 });
		}
		const newProduct = new Product({
			title,
			slug,
			description,
			price,
			active: active ?? true,
			categoryIds: categoryIds || null,
			images: images || [],
			variants: variants || [],
			stock,
			aboutItem: aboutItem || [],
		});
		await newProduct.save();
		return NextResponse.json(serializeProduct(newProduct), { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
