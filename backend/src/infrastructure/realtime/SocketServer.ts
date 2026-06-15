import type { Server as HttpServer } from 'node:http';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { env } from '../../config/env.js';

export class SocketServer {
  readonly io: Server;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: { origin: env.FRONTEND_URL, credentials: true },
      transports: ['websocket', 'polling']
    });

    this.io.use((socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        socket.data.user = jwt.verify(token, env.JWT_ACCESS_SECRET);
        next();
      } catch {
        next(new Error('Unauthorized'));
      }
    });

    this.io.on('connection', (socket) => {
      const user = socket.data.user as { id: string; role: string };
      socket.join(`user:${user.id}`);
      socket.join(`role:${user.role}`);

      socket.on('chat:message', (payload) => this.io.to(payload.chatId).emit('chat:new_message', payload));
      socket.on('chat:typing', (payload) => socket.to(payload.chatId).emit('chat:user_typing', payload));
      socket.on('video:sdp_offer', (payload) => socket.to(payload.to).emit('video:sdp_offer', payload));
      socket.on('video:sdp_answer', (payload) => socket.to(payload.to).emit('video:sdp_answer', payload));
      socket.on('video:ice_candidate', (payload) => socket.to(payload.to).emit('video:ice_candidate', payload));
    });
  }

  emitToUser(userId: string, event: string, payload: unknown) {
    this.io.to(`user:${userId}`).emit(event, payload);
  }
}
