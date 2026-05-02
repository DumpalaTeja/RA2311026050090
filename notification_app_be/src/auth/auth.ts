import axios from 'axios';
import { config } from '../config';

let accessToken: string | null = null;
let tokenExpiry: number = 0;

export async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // Return cached token if still valid (with 60s buffer)
  if (accessToken && now < tokenExpiry - 60) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      `${config.affordmed.authBaseUrl}/evaluation-service/auth`,
      {
        email: config.affordmed.email,
        name: config.affordmed.name,
        rollNo: config.affordmed.rollNo,
        accessCode: config.affordmed.accessCode,
        clientID: config.affordmed.clientID,
        clientSecret: config.affordmed.clientSecret,
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    accessToken = response.data.access_token;
    tokenExpiry = response.data.expires_in;

    console.log('[Auth] Token refreshed successfully');
    return accessToken!;
  } catch (err: any) {
    console.error('[Auth] Failed to obtain token:', err?.response?.data || err.message);
    throw new Error('Authentication failed');
  }
}
