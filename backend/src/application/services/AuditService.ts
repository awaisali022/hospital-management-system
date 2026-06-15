import { AuditLogModel } from '../../infrastructure/database/models/Operational.model.js';

export class AuditService {
  async record(input: {
    actorId?: string;
    action: string;
    resource: string;
    resourceId?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: unknown;
  }) {
    await AuditLogModel.create(input);
  }
}
