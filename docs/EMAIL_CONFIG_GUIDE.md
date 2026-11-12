# Email Workflow Configuration Guide
**Job Finder Pro – Powered by IAMTECHNI**

---

## 1. Employer Job Posting Request Policy (Section 14)

In **Job Finder Pro**, employers are **strictly not permitted to self-publish** jobs directly into the live feed.
Instead, all employer inquiries submit a structured request through the **"Post a Job – Contact Admin"** screen.

When an inquiry is submitted:
1. The request is validated on the backend.
2. A unique reference ID is generated (e.g. `REQ-2026-89421`).
3. An administrative notification is dispatched to `ADMIN_EMAIL`.
4. A branded confirmation email is sent to the employer's company email address.
5. Only authorized IAMTECHNI administrators can review the request and publish approved jobs through the secure admin backend.

---

## 2. Configuration Parameters

Configure your email delivery service (SMTP, SendGrid, or Resend) in `.env`:

```env
# Administrator recipient for all inbound hiring requests
ADMIN_EMAIL="admin@iamtechni.com"

# SMTP Delivery Configuration
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
EMAIL_FROM="Job Finder Pro <notifications@iamtechni.com>"
```

---

## 3. Email Templates

The backend automatically formats rich HTML emails for:
- **Admin Alert:** Contains employer name, company name, contact person, mobile number, job title, vacancies, location, and description with reference ID.
- **Employer Confirmation:** Informs the employer that their listing is being verified within 24-48 business hours and provides their tracking reference ID.
