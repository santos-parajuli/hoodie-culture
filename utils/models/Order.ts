import { Schema, model, models } from 'mongoose';

const orderSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		items: [
			{
				productId: { type: Schema.Types.ObjectId, ref: 'Product' },
				variantId: String,
				qty: Number,
				price: Number,
				name: String,
				image: String,
			},
		],
		status: {
			type: String,
			enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'],
			default: 'pending',
		},
		total: Number,
		shippingAddress: {
			line1: String,
			line2: String,
			city: String,
			state: String,
			postalCode: String,
			country: String,
		},
	},
	{ timestamps: { createdAt: true, updatedAt: true } }
);

export default models.Order || model('Order', orderSchema);
