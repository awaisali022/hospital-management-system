import { Schema, model } from 'mongoose';

const doctorSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    pmcNumber: { type: String, required: true, unique: true },
    specializations: [{ type: String, index: true }],
    treatmentTypes: [String],
    experienceYears: { type: Number, min: 0, default: 0 },
    consultationFee: { type: Number, min: 0, required: true },
    city: { type: String, required: true, index: true },
    bio: String,
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

doctorSchema.index({ specializations: 1, city: 1, isVerified: 1 });
doctorSchema.index({ bio: 'text', specializations: 'text', treatmentTypes: 'text' });

export const DoctorModel = model('Doctor', doctorSchema);
