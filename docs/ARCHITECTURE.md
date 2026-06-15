# Doctor Hub Architecture

Doctor Hub uses clean architecture with these boundaries:

1. Domain: role, permission, and healthcare invariants.
2. Application: use cases and services.
3. Infrastructure: MongoDB, AI provider, Cloudinary, realtime sockets.
4. Interfaces: Express controllers, middleware, routes.
5. Frontend: feature-based React modules and role dashboards.

## Non-Negotiable Business Rules

- Medical history is append-only.
- Prescriptions are append-only.
- Appointment confirmation requires payment verification and assistant confirmation.
- Every sensitive action writes an audit log.
- AI features provide guidance only and must not diagnose or prescribe.

## Deployment

- Frontend: Vercel.
- Backend: Railway.
- Database: MongoDB Atlas.
- Auth: Supabase Auth plus platform JWT.
- Storage: Cloudinary.
