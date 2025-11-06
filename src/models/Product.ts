import mongoose, { Schema, type Model, Types } from 'mongoose';

export interface IProduct {
  name: string;
  description?: string | null;
  price: number;
  discount?: number | null;
  sku?: string | null;
  stock: number;
  featureImage?: string | null;
  images?: string[] | null;
  material?: string | null;
  color?: string | null;
  specialFeature?: string | null;
  style?: string | null;
  isActive: boolean;
  categoryId: Types.ObjectId;
  averageRating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    discount: { type: Number },
    sku: { type: String, unique: true, sparse: true },
    stock: { type: Number, default: 0 },
    featureImage: { type: String },
    images: [{ type: String }],
    material: { type: String },
    color: { type: String },
    specialFeature: { type: String },
    style: { type: String },
    isActive: { type: Boolean, default: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'products' }
);

export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);



