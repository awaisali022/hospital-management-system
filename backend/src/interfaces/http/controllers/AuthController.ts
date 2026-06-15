import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../../../config/env.js';
import { UserModel } from '../../../infrastructure/database/models/User.model.js';
import { PatientModel } from '../../../infrastructure/database/models/Patient.model.js';
import { DoctorModel } from '../../../infrastructure/database/models/Doctor.model.js';
import { AssistantModel } from '../../../infrastructure/database/models/Platform.model.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';

export class AuthController {
  register = asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName, role, pmcNumber, specializations, city, consultationFee } = req.body;
    
    const exists = await UserModel.exists({ email });
    if (exists) throw new AppError(409, 'Email is already registered.', 'EMAIL_EXISTS');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await UserModel.create({ 
      email, 
      firstName, 
      lastName, 
      role: role || 'patient', 
      passwordHash 
    });

    // Seed role-specific profiles
    if (user.role === 'patient') {
      await PatientModel.create({ userId: user._id });
    } else if (user.role === 'doctor') {
      await DoctorModel.create({
        userId: user._id,
        pmcNumber: pmcNumber || `PMC-${Math.floor(10000 + Math.random() * 90000)}`,
        specializations: specializations || ['General Medicine'],
        treatmentTypes: req.body.treatmentTypes || ['Allopathic'],
        experienceYears: req.body.experienceYears || 1,
        consultationFee: consultationFee || 1500,
        city: city || 'Lahore'
      });
    } else if (user.role === 'assistant') {
      await AssistantModel.create({ userId: user._id });
    }

    res.status(201).json({ 
      success: true, 
      data: this.issueTokens(user.id, user.role, user.email, user.firstName, user.lastName) 
    });
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).select('+passwordHash');
    if (!user?.passwordHash) throw new AppError(401, 'Invalid credentials.', 'INVALID_CREDENTIALS');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError(401, 'Invalid credentials.', 'INVALID_CREDENTIALS');

    if (!user.isActive) throw new AppError(403, 'Your account has been deactivated.', 'ACCOUNT_DEACTIVATED');

    user.lastLoginAt = new Date();
    await user.save();

    res.json({ 
      success: true, 
      data: this.issueTokens(user.id, user.role, user.email, user.firstName, user.lastName) 
    });
  });

  refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { 
      id: string; 
      role: string; 
      email: string;
      firstName: string;
      lastName: string;
    };
    res.json({ 
      success: true, 
      data: this.issueTokens(payload.id, payload.role, payload.email, payload.firstName, payload.lastName) 
    });
  });

  me = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user!.id);
    if (!user) throw new AppError(404, 'User not found.', 'USER_NOT_FOUND');
    
    // Fetch profile extension
    let profile: any = null;
    if (user.role === 'patient') {
      profile = await PatientModel.findOne({ userId: user._id });
    } else if (user.role === 'doctor') {
      profile = await DoctorModel.findOne({ userId: user._id });
    } else if (user.role === 'assistant') {
      profile = await AssistantModel.findOne({ userId: user._id });
    }

    res.json({ 
      success: true, 
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        isActive: user.isActive,
        profile
      }
    });
  });

  updateProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, phone, avatarUrl, ...profileData } = req.body;
    
    const user = await UserModel.findById(req.user!.id);
    if (!user) throw new AppError(404, 'User not found.', 'USER_NOT_FOUND');

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (avatarUrl) user.avatarUrl = avatarUrl;
    await user.save();

    let profile = null;
    if (user.role === 'patient') {
      profile = await PatientModel.findOneAndUpdate(
        { userId: user._id },
        { $set: profileData },
        { new: true, runValidators: true }
      );
    } else if (user.role === 'doctor') {
      profile = await DoctorModel.findOneAndUpdate(
        { userId: user._id },
        { $set: profileData },
        { new: true, runValidators: true }
      );
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        profile
      }
    });
  });

  private issueTokens(id: string, role: string, email: string, firstName: string, lastName: string) {
    const payload = { id, role, email, firstName, lastName };
    const accessOptions: SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'] };
    const refreshOptions: SignOptions = { expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'] };

    return {
      user: payload,
      accessToken: jwt.sign(payload, env.JWT_ACCESS_SECRET, accessOptions),
      refreshToken: jwt.sign(payload, env.JWT_REFRESH_SECRET, refreshOptions)
    };
  }
}
