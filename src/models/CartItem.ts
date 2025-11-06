import mongoose, { Schema, type Model, Types } from 'mongoose';

export interface ICartItem {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  productName: string;
  productImage?: string | null;
  price: number;
  discount?: number | null;
  stock: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    productName: { type: String, required: true },
    productImage: { type: String },
    price: { type: Number, required: true },
    discount: { type: Number },
    stock: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
  },
  { timestamps: true, collection: 'cart_items' }
);

CartItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const CartItem: Model<ICartItem> = mongoose.models.CartItem || mongoose.model<ICartItem>('CartItem', CartItemSchema);


