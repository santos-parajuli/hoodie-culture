import { NextResponse } from 'next/server';
import Product from '@/utils/models/Product';
import Category from '@/utils/models/Category';
import { serializeProducts, type ProductInterface } from '@/utils/types/types';
import type { SortOrder } from 'mongoose';
import { dbConnect } from '@/lib/db';
export async function GET(req: Request) {
	await dbConnect();
	try {
		const url = new URL(req.url);
		const limit = parseInt(url.searchParams.get('limit') || '10', 10);
		const skip = parseInt(url.searchParams.get('skip') || '0', 10);
		const sort = url.searchParams.get('sort') || 'latest';
		const categoryId = url.searchParams.get('categoryId');
		const search = url.searchParams.get('search');
		const minPrice = parseFloat(url.searchParams.get('minPrice') || '0');
		const maxPrice = parseFloat(url.searchParams.get('maxPrice') || '0');
		const minRating = parseFloat(url.searchParams.get('minRating') || '0');
		const tags = url.searchParams.get('tags'); // comma separated
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const query: any = {};
		if (categoryId && categoryId !== 'all') query.categoryIds = categoryId;
		if (search) {
			const words = search.split(/\s+/).filter(Boolean);
			query.$and = words.map((word) => ({
				title: new RegExp(word, 'i'),
			}));
		}

		if (!isNaN(minPrice) || !isNaN(maxPrice)) {
			query.price = {};
			if (!isNaN(minPrice)) query.price.$gte = minPrice;
			if (!isNaN(maxPrice) && maxPrice > 0) query.price.$lte = maxPrice;
		}
		if (!isNaN(minRating) && minRating > 0) {
			query.rating = { $gte: minRating };
		}
		if (tags) {
			const tagArray = tags.split(',').map((t) => t.trim());
			query.tags = { $in: tagArray };
		}
		// Sort
		const sortOption: Record<string, SortOrder> = {};
		if (sort === 'latest') sortOption.createdAt = -1;
		else if (sort === 'popular') sortOption.rating = -1; // example field
		else if (sort === 'rating') sortOption.rating = -1;
		else sortOption.createdAt = -1;
		const products = await Product.find(query).sort(sortOption).skip(skip).limit(limit).populate({ path: 'categoryIds', model: Category });
		const totalProducts = await Product.countDocuments(query);
		const serialized: ProductInterface[] = serializeProducts(products);
		return NextResponse.json({ products: serialized, total: totalProducts });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
