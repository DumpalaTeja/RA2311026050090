import axios from 'axios';
import { config } from '../config';

export type Stack = 'backend' | 'frontend';
export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type Package =
  | 'api' | 'component' | 'hook' | 'page' | 'state' | 'style'
  | 'auth' | 'config' | 'middleware' | 'utils';

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && now < tokenExpiry - 60) return cachedToken;

  const res = await axios.post(`${config.affordmed.authBaseUrl}/evaluation-service/auth`, {
    email: config.affordmed.email,
    name: config.affordmed.name,
    rollNo: config.affordmed.rollNo,
    accessCode: config.affordmed.accessCode,
    clientID: config.affordmed.clientID,
    clientSecret: config.affordmed.clientSecret,
  });
  cachedToken = res.data.access_token;
  tokenExpiry = res.data.expires_in;
  return cachedToken!;
}

/**
 * Log sends a structured log entry to Affordmed from the frontend.
 */
export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<void> {
  try {
    const token = await getToken();
    await axios.post(
      `${config.affordmed.authBaseUrl}/evaluation-service/logs`,
      { stack, level, package: pkg, message },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch {
    // Silently fail — never break the UI for logging errors
  }
}
