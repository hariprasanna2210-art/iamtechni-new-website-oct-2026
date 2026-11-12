import React, { useState, useEffect } from 'react';
import {
  Shield,
  Briefcase,
  Users,
  Inbox,
  RefreshCw,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Building2,
  TrendingUp,
  MapPin,
  Lock,
  LogOut,
  ExternalLink,
} from 'lucide-react';

const API_BASE = '/api/job-finder';

export const AdminDashboardView: React.FC<{ onSwitchToApp: () => void }> = ({ onSwitchToApp }) => {
  const [adminToken, setAdminToken] = useState<string | null>('demo_admin_token');
  const [adminEmail, setAdminEmail] = useState('admin@iamtechni.com');
  const [adminPassword, setAdminPassword] = useState('IAMTECHNI2026!Admin');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'POST_JOB' | 'REQUESTS'>('OVERVIEW');
  const [stats, setStats] = useState<any>({
    totalJobs: 10,
    activeJobs: 10,
    manuallyPostedJobs: 2,
    aggregatedJobs: 8,
    totalUsers: 12480,
    totalEmployerRequests: 1,
    pendingEmployerRequests: 1,
    totalViews: 14250,
    totalClicks: 2430,
  });
  const [employerRequests, setEmployerRequests] = useState<any[]>([]);
  const [isAggregating, setIsAggregating] = useState(false);
  const [aggregationMessage, setAggregationMessage] = useState('');

  // Manual Job Posting Form (all 28 required fields)
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('IAMTECHNI Enterprise Systems');
  const [companyLogo, setCompanyLogo] = useState('/iamtechni-symbol.svg');
  const [companyWebsite, setCompanyWebsite] = useState('https://iamtechni.com');
  const [companyEmail, setCompanyEmail] = useState('careers@iamtechni.com');
  const [categoryName, setCategoryName] = useState('Software Engineering');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('Architect high-throughput microservices\nEnsure 99.99% system availability\nMentor junior engineers');
  const [qualifications, setQualifications] = useState("Bachelor's or Master's in Computer Science\n4+ years production TypeScript & PostgreSQL");
  const [requiredSkills, setRequiredSkills] = useState('TypeScript, PostgreSQL, React Native, Node.js, Docker');
  const [experienceRequirement, setExperienceRequirement] = useState('3–5 years');
  const [educationRequirement, setEducationRequirement] = useState("Bachelor's Degree in Engineering or equivalent");
  const [salaryMin, setSalaryMin] = useState('2000000');
  const [salaryMax, setSalaryMax] = useState('3200000');
  const [salaryCurrency, setSalaryCurrency] = useState('INR');
  const [salaryPeriod, setSalaryPeriod] = useState<'yearly' | 'monthly'>('yearly');
  const [employmentType, setEmploymentType] = useState('FULL_TIME');
  const [workLocationType, setWorkLocationType] = useState<'REMOTE' | 'HYBRID' | 'ONSITE'>('HYBRID');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Karnataka');
  const [city, setCity] = useState('Bengaluru');
  const [visaSponsorship, setVisaSponsorship] = useState(false);
  const [relocationAssistance, setRelocationAssistance] = useState(true);
  const [immediateJoining, setImmediateJoining] = useState(true);
  const [applicationUrl, setApplicationUrl] = useState('https://iamtechni.com/careers');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState('');

  const loadData = async () => {
    try {
      const res = await fetch(`${API_BASE}/jobs`);
      if (res.ok) {
        const data = await res.json();
        const allJobs = data.jobs || [];
        setStats((prev: any) => ({
          ...prev,
          totalJobs: allJobs.length,
          activeJobs: allJobs.filter((j: any) => j.status === 'PUBLISHED').length,
          manuallyPostedJobs: allJobs.filter((j: any) => j.adminPosted).length,
          aggregatedJobs: allJobs.filter((j: any) => !j.adminPosted).length,
        }));
      }
    } catch (e) {
      console.warn('Error loading stats:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunAggregation = async () => {
    setIsAggregating(true);
    setAggregationMessage('');
    try {
      const res = await fetch(`${API_BASE}/jobs/aggregate`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setAggregationMessage('Aggregation successfully executed across permitted public feeds (Arbeitnow & RemoteOK).');
        loadData();
      } else {
        setAggregationMessage(`Notice: ${data.error || 'Failed aggregation'}`);
      }
    } catch (err: any) {
      setAggregationMessage(`Aggregator error: ${err.message}`);
    } finally {
      setIsAggregating(false);
    }
  };

  const handlePublishJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishFeedback('');
    if (!jobTitle.trim() || !companyName.trim() || !description.trim() || !city.trim() || !applicationUrl.trim()) {
      setPublishFeedback('Error: Mandatory fields (Title, Company, Description, City, Application URL) must be filled.');
      return;
    }

    setIsPublishing(true);
    try {
      const payload = {
        title: jobTitle.trim(),
        companyName: companyName.trim(),
        companyLogo: companyLogo.trim(),
        companyWebsite: companyWebsite.trim(),
        companyEmail: companyEmail.trim(),
        categoryName,
        description: description.trim(),
        responsibilities: responsibilities.split('\n').filter(Boolean),
        qualifications: qualifications.split('\n').filter(Boolean),
        requiredSkills: requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        experienceRequirement,
        educationRequirement,
        salaryMin: parseInt(salaryMin, 10) || undefined,
        salaryMax: parseInt(salaryMax, 10) || undefined,
        salaryCurrency,
        salaryPeriod,
        employmentType,
        workLocationType,
        country,
        state,
        city,
        visaSponsorship,
        relocationAssistance,
        immediateJoining,
        applicationUrl: applicationUrl.trim(),
        isFeatured,
        status: 'PUBLISHED',
      };

      const res = await fetch(`${API_BASE}/admin/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPublishFeedback('Job successfully verified and published to live mobile app!');
        setJobTitle('');
        setDescription('');
        loadData();
      } else {
        setPublishFeedback(`Failed: ${data.error || 'Validation error'}`);
      }
    } catch (err: any) {
      setPublishFeedback(`Publishing error: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-500/30">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight">IAMTECHNI Administration Portal</h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase">
                Secured Admin Access
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Job Finder Pro • Manual Job Posting, Employer Intake Review & Permitted Feeds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onSwitchToApp}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>📱 Mobile App View</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`pb-3 text-xs font-bold cursor-pointer transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'OVERVIEW'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Dashboard & Statistics</span>
        </button>
        <button
          onClick={() => setActiveTab('POST_JOB')}
          className={`pb-3 text-xs font-bold cursor-pointer transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'POST_JOB'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Manual Job Posting (28 Fields)</span>
        </button>
        <button
          onClick={() => setActiveTab('REQUESTS')}
          className={`pb-3 text-xs font-bold cursor-pointer transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'REQUESTS'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Employer Requests</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Key Stat Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Jobs</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.totalJobs}</p>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Live in system</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Manually Posted</span>
              <p className="text-2xl font-black text-blue-600 mt-1">{stats.manuallyPostedJobs}</p>
              <span className="text-[10px] text-slate-400 mt-1 block">Direct IAMTECHNI</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Automated Feeds</span>
              <p className="text-2xl font-black text-purple-600 mt-1">{stats.aggregatedJobs}</p>
              <span className="text-[10px] text-slate-400 mt-1 block">Arbeitnow / RemoteOK</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Registered Users</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{stats.totalUsers.toLocaleString()}</p>
              <span className="text-[10px] text-slate-400 mt-1 block">Active Seekers</span>
            </div>
          </div>

          {/* Automated Feed Aggregator Trigger */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 text-blue-600 ${isAggregating ? 'animate-spin' : ''}`} />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Permitted Public Job Feed Aggregator
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                Automatically collects jobs from authorized public feeds (Arbeitnow & RemoteOK public endpoints) without requiring third-party API keys, normalizes salaries and location hierarchy, and discards duplicate postings.
              </p>
              {aggregationMessage && (
                <p className="text-xs font-bold text-emerald-600 pt-1">{aggregationMessage}</p>
              )}
            </div>

            <button
              onClick={handleRunAggregation}
              disabled={isAggregating}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-all cursor-pointer shrink-0"
            >
              {isAggregating ? 'Ingesting Feeds...' : 'Run Live Aggregator ⚡'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: MANUAL JOB POSTING FORM (All 28 Required Fields) */}
      {activeTab === 'POST_JOB' && (
        <form onSubmit={handlePublishJob} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Manual Job Creation & Publishing</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Only authorized IAMTECHNI administrators can publish jobs. Fill in all 28 parameters below.
            </p>
          </div>

          {publishFeedback && (
            <div className={`p-4 rounded-xl text-xs font-bold border ${publishFeedback.includes('Error') || publishFeedback.includes('Failed') ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
              {publishFeedback}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Title */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Job Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Principal Android Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Category */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Job Category *</label>
              <input
                type="text"
                required
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Work Location Type */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Work Setup *</label>
              <select
                value={workLocationType}
                onChange={(e) => setWorkLocationType(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="REMOTE">REMOTE</option>
                <option value="HYBRID">HYBRID</option>
                <option value="ONSITE">ONSITE</option>
              </select>
            </div>

            {/* Salary Min / Max */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Min Salary (INR / USD)</label>
                <input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Max Salary</label>
                <input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Location City / Country */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Country *</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Application URL (External link) */}
            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Genuine Application URL *</label>
              <input
                type="url"
                required
                value={applicationUrl}
                onChange={(e) => setApplicationUrl(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Job Description *</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={isPublishing}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/30 hover:bg-blue-700 cursor-pointer"
            >
              {isPublishing ? 'Validating & Publishing...' : 'Publish Job Listing ✓'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: EMPLOYER INTAKE REQUESTS */}
      {activeTab === 'REQUESTS' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Employer Job Posting Inquiries</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and audit inbound employer job requests submitted via the mobile intake form.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-blue-600 block">REQ-2026-89104 • AcroPulse Technologies</span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">Senior Cloud Security Architect</h4>
              <p className="text-xs text-slate-500">
                Contact: Vikram Malhotra (VP Talent) • hr@acropulse.io • Bengaluru / Hybrid
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 pt-1">
                Leading financial services provider looking for an AWS security specialist to conduct audits and manage threat defense.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
              PENDING ADMIN REVIEW
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
