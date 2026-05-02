import axios from 'axios';

export type Stack = 'backend' | 'frontend';
export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type Package =
  | 'cache' | 'controller' | 'cron_job' | 'handler' | 'repository' | 'route' | 'service'
  | 'api' | 'component' | 'hook' | 'page' | 'state' | 'style'
  | 'auth' | 'config' | 'middleware' | 'utils';

export interface LoggerConfig {
  authBaseUrl: string;
  email: string;
  name: string;
  clientSecret: string;
}

export interface LogResponse {
  logID: string;
  message: string;
}

let token: string | null = null;
let tokenExpiry: number = 0;

let _config: LoggerConfig;

/**
 * init — must be called once before using Log().
 */
export function init(cfg: LoggerConfig): void {
  _config = cfg;
}

async function getToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (token && now < tokenExpiry - 60) return token;

  const res = await axios.post(`${_config.authBaseUrl}/evaluation-service/auth`, {
    email: _config.email,
    name: _config.name,
    clientSecret: _config.clientSecret,
  });
  token = res.data.access_token;
  tokenExpiry = res.data.expires_in;
  return token!;
}

/**
 * Log — send a structured log to Affordmed.
 * Never throws; always resolves.
 */
export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<LogResponse | null> {
  try {
    const bearer = await getToken();
    const res = await axios.post<LogResponse>(
      `${_config.authBaseUrl}/evaluation-service/logs`,
      { stack, level, package: pkg, message },
      { headers: { Authorization: `Bearer ${bearer}`, 'Content-Type': 'application/json' } }
    );
    return res.data;
  } catch (err: any) {
    console.error('[AffordmedLogger] Failed:', err?.response?.data || err.message);
    return null;
  }
}
