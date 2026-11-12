# PostgreSQL & Prisma Database Setup Guide
**Job Finder Pro – Powered by IAMTECHNI**

---

## 1. Overview

The Job Finder Pro database runs on **PostgreSQL** managed by **Prisma ORM**. The schema is located at `/prisma/schema.prisma` and contains 13 models:

1. **User**: Core account identity (Google OAuth and Email/Password).
2. **UserProfile**: Comprehensive candidate profile, headline, salary goals, and resume storage.
3. **UserPreference**: Theme mode (System, Light, Dark) and notification channels.
4. **Job**: Complete job representation with 28 required fields, location hierarchy, and salary structure.
5. **Company**: Employer identity, website, and verification status.
6. **JobSource**: Permitted external feeds and administrative source attribution.
7. **Category**: Structured job categories (Mobile, Cloud, AI, Security, Design, Software).
8. **SavedJob**: User bookmarks with offline sync.
9. **JobAlert**: Multi-criteria user alerts (skills, city, country, salary range, remote only).
10. **EmployerRequest**: Inbound employer inquiry records (email-only intake; prevents self-publishing).
11. **Notification**: In-app and push notification delivery records.
12. **AdminUser**: Separate administrative authentication credentials and roles.
13. **AuditLog**: Traceable administrative actions (job publishing, approvals, feed updates).

---

## 2. Configuration

Set your PostgreSQL connection string in `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/jobfinderpro?schema=public"
```

---

## 3. Running Migrations

To apply the database schema to your PostgreSQL database:

```bash
# 1. Install Prisma dependencies
npm install prisma @prisma/client

# 2. Run the migration
npx prisma migrate dev --name init_job_finder_pro

# 3. Generate Prisma Client
npx prisma generate
```

Or execute the raw SQL migration directly using `psql`:
```bash
psql -d jobfinderpro -f prisma/migrations/init.sql
```

---

## 4. Launching Prisma Studio

Inspect, edit, and audit database records through the graphical Prisma Studio web interface:
```bash
npx prisma studio
```
Visit `http://localhost:5555` in your browser.
