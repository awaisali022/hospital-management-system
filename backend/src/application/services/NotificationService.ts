import { NotificationModel } from '../../infrastructure/database/models/Operational.model.js';

export class NotificationService {
  async create(input: { userId: string; type: string; title: string; body: string; metadata?: unknown }) {
    return NotificationModel.create(input);
  }
}
