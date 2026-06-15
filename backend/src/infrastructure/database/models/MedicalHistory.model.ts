import { Schema, model } from 'mongoose';

const medicalHistorySchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
    diagnosis: { type: String, required: true },
    symptoms: [String],
    treatmentPlan: { type: String, required: true },
    vitals: {
      bloodPressure: String,
      pulse: Number,
      temperature: Number,
      oxygenSaturation: Number
    },
    attachments: [String],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

medicalHistorySchema.pre(['updateOne', 'findOneAndUpdate', 'deleteOne', 'findOneAndDelete'], function immutable(next) {
  next(new Error('Medical history is immutable and append-only.'));
});

export const MedicalHistoryModel = model('MedicalHistory', medicalHistorySchema);
