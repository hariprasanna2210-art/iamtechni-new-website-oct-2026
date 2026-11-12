import { EmployerRequestItem, EmployerRequestPayload, RequestStatus } from './jobTypes.js';

export interface EmailDispatchLog {
  recipient: string;
  subject: string;
  templateType: 'ADMIN_NOTIFICATION' | 'EMPLOYER_CONFIRMATION';
  dispatchedAt: string;
  status: 'SENT' | 'SIMULATED' | 'FAILED';
  previewHtml?: string;
}

class EmployerRequestStore {
  private requests: EmployerRequestItem[] = [
    {
      id: 'req-001',
      referenceId: 'REQ-2026-89104',
      employerName: 'Vikram Malhotra',
      companyName: 'AcroPulse Technologies',
      companyEmail: 'hr@acropulse.io',
      contactPerson: 'Vikram Malhotra (VP Talent)',
      mobileNumber: '+91 98765 43210',
      jobTitle: 'Senior Cloud Security Architect',
      vacanciesCount: 2,
      jobLocation: 'Bengaluru / Hybrid',
      employmentType: 'Full-time',
      shortJobDescription: 'Leading financial services provider looking for an AWS security specialist to conduct audits and manage threat defense.',
      companyWebsite: 'https://acropulse.io',
      additionalMessage: 'Please review our request. We are looking to fill this role within 30 days.',
      status: 'PENDING',
      adminReviewNotes: 'Verified company domain and website. Ready for publication review.',
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
    }
  ];

  private emailLogs: EmailDispatchLog[] = [];

  public getAllRequests(): EmployerRequestItem[] {
    return [...this.requests].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  public getRequestByReferenceId(refId: string): EmployerRequestItem | undefined {
    return this.requests.find((r) => r.referenceId === refId || r.id === refId);
  }

  public getEmailLogs(): EmailDispatchLog[] {
    return [...this.emailLogs].slice(-20);
  }

  public createRequest(payload: EmployerRequestPayload): { request: EmployerRequestItem; emailsDispatched: EmailDispatchLog[] } {
    // Generate secure, user-friendly reference ID
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const referenceId = `REQ-${year}-${randomSuffix}`;
    const now = new Date().toISOString();

    const newRequest: EmployerRequestItem = {
      id: `req-${Date.now()}`,
      referenceId,
      employerName: payload.employerName.trim(),
      companyName: payload.companyName.trim(),
      companyEmail: payload.companyEmail.trim().toLowerCase(),
      contactPerson: payload.contactPerson.trim(),
      mobileNumber: payload.mobileNumber?.trim() || undefined,
      jobTitle: payload.jobTitle.trim(),
      vacanciesCount: Number(payload.vacanciesCount) || 1,
      jobLocation: payload.jobLocation.trim(),
      employmentType: payload.employmentType.trim(),
      shortJobDescription: payload.shortJobDescription.trim(),
      companyWebsite: payload.companyWebsite?.trim() || undefined,
      additionalMessage: payload.additionalMessage?.trim() || undefined,
      status: 'PENDING',
      submittedAt: now,
      updatedAt: now,
    };

    this.requests.unshift(newRequest);

    // Prepare Email Dispatch
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@iamtechni.com';
    const dispatchedLogs: EmailDispatchLog[] = [];

    // 1. Admin Notification Email
    const adminSubject = `[Job Request ${referenceId}] New Employer Job Posting: ${newRequest.jobTitle} at ${newRequest.companyName}`;
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #2563eb; margin-top: 0;">New Employer Job Posting Request</h2>
        <p>A new job listing request has been submitted to <strong>Job Finder Pro (Powered by IAMTECHNI)</strong>.</p>
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin: 16px 0;">
          <p><strong>Reference ID:</strong> ${referenceId}</p>
          <p><strong>Company:</strong> ${newRequest.companyName}</p>
          <p><strong>Job Title:</strong> ${newRequest.jobTitle}</p>
          <p><strong>Contact Person:</strong> ${newRequest.contactPerson} (${newRequest.companyEmail})</p>
          <p><strong>Phone:</strong> ${newRequest.mobileNumber || 'Not provided'}</p>
          <p><strong>Location:</strong> ${newRequest.jobLocation}</p>
          <p><strong>Vacancies:</strong> ${newRequest.vacanciesCount}</p>
          <p><strong>Type:</strong> ${newRequest.employmentType}</p>
          <p><strong>Website:</strong> ${newRequest.companyWebsite || 'N/A'}</p>
          <p><strong>Description:</strong></p>
          <blockquote style="margin: 0; padding-left: 12px; border-left: 3px solid #cbd5e1; color: #475569;">
            ${newRequest.shortJobDescription}
          </blockquote>
          ${newRequest.additionalMessage ? `<p><strong>Notes:</strong> ${newRequest.additionalMessage}</p>` : ''}
        </div>
        <p>Please log in to the <strong>IAMTECHNI Admin Dashboard</strong> to review this request and publish the approved job.</p>
      </div>
    `;

    const adminLog: EmailDispatchLog = {
      recipient: adminEmail,
      subject: adminSubject,
      templateType: 'ADMIN_NOTIFICATION',
      dispatchedAt: now,
      status: 'SENT',
      previewHtml: adminHtml,
    };
    this.emailLogs.push(adminLog);
    dispatchedLogs.push(adminLog);

    // 2. Employer Confirmation Email
    const employerSubject = `Confirmation: Your Job Request ${referenceId} has been received – Job Finder Pro`;
    const employerHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #2563eb; margin-top: 0;">Thank you for your submission</h2>
        <p>Dear ${newRequest.contactPerson},</p>
        <p>We have received your job posting request for <strong>${newRequest.jobTitle}</strong> at <strong>${newRequest.companyName}</strong>.</p>
        <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 12px; margin: 16px 0;">
          <p style="margin: 0;"><strong>Your Reference ID:</strong> <span style="font-size: 16px; font-weight: bold; color: #1d4ed8;">${referenceId}</span></p>
        </div>
        <p><strong>What happens next?</strong></p>
        <ul style="padding-left: 20px; color: #475569;">
          <li>Our verification team will review your company credentials and job details within 24 to 48 business hours.</li>
          <li>Once approved, our administrators will manually create and publish your listing on <strong>Job Finder Pro – Powered by IAMTECHNI</strong>.</li>
          <li>We will notify you via this email address as soon as the job is published.</li>
        </ul>
        <p style="color: #64748b; font-size: 13px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
          Best regards,<br/>
          <strong>IAMTECHNI Administration & Talent Team</strong><br/>
          Job Finder Pro – Powered by IAMTECHNI
        </p>
      </div>
    `;

    const employerLog: EmailDispatchLog = {
      recipient: newRequest.companyEmail,
      subject: employerSubject,
      templateType: 'EMPLOYER_CONFIRMATION',
      dispatchedAt: now,
      status: 'SENT',
      previewHtml: employerHtml,
    };
    this.emailLogs.push(employerLog);
    dispatchedLogs.push(employerLog);

    return { request: newRequest, emailsDispatched: dispatchedLogs };
  }

  public updateRequestStatus(id: string, status: RequestStatus, adminNotes?: string, convertedToJobId?: string): EmployerRequestItem | null {
    const item = this.requests.find((r) => r.id === id || r.referenceId === id);
    if (!item) return null;
    item.status = status;
    if (adminNotes !== undefined) item.adminReviewNotes = adminNotes;
    if (convertedToJobId !== undefined) item.convertedToJobId = convertedToJobId;
    item.updatedAt = new Date().toISOString();
    return item;
  }
}

export const employerRequestStore = new EmployerRequestStore();
