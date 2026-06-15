import { z } from 'zod';
import { AiMedicalService } from '../../../infrastructure/ai/AiMedicalService.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';

const service = new AiMedicalService();

export const aiPromptSchema = z.object({
  body: z.object({
    prompt: z.string().min(2),
    symptoms: z.array(z.string()).optional()
  })
});

export class AiController {
  chatbot = asyncHandler(async (req, res) => {
    const data = await service.chatbot(req.user!.id, req.body.prompt);
    res.json({ success: true, data });
  });

  symptomChecker = asyncHandler(async (req, res) => {
    const data = await service.symptomChecker(req.user!.id, req.body.symptoms ?? [req.body.prompt]);
    res.json({ success: true, data });
  });

  recommendDoctors = asyncHandler(async (req, res) => {
    const data = await service.doctorRecommendation(req.user!.id, req.body.prompt);
    res.json({ success: true, data });
  });

  reportAnalyzer = asyncHandler(async (req, res) => {
    const data = await service.reportAnalyzer(req.user!.id, req.body.prompt);
    res.json({ success: true, data });
  });

  prescriptionSummarizer = asyncHandler(async (req, res) => {
    const data = await service.prescriptionSummarizer(req.user!.id, req.body.prompt);
    res.json({ success: true, data });
  });
}
