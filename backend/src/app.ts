import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import xss from 'xss-clean';
import { env } from './config/env.js';
import { errorHandler, notFound } from './interfaces/http/middleware/error.middleware.js';
import { router } from './interfaces/http/routes/index.js';

export function createApp() {
  const app = express();

  app.use(helmet());

  // Support multiple origins: set FRONTEND_URL as comma-separated list for Vercel preview URLs
  // e.g. "https://myapp.vercel.app,https://myapp-git-main.vercel.app"
  const allowedOrigins = env.FRONTEND_URL.split(',').map((u) => u.trim()).filter(Boolean);
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (curl, Postman, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        // Allow any vercel.app preview URL for this project
        if (origin.endsWith('.vercel.app')) return callback(null, true);
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(compression());
  app.use(mongoSanitize());
  app.use(xss());
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: env.NODE_ENV === 'production' ? 300 : 2000,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'doctor-hub-api', time: new Date().toISOString() });
  });

  app.use('/api/v1', router);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
