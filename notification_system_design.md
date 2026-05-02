# Notification System Design

**Author:** Dumpala Teja — `RA2311026050090`  
**Email:** td3651@srmist.edu.in  
**GitHub:** [DumpalaTeja](https://github.com/DumpalaTeja)  

---

## 1. Overview

This document describes the architecture and design of the Affordmed Campus Notification System — a full-stack application that fetches, prioritizes, and displays campus notifications (Placements, Results, Events) in real-time.

---

## 2. System Architecture

```
┌─────────────────────┐      REST       ┌──────────────────────┐
│  notification_app   │  ─────────────► │  notification_app_be │
│       _fe           │  GET /api/      │  (Express + TypeScript│
│  (Next.js 13 + CSS) │  notifications  │   Port 5000)          │
└─────────────────────┘                 └──────────┬───────────┘
                                                   │
                              ┌────────────────────┼────────────────────┐
                              ▼                    ▼                    ▼
                   ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐
                   │  Affordmed API  │  │  Affordmed Auth  │  │  Affordmed Log │
                   │  (Notifications)│  │  (Token Service) │  │  (Log Service) │
                   │ 20.207.122.201  │  │ 20.244.56.144    │  │ 20.244.56.144  │
                   └─────────────────┘  └──────────────────┘  └────────────────┘
```

---

## 3. Repository Structure

```
RA2311026050090/
├── notification_system_design.md       ← This document
├── logging_middleware/                  ← Shared logging package
│   └── src/index.ts
├── notification_app_be/                 ← Express backend
│   ├── src/
│   │   ├── config/         index.ts    ← Env-based configuration
│   │   ├── auth/           auth.ts     ← Token management & refresh
│   │   ├── middleware/     logger.ts   ← HTTP + Affordmed logging
│   │   ├── cache/          notification.cache.ts ← In-memory TTL cache
│   │   ├── repository/     notification.repository.ts ← API data layer
│   │   ├── service/        notification.service.ts    ← Business logic
│   │   ├── controller/     notification.controller.ts ← Request parsing
│   │   ├── handler/        notification.handler.ts    ← Error wrapping
│   │   ├── route/          notification.route.ts      ← Route definitions
│   │   └── index.ts                                   ← App entry point
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
└── notification_app_fe/                 ← Next.js frontend
    ├── src/
    │   ├── config/         index.ts    ← API base URL config
    │   ├── middleware/     logger.ts   ← Frontend Affordmed logger
    │   ├── api/            notifications.ts ← Axios API calls
    │   ├── hooks/          useNotifications.ts ← State & data hook
    │   ├── components/
    │   │   ├── NotificationCard.tsx
    │   │   ├── FilterBar.tsx
    │   │   └── Pagination.tsx
    │   ├── pages/
    │   │   ├── _app.tsx
    │   │   └── index.tsx
    │   └── style/          globals.css
    ├── next.config.js
    ├── package.json
    └── tsconfig.json
```

---

## 4. Backend Design

### 4.1 Layered Architecture

| Layer | File | Responsibility |
|---|---|---|
| Config | `config/index.ts` | All env variables, API endpoints |
| Auth | `auth/auth.ts` | JWT token fetch + auto-refresh |
| Middleware | `middleware/logger.ts` | HTTP logging + Affordmed log API |
| Cache | `cache/notification.cache.ts` | 60s in-memory TTL cache |
| Repository | `repository/notification.repository.ts` | Fetch raw data from upstream |
| Service | `service/notification.service.ts` | Sort, filter, paginate |
| Controller | `controller/notification.controller.ts` | Parse query params, call service |
| Handler | `handler/notification.handler.ts` | Error boundary wrapper |
| Route | `route/notification.route.ts` | Express router bindings |

### 4.2 API Endpoint

```
GET /api/notifications
```

| Query Param | Type | Default | Description |
|---|---|---|---|
| `notification_type` | `Placement \| Result \| Event` | — | Filter by type |
| `page` | number | `1` | Pagination page |
| `limit` | number | `10` | Items per page |

**Sample Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "ID": "abc123",
      "Type": "Placement",
      "Message": "On-campus drive: Google India",
      "Timestamp": "2026-04-22 17:51:30"
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 10
}
```

---

## 5. Priority Sorting Algorithm

### Logic

```
Priority Score:
  Placement → 3 (highest)
  Result    → 2
  Event     → 1 (lowest)

