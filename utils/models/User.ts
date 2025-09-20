import { Schema, model, models } from 'mongoose';

const userSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		role: { type: String, enum: ['user', 'admin'], default: 'user' },
		passwordHash: { type: String, required: true },
		passwordResetToken: { type: String },
		passwordResetExpires: { type: Date },
		addresses: [
			{
				line1: String,
				line2: String,
				city: String,
				state: String,
				postalCode: String,
				country: String,
			},
		],
		orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
	},
	{ timestamps: true }
);

export default models.User || model('User', userSchema);
