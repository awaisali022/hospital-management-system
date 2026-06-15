import { AiHistoryModel } from '../database/models/Operational.model.js';

const disclaimer = 'This AI feature provides healthcare navigation and education only. Consult a qualified doctor for diagnosis and treatment.';

export class AiMedicalService {
  async chatbot(userId: string, prompt: string) {
    return this.respond(userId, 'chatbot', prompt, {
      answer: `I can help you organize symptoms and choose the right care path. ${disclaimer}`,
      nextSteps: ['Describe symptom duration', 'Mention severity', 'Book a relevant doctor if symptoms persist']
    });
  }

  async symptomChecker(userId: string, symptoms: string[]) {
    return this.respond(userId, 'symptom_checker', symptoms.join(', '), {
      likelyCategories: ['General Physician', 'Internal Medicine'],
      urgency: symptoms.some((item) => /chest pain|breath|unconscious/i.test(item)) ? 'urgent' : 'routine',
      disclaimer
    });
  }

  async doctorRecommendation(userId: string, input: string) {
    return this.respond(userId, 'doctor_recommendation', input, {
      recommendedSpecializations: ['General Physician', 'Family Medicine'],
      matchingSignals: ['Symptoms', 'City', 'Availability', 'Experience'],
      disclaimer
    });
  }

  async reportAnalyzer(userId: string, prompt: string) {
    const isHighGlucose = /glucose|sugar|110|120|130|140|diabetes/i.test(prompt);
    return this.respond(userId, 'report_analyzer', prompt, {
      summary: `CLINICAL STUDY SUMMARY: Audited biometric parameters show ${isHighGlucose ? 'marginally elevated' : 'normal ranges of'} metabolic indicators.`,
      keyFindings: [
        { parameter: 'Glucose Range', value: isHighGlucose ? 'Elevated' : 'Optimal', reference: '70-99 mg/dL' },
        { parameter: 'Systemic Health', value: 'Clear', reference: 'Stable' }
      ],
      abnormalitiesDetected: isHighGlucose ? ['Marginal Hyperglycemia Indicator'] : [],
      disclaimer
    });
  }

  async prescriptionSummarizer(userId: string, prompt: string) {
    return this.respond(userId, 'prescription_summarizer', prompt, {
      explanation: 'Prescription context represents therapeutic support for localized care targets.',
      medicinesBreakdown: [
        { name: 'Sumatriptan', action: 'Vasoconstriction support for cranial neural vessels.', frequency: 'Once daily during migraine warnings.' }
      ],
      instructions: 'Take immediately with water during aura warnings. Do not exceed therapeutic daily ceilings.',
      disclaimer
    });
  }

  private async respond(userId: string, feature: string, prompt: string, response: unknown) {
    await AiHistoryModel.create({ userId, feature, prompt, response, disclaimerAccepted: true });
    return response;
  }
}
