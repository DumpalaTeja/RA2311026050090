import axios from 'axios';
import { config } from '../config';
import { getAccessToken } from '../auth/auth';
import { Log } from '../middleware/logger';
import { RawNotification } from '../utils/priority';

/**
 * fetchAllNotifications calls the Affordmed notification API and returns raw notifications.
 */
export async function fetchAllNotifications(): Promise<RawNotification[]> {
  try {
    const token = await getAccessToken();
    const response = await axios.get(
      `${config.affordmed.notificationBaseUrl}/evaluation-service/notifications`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await Log('backend', 'info', 'repository', 'Fetched notifications from Affordmed API');
    return response.data.notifications as RawNotification[];
  } catch (err: any) {
    await Log('backend', 'error', 'repository', `Failed to fetch notifications: ${err.message}`);
    throw new Error('Failed to fetch notifications from upstream API');
  }
}
