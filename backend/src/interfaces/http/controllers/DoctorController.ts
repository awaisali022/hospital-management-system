import { z } from 'zod';
import { DoctorModel } from '../../../infrastructure/database/models/Doctor.model.js';
import { ClinicModel, ScheduleModel } from '../../../infrastructure/database/models/Platform.model.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { AppError } from '../../../shared/errors/AppError.js';

export const doctorSearchSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    specialization: z.string().optional(),
    city: z.string().optional(),
    treatmentType: z.string().optional(),
    minExperience: z.coerce.number().optional(),
    maxFee: z.coerce.number().optional(),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().max(50).default(12)
  })
});

export class DoctorController {
  search = asyncHandler(async (req, res) => {
    const { q, specialization, city, treatmentType, minExperience, maxFee, page, limit } = req.query as Record<string, string>;
    const filter: Record<string, any> = { isVerified: true };

    if (q) filter.$text = { $search: q };
    if (specialization) filter.specializations = { $in: [specialization] };
    if (city) filter.city = new RegExp(city, 'i');
    if (treatmentType) filter.treatmentTypes = { $in: [treatmentType] };
    if (minExperience) filter.experienceYears = { $gte: Number(minExperience) };
    if (maxFee) filter.consultationFee = { $lte: Number(maxFee) };

    const doctors = await DoctorModel.find(filter)
      .populate('userId', 'firstName lastName avatarUrl phone email')
      .sort({ rating: -1, experienceYears: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    res.json({ success: true, data: doctors });
  });

  getById = asyncHandler(async (req, res) => {
    const doctor = await DoctorModel.findById(req.params.id)
      .populate('userId', 'firstName lastName avatarUrl phone email')
      .lean();

    if (!doctor) throw new AppError(404, 'Doctor not found.', 'DOCTOR_NOT_FOUND');

    // Fetch clinics and schedules associated with this doctor
    const clinics = await ClinicModel.find({ doctorId: doctor._id }).lean();
    const schedules = await ScheduleModel.find({ doctorId: doctor._id }).lean();

    res.json({ 
      success: true, 
      data: {
        ...doctor,
        clinics,
        schedules
      }
    });
  });

  create = asyncHandler(async (req, res) => {
    const doctor = await DoctorModel.create(req.body);
    res.status(201).json({ success: true, data: doctor });
  });

  update = asyncHandler(async (req, res) => {
    const doctor = await DoctorModel.findOneAndUpdate(
      { userId: req.user!.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!doctor) throw new AppError(404, 'Doctor profile not found.', 'DOCTOR_NOT_FOUND');
    res.json({ success: true, data: doctor });
  });
}
