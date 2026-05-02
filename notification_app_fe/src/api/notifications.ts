import axios from 'axios';
import { Log } from '../middleware/logger';

export interface Notification {
  ID: string;
  Type: 'Placement' | 'Result' | 'Event';
  Message: string;
  Timestamp: string;
}

export interface NotificationsResponse {
  success: boolean;
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
}

export interface FetchParams {
  notification_type?: string;
  page?: number;
  limit?: number;
}

export async function fetchNotifications(params: FetchParams = {}): Promise<NotificationsResponse> {
  try {
    await Log('frontend', 'info', 'api', `Fetching notifications: ${JSON.stringify(params)}`);
    const response = await axios.get<NotificationsResponse>('/api/notifications', { params });
    await Log('frontend', 'info', 'api', `Fetched ${response.data.notifications.length} notifications`);
    return response.data;
  } catch (err: any) {
    await Log('frontend', 'error', 'api', `Failed to fetch notifications: ${err.message}`);
    throw err;
  }
}
