import { Request, Response } from 'express';
import { getTopNotifications } from '../service/notification.service';
import { Log } from '../middleware/logger';

/**
 * getNotifications controller handles GET /api/notifications
 * Supports query params: notification_type, page, limit
 */
export async function getNotifications(req: Request, res: Response): Promise<void> {
  try {
    const notificationType = req.query.notification_type as string | undefined;
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '10', 10);

    await Log('backend', 'info', 'controller', `GET /notifications type=${notificationType} page=${page} limit=${limit}`);

    const result = await getTopNotifications(notificationType, page, limit);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    await Log('backend', 'error', 'controller', `Error in getNotifications: ${err.message}`);
    res.status(500).json({ success: false, message: err.message || 'Internal server error' });
  }
}
