<div align="center">

# 🔥 EventForge
### Enterprise Corporate Event & Conference Management Platform

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

A **full-stack, production-grade SaaS platform** for managing corporate events, conferences, and summits — with 6 role-based portals, AI-powered content generation, real-time QR ticket scanning, and a complete event lifecycle management system.

[Live Demo](#-live-demo) · [Features](#-features) · [Quick Start](#-quick-start) · [API Docs](#-api-reference) · [Tech Stack](#-tech-stack)

</div>

---

## 🎯 Overview

EventForge is a **MERN stack** corporate event management platform that handles every stage of an event — from creation and speaker management to ticket sales, sponsor deliverables, and real-time attendee check-in via QR codes.

The platform features **6 distinct role-based portals**, each with its own tailored dashboard, access controls, and workflows:

| Role | Portal Route | What they can do |
|------|-------------|-----------------|
| 🛡️ **Platform Admin** | `/dashboard/admin` | Global metrics, user management, organizations, revenue analytics |
| 📋 **Event Organizer** | `/dashboard/organizer` | Full event lifecycle, sessions, ticket tiers, sponsors, AI assistant |
| 🎤 **Speaker** | `/dashboard/speaker` | Session agenda, presentation materials, bio management, Q&A feedback |
| 🏆 **Sponsor** | `/dashboard/sponsor` | Sponsorship tiers, deliverables tracker, booth assignments |
| 🎟️ **Attendee** | `/dashboard/attendee` | Discovery, registration, AI session recommendations, QR ticket pass |
| 🔍 **Event Staff** | `/dashboard/staff` | Real-time QR scanner, attendee check-in, ticket validation |

---

## ✨ Features

### 🤖 AI Event Assistant (7 Generators)
Powered by **Groq LLaMA 3.1** with intelligent fallbacks:
- 📝 Event Description Generator
- 🗓️ Track & Session Outline Builder
- 📧 Speaker Invitation Email Writer
- 💼 Sponsor Pitch Deck & Tier Generator
- 📱 Social Media Campaign Posts (LinkedIn / Twitter)
- 📨 Attendee Welcome & Logistics Email
- 📊 Post-Event Survey & Feedback Questions

### 🎫 Advanced Ticketing System
- Multiple ticket tiers (General, VIP, Executive, Speaker)
- Coupon code validation with percentage/flat-rate discounts
- Auto-generated unique QR codes for each ticket
- Real-time inventory tracking and sold-out detection

### 🏟️ Multi-Room Session Scheduling
- Drag-free conflict detection for room double-booking
- Speaker overlap prevention across overlapping time intervals
- Multi-track conference schedules with room assignments
- Session capacity management

### 📊 Real-Time Analytics
- Platform-wide revenue, registrations, and conversion metrics
- Event-specific check-in rates and session attendance
- Recharts-powered visualizations with live MongoDB aggregations

### 🔒 JWT Role-Based Access Control
- Event-scoped authorization (Organizer A cannot access Organizer B's events)
- Middleware-level permission guards on every protected route
- Token refresh and secure session management

---

## 🎪 Flagship Demo Event

### TechNova Global Innovation Summit 2026
> *3-Day International Technology Conference • San Francisco, CA*

- **Venue**: Moscone Center — Silicon Hall & Quantum Lab
- **Tracks**: Keynote, AI/ML, Cybersecurity, Cloud Architecture, Workshops
- **Speakers**: Dr. Elena Rostova (AI), Marcus Vance (Quantum), Sarah Chen (Cloud), Dev Patel (Architecture)
- **Sponsors**: CloudScale Systems (Diamond), CyberVault Security (Platinum), DataStream AI (Gold)
- **Tickets**: General ($299), VIP ($799), Executive ($1,499), Speaker (Complimentary)
- **Active Coupons**:
  - `TECH2026` → 20% off all ticket tiers
  - `EARLY50` → $50 flat discount on VIP & Executive passes

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **npm** v9+
- **MongoDB Atlas** account (or local MongoDB)
- **Groq API Key** (optional — AI fallbacks work without it)

### 1. Clone the Repository
```bash
git clone https://github.com/sreemaye-2006/EventForge.git
cd EventForge
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/eventforge?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
GROQ_API_KEY=your_groq_api_key_here
CLIENT_URL=http://localhost:5173
```

Seed the database with demo data:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```
> Server runs at `http://localhost:5000`

### 3. Frontend Setup
```bash
cd ../client
npm install
```

Verify `client/.env`:
```env
VITE_API_URL=/api
```

Start the Vite dev server:
```bash
npm run dev
```
> App runs at `http://localhost:5173`

---

## 🔑 Demo Accounts

All demo accounts share the password: **`password123`**

> 💡 **Tip**: The login page has **1-click quick-fill buttons** for each role — no need to type credentials!

| Role | Email | Dashboard |
|------|-------|-----------|
| 🛡️ Platform Admin | `admin@example.com` | `/dashboard/admin` |
| 📋 Event Organizer | `organizer@example.com` | `/dashboard/organizer` |
| 🔍 Event Staff | `staff@example.com` | `/dashboard/staff` |
| 🎤 Keynote Speaker | `speaker@example.com` | `/dashboard/speaker` |
| 🏆 Diamond Sponsor | `sponsor@example.com` | `/dashboard/sponsor` |
| 🎟️ Registered Attendee | `attendee@example.com` | `/dashboard/attendee` |

---

## 📁 Project Structure

```
EventForge/
│
├── client/                          # React 18 + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── event/               # SessionManager, TicketTierManager, SponsorManager, Analytics
│   │   │   └── ui/                  # LoadingSkeleton, EmptyState, NotificationDropdown, Button
│   │   ├── layouts/
│   │   │   ├── DashboardLayout.jsx  # 6-role sidebar + notifications + mobile drawer
│   │   │   └── MainLayout.jsx       # Public pages wrapper
│   │   ├── pages/
│   │   │   ├── admin/               # AdminDashboard (metrics, users, orgs)
│   │   │   ├── attendee/            # EventDiscovery, EventDetails, RegistrationFlow,
│   │   │   │                        # AttendeeDashboard, MyTicket (QR pass)
│   │   │   ├── organizer/           # OrganizerDashboard, EventsList, EventForm,
│   │   │   │                        # ManageEvent, AIEventAssistant
│   │   │   ├── speaker/             # SpeakerDashboard
│   │   │   ├── sponsor/             # SponsorDashboard
│   │   │   ├── staff/               # StaffDashboard, QRScanner
│   │   │   └── public/              # LandingPage, LoginPage, RegisterPage
│   │   ├── services/
│   │   │   └── api.js               # Axios instance with JWT interceptor
│   │   ├── store/
│   │   │   └── authStore.js         # Zustand global auth state
│   │   ├── App.jsx                  # React Router v6 routes + RBAC guards
│   │   └── index.css                # TailwindCSS custom design tokens
│   ├── .env                         # VITE_API_URL=/api
│   └── vite.config.js               # Vite config + API proxy → :5000
│
└── server/                          # Node.js + Express + MongoDB Backend
    ├── src/
    │   ├── config/
    │   │   └── db.js                # MongoDB Atlas connection
    │   ├── controllers/             # Route handlers
    │   │   ├── ai.controller.js     # 7 AI content generators
    │   │   ├── analytics.controller.js  # Aggregation pipelines
    │   │   ├── auth.controller.js   # JWT register/login
    │   │   ├── coupon.controller.js # Discount code validation
    │   │   ├── event.controller.js  # CRUD + search/filter
    │   │   ├── notification.controller.js
    │   │   ├── registration.controller.js  # QR ticket generation
    │   │   ├── session.controller.js  # Conflict detection
    │   │   └── user.controller.js   # Admin user management
    │   ├── middleware/
    │   │   └── auth.js              # JWT verify + role + event-scope guards
    │   ├── models/                  # Mongoose schemas
    │   │   ├── Announcement.js      ├── Coupon.js
    │   │   ├── Deliverable.js       ├── Event.js
    │   │   ├── Feedback.js          ├── Notification.js
    │   │   ├── Organization.js      ├── Package.js
    │   │   ├── Registration.js      ├── Session.js
    │   │   ├── SessionAttendance.js ├── Speaker.js
    │   │   ├── Sponsor.js           ├── Ticket.js
    │   │   ├── User.js              └── Venue.js
    │   ├── routes/                  # Express router definitions
    │   ├── seed/
    │   │   └── seeder.js            # Full demo data seeder (run: npm run seed)
    │   ├── services/
    │   │   └── ai.service.js        # Groq SDK + template fallbacks
    │   └── app.js                   # Express app, CORS, route mounting
    ├── .env                         # Server environment variables
    └── package.json
```

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Create new account | ❌ |
| `POST` | `/api/auth/login` | Login & get JWT token | ❌ |
| `GET` | `/api/auth/me` | Get current user profile | ✅ |

### Events
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/events` | List all events (search, filter, paginate) | ❌ |
| `GET` | `/api/events/:id` | Full event detail with sessions, tickets, sponsors | ❌ |
| `POST` | `/api/events` | Create new event | Organizer |
| `PUT` | `/api/events/:id` | Update event | Organizer (owner) |
| `DELETE` | `/api/events/:id` | Delete event | Organizer (owner) |

### Sessions
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/sessions?eventId=:id` | List sessions for an event | ✅ |
| `POST` | `/api/sessions` | Create session (with conflict detection) | Organizer |
| `PUT` | `/api/sessions/:id` | Update session | Organizer |
| `DELETE` | `/api/sessions/:id` | Delete session | Organizer |

### Ticketing & Registration
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/coupons/validate` | Validate discount coupon code | ✅ |
| `POST` | `/api/registrations` | Register for event + generate QR ticket | ✅ |
| `GET` | `/api/registrations/my-tickets` | Get attendee's tickets with QR codes | Attendee |
| `POST` | `/api/registrations/verify-qr` | Staff: verify & check-in ticket by QR | Staff |

### AI Assistant
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/ai/generate` | Generate AI content (7 modes) | Organizer |

**Request body for `/api/ai/generate`:**
```json
{
  "type": "description",
  "eventName": "TechNova Summit 2026",
  "eventType": "Conference",
  "targetAudience": "Tech executives and developers"
}
```
`type` can be: `description`, `schedule`, `speaker-invite`, `sponsor-pitch`, `social-media`, `attendee-email`, `survey`

### Analytics
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/analytics/platform` | Platform-wide KPIs and trends | Admin |
| `GET` | `/api/analytics/event/:id` | Event-specific attendance & revenue | Organizer |

### Recommendations
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/recommendations/sessions?eventId=:id` | AI-scored session recommendations | Attendee |

### Admin: User Management
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/users` | List all platform users | Admin |
| `PATCH` | `/api/users/:id/role` | Update user role | Admin |
| `PATCH` | `/api/users/:id/status` | Activate / deactivate user | Admin |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework with hooks |
| **Vite 5** | Lightning-fast dev server & bundler |
| **React Router v6** | Client-side routing with nested routes |
| **TailwindCSS 3** | Utility-first styling with custom design tokens |
| **Zustand** | Lightweight global state management |
| **Axios** | HTTP client with JWT interceptors |
| **Recharts** | Analytics charts and data visualization |
| **Lucide React** | Consistent icon system |
| **React Hot Toast** | Toast notifications |
| **html5-qrcode** | Real-time camera QR code scanning |
| **qrcode.react** | QR code generation for tickets |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js 18+** | JavaScript runtime |
| **Express 4** | Web application framework |
| **MongoDB Atlas** | Cloud NoSQL database |
| **Mongoose** | ODM with schema validation |
| **JWT** | Stateless authentication tokens |
| **bcrypt** | Password hashing |
| **Groq SDK** | LLaMA AI content generation |
| **CORS** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |

---

## 🔐 Environment Variables

### Server (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_min_32_chars
GROQ_API_KEY=gsk_...          # Optional - AI works with fallbacks
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)
```env
VITE_API_URL=/api             # Uses Vite proxy - do not change for dev
```

---

## 🌐 Deployment

### Frontend (Vercel / Netlify)
```bash
cd client
npm run build
# Deploy the dist/ folder
```

Set environment variable on host:
```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend (Railway / Render / Heroku)
```bash
cd server
# Set all env vars in your hosting dashboard
npm start
```

Set `CLIENT_URL` to your deployed frontend URL to allow CORS.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   React SPA (Vite)                       │
│    ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │
│    │ Auth     │  │ Zustand  │  │  React Router v6  │    │
│    │ (JWT)    │  │  Store   │  │  Protected Routes  │    │
│    └──────────┘  └──────────┘  └──────────────────┘    │
│                     Axios (/api → proxy)                  │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP / REST
┌──────────────────────────▼──────────────────────────────┐
│              Express API Server (Node.js)                 │
│   ┌─────────┐  ┌──────────┐  ┌────────────────────┐    │
│   │  Auth   │  │  RBAC    │  │  Event-Scope Guard  │    │
│   │  JWT    │  │Middleware│  │  (per-organizer)    │    │
│   └─────────┘  └──────────┘  └────────────────────┘    │
│                                                          │
│   Controllers → Services → Models (Mongoose)             │
│                     │                                    │
│              ┌──────▼──────┐                            │
│              │  Groq AI    │  (llama-3.1-8b-instant)   │
│              └─────────────┘                            │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                  MongoDB Atlas                            │
│   Users · Events · Sessions · Tickets · Registrations   │
│   Speakers · Sponsors · Coupons · Analytics · Feedback  │
└─────────────────────────────────────────────────────────┘
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ using the MERN Stack + Groq AI

**[⭐ Star this repo](https://github.com/sreemaye-2006/EventForge)** if you find it useful!

</div>