Sort Order:
  1. By Priority Score (descending)
  2. By Timestamp (latest first, descending)

Return: Top 10 results
```

### TypeScript Implementation

```typescript
function sortAndPickTop10(notifications: RawNotification[]): RawNotification[] {
  const PRIORITY = { Placement: 3, Result: 2, Event: 1 };
  return [...notifications]
    .sort((a, b) => {
      const pd = PRIORITY[b.Type] - PRIORITY[a.Type];
      if (pd !== 0) return pd;
      return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
    })
    .slice(0, 10);
}
```

---

## 6. Logging Strategy

All logs are sent to `POST /evaluation-service/logs` via the Affordmed API.

| Parameter | Allowed Values |
|---|---|
| `stack` | `backend`, `frontend` |
| `level` | `debug`, `info`, `warn`, `error`, `fatal` |
| `package` (backend) | `cache`, `controller`, `cron_job`, `handler`, `repository`, `route`, `service`, `auth`, `config`, `middleware`, `utils` |
| `package` (frontend) | `api`, `component`, `hook`, `page`, `state`, `style`, `auth`, `config`, `middleware`, `utils` |

**When logs are emitted:**
- Every HTTP request/response (middleware)
- Token refresh (auth)
- Cache hit/miss (cache)
- API fetch success/failure (repository)
- Sort/filter operations (service)
- Controller request parsing (controller)
- User interactions: filter change, page change, mark-read (frontend hook/page)

---

## 7. Frontend Design

### 7.1 Features

| Feature | Implementation |
|---|---|
| Display notifications | `NotificationCard` component per notification |
| Type filter | `FilterBar` — All / Placement / Result / Event tabs |
| Read / Unread | `useNotifications` hook tracks `readIds` Set in state |
| Unread-only filter | Client-side filter toggle in `FilterBar` |
| Pagination | URL query params `?page=N&limit=5`, `Pagination` component |
| Responsive layout | Vanilla CSS, mobile-first breakpoints |
| Priority highlighting | Border-left color + badge color per type |

### 7.2 Color System

| Type | Color | Priority |
|---|---|---|
| Placement | `#f97b6b` (Red-orange) | Highest |
| Result | `#ffd166` (Golden) | Medium |
| Event | `#6bcb77` (Green) | Lower |

### 7.3 Component Flow

```
index.tsx (page)
  ├── FilterBar   ← type filter, unread toggle, mark-all-read
  ├── NotificationCard (×N) ← per-notification card with mark-read
  └── Pagination  ← page navigation
```

---

## 8. Authentication Flow

```
1. App starts
2. Auth module calls POST /evaluation-service/auth
   → stores access_token + expires_in
3. Every API call checks token expiry (with 60s buffer)
4. If expired → re-authenticate automatically
5. Token is shared via module-level cache (no DB needed)
```

---

## 9. Key Design Decisions

| Decision | Rationale |
|---|---|
| No database | As per requirements — all data from Affordmed API |
| In-memory cache (60s TTL) | Reduces API calls, improves response time |
| Token auto-refresh | Token expires in ~15 min; refresh happens transparently |
| Next.js API proxy | Avoids CORS issues; FE calls `/api/*` → BE |
| Layered backend architecture | Separation of concerns; clean code standards |
| Vanilla CSS | Per requirements — no ShadCN, minimal external UI |

---

## 10. Running Locally

### Backend
```bash
cd notification_app_be
npm install
npm run dev
# Runs on http://localhost:5000
```

### Frontend
```bash
cd notification_app_fe
npm install
npm run dev
# Runs on http://localhost:3000
```