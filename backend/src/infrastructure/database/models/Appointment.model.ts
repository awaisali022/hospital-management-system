import { Schema, model } from 'mongoose';

export const appointmentStatuses = [
  'pending_payment',
  'payment_submitted',
  'payment_verified',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled'
] as const;

const appointmentSchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
    clinicId: { type: Schema.Types.ObjectId, ref: 'Clinic' },
    scheduleId: { type: Schema.Types.ObjectId, ref: 'Schedule' },
    appointmentDate: { type: Date, required: true, index: true },
    type: { type: String, enum: ['clinic', 'video', 'home'], required: true },
    status: { type: String, enum: appointmentStatuses, default: 'pending_payment', index: true },
    chiefComplaint: { type: String, required: true },
    paymentVerifiedAt: Date,
    assistantConfirmedAt: Date,
    cancelledAt: Date,
    cancellationReason: String
  },
  { timestamps: true }
);

appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });
appointmentSchema.index({ patientId: 1, createdAt: -1 });

export const AppointmentModel = model('Appointment', appointmentSchema);
