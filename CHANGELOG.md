# 📋 Changelog

All notable changes to **DoctorHub AI** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- [ ] Email notification service (SMTP)
- [ ] Mobile app (React Native)
- [ ] E2E tests with Playwright
- [ ] Doctor availability calendar widget
- [ ] Multi-language (i18n) support

---

## [0.1.0] — 2026-06-15

### 🎉 Initial Release

#### Added
- **5-Role RBAC System** — 24 granular permissions across Patient, Doctor, Assistant, Admin, Super Admin roles
- **JWT + Supabase Hybrid Authentication** — Stateless access tokens (15m) with refresh token rotation (7d)
- **Appointment Lifecycle** — Full booking → payment → verification → consultation → completion workflow
- **AI Health Assistant** — 5 Anthropic Claude-powered endpoints (chatbot, symptom checker, doctor recommender, report analyzer, prescription summarizer)
- **Real-Time Communication** — Socket.io text chat + WebRTC video consultation rooms
- **PDF Prescriptions** — Immutable prescriptions with embedded QR codes stored in Cloudinary
- **Medical History** — Append-only patient medical records with doctor notes and vitals
- **12+ Glassmorphism Themes** — Live theme switcher with dark/light mode support
- **3D Hero Section** — Three.js interactive medical models with parallax scrolling
- **Framer Motion Animations** — Smooth page transitions and micro-animations
- **MongoDB Atlas Integration** — 8 Mongoose models across 23 collections
- **Audit Logging** — Every sensitive action produces an immutable audit log
- **Database Seeding** — Realistic sample data for development and demo
- **GitHub Actions CI** — Automated type-check, tests, and build on every push
- **Vercel + Railway Deployment** — Pre-configured deployment for both platforms
- **Security Hardening** — Helmet, rate-limiting, XSS protection, NoSQL injection prevention

#### Architecture
- Clean Architecture layers: Domain → Application → Infrastructure → Interfaces
- Feature-based frontend modules with role-aware dashboards
- Monorepo workspace (npm workspaces) for frontend + backend

---

[Unreleased]: https://github.com/awaisali022/hospital-management-system/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/awaisali022/hospital-management-system/releases/tag/v0.1.0
