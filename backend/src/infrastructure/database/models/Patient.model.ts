import { Schema, model } from 'mongoose';

const patientSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    dateOfBirth: Date,
    gender: String,
    bloodGroup: String,
    allergies: [String],
    chronicConditions: [String],
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },
  { timestamps: true }
);

export const PatientModel = model('Patient', patientSchema);
