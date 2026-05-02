import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { getAccessToken } from '../auth/auth';

export type Stack = 'backend' | 'frontend';
export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type Package =
  | 'cache' | 'controller' | 'cron_job' | 'handler' | 'repository' | 'route' | 'service'
  | 'api' | 'component' | 'hook' | 'page' | 'state' | 'style'
  | 'auth' | 'config' | 'middleware' | 'utils';

/**
 * Log sends a structured log entry to the Affordmed logging API.
 */
export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<void> {
  try {
    const token = await getAccessToken();
    const res = await axios.post(
      `${config.affordmed.authBaseUrl}/evaluation-service/logs`,
      { stack, level, package: pkg, message },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );
    console.log(`[Log] logID=${res.data.logID} [${stack}][${level}][${pkg}] ${message}`);
  } catch (err: any) {
    // Never throw from logger — just print locally
    console.error('[Logger] Failed to send log:', err?.response?.data || err.message);
  }
}

/**
 * requestLogger is Express middleware that logs every HTTP request.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    const level: Level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
    Log('backend', level, 'middleware', `${req.method} ${req.originalUrl} → ${res.statusCode} (${ms}ms)`).catch(() => {});
  });
  next();
}
