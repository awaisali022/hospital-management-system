import { z } from 'zod';
import { MedicalRecordService } from '../../../application/services/MedicalRecordService.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';

const service = new MedicalRecordService();

export const appendHistorySchema = z.object({
  body: z.object({
    patientId: z.string(),
    doctorId: z.string(),
    appointmentId: z.string(),
    diagnosis: z.string().min(2),
    symptoms: z.array(z.string()).default([]),
    treatmentPlan: z.string().min(2)
  })
});

export class MedicalController {
  appendHistory = asyncHandler(async (req, res) => {
    const record = await service.appendHistory({ ...req.body, createdBy: req.user!.id });
    res.status(201).json({ success: true, data: record });
  });

  createPrescription = asyncHandler(async (req, res) => {
    const prescription = await service.createPrescription({ ...req.body, createdBy: req.user!.id });
    res.status(201).json({ success: true, data: prescription });
  });
}
