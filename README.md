<div align="center">

# 🏥 DoctorHub AI

### Enterprise Healthcare Ecosystem

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-docterapp.vercel.app-00C49A?style=for-the-badge)](https://docterapp.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Arslan-web-Dev/doctorhub-healthcare-platform)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

An enterprise-grade, AI-powered healthcare ecosystem featuring 5-role RBAC authentication, interactive 3D elements, 12+ dynamic themes, real-time consultation rooms, and immutable PDF medical record generation.

**[🌐 Live Demo](https://docterapp.vercel.app/)** · **[📧 Contact](mailto:muhammadarslan.cs.web@gmail.com)** · **[🐛 Report Bug](https://github.com/Arslan-web-Dev/doctorhub-healthcare-platform/issues)**

</div>

---

## 🔑 Demo Accounts

> **Try the live app instantly with these pre-configured test accounts:**

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| 🔴 **Super Admin** | `admin@doctorhub.local` | `Admin@123` | Full system control, all permissions |
| 🟠 **Admin** | `admin2@doctorhub.local` | `Admin@123` | User management, doctor verification |
| 🟢 **Doctor** | `doctor@doctorhub.local` | `Doctor@123` | Patient records, prescriptions, analytics |
| 🔵 **Patient** | `patient@doctorhub.local` | `Patient@123` | Book appointments, view records, AI chat |
| 🟡 **Assistant** | `assistant@doctorhub.local` | `Assistant@123` | Payment verification, queue management |

> [!TIP]
> Register a new account to experience the full onboarding flow, or use the demo accounts above to explore each role's unique dashboard immediately.

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🎨 Frontend
- 🌗 **12+ Dynamic Themes** — Glassmorphism UI with live theme switcher
- 🧊 **3D Interactive Hero** — Three.js medical models with parallax
- 📱 **Fully Responsive** — Mobile-first design across all pages
- ⚡ **Framer Motion** — Smooth page transitions & micro-animations
- 🧠 **AI Chatbot** — Intelligent symptom checker & health assistant

</td>
<td width="50%">

### ⚙️ Backend
- 🔐 **5-Role RBAC** — Granular permission system (24 permissions)
- 🔑 **Hybrid Auth** — JWT + Supabase authentication
- 📄 **PDF Generation** — Immutable prescriptions with QR verification
- 💬 **Real-Time** — Socket.io chat & WebRTC video consultations
- 🗄️ **MongoDB Atlas** — Cloud database with Mongoose ODM

</td>
</tr>
</table>

---

## 🏛️ System Architecture

```mermaid
graph TD
  User["👤 User Browser"]

  subgraph Frontend["🖥️ Frontend — React / Vite / TypeScript"]
    UI["🎨 Theme System<br/>12+ Glassmorphism Themes"]
    Three["🧊 Three.js<br/>3D Hero Canvas"]
    State["📦 Zustand Stores<br/>Auth / Theme / Chat"]
    Router["🔀 React Router<br/>Protected Routes"]
    RQuery["⚡ React Query<br/>Server State Cache"]
  end

  subgraph Backend["⚙️ Backend — Express / Node.js / TypeScript"]
    Controller["📡 Express Controllers<br/>Zod Validation"]
    Auth["🔐 Auth Middleware<br/>JWT + RBAC"]
    Service["🧩 Application Services<br/>Booking / Payment / AI"]
    PDF["📄 PdfService<br/>PDFKit + QR Codes"]
    Storage["☁️ StorageService<br/>Supabase / Cloudinary"]
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
    Stored in Supabase / Cloudinary
  end note
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | UI Framework |
| **Styling** | Tailwind CSS + Glassmorphism | Responsive Design |
| **3D Graphics** | Three.js | Interactive Hero Section |
| **Animations** | Framer Motion | Page Transitions |
| **State** | Zustand + React Query | Client & Server State |
| **Routing** | React Router v7 | SPA Navigation |
| **Backend** | Express.js + TypeScript | REST API Server |
| **Auth** | JWT + Supabase | Hybrid Authentication |
| **Database** | MongoDB Atlas + Mongoose | Data Persistence |
| **Storage** | Supabase Storage / Cloudinary | File & Image Hosting |
| **Real-Time** | Socket.io + WebRTC | Chat & Video Calls |
| **PDF** | PDFKit | Medical Record Generation |
| **Validation** | Zod | Schema Validation |
| **Testing** | Vitest | Unit Testing |
| **Frontend Hosting** | Vercel | CDN + Edge |
| **Backend Hosting** | Railway | Container Deployment |

---

## 📁 Project Structure

```
doctorhub-healthcare-platform/
├── 📂 frontend/                    # React + Vite + TypeScript
│   ├── 📂 src/
│   │   ├── 📂 components/          # Reusable UI components
│   │   │   ├── 📂 layout/          #   Shell, Navbar, Sidebar
│   │   │   └── 📂 ui/              #   Button, Panel, Input, Modal
│   │   ├── 📂 features/            # Feature-based modules
│   │   │   ├── 📂 auth/            #   Login / Register pages
│   │   │   ├── 📂 dashboards/      #   5 Role-specific dashboards
│   │   │   ├── 📂 doctors/         #   Doctor listing & profiles
│   │   │   ├── 📂 ai/              #   AI Chatbot & Symptom Checker
│   │   │   └── 📂 public/          #   Landing page (3D Hero)
│   │   ├── 📂 stores/              # Zustand state management
│   │   ├── 📂 lib/                 # Utilities & API client
│   │   └── 📄 index.css            # Theme system (12+ themes)
│   └── 📄 tailwind.config.ts
│
├── 📂 backend/                     # Express + TypeScript
│   ├── 📂 src/
│   │   ├── 📂 config/              # Environment & Zod validation
│   │   ├── 📂 domain/              # Business logic & entities
│   │   │   └── 📂 entities/        #   Roles, Permissions
│   │   ├── 📂 application/         # Application services
│   │   │   └── 📂 services/        #   Auth, PDF, Storage, AI
│   │   ├── 📂 infrastructure/      # External adapters
│   │   │   ├── 📂 database/        #   MongoDB models & connection
│   │   │   └── 📂 realtime/        #   Socket.io server
│   │   └── 📂 interfaces/          # HTTP layer
│   │       └── 📂 http/            #   Routes, Controllers, Middleware
│   ├── 📂 scripts/                 # Database seeding
│   └── 📂 tests/                   # Vitest test suites
│
├── 📄 package.json                 # Monorepo workspace config
├── 📄 vercel.json                  # Frontend deployment
├── 📄 railway.toml                 # Backend deployment
└── 📄 README.md                    # You are here! 👋
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** v20 or higher
- **npm** v9 or higher
- **MongoDB** Atlas account (or local MongoDB instance)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Arslan-web-Dev/doctorhub-healthcare-platform.git
cd doctorhub-healthcare-platform

# 2. Install all dependencies (monorepo workspace)
npm install

# 3. Configure environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit both .env files with your credentials

# 4. Start development servers
npm run dev:backend    # → http://localhost:5000
npm run dev:frontend   # → http://localhost:5173
```

### 🌱 Database Seeding

Populate the database with sample data (doctors, patients, appointments, etc.):

```bash
cd backend
npx tsx scripts/seed.ts
```

> [!NOTE]
> Make sure your `MONGODB_URI` in `backend/.env` is correctly configured before running the seed script. The script will clear existing data and insert fresh sample records.

---

## 🚀 Deployment

| Service | Platform | Status |
|---------|----------|--------|
| **Frontend** | [Vercel](https://vercel.com) | ✅ [Live](https://docterapp.vercel.app/) |
| **Backend** | [Railway](https://railway.app) | ✅ Deployed |
| **Database** | [MongoDB Atlas](https://cloud.mongodb.com) | ✅ Connected |
| **Auth + Storage** | [Supabase](https://supabase.com) | ✅ Active |

---

## 📬 Contact

<div align="center">

**Muhammad Arslan** — Full Stack Developer

[![Email](https://img.shields.io/badge/Email-muhammadarslan.cs.web@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:muhammadarslan.cs.web@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-Arslan--web--Dev-181717?style=for-the-badge&logo=github)](https://github.com/Arslan-web-Dev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Muhammad_Arslan-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/arslan-web-dev)

📧 **muhammadarslan.cs.web@gmail.com** · 📱 **+92 327 5541708**

</div>

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

Made with ❤️ by **Muhammad Arslan**

© 2026 DoctorHub AI. All rights reserved.

</div>
