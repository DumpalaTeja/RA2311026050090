import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './config';
import { requestLogger, Log } from './middleware/logger';
import notificationRoutes from './route/notification.route';

dotenv.config();

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(requestLogger);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  Log('backend', 'fatal', 'middleware', `Unhandled exception: ${err.message}`).catch(() => {});
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(config.port, async () => {
  console.log(`[Server] Notification backend running on http://localhost:${config.port}`);
  await Log('backend', 'info', 'config', `Server started on port ${config.port}`);
});

export default app;
