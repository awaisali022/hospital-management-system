import { Schema, model } from 'mongoose';

const prescriptionSchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
    medications: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
        instructions: String
      }
    ],
    instructions: String,
    validUntil: Date,
    pdfUrl: String,
    qrCode: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

prescriptionSchema.pre(['updateOne', 'findOneAndUpdate', 'deleteOne', 'findOneAndDelete'], function immutable(next) {
  next(new Error('Prescriptions are immutable and append-only.'));
});

export const PrescriptionModel = model('Prescription', prescriptionSchema);
