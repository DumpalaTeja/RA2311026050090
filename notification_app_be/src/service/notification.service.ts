import { fetchAllNotifications } from '../repository/notification.repository';
import { sortAndPickTop10, RawNotification } from '../utils/priority';
import { getCached, setCache } from '../cache/notification.cache';
import { Log } from '../middleware/logger';

export interface NotificationResult {
  notifications: RawNotification[];
  total: number;
  page: number;
  limit: number;
}

/**
 * getTopNotifications returns top 10 priority-sorted notifications with optional
 * type filter and pagination.
 */
export async function getTopNotifications(
  notificationType?: string,
  page: number = 1,
  limit: number = 10
): Promise<NotificationResult> {
  await Log('backend', 'debug', 'service', `getTopNotifications called: type=${notificationType}, page=${page}, limit=${limit}`);

  // Fetch all (use cache if available)
  let all = getCached();
  if (!all) {
    all = await fetchAllNotifications();
    setCache(all);
    await Log('backend', 'info', 'service', `Fetched ${all.length} notifications from API (cache miss)`);
  } else {
    await Log('backend', 'debug', 'service', `Serving ${all.length} notifications from cache`);
  }

  // Sort by priority and pick top 10
  const top10 = sortAndPickTop10(all);

  // Filter by type if requested
  const filtered = notificationType
    ? top10.filter(n => n.Type.toLowerCase() === notificationType.toLowerCase())
    : top10;

  // Paginate
  const total = filtered.length;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  await Log('backend', 'info', 'service', `Returning ${paginated.length}/${total} notifications`);

  return { notifications: paginated, total, page, limit };
}
