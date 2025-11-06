import mongoose, { Schema, type Model, Types } from 'mongoose';

export interface IWishlistItem {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  createdAt: Date;
}

const WishlistItemSchema = new Schema<IWishlistItem>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
    productId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'Product' },
  },
  { timestamps: { createdAt: true, updatedAt: false }, collection: 'wishlist_items' }
);

WishlistItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const WishlistItem: Model<IWishlistItem> = mongoose.models.WishlistItem || mongoose.model<IWishlistItem>('WishlistItem', WishlistItemSchema);


