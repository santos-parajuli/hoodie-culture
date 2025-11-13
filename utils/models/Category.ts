import { Schema, model, models } from 'mongoose';

import type { DbCategory } from '../types/types';

const imageSchema = new Schema(
	{
		url: { type: String, required: true },
		alt: { type: String },
		public_id: { type: String },
	},
	{ _id: false } // don’t create separate _id for image object
);

const categorySchema = new Schema<DbCategory>({
	name: { type: String, required: true },
	slug: { type: String, required: true },
	parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
	image: imageSchema,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

const Category = models.Category || model<DbCategory>('Category', categorySchema);
export default Category;
