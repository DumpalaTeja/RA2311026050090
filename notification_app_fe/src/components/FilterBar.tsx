import React from 'react';

const FILTER_OPTIONS = [
  { value: '', label: '🔔 All' },
  { value: 'Placement', label: '🏆 Placement' },
  { value: 'Result', label: '📊 Result' },
  { value: 'Event', label: '📅 Event' },
];

interface Props {
  activeFilter: string;
  showUnreadOnly: boolean;
  onFilterChange: (value: string) => void;
  onUnreadToggle: (val: boolean) => void;
  onMarkAllRead: () => void;
  unreadCount: number;
}

const FilterBar: React.FC<Props> = ({
  activeFilter,
  showUnreadOnly,
  onFilterChange,
  onUnreadToggle,
  onMarkAllRead,
  unreadCount,
}) => {
  return (
    <div className="filter-bar" role="toolbar" aria-label="Notification filters">
      <div className="filter-tabs">
        {FILTER_OPTIONS.map(opt => (
          <button
            key={opt.value}
            id={`filter-${opt.value || 'all'}`}
            className={`filter-tab ${activeFilter === opt.value ? 'active' : ''}`}
            onClick={() => onFilterChange(opt.value)}
            aria-pressed={activeFilter === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="filter-actions">
        <label className="toggle-label" htmlFor="unread-toggle">
          <input
            type="checkbox"
            id="unread-toggle"
            checked={showUnreadOnly}
            onChange={e => onUnreadToggle(e.target.checked)}
          />
          <span>Unread only {unreadCount > 0 && <span className="badge">{unreadCount}</span>}</span>
        </label>

        <button
          id="mark-all-read-btn"
          className="btn-mark-all"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
        >
          ✔ Mark All Read
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
