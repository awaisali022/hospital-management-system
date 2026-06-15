import { z } from 'zod';
import { AppointmentService } from '../../../application/services/AppointmentService.js';
import { AppointmentModel } from '../../../infrastructure/database/models/Appointment.model.js';
import { PatientModel } from '../../../infrastructure/database/models/Patient.model.js';
import { DoctorModel } from '../../../infrastructure/database/models/Doctor.model.js';
import { PaymentModel } from '../../../infrastructure/database/models/Operational.model.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { AppError } from '../../../shared/errors/AppError.js';

const service = new AppointmentService();

export const bookAppointmentSchema = z.object({
  body: z.object({
    patientId: z.string().optional(), // optional if user is patient (will resolve from profile)
    doctorId: z.string(),
    appointmentDate: z.coerce.date(),
    type: z.enum(['clinic', 'video', 'home']),
    chiefComplaint: z.string().min(3)
  })
});

export class AppointmentController {
  book = asyncHandler(async (req, res) => {
    let patientId = req.body.patientId;
    if (req.user!.role === 'patient') {
      const patient = await PatientModel.findOne({ userId: req.user!.id });
      if (!patient) throw new AppError(404, 'Patient profile not found.', 'PATIENT_NOT_FOUND');
      patientId = patient._id.toString();
    }

    if (!patientId) throw new AppError(400, 'Patient ID is required.', 'PATIENT_REQUIRED');

    const appointment = await service.book({ 
      ...req.body, 
      patientId, 
      actorId: req.user!.id 
    });
    res.status(201).json({ success: true, data: appointment });
  });

  list = asyncHandler(async (req, res) => {
    let query: Record<string, any> = {};

    if (req.user!.role === 'patient') {
      const patient = await PatientModel.findOne({ userId: req.user!.id });
      if (!patient) return res.json({ success: true, data: [] });
      query.patientId = patient._id;
    } else if (req.user!.role === 'doctor') {
      const doctor = await DoctorModel.findOne({ userId: req.user!.id });
      if (!doctor) return res.json({ success: true, data: [] });
      query.doctorId = doctor._id;
    }

    const appointments = await AppointmentModel.find(query)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName email phone avatarUrl' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName email specializations pmcNumber' }
      })
      .populate('clinicId')
      .sort({ appointmentDate: -1 })
      .lean();

    res.json({ success: true, data: appointments });
  });

  getById = asyncHandler(async (req, res) => {
    const appointment = await AppointmentModel.findById(req.params.id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName email phone' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName' }
      })
      .populate('clinicId')
      .lean();

    if (!appointment) throw new AppError(404, 'Appointment not found.', 'APPOINTMENT_NOT_FOUND');
    res.json({ success: true, data: appointment });
  });

  uploadPaymentProof = asyncHandler(async (req, res) => {
    const { appointmentId, amount, method, proofImageUrl } = req.body;
    
    const patient = await PatientModel.findOne({ userId: req.user!.id });
    if (!patient) throw new AppError(404, 'Patient profile not found.', 'PATIENT_NOT_FOUND');

    const payment = await service.uploadPaymentProof({
      appointmentId,
      patientId: patient._id.toString(),
      amount: Number(amount),
      method,
      proofImageUrl,
      actorId: req.user!.id
    });

    res.status(201).json({ success: true, data: payment });
  });

  listPayments = asyncHandler(async (req, res) => {
    // Audit queues for assistants/admins
    const payments = await PaymentModel.find()
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName' }
      })
      .populate({
        path: 'appointmentId',
        populate: {
          path: 'doctorId',
          populate: { path: 'userId', select: 'firstName lastName' }
        }
      })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: payments });
  });

  verifyPayment = asyncHandler(async (req, res) => {
    const payment = await service.verifyPayment({ 
      paymentId: String(req.params.paymentId), 
      assistantId: req.user!.id 
    });
    res.json({ success: true, data: payment });
  });

  rejectPayment = asyncHandler(async (req, res) => {
    const payment = await service.rejectPayment({
      paymentId: String(req.params.paymentId),
      assistantId: req.user!.id,
      reason: req.body.reason || 'Invalid transaction receipt'
    });
    res.json({ success: true, data: payment });
  });

  confirm = asyncHandler(async (req, res) => {
    const appointment = await service.confirm({ 
      appointmentId: String(req.params.appointmentId), 
      assistantId: req.user!.id 
    });
    res.json({ success: true, data: appointment });
  });

  cancel = asyncHandler(async (req, res) => {
    const appointment = await service.cancel({
      appointmentId: String(req.params.appointmentId),
      actorId: req.user!.id,
      reason: req.body.reason || 'Cancelled by user'
    });
    res.json({ success: true, data: appointment });
  });
}
