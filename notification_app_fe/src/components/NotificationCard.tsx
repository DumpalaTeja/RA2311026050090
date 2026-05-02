import React from 'react';
import { Notification } from '../api/notifications';

interface Props {
  notification: Notification;
  isRead: boolean;
  onMarkRead: (id: string) => void;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  Placement: { label: 'Placement', color: 'var(--color-placement)', icon: '🏆' },
  Result:    { label: 'Result',    color: 'var(--color-result)',    icon: '📊' },
  Event:     { label: 'Event',     color: 'var(--color-event)',     icon: '📅' },
};

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

const NotificationCard: React.FC<Props> = ({ notification, isRead, onMarkRead }) => {
  const typeConf = TYPE_CONFIG[notification.Type] || TYPE_CONFIG.Event;

  return (
    <div
      className={`notification-card ${isRead ? 'read' : 'unread'}`}
      style={{ borderLeftColor: typeConf.color }}
      id={`notification-${notification.ID}`}
    >
      <div className="card-header">
        <span className="type-badge" style={{ backgroundColor: typeConf.color }}>
          {typeConf.icon} {typeConf.label}
        </span>
        {!isRead && <span className="unread-dot" aria-label="Unread" />}
      </div>

      <p className="card-message">{notification.Message}</p>

      <div className="card-footer">
        <span className="card-timestamp">🕒 {formatTimestamp(notification.Timestamp)}</span>
        {!isRead && (
          <button
            className="btn-read"
            onClick={() => onMarkRead(notification.ID)}
            id={`mark-read-${notification.ID}`}
            aria-label="Mark as read"
          >
            Mark Read
          </button>
        )}
        {isRead && <span className="read-label">✔ Read</span>}
      </div>
    </div>
  );
};

export default NotificationCard;
