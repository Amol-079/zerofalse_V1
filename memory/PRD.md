# Zerofalse - AI Agent Runtime Security

## Product Overview
**Name:** Zerofalse  
**Tagline:** Runtime Security for AI Agents  
**Target User:** Developers and security teams building AI agent applications

## Problem Statement
AI agents executing tool calls can be exploited through prompt injection, credential theft, and shell injection attacks. Zerofalse provides real-time inspection of every tool call to detect and block threats before they reach production systems.

## Core Features
- **Real-time Tool Call Inspection**: Monitor every tool call in milliseconds with zero latency impact
- **Threat Detection**: Catch prompt injection, credential theft, and shell injection
- **Policy Enforcement**: Define granular policies to allow, block, or alert on specific tool behaviors
- **Instant Alerts**: Get notified immediately when suspicious activity is detected
- **Dashboard Analytics**: Monitor security posture with charts and statistics

---

## Technical Architecture

### Technology Stack
- **Frontend**: React 18, Vite, TailwindCSS, Recharts
- **Backend**: FastAPI, Python 3.12, SQLAlchemy 2.0, Pydantic v2
- **Database**: PostgreSQL (NOT MongoDB)
- **Authentication**: JWT (access/refresh tokens), API Key authentication for scan endpoints

### Project Structure
```
/app/
├── backend/
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   ├── models/
│   ├── routers/
│   ├── services/
│   │   └── detection_engine.py  # Core security logic
│   ├── middleware/
│   └── schemas/
└── frontend/
    ├── src/
    │   ├── api/client.js
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── Topbar.jsx
    │   ├── context/AuthContext.jsx
    │   ├── hooks/
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── ScanLogs.jsx
    │   │   ├── Alerts.jsx
    │   │   ├── APIKeys.jsx
    │   │   └── Settings.jsx
    │   └── index.css  # Design system
    └── package.json
```

### Database Schema
- **users**: id (UUID), email, hashed_password, full_name, org_id
- **organizations**: id (UUID), name, slug, plan, scan_limit_month
- **api_keys**: id (UUID), org_id, user_id, key_hash, key_prefix
- **scan_events**: id (UUID), org_id, api_key_id, tool_name, decision, risk_score, threat_type
- **alerts**: id (UUID), org_id, scan_event_id, title, severity, status

### Key API Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/scan/tool-call` - Core scan endpoint (X-API-Key auth)
- `GET /api/v1/dashboard/stats` - Dashboard statistics
- `GET /api/v1/keys/` - List API keys
- `GET /api/v1/alerts/` - List alerts
- `GET /api/v1/scan/history` - Scan logs

---

## Completed Work

### December 2025 - UI/UX Complete Overhaul

#### Design System Implementation
- CSS variables for colors, typography, spacing, shadows
- Font: Inter for UI, JetBrains Mono for code
- 8px spacing grid
- Shadow elevation system

#### Pages Completed (All 8 pages)
1. **Landing.jsx** - Hero section, features grid, stats, code preview, CTA
2. **Signup.jsx** - Split layout with branding, benefits, testimonial
3. **Login.jsx** - Split layout with stats, Google SSO button
4. **Dashboard.jsx** - Stats cards, area chart, recent scans list, usage bar
5. **ScanLogs.jsx** - Searchable table, filter dropdowns, expandable rows
6. **Alerts.jsx** - Status stats, filter options, detail modal
7. **APIKeys.jsx** - Create/revoke keys, copy functionality, security warnings
8. **Settings.jsx** - 5-tab layout (Profile, Organization, Notifications, Security, Billing)

#### Components Completed
- `Layout.jsx` - Main app shell with sidebar
- `Sidebar.jsx` - Navigation with active states, usage indicator
- `Topbar.jsx` - User dropdown, notifications

#### Testing Status
- ✅ Frontend testing: 100% pass rate
- ✅ All 8 pages render correctly
- ✅ Navigation and routing working
- ✅ Protected routes redirect properly
- ✅ Forms accept input and display validation

---

## Prioritized Backlog

### P0 - Critical
*No critical issues remaining*

### P1 - High Priority
- [ ] Create docker-compose.yml for containerization
- [ ] Create nginx/nginx.conf for proxy configuration
- [ ] End-to-end flow testing (signup → API key → scan)

### P2 - Medium Priority
- [ ] Refactor rate limiting to use Redis (currently in-memory)
- [ ] Implement email sending for password resets
- [ ] Implement webhook sending logic for alerts
- [ ] Add data-testid to all interactive elements

### P3 - Low Priority
- [ ] Two-factor authentication
- [ ] Session management UI
- [ ] Export functionality for scan logs
- [ ] Responsive design improvements for mobile

---

## Known Limitations
1. **Rate Limiting**: Currently using in-memory dictionary instead of Redis
2. **Email**: Password reset only logs token, no actual email sent
3. **Webhooks**: API endpoints exist but trigger logic not implemented
4. **2FA**: Marked as "Coming Soon" in Settings UI

---

## URLs
- Frontend: https://secure-agents-2.preview.emergentagent.com
- API Base: https://secure-agents-2.preview.emergentagent.com/api/v1

## Route Mapping
| Route | Page | Auth Required |
|-------|------|---------------|
| / | Landing | No |
| /signup | Signup | Public only |
| /login | Login | Public only |
| /forgot-password | ForgotPassword | Public only |
| /onboarding | Onboarding | Yes |
| /dashboard | Dashboard | Yes |
| /scan-logs | ScanLogs | Yes |
| /alerts | Alerts | Yes |
| /keys | APIKeys | Yes |
| /settings | Settings | Yes |
