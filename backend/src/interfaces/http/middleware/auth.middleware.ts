import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { env } from '../../../config/env.js';
import type { Role } from '../../../domain/entities/roles.js';
import { UserModel } from '../../../infrastructure/database/models/User.model.js';
import { AppError } from '../../../shared/errors/AppError.js';

export interface AuthUser {
  id: string;
  role: Role;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// Initialize Supabase Client if configured
const hasSupabase = !!(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
const supabase = hasSupabase
  ? createClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!)
  : null;

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) {
    return next(new AppError(401, 'Authentication token required.', 'AUTH_REQUIRED'));
  }

  // 1. Try Supabase verification if configured
  if (supabase) {
    try {
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
      
      if (!error && supabaseUser) {
        // Map Supabase user to MongoDB user
        const mongoUser = await UserModel.findOne({
          $or: [
            { supabaseId: supabaseUser.id },
            { email: supabaseUser.email?.toLowerCase() }
          ]
        });

        if (mongoUser) {
          if (!mongoUser.isActive) {
            return next(new AppError(403, 'Your account has been deactivated.', 'ACCOUNT_DEACTIVATED'));
          }

          // Proactively update supabaseId if not set
          if (!mongoUser.supabaseId) {
            mongoUser.supabaseId = supabaseUser.id;
            await mongoUser.save();
          }

          req.user = {
            id: mongoUser.id,
            role: mongoUser.role as Role,
            email: mongoUser.email
          };
          return next();
        }
      }
    } catch (err) {
      console.warn('Supabase authentication failed, trying local JWT fallback:', err);
    }
  }

  // 2. Local JWT Fallback
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthUser;
    
    // Validate user still exists and is active in MongoDB
    const mongoUser = await UserModel.findById(decoded.id);
    if (!mongoUser) {
      return next(new AppError(401, 'User associated with this token no longer exists.', 'AUTH_INVALID'));
    }
    if (!mongoUser.isActive) {
      return next(new AppError(403, 'Your account has been deactivated.', 'ACCOUNT_DEACTIVATED'));
    }

    req.user = {
      id: mongoUser.id,
      role: mongoUser.role as Role,
      email: mongoUser.email
    };
    return next();
  } catch (err) {
    return next(new AppError(401, 'Invalid or expired token.', 'AUTH_INVALID'));
  }
}
