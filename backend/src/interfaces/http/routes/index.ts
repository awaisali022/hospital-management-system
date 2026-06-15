import { Router } from 'express';
import { z } from 'zod';
import { roles } from '../../../domain/entities/roles.js';
import { AiController, aiPromptSchema } from '../controllers/AiController.js';
import { AppointmentController, bookAppointmentSchema } from '../controllers/AppointmentController.js';
import { AuthController } from '../controllers/AuthController.js';
import { DoctorController, doctorSearchSchema } from '../controllers/DoctorController.js';
import { appendHistorySchema, MedicalController } from '../controllers/MedicalController.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

export const router = Router();

const auth = new AuthController();
const doctors = new DoctorController();
const appointments = new AppointmentController();
const medical = new MedicalController();
const ai = new AiController();

const authSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    role: z.enum(roles).optional()
  })
});

router.post('/auth/register', validate(authSchema), auth.register);
router.post('/auth/login', validate(authSchema), auth.login);
router.post('/auth/refresh', auth.refresh);
router.get('/auth/me', authenticate, auth.me);

router.get('/doctors', validate(doctorSearchSchema), doctors.search);
router.post('/doctors', authenticate, authorize('doctors:manage'), doctors.create);

router.post('/appointments', authenticate, authorize('appointments:create'), validate(bookAppointmentSchema), appointments.book);
router.post('/appointments/payment-proof', authenticate, authorize('payments:create'), appointments.uploadPaymentProof);
router.patch('/payments/:paymentId/verify', authenticate, authorize('payments:verify'), appointments.verifyPayment);
router.patch('/appointments/:appointmentId/confirm', authenticate, authorize('appointments:verify'), appointments.confirm);

router.post('/medical-history', authenticate, authorize('medical_history:append'), validate(appendHistorySchema), medical.appendHistory);
router.post('/prescriptions', authenticate, authorize('prescriptions:create'), medical.createPrescription);

router.post('/ai/chatbot', authenticate, authorize('ai:use'), validate(aiPromptSchema), ai.chatbot);
router.post('/ai/symptom-checker', authenticate, authorize('ai:use'), validate(aiPromptSchema), ai.symptomChecker);
router.post('/ai/recommend-doctors', authenticate, authorize('ai:use'), validate(aiPromptSchema), ai.recommendDoctors);
router.post('/ai/report-analyzer', authenticate, authorize('ai:use'), validate(aiPromptSchema), ai.reportAnalyzer);
router.post('/ai/prescription-summarizer', authenticate, authorize('ai:use'), validate(aiPromptSchema), ai.prescriptionSummarizer);
