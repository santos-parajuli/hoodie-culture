import { NextResponse } from 'next/server';
import Product from '@/utils/models/Product';
import { dbConnect } from '@/lib/db';
import { serializeProduct } from '@/utils/types/types';

export async function GET(req: Request, context: { params: Promise<{ slug: string }> }) {
	await dbConnect();
	const { slug } = await context.params;
	console.log(slug);
	try {
		const product = await Product.findOne({ slug }).populate('categoryIds', 'name');
		if (!product) {
			return NextResponse.json({ message: 'Product not found' }, { status: 404 });
		}
		return NextResponse.json(serializeProduct(product));
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
