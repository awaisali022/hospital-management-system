<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00C49A,100:0066FF&height=200&section=header&text=DoctorHub%20AI&fontSize=60&fontColor=ffffff&fontAlignY=38&desc=Enterprise%20Healthcare%20Ecosystem&descAlignY=60&descColor=ffffff&animation=fadeIn" width="100%"/>

# 🏥 DoctorHub AI

### _Enterprise-Grade AI-Powered Healthcare Platform_

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Coming_Soon-00C49A?style=for-the-badge)](https://github.com/awaisali022/hospital-management-system)
[![GitHub](https://img.shields.io/badge/GitHub-awaisali022-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/awaisali022/hospital-management-system)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge&logo=github)](CONTRIBUTING.md)

---

> **DoctorHub AI** is a full-stack, enterprise-grade healthcare platform built with clean architecture principles. It features a **5-role RBAC** permission system, **AI-powered symptom checking**, real-time WebRTC video consultations, immutable PDF prescriptions with QR verification, and a stunning glassmorphism UI with 12+ dynamic themes.

**[📧 Contact Developer](mailto:awais.cuvi@gmail.com)** · **[🐛 Report Bug](https://github.com/awaisali022/hospital-management-system/issues/new?template=bug_report.md)** · **[✨ Request Feature](https://github.com/awaisali022/hospital-management-system/issues/new?template=feature_request.md)**

</div>

---

## 📋 Table of Contents

- [🔑 Demo Accounts](#-demo-accounts)
- [✨ Key Features](#-key-features)
- [🏛️ System Architecture](#️-system-architecture)
- [📊 Database Schema](#-database-schema-erd)
- [🔐 RBAC Permission Matrix](#-rbac-permission-matrix)
- [🤖 AI Capabilities](#-ai-capabilities)
- [🔄 Appointment Workflow](#-appointment-workflow)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚡ Quick Start](#-quick-start)
- [🌱 Database Seeding](#-database-seeding)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📬 Contact](#-contact)

---

## 🔑 Demo Accounts

> **Try the platform instantly with these pre-configured test accounts:**

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| 🔴 **Super Admin** | `admin@doctorhub.local` | `Admin@123` | Full system control — all 24 permissions |
| 🟠 **Admin** | `admin2@doctorhub.local` | `Admin@123` | User management, doctor verification, analytics |
| 🟢 **Doctor** | `doctor@doctorhub.local` | `Doctor@123` | Patient records, prescriptions, analytics dashboard |
| 🔵 **Patient** | `patient@doctorhub.local` | `Patient@123` | Book appointments, view records, AI health chat |
| 🟡 **Assistant** | `assistant@doctorhub.local` | `Assistant@123` | Payment verification, queue management |

> [!TIP]
> Register a new account to experience the full onboarding flow, or use the demo accounts above to explore each role's unique dashboard immediately.

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🎨 Frontend Highlights
- 🌗 **12+ Dynamic Themes** — Glassmorphism UI with live theme switcher
- 🧊 **3D Interactive Hero** — Three.js medical models with parallax scrolling
- 📱 **Fully Responsive** — Mobile-first design with adaptive layouts
- ⚡ **Framer Motion** — Smooth page transitions & polished micro-animations
- 🧠 **AI Chatbot Widget** — Intelligent symptom checker & health assistant
- 🔔 **Real-Time Notifications** — Live in-app notification system via Socket.io

</td>
<td width="50%">

### ⚙️ Backend Highlights
- 🔐 **5-Role RBAC** — Granular 24-permission system across all user roles
- 🔑 **Hybrid Auth** — Stateless JWT + Supabase authentication
- 📄 **PDF Generation** — Immutable prescriptions with embedded QR verification
- 💬 **Real-Time** — Socket.io messaging & WebRTC video consultations
- 🗄️ **MongoDB Atlas** — Cloud-hosted database with Mongoose ODM
- 🛡️ **Security Hardened** — Helmet, rate-limiting, XSS protection, mongo-sanitize

</td>
</tr>
</table>

---

## 🏛️ System Architecture

```mermaid
graph TD
  User["👤 User Browser"]

  subgraph Frontend["🖥️ Frontend — React 19 / Vite / TypeScript"]
    UI["🎨 Theme System<br/>12+ Glassmorphism Themes"]
    Three["🧊 Three.js<br/>3D Hero Canvas"]
    State["📦 Zustand Stores<br/>Auth / Theme / Chat"]
    Router["🔀 React Router v7<br/>Protected Routes"]
    RQuery["⚡ React Query v5<br/>Server State Cache"]
  end

  subgraph Backend["⚙️ Backend — Express / Node.js / TypeScript"]
    Controller["📡 Express Controllers<br/>Zod Validation"]
    Auth["🔐 Auth Middleware<br/>JWT + RBAC"]
    Service["🧩 Application Services<br/>Booking / Payment / AI"]
    PDF["📄 PdfService<br/>PDFKit + QR Codes"]
    Storage["☁️ StorageService<br/>Cloudinary / Supabase"]
    Realtime["💬 SocketServer<br/>Chat + Video WebRTC"]
  end

  subgraph Database["🗄️ Data Layer"]
    Mongo[("🍃 MongoDB Atlas<br/>23 Collections")]
    Supabase["🔑 Supabase<br/>Auth + Storage"]
  end

  User --> UI
  UI --> Three
  UI --> Router
  Router --> State
  State --> RQuery
  RQuery --> Controller
  Controller --> Auth
  Auth --> Service
  Service --> PDF
  Service --> Storage
  Service --> Realtime
  Service --> Mongo
  Auth --> Supabase
  Storage --> Supabase
```

### 🧱 Clean Architecture Layers

```
Domain Layer       → Business rules, roles, permissions, healthcare invariants
Application Layer  → Use cases and orchestration services (Appointment, Medical, Audit)
Infrastructure     → MongoDB adapters, AI provider, Cloudinary, Socket.io
Interfaces         → Express HTTP controllers, middleware, routes
Frontend           → Feature-based React modules with role-aware dashboards
```

> [!NOTE]
> **Medical history and prescriptions are append-only** — records are never mutated post-creation. Every sensitive action generates an immutable audit log entry.

---

## 📊 Database Schema (ERD)

```mermaid
erDiagram
  USERS {
    ObjectId _id PK
    string email UK
    string firstName
    string lastName
    enum role "patient | doctor | assistant | admin | super_admin"
    boolean isActive
    date createdAt
  }

  DOCTORS {
    ObjectId _id PK
    ObjectId userId FK
    string pmcNumber
    array specializations
    number consultationFee
    string city
    boolean isVerified
  }

  PATIENTS {
    ObjectId _id PK
    ObjectId userId FK
    date dateOfBirth
    string gender
    string bloodGroup
    array allergies
  }

  APPOINTMENTS {
    ObjectId _id PK
    ObjectId patientId FK
    ObjectId doctorId FK
    ObjectId clinicId FK
    date appointmentDate
    enum status "pending | confirmed | completed | cancelled"
    string chiefComplaint
  }

  PRESCRIPTIONS {
    ObjectId _id PK
    ObjectId appointmentId FK
    array medications
    string instructions
    string pdfUrl
    string qrCode
  }

  MEDICAL_HISTORY {
    ObjectId _id PK
    ObjectId patientId FK
    ObjectId doctorId FK
    string diagnosis
    array symptoms
    object vitals
  }

  CLINICS {
    ObjectId _id PK
    ObjectId doctorId FK
    string name
    string city
    string address
  }

  SCHEDULES {
    ObjectId _id PK
    ObjectId doctorId FK
    ObjectId clinicId FK
    number dayOfWeek
    string startsAt
    string endsAt
  }

  PAYMENTS {
    ObjectId _id PK
    ObjectId appointmentId FK
    number amount
    enum status "pending | verified | rejected"
    string proofUrl
  }

  CHATS {
    ObjectId _id PK
    array participants
    string lastMessage
    date updatedAt
  }

  MESSAGES {
    ObjectId _id PK
    ObjectId chatId FK
    ObjectId senderId FK
    string content
    date timestamp
  }

  USERS ||--o| DOCTORS : "has profile"
  USERS ||--o| PATIENTS : "has profile"
  DOCTORS ||--o{ CLINICS : "owns"
  DOCTORS ||--o{ SCHEDULES : "sets"
  CLINICS ||--o{ SCHEDULES : "has"
  PATIENTS ||--o{ APPOINTMENTS : "books"
  DOCTORS ||--o{ APPOINTMENTS : "receives"
  CLINICS ||--o{ APPOINTMENTS : "at"
  APPOINTMENTS ||--o| PAYMENTS : "requires"
  APPOINTMENTS ||--o| PRESCRIPTIONS : "generates"
  APPOINTMENTS ||--o{ MEDICAL_HISTORY : "creates"
  USERS ||--o{ CHATS : "participates"
  CHATS ||--o{ MESSAGES : "contains"
```

---

## 🔐 RBAC Permission Matrix

```mermaid
graph LR
  subgraph Roles["🎭 System Roles"]
    SA["🔴 Super Admin<br/>ALL 24 Permissions"]
    AD["🟠 Admin<br/>5 Permissions"]
    DR["🟢 Doctor<br/>9 Permissions"]
    PT["🔵 Patient<br/>10 Permissions"]
    AS["🟡 Assistant<br/>4 Permissions"]
  end

  subgraph Permissions["🔑 Permission Scopes"]
    P1["profile:manage"]
    P2["appointments:create / manage"]
    P3["payments:create / verify"]
    P4["prescriptions:create / read"]
    P5["medical_history:read / append"]
    P6["users:manage"]
    P7["analytics:doctor / platform"]
    P8["security:manage / settings:manage"]
    P9["chat:use / ai:use"]
    P10["audit_logs:read"]
  end

  SA --> P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 & P9 & P10
  AD --> P6 & P7 & P2
  DR --> P1 & P2 & P4 & P5 & P7 & P9
  PT --> P1 & P2 & P3 & P5 & P9
  AS --> P2 & P3 & P9
```

| Permission | Patient | Doctor | Assistant | Admin | Super Admin |
|------------|:-------:|:------:|:---------:|:-----:|:-----------:|
| `profile:manage` | ✅ | ✅ | — | — | ✅ |
| `appointments:create` | ✅ | — | — | — | ✅ |
| `appointments:manage_own` | ✅ | ✅ | — | — | ✅ |
| `appointments:verify` | — | — | ✅ | — | ✅ |
| `appointments:manage_all` | — | — | — | ✅ | ✅ |
| `payments:create` | ✅ | — | — | — | ✅ |
| `payments:verify` | — | — | ✅ | — | ✅ |
| `prescriptions:create` | — | ✅ | — | — | ✅ |
| `prescriptions:read_own` | ✅ | — | — | — | ✅ |
| `medical_history:read_own` | ✅ | — | — | — | ✅ |
| `medical_history:read_assigned` | — | ✅ | — | — | ✅ |
| `medical_history:append` | — | ✅ | — | — | ✅ |
| `reports:upload` | ✅ | — | — | — | ✅ |
| `reports:manage` | — | — | ✅ | ✅ | ✅ |
| `doctors:read` | ✅ | ✅ | — | — | ✅ |
| `doctors:manage` | — | — | — | ✅ | ✅ |
| `users:manage` | — | — | — | ✅ | ✅ |
| `chat:use` | ✅ | ✅ | ✅ | — | ✅ |
| `ai:use` | ✅ | ✅ | — | — | ✅ |
| `analytics:doctor` | — | ✅ | — | — | ✅ |
| `analytics:platform` | — | — | — | ✅ | ✅ |
| `security:manage` | — | — | — | — | ✅ |
| `settings:manage` | — | — | — | — | ✅ |
| `audit_logs:read` | — | — | — | — | ✅ |

---

## 🤖 AI Capabilities

DoctorHub AI integrates Claude (Anthropic) as the AI backbone, powering five intelligent endpoints:

| Endpoint | Description | Auth Required |
|----------|-------------|:---:|
| `POST /ai/chatbot` | General healthcare Q&A assistant | ✅ |
| `POST /ai/symptom-checker` | Symptom analysis with triage guidance | ✅ |
| `POST /ai/recommend-doctors` | Specialty-based doctor suggestions | ✅ |
| `POST /ai/report-analyzer` | Medical report interpretation | ✅ |
| `POST /ai/prescription-summarizer` | Plain-language prescription summaries | ✅ |

> [!IMPORTANT]
> All AI features include mandatory disclaimers — the AI provides **guidance only** and must never diagnose or prescribe. This is enforced at the service layer.

---

## 🔄 Appointment Workflow

```mermaid
stateDiagram-v2
  [*] --> PendingPayment: Patient Books Slot
  PendingPayment --> SubmittedPayment: Patient Uploads Proof
  SubmittedPayment --> Verified: Assistant Verifies ✅
  SubmittedPayment --> Rejected: Assistant Rejects ❌
  Rejected --> SubmittedPayment: Patient Re-uploads
  Verified --> Confirmed: System Confirms
  Confirmed --> InProgress: Doctor Starts Consultation
  InProgress --> Completed: Doctor Ends + Records
  Completed --> PDFGenerated: System Generates PDF
  PDFGenerated --> [*]: Stored in Cloud

  note right of Confirmed
    WebRTC Video Room Opens
    Text Chat Cabinet Activates
  end note

  note right of PDFGenerated
    Immutable PDF with QR Code
    Stored in Cloudinary / Supabase
  end note
```

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React + TypeScript | 19 / 5.7 | UI Framework |
| **Build Tool** | Vite | 6 | Dev server & bundler |
| **Styling** | Tailwind CSS + Glassmorphism | 3.4 | Responsive design system |
| **3D Graphics** | Three.js | 0.172 | Interactive hero section |
| **Animations** | Framer Motion + GSAP | 11 / 3.12 | Page transitions & animations |
| **State** | Zustand + React Query | 5 / 5 | Client & server state |
| **Routing** | React Router | v7 | SPA navigation |
| **Forms** | React Hook Form + Zod | 7 / 3 | Form validation |
| **Backend** | Express.js + TypeScript | 4.21 / 5.7 | REST API server |
| **Auth** | JWT + Supabase | — | Hybrid authentication |
| **Database** | MongoDB Atlas + Mongoose | 8.9 | Data persistence |
| **Storage** | Cloudinary + Supabase | — | File & image hosting |
| **Real-Time** | Socket.io + WebRTC | 4.8 | Chat & video calls |
| **PDF** | PDFKit + QRCode | 0.18 | Medical record generation |
| **AI Provider** | Anthropic Claude | — | AI health assistant |
| **Validation** | Zod | 3.24 | Schema validation |
| **Testing** | Vitest | 3 | Unit & integration testing |
| **Security** | Helmet + Rate Limiter | — | API hardening |
| **Frontend Deploy** | Vercel | — | CDN + edge |
| **Backend Deploy** | Railway / Render | — | Container deployment |

---

## 📁 Project Structure

```
hospital-management-system/
├── 📂 frontend/                      # React 19 + Vite + TypeScript
│   ├── 📄 index.html
│   ├── 📄 vite.config.ts
│   ├── 📄 tailwind.config.ts
│   └── 📂 src/
│       ├── 📂 app/                   # App entry & router setup
│       ├── 📂 components/            # Reusable UI components
│       │   ├── 📂 layout/            #   Shell, Navbar, Sidebar
│       │   └── 📂 ui/                #   Button, Panel, Input, Modal
│       ├── 📂 features/              # Feature-based modules
│       │   ├── 📂 auth/              #   Login / Register pages
│       │   ├── 📂 dashboards/        #   5 Role-specific dashboards
│       │   ├── 📂 doctors/           #   Doctor listing & profiles
│       │   ├── 📂 ai/                #   AI Chatbot & Symptom Checker
│       │   └── 📂 public/            #   Landing page (3D Hero)
│       ├── 📂 stores/                # Zustand global state
│       ├── 📂 lib/                   # API client & utilities
│       └── 📄 index.css              # Theme system (12+ themes)
│
├── 📂 backend/                       # Express + TypeScript (Clean Architecture)
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 .env.example
│   ├── 📂 src/
│   │   ├── 📄 app.ts                 # Express app factory
│   │   ├── 📄 server.ts              # HTTP + Socket.io server bootstrap
│   │   ├── 📂 domain/                # 🧠 Business Rules & Invariants
│   │   │   └── 📂 entities/          #   roles.ts — RBAC definitions
│   │   ├── 📂 application/           # 📋 Use Case Services
│   │   │   └── 📂 services/          #   AppointmentService, MedicalRecordService
│   │   │                             #   AuditService, NotificationService
│   │   ├── 📂 infrastructure/        # 🔌 External Adapters
│   │   │   ├── 📂 database/          #   MongoDB connection & 8 Mongoose models
│   │   │   ├── 📂 ai/                #   Anthropic Claude integration
│   │   │   ├── 📂 realtime/          #   Socket.io server
│   │   │   └── 📂 storage/           #   Cloudinary / Supabase adapters
│   │   ├── 📂 interfaces/            # 🌐 HTTP Layer
│   │   │   └── 📂 http/
│   │   │       ├── 📂 controllers/   #   Auth, Doctor, Appointment, Medical, AI
│   │   │       ├── 📂 middleware/    #   auth, rbac, validate
│   │   │       └── 📂 routes/        #   index.ts — all API routes
│   │   ├── 📂 config/                # Environment & Zod config validation
│   │   ├── 📂 shared/                # Shared utilities & types
│   │   └── 📂 types/                 # Global TypeScript types
│   ├── 📂 scripts/                   # Database seeding scripts
│   └── 📂 tests/                     # Vitest test suites
│
├── 📂 docs/                          # Project documentation
│   ├── 📄 ARCHITECTURE.md            # Clean architecture overview
│   ├── 📄 ERD.md                     # Entity Relationship Diagram
│   ├── 📄 API.md                     # REST API reference
│   └── 📄 DEPLOYMENT.md              # Step-by-step deployment guide
│
├── 📂 .github/
│   ├── 📂 workflows/
│   │   └── 📄 ci.yml                 # GitHub Actions CI pipeline
│   ├── 📂 ISSUE_TEMPLATE/
│   │   ├── 📄 bug_report.md
│   │   └── 📄 feature_request.md
│   └── 📄 PULL_REQUEST_TEMPLATE.md
│
├── 📄 package.json                   # Monorepo workspace (npm workspaces)
├── 📄 vercel.json                    # Frontend deployment config
├── 📄 railway.toml                   # Backend Railway deployment
├── 📄 render.yaml                    # Backend Render deployment alternative
├── 📄 CONTRIBUTING.md                # Contribution guide
├── 📄 CODE_OF_CONDUCT.md             # Community standards
├── 📄 SECURITY.md                    # Security policy
├── 📄 CHANGELOG.md                   # Version history
├── 📄 LICENSE                        # MIT License
└── 📄 README.md                      # You are here! 👋
```

---

## ⚡ Quick Start

### Prerequisites

| Tool | Minimum Version |
|------|----------------|
| **Node.js** | v20+ |
| **npm** | v9+ |
| **MongoDB Atlas** | Account (or local MongoDB) |
| **Supabase** | Account (for Auth & Storage) |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/awaisali022/hospital-management-system.git
cd hospital-management-system

# 2. Install all dependencies (monorepo workspace)
npm install

# 3. Configure environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit both .env files with your credentials

# 4. Start development servers (run in separate terminals)
npm run dev:backend    # → http://localhost:5000
npm run dev:frontend   # → http://localhost:5173
```

### Environment Variables

**`backend/.env`** — key variables to configure:

```env
NODE_ENV=development
PORT=5000

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/doctorhub

# JWT secrets — generate with: openssl rand -hex 32
JWT_ACCESS_SECRET=your-256-bit-secret-here
JWT_REFRESH_SECRET=your-256-bit-refresh-secret-here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# Supabase (Auth + Storage)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Provider (Anthropic Claude)
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your-anthropic-api-key

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**`frontend/.env`**:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🌱 Database Seeding

Populate the database with realistic sample data (doctors, patients, appointments, clinics, schedules, payments):

```bash
cd backend
npx tsx scripts/seed.ts
```

> [!WARNING]
> The seed script **clears existing data** and inserts fresh sample records. Do not run in production.

> [!NOTE]
> Make sure `MONGODB_URI` in `backend/.env` is correctly configured and `SKIP_DATABASE_CONNECTION=false` before running the seed script.

---

## 🧪 Testing

```bash
# Run all backend tests
npm test

# Run with verbose output
cd backend && npx vitest run tests/ --reporter=verbose

# Type-check both workspaces
npm run type-check
```

The test suite covers:
- ✅ Appointment lifecycle (booking → payment → confirmation → completion)
- ✅ RBAC permission enforcement
- ✅ Medical record immutability
- ✅ Audit log generation

---

## 🚀 Deployment

### Frontend → Vercel

```bash
# Deploy via Vercel CLI
npx vercel --cwd frontend
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) and set root directory to `frontend`.

### Backend → Railway

```bash
# Deploy via Railway CLI
railway up
```

Or connect your repo at [railway.app](https://railway.app). The `railway.toml` is pre-configured.

### Backend → Render (Alternative)

The `render.yaml` is pre-configured for Render deployment. Connect your repo at [render.com](https://render.com).

| Service | Platform | Config File |
|---------|----------|-------------|
| **Frontend** | Vercel | `vercel.json` |
| **Backend** | Railway | `railway.toml` |
| **Backend (alt)** | Render | `render.yaml` |
| **Database** | MongoDB Atlas | — |
| **Auth + Storage** | Supabase | — |
| **Media Storage** | Cloudinary | — |

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'feat: add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📬 Contact

<div align="center">

### **Awais Ali** — Full Stack Developer

[![Email](https://img.shields.io/badge/Email-awais.cuvi@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:awais.cuvi@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-awaisali022-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/awaisali022)

📧 **awais.cuvi@gmail.com**

</div>

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

_If DoctorHub AI helped you learn or build something awesome, a star means the world_ 🌟

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00C49A,100:0066FF&height=120&section=footer" width="100%"/>

Made with ❤️ by **[Awais Ali](https://github.com/awaisali022)**

© 2026 DoctorHub AI. All rights reserved.

</div>
