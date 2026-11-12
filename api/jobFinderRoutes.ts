import { Router, Request, Response } from 'express';
import { jobStore } from './_lib/jobFinder/jobStore.js';
import { jobAggregatorService } from './_lib/jobFinder/jobAggregator.js';
import { employerRequestStore } from './_lib/jobFinder/employerRequestStore.js';
import { adminStore } from './_lib/jobFinder/adminStore.js';
import { userStore } from './_lib/jobFinder/userStore.js';
import { JobFilterParams } from './_lib/jobFinder/jobTypes.js';

export const jobFinderRouter = Router();

// ==========================================
// 1. PUBLIC JOB BROWSING & SEARCH
// ==========================================

jobFinderRouter.get('/jobs', (req: Request, res: Response) => {
  try {
    const filters: JobFilterParams = {
      q: typeof req.query.q === 'string' ? req.query.q : undefined,
      title: typeof req.query.title === 'string' ? req.query.title : undefined,
      company: typeof req.query.company === 'string' ? req.query.company : undefined,
      skill: typeof req.query.skill === 'string' ? req.query.skill : undefined,
      category: typeof req.query.category === 'string' ? req.query.category : undefined,
      country: typeof req.query.country === 'string' ? req.query.country : undefined,
      state: typeof req.query.state === 'string' ? req.query.state : undefined,
      city: typeof req.query.city === 'string' ? req.query.city : undefined,
      locationType: req.query.locationType as any,
      employmentType: req.query.employmentType as any,
      experienceLevel: req.query.experienceLevel as any,
      educationLevel: req.query.educationLevel as any,
      minSalary: req.query.minSalary ? Number(req.query.minSalary) : undefined,
      maxSalary: req.query.maxSalary ? Number(req.query.maxSalary) : undefined,
      currency: typeof req.query.currency === 'string' ? req.query.currency : undefined,
      visaSponsorship: req.query.visaSponsorship === 'true',
      relocationAssistance: req.query.relocationAssistance === 'true',
      internationalApplicants: req.query.internationalApplicants === 'true',
      immediateJoining: req.query.immediateJoining === 'true',
      isRemoteOnly: req.query.isRemoteOnly === 'true',
      postedWithinDays: req.query.postedWithinDays ? Number(req.query.postedWithinDays) : undefined,
      sortBy: (req.query.sortBy as any) || 'latest',
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    };

    const result = jobStore.queryJobs(filters);
    return res.json({
      success: true,
      ...result,
      source: 'Job Finder Pro – Powered by IAMTECHNI',
    });
  } catch (err: any) {
    console.error('Error querying jobs:', err);
    return res.status(500).json({ success: false, error: 'Internal server error while searching jobs' });
  }
});

jobFinderRouter.get('/jobs/:id', (req: Request, res: Response) => {
  const job = jobStore.getJobById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, error: 'Job listing not found or expired' });
  }
  return res.json({ success: true, job });
});

jobFinderRouter.post('/jobs/:id/click', (req: Request, res: Response) => {
  const tracked = jobStore.trackJobClick(req.params.id);
  return res.json({ success: tracked });
});

// ==========================================
// 2. AUTOMATIC PERMITTED JOB AGGREGATION
// ==========================================

