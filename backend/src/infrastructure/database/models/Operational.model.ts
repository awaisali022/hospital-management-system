import { Schema, model } from 'mongoose';

export const PaymentModel = model(
  'Payment',
  new Schema(
    {
      appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true, index: true },
      patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
      amount: { type: Number, required: true, min: 0 },
      method: { type: String, enum: ['bank_transfer', 'card', 'cash', 'wallet'], required: true },
      status: { type: String, enum: ['pending', 'submitted', 'verified', 'rejected'], default: 'pending' },
      proofImageUrl: String,
      verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      verifiedAt: Date
    },
    { timestamps: true }
  )
);

export const NotificationModel = model(
  'Notification',
  new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
      type: { type: String, required: true },
      title: { type: String, required: true },
      body: { type: String, required: true },
      isRead: { type: Boolean, default: false },
      metadata: Schema.Types.Mixed
    },
    { timestamps: true }
  )
);

export const AuditLogModel = model(
  'AuditLog',
  new Schema(
    {
      actorId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
      action: { type: String, required: true, index: true },
      resource: { type: String, required: true },
      resourceId: String,
      ipAddress: String,
      userAgent: String,
      metadata: Schema.Types.Mixed
    },
    { timestamps: true }
  )
);

export const AiHistoryModel = model(
  'AiHistory',
  new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
      feature: { type: String, required: true },
      prompt: { type: String, required: true },
      response: { type: Schema.Types.Mixed, required: true },
      disclaimerAccepted: { type: Boolean, default: false }
    },
    { timestamps: true }
  )
);
