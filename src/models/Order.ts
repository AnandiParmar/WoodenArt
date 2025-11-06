import mongoose, { Schema, type Model, Types } from 'mongoose';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface IOrderItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder {
  userId: Types.ObjectId;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingPhone: string;
  paymentMethod?: string | null;
  paymentStatus: PaymentStatus;
  notes?: string | null;
  items: IOrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderNumber: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED'], default: 'PENDING' },
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    shippingCity: { type: String, required: true },
    shippingState: { type: String, required: true },
    shippingZipCode: { type: String, required: true },
    shippingPhone: { type: String, required: true },
    paymentMethod: { type: String },
    paymentStatus: { type: String, enum: ['PENDING','PAID','FAILED','REFUNDED'], default: 'PENDING' },
    notes: { type: String },
    items: { type: [OrderItemSchema], required: true, default: [] },
  },
  { timestamps: true, collection: 'orders' }
);

export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);


