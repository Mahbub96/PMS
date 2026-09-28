import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { initSocketIO } from './sockets/socketManager.js';
import apiRouter from './routes/apiRouter.js';
import { initCronJobs } from './cron/cronScheduler.js';

const app = express();
const server = http.createServer(app);

// Security & Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: [env.CLIENT_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json());

// Initialize Socket.io
initSocketIO(server);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    timezone: env.TIMEZONE,
  });
});

// Mount API routes
app.use('/api/v1', apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[App Error]', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// Startup Bootstrap
async function bootstrap() {
  try {
    await connectDB();
    initCronJobs();

    server.listen(env.PORT, () => {
      console.log(`=======================================================`);
      console.log(` Penalty Management Cloud - Node.js Backend Server`);
      console.log(` Running on: http://localhost:${env.PORT}`);
      console.log(` Health Check: http://localhost:${env.PORT}/health`);
      console.log(` Environment: ${env.NODE_ENV}`);
      console.log(` Timezone: ${env.TIMEZONE} (Cutoff: ${env.CUTOFF_HOUR}:${env.CUTOFF_MINUTE})`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP and WebSocket server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

bootstrap();

export { app, server };
