import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

export interface MobileJob {
  id: string;
  title: string;
  slug: string;
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  companyDescription?: string;
  categoryName?: string;
  sourceType: string;
  sourceName: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  requiredSkills: string[];
  experienceRequirement: string;
  experienceLevel: string;
  educationRequirement: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryPeriod: string;
  isSalaryDisclosed: boolean;
  employmentType: string;
  workLocationType: 'REMOTE' | 'HYBRID' | 'ONSITE';
  country: string;
  city: string;
  locationString: string;
  isRemoteEligible: boolean;
  visaSponsorship: boolean;
  relocationAssistance: boolean;
  immediateJoining: boolean;
  applicationUrl: string;
  isExternalApplication: boolean;
  status: string;
  isFeatured: boolean;
  adminPosted: boolean;
  clickCount: number;
  viewsCount: number;
  postedAt: string;
}

export interface JobFilters {
  q?: string;
  country?: string;
  city?: string;
  category?: string;
  employmentType?: string;
  workLocationType?: string;
  experienceLevel?: string;
  minSalary?: number;
  maxSalary?: number;
  isRemoteOnly?: boolean;
  visaSponsorship?: boolean;
  immediateJoining?: boolean;
  sortBy?: 'latest' | 'relevance' | 'salary_high';
}

export interface MobileJobAlert {
  id: string;
  name: string;
  keywords?: string;
  skills: string[];
  country?: string;
  city?: string;
  minSalary?: number;
  maxSalary?: number;
  isRemoteOnly: boolean;
  pushNotificationEnabled: boolean;
  emailNotificationEnabled: boolean;
  isActive: boolean;
  matchCount: number;
  createdAt: string;
}

interface JobContextType {
  jobs: MobileJob[];
  savedJobs: MobileJob[];
  alerts: MobileJobAlert[];
  isLoading: boolean;
  isRefreshing: boolean;
  filters: JobFilters;
  totalJobsCount: number;
  fetchJobs: (customFilters?: JobFilters) => Promise<void>;
  setFilters: (filters: JobFilters) => void;
  resetFilters: () => void;
  toggleSaveJob: (job: MobileJob) => Promise<boolean>;
  isJobSaved: (jobId: string) => boolean;
  createAlert: (alertData: Partial<MobileJobAlert>) => Promise<MobileJobAlert | null>;
  toggleAlertActive: (alertId: string) => Promise<void>;
  deleteAlert: (alertId: string) => Promise<void>;
  trackApplyClick: (jobId: string) => Promise<void>;
  submitEmployerRequest: (payload: any) => Promise<{ success: boolean; referenceId?: string; error?: string }>;
}

const SAVED_JOBS_KEY = '@job_finder_saved_jobs_offline';
const ALERTS_KEY = '@job_finder_alerts_offline';
const API_BASE = 'https://iamtechni.com/api/job-finder';

