import mongoose, { Schema, type Model, Types } from 'mongoose';

export type CustomRequestStatus = 'PENDING' | 'CONTACTED' | 'QUOTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface ICustomFurnitureRequest {
  userId?: Types.ObjectId | null;
  name: string;
  email: string;
  phone: string;
  furnitureType: string;
  roomType?: string | null;
  dimensions?: string | null;
  material?: string | null;
  color?: string | null;
  style?: string | null;
  requirements?: string | null;
  budget?: number | null;
  timeline?: string | null;
  status: CustomRequestStatus;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const CustomFurnitureRequestSchema = new Schema<ICustomFurnitureRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    furnitureType: { type: String, required: true },
    roomType: { type: String },
    dimensions: { type: String },
    material: { type: String },
    color: { type: String },
    style: { type: String },
    requirements: { type: String },
    budget: { type: Number },
    timeline: { type: String },
    status: { type: String, enum: ['PENDING','CONTACTED','QUOTED','IN_PROGRESS','COMPLETED','CANCELLED'], default: 'PENDING' },
    notes: { type: String },
  },
  { timestamps: true, collection: 'custom_furniture_requests' }
);

export const CustomFurnitureRequest: Model<ICustomFurnitureRequest> = mongoose.models.CustomFurnitureRequest || mongoose.model<ICustomFurnitureRequest>('CustomFurnitureRequest', CustomFurnitureRequestSchema);



