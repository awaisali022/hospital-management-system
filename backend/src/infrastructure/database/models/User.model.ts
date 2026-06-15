import { Schema, model, type InferSchemaType } from 'mongoose';
import { roles } from '../../../domain/entities/roles.js';

const userSchema = new Schema(
  {
    supabaseId: { type: String, index: true, unique: true, sparse: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    role: { type: String, enum: roles, required: true, index: true },
    passwordHash: { type: String, select: false },
    avatarUrl: String,
    phone: String,
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof userSchema>;
export const UserModel = model('User', userSchema);