const JobContext = createContext<JobContextType>({} as any);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<MobileJob[]>([]);
  const [savedJobs, setSavedJobs] = useState<MobileJob[]>([]);
  const [alerts, setAlerts] = useState<MobileJobAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalJobsCount, setTotalJobsCount] = useState(0);
  const [filters, setFiltersState] = useState<JobFilters>({
    country: 'India',
    sortBy: 'latest',
  });

  const fetchJobs = useCallback(async (activeFilters?: JobFilters) => {
    const f = activeFilters || filters;
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (f.q) params.set('q', f.q);
      if (f.country && f.country !== 'Worldwide') params.set('country', f.country);
      if (f.city) params.set('city', f.city);
      if (f.category && f.category !== 'ALL') params.set('category', f.category);
      if (f.employmentType && f.employmentType !== 'ALL') params.set('employmentType', f.employmentType);
      if (f.workLocationType && f.workLocationType !== 'ALL') params.set('locationType', f.workLocationType);
      if (f.experienceLevel && f.experienceLevel !== 'ALL') params.set('experienceLevel', f.experienceLevel);
      if (f.minSalary) params.set('minSalary', String(f.minSalary));
      if (f.maxSalary) params.set('maxSalary', String(f.maxSalary));
      if (f.isRemoteOnly) params.set('isRemoteOnly', 'true');
      if (f.visaSponsorship) params.set('visaSponsorship', 'true');
      if (f.immediateJoining) params.set('immediateJoining', 'true');
      if (f.sortBy) params.set('sortBy', f.sortBy);

      const res = await fetch(`${API_BASE}/jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
        setTotalJobsCount(data.total || 0);
      }
    } catch (e) {
      console.warn('Error fetching jobs, retaining local cache:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Load offline saved jobs and alerts
  useEffect(() => {
    (async () => {
      try {
        const [storedSaved, storedAlerts] = await Promise.all([
          AsyncStorage.getItem(SAVED_JOBS_KEY),
          AsyncStorage.getItem(ALERTS_KEY),
        ]);
        if (storedSaved) setSavedJobs(JSON.parse(storedSaved));
        if (storedAlerts) setAlerts(JSON.parse(storedAlerts));
      } catch (e) {
        console.warn('Error loading offline saved data:', e);
      }
    })();
  }, []);

  const setFilters = (newFilters: JobFilters) => {
    setFiltersState(newFilters);
    fetchJobs(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: JobFilters = { country: 'India', sortBy: 'latest' };
    setFiltersState(defaultFilters);
    fetchJobs(defaultFilters);
  };

  const isJobSaved = (jobId: string) => {
    return savedJobs.some((j) => j.id === jobId);
  };

  const toggleSaveJob = async (job: MobileJob) => {
    let updated: MobileJob[];
    const alreadySaved = isJobSaved(job.id);
    if (alreadySaved) {
      updated = savedJobs.filter((j) => j.id !== job.id);
    } else {
      updated = [job, ...savedJobs];
    }
    setSavedJobs(updated);
    await AsyncStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(updated));

    if (token) {
      try {
        await fetch(`${API_BASE}/user/saved-jobs/${job.id}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        console.warn('Failed syncing saved job to server:', e);
      }
    }
    return !alreadySaved;
  };

  const createAlert = async (alertData: Partial<MobileJobAlert>) => {
    const newAlert: MobileJobAlert = {
      id: `alert-${Date.now()}`,
      name: alertData.name || 'Custom Job Alert',
      keywords: alertData.keywords,
      skills: alertData.skills || [],
      country: alertData.country || 'India',
      city: alertData.city,
      minSalary: alertData.minSalary,
      maxSalary: alertData.maxSalary,
      isRemoteOnly: Boolean(alertData.isRemoteOnly),
      pushNotificationEnabled: alertData.pushNotificationEnabled ?? true,
      emailNotificationEnabled: alertData.emailNotificationEnabled ?? true,
      isActive: true,
      matchCount: Math.floor(Math.random() * 6) + 2,
      createdAt: new Date().toISOString(),
    };

    const updated = [newAlert, ...alerts];
    setAlerts(updated);
    await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
    return newAlert;
  };

  const toggleAlertActive = async (alertId: string) => {
    const updated = alerts.map((a) => (a.id === alertId ? { ...a, isActive: !a.isActive } : a));
    setAlerts(updated);
    await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
  };

  const deleteAlert = async (alertId: string) => {
    const updated = alerts.filter((a) => a.id !== alertId);
    setAlerts(updated);
    await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
  };

  const trackApplyClick = async (jobId: string) => {
    try {
      await fetch(`${API_BASE}/jobs/${jobId}/click`, { method: 'POST' });
    } catch (e) {
      // Non-blocking
    }
  };

  const submitEmployerRequest = async (payload: any) => {
    try {
      const res = await fetch(`${API_BASE}/employer-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Submission failed.' };
      }
      return { success: true, referenceId: data.referenceId };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error submitting request.' };
    }
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        savedJobs,
        alerts,
        isLoading,
        isRefreshing,
        filters,
        totalJobsCount,
        fetchJobs,
        setFilters,
        resetFilters,
        toggleSaveJob,
        isJobSaved,
        createAlert,
        toggleAlertActive,
        deleteAlert,
        trackApplyClick,
        submitEmployerRequest,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => useContext(JobContext);
