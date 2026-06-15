import { MedicalHistoryModel } from '../../infrastructure/database/models/MedicalHistory.model.js';
import { PrescriptionModel } from '../../infrastructure/database/models/Prescription.model.js';
import { DoctorModel } from '../../infrastructure/database/models/Doctor.model.js';
import { PatientModel } from '../../infrastructure/database/models/Patient.model.js';
import { ClinicModel } from '../../infrastructure/database/models/Platform.model.js';
import { UserModel } from '../../infrastructure/database/models/User.model.js';
import { AppointmentModel } from '../../infrastructure/database/models/Appointment.model.js';
import { PdfService } from '../../infrastructure/storage/PdfService.js';
import { StorageService } from '../../infrastructure/storage/StorageService.js';
import { AuditService } from './AuditService.js';
import { AppError } from '../../shared/errors/AppError.js';

export class MedicalRecordService {
  private readonly pdf = new PdfService();
  private readonly storage = new StorageService();

  constructor(private readonly audit = new AuditService()) {}

  async appendHistory(input: {
    patientId: string;
    doctorId: string;
    appointmentId: string;
    diagnosis: string;
    symptoms: string[];
    treatmentPlan: string;
    createdBy: string;
  }) {
    const record = await MedicalHistoryModel.create(input);
    
    // Mark appointment as completed when history is appended
    await AppointmentModel.findByIdAndUpdate(input.appointmentId, {
      status: 'completed'
    });

    await this.audit.record({
      actorId: input.createdBy,
      action: 'medical_history.appended',
      resource: 'MedicalHistory',
      resourceId: record.id
    });
    return record;
  }

  async createPrescription(input: {
    patientId: string;
    doctorId: string;
    appointmentId: string;
    medications: Array<{ name: string; dosage: string; frequency: string; duration: string; instructions?: string }>;
    instructions?: string;
    validUntil?: Date;
    createdBy: string;
  }) {
    // 1. Fetch Doctor details, Patient details, and Clinic details to populate PDF
    const doctor = await DoctorModel.findById(input.doctorId).populate('userId');
    if (!doctor) throw new AppError(404, 'Doctor profile not found.', 'DOCTOR_NOT_FOUND');
    const doctorUser = doctor.userId as any;

    const patient = await PatientModel.findById(input.patientId).populate('userId');
    if (!patient) throw new AppError(404, 'Patient profile not found.', 'PATIENT_NOT_FOUND');
    const patientUser = patient.userId as any;

    const appointment = await AppointmentModel.findById(input.appointmentId);
    const clinic = appointment?.clinicId ? await ClinicModel.findById(appointment.clinicId) : null;

    // Create a temporary mock prescriptionId so we can encode it in the QR code
    const tempId = `presc-${Date.now()}`;

    // 2. Generate PDF Buffer
    const pdfBuffer = await this.pdf.generatePrescriptionPdf({
      prescriptionId: tempId,
      date: new Date(),
      medications: input.medications,
      instructions: input.instructions,
      doctor: {
        firstName: doctorUser.firstName,
        lastName: doctorUser.lastName,
        pmcNumber: doctor.pmcNumber,
        specializations: doctor.specializations
      },
      patient: {
        firstName: patientUser.firstName,
        lastName: patientUser.lastName,
        gender: patient.gender || undefined,
        dateOfBirth: patient.dateOfBirth || undefined
      },
      clinic: clinic ? {
        name: clinic.name,
        address: clinic.address,
        city: clinic.city
      } : undefined
    });

    // 3. Upload PDF to Storage
    const pdfUrl = await this.storage.uploadBuffer(
      pdfBuffer,
      `${tempId}.pdf`,
      'application/pdf',
      'prescriptions'
    );

    // 4. Save to Database
    const prescription = await PrescriptionModel.create({
      ...input,
      pdfUrl,
      qrCode: tempId
    });

    await this.audit.record({
      actorId: input.createdBy,
      action: 'prescription.created',
      resource: 'Prescription',
      resourceId: prescription.id
    });

    return prescription;
  }
}
