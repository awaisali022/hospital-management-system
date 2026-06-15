# 📊 Entity Relationship Diagram

Full ERD for the **DoctorHub AI** database schema across all 23 MongoDB collections.

---

## Core ERD

```mermaid
erDiagram
  USERS {
    ObjectId _id PK
    string email UK
    string passwordHash
    string firstName
    string lastName
    enum role "patient|doctor|assistant|admin|super_admin"
    boolean isActive
    date createdAt
    date updatedAt
  }

  DOCTORS {
    ObjectId _id PK
    ObjectId userId FK
    string pmcNumber UK
    array specializations
    number consultationFee
    string city
    string bio
    boolean isVerified
    date verifiedAt
  }

  PATIENTS {
    ObjectId _id PK
    ObjectId userId FK
    date dateOfBirth
    enum gender "male|female|other"
    string bloodGroup
    array allergies
    string emergencyContact
  }

  ASSISTANTS {
    ObjectId _id PK
    ObjectId userId FK
    ObjectId clinicId FK
    string employeeId
  }

  CLINICS {
    ObjectId _id PK
    ObjectId doctorId FK
    string name
    string city
    string address
    string phone
    boolean isActive
  }

  SCHEDULES {
    ObjectId _id PK
    ObjectId doctorId FK
    ObjectId clinicId FK
    number dayOfWeek "0=Sun...6=Sat"
    string startsAt "HH:mm"
    string endsAt "HH:mm"
    number slotDurationMinutes
  }

  APPOINTMENTS {
    ObjectId _id PK
    ObjectId patientId FK
    ObjectId doctorId FK
    ObjectId clinicId FK
    date appointmentDate
    enum status "pending|confirmed|in_progress|completed|cancelled"
    string chiefComplaint
    date createdAt
  }

  PAYMENTS {
    ObjectId _id PK
    ObjectId appointmentId FK
    ObjectId patientId FK
    number amount
    enum status "pending|verified|rejected"
    string proofUrl
    ObjectId verifiedBy FK
    date verifiedAt
  }

  PRESCRIPTIONS {
    ObjectId _id PK
    ObjectId appointmentId FK
    ObjectId doctorId FK
    ObjectId patientId FK
    array medications
    string instructions
    string pdfUrl
    string qrCode
    date issuedAt
  }

  MEDICAL_HISTORY {
    ObjectId _id PK
    ObjectId appointmentId FK
    ObjectId patientId FK
    ObjectId doctorId FK
    string diagnosis
    array symptoms
    object vitals
    string notes
    date recordedAt
  }

  REPORTS {
    ObjectId _id PK
    ObjectId patientId FK
    string fileUrl
    string fileName
    string reportType
    date uploadedAt
  }

  VIDEO_SESSIONS {
    ObjectId _id PK
    ObjectId appointmentId FK
    string roomId
    date startedAt
    date endedAt
    number durationMinutes
  }

  CHATS {
    ObjectId _id PK
    array participants
    string lastMessage
    date lastMessageAt
  }

  MESSAGES {
    ObjectId _id PK
    ObjectId chatId FK
    ObjectId senderId FK
    string content
    boolean isRead
    date timestamp
  }

  NOTIFICATIONS {
    ObjectId _id PK
    ObjectId userId FK
    string title
    string message
    string type
    boolean isRead
    date createdAt
  }

  AI_HISTORY {
    ObjectId _id PK
    ObjectId userId FK
    enum type "chatbot|symptom_checker|report_analyzer|prescription_summarizer|recommend_doctors"
    string prompt
    string response
    date createdAt
  }

  AUDIT_LOGS {
    ObjectId _id PK
    ObjectId userId FK
    string action
    string resource
    object metadata
    string ipAddress
    date timestamp
  }

  USERS ||--o| DOCTORS : "has profile"
  USERS ||--o| PATIENTS : "has profile"
  USERS ||--o| ASSISTANTS : "has profile"
  DOCTORS ||--o{ CLINICS : "owns"
  DOCTORS ||--o{ SCHEDULES : "sets"
  CLINICS ||--o{ SCHEDULES : "has"
  PATIENTS ||--o{ APPOINTMENTS : "books"
  DOCTORS ||--o{ APPOINTMENTS : "receives"
  CLINICS ||--o{ APPOINTMENTS : "at"
  APPOINTMENTS ||--o| PAYMENTS : "requires"
  APPOINTMENTS ||--o| PRESCRIPTIONS : "generates"
  APPOINTMENTS ||--o{ MEDICAL_HISTORY : "creates"
  APPOINTMENTS ||--o| VIDEO_SESSIONS : "may have"
  PATIENTS ||--o{ REPORTS : "uploads"
  USERS ||--o{ NOTIFICATIONS : "receives"
  USERS ||--o{ AI_HISTORY : "generates"
  USERS ||--o{ AUDIT_LOGS : "tracked in"
  CHATS }o--o{ USERS : "between"
  CHATS ||--o{ MESSAGES : "contains"
```

---

## 📋 Model Summary

| Mongoose Model | File | Key Fields |
|---------------|------|-----------|
| `User` | `User.model.ts` | email, role, passwordHash |
| `Doctor` | `Doctor.model.ts` | userId, pmcNumber, specializations, isVerified |
| `Patient` | `Patient.model.ts` | userId, dateOfBirth, bloodGroup |
| `Appointment` | `Appointment.model.ts` | patientId, doctorId, status, appointmentDate |
| `Prescription` | `Prescription.model.ts` | appointmentId, medications, pdfUrl, qrCode |
| `MedicalHistory` | `MedicalHistory.model.ts` | patientId, diagnosis, vitals, symptoms |
| `Payment` | `Operational.model.ts` | appointmentId, proofUrl, status |
| `Platform` | `Platform.model.ts` | Clinics, Schedules, Notifications, AI History, Audit Logs |

---

## 🔑 Key Design Decisions

1. **Append-only medical records** — `MedicalHistory` and `Prescription` documents are never updated. New appointments create new entries.
2. **Unified User model** — All roles share a single `User` document; role-specific data lives in separate models (`Doctor`, `Patient`).
3. **Payment-first flow** — Appointments cannot be confirmed without payment verification, enforced at the service layer.
4. **Audit logs** — Every sensitive action (prescription creation, payment verification, user management) creates an `AuditLog` document.
5. **AI history** — All AI interactions are persisted for compliance and analytics.
