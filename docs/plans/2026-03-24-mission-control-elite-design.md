# Mission Control Elite Upgrade — Design Document

## Overview
Upgrade Mission Control from 7 static routes with hardcoded data to a fully live, production-grade command center with real data integration, revenue tracking, and enhanced UX.

## Architecture

### Data Flow
```
File System → API Routes → Client Components → UI
```

### Server-Side (API Routes)
- `GET /api/projects` — Reads `~/Desktop/BDUBB-HQ/projects/*/STATUS.md`, returns JSON
- `GET /api/activity` — Reads `~/Desktop/BDUBB-HQ/agents/**/*.md`, returns activity feed
- `GET /api/health` — Returns system health status
- All routes use `fs` module — server components only

### Client-Side
- `MissionControlProvider` updated to fetch from API routes
- 30s revalidation for live data
- localStorage for editable fields (stats, revenue)

## 9 Enhancements

### 1. Real Home Dashboard
- Replace redirect with full dashboard
- Quick stats row: Total Tasks, Active Agents, Projects Live, MRR (localStorage)
- Recent activity feed (last 5 from `/api/activity`)
- Project status cards (read STATUS.md files)
- AP Status card

### 2. Live Data API Routes
- Server-side file reading with `fs`
- JSON parsing for STATUS.md and agent logs
- Health check endpoint

### 3. Revenue / P&L Page
- New route: `/revenue`
- 3 project revenue cards with localStorage
- Total MRR widget
- recharts BarChart (monthly targets vs actual)
- Add to nav

### 4. Agent Activity Feed
- Parse agent logs from `/api/activity`
- Scrollable feed with timestamp, agent name, action
- Color coding per agent type
- "Last active X mins ago" on desk cards

### 5. Cron Monitor Widget
- Read `~/Desktop/BDUBB-HQ/cron-status.json`
- Display: job name, schedule, last run, next run, status dot
- Pulsing green for healthy jobs

### 6. Command Terminal
- New route: `/terminal`
- Dark theme, monospace, blinking cursor
- Command input with echo response
- localStorage command history
- Quick command buttons
- Typewriter animation on output
- Add to nav

### 7. Notification Center
- Bell icon in header with badge
- Read `~/Desktop/BDUBB-HQ/alerts.json`
- Dropdown with alerts by category (Critical/Warning/Info)
- Mark all read with localStorage persistence

### 8. Upgraded Sidebar Nav
- Left sidebar (replacing current)
- Collapsible on mobile (hamburger)
- Icons + labels for all routes
- Active route cyan glow
- "BDUBB HQ ⚡" branding with raven icon
- Eastern time clock at bottom
- System status pulse dot

### 9. Mobile Responsive Fixes
- Hamburger nav collapse
- Kanban horizontal scroll
- Team chart vertical stack
- Single column grids on sm screens

## Technical Stack
- Next.js 14.2 (App Router)
- React 18.3
- TypeScript 5
- Tailwind CSS 3.4
- framer-motion 11.18 (animations)
- recharts (NEW — to be installed)

## Visual Style
- Dark glassmorphism
- Deep navy/black backgrounds
- Cyan glow accents
- White text
- Consistent with existing aesthetic

## Exit Protocol
1. Run `npx tsc --noEmit` — fix all errors
2. Run `npm run lint` — fix all warnings
3. Run `npm run build` — must pass clean
4. git commit + push
5. Write completion log
6. Update README status
7. System event notification

## Files to Create
- `src/app/page.tsx` — Real home dashboard
- `src/app/revenue/page.tsx` — Revenue dashboard
- `src/app/terminal/page.tsx` — Command terminal
- `src/app/api/projects/route.ts` — Projects API
- `src/app/api/activity/route.ts` — Activity API
- `src/app/api/health/route.ts` — Health API
- `src/components/notification-center.tsx` — Notifications
- `src/components/cron-monitor.tsx` — Cron widget
- `src/components/sidebar-nav.tsx` — Upgraded sidebar
- `~/Desktop/BDUBB-HQ/cron-status.json` — Sample cron data
- `~/Desktop/BDUBB-HQ/alerts.json` — Sample alerts

## Files to Modify
- `src/components/app-shell.tsx` — Integrate sidebar, notifications
- `src/components/mission-control-provider.tsx` — Add API fetching
- `src/components/virtual-office.tsx` — Add "last active" to desks
- `package.json` — Add recharts dependency

## Approved By
AP — Direct build approval via question response
