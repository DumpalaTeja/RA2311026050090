# RA2311026050090 — Affordmed Campus Notification System

**Name:** Dumpala Teja  
**Roll No:** RA2311026050090  
**Email:** td3651@srmist.edu.in  
**GitHub:** [DumpalaTeja](https://github.com/DumpalaTeja)

---

## Project Structure

```
RA2311026050090/
├── notification_system_design.md   ← Architecture & design document
├── logging_middleware/              ← Shared Affordmed logging package
├── notification_app_be/             ← Express + TypeScript backend (port 5000)
└── notification_app_fe/             ← Next.js 13 + Vanilla CSS frontend (port 3000)
```

---

## How to Run

### Backend
```bash
cd notification_app_be
npm install
npm run dev
# → http://localhost:5000
```

### Frontend
```bash
cd notification_app_fe
npm install
npm run dev
# → http://localhost:3000
```

---

## Backend API

| Method | Endpoint | Query Params |
|---|---|---|
| GET | `/api/notifications` | `notification_type`, `page`, `limit` |
| GET | `/health` | — |

**Sorting:** `Placement` (3) > `Result` (2) > `Event` (1), then by latest timestamp. Returns top 10.

---

## Frontend Features

- 🔔 Display all top-10 priority-sorted notifications
- 🏷 Filter by type: All / Placement / Result / Event
- 👁 Read / Unread tracking with Mark Read & Mark All Read
- 📄 Pagination via query params (`page`, `limit`, `notification_type`)
- 📱 Fully responsive — mobile + desktop
- 🌙 Dark mode with premium CSS design

---

## Logging

Every action in both backend and frontend is logged to the Affordmed logging API (`POST /evaluation-service/logs`) using structured log entries with `stack`, `level`, `package`, and `message`.
