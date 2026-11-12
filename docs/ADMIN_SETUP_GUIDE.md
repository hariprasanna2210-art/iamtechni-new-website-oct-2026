# Administration & Manual Job Posting Guide
**Job Finder Pro – Powered by IAMTECHNI**

---

## 1. Security Architecture (Section 13)

The Admin Panel is isolated from regular job seekers:
- Regular users never see administrative controls or publishing forms.
- Administrators authenticate via dedicated credentials (`ADMIN_EMAIL` and `ADMIN_PASSWORD`).
- Every manual posting requires validation across all 28 parameters before it is published to the live feed.

---

## 2. Default Administrator Credentials

In your `.env` file, configure:
```env
ADMIN_EMAIL="admin@iamtechni.com"
ADMIN_PASSWORD="IAMTECHNI2026!Admin" # Change in production
```

---

## 3. Manual Job Posting Form (28 Fields)

Administrators have access to the complete manual job creation form:
1. Job Title
2. Company Name
3. Company Logo
4. Company Website
5. Company Email
6. Job Category
7. Job Description
8. Key Responsibilities
9. Required Qualifications
10. Required Skills
11. Experience Requirement
12. Education Requirement
13. Minimum Salary
14. Maximum Salary
15. Salary Currency
16. Salary Period
17. Employment Type
18. Work Location Type (Remote / Hybrid / Onsite)
19. Country
20. State
21. City
22. Remote Eligibility
23. Visa Sponsorship
24. Relocation Assistance
25. Application URL (Genuine external link)
26. Application Email
27. Featured Job Toggle
28. Job Status (Draft / Published / Expired)

---

## 4. Inbound Employer Request Auditing

Under the **Employer Requests** tab:
1. Review inbound employer inquiries.
2. Verify business legitimacy.
3. Once approved, use the manual posting form to publish the verified job.
