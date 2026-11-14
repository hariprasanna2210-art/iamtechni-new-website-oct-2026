import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Timestamp,
} from 'firebase/firestore';
import {
  AlertCircle,
  Award,
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Loader2,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  Search,
  ShieldAlert,
  User,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { ADMIN_EMAILS } from '../config/admins';
import { IamtechniLogo } from '../components/common/IamtechniLogo';

type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'completed';

interface InternshipApplicationRecord {
  id: string;
  applicationId: string;
  type: 'student' | 'professional';
  status: ApplicationStatus;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  course: string;
  durationMonths: number;
  startDate: string;
  endDate: string;
  college: string;
  degree: string;
  department: string;
  semester: string;
  qualification: string;
  currentlyWorking: boolean;
  company: string;
  designation: string;
  createdAt: Timestamp | Date | null;
  adminNote: string;
  reviewedAt: Timestamp | Date | null;
  reviewedBy: string;
}

function toJsDate(val: unknown): Date | null {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (typeof (val as { toDate?: () => Date }).toDate === 'function') {
    return (val as { toDate: () => Date }).toDate();
  }
  return null;
}

function formatIndiaDateTime(val: unknown): string {
  const date = toJsDate(val);
  if (!date || Number.isNaN(date.getTime())) return '-';
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(date);

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const dayPeriod = get('dayPeriod').toUpperCase();
  return `${get('day')} ${get('month')} ${get('year')}, ${get('hour')}:${get('minute')} ${dayPeriod}`;
}

function formatDateShort(dateStr: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr || '-';
  const [y, m, d] = dateStr.split('-').map(Number);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${d} ${months[m - 1]} ${y}`;
}

function formatDuration(months: number): string {
  if (!months || Number.isNaN(months)) return '-';
  return `${months} ${months === 1 ? 'month' : 'months'}`;
}

function normalizeStatus(raw: unknown): ApplicationStatus {
  if (raw === 'approved' || raw === 'rejected' || raw === 'completed') {
    return raw;
  }
  return 'pending';
}

function getStatusBadgeClasses(status: ApplicationStatus): string {
  switch (status) {
    case 'approved':
      return 'bg-blue-50 text-[#1C35EA] border-blue-200';
    case 'rejected':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'completed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default:
      return 'bg-amber-50 text-amber-700 border-amber-200';
  }
}

function formatStatusLabel(status: ApplicationStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function escapeCsvCell(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

function extractFirebaseErrorCode(err: unknown): string {
  const code = (err as { code?: string })?.code;
  if (code) return code;
  const msg = (err as { message?: string })?.message;
  return msg || 'unknown-error';
}

const AdminPage: React.FC = () => {
  // Auth state
  const [authResolved, setAuthResolved] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authErrorCode, setAuthErrorCode] = useState<string | null>(null);

  // Dashboard data state
  const [applications, setApplications] = useState<InternshipApplicationRecord[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dataErrorCode, setDataErrorCode] = useState<string | null>(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState<'all' | 'student' | 'professional'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Side panel & actions state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [isRejectingPrompt, setIsRejectingPrompt] = useState(false);
  const [rejectNoteDraft, setRejectNoteDraft] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionErrorCode, setActionErrorCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isAdmin = useMemo(() => {
    const userEmail = (user?.email ?? '').trim().toLowerCase();
    if (!userEmail) return false;
    return ADMIN_EMAILS.some((allowed) => allowed.trim().toLowerCase() === userEmail);
  }, [user]);

  const selectedApp = useMemo(
    () => applications.find((item) => item.id === selectedId) ?? null,
    [applications, selectedId]
  );

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthResolved(true);
    });
    return () => unsubscribe();
  }, []);

  // Attach Firestore snapshot listener ONLY when authenticated admin is verified
  useEffect(() => {
    if (!authResolved || !user || !isAdmin || !db) {
      setApplications([]);
      setIsDataLoading(false);
      return;
    }

    setIsDataLoading(true);
    setDataErrorCode(null);

    const q = query(
      collection(db, 'internshipApplications'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const rows: InternshipApplicationRecord[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data() as Record<string, unknown>;
          return {
            id: docSnap.id,
            applicationId: String(d.applicationId ?? ''),
            type: d.type === 'professional' ? 'professional' : 'student',
            status: normalizeStatus(d.status),
            fullName: String(d.fullName ?? ''),
            email: String(d.email ?? ''),
            phone: String(d.phone ?? ''),
            address: String(d.address ?? ''),
            area: String(d.area ?? ''),
            city: String(d.city ?? ''),
            state: String(d.state ?? ''),
            pincode: String(d.pincode ?? ''),
            course: String(d.course ?? ''),
            durationMonths: Number(d.durationMonths ?? 0),
            startDate: String(d.startDate ?? ''),
            endDate: String(d.endDate ?? ''),
            college: String(d.college ?? ''),
            degree: String(d.degree ?? ''),
            department: String(d.department ?? ''),
            semester: String(d.semester ?? ''),
            qualification: String(d.qualification ?? ''),
            currentlyWorking: Boolean(d.currentlyWorking),
            company: String(d.company ?? ''),
            designation: String(d.designation ?? ''),
            createdAt: (d.createdAt as Timestamp | Date | null) ?? null,
            adminNote: String(d.adminNote ?? ''),
            reviewedAt: (d.reviewedAt as Timestamp | Date | null) ?? null,
            reviewedBy: String(d.reviewedBy ?? ''),
          };
        });
        setApplications(rows);
        setIsDataLoading(false);
      },
      (err) => {
        setDataErrorCode(extractFirebaseErrorCode(err));
        setIsDataLoading(false);
      }
    );

    return () => unsubscribe();
  }, [authResolved, user, isAdmin]);

  // Sync draft note whenever a different application is opened
  useEffect(() => {
    if (selectedApp) {
      setNoteDraft(selectedApp.adminNote ?? '');
      setIsRejectingPrompt(false);
      setRejectNoteDraft(selectedApp.adminNote ?? '');
      setActionErrorCode(null);
    }
  }, [selectedApp?.id]);

  // Close side panel on Escape key
  useEffect(() => {
    if (!selectedId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  // Auto-hide toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleGoogleSignIn = async () => {
    setAuthErrorCode(null);
    setIsSigningIn(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setAuthErrorCode(extractFirebaseErrorCode(err));
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setAuthErrorCode(null);
    setSelectedId(null);
    try {
      await signOut(auth);
    } catch (err) {
      setAuthErrorCode(extractFirebaseErrorCode(err));
    }
  };

  // Stats
  const stats = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let completed = 0;
    for (const app of applications) {
      if (app.status === 'pending') pending += 1;
      else if (app.status === 'approved') approved += 1;
      else if (app.status === 'rejected') rejected += 1;
      else if (app.status === 'completed') completed += 1;
    }
    return {
      total: applications.length,
      pending,
      approved,
      rejected,
      completed,
    };
  }, [applications]);

  // Dynamic Course options built from Firestore data
  const courseOptions = useMemo(() => {
    const set = new Set<string>();
    for (const app of applications) {
      if (app.course.trim()) set.add(app.course.trim());
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [applications]);

  // Client-side filtered list
  const filteredApplications = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const qDigits = q.replace(/\s+/g, '');

    return applications.filter((app) => {
      if (typeFilter !== 'all' && app.type !== typeFilter) return false;
      if (statusFilter !== 'all' && app.status !== statusFilter) return false;
      if (courseFilter !== 'all' && app.course !== courseFilter) return false;

      if (q) {
        const matchesName = app.fullName.toLowerCase().includes(q);
        const matchesEmail = app.email.toLowerCase().includes(q);
        const matchesPhone = app.phone.replace(/\s+/g, '').toLowerCase().includes(qDigits);
        const matchesId = app.applicationId.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesId) {
          return false;
        }
      }
      return true;
    });
  }, [applications, typeFilter, statusFilter, courseFilter, searchQuery]);

  const handleExportCsv = () => {
    const headers = [
      'Application ID',
      'Type',
      'Status',
      'Full Name',
      'Email',
      'Phone',
      'Address',
      'Area',
      'City',
      'State',
      'PIN Code',
      'Course',
      'Duration (Months)',
      'Start Date',
      'End Date',
      'College',
      'Degree',
      'Department',
      'Semester',
      'Qualification',
      'Currently Working',
      'Company',
      'Designation',
      'Submitted At',
      'Admin Note',
      'Reviewed By',
      'Reviewed At',
    ];

    const rows = filteredApplications.map((app) => [
      app.applicationId,
      app.type === 'student' ? 'Student' : 'Professional',
      formatStatusLabel(app.status),
      app.fullName,
      app.email,
      app.phone,
      app.address,
      app.area,
      app.city,
      app.state,
      app.pincode,
      app.course,
      app.durationMonths,
      app.startDate,
      app.endDate,
      app.type === 'student' ? app.college : '',
      app.type === 'student' ? app.degree : '',
      app.type === 'student' ? app.department : '',
      app.type === 'student' ? app.semester : '',
      app.type === 'professional' ? app.qualification : '',
      app.type === 'professional' ? (app.currentlyWorking ? 'Yes' : 'No') : '',
      app.type === 'professional' ? app.company : '',
      app.type === 'professional' ? app.designation : '',
      formatIndiaDateTime(app.createdAt),
      app.adminNote,
      app.reviewedBy,
      formatIndiaDateTime(app.reviewedAt),
    ]);

    const csvLines = [
      headers.map(escapeCsvCell).join(','),
      ...rows.map((r) => r.map(escapeCsvCell).join(',')),
    ];
    const blob = new Blob(['\uFEFF' + csvLines.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `internship-applications-${dateStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleUpdateApplication = async (
    nextStatus: ApplicationStatus,
    nextNote: string,
    successLabel: string
  ) => {
    if (!selectedApp || !user || !db) return;
    setActionErrorCode(null);
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'internshipApplications', selectedApp.id), {
        status: nextStatus,
        adminNote: nextNote.trim(),
        reviewedAt: serverTimestamp(),
        reviewedBy: user.email || '',
      });
      setNoteDraft(nextNote.trim());
      setIsRejectingPrompt(false);
      setToastMessage(successLabel);
    } catch (err) {
      setActionErrorCode(extractFirebaseErrorCode(err));
    } finally {
      setIsUpdating(false);
    }
  };

  const resetFilters = () => {
    setTypeFilter('all');
    setStatusFilter('all');
    setCourseFilter('all');
    setSearchQuery('');
  };

  // Loading auth state
  if (!authResolved) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F4F7FC] px-4 py-12">
        <Helmet>
          <title>Admin | IAMTECHNI</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="flex flex-col items-center gap-3 text-slate-600">
          <Loader2 className="w-8 h-8 text-[#1C35EA] animate-spin" />
          <p className="text-sm font-medium">Checking session…</p>
        </div>
      </div>
    );
  }

  // Login screen (not signed in)
  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-gradient-to-b from-[#F0F5FF] via-[#F4F7FC] to-white px-4 py-12">
        <Helmet>
          <title>Admin Login | IAMTECHNI</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-[0_16px_40px_-12px_rgba(28,53,234,0.16)] overflow-hidden">
          <div
            className="h-1.5 w-full"
            style={{
              background: 'linear-gradient(90deg, #00B0F0 0%, #1C35EA 50%, #4D19EA 100%)',
            }}
          />
          <div className="p-6 sm:p-10 text-center space-y-6">
            <div className="flex justify-center">
              <IamtechniLogo size="lg" />
            </div>

            <div className="space-y-1.5">
              <h1
                data-no-scroll-zoom
                className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-bold text-[#1E3A8A]"
              >
                Admin Login
              </h1>
              <p className="text-sm text-slate-600">
                Sign in with your authorized Google account to manage internship applications.
              </p>
            </div>

            {authErrorCode && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm text-left flex items-start gap-2.5"
              >
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Sign-in failed:</span>{' '}
                  <code className="font-mono text-xs bg-rose-100 px-1.5 py-0.5 rounded">
                    {authErrorCode}
                  </code>
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={isSigningIn}
              onClick={handleGoogleSignIn}
              className="w-full min-h-[48px] px-6 py-3 rounded-xl text-white font-semibold text-sm sm:text-base shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-4px_rgba(28,53,234,0.38)] active:scale-[0.98] inline-flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background:
                  'linear-gradient(135deg, #00B0F0 0%, #1C35EA 35%, #4D19EA 100%)',
              }}
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#ffffff"
                      d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Signed in, but NOT an admin
  if (!isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-[#F4F7FC] px-4 py-12">
        <Helmet>
          <title>Access Denied | IAMTECHNI</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="w-full max-w-md bg-white rounded-2xl border border-rose-200 shadow-lg overflow-hidden">
          <div className="h-1.5 w-full bg-rose-500" />
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h1
                data-no-scroll-zoom
                className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-2xl font-bold text-slate-900"
              >
                Access denied. This account is not an admin.
              </h1>
              {user.email && (
                <p className="text-sm text-slate-600 break-all">
                  Signed in as <span className="font-semibold text-slate-800">{user.email}</span>
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full min-h-[48px] px-5 py-2.5 rounded-xl border-2 border-[#1C35EA] bg-white hover:bg-[#EEF4FF] text-[#1C35EA] font-semibold text-sm transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const whatsappDigits = selectedApp
    ? selectedApp.phone.replace(/^\+/, '').replace(/\D/g, '')
    : '';

  // Verified Admin Dashboard
  return (
    <div className="min-h-[80vh] bg-[#F4F7FC] py-6 sm:py-10">
      <Helmet>
        <title>Internship Applications Admin | IAMTECHNI</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Bar */}
        <header className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
              style={{
                background:
                  'linear-gradient(135deg, #00B0F0 0%, #1C35EA 45%, #4D19EA 100%)',
              }}
            >
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1
                data-no-scroll-zoom
                className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-2xl font-bold text-[#1E3A8A] truncate"
              >
                Internship Applications
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 truncate">
                Signed in as <span className="font-semibold text-slate-800">{user.email}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-sm transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign out</span>
          </button>
        </header>

        {/* 4 Stat Cards */}
        <section aria-label="Application statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-semibold text-slate-500">Total</span>
              <span className="w-8 h-8 rounded-lg bg-[#1C35EA]/10 text-[#1C35EA] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-bold text-[#1E3A8A] mt-2">
              {stats.total}
            </div>
            <p className="text-xs text-slate-500 mt-1">Rejected: {stats.rejected}</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-semibold text-slate-500">Pending</span>
              <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-bold text-amber-700 mt-2">
              {stats.pending}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-semibold text-slate-500">Approved</span>
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1C35EA] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <div className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-bold text-[#1C35EA] mt-2">
              {stats.approved}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-semibold text-slate-500">Completed</span>
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </span>
            </div>
            <div className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-bold text-emerald-700 mt-2">
              {stats.completed}
            </div>
          </div>
        </section>

        {/* Filters + Export CSV */}
        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* Search */}
            <div className="sm:col-span-2 lg:col-span-4 relative">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, phone or ID…"
                aria-label="Search applications"
                className="w-full h-11 min-h-[44px] pl-10 pr-3.5 text-base rounded-xl border border-slate-200 bg-[#F4F7FC] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#1C35EA] focus:ring-3 focus:ring-[#1C35EA]/15"
              />
            </div>

            {/* Type filter */}
            <div className="lg:col-span-2">
              <select
                aria-label="Filter by type"
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as 'all' | 'student' | 'professional')
                }
                className="w-full h-11 min-h-[44px] px-3.5 text-base rounded-xl border border-slate-200 bg-[#F4F7FC] text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#1C35EA] cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="student">Student</option>
                <option value="professional">Professional</option>
              </select>
            </div>

            {/* Status filter */}
            <div className="lg:col-span-2">
              <select
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as 'all' | ApplicationStatus)
                }
                className="w-full h-11 min-h-[44px] px-3.5 text-base rounded-xl border border-slate-200 bg-[#F4F7FC] text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#1C35EA] cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Course filter */}
            <div className="lg:col-span-2">
              <select
                aria-label="Filter by course"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full h-11 min-h-[44px] px-3.5 text-base rounded-xl border border-slate-200 bg-[#F4F7FC] text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#1C35EA] cursor-pointer"
              >
                <option value="all">All Courses</option>
                {courseOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Export CSV */}
            <div className="sm:col-span-2 lg:col-span-2">
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={filteredApplications.length === 0}
                className="w-full h-11 min-h-[44px] px-4 rounded-xl text-white font-semibold text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{
                  background:
                    'linear-gradient(135deg, #00B0F0 0%, #1C35EA 40%, #4D19EA 100%)',
                }}
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </section>

        {/* Firestore Read Error */}
        {dataErrorCode && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5"
          >
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Could not load applications:</span>{' '}
              <code className="font-mono text-xs bg-rose-100 px-1.5 py-0.5 rounded">
                {dataErrorCode}
              </code>
            </div>
          </div>
        )}

        {/* Applications List / Table */}
        {isDataLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center gap-3 text-slate-600 shadow-xs">
            <Loader2 className="w-8 h-8 text-[#1C35EA] animate-spin" />
            <p className="text-sm font-medium">Loading applications…</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2 shadow-xs">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-base font-semibold text-slate-700">No applications yet.</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
            <p className="text-base font-semibold text-slate-700">
              No applications match the selected filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-[#1C35EA] text-[#1C35EA] hover:bg-[#EEF4FF] text-sm font-semibold transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFF] border-b border-slate-200 text-xs font-mono uppercase tracking-wider text-slate-600">
                      <th className="py-3.5 px-4 font-bold">Application ID</th>
                      <th className="py-3.5 px-4 font-bold">Name</th>
                      <th className="py-3.5 px-4 font-bold">Type</th>
                      <th className="py-3.5 px-4 font-bold">Course</th>
                      <th className="py-3.5 px-4 font-bold">Duration</th>
                      <th className="py-3.5 px-4 font-bold">Start–End dates</th>
                      <th className="py-3.5 px-4 font-bold">Submitted</th>
                      <th className="py-3.5 px-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredApplications.map((app) => (
                      <tr
                        key={app.id}
                        onClick={() => setSelectedId(app.id)}
                        className={`transition-colors cursor-pointer ${
                          selectedId === app.id
                            ? 'bg-[#EEF4FF]'
                            : 'hover:bg-[#F8FAFF]'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-[#1E3A8A] whitespace-nowrap">
                          {app.applicationId || '-'}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">{app.fullName}</div>
                          <div className="text-xs text-slate-500">{app.email}</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                          {app.type === 'student' ? 'Student' : 'Professional'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-800">{app.course || '-'}</td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                          {formatDuration(app.durationMonths)}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                          {formatDateShort(app.startDate)} – {formatDateShort(app.endDate)}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 text-xs">
                          {formatIndiaDateTime(app.createdAt)}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClasses(
                              app.status
                            )}`}
                          >
                            {formatStatusLabel(app.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Stacked Cards */}
            <div className="md:hidden space-y-3">
              {filteredApplications.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => setSelectedId(app.id)}
                  className="w-full text-left bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-[#1C35EA]/40 transition-colors space-y-2.5 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-[#1C35EA]">
                      {app.applicationId || '-'}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeClasses(
                        app.status
                      )}`}
                    >
                      {formatStatusLabel(app.status)}
                    </span>
                  </div>

                  <div>
                    <div className="font-bold text-base text-slate-900">{app.fullName}</div>
                    <div className="text-xs text-slate-500">
                      {app.type === 'student' ? 'Student' : 'Professional'} · {app.course}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-600 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 block">Duration</span>
                      <span className="font-medium text-slate-800">
                        {formatDuration(app.durationMonths)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Dates</span>
                      <span className="font-medium text-slate-800">
                        {formatDateShort(app.startDate)} – {formatDateShort(app.endDate)}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block">Submitted</span>
                      <span className="font-medium text-slate-800">
                        {formatIndiaDateTime(app.createdAt)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Details Slide-over Panel (Full-screen on mobile, right drawer on desktop) */}
      {selectedApp && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Application details"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/45 backdrop-blur-[2px]"
            onClick={() => setSelectedId(null)}
          />

          {/* Panel Container */}
          <div className="relative z-10 w-full md:max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            {/* Panel Header */}
            <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#1C35EA]">
                    {selectedApp.applicationId || '-'}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeClasses(
                      selectedApp.status
                    )}`}
                  >
                    {formatStatusLabel(selectedApp.status)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submitted: {formatIndiaDateTime(selectedApp.createdAt)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close details panel"
                className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="p-4 sm:p-6 space-y-6 flex-1">
              {/* Quick Contact Links */}
              <div className="grid grid-cols-3 gap-2.5">
                <a
                  href={`mailto:${selectedApp.email}`}
                  className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFF] hover:bg-[#EEF4FF] text-[#1C35EA] text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>Email</span>
                </a>
                <a
                  href={`tel:${selectedApp.phone}`}
                  className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFF] hover:bg-[#EEF4FF] text-[#1C35EA] text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>Call</span>
                </a>
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Action Error Banner */}
              {actionErrorCode && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5"
                >
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Update failed:</span>{' '}
                    <code className="font-mono text-xs bg-rose-100 px-1.5 py-0.5 rounded">
                      {actionErrorCode}
                    </code>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="rounded-2xl border border-slate-200 bg-[#F8FAFF] p-4 space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider font-bold text-[#1C35EA]">
                  Actions
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    disabled={isUpdating || selectedApp.status === 'approved'}
                    onClick={() =>
                      handleUpdateApplication(
                        'approved',
                        noteDraft,
                        'Application approved.'
                      )
                    }
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1C35EA] hover:bg-[#172bc2] text-white text-sm font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Approve</span>
                  </button>

                  <button
                    type="button"
                    disabled={isUpdating || selectedApp.status === 'rejected'}
                    onClick={() => setIsRejectingPrompt(true)}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>Reject</span>
                  </button>

                  {selectedApp.status === 'approved' && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() =>
                        handleUpdateApplication(
                          'completed',
                          noteDraft,
                          'Marked as completed.'
                        )
                      }
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Award className="w-4 h-4 shrink-0" />
                      <span>Mark as Completed</span>
                    </button>
                  )}

                  {selectedApp.status === 'completed' && (
                    <button
                      type="button"
                      disabled
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-200 text-slate-500 text-sm font-semibold inline-flex items-center gap-2 cursor-not-allowed"
                    >
                      <Award className="w-4 h-4 shrink-0" />
                      <span>Generate Certificate</span>
                      <span className="text-[11px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-300/80 text-slate-600">
                        Coming soon
                      </span>
                    </button>
                  )}
                </div>

                {/* Optional Reject Confirmation Note */}
                {isRejectingPrompt && (
                  <div className="rounded-xl bg-white border border-rose-200 p-3.5 space-y-3">
                    <label
                      htmlFor="admin-reject-note"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      Optional rejection note
                    </label>
                    <textarea
                      id="admin-reject-note"
                      rows={2}
                      value={rejectNoteDraft}
                      onChange={(e) => setRejectNoteDraft(e.target.value)}
                      placeholder="Enter reason or note (optional)…"
                      className="w-full p-2.5 text-base rounded-lg border border-slate-200 bg-[#F4F7FC] text-slate-900 focus:bg-white focus:outline-hidden focus:border-rose-500"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          handleUpdateApplication(
                            'rejected',
                            rejectNoteDraft,
                            'Application rejected.'
                          )
                        }
                        className="min-h-[44px] px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                      >
                        Confirm Reject
                      </button>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => setIsRejectingPrompt(false)}
                        className="min-h-[44px] px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Admin Note Box + Save Note */}
                <div className="space-y-2 pt-1 border-t border-slate-200/80">
                  <label
                    htmlFor="admin-note-input"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Admin note
                  </label>
                  <textarea
                    id="admin-note-input"
                    rows={3}
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    placeholder="Add internal review notes…"
                    className="w-full p-3 text-base rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1C35EA] focus:ring-3 focus:ring-[#1C35EA]/15"
                  />
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() =>
                      handleUpdateApplication(
                        selectedApp.status,
                        noteDraft,
                        'Admin note saved.'
                      )
                    }
                    className="min-h-[44px] px-4 py-2 rounded-xl border border-[#1C35EA] bg-white hover:bg-[#EEF4FF] text-[#1C35EA] text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Save note
                  </button>
                </div>
              </div>

              {/* Group 1: Personal */}
              <div className="space-y-2.5">
                <h2
                  data-no-scroll-zoom
                  className="!font-['Outfit','Space_Grotesk',sans-serif] text-base font-bold text-[#1E3A8A] flex items-center gap-2 border-b border-slate-200 pb-2"
                >
                  <User className="w-4 h-4 text-[#1C35EA]" />
                  <span>Personal</span>
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80 sm:col-span-2">
                    <dt className="text-xs font-semibold text-slate-500">Full name</dt>
                    <dd className="text-slate-900 font-semibold mt-0.5">
                      {selectedApp.fullName || '-'}
                    </dd>
                  </div>
                  <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80">
                    <dt className="text-xs font-semibold text-slate-500">Email</dt>
                    <dd className="text-slate-900 font-medium mt-0.5 break-all">
                      {selectedApp.email || '-'}
                    </dd>
                  </div>
                  <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80">
                    <dt className="text-xs font-semibold text-slate-500">Phone</dt>
                    <dd className="text-slate-900 font-medium mt-0.5">
                      {selectedApp.phone || '-'}
                    </dd>
                  </div>
                  <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80 sm:col-span-2">
                    <dt className="text-xs font-semibold text-slate-500">Address</dt>
                    <dd className="text-slate-900 font-medium mt-0.5 whitespace-pre-line break-words">
                      {selectedApp.address || '-'}
                    </dd>
                  </div>
                  <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80">
                    <dt className="text-xs font-semibold text-slate-500">Area / Locality</dt>
                    <dd className="text-slate-900 font-medium mt-0.5">
                      {selectedApp.area || '-'}
                    </dd>
                  </div>
                  <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80">
                    <dt className="text-xs font-semibold text-slate-500">City / District</dt>
                    <dd className="text-slate-900 font-medium mt-0.5">
                      {selectedApp.city || '-'}
                    </dd>
                  </div>
                  <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80">
                    <dt className="text-xs font-semibold text-slate-500">State</dt>
                    <dd className="text-slate-900 font-medium mt-0.5">
                      {selectedApp.state || '-'}
                    </dd>
                  </div>
                  <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80">
                    <dt className="text-xs font-semibold text-slate-500">PIN code</dt>
                    <dd className="text-slate-900 font-medium mt-0.5">
                      {selectedApp.pincode || '-'}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Group 2: Internship */}
              <div className="space-y-2.5">
                <h2
                  data-no-scroll-zoom
                  className="!font-['Outfit','Space_Grotesk',sans-serif] text-base font-bold text-[#1E3A8A] flex items-center gap-2 border-b border-slate-200 pb-2"
                >
                  <FileText className="w-4 h-4 text-[#1C35EA]" />
                  <span>Internship</span>
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80">
                    <dt className="text-xs font-semibold text-slate-500">Type</dt>
                    <dd className="text-slate-900 font-medium mt-0.5">
                      {selectedApp.type === 'student'
                        ? 'Student Internship'
                        : 'Professional Internship'}
                    </dd>
                  </div>
                  <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80">
                    <dt className="text-xs font-semibold text-slate-500">Course</dt>
                    <dd className="text-slate-900 font-medium mt-0.5">
                      {selectedApp.course || '-'}
                    </dd>
                  </div>
                  <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80">
                    <dt className="text-xs font-semibold text-slate-500">Duration</dt>
                    <dd className="text-slate-900 font-medium mt-0.5">
                      {formatDuration(selectedApp.durationMonths)}
                    </dd>
                  </div>
                  <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80">
                    <dt className="text-xs font-semibold text-slate-500">Start – End dates</dt>
                    <dd className="text-slate-900 font-medium mt-0.5">
                      {formatDateShort(selectedApp.startDate)} –{' '}
                      {formatDateShort(selectedApp.endDate)}
                    </dd>
                  </div>
                  <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80">
                    <dt className="text-xs font-semibold text-slate-500">Submitted</dt>
                    <dd className="text-slate-900 font-medium mt-0.5">
                      {formatIndiaDateTime(selectedApp.createdAt)}
                    </dd>
                  </div>
                  <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80">
                    <dt className="text-xs font-semibold text-slate-500">Status</dt>
                    <dd className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeClasses(
                          selectedApp.status
                        )}`}
                      >
                        {formatStatusLabel(selectedApp.status)}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Group 3: College (student) or Work (professional) */}
              {selectedApp.type === 'student' ? (
                <div className="space-y-2.5">
                  <h2
                    data-no-scroll-zoom
                    className="!font-['Outfit','Space_Grotesk',sans-serif] text-base font-bold text-[#1E3A8A] flex items-center gap-2 border-b border-slate-200 pb-2"
                  >
                    <GraduationCap className="w-4 h-4 text-[#1C35EA]" />
                    <span>College</span>
                  </h2>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80 sm:col-span-2">
                      <dt className="text-xs font-semibold text-slate-500">College name</dt>
                      <dd className="text-slate-900 font-medium mt-0.5">
                        {selectedApp.college || '-'}
                      </dd>
                    </div>
                    <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80">
                      <dt className="text-xs font-semibold text-slate-500">Degree</dt>
                      <dd className="text-slate-900 font-medium mt-0.5">
                        {selectedApp.degree || '-'}
                      </dd>
                    </div>
                    <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80">
                      <dt className="text-xs font-semibold text-slate-500">Department</dt>
                      <dd className="text-slate-900 font-medium mt-0.5">
                        {selectedApp.department || '-'}
                      </dd>
                    </div>
                    <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80">
                      <dt className="text-xs font-semibold text-slate-500">Semester</dt>
                      <dd className="text-slate-900 font-medium mt-0.5">
                        {selectedApp.semester || '-'}
                      </dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <h2
                    data-no-scroll-zoom
                    className="!font-['Outfit','Space_Grotesk',sans-serif] text-base font-bold text-[#1E3A8A] flex items-center gap-2 border-b border-slate-200 pb-2"
                  >
                    <Briefcase className="w-4 h-4 text-[#1C35EA]" />
                    <span>Work</span>
                  </h2>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80">
                      <dt className="text-xs font-semibold text-slate-500">
                        Highest qualification
                      </dt>
                      <dd className="text-slate-900 font-medium mt-0.5">
                        {selectedApp.qualification || '-'}
                      </dd>
                    </div>
                    <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80">
                      <dt className="text-xs font-semibold text-slate-500">Currently working</dt>
                      <dd className="text-slate-900 font-medium mt-0.5">
                        {selectedApp.currentlyWorking ? 'Yes' : 'No'}
                      </dd>
                    </div>
                    <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80">
                      <dt className="text-xs font-semibold text-slate-500">Company</dt>
                      <dd className="text-slate-900 font-medium mt-0.5">
                        {selectedApp.company || '-'}
                      </dd>
                    </div>
                    <div className="bg-[#F4F7FC] rounded-xl p-3 border border-slate-200/80">
                      <dt className="text-xs font-semibold text-slate-500">Designation</dt>
                      <dd className="text-slate-900 font-medium mt-0.5">
                        {selectedApp.designation || '-'}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}

              {/* Review Audit Info (if reviewed) */}
              {(selectedApp.reviewedBy || selectedApp.reviewedAt) && (
                <div className="text-xs text-slate-500 pt-2 border-t border-slate-200 flex flex-wrap justify-between gap-2">
                  <span>Reviewed by: {selectedApp.reviewedBy || '-'}</span>
                  <span>Reviewed at: {formatIndiaDateTime(selectedApp.reviewedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[60] bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