jobFinderRouter.post('/jobs/aggregate', async (req: Request, res: Response) => {
  try {
    const results = await jobAggregatorService.runAggregation();
    return res.json({
      success: true,
      message: 'Job aggregation executed successfully across permitted feeds',
      results,
      status: jobAggregatorService.getStatus(),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

jobFinderRouter.get('/jobs/aggregate/status', (_req: Request, res: Response) => {
  return res.json(jobAggregatorService.getStatus());
});

// ==========================================
// 3. EMPLOYER REQUEST WORKFLOW (EMAIL-ONLY INTAKE)
// ==========================================

jobFinderRouter.post('/employer-requests', (req: Request, res: Response) => {
  const {
    employerName,
    companyName,
    companyEmail,
    contactPerson,
    mobileNumber,
    jobTitle,
    vacanciesCount,
    jobLocation,
    employmentType,
    shortJobDescription,
    companyWebsite,
    additionalMessage,
  } = req.body;

  // Validation
  if (!employerName?.trim() || !companyName?.trim() || !companyEmail?.trim() || !contactPerson?.trim() || !jobTitle?.trim() || !jobLocation?.trim() || !shortJobDescription?.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Please fill in all mandatory employer request fields (Company Name, Employer Name, Email, Contact Person, Job Title, Location, and Description).',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(companyEmail.trim())) {
    return res.status(400).json({ success: false, error: 'Please enter a valid company email address.' });
  }

  const { request, emailsDispatched } = employerRequestStore.createRequest({
    employerName,
    companyName,
    companyEmail,
    contactPerson,
    mobileNumber,
    jobTitle,
    vacanciesCount: Number(vacanciesCount) || 1,
    jobLocation,
    employmentType: employmentType || 'Full-time',
    shortJobDescription,
    companyWebsite,
    additionalMessage,
  });

  return res.status(201).json({
    success: true,
    referenceId: request.referenceId,
    message: `Your job posting request (${request.referenceId}) has been successfully submitted. An administrator at IAMTECHNI will review your submission and contact you via email once approved.`,
    request,
    emailsDispatched,
  });
});

jobFinderRouter.get('/employer-requests', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const session = adminStore.validateSession(authHeader);
  if (!session) {
    return res.status(401).json({ success: false, error: 'Unauthorized administrator access' });
  }
  return res.json({ success: true, requests: employerRequestStore.getAllRequests() });
});

jobFinderRouter.patch('/employer-requests/:id', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const session = adminStore.validateSession(authHeader);
  if (!session) {
    return res.status(401).json({ success: false, error: 'Unauthorized administrator access' });
  }

  const { status, adminNotes, convertedToJobId } = req.body;
  const updated = employerRequestStore.updateRequestStatus(req.params.id, status, adminNotes, convertedToJobId);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Employer request not found' });
  }
  return res.json({ success: true, request: updated });
});

// ==========================================
// 4. ADMIN PORTAL (SECURE MANUAL POSTING ONLY)
// ==========================================

jobFinderRouter.post('/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Administrator email and password required.' });
  }

  const result = adminStore.verifyCredentials(email, password);
  if (!result.ok) {
    return res.status(401).json({ success: false, error: result.error });
  }

  return res.json({
    success: true,
    token: result.session?.token,
    admin: {
      id: result.session?.adminId,
      email: result.session?.email,
      name: result.session?.name,
      role: result.session?.role,
    },
  });
});

jobFinderRouter.get('/admin/stats', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const session = adminStore.validateSession(authHeader);
  if (!session) {
    return res.status(401).json({ success: false, error: 'Unauthorized administrator access' });
  }

  return res.json({ success: true, stats: adminStore.getAdminStats() });
});

jobFinderRouter.post('/admin/jobs', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const session = adminStore.validateSession(authHeader);
  if (!session) {
    return res.status(401).json({ success: false, error: 'Unauthorized administrator access' });
  }

  const result = adminStore.createManualJob(req.body, session.name);
  if (!result.ok) {
    return res.status(400).json({ success: false, error: result.error });
  }

  return res.status(201).json({
    success: true,
    message: 'Job successfully created and published by administrator.',
    job: result.job,
  });
});

jobFinderRouter.put('/admin/jobs/:id', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const session = adminStore.validateSession(authHeader);
  if (!session) {
    return res.status(401).json({ success: false, error: 'Unauthorized administrator access' });
  }

  const updated = jobStore.updateJob(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Job not found' });
  }

  return res.json({ success: true, job: updated });
});

jobFinderRouter.delete('/admin/jobs/:id', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const session = adminStore.validateSession(authHeader);
  if (!session) {
    return res.status(401).json({ success: false, error: 'Unauthorized administrator access' });
  }

  const deleted = jobStore.deleteJob(req.params.id);
  return res.json({ success: deleted });
});

// ==========================================
// 5. USER AUTHENTICATION & PROFILE
// ==========================================

jobFinderRouter.post('/auth/signup', (req: Request, res: Response) => {
  const { email, password, fullName, mobileNumber } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ success: false, error: 'Email, password, and full name are required.' });
  }

  const result = userStore.signup({ email, password, fullName, mobileNumber });
  if (!result.ok) {
    return res.status(400).json({ success: false, error: result.error });
  }

  return res.status(201).json({ success: true, token: result.token, user: result.user });
});

jobFinderRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const result = userStore.loginWithEmail(email, password);
  if (!result.ok) {
    return res.status(401).json({ success: false, error: result.error });
  }

  return res.json({ success: true, token: result.token, user: result.user });
});

jobFinderRouter.post('/auth/google', (req: Request, res: Response) => {
  const { googleId, email, name, avatarUrl } = req.body;
  if (!email || !name) {
    return res.status(400).json({ success: false, error: 'Google authentication payload missing required fields.' });
  }

  const result = userStore.loginWithGoogle({
    googleId: googleId || `goog_${Date.now()}`,
    email,
    name,
    avatarUrl,
  });

  return res.json({ success: true, token: result.token, user: result.user });
});

jobFinderRouter.get('/user/profile', (req: Request, res: Response) => {
  const account = userStore.getUserFromToken(req.headers.authorization);
  if (!account) {
    return res.status(401).json({ success: false, error: 'Please log in to view your profile' });
  }
  return res.json({ success: true, user: account.profile });
});

jobFinderRouter.put('/user/profile', (req: Request, res: Response) => {
  const account = userStore.getUserFromToken(req.headers.authorization);
  if (!account) {
    return res.status(401).json({ success: false, error: 'Please log in to update your profile' });
  }
  const updated = userStore.updateProfile(account.id, req.body);
  return res.json({ success: true, user: updated });
});

jobFinderRouter.delete('/user/account', (req: Request, res: Response) => {
  const account = userStore.getUserFromToken(req.headers.authorization);
  if (!account) {
    return res.status(401).json({ success: false, error: 'Please log in to delete your account' });
  }
  const deleted = userStore.deleteAccount(account.id);
  return res.json({ success: deleted });
});

// ==========================================
// 6. SAVED JOBS & JOB ALERTS
// ==========================================

jobFinderRouter.get('/user/saved-jobs', (req: Request, res: Response) => {
  const account = userStore.getUserFromToken(req.headers.authorization);
  if (!account) {
    return res.status(401).json({ success: false, error: 'Please log in' });
  }
  const savedIds = userStore.getSavedJobIds(account.id);
  const allJobs = jobStore.getAllJobs();
  const savedJobs = allJobs.filter((j) => savedIds.includes(j.id));
  return res.json({ success: true, jobs: savedJobs, ids: savedIds });
});

jobFinderRouter.post('/user/saved-jobs/:id', (req: Request, res: Response) => {
  const account = userStore.getUserFromToken(req.headers.authorization);
  if (!account) {
    return res.status(401).json({ success: false, error: 'Please log in to save jobs' });
  }
  const result = userStore.toggleSaveJob(account.id, req.params.id);
  return res.json({ success: true, ...result });
});

jobFinderRouter.get('/user/alerts', (req: Request, res: Response) => {
  const account = userStore.getUserFromToken(req.headers.authorization);
  if (!account) {
    return res.status(401).json({ success: false, error: 'Please log in' });
  }
  return res.json({ success: true, alerts: userStore.getAlerts(account.id) });
});

jobFinderRouter.post('/user/alerts', (req: Request, res: Response) => {
  const account = userStore.getUserFromToken(req.headers.authorization);
  if (!account) {
    return res.status(401).json({ success: false, error: 'Please log in' });
  }
  const alert = userStore.createAlert(account.id, req.body);
  return res.status(201).json({ success: true, alert });
});

jobFinderRouter.patch('/user/alerts/:id/toggle', (req: Request, res: Response) => {
  const account = userStore.getUserFromToken(req.headers.authorization);
  if (!account) {
    return res.status(401).json({ success: false, error: 'Please log in' });
  }
  const toggled = userStore.toggleAlert(account.id, req.params.id);
  return res.json({ success: toggled });
});

jobFinderRouter.delete('/user/alerts/:id', (req: Request, res: Response) => {
  const account = userStore.getUserFromToken(req.headers.authorization);
  if (!account) {
    return res.status(401).json({ success: false, error: 'Please log in' });
  }
  const deleted = userStore.deleteAlert(account.id, req.params.id);
  return res.json({ success: deleted });
});
