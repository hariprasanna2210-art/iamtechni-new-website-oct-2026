# Production Deployment Guide
**Job Finder Pro – Powered by IAMTECHNI**

---

## 1. Architecture Overview

- **Mobile Client:** React Native + Expo (Android APK / AAB) under package `in.iamtechni.jobfinderpro`.
- **Backend API:** Node.js + Express + TypeScript running on Port 3000.
- **Database:** PostgreSQL with Prisma ORM.
- **Cache & Queue:** Redis for API response caching and background aggregation scheduling.
- **Permitted Feed Aggregation:** Automated background ingest from authorized endpoints (Arbeitnow & RemoteOK).

---

## 2. Server Deployment (Docker & Cloud Run / VPS)

### Production Build & Run:
```bash
# Install dependencies
npm install

# Run build
npm run build

# Start server on 0.0.0.0:3000
npm start
```

---

## 3. Background Cron Job for Permitted Aggregation

To schedule automatic background aggregation every 6 hours, configure a cron job or scheduled worker:
```bash
# Run aggregation endpoint via curl every 6 hours
0 */6 * * * curl -X POST https://your-domain.com/api/job-finder/jobs/aggregate
```

---

## 4. Environment Variables Checklist

Ensure `.env` contains:
```env
PORT=3000
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@localhost:5432/jobfinderpro"
REDIS_URL="redis://localhost:6379"
ADMIN_EMAIL="admin@iamtechni.com"
ADMIN_PASSWORD="StrongSecureAdminPassword2026!"
GOOGLE_CLIENT_ID="your-google-web-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_ANDROID_CLIENT_ID="your-android-client-id"
```
