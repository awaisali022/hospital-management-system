# 🔐 Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| `main` (latest) | ✅ |
| Older branches | ❌ |

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability in DoctorHub AI, please report it responsibly:

1. **Email**: Send a detailed report to **[awais.cuvi@gmail.com](mailto:awais.cuvi@gmail.com)**
2. **Subject line**: `[SECURITY] DoctorHub AI - <brief description>`
3. **Include**:
   - Type of vulnerability (e.g., XSS, IDOR, SQL injection, auth bypass)
   - Full path of affected source file(s)
   - Step-by-step instructions to reproduce
   - Proof-of-concept or exploit code (if possible)
   - Potential impact

You will receive a response within **48 hours** acknowledging receipt, and a timeline for a fix within **7 days**.

## Security Measures in Place

DoctorHub AI implements the following security controls:

| Control | Implementation |
|---------|---------------|
| **Authentication** | JWT (short-lived 15m access tokens) + refresh token rotation |
| **Authorization** | Role-based access control with 24 granular permissions |
| **Input Validation** | Zod schema validation on all API endpoints |
| **Rate Limiting** | `express-rate-limit` on all routes |
| **XSS Protection** | `xss-clean` middleware |
| **NoSQL Injection** | `express-mongo-sanitize` middleware |
| **HTTP Headers** | `helmet` security headers |
| **CORS** | Allowlist-only CORS configuration |
| **Secrets** | Environment variables; never committed to source |
| **Audit Logging** | All sensitive actions are audit-logged immutably |

## Disclosure Policy

- We follow **responsible disclosure** principles
- We will publicly acknowledge security researchers who report valid vulnerabilities (with their consent)
- We aim to fix critical vulnerabilities within **7 days** and high-severity within **14 days**

## Out of Scope

The following are considered out of scope:

- Vulnerabilities in third-party dependencies (report to those maintainers directly)
- Denial of service attacks
- Social engineering attacks
- Physical security issues

Thank you for helping keep DoctorHub AI and its users safe! 🛡️
