import mongoose, { Schema, type Model } from 'mongoose';

export interface ICategory {
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, index: true },
    description: { type: String },
  },
  { timestamps: true, collection: 'categories' }
);

export const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);



