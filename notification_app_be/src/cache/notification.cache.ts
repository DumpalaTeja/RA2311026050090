import { RawNotification } from '../utils/priority';

interface CacheEntry {
  data: RawNotification[];
  fetchedAt: number;
}

const CACHE_TTL_MS = 60_000; // 60 seconds
let cache: CacheEntry | null = null;

export function getCached(): RawNotification[] | null {
  if (!cache) return null;
  if (Date.now() - cache.fetchedAt > CACHE_TTL_MS) {
    cache = null;
    return null;
  }
  return cache.data;
}

export function setCache(data: RawNotification[]): void {
  cache = { data, fetchedAt: Date.now() };
}

export function clearCache(): void {
  cache = null;
}
