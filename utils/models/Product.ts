import { Schema, model, models } from 'mongoose';

const imageSchema = new Schema({
	url: { type: String, required: true },
	public_id: { type: String },
	alt: String,
});

const sizeSchema = new Schema({
	label: { type: String, required: true },
	stock: { type: Number, required: true, default: 10 },
});

const variantSchema = new Schema({
	colorName: { type: String, required: true },
	image: imageSchema,
	sizes: [sizeSchema],
});

const productSchema = new Schema(
	{
		title: { type: String, required: true },
		slug: { type: String, required: true, unique: true },
		description: String,
		price: { type: Number, required: true },
		categoryIds: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
		images: [imageSchema],
		variants: [variantSchema],
		stock: { type: Number, default: 100 },
		rating: { type: Number, default: 5 },
		aboutItem: [String],
	},
	{ timestamps: true }
);

export default models.Product || model('Product', productSchema);
