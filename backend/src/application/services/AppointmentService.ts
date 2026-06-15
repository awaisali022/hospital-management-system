import { AppointmentModel } from '../../infrastructure/database/models/Appointment.model.js';
import { PaymentModel } from '../../infrastructure/database/models/Operational.model.js';
import { AppError } from '../../shared/errors/AppError.js';
import { AuditService } from './AuditService.js';

export class AppointmentService {
  constructor(private readonly audit = new AuditService()) {}

  async book(input: {
    patientId: string;
    doctorId: string;
    appointmentDate: Date;
    type: 'clinic' | 'video' | 'home';
    chiefComplaint: string;
    actorId: string;
  }) {
    const appointment = await AppointmentModel.create({
      patientId: input.patientId,
      doctorId: input.doctorId,
      appointmentDate: input.appointmentDate,
      type: input.type,
      chiefComplaint: input.chiefComplaint,
      status: 'pending_payment'
    });

    await this.audit.record({
      actorId: input.actorId,
      action: 'appointment.booked',
      resource: 'Appointment',
      resourceId: appointment.id
    });

    return appointment;
  }

  async uploadPaymentProof(input: {
    appointmentId: string;
    patientId: string;
    amount: number;
    method: 'bank_transfer' | 'card' | 'cash' | 'wallet';
    proofImageUrl: string;
    actorId: string;
  }) {
    const appointment = await AppointmentModel.findById(input.appointmentId);
    if (!appointment) throw new AppError(404, 'Appointment not found.', 'APPOINTMENT_NOT_FOUND');

    const payment = await PaymentModel.create({
      appointmentId: input.appointmentId,
      patientId: input.patientId,
      amount: input.amount,
      method: input.method,
      proofImageUrl: input.proofImageUrl,
      status: 'submitted'
    });

    appointment.status = 'payment_submitted';
    await appointment.save();

    await this.audit.record({
      actorId: input.actorId,
      action: 'payment.proof_uploaded',
      resource: 'Payment',
      resourceId: payment.id
    });

    return payment;
  }

  async verifyPayment(input: { paymentId: string; assistantId: string }) {
    const payment = await PaymentModel.findById(input.paymentId);
    if (!payment) throw new AppError(404, 'Payment not found.', 'PAYMENT_NOT_FOUND');

    payment.status = 'verified';
    payment.verifiedBy = input.assistantId as never;
    payment.verifiedAt = new Date();
    await payment.save();

    await AppointmentModel.findByIdAndUpdate(payment.appointmentId, {
      status: 'payment_verified',
      paymentVerifiedAt: new Date()
    });

    await this.audit.record({
      actorId: input.assistantId,
      action: 'payment.verified',
      resource: 'Payment',
      resourceId: payment.id
    });

    return payment;
  }

  async confirm(input: { appointmentId: string; assistantId: string }) {
    const appointment = await AppointmentModel.findById(input.appointmentId);
    if (!appointment) throw new AppError(404, 'Appointment not found.', 'APPOINTMENT_NOT_FOUND');
    if (appointment.status !== 'payment_verified') {
      throw new AppError(409, 'Payment must be verified before confirmation.', 'PAYMENT_NOT_VERIFIED');
    }

    appointment.status = 'confirmed';
    appointment.assistantConfirmedAt = new Date();
    await appointment.save();

    await this.audit.record({
      actorId: input.assistantId,
      action: 'appointment.confirmed',
      resource: 'Appointment',
      resourceId: appointment.id
    });

    return appointment;
  }

  async rejectPayment(input: { paymentId: string; assistantId: string; reason: string }) {
    const payment = await PaymentModel.findById(input.paymentId);
    if (!payment) throw new AppError(404, 'Payment not found.', 'PAYMENT_NOT_FOUND');

    payment.status = 'rejected';
    payment.verifiedBy = input.assistantId as never;
    payment.verifiedAt = new Date();
    await payment.save();

    await AppointmentModel.findByIdAndUpdate(payment.appointmentId, {
      status: 'pending_payment'
    });

    await this.audit.record({
      actorId: input.assistantId,
      action: 'payment.rejected',
      resource: 'Payment',
      resourceId: payment.id,
      metadata: { reason: input.reason }
    });

    return payment;
  }

  async cancel(input: { appointmentId: string; actorId: string; reason: string }) {
    const appointment = await AppointmentModel.findById(input.appointmentId);
    if (!appointment) throw new AppError(404, 'Appointment not found.', 'APPOINTMENT_NOT_FOUND');

    appointment.status = 'cancelled';
    appointment.cancelledAt = new Date();
    appointment.cancellationReason = input.reason;
    await appointment.save();

    await this.audit.record({
      actorId: input.actorId,
      action: 'appointment.cancelled',
      resource: 'Appointment',
      resourceId: appointment.id,
      metadata: { reason: input.reason }
    });

    return appointment;
  }
}
