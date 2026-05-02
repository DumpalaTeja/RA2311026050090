export interface RawNotification {
  ID: string;
  Type: 'Placement' | 'Result' | 'Event';
  Message: string;
  Timestamp: string;
}

const PRIORITY_MAP: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/**
 * sortAndPickTop10 sorts notifications by:
 *  1. Type priority: Placement > Result > Event
 *  2. Latest timestamp (descending)
 * Returns top 10.
 */
export function sortAndPickTop10(notifications: RawNotification[]): RawNotification[] {
  return [...notifications]
    .sort((a, b) => {
      const priorityDiff = (PRIORITY_MAP[b.Type] ?? 0) - (PRIORITY_MAP[a.Type] ?? 0);
      if (priorityDiff !== 0) return priorityDiff;
      // Same priority → sort by latest timestamp
      return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
    })
    .slice(0, 10);
}

/**
 * getPriorityLabel returns a human-readable priority label.
 */
export function getPriorityScore(type: string): number {
  return PRIORITY_MAP[type] ?? 0;
}
