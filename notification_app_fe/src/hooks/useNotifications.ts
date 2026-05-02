import { useState, useEffect, useCallback } from 'react';
import { fetchNotifications, Notification } from '../api/notifications';
import { Log } from '../middleware/logger';

interface UseNotificationsOptions {
  notificationType?: string;
  page?: number;
  limit?: number;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  readIds: Set<string>;
  total: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refetch: () => void;
}

export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const { notificationType, page = 1, limit = 10 } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Log('frontend', 'debug', 'hook', `useNotifications fetching page=${page}`);
      const data = await fetchNotifications({
        notification_type: notificationType,
        page,
        limit,
      });
      setNotifications(data.notifications);
      setTotal(data.total);
    } catch (err: any) {
      await Log('frontend', 'error', 'hook', `useNotifications error: ${err.message}`);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [notificationType, page, limit]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAsRead = useCallback((id: string) => {
    setReadIds(prev => new Set(prev).add(id));
    Log('frontend', 'info', 'hook', `Marked notification ${id} as read`).catch(() => {});
  }, []);

  const markAllAsRead = useCallback(() => {
    setReadIds(prev => {
      const next = new Set(prev);
      notifications.forEach(n => next.add(n.ID));
      return next;
    });
    Log('frontend', 'info', 'hook', 'Marked all notifications as read').catch(() => {});
  }, [notifications]);

  return { notifications, readIds, total, loading, error, markAsRead, markAllAsRead, refetch: loadNotifications };
}
