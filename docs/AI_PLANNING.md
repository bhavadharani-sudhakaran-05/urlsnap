# AI Planning Document — LinkForge URL Shortener

## 1. Problem Statement

Build a production-ready MERN stack URL shortener that allows authenticated users to create, manage, and analyze short links with enterprise-grade security and a modern SaaS dashboard UI.

## 2. Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State management | React Context API | Sufficient for auth + toasts; avoids Redux boilerplate for this scope |
| Auth | JWT (Bearer) | Stateless, standard for SPA + REST APIs |
| Short code generation | Crypto random + optional custom alias | Balance between collision resistance and branding |
| Analytics storage | Separate `Visit` collection | Normalized schema; efficient aggregation per link |
| Geo detection | geoip-lite | Offline, no external API dependency |
| QR codes | qrcode (backend) + react-qr-code (frontend) | Server stores base64; client can render/download |
| Security | Helmet, CORS, rate limit, mongo-sanitize, express-validator | Defense in depth |

## 3. Data Flow

1. User registers/logs in → JWT stored in localStorage
2. Create URL → validate → generate code → QR → save `ShortUrl`
3. Visitor hits `/:shortCode` → check expiry → record `Visit` → redirect
4. Owner views analytics → aggregate visits by day/browser/device/geo

## 4. Implementation Phases

### Phase 1 — Backend Foundation
- MongoDB models (User, ShortUrl, Visit)
- Auth controllers + JWT middleware
- URL CRUD + redirect handler

### Phase 2 — Analytics & Security
- Visit recording on redirect
- Analytics aggregation service
- Helmet, rate limiting, validation

### Phase 3 — Frontend Core
- Auth pages, protected routes, dashboard layout
- URL management UI

### Phase 4 — Analytics UI & Bonus
- Recharts integration
- QR modal, bulk CSV, public stats page

## 5. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Alias collisions | Unique index on `shortCode` + pre-check |
| Expired links served | Date check before redirect (410) |
| Auth bypass | `userId` filter on all URL/analytics queries |
| Rate abuse | express-rate-limit on API + stricter auth limiter |
| Invalid URLs | validator.js normalization |

## 6. Future Enhancements

- Team workspaces / shared links
- OAuth (Google, GitHub)
- Custom domains per user
- Webhook notifications on milestones
- Redis cache for hot redirects
