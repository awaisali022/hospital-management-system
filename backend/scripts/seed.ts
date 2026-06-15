import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import { UserModel } from '../src/infrastructure/database/models/User.model.js';
import { DoctorModel } from '../src/infrastructure/database/models/Doctor.model.js';
import { PatientModel } from '../src/infrastructure/database/models/Patient.model.js';
import { AppointmentModel } from '../src/infrastructure/database/models/Appointment.model.js';
import { MedicalHistoryModel } from '../src/infrastructure/database/models/MedicalHistory.model.js';
import { PrescriptionModel } from '../src/infrastructure/database/models/Prescription.model.js';
import { ClinicModel, ScheduleModel } from '../src/infrastructure/database/models/Platform.model.js';

async function seedDatabase() {
  console.log('Connecting to MongoDB at', env.MONGODB_URI);
  await mongoose.connect(env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });
  console.log('Connected.');

  console.log('Clearing old data...');
  await Promise.all([
    UserModel.deleteMany({}),
    DoctorModel.deleteMany({}),
    PatientModel.deleteMany({}),
    AppointmentModel.deleteMany({}),
    MedicalHistoryModel.deleteMany({}),
    PrescriptionModel.deleteMany({}),
    ClinicModel.deleteMany({}),
    ScheduleModel.deleteMany({})
  ]);

  console.log('Seeding Users...');
  const superAdmin = await UserModel.create({
    email: 'admin@doctorhub.local',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'super_admin',
    isActive: true,
  });

  const doctorUser = await UserModel.create({
    email: 'doctor@doctorhub.local',
    firstName: 'Sarah',
    lastName: 'Connor',
    role: 'doctor',
    isActive: true,
  });

  const patientUser = await UserModel.create({
    email: 'patient@doctorhub.local',
    firstName: 'John',
    lastName: 'Doe',
    role: 'patient',
    isActive: true,
  });

  console.log('Seeding Doctor Profile...');
  const doctor = await DoctorModel.create({
    userId: doctorUser._id,
    pmcNumber: 'PMC-12345',
    specializations: ['Cardiology', 'Internal Medicine'],
    treatmentTypes: ['Heart Failure', 'Hypertension'],
    experienceYears: 12,
    consultationFee: 2500,
    city: 'Lahore',
    bio: 'Experienced cardiologist specializing in hypertension and heart failure management.',
    rating: 4.9,
    reviewCount: 150,
    isVerified: true
  });

  console.log('Seeding Patient Profile...');
  const patient = await PatientModel.create({
    userId: patientUser._id,
    dateOfBirth: new Date('1990-05-15'),
    gender: 'male',
    bloodGroup: 'O+',
    allergies: ['Penicillin'],
    chronicConditions: ['Asthma']
  });

  console.log('Seeding Clinic and Schedule...');
  const clinic = await ClinicModel.create({
    doctorId: doctor._id,
    name: 'Heart Care Clinic',
    city: 'Lahore',
    address: '123 Medical Avenue, Gulberg',
    phone: '+92 300 1234567'
  });

  await ScheduleModel.create({
    doctorId: doctor._id,
    clinicId: clinic._id,
    dayOfWeek: 1, // Monday
    startsAt: '09:00',
    endsAt: '17:00',
    slotMinutes: 20,
    isActive: true
  });

  console.log('Seeding Appointment...');
  const appointment = await AppointmentModel.create({
    patientId: patient._id,
    doctorId: doctor._id,
    clinicId: clinic._id,
    appointmentDate: new Date(Date.now() + 86400000), // Tomorrow
    type: 'clinic',
    status: 'confirmed',
    chiefComplaint: 'Mild chest pain when running.'
  });

  console.log('Seeding Medical History & Prescription...');
  await MedicalHistoryModel.create({
    patientId: patient._id,
    doctorId: doctor._id,
    appointmentId: appointment._id,
    diagnosis: 'Exercise-induced angina',
    symptoms: ['Chest pain', 'Shortness of breath'],
    treatmentPlan: 'Rest, avoid strenuous exercise, take prescribed medication.',
    vitals: { bloodPressure: '130/85', pulse: 90, temperature: 98.6, oxygenSaturation: 97 },
    createdBy: doctorUser._id
  });

  await PrescriptionModel.create({
    patientId: patient._id,
    doctorId: doctor._id,
    appointmentId: appointment._id,
    medications: [{ name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '30 days' }],
    instructions: 'Take after meals',
    createdBy: doctorUser._id
  });

  console.log('✅ Database seeding completed successfully.');
  process.exit(0);
}

seedDatabase().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});
