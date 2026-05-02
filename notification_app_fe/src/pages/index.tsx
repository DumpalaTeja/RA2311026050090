import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useNotifications } from '../hooks/useNotifications';
import NotificationCard from '../components/NotificationCard';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import { Log } from '../middleware/logger';

const ITEMS_PER_PAGE = 5;

export default function HomePage() {
  const router = useRouter();

  const notificationType = (router.query.notification_type as string) || '';
  const page = parseInt((router.query.page as string) || '1', 10);

  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const { notifications, readIds, total, loading, error, markAsRead, markAllAsRead, refetch } =
    useNotifications({ notificationType: notificationType || undefined, page, limit: ITEMS_PER_PAGE });

  // Client-side unread filter
  const displayed = useMemo(
    () => (showUnreadOnly ? notifications.filter(n => !readIds.has(n.ID)) : notifications),
    [notifications, readIds, showUnreadOnly]
  );

  const unreadCount = notifications.filter(n => !readIds.has(n.ID)).length;

  const handleFilterChange = (type: string) => {
    Log('frontend', 'info', 'page', `Filter changed to: ${type || 'All'}`).catch(() => {});
    router.push({ query: { notification_type: type, page: 1 } });
  };

  const handlePageChange = (p: number) => {
    Log('frontend', 'info', 'page', `Page changed to: ${p}`).catch(() => {});
    router.push({ query: { ...router.query, page: p } });
  };

  return (
    <>
      <Head>
        <title>Notification Center | RA2311026050090</title>
        <meta name="description" content="Campus notification center — placement, results, and events sorted by priority." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <main className="main-layout">
        {/* ── Header ── */}
        <header className="app-header">
          <div className="header-inner">
            <div>
              <h1 className="app-title">🔔 Notification Center</h1>
              <p className="app-subtitle">Placement · Results · Events — sorted by priority</p>
            </div>
            <button id="refresh-btn" className="btn-refresh" onClick={refetch} aria-label="Refresh notifications">
              ↻ Refresh
            </button>
          </div>
        </header>

        <div className="content-wrapper">
          {/* ── Filter Bar ── */}
          <FilterBar
            activeFilter={notificationType}
            showUnreadOnly={showUnreadOnly}
            onFilterChange={handleFilterChange}
            onUnreadToggle={setShowUnreadOnly}
            onMarkAllRead={markAllAsRead}
            unreadCount={unreadCount}
          />

          {/* ── Stats ── */}
          <div className="stats-row">
            <span className="stat-chip">Total: <strong>{total}</strong></span>
            <span className="stat-chip unread-chip">Unread: <strong>{unreadCount}</strong></span>
            <span className="stat-chip">Page: <strong>{page}</strong></span>
          </div>

          {/* ── Notification List ── */}
          <section aria-label="Notifications list">
            {loading && (
              <div className="loading-state">
                <div className="spinner" />
                <p>Loading notifications…</p>
              </div>
            )}

            {error && !loading && (
              <div className="error-state">
                <p>⚠ {error}</p>
                <button className="btn-refresh" onClick={refetch}>Retry</button>
              </div>
            )}

            {!loading && !error && displayed.length === 0 && (
              <div className="empty-state">
                <p>🎉 No notifications {showUnreadOnly ? 'unread' : 'found'}.</p>
              </div>
            )}

            {!loading && !error && displayed.map(notification => (
              <NotificationCard
                key={notification.ID}
                notification={notification}
                isRead={readIds.has(notification.ID)}
                onMarkRead={markAsRead}
              />
            ))}
          </section>

          {/* ── Pagination ── */}
          {!loading && (
            <Pagination
              currentPage={page}
              totalItems={total}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </main>
    </>
  );
}
