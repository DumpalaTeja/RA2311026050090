// priority_algorithm.ts

interface Notification {
    id: number;
    message: string;
    isRead: boolean;
    timestamp: Date;
    weight: number;
}

class PriorityInbox {
    private notifications: Notification[];

    constructor(notifications: Notification[]) {
        this.notifications = notifications;
    }
    
    // Calculate priority based on weight and recency
    private calculatePriority(notification: Notification): number {
        const recencyScore = (new Date().getTime() - notification.timestamp.getTime()) / 1000; // seconds since notification
        const priority = (notification.weight / (1 + recencyScore)); // basic priority calculation
        return priority;
    }
    
    // Fetch top N unread notifications
    public getTopNUnreadNotifications(N: number): Notification[] {
        return this.notifications
            .filter(notification => !notification.isRead)
            .sort((a, b) => this.calculatePriority(b) - this.calculatePriority(a))
            .slice(0, N);
    }
}

// Example usage
const notifications: Notification[] = [
    { id: 1, message: 'You have a new message', isRead: false, timestamp: new Date('2026-05-01T12:00:00Z'), weight: 5 },
    { id: 2, message: 'New comment on your post', isRead: false, timestamp: new Date('2026-05-01T13:00:00Z'), weight: 10 },
    { id: 3, message: 'Your profile was viewed', isRead: true, timestamp: new Date('2026-04-30T10:00:00Z'), weight: 3 }
];

const priorityInbox = new PriorityInbox(notifications);
const topUnread = priorityInbox.getTopNUnreadNotifications(2);
console.log(topUnread);