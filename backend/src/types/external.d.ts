declare module 'xss-clean' {
  import type { RequestHandler } from 'express';
  export default function xss(): RequestHandler;
}

declare module 'bcryptjs' {
  export function hash(value: string, salt: number): Promise<string>;
  export function compare(value: string, hash: string): Promise<boolean>;
}

declare module 'socket.io' {
  import type { Server as HttpServer } from 'node:http';

  export class Server {
    constructor(server: HttpServer, options?: unknown);
    use(handler: (socket: Socket, next: (error?: Error) => void) => void): void;
    on(event: 'connection', handler: (socket: Socket) => void): void;
    to(room: string): { emit: (event: string, payload: unknown) => void };
  }

  export interface Socket {
    data: Record<string, unknown>;
    handshake: { auth: Record<string, string> };
    join(room: string): void;
    to(room: string): { emit: (event: string, payload: unknown) => void };
    on(event: string, handler: (payload: any) => void): void;
  }
}
