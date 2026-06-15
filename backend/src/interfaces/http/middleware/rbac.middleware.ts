import type { NextFunction, Request, Response } from 'express';
import { type Permission, rolePermissions } from '../../../domain/entities/roles.js';
import { AppError } from '../../../shared/errors/AppError.js';

export const authorize =
  (...required: Permission[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Authentication required.', 'AUTH_REQUIRED'));
    }

    const granted = rolePermissions[req.user.role] ?? [];
    const allowed = required.every((permission) => granted.includes(permission));

    if (!allowed) {
      return next(new AppError(403, 'You do not have permission for this action.', 'RBAC_DENIED'));
    }

    return next();
  };
