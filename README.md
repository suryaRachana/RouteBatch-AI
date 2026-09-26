# RouteBatch-AI — AI-Powered Route Optimization for Field Workers

> **Hackathon-Ready Production-Grade Full-Stack Logistics Application**

RouteBatch-AI is an intelligent, full-stack route optimization and dispatch assistant designed for field workers, service technicians, and delivery drivers. It eliminates manual routing chaos by combining spatial 2-Opt optimization algorithms, real-time OpenStreetMap address geocoding, interactive Leaflet mapping, and a backend-secured AI Route Assistant.

---

## 🚀 Key Features

1. **User Authentication & Session Management**:
   - Secure HTTP-only cookie-based authentication (`/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`).
   - Protected field worker dashboard.

2. **Complete Field Task Management**:
   - Add, edit, delete, and toggle completion of field stops.
   - Priority tagging (`Low`, `Medium`, `High`), address entry, deadline tracking, and custom field notes.
   - Responsive form modal with real-time address validation.

3. **Offline-Friendly LocalStorage Task Persistence**:
   - Instant loading from `localStorage` on startup so field workers never lose task data during spotty network connections.
   - Automatically syncs all task mutations to `localStorage`.

4. **Address Geocoding via OpenStreetMap / Nominatim**:
   - Geocodes plain-text street addresses into latitude and longitude coordinates.
   - Includes custom `User-Agent` headers and client-side caching to respect API usage policy.

5. **Spatial Route Optimization Algorithm**:
   - **Haversine Distance**: Reusable utility calculating great-circle distance in kilometers between geographic coordinates.
   - **Nearest-Neighbor + 2-Opt Local Search**: Algorithmic sequencing that eliminates path crossings and minimizes total drive distance and travel time.
   - Priority-weighted initial selection ensuring urgent stops receive precedence.

6. **Route Summary & Metrics**:
   - Real-time total distance (km), estimated travel time (mins/hrs based on 35 km/h field speed + service buffer), and optimized sequence order.

7. **Interactive Leaflet Map**:
   - OpenStreetMap tile layer with custom numbered stop markers color-coded by priority (`High` = Red, `Medium` = Amber, `Low` = Sky).
   - Dynamic polyline connecting stops in optimized order.
   - Interactive popups with stop details and map auto-fit bounds.

8. **AI Route Assistant**:
   - Secure backend endpoint (`POST /api/ai/route-advice`) calling OpenAI API (`gpt-3.5-turbo`) or fallback dispatch intelligence engine.
   - Provides priority callouts, deadline conflict checks, and tactical field recommendations.
   - **Zero AI API Key Leakage**: OpenAI keys exist strictly inside backend environment variables.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3 + Lucide-React Icons
- **Routing**: React Router DOM v6
- **Mapping**: Leaflet + React-Leaflet + OpenStreetMap
- **State & Storage**: React Context + LocalStorage API

### Backend
- **Runtime**: Node.js + Express + TypeScript
- **Database ORM**: Prisma ORM (SQLite for local zero-config, PostgreSQL/Supabase compatible)
- **Security**: bcryptjs password hashing, JWT in HTTP-only cookies, CORS with credentials
- **AI Integration**: OpenAI Node SDK (`AI_API_KEY` stored exclusively in backend `.env`)

---

## 📁 Folder Structure

```
RouteBatch-AI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── TaskFormModal.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── RouteSummary.tsx
│   │   │   ├── MapView.tsx
│   │   │   └── AIAssistant.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── DashboardPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── geocoding.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── haversine.ts
│   │   │   ├── optimizer.ts
│   │   │   └── storage.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   └── auth.routes.ts
│   │   │   └── ai/
│   │   │       ├── ai.controller.ts
│   │   │       └── ai.routes.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts
│   │   ├── utils/
│   │   │   └── prisma.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── README.md
└── .gitignore
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
DATABASE_URL="file:./dev.db"
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key_here
AI_API_KEY=your_openai_api_key_here
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000
```

> 🔒 **Security Warning**: `AI_API_KEY` is exclusively placed in `backend/.env`. It is never prefixed with `VITE_` or exposed to frontend code.

---

## 🚦 Local Setup & Installation

### 1. Clone & Setup Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run build
```

### 2. Setup Frontend
```bash
cd ../frontend
npm install
npm run build
```

---

## 🏃 Running the Application

### Start Backend (Port 5000)
```bash
cd backend
npm run dev
# or for compiled production execution:
npm start
```

### Start Frontend (Port 5173)
```bash
cd frontend
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🌐 API Endpoint Specifications

### Authentication Routes
- `POST /api/auth/register` — Registers a new user with name, email, and password. Sets HTTP-only cookie.
- `POST /api/auth/login` — Authenticates user credentials. Sets HTTP-only cookie.
- `POST /api/auth/logout` — Clears authentication session cookie.
- `GET /api/auth/me` — Returns current authenticated user profile (Protected).

### AI Assistant Routes
- `POST /api/ai/route-advice` — Accepts tasks, distance, travel time, and user query. Returns structured markdown field advice (Protected).

---

## 🧪 Math & Algorithm Deep Dive

### 1. Haversine Formula (`src/utils/haversine.ts`)
Calculates geographic distance on a sphere:
$$a = \sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1) \cdot \cos(\phi_2) \cdot \sin^2\left(\frac{\Delta \lambda}{2}\right)$$
$$c = 2 \cdot \mathrm{atan2}\left(\sqrt{a}, \sqrt{1-a}\right)$$
$$d = R \cdot c$$
where $R = 6371\text{ km}$.

### 2. 2-Opt Optimization (`src/utils/optimizer.ts`)
1. **Initial Tour**: Nearest-Neighbor traversal weighted by stop priority.
2. **2-Opt Local Search**: Iteratively selects edge pairs $(i, i+1)$ and $(k, k+1)$ and tests swapping them to reverse sub-segments whenever $\Delta \text{distance} < 0$, untangling crossed paths.

---

## 🛡️ Hackathon Verification Audit Checklist

- [x] Landing page with hero section & CTAs
- [x] Real backend user registration & login
- [x] Protected dashboard with redirect guards
- [x] Real backend logout clearing cookies
- [x] Full task CRUD (Add, Edit, Delete, Toggle Complete)
- [x] Offline LocalStorage persistence across refreshes
- [x] OpenStreetMap Nominatim address geocoding
- [x] Reusable Haversine distance utility
- [x] Nearest-Neighbor + 2-Opt route optimization
- [x] Total distance & travel time metrics displayed
- [x] Interactive Leaflet map with priority-colored pins
- [x] Polyline connecting optimized route sequence
- [x] Map empty/loading/error states
- [x] AI Route Assistant panel & prompt suggestions
- [x] Backend-only AI API key security
- [x] Responsive layout on desktop, tablet, and mobile
- [x] Production build verification (`npm run build` frontend & backend)
