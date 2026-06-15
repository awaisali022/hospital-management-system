import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../../../shared/errors/AppError.js';
import { env } from '../../../config/env.js';

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`, 'NOT_FOUND'));
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  const appError = error instanceof AppError ? error : new AppError(500, 'Internal server error.', 'INTERNAL_ERROR');

  res.status(appError.statusCode).json({
    success: false,
    error: {
      code: appError.code,
      message: appError.message,
      stack: env.NODE_ENV === 'development' ? error.stack : undefined
    }
  });
}
