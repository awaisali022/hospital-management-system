import http from 'node:http';
import { env } from './config/env.js';
import { createApp } from './app.js';
import { connectDatabase } from './infrastructure/database/connect.js';
import { SocketServer } from './infrastructure/realtime/SocketServer.js';

async function bootstrap() {
  if (!env.SKIP_DATABASE_CONNECTION) {
    await connectDatabase();
  } else {
    console.warn('Starting without MongoDB connection. Database-backed endpoints will require MongoDB.');
  }

  const app = createApp();
  const server = http.createServer(app);
  new SocketServer(server);

  server.listen(env.PORT, () => {
    console.log(`Doctor Hub API listening on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
