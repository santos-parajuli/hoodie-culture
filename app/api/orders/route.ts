import { NextResponse } from 'next/server';
import Order from '@/utils/models/Order';
import Product from '@/utils/models/Product';
import { dbConnect } from '@/lib/db';
import mongoose from 'mongoose';
import { serializeOrder } from '@/utils/types/types';

export async function POST(req: Request) {
	await dbConnect();
	try {
		const { items, shippingAddress, userId, total } = await req.json();
		console.log(userId);
		if (!items || items.length === 0 || !shippingAddress) {
			return NextResponse.json({ message: 'Missing order details' }, { status: 400 });
		}
		const session = await mongoose.startSession();
		session.startTransaction();
		try {
			const orderItems = [];
			for (const item of items) {
				const product = await Product.findById(item.productId.id).session(session);
				if (!product) {
					throw new Error(`Product with ID ${item.productId.id} not found`);
				}
				const priceToUse = product.price;
				if (item.variantId) {
					const variant = product.variants.find((c: { colorName: unknown }) => c.colorName === item.variantId);
					if (!variant) {
						throw new Error(`Variant with ID ${item.variantId} not found for product ${item.productId.id}`);
					}
					console.log(variant.stock);
					if (variant.stock < item.qty) {
						throw new Error(`Insufficient stock for variant ${variant.name} of product ${product.title}`);
					}
					// Atomically reduce variant stock
					await Product.updateOne({ _id: item.productId.id, 'variants._id': item.variantId.id }, { $inc: { 'variants.$.stock': -item.qty } }, { session });
				} else {
					if (product.stock < item.qty) {
						throw new Error(`Insufficient stock for product ${product.title}`);
					}
					// Atomically reduce product inventory stock
					await Product.updateOne({ _id: item.productId.id }, { $inc: { 'inventory.stock': -item.qty } }, { session });
				}
				orderItems.push({
					productId: item.productId.id,
					variantId: item.variantId,
					qty: item.qty,
					price: priceToUse,
					name: item.name,
					image: item.image,
				});
			}
			const newOrder = new Order({
				userId,
				items: orderItems,
				total,
				shippingAddress,
				status: 'pending',
			});
			await newOrder.save({ session });
			await session.commitTransaction();
			session.endSession();
			return NextResponse.json(serializeOrder(newOrder), { status: 201 });
		} catch (transactionError: unknown) {
			await session.abortTransaction();
			session.endSession();
			console.error('Transaction aborted:', transactionError);
			return NextResponse.json({ message: transactionError || 'Failed to create order due to stock issues' }, { status: 400 });
		}
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
