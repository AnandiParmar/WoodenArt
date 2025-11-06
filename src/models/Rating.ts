import mongoose, { Schema, type Model, Types } from 'mongoose';

export interface IRating {
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number; // 1-5
  review?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String },
  },
  { timestamps: true, collection: 'ratings' }
);

RatingSchema.index({ productId: 1, userId: 1 }, { unique: true });

export const Rating: Model<IRating> = mongoose.models.Rating || mongoose.model<IRating>('Rating', RatingSchema);



