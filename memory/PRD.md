# Zerofalse - AI Agent Runtime Security

## Product Overview
**Name:** Zerofalse  
**Tagline:** Runtime Security for AI Agents  
**Target User:** Developers and security teams building AI agent applications

## Problem Statement
AI agents executing tool calls can be exploited through prompt injection, credential theft, and shell injection attacks. Zerofalse provides real-time inspection of every tool call to detect and block threats before they reach production systems.

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
│   │   └── detection_engine.py
│   ├── middleware/
│   └── schemas/
└── frontend/
    ├── src/
    │   ├── api/client.js
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── Topbar.jsx
    │   │   └── DarkModeToggle.jsx
    │   ├── context/AuthContext.jsx
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   └── useTheme.js
    │   ├── pages/
    │   │   ├── Landing.jsx (7 sections)
    │   │   ├── Signup.jsx
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── ScanLogs.jsx
    │   │   ├── Alerts.jsx
    │   │   ├── APIKeys.jsx
    │   │   ├── Settings.jsx
    │   │   ├── AIConfig.jsx (NEW)
    │   │   └── Docs.jsx (NEW)
    │   └── index.css (with dark mode)
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

### December 2025 - Major UI/UX Overhaul

#### Landing Page - 7 Complete Sections
1. **Hero Section** - Two-column layout with animated dashboard preview, stats bar, dual CTAs
2. **How It Works** - 4-step visual flow with numbered cards and connecting arrows
3. **Problem Section** - Dark navy background with 4 threat cards (Prompt Injection, Credential Theft, Shell Injection, Memory Poisoning)
4. **Solution Section** - Interactive demo widget with Safe/Attack tab switching, live scan results
5. **Dashboard Preview** - Full dashboard mockup with floating animation, animated stat counters
6. **Pricing Section** - 3 plans (Free, Starter, Growth) with Monthly/Annual toggle and "Save 20%" badge
7. **FAQ Section** - 7-question accordion with expand/collapse functionality
8. **Final CTA** - Dark gradient section with decorative blur circles
9. **Footer** - 4-column layout with Product, Resources, Company links and social icons

#### Dashboard Features
- **Dark Mode Toggle** - In Topbar, stores preference in localStorage, applies via data-theme attribute
- **AI Config Page** (`/ai-config`) - Model selection (Claude, GPT-4o, Gemini, Custom), API key configuration, detection performance stats
- **Docs Page** (`/docs`) - Full documentation with sticky TOC sidebar, code blocks with copy buttons, comprehensive SDK and API reference

#### Design System
- CSS variables for colors, typography, spacing, shadows
- Dark mode variables with smooth transitions
- Scroll animations with Intersection Observer
- Font: Inter for UI, JetBrains Mono for code
- 8px spacing grid

#### Pages Completed (All 10 pages)
1. Landing.jsx - 7 sections with animations
2. Signup.jsx - Split layout with branding
3. Login.jsx - Split layout with stats
4. Dashboard.jsx - Stats cards, charts, recent scans
5. ScanLogs.jsx - Searchable table with filters
6. Alerts.jsx - Status stats, filter options, detail modal
7. APIKeys.jsx - Create/revoke modals, copy functionality
8. Settings.jsx - 5-tab layout
9. AIConfig.jsx - AI model configuration (NEW)
10. Docs.jsx - Documentation with TOC (NEW)

#### Testing Status
- ✅ All 7 landing page sections render correctly
- ✅ Interactive elements (pricing toggle, FAQ accordion, demo widget tabs) work
- ✅ Dark mode toggle present and functional
- ✅ New AI Config and Docs pages fully functional
- ✅ All existing pages still work
- ✅ Navigation between all pages works

---

## Prioritized Backlog

### P0 - Critical
*No critical issues remaining*

### P1 - High Priority
- [ ] Create docker-compose.yml for containerization
- [ ] Create nginx/nginx.conf for proxy configuration
- [ ] End-to-end flow testing (signup → API key → scan)
- [ ] Connect AI Config page to actual AI model APIs

### P2 - Medium Priority
- [ ] Refactor rate limiting to use Redis (currently in-memory)
- [ ] Implement email sending for password resets
- [ ] Implement webhook sending logic for alerts
- [ ] Mobile responsive improvements

### P3 - Low Priority
- [ ] Two-factor authentication
- [ ] Session management UI
- [ ] Export functionality for scan logs
- [ ] Complete all Docs page sections

---

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
| /ai-config | AIConfig | Yes |
| /docs | Docs | Yes |
| /settings | Settings | Yes |

---

## Known Limitations
1. **Rate Limiting**: Currently using in-memory dictionary instead of Redis
2. **Email**: Password reset only logs token, no actual email sent
3. **Webhooks**: API endpoints exist but trigger logic not implemented
4. **2FA**: Marked as "Coming Soon" in Settings UI
5. **AI Config**: Model API connections are UI-only (not connected to backend yet)

---

## URLs
- Frontend: https://secure-agents-2.preview.emergentagent.com
- API Base: https://secure-agents-2.preview.emergentagent.com/api/v1
