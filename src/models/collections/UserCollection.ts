import { Schema } from 'mongoose';
import mongoose from 'mongoose';

const userSchema = new Schema(
	{
		userName: {
			type: String,
			require: true,
		},
		email: {
			type: String,
			require: true,
		},
	},
	{ timestamps: true }
);

let User: mongoose.Model<
	{
		createdAt: NativeDate;
		updatedAt: NativeDate;
	} & {
		userName?: string;
		email?: string;
	}
>;

if (mongoose.modelNames().includes('User')) {
	User = mongoose.model('User');
} else {
	User = mongoose.model('User', userSchema);
}

export default User;
