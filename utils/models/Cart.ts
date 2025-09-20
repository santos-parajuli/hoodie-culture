import { Schema, model, models } from 'mongoose';

const cartSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		items: [
			{
				productId: { type: Schema.Types.ObjectId, ref: 'Product' },
				variantId: String,
				qty: Number,
			},
		],
	},
	{ timestamps: true }
);

export default models.Cart || model('Cart', cartSchema);
