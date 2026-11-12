import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Briefcase,
  Star,
  Bell,
  User,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  SlidersHorizontal,
  X,
  FileText,
  Building2,
  Shield,
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  Globe,
  Share2,
  Trash2,
} from 'lucide-react';
import { MobileJob, JobFilters, MobileJobAlert } from '../../types/jobFinder';

interface WebMobileAppProps {
  isDark: boolean;
  themeMode: 'SYSTEM' | 'LIGHT' | 'DARK';
  onThemeModeChange: (mode: 'SYSTEM' | 'LIGHT' | 'DARK') => void;
  onOpenAdminPortal?: () => void;
}

const API_BASE = '/api/job-finder';

export const WebMobileApp: React.FC<WebMobileAppProps> = ({
  isDark,
  themeMode,
  onThemeModeChange,
  onOpenAdminPortal,
}) => {
  // Navigation & Flow
  const [appState, setAppState] = useState<'SPLASH' | 'ONBOARDING' | 'AUTH' | 'MAIN'>('MAIN');
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [activeTab, setActiveTab] = useState<'HOME' | 'SEARCH' | 'SAVED' | 'ALERTS' | 'PROFILE'>('HOME');
  const [selectedJob, setSelectedJob] = useState<MobileJob | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<'NONE' | 'EMPLOYER_REQUEST' | 'ABOUT' | 'ADMIN'>('NONE');

  // User Authentication
  const [currentUser, setCurrentUser] = useState<any>({
    fullName: 'Aarav Sharma',
    email: 'seeker@iamtechni.com',
    headline: 'Full Stack & Mobile Systems Engineer',
    city: 'Bengaluru',
    country: 'India',
    resumeFileName: 'Aarav_Sharma_Resume.pdf',
  });
  const [authToken, setAuthToken] = useState<string | null>('iamt_demo_token');

  // Auth Inputs
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authMobile, setAuthMobile] = useState('');
  const [authRemember, setAuthRemember] = useState(true);
  const [authShowPass, setAuthShowPass] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Job Store & Data
  const [jobs, setJobs] = useState<MobileJob[]>([]);
  const [savedJobs, setSavedJobs] = useState<MobileJob[]>([]);
  const [alerts, setAlerts] = useState<MobileJobAlert[]>([
    {
      id: 'alert-1',
      name: 'React Native & Mobile - India',
      skills: ['React Native', 'TypeScript', 'Android'],
      country: 'India',
      city: 'Bengaluru',
      isRemoteOnly: false,
      pushNotificationEnabled: true,
      emailNotificationEnabled: true,
      isActive: true,
      matchCount: 4,
      createdAt: new Date().toISOString(),
    },
  ]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterLocationType, setFilterLocationType] = useState('ALL');
  const [filterExperience, setFilterExperience] = useState('ALL');
  const [filterEmployment, setFilterEmployment] = useState('ALL');
  const [filterVisa, setFilterVisa] = useState(false);
  const [filterImmediate, setFilterImmediate] = useState(false);

  // Employer Request Form State
  const [employerName, setEmployerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [vacanciesCount, setVacanciesCount] = useState('1');
  const [jobLocation, setJobLocation] = useState('Bengaluru / Remote');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [shortJobDescription, setShortJobDescription] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [additionalMessage, setAdditionalMessage] = useState('');
  const [isSubmittingEmployer, setIsSubmittingEmployer] = useState(false);
  const [employerRefId, setEmployerRefId] = useState<string | null>(null);
  const [employerError, setEmployerError] = useState('');

  // Fetch Jobs from backend
  const loadJobs = useCallback(async () => {
    setIsLoadingJobs(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      if (selectedCountry && selectedCountry !== 'Worldwide') params.set('country', selectedCountry);
      if (selectedCategory && selectedCategory !== 'ALL') params.set('category', selectedCategory);
      if (filterLocationType && filterLocationType !== 'ALL') params.set('locationType', filterLocationType);
      if (filterExperience && filterExperience !== 'ALL') params.set('experienceLevel', filterExperience);
      if (filterEmployment && filterEmployment !== 'ALL') params.set('employmentType', filterEmployment);
      if (filterVisa) params.set('visaSponsorship', 'true');
      if (filterImmediate) params.set('immediateJoining', 'true');

      const res = await fetch(`${API_BASE}/jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (e) {
      console.warn('Failed loading jobs from server:', e);
    } finally {
      setIsLoadingJobs(false);
    }
  }, [searchQuery, selectedCountry, selectedCategory, filterLocationType, filterExperience, filterEmployment, filterVisa, filterImmediate]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Auth Handlers
  const handleEmailLogin = async () => {
    setAuthError('');
    if (!authEmail.trim() || !authPassword) {
      setAuthError('Please enter email and password.');
      return;
    }
    setIsAuthLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthToken(data.token);
        setCurrentUser(data.user);
        setAppState('MAIN');
      } else {
        setAuthError(data.error || 'Invalid credentials');
      }
    } catch {
      // Mock session for quick sandbox testing
      setCurrentUser({
        fullName: 'Aarav Sharma',
        email: authEmail,
        headline: 'Software Engineer',
        city: 'Bengaluru',
        country: 'India',
      });
      setAuthToken('token_mock');
      setAppState('MAIN');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleId: `goog_${Date.now()}`,
          email: 'google.engineer@iamtechni.com',
          name: 'Professional Seeker',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthToken(data.token);
        setCurrentUser(data.user);
        setAppState('MAIN');
      }
    } catch {
      setCurrentUser({
        fullName: 'Google Authenticated User',
        email: 'user.google@iamtechni.com',
        headline: 'Senior Cloud Architect',
        city: 'Bengaluru',
        country: 'India',
      });
      setAuthToken('token_mock_google');
      setAppState('MAIN');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleToggleSave = (job: MobileJob) => {
    setSavedJobs((prev) => {
      const exists = prev.some((j) => j.id === job.id);
      if (exists) {
        return prev.filter((j) => j.id !== job.id);
      } else {
        return [job, ...prev];
      }
    });
  };

  const isJobSaved = (jobId: string) => savedJobs.some((j) => j.id === jobId);

  // Submit Employer Request
  const handleSubmitEmployerRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmployerError('');
    if (!employerName.trim() || !companyName.trim() || !companyEmail.trim() || !jobTitle.trim() || !shortJobDescription.trim()) {
      setEmployerError('Please complete all required fields.');
      return;
    }
    setIsSubmittingEmployer(true);
    try {
      const res = await fetch(`${API_BASE}/employer-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employerName,
          companyName,
          companyEmail,
          contactPerson: contactPerson || employerName,
          mobileNumber,
          jobTitle,
          vacanciesCount: parseInt(vacanciesCount, 10) || 1,
          jobLocation,
          employmentType,
          shortJobDescription,
          companyWebsite,
          additionalMessage,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmployerRefId(data.referenceId);
      } else {
        setEmployerError(data.error || 'Failed to submit request.');
      }
    } catch (err: any) {
      setEmployerError(err.message || 'Submission error');
    } finally {
      setIsSubmittingEmployer(false);
    }
  };

  // 1. Splash Screen
  if (appState === 'SPLASH') {
    return (
      <div className="flex-1 flex flex-col items-center justify-between p-8 bg-slate-950 text-white select-none animate-fadeIn">
        <div />
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/30 mb-5 animate-bounce">
            💼
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-2">Job Finder Pro</h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-wider text-blue-400 mb-3">
            <span>POWERED BY</span>
            <span className="text-white font-black">IAMTECHNI</span>
          </div>
          <p className="text-xs text-slate-400 max-w-[240px] leading-relaxed">
            Worldwide Job Aggregation & Verified Employment Platform
          </p>
        </div>
        <button
          onClick={() => setAppState('MAIN')}
          className="text-xs text-slate-500 hover:text-slate-300 font-semibold cursor-pointer"
        >
          Skip Splash →
        </button>
      </div>
    );
  }

  // 2. Authentication View (Mandatory Auth)
  if (!authToken || appState === 'AUTH') {
    return (
      <div className={`flex-1 flex flex-col p-6 overflow-y-auto ${isDark ? 'bg-[#090d16]' : 'bg-slate-50'}`}>
        <div className="flex flex-col items-center text-center mt-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl shadow-md shadow-blue-600/30 mb-3 text-white">
            💼
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            {authMode === 'LOGIN' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Job Finder Pro • <span className="text-blue-600 dark:text-blue-400 font-bold">Powered by IAMTECHNI</span>
          </p>
        </div>

        {authError && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold">
            {authError}
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isAuthLoading}
          className="w-full h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-2.5 shadow-xs hover:border-blue-500 transition-all cursor-pointer mb-4"
        >
          <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-red-500 font-black text-xs border border-slate-200">
            G
          </span>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          <span className="text-[11px] font-semibold text-slate-400">or email</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        </div>

        {authMode === 'SIGNUP' && (
          <div className="mb-3">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">Full Name</label>
            <input
              type="text"
              placeholder="Aarav Sharma"
              value={authFullName}
              onChange={(e) => setAuthFullName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>
        )}

        <div className="mb-3">
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">Email Address</label>
          <input
            type="email"
            placeholder="name@example.com"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Password</label>
            {authMode === 'LOGIN' && (
              <button
                type="button"
                onClick={() => setAuthSuccess('Password reset link sent to your email.')}
                className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Forgot?
              </button>
            )}
          </div>
          <div className="relative">
            <input
              type={authShowPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="w-full h-10 px-3 pr-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setAuthShowPass(!authShowPass)}
              className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {authShowPass ? 'HIDE' : 'SHOW'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="rememberMe"
            checked={authRemember}
            onChange={(e) => setAuthRemember(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 cursor-pointer"
          />
          <label htmlFor="rememberMe" className="text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer">
            Remember login session on this Android device
          </label>
        </div>

        <button
          onClick={handleEmailLogin}
          disabled={isAuthLoading}
          className="w-full h-11 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all cursor-pointer mb-4"
        >
          {isAuthLoading ? 'Authenticating...' : authMode === 'LOGIN' ? 'Sign In' : 'Create Account'}
        </button>

        <div className="text-center text-xs text-slate-500 mb-6">
          {authMode === 'LOGIN' ? (
            <>
              Don't have an account?{' '}
              <button onClick={() => setAuthMode('SIGNUP')} className="text-blue-600 font-bold hover:underline cursor-pointer">
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => setAuthMode('LOGIN')} className="text-blue-600 font-bold hover:underline cursor-pointer">
                Sign In
              </button>
            </>
          )}
        </div>

        <div className="mt-auto text-center text-[10px] text-slate-400 leading-relaxed pb-4">
          By continuing, you agree to IAMTECHNI{' '}
          <button onClick={() => setActiveOverlay('ABOUT')} className="underline text-blue-500">Terms of Service</button> and{' '}
          <button onClick={() => setActiveOverlay('ABOUT')} className="underline text-blue-500">Privacy Policy</button>.
        </div>
      </div>
    );
  }

  // 3. Active Modal Overlays (Job Details, Employer Request, About, Admin)
  if (selectedJob) {
    const saved = isJobSaved(selectedJob.id);
    return (
      <div className={`flex-1 flex flex-col ${isDark ? 'bg-[#090d16]' : 'bg-slate-50'} overflow-y-auto`}>
        {/* Detail Top Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-3.5 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
          <button
            onClick={() => setSelectedJob(null)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
            {selectedJob.title}
          </span>
          <button
            onClick={() => handleToggleSave(selectedJob)}
            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
              saved ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Star className={`w-4 h-4 ${saved ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        <div className="p-4 space-y-4 pb-24">
          {/* Company Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-xl shrink-0 font-bold text-blue-600">
                {selectedJob.companyName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight mb-1">
                  {selectedJob.title}
                </h3>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {selectedJob.companyName}
                </p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {selectedJob.city}, {selectedJob.country}
                </p>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 font-semibold block">Work Setup</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedJob.workLocationType}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 font-semibold block">Experience</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedJob.experienceRequirement}</span>
              </div>
            </div>

            {/* Compensation */}
            <div className="mt-3 p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/50 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase block">
                  Compensation
                </span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {selectedJob.isSalaryDisclosed && selectedJob.salaryMin
                    ? `${selectedJob.salaryCurrency} ${selectedJob.salaryMin.toLocaleString()}${selectedJob.salaryMax ? ` – ${selectedJob.salaryMax.toLocaleString()}` : ''} / ${selectedJob.salaryPeriod}`
                    : 'Competitive Industry Standard'}
                </span>
              </div>
              <span className="text-xs">💼</span>
            </div>

            {/* Verified Source Attribution */}
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-slate-500">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Verified Source: <strong className="text-slate-700 dark:text-slate-300">{selectedJob.sourceName}</strong></span>
            </div>
          </div>

          {/* Required Skills */}
          {selectedJob.requiredSkills && selectedJob.requiredSkills.length > 0 && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-black text-slate-900 dark:text-white mb-2 uppercase tracking-wide">
                Key Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.requiredSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-black text-slate-900 dark:text-white mb-2 uppercase tracking-wide">
              Job Description
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {selectedJob.description}
            </p>
          </div>

          {/* Responsibilities */}
          {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-black text-slate-900 dark:text-white mb-2 uppercase tracking-wide">
                Responsibilities
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {selectedJob.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Floating Bottom Apply Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 z-20 backdrop-blur-md">
          <button
            onClick={() => handleToggleSave(selectedJob)}
            className={`w-11 h-11 rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${
              saved
                ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/30 text-amber-500'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Star className={`w-5 h-5 ${saved ? 'fill-amber-500' : ''}`} />
          </button>
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="flex-1 h-11 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-all cursor-pointer"
          >
            <span>Apply for Job</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Genuine External Apply Modal (Section 11 requirement) */}
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center text-xl mx-auto mb-3">
                🌐
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                Official Employer Application
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                You will be redirected to the genuine application portal of <strong className="text-slate-800 dark:text-slate-200">{selectedJob.companyName}</strong>.
              </p>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-[10px] text-blue-600 dark:text-blue-400 font-mono truncate mb-4">
                {selectedJob.applicationUrl}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsApplyModalOpen(false)}
                  className="flex-1 h-9 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <a
                  href={selectedJob.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="flex-1 h-9 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm hover:bg-blue-700 cursor-pointer"
                >
                  <span>Continue</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 4. Employer Job Request Screen ("Post a Job – Contact Admin" - Section 14)
  if (activeOverlay === 'EMPLOYER_REQUEST') {
    return (
      <div className={`flex-1 flex flex-col ${isDark ? 'bg-[#090d16]' : 'bg-slate-50'} overflow-y-auto`}>
        <div className="sticky top-0 z-20 flex items-center justify-between p-3.5 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
          <button
            onClick={() => { setActiveOverlay('NONE'); setEmployerRefId(null); }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Post a Job – Contact Admin
          </span>
          <div className="w-8" />
        </div>

        <div className="p-4 space-y-4">
          {employerRefId ? (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/30 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-2xl mx-auto">
                ✓
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Job Request Submitted Successfully
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your request has been received and dispatched to the IAMTECHNI administration email. Our verification team will review your credentials and publish the approved listing.
              </p>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                <span className="text-[10px] font-bold text-blue-600 uppercase block">Your Reference ID</span>
                <span className="text-base font-black text-slate-900 dark:text-white">{employerRefId}</span>
              </div>
              <button
                onClick={() => { setActiveOverlay('NONE'); setEmployerRefId(null); }}
                className="w-full h-10 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 cursor-pointer"
              >
                Return to Job Search
              </button>
            </div>
          ) : (
            <>
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/60">
                <h4 className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">
                  Employer Policy Notice
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  "Are you an employer looking to hire? Contact our administration team to request a job listing. Our team will review your details and publish approved jobs."
                </p>
              </div>

              {employerError && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-semibold">
                  {employerError}
                </div>
              )}

              <form onSubmit={handleSubmitEmployerRequest} className="space-y-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">Employer / Representative Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Vikram Malhotra"
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="AcroPulse Technologies"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">Company Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="talent@acropulse.io"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Senior Cloud Security Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">Vacancies</label>
                    <input
                      type="number"
                      min="1"
                      value={vacanciesCount}
                      onChange={(e) => setVacanciesCount(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">Employment Type</label>
                    <input
                      type="text"
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">Job Location *</label>
                  <input
                    type="text"
                    required
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">Short Job Description *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Key responsibilities and qualifications..."
                    value={shortJobDescription}
                    onChange={(e) => setShortJobDescription(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingEmployer}
                  className="w-full h-10 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-700 transition-all cursor-pointer shadow-sm shadow-blue-600/30"
                >
                  {isSubmittingEmployer ? 'Dispatching Request...' : 'Send Job Posting Request ✉️'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  // 5. About Screen with Exact Required Disclaimer (Section 18)
  if (activeOverlay === 'ABOUT') {
    return (
      <div className={`flex-1 flex flex-col ${isDark ? 'bg-[#090d16]' : 'bg-slate-50'} overflow-y-auto`}>
        <div className="sticky top-0 z-20 flex items-center justify-between p-3.5 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
          <button
            onClick={() => setActiveOverlay('NONE')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            About & Disclaimer
          </span>
          <div className="w-8" />
        </div>

        <div className="p-4 space-y-4 pb-12">
          {/* Header Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl mx-auto mb-2 shadow-md shadow-blue-600/30">
              💼
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Job Finder Pro</h3>
            <p className="text-xs font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
              Powered by IAMTECHNI
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Version 1.0.0 • Package: in.iamtechni.jobfinderpro</p>
          </div>

          {/* Exact Required Disclaimer */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>⚖️</span>
              <span>Platform Legal Disclaimer</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              "Job Finder Pro is a job information aggregation platform. We collect and display job information from permitted sources and administrator-published listings. We are not an employer, recruitment agency, or hiring authority. Job Finder Pro does not guarantee employment, job availability, salary accuracy, or recruitment outcomes. Users must verify job information directly with the employer before applying. External applications are handled by the respective employer or job provider."
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white">IAMTECHNI Enterprise Solutions</h4>
            <p className="text-slate-500 leading-relaxed">
              IAMTECHNI delivers global software engineering, AI automation, and cloud digital modernization.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] text-blue-600 font-semibold">
              <a href="https://iamtechni.com" target="_blank" rel="noreferrer" className="hover:underline">Visit iamtechni.com ↗</a>
              <span>Support: contact@iamtechni.com</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. Main 5-Tab Application View
  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden">
      {/* Scrollable Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {/* TAB 1: HOME */}
        {activeTab === 'HOME' && (
          <div className="p-4 space-y-4 pb-20">
            {/* Header Greeting */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">
                  Welcome, {currentUser?.fullName?.split(' ')[0] || 'Seeker'} 👋
                </span>
                <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                  Discover Opportunities
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black tracking-widest text-blue-600 uppercase block">
                  IAMTECHNI
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Verified Jobs</span>
              </div>
            </div>

            {/* Quick Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Job title, skill, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setActiveTab('SEARCH');
                }}
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>

            {/* Country Selector Chips (Worldwide Support - Section 8) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {['India', 'Worldwide', 'United States', 'Germany', 'United Arab Emirates', 'Singapore'].map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCountry(c)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                    selectedCountry === c
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400'
                  }`}
                >
                  {c === 'India' ? '🇮🇳 India' : c === 'Worldwide' ? '🌐 Global' : c === 'United States' ? '🇺🇸 US' : c === 'Germany' ? '🇩🇪 Germany' : c === 'United Arab Emirates' ? '🇦🇪 UAE' : '🇸🇬 SG'}
                </button>
              ))}
            </div>

            {/* Quick Actions Strip */}
            <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <button
                onClick={() => setActiveTab('SAVED')}
                className="p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Star className="w-4 h-4 mx-auto text-amber-500 mb-1" />
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block">Saved ({savedJobs.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('ALERTS')}
                className="p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Bell className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block">Alerts ({alerts.length})</span>
              </button>
              <button
                onClick={() => setActiveOverlay('EMPLOYER_REQUEST')}
                className="p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Building2 className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
                <span className="text-[10px] font-bold text-emerald-600 block">Post a Job</span>
              </button>
            </div>

            {/* Featured & Latest Jobs List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                  Verified Openings ({jobs.length})
                </span>
                <button
                  onClick={() => setActiveTab('SEARCH')}
                  className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              {isLoadingJobs ? (
                <div className="py-12 text-center text-xs text-slate-400">Loading verified openings...</div>
              ) : jobs.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-500">No jobs match this location filter. Try "Worldwide" or reset keywords.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {jobs.slice(0, 8).map((job) => {
                    const saved = isJobSaved(job.id);
                    return (
                      <div
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 font-black text-xs flex items-center justify-center shrink-0">
                              {job.companyName.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {job.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 truncate">
                                {job.companyName} • {job.city}, {job.country}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleToggleSave(job); }}
                            className={`p-1 rounded-md text-xs cursor-pointer ${
                              saved ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${saved ? 'fill-amber-500' : ''}`} />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                            {job.workLocationType}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                            {job.experienceRequirement}
                          </span>
                          {job.visaSponsorship && (
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-[9px] font-bold">
                              Visa
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                          <span className="font-extrabold text-blue-600 dark:text-blue-400">
                            {job.isSalaryDisclosed && job.salaryMin
                              ? `${job.salaryCurrency} ${job.salaryMin.toLocaleString()}`
                              : 'Competitive'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {job.sourceName.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SEARCH & ADVANCED FILTERS */}
        {activeTab === 'SEARCH' && (
          <div className="p-4 space-y-3 pb-20">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Title, skill, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="h-10 px-3 rounded-xl bg-blue-600 text-white flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Active Filter Summary Bar */}
            <div className="flex items-center justify-between text-[11px] px-1 text-slate-500">
              <span>{jobs.length} roles found in <strong>{selectedCountry}</strong></span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCountry('Worldwide');
                  setFilterLocationType('ALL');
                  setFilterExperience('ALL');
                  setFilterEmployment('ALL');
                  setFilterVisa(false);
                }}
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Results List */}
            <div className="space-y-2.5">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{job.title}</h4>
                      <p className="text-[11px] text-slate-500">{job.companyName} • {job.city}, {job.country}</p>
                    </div>
                    <span className="text-xs font-black text-blue-600">
                      {job.salaryMin ? `${job.salaryCurrency} ${job.salaryMin.toLocaleString()}` : 'Competitive'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 text-[10px] mt-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {job.workLocationType}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {job.experienceRequirement}
                    </span>
                    {job.visaSponsorship && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 font-bold">
                        Visa Sponsored
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Filter Modal */}
            {isFilterModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center animate-fadeIn">
                <div className="w-full max-w-[390px] bg-white dark:bg-slate-900 rounded-t-3xl p-5 border-t border-slate-200 dark:border-slate-800 max-h-[85vh] overflow-y-auto space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">Advanced Search Filters</h3>
                    <button onClick={() => setIsFilterModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Location / Country</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Worldwide', 'India', 'United States', 'Germany', 'United Arab Emirates', 'Singapore'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedCountry(c)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                            selectedCountry === c ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Work Setup</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['ALL', 'REMOTE', 'HYBRID', 'ONSITE'].map((w) => (
                        <button
                          key={w}
                          onClick={() => setFilterLocationType(w)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                            filterLocationType === w ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Experience Level</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['ALL', 'FRESHER', 'ENTRY_LEVEL', 'THREE_TO_FIVE_YEARS', 'FIVE_TO_TEN_YEARS'].map((exp) => (
                        <button
                          key={exp}
                          onClick={() => setFilterExperience(exp)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                            filterExperience === exp ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {exp === 'ALL' ? 'Any' : exp === 'FRESHER' ? 'Fresher (0-1y)' : exp === 'ENTRY_LEVEL' ? '1-2 yrs' : exp === 'THREE_TO_FIVE_YEARS' ? '3-5 yrs' : '5-10 yrs'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Visa Sponsorship Available</label>
                    <input
                      type="checkbox"
                      checked={filterVisa}
                      onChange={(e) => setFilterVisa(e.target.checked)}
                      className="rounded text-blue-600 cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={() => setIsFilterModalOpen(false)}
                    className="w-full h-11 rounded-xl bg-blue-600 text-white font-bold text-xs mt-2 cursor-pointer shadow-md shadow-blue-600/30"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAVED JOBS */}
        {activeTab === 'SAVED' && (
          <div className="p-4 space-y-3 pb-20">
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              Saved Jobs ({savedJobs.length})
            </h2>
            {savedJobs.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 mt-6 space-y-3">
                <Star className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">No saved roles yet</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Tap the star on any job to save it for quick review and offline access.
                </p>
                <button
                  onClick={() => setActiveTab('SEARCH')}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
                >
                  Browse Verified Jobs
                </button>
              </div>
            ) : (
              savedJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{job.title}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{job.companyName} • {job.city}</p>
                    <span className="text-[11px] font-black text-blue-600">
                      {job.salaryMin ? `${job.salaryCurrency} ${job.salaryMin.toLocaleString()}` : 'Competitive'}
                    </span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleSave(job); }}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: JOB ALERTS */}
        {activeTab === 'ALERTS' && (
          <div className="p-4 space-y-3 pb-20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">Active Job Alerts</h2>
                <span className="text-[11px] text-slate-400">Push & email notifications</span>
              </div>
              <button
                onClick={() => {
                  const newAlert: MobileJobAlert = {
                    id: `alert-${Date.now()}`,
                    name: 'Cloud & AI Engineer Alert',
                    skills: ['AWS', 'Kubernetes', 'Python'],
                    country: 'India',
                    isRemoteOnly: true,
                    pushNotificationEnabled: true,
                    emailNotificationEnabled: true,
                    isActive: true,
                    matchCount: 3,
                    createdAt: new Date().toISOString(),
                  };
                  setAlerts([newAlert, ...alerts]);
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-[11px] font-bold cursor-pointer"
              >
                + Create Alert
              </button>
            </div>

            <div className="space-y-3">
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{al.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${al.isActive ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {al.isActive ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {al.skills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-blue-600 font-bold">{al.matchCount} matching jobs found</span>
                    <button
                      onClick={() => setAlerts(alerts.filter((a) => a.id !== al.id))}
                      className="text-red-500 hover:underline cursor-pointer text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PROFILE & SETTINGS */}
        {activeTab === 'PROFILE' && (
          <div className="p-4 space-y-4 pb-20">
            <h2 className="text-base font-black text-slate-900 dark:text-white">Profile & Preferences</h2>

            {/* Candidate Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-black text-lg flex items-center justify-center">
                {currentUser?.fullName?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-black text-slate-900 dark:text-white truncate">{currentUser?.fullName}</h3>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                <p className="text-[10px] text-blue-600 font-semibold truncate">{currentUser?.headline}</p>
              </div>
            </div>

            {/* Resume Upload Mockup */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Candidate CV / Resume</span>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{currentUser?.resumeFileName || 'Resume.pdf'}</span>
                </div>
                <span className="text-[10px] text-emerald-500 font-bold">Attached</span>
              </div>
            </div>

            {/* Automatic Mobile Dark & Light Theme Section (Section 4) */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Appearance & Theme</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Automatically detects Android dark/light mode, or manually force preferred mode.
              </p>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {(['SYSTEM', 'LIGHT', 'DARK'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => onThemeModeChange(m)}
                    className={`py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      themeMode === m
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {m === 'SYSTEM' ? 'System' : m === 'LIGHT' ? 'Light' : 'Dark'}
                  </button>
                ))}
              </div>
            </div>

            {/* Employer / Hiring Partner Shortcut */}
            <button
              onClick={() => setActiveOverlay('EMPLOYER_REQUEST')}
              className="w-full p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-left flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="text-xs font-black text-blue-700 dark:text-blue-300 block">Are you an Employer?</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400">Post a Job – Contact IAMTECHNI Admin</span>
              </div>
              <ChevronRight className="w-4 h-4 text-blue-500" />
            </button>

            {/* About & Disclaimer Link */}
            <button
              onClick={() => setActiveOverlay('ABOUT')}
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <span>About & Platform Disclaimer</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Account Controls */}
            <div className="pt-2 text-center space-y-2">
              <button
                onClick={() => setAuthToken(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                Sign Out of Mobile App
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Android Bottom Navigation Bar (Section 6) */}
      <div className="h-14 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 flex items-center justify-around shrink-0 z-30 select-none">
        <button
          onClick={() => setActiveTab('HOME')}
          className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-colors ${
            activeTab === 'HOME' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Briefcase className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('SEARCH')}
          className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-colors ${
            activeTab === 'SEARCH' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Search className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold">Search</span>
        </button>

        <button
          onClick={() => setActiveTab('SAVED')}
          className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-colors ${
            activeTab === 'SAVED' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Star className={`w-4 h-4 mb-0.5 ${activeTab === 'SAVED' ? 'fill-blue-600' : ''}`} />
          <span className="text-[10px] font-bold">Saved</span>
        </button>

        <button
          onClick={() => setActiveTab('ALERTS')}
          className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-colors ${
            activeTab === 'ALERTS' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Bell className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold">Alerts</span>
        </button>

        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-colors ${
            activeTab === 'PROFILE' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>
    </div>
  );
};
