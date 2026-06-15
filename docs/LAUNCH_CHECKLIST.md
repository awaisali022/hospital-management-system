# 🚀 Launch Checklist

Pre-launch verification checklist for **DoctorHub AI**. Complete all items before going live.

---

## 🗄️ Database

- [ ] MongoDB Atlas cluster tier upgraded from free to M10+ for production
- [ ] Database indexes created (see [DEPLOYMENT.md](DEPLOYMENT.md#1️⃣-mongodb-atlas-setup))
- [ ] Automated backups enabled in MongoDB Atlas
- [ ] Network access restricted to known IPs (Railway/Render ranges or VPC)
- [ ] Database user has minimum required permissions (readWrite on doctorhub db)
- [ ] Seed script tested: `cd backend && npx tsx scripts/seed.ts`

## 🔐 Authentication & Security

- [ ] JWT secrets are cryptographically random 256-bit keys (`openssl rand -hex 32`)
- [ ] Supabase OAuth providers configured (Google, etc.)
- [ ] Supabase Row Level Security (RLS) policies enabled and tested
- [ ] Supabase Storage bucket `doctorhub-files` created and set to public
- [ ] Signed upload presets configured in Cloudinary for patient report uploads
- [ ] All secrets stored as environment variables — none hardcoded in source

## 🌐 CORS & Networking

- [ ] `FRONTEND_URL` in backend env exactly matches Vercel deployment URL
- [ ] CORS tested from production frontend to backend API
- [ ] HTTPS enforced on all endpoints (handled by Vercel/Railway)
- [ ] WebRTC TURN server configured for video call fallback:
  ```
  TURN_URL=turn:your-turn-server.com:3478
  TURN_USERNAME=your-username
  TURN_PASSWORD=your-password
  ```

## 🤖 AI Features

- [ ] Anthropic API key valid and has sufficient credits
- [ ] AI medical disclaimer appears in every AI response
- [ ] All 5 AI endpoints tested (chatbot, symptom-checker, recommend-doctors, report-analyzer, prescription-summarizer)

## 📄 PDF Generation

- [ ] PDFKit generates prescription PDFs correctly
- [ ] QR codes embedded in PDFs are scannable
- [ ] PDFs uploaded to Cloudinary/Supabase with correct access permissions
- [ ] Prescription immutability verified (no update routes exist)

## 🧪 Testing

- [ ] All unit tests pass: `npm test`
- [ ] TypeScript type-check clean: `npm run type-check`
- [ ] Appointment lifecycle tested end-to-end (book → pay → verify → confirm → complete → PDF)
- [ ] All 5 role dashboards tested with demo accounts
- [ ] RBAC permission matrix verified (unauthorized actions return 403)
- [ ] Real-time chat tested between Patient and Doctor
- [ ] WebRTC video call tested in supported browsers
- [ ] File upload tested (payment proof, patient reports)

## 📊 Monitoring & Analytics

- [ ] Sentry (or equivalent) error monitoring configured
- [ ] Vercel Analytics enabled on frontend
- [ ] Railway health checks configured
- [ ] Uptime monitoring set up (e.g., Better Uptime, UptimeRobot)

## 📋 Legal & Compliance

- [ ] Privacy Policy page exists and is linked in the footer
- [ ] Terms of Service page exists and is linked in the footer
- [ ] Medical disclaimer clearly visible in AI features
- [ ] AI disclaimer reviewed by legal/medical counsel
- [ ] GDPR / data protection compliance verified for your jurisdiction
- [ ] Patient data handling policies documented

## 🎨 Frontend QA

- [ ] All pages render correctly on mobile (375px), tablet (768px), desktop (1440px)
- [ ] All 12+ themes switch correctly without visual glitches
- [ ] 3D Three.js hero renders on target browsers (Chrome, Firefox, Safari, Edge)
- [ ] Page transitions are smooth and no layout shifts
- [ ] All forms have proper validation and error messages
- [ ] Loading states and skeleton screens are implemented
- [ ] 404 and error pages are in place

## 🚀 Deployment Final Steps

- [ ] Frontend deployed to Vercel at production URL
- [ ] Backend deployed to Railway/Render and health check passes
- [ ] Environment variables set correctly in all platforms
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active on custom domain
- [ ] DNS propagation complete

---

> [!CAUTION]
> Do not launch without completing the **Legal & Compliance** section. Medical platforms have specific legal obligations that vary by jurisdiction. Consult a legal professional familiar with healthcare software in your region.
