import mongoose, { Schema, type Model, Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  id?: string; // virtual string id derived from _id
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  verificationToken?: string | null;
  verifiedAt?: Date | null;
  resetOtp?: string | null;
  resetOtpExpiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    isActive: { type: Boolean, default: true },
    verificationToken: { type: String, default: null },
    verifiedAt: { type: Date, default: null },
    resetOtp: { type: String, default: null },
    resetOtpExpiresAt: { type: Date, default: null },
  },
  { timestamps: true, collection: 'users', toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Expose a virtual string id for convenience
UserSchema.virtual('id').get(function (this: { _id: Types.ObjectId }) {
  return this._id?.toString();
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);



