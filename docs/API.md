# 🌐 REST API Reference

**Base URL (Development):** `http://localhost:5000/api`  
**Base URL (Production):** `https://your-backend.railway.app/api`

All authenticated endpoints require the `Authorization: Bearer <access_token>` header.

---

## 📋 Table of Contents

- [Authentication](#authentication)
- [Doctors](#doctors)
- [Appointments](#appointments)
- [Payments](#payments)
- [Medical History & Prescriptions](#medical-history--prescriptions)
- [AI Endpoints](#ai-endpoints)
- [Error Responses](#error-responses)

---

## Authentication

### `POST /auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass@123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "patient"
}
```

**Role options:** `patient` | `doctor` | `assistant` | `admin` | `super_admin`

**Response `201`:**
```json
{
  "user": {
    "_id": "64a...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "patient"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### `POST /auth/login`

Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass@123"
}
```

**Response `200`:** Same as register response.

---

### `POST /auth/refresh`

Get a new access token using a refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response `200`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### `GET /auth/me`

Get the currently authenticated user's profile.

**Auth:** Required  
**Permission:** Any authenticated user

**Response `200`:**
```json
{
  "_id": "64a...",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "patient",
  "isActive": true
}
```

---

## Doctors

### `GET /doctors`

Search and list doctors. Public endpoint.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `specialization` | string | Filter by specialization |
| `city` | string | Filter by city |
| `isVerified` | boolean | Filter verified doctors only |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 20) |

**Response `200`:**
```json
{
  "doctors": [
    {
      "_id": "64a...",
      "userId": { "firstName": "Ahmed", "lastName": "Khan", "email": "dr@example.com" },
      "pmcNumber": "PMC-12345",
      "specializations": ["Cardiology", "Internal Medicine"],
      "consultationFee": 2000,
      "city": "Lahore",
      "isVerified": true
    }
  ],
  "total": 45,
  "page": 1,
  "totalPages": 3
}
```

---

### `POST /doctors`

Create a doctor profile. 

**Auth:** Required  
**Permission:** `doctors:manage` (Admin, Super Admin)

**Request Body:**
```json
{
  "userId": "64a...",
  "pmcNumber": "PMC-12345",
  "specializations": ["Cardiology"],
  "consultationFee": 2000,
  "city": "Karachi"
}
```

---

## Appointments

### `POST /appointments`

Book a new appointment.

**Auth:** Required  
**Permission:** `appointments:create` (Patient, Super Admin)

**Request Body:**
```json
{
  "doctorId": "64a...",
  "clinicId": "64b...",
  "appointmentDate": "2026-07-15T10:00:00.000Z",
  "chiefComplaint": "Persistent headache for 3 days"
}
```

**Response `201`:**
```json
{
  "appointment": {
    "_id": "64c...",
    "patientId": "64d...",
    "doctorId": "64a...",
    "appointmentDate": "2026-07-15T10:00:00.000Z",
    "status": "pending",
    "chiefComplaint": "Persistent headache for 3 days"
  }
}
```

---

### `POST /appointments/payment-proof`

Upload payment proof for an appointment.

**Auth:** Required  
**Permission:** `payments:create` (Patient, Super Admin)

**Request:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `appointmentId` | string | The appointment ID |
| `proof` | file | Payment screenshot/receipt |

---

### `PATCH /payments/:paymentId/verify`

Verify or reject a patient's payment proof.

**Auth:** Required  
**Permission:** `payments:verify` (Assistant, Super Admin)

**Request Body:**
```json
{
  "status": "verified"
}
```

**Status options:** `verified` | `rejected`

---

### `PATCH /appointments/:appointmentId/confirm`

Confirm an appointment after payment verification.

**Auth:** Required  
**Permission:** `appointments:verify` (Assistant, Super Admin)

**Response `200`:**
```json
{
  "appointment": {
    "_id": "64c...",
    "status": "confirmed"
  }
}
```

---

## Medical History & Prescriptions

### `POST /medical-history`

Append a medical history entry for a patient.

**Auth:** Required  
**Permission:** `medical_history:append` (Doctor, Super Admin)

**Request Body:**
```json
{
  "appointmentId": "64c...",
  "patientId": "64d...",
  "diagnosis": "Tension headache",
  "symptoms": ["headache", "fatigue", "mild nausea"],
  "vitals": {
    "bloodPressure": "120/80",
    "temperature": 37.0,
    "pulse": 72,
    "weight": 70
  },
  "notes": "Patient advised rest and hydration."
}
```

> **Note:** Medical history is **append-only** — existing records cannot be modified.

---

### `POST /prescriptions`

Create a prescription (generates an immutable PDF with QR code).

**Auth:** Required  
**Permission:** `prescriptions:create` (Doctor, Super Admin)

**Request Body:**
```json
{
  "appointmentId": "64c...",
  "medications": [
    {
      "name": "Paracetamol 500mg",
      "dosage": "1 tablet",
      "frequency": "Every 8 hours",
      "duration": "5 days"
    }
  ],
  "instructions": "Take with plenty of water. Avoid driving after taking medication."
}
```

**Response `201`:**
```json
{
  "prescription": {
    "_id": "64e...",
    "pdfUrl": "https://res.cloudinary.com/.../prescription.pdf",
    "qrCode": "data:image/png;base64,..."
  }
}
```

---

## AI Endpoints

All AI endpoints require `ai:use` permission (Patient, Doctor, Super Admin).

### `POST /ai/chatbot`

General healthcare Q&A assistant.

**Request Body:**
```json
{
  "prompt": "What are common symptoms of diabetes?"
}
```

---

### `POST /ai/symptom-checker`

Analyze symptoms and provide triage guidance.

**Request Body:**
```json
{
  "prompt": "I have a fever of 39°C, sore throat, and body aches for 2 days."
}
```

---

### `POST /ai/recommend-doctors`

Get doctor specialty recommendations based on symptoms.

**Request Body:**
```json
{
  "prompt": "I have been having chest pain and shortness of breath."
}
```

---

### `POST /ai/report-analyzer`

Interpret medical reports in plain language.

**Request Body:**
```json
{
  "prompt": "My CBC shows WBC 11.5 K/uL, Hemoglobin 11.2 g/dL. What does this mean?"
}
```

---

### `POST /ai/prescription-summarizer`

Summarize prescriptions in patient-friendly language.

**Request Body:**
```json
{
  "prompt": "Amoxicillin 500mg TID x 7 days. Metronidazole 400mg BID x 5 days."
}
```

> [!WARNING]
> All AI responses include a mandatory disclaimer: "This is AI-generated guidance only and does not constitute medical advice. Always consult a qualified healthcare professional."

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message here",
  "details": [...] // Optional: Zod validation errors
}
```

| HTTP Status | Meaning |
|-------------|---------|
| `400` | Bad Request — Invalid input (Zod validation failed) |
| `401` | Unauthorized — Missing or invalid token |
| `403` | Forbidden — Insufficient permissions (RBAC) |
| `404` | Not Found — Resource does not exist |
| `409` | Conflict — Resource already exists |
| `429` | Too Many Requests — Rate limit exceeded |
| `500` | Internal Server Error — Unexpected server error |

### Example Validation Error (`400`):
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "body.email",
      "message": "Invalid email"
    },
    {
      "field": "body.password",
      "message": "String must contain at least 8 character(s)"
    }
  ]
}
```

### Example Auth Error (`401`):
```json
{
  "error": "Unauthorized: invalid or expired token"
}
```

### Example RBAC Error (`403`):
```json
{
  "error": "Forbidden: missing permission 'prescriptions:create'"
}
```
