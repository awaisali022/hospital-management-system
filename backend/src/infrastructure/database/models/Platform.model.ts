import { Schema, model } from 'mongoose';

export const RoleModel = model(
  'Role',
  new Schema(
    {
      name: { type: String, required: true, unique: true },
      permissions: [{ type: String, required: true }],
      description: String
    },
    { timestamps: true }
  )
);

export const PermissionModel = model(
  'Permission',
  new Schema(
    {
      key: { type: String, required: true, unique: true },
      description: String,
      module: { type: String, required: true }
    },
    { timestamps: true }
  )
);

export const AssistantModel = model(
  'Assistant',
  new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
      assignedDoctorIds: [{ type: Schema.Types.ObjectId, ref: 'Doctor' }],
      clinicIds: [{ type: Schema.Types.ObjectId, ref: 'Clinic' }]
    },
    { timestamps: true }
  )
);

export const AdminModel = model(
  'Admin',
  new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
      department: String,
      scopes: [String]
    },
    { timestamps: true }
  )
);

export const ClinicModel = model(
  'Clinic',
  new Schema(
    {
      doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
      name: { type: String, required: true },
      city: { type: String, required: true, index: true },
      address: { type: String, required: true },
      phone: String,
      geo: {
        lat: Number,
        lng: Number
      }
    },
    { timestamps: true }
  )
);

export const ScheduleModel = model(
  'Schedule',
  new Schema(
    {
      doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
      clinicId: { type: Schema.Types.ObjectId, ref: 'Clinic' },
      dayOfWeek: { type: Number, min: 0, max: 6, required: true },
      startsAt: { type: String, required: true },
      endsAt: { type: String, required: true },
      slotMinutes: { type: Number, default: 20 },
      isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
  )
);

export const ReportModel = model(
  'Report',
  new Schema(
    {
      patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
      uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      title: { type: String, required: true },
      fileUrl: { type: String, required: true },
      fileType: { type: String, required: true },
      aiSummary: Schema.Types.Mixed
    },
    { timestamps: true }
  )
);

export const TransactionModel = model(
  'Transaction',
  new Schema(
    {
      paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', required: true, index: true },
      provider: String,
      providerReference: String,
      amount: { type: Number, required: true },
      currency: { type: String, default: 'PKR' },
      status: { type: String, required: true }
    },
    { timestamps: true }
  )
);

export const ChatModel = model(
  'Chat',
  new Schema(
    {
      participantIds: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
      appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment' },
      lastMessageAt: Date
    },
    { timestamps: true }
  )
);

export const MessageModel = model(
  'Message',
  new Schema(
    {
      chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true, index: true },
      senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      content: { type: String, required: true },
      type: { type: String, enum: ['text', 'file', 'system'], default: 'text' },
      readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    },
    { timestamps: true }
  )
);

export const VideoSessionModel = model(
  'VideoSession',
  new Schema(
    {
      appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true, index: true },
      doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
      patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
      roomId: { type: String, required: true, unique: true },
      status: { type: String, enum: ['waiting', 'active', 'ended', 'missed'], default: 'waiting' },
      startedAt: Date,
      endedAt: Date,
      durationSeconds: Number
    },
    { timestamps: true }
  )
);

export const AnalyticsModel = model(
  'Analytics',
  new Schema(
    {
      scope: { type: String, enum: ['platform', 'doctor', 'patient'], required: true, index: true },
      scopeId: String,
      metric: { type: String, required: true },
      value: Schema.Types.Mixed,
      period: { type: String, required: true }
    },
    { timestamps: true }
  )
);

export const SystemSettingModel = model(
  'SystemSetting',
  new Schema(
    {
      key: { type: String, required: true, unique: true },
      value: Schema.Types.Mixed,
      isSecret: { type: Boolean, default: false },
      updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
  )
);
