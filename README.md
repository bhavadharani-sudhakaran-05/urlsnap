# LinkSnap — Production-Ready MERN URL Shortener with Analytics

A full-stack URL shortening platform with JWT authentication, click analytics, QR codes, custom aliases, expiry links, and a modern SaaS dashboard built with React and Tailwind CSS.



---

## 1. Project Overview

**LinkForge** lets users register, shorten URLs, track detailed visit analytics (browser, device, geo, daily trends), generate QR codes, and manage links from a responsive dashboard. The backend is a secure Express REST API; data is stored in MongoDB via Mongoose.

---

## 2. Features

### Core
- User registration & login (JWT)
- Protected routes — users only access their own URLs
- bcrypt password hashing
- Create, read, update, delete short URLs
- Unique short codes + custom aliases
- URL validation before save
- Redirect with click tracking
- Expired link handling (HTTP 410)

### Analytics
- Total clicks, last visit
- Daily click trend charts
- Browser & device distribution (Recharts)
- Country & city breakdown
- Recent visits table

### Bonus
- Custom aliases
- QR code generation (view & download)
- Link expiry dates
- Public statistics page
- Edit URLs
- CSV bulk URL upload

### Security
- Helmet, CORS, rate limiting
- express-validator input validation
- express-mongo-sanitize (NoSQL injection protection)
- JWT middleware on protected routes

---

## 3. Architecture Diagram

```mermaid
flowchart TB
    subgraph Client["React Frontend (Vite)"]
        Pages[Pages: Login, Dashboard, Analytics]
        Ctx[Auth & Toast Context]
        API[Axios API Layer]
    end

    subgraph Server["Node.js / Express"]
        AuthR[/api/auth]
        UrlR[/api/url]
        AnR[/api/analytics]
        PubR[/api/public]
        Redir[GET /:shortCode]
        MW[Helmet · CORS · Rate Limit · JWT]
    end

    subgraph DB["MongoDB"]
        UserM[(User)]
        UrlM[(ShortUrl)]
        VisitM[(Visit)]
    end

    Pages --> Ctx --> API
    API --> MW --> AuthR & UrlR & AnR & PubR
    Redir --> VisitM
    Redir --> UrlM
    AuthR --> UserM
    UrlR --> UrlM
    AnR --> VisitM
    AnR --> UrlM
```

---

## 4. Folder Structure

```
.
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── urlController.js
│   │   ├── analyticsController.js
│   │   ├── redirectController.js
│   │   └── publicController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── models/
│   │   ├── User.js
│   │   ├── ShortUrl.js
│   │   └── Visit.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── urlRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── publicRoutes.js
│   ├── services/
│   │   ├── urlService.js
│   │   ├── analyticsService.js
│   │   └── qrService.js
│   ├── utils/
│   ├── app.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── layouts/
│       ├── pages/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
├── docs/
│   └── AI_PLANNING.md
└── README.md
```

---

## 5. API Documentation

Base URL: `http://localhost:5000`

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register `{ name, email, password }` |
| POST | `/api/auth/login` | No | Login `{ email, password }` |
| GET | `/api/auth/profile` | Yes | Get current user profile |

### URLs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/url/create` | Yes | Create `{ originalUrl, customAlias?, expiryDate? }` |
| GET | `/api/url/all` | Yes | List user's URLs |
| GET | `/api/url/:id` | Yes | Get single URL |
| PUT | `/api/url/:id` | Yes | Update URL |
| DELETE | `/api/url/:id` | Yes | Delete URL |
| POST | `/api/url/bulk` | Yes | Bulk create `{ csv: "..." }` |

### Analytics

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/analytics/:id` | Yes | Full analytics for URL (by MongoDB id) |

### Public

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/public/stats/:shortCode` | No | Public click stats |

### Redirect

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/:shortCode` | No | Redirect + record visit |

**Auth header:** `Authorization: Bearer <token>`

---

## 6. Environment Variables

### Backend (`backend/.env`)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/url-shortener
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
BASE_URL=http://localhost:5000
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 7. Installation Steps

### Prerequisites
- Node.js 18+
- MongoDB running locally or Atlas connection string

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT_SECRET
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:5173** — register an account and start shortening URLs.

---

## 8. Deployment Guide

### Backend (e.g. Render / Railway / VPS)

1. Set environment variables on the host
2. Use MongoDB Atlas for `MONGODB_URI`
3. Set `BASE_URL` to your API domain (e.g. `https://api.linkforge.app`)
4. Set `CLIENT_URL` to your frontend URL
5. Run `npm start`

### Frontend (e.g. Vercel / Netlify)

1. Set `VITE_API_URL=https://your-api.com/api`
2. Run `npm run build`
3. Deploy `dist/` folder
4. Configure SPA fallback to `index.html`

### Production checklist
- [ ] Strong `JWT_SECRET`
- [ ] HTTPS everywhere
- [ ] MongoDB Atlas IP whitelist
- [ ] Rate limits tuned for traffic
- [ ] `NODE_ENV=production`

---

## 9. AI Planning Document

See [docs/AI_PLANNING.md](docs/AI_PLANNING.md) for architecture decisions, phases, and risk mitigation.

---

## 10. Assumptions

- MongoDB is available at install time
- GeoIP accuracy is approximate (geoip-lite offline DB)
- `BASE_URL` must match the public API host used in short links
- CSV bulk upload expects header row: `originalUrl`, `customAlias`, `expiryDate`
- Local development uses Vite proxy for `/api` when `VITE_API_URL` is unset

---

## 11. Screenshots

| Page | Path |
|------|------|
| Dashboard | `docs/screenshots/dashboard-placeholder.png` |
| Analytics | `docs/screenshots/analytics-placeholder.png` |
| Create URL | `docs/screenshots/create-placeholder.png` |

> Add your screenshots to `docs/screenshots/` after running the app.

---

## 12. Demo Video

- **Loom:** [Add your Loom demo link here]
- **YouTube:** [Add your YouTube demo link here]

---

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React, React Router, Axios, Context API, Tailwind CSS, Recharts, react-qr-code |
| Backend | Node.js, Express, Mongoose, JWT, bcrypt, Helmet, express-rate-limit |
| Database | MongoDB |

---

## License

MIT

---

This project is a part of a hackathon run by https://katomaran.com
