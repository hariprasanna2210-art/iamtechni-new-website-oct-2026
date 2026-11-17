import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp,
} from 'firebase/firestore';
import { downloadCertificatePdf } from '../lib/certificatePdf';
import {
  AlertCircle,
  Award,
  Ban,
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileText,
  GraduationCap,
  Link2,
  Loader2,
  LogOut,
  Mail,
  Maximize2,
  MessageCircle,
  Phone,
  Plus,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  User,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { ADMIN_EMAILS } from '../config/admins';
import { IamtechniLogo } from '../components/common/IamtechniLogo';
import { COURSES } from '../data/internship';
import {
  CERTIFICATE_SKILLS,
  getDefaultSkillsForCourse,
} from '../data/certificateSkills';
import {
  CertificateTemplate,
  formatCertificateDate,
  type CertificateTemplateData,
} from '../components/certificate/CertificateTemplate';

type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'completed';
type AdminTab = 'applications' | 'certificates';
type CertificateStatus = 'valid' | 'revoked';

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
  certificateId: string;
}

interface CertificateRecord {
  id: string;
  certificateId: string;
  fullName: string;
  type: 'student' | 'professional';
  course: string;
  durationMonths: number;
  startDate: string;
  endDate: string;
  issueDate: string;
  college: string;
  keyAreas: string[];
  status: CertificateStatus;
  applicationId: string;
  createdAt: Timestamp | Date | null;
  createdBy: string;
}

const CERTIFICATE_DURATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const CERT_ID_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateRandomCode(length = 5): string {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    const idx = Math.floor(Math.random() * CERT_ID_ALPHABET.length);
    result += CERT_ID_ALPHABET[idx];
  }
  return result;
}

function buildAutoCertificateId(
  type: 'student' | 'professional',
  issueDateStr: string,
  code: string
): string {
  const prefix = type === 'student' ? 'STU' : 'PRO';
  const year = /^\d{4}/.test(issueDateStr)
    ? issueDateStr.slice(0, 4)
    : String(new Date().getFullYear());
  return `IAMT-${prefix}-${year}-${code}`;
}

function getTodayDateString(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const y = parts.find((p) => p.type === 'year')?.value;
  const m = parts.find((p) => p.type === 'month')?.value;
  const d = parts.find((p) => p.type === 'day')?.value;
  if (y && m && d) return `${y}-${m}-${d}`;
  return now.toISOString().slice(0, 10);
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

  // Active top-level tab
  const [activeTab, setActiveTab] = useState<AdminTab>('applications');

  // Applications data state
  const [applications, setApplications] = useState<InternshipApplicationRecord[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dataErrorCode, setDataErrorCode] = useState<string | null>(null);

  // Applications Filters
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
  const [isTouchOrMobileDevice, setIsTouchOrMobileDevice] = useState(false);

  // Certificates data state
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [isCertificatesLoading, setIsCertificatesLoading] = useState(false);
  const [certificatesErrorCode, setCertificatesErrorCode] = useState<string | null>(null);
  const [certificateSearchQuery, setCertificateSearchQuery] = useState('');

  // Certificate Generator Form state
  const [certType, setCertType] = useState<'student' | 'professional'>('student');
  const [certFullName, setCertFullName] = useState('');
  const [certCourseSelect, setCertCourseSelect] = useState<string>('Data Analytics');
  const [certCourseOther, setCertCourseOther] = useState('');
  const [certDurationMonths, setCertDurationMonths] = useState<number>(3);
  const [certStartDate, setCertStartDate] = useState('');
  const [certEndDate, setCertEndDate] = useState('');
  const [certIssueDate, setCertIssueDate] = useState<string>(() => getTodayDateString());
  const [certCollege, setCertCollege] = useState('');
  const [certKeyAreas, setCertKeyAreas] = useState<string[]>(() =>
    getDefaultSkillsForCourse('Data Analytics')
  );
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [certCustomId, setCertCustomId] = useState('');
  const [previewRandomCode, setPreviewRandomCode] = useState<string>(() =>
    generateRandomCode(5)
  );

  // Linked application when pre-filled from Applications tab
  const [linkedAppDocId, setLinkedAppDocId] = useState<string | null>(null);
  const [linkedAppPublicId, setLinkedAppPublicId] = useState<string>('');
  const [linkedAppEmail, setLinkedAppEmail] = useState<string>('');
  const [linkedAppPhone, setLinkedAppPhone] = useState<string>('');

  // Certificate Generation / Actions status
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const [certFormError, setCertFormError] = useState<string | null>(null);
  const [certFirebaseErrorCode, setCertFirebaseErrorCode] = useState<string | null>(null);
  const [generatedCert, setGeneratedCert] = useState<CertificateTemplateData | null>(null);
  const [updatingCertId, setUpdatingCertId] = useState<string | null>(null);

  // Preview Modal & PDF Capture state
  const [fullPreviewCert, setFullPreviewCert] = useState<CertificateTemplateData | null>(
    null
  );
  const [downloadingCertId, setDownloadingCertId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfRenderData, setPdfRenderData] = useState<CertificateTemplateData | null>(null);
  const pdfCaptureRef = useRef<HTMLDivElement | null>(null);
  const previewWrapperRef = useRef<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 820) {
      return Math.min(1, Math.max(0.25, (window.innerWidth - 68) / 794));
    }
    return 0.65;
  });
  const modalPreviewWrapperRef = useRef<HTMLDivElement | null>(null);
  const [modalPreviewScale, setModalPreviewScale] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 820) {
      return Math.min(1, Math.max(0.25, (window.innerWidth - 48) / 794));
    }
    return 1;
  });

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

  // Attach Firestore snapshot listener for internshipApplications ONLY when authenticated admin is verified
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
            certificateId: String(d.certificateId ?? ''),
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

  // Attach Firestore snapshot listener for certificates ONLY when authenticated admin is verified
  useEffect(() => {
    if (!authResolved || !user || !isAdmin || !db) {
      setCertificates([]);
      setIsCertificatesLoading(false);
      return;
    }

    setIsCertificatesLoading(true);
    setCertificatesErrorCode(null);

    const q = query(collection(db, 'certificates'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const rows: CertificateRecord[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data() as Record<string, unknown>;
          return {
            id: docSnap.id,
            certificateId: String(d.certificateId ?? docSnap.id),
            fullName: String(d.fullName ?? ''),
            type: d.type === 'professional' ? 'professional' : 'student',
            course: String(d.course ?? ''),
            durationMonths: Number(d.durationMonths ?? 1),
            startDate: String(d.startDate ?? ''),
            endDate: String(d.endDate ?? ''),
            issueDate: String(d.issueDate ?? ''),
            college: String(d.college ?? ''),
            keyAreas: Array.isArray(d.keyAreas)
              ? d.keyAreas.map((item) => String(item)).slice(0, 12)
              : [],
            status: d.status === 'revoked' ? 'revoked' : 'valid',
            applicationId: String(d.applicationId ?? ''),
            createdAt: (d.createdAt as Timestamp | Date | null) ?? null,
            createdBy: String(d.createdBy ?? ''),
          };
        });
        setCertificates(rows);
        setIsCertificatesLoading(false);
      },
      (err) => {
        setCertificatesErrorCode(extractFirebaseErrorCode(err));
        setIsCertificatesLoading(false);
      }
    );

    return () => unsubscribe();
  }, [authResolved, user, isAdmin]);

  // Responsive scale calculation for live certificate preview via ResizeObserver
  useEffect(() => {
    if (activeTab !== 'certificates') return;
    const el = previewWrapperRef.current;
    if (!el) return;

    const updateFromWidth = (width: number) => {
      if (width > 0) {
        const available =
          typeof window !== 'undefined' && window.innerWidth < 820
            ? Math.min(width, window.innerWidth - 64)
            : width;
        const nextScale =
          available >= 794 ? 1 : Math.max(0.25, (available - 2) / 794);
        setPreviewScale(nextScale);
      }
    };

    updateFromWidth(el.getBoundingClientRect().width || el.clientWidth);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width =
            entry.contentRect?.width ||
            el.getBoundingClientRect().width ||
            el.clientWidth;
          updateFromWidth(width);
        }
      });
      observer.observe(el);
    }

    const handleResize = () => {
      updateFromWidth(el.getBoundingClientRect().width || el.clientWidth);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [activeTab]);

  // Responsive scale calculation for full-size preview modal via ResizeObserver
  useEffect(() => {
    if (!fullPreviewCert) return;
    const el = modalPreviewWrapperRef.current;
    if (!el) return;

    const updateFromWidth = (width: number) => {
      if (width > 0) {
        const available =
          typeof window !== 'undefined' && window.innerWidth < 820
            ? Math.min(width, window.innerWidth - 40)
            : width;
        const nextScale =
          available >= 794 ? 1 : Math.max(0.25, (available - 2) / 794);
        setModalPreviewScale(nextScale);
      }
    };

    updateFromWidth(el.getBoundingClientRect().width || el.clientWidth);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width =
            entry.contentRect?.width ||
            el.getBoundingClientRect().width ||
            el.clientWidth;
          updateFromWidth(width);
        }
      });
      observer.observe(el);
    }

    const handleResize = () => {
      updateFromWidth(el.getBoundingClientRect().width || el.clientWidth);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [fullPreviewCert]);

  // Sync draft note whenever a different application is opened
  useEffect(() => {
    if (selectedApp) {
      setNoteDraft(selectedApp.adminNote ?? '');
      setIsRejectingPrompt(false);
      setRejectNoteDraft(selectedApp.adminNote ?? '');
      setActionErrorCode(null);
    }
  }, [selectedApp?.id]);

  // Close side panel or full preview modal on Escape key
  useEffect(() => {
    if (!selectedId && !fullPreviewCert) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (fullPreviewCert) {
          setFullPreviewCert(null);
        } else if (selectedId) {
          setSelectedId(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, fullPreviewCert]);

  // Auto-hide toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    if (!pdfError) return;
    const timer = setTimeout(() => setPdfError(null), 6000);
    return () => clearTimeout(timer);
  }, [pdfError]);

  // Detect phone/tablet (touch devices or viewport < 768px) for Call action behavior
  useEffect(() => {
    const checkDevice = () => {
      if (typeof window === 'undefined') return;
      const isNarrow = window.innerWidth < 768;
      const isCoarsePointer =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(pointer: coarse)').matches;
      setIsTouchOrMobileDevice(isNarrow || isCoarsePointer);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const copyToClipboard = async (text: string, successToast: string) => {
    if (!text) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setToastMessage(successToast);
  };

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
    setFullPreviewCert(null);
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

  // Client-side filtered applications list
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

  // Client-side filtered certificates list
  const filteredCertificates = useMemo(() => {
    const q = certificateSearchQuery.trim().toLowerCase();
    if (!q) return certificates;
    return certificates.filter(
      (cert) =>
        cert.fullName.toLowerCase().includes(q) ||
        cert.certificateId.toLowerCase().includes(q)
    );
  }, [certificates, certificateSearchQuery]);

  const resolvedCertCourse =
    certCourseSelect === 'Other' ? certCourseOther.trim() : certCourseSelect.trim();

  const previewCertificateId = useMemo(() => {
    if (certCustomId.trim()) return certCustomId.trim();
    if (generatedCert?.certificateId) return generatedCert.certificateId;
    return buildAutoCertificateId(certType, certIssueDate, previewRandomCode);
  }, [certCustomId, generatedCert?.certificateId, certType, certIssueDate, previewRandomCode]);

  const livePreviewData: CertificateTemplateData = useMemo(
    () => ({
      certificateId: previewCertificateId,
      fullName: certFullName,
      type: certType,
      course: resolvedCertCourse,
      durationMonths: certDurationMonths,
      startDate: certStartDate,
      endDate: certEndDate,
      issueDate: certIssueDate,
      college: certType === 'student' ? certCollege : '',
      keyAreas: certKeyAreas,
      status: 'valid',
    }),
    [
      previewCertificateId,
      certFullName,
      certType,
      resolvedCertCourse,
      certDurationMonths,
      certStartDate,
      certEndDate,
      certIssueDate,
      certCollege,
      certKeyAreas,
    ]
  );

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

  // Pre-fill Certificates tab from a completed application
  const handlePrefillCertificateFromApplication = (app: InternshipApplicationRecord) => {
    setCertFormError(null);
    setCertFirebaseErrorCode(null);
    setGeneratedCert(null);

    setCertType(app.type);
    setCertFullName(app.fullName);

    const matchedStandardCourse = COURSES.find(
      (c) => c !== 'Other' && c.toLowerCase() === app.course.trim().toLowerCase()
    );
    if (matchedStandardCourse) {
      setCertCourseSelect(matchedStandardCourse);
      setCertCourseOther('');
      setCertKeyAreas(getDefaultSkillsForCourse(matchedStandardCourse));
    } else if (app.course.trim()) {
      setCertCourseSelect('Other');
      setCertCourseOther(app.course.trim());
      setCertKeyAreas(getDefaultSkillsForCourse(app.course.trim()));
    } else {
      setCertCourseSelect('Data Analytics');
      setCertCourseOther('');
      setCertKeyAreas(getDefaultSkillsForCourse('Data Analytics'));
    }

    const validDuration =
      app.durationMonths >= 1 && app.durationMonths <= 12 ? app.durationMonths : 3;
    setCertDurationMonths(validDuration);
    setCertStartDate(app.startDate || '');
    setCertEndDate(app.endDate || '');
    setCertIssueDate(getTodayDateString());
    setCertCollege(app.type === 'student' ? app.college : '');
    setCertCustomId(app.certificateId || '');
    setPreviewRandomCode(generateRandomCode(5));

    setLinkedAppDocId(app.id);
    setLinkedAppPublicId(app.applicationId || '');
    setLinkedAppEmail(app.email || '');
    setLinkedAppPhone(app.phone || '');

    setSelectedId(null);
    setActiveTab('certificates');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearLinkedApplication = () => {
    setLinkedAppDocId(null);
    setLinkedAppPublicId('');
    setLinkedAppEmail('');
    setLinkedAppPhone('');
  };

  const handleCourseSelectChange = (nextCourse: string) => {
    setCertCourseSelect(nextCourse);
    setGeneratedCert(null);
    setCertKeyAreas(getDefaultSkillsForCourse(nextCourse));
  };

  const handleToggleSkill = (skillName: string) => {
    setGeneratedCert(null);
    setCertKeyAreas((prev) => {
      if (prev.includes(skillName)) {
        return prev.filter((s) => s !== skillName);
      }
      if (prev.length >= 12) {
        setToastMessage('Maximum 12 key areas allowed.');
        return prev;
      }
      return [...prev, skillName];
    });
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (certKeyAreas.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setCustomSkillInput('');
      return;
    }
    if (certKeyAreas.length >= 12) {
      setToastMessage('Maximum 12 key areas allowed.');
      return;
    }
    setGeneratedCert(null);
    setCertKeyAreas((prev) => [...prev, trimmed]);
    setCustomSkillInput('');
  };

  const handleGenerateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db || isGeneratingCert) return;

    setCertFormError(null);
    setCertFirebaseErrorCode(null);

    if (!certFullName.trim()) {
      setCertFormError('Please enter the recipient full name.');
      return;
    }
    if (!resolvedCertCourse) {
      setCertFormError('Please select or enter a course name.');
      return;
    }
    if (
      !Number.isFinite(certDurationMonths) ||
      certDurationMonths < 1 ||
      certDurationMonths > 12
    ) {
      setCertFormError('Duration must be between 1 and 12 months.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(certStartDate)) {
      setCertFormError('Please select a valid start date.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(certEndDate)) {
      setCertFormError('Please select a valid end date.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(certIssueDate)) {
      setCertFormError('Please select a valid issue date.');
      return;
    }
    if (certType === 'student' && !certCollege.trim()) {
      setCertFormError('Please enter the college name for Student Internship.');
      return;
    }
    if (certKeyAreas.length === 0 || certKeyAreas.length > 12) {
      setCertFormError('Please select between 1 and 12 key areas of work.');
      return;
    }

    setIsGeneratingCert(true);

    try {
      let finalCertificateId = '';
      const trimmedCustom = certCustomId.trim();

      if (trimmedCustom) {
        const existingSnap = await getDoc(doc(db, 'certificates', trimmedCustom));
        if (existingSnap.exists()) {
          setCertFormError(
            `Certificate number "${trimmedCustom}" already exists. Please enter a different custom number or leave it blank.`
          );
          setIsGeneratingCert(false);
          return;
        }
        finalCertificateId = trimmedCustom;
      } else {
        let candidateCode = previewRandomCode;
        for (let attempt = 0; attempt < 12; attempt += 1) {
          const candidateId = buildAutoCertificateId(
            certType,
            certIssueDate,
            candidateCode
          );
          const snap = await getDoc(doc(db, 'certificates', candidateId));
          if (!snap.exists()) {
            finalCertificateId = candidateId;
            break;
          }
          candidateCode = generateRandomCode(5);
        }
        if (!finalCertificateId) {
          throw new Error('Could not generate a unique certificate number. Please try again.');
        }
      }

      const publicCertificatePayload = {
        certificateId: finalCertificateId,
        fullName: certFullName.trim(),
        type: certType,
        course: resolvedCertCourse,
        durationMonths: Number(certDurationMonths),
        startDate: certStartDate,
        endDate: certEndDate,
        issueDate: certIssueDate,
        college: certType === 'student' ? certCollege.trim() : '',
        keyAreas: certKeyAreas.slice(0, 12),
        status: 'valid' as const,
        applicationId: linkedAppPublicId || '',
        createdAt: serverTimestamp(),
        createdBy: user.email || '',
      };

      await setDoc(doc(db, 'certificates', finalCertificateId), publicCertificatePayload);

      // If generated from an existing application, update ONLY certificateId, reviewedAt, reviewedBy
      if (linkedAppDocId) {
        await updateDoc(doc(db, 'internshipApplications', linkedAppDocId), {
          certificateId: finalCertificateId,
          reviewedAt: serverTimestamp(),
          reviewedBy: user.email || '',
        });
      }

      const savedTemplateData: CertificateTemplateData = {
        certificateId: finalCertificateId,
        fullName: publicCertificatePayload.fullName,
        type: publicCertificatePayload.type,
        course: publicCertificatePayload.course,
        durationMonths: publicCertificatePayload.durationMonths,
        startDate: publicCertificatePayload.startDate,
        endDate: publicCertificatePayload.endDate,
        issueDate: publicCertificatePayload.issueDate,
        college: publicCertificatePayload.college,
        keyAreas: publicCertificatePayload.keyAreas,
        status: 'valid',
      };

      setGeneratedCert(savedTemplateData);
      setPreviewRandomCode(generateRandomCode(5));
      setToastMessage(`Certificate ${finalCertificateId} generated!`);
    } catch (err) {
      setCertFirebaseErrorCode(extractFirebaseErrorCode(err));
    } finally {
      setIsGeneratingCert(false);
    }
  };

  const handleToggleCertificateStatus = async (cert: CertificateRecord) => {
    if (!db || updatingCertId) return;
    const nextStatus: CertificateStatus = cert.status === 'revoked' ? 'valid' : 'revoked';
    setUpdatingCertId(cert.certificateId);
    setCertificatesErrorCode(null);
    try {
      await updateDoc(doc(db, 'certificates', cert.certificateId), {
        status: nextStatus,
      });
      if (generatedCert?.certificateId === cert.certificateId) {
        setGeneratedCert({ ...generatedCert, status: nextStatus });
      }
      if (fullPreviewCert?.certificateId === cert.certificateId) {
        setFullPreviewCert({ ...fullPreviewCert, status: nextStatus });
      }
      setToastMessage(
        nextStatus === 'revoked'
          ? `Certificate ${cert.certificateId} revoked.`
          : `Certificate ${cert.certificateId} restored.`
      );
    } catch (err) {
      setCertificatesErrorCode(extractFirebaseErrorCode(err));
    } finally {
      setUpdatingCertId(null);
    }
  };

  const handleDownloadCertificatePdf = async (certData: CertificateTemplateData) => {
    if (downloadingCertId) return;
    const targetId = certData.certificateId || 'Preview';
    setDownloadingCertId(targetId);
    setPdfError(null);

    try {
      setPdfRenderData(certData);

      // Allow React to flush the off-screen CertificateTemplate and QRCodeCanvas
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(resolve, 120);
          });
        });
      });

      const captureElement = pdfCaptureRef.current;
      if (!captureElement) {
        throw new Error('Certificate capture element not ready.');
      }

      await downloadCertificatePdf(captureElement, targetId);
      setToastMessage(`Downloaded IAMTECHNI-Certificate-${targetId}.pdf`);
    } catch (err) {
      console.error('[AdminPage] Certificate PDF download failed:', err);
      setPdfError('Could not create the PDF. Please try again.');
    } finally {
      setDownloadingCertId(null);
    }
  };

  const buildShareMessage = (certData: CertificateTemplateData): string => {
    const verifyLink = `https://www.iamtechni.in/verify/${encodeURIComponent(
      certData.certificateId
    )}`;
    return `Hi ${certData.fullName}, congratulations on completing your ${certData.course} internship at IAMTECHNI! Your Certificate ID is ${certData.certificateId}. Verify your certificate here: ${verifyLink}`;
  };

  const buildWhatsAppShareUrl = (certData: CertificateTemplateData): string => {
    const message = buildShareMessage(certData);
    const rawDigits = linkedAppPhone.replace(/\D/g, '');
    if (rawDigits.length >= 10) {
      const normalized =
        rawDigits.startsWith('91') && rawDigits.length >= 12
          ? rawDigits
          : `91${rawDigits.replace(/^0+/, '').slice(-10)}`;
      return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
    }
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  const buildGmailShareUrl = (certData: CertificateTemplateData): string => {
    const subject = `IAMTECHNI Internship Certificate – ${certData.certificateId}`;
    const body = buildShareMessage(certData);
    const toParam = linkedAppEmail
      ? `&to=${encodeURIComponent(linkedAppEmail)}`
      : '';
    return `https://mail.google.com/mail/?view=cm&fs=1${toParam}&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
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

  const rawPhoneDigits = selectedApp
    ? selectedApp.phone.replace(/\D/g, '')
    : '';
  const whatsappDigits = rawPhoneDigits
    ? rawPhoneDigits.startsWith('91') && rawPhoneDigits.length >= 12
      ? rawPhoneDigits
      : `91${rawPhoneDigits.replace(/^0+/, '').slice(-10)}`
    : '';
  const gmailComposeUrl = selectedApp
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        selectedApp.email
      )}&su=${encodeURIComponent(
        `IAMTECHNI Internship – ${selectedApp.applicationId}`
      )}`
    : '#';
  const whatsappUrl =
    selectedApp && whatsappDigits
      ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
          `Hi ${selectedApp.fullName}, this is IAMTECHNI regarding your internship application ${selectedApp.applicationId}.`
        )}`
      : '#';

  // Verified Admin Dashboard
  return (
    <div
      className="min-h-[80vh] w-full min-w-0 overflow-x-hidden bg-[#F4F7FC] py-6 sm:py-10"
      style={{
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom))',
      }}
    >
      <Helmet>
        <title>Internship Applications Admin | IAMTECHNI</title>
        <meta name="robots" content="noindex, nofollow" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Manrope:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400&display=swap"
        />
      </Helmet>

      {/* Off-screen 1:1 unscaled render target (794 × 1123 px) for html2canvas + jsPDF */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-10000px',
          top: 0,
          width: '794px',
          height: '1123px',
          transform: 'none',
          pointerEvents: 'none',
          zIndex: -1,
          overflow: 'hidden',
        }}
      >
        <CertificateTemplate
          containerRef={pdfCaptureRef}
          data={pdfRenderData ?? livePreviewData}
        />
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Bar */}
        <header className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                  Internship Admin Dashboard
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
          </div>

          {/* Top Navigation Tabs: Applications | Certificates */}
          <div
            role="tablist"
            aria-label="Admin sections"
            className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'applications'}
              onClick={() => setActiveTab('applications')}
              className={`min-h-[44px] px-5 py-2.5 rounded-xl font-semibold text-sm transition-all inline-flex items-center gap-2 cursor-pointer ${
                activeTab === 'applications'
                  ? 'text-white shadow-sm'
                  : 'bg-[#F4F7FC] hover:bg-[#EEF4FF] text-slate-700 hover:text-[#1C35EA]'
              }`}
              style={
                activeTab === 'applications'
                  ? {
                      background:
                        'linear-gradient(135deg, #00B0F0 0%, #1C35EA 40%, #4D19EA 100%)',
                    }
                  : undefined
              }
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Applications</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                  activeTab === 'applications'
                    ? 'bg-white/20 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {applications.length}
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'certificates'}
              onClick={() => setActiveTab('certificates')}
              className={`min-h-[44px] px-5 py-2.5 rounded-xl font-semibold text-sm transition-all inline-flex items-center gap-2 cursor-pointer ${
                activeTab === 'certificates'
                  ? 'text-white shadow-sm'
                  : 'bg-[#F4F7FC] hover:bg-[#EEF4FF] text-slate-700 hover:text-[#1C35EA]'
              }`}
              style={
                activeTab === 'certificates'
                  ? {
                      background:
                        'linear-gradient(135deg, #00B0F0 0%, #1C35EA 40%, #4D19EA 100%)',
                    }
                  : undefined
              }
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>Certificates</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                  activeTab === 'certificates'
                    ? 'bg-white/20 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {certificates.length}
              </span>
            </button>
          </div>
        </header>

        {activeTab === 'applications' ? (
          <>
            {/* 4 Stat Cards */}
            <section
              aria-label="Application statistics"
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            >
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-slate-500">
                    Total
                  </span>
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
                  <span className="text-xs sm:text-sm font-semibold text-slate-500">
                    Pending
                  </span>
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
                  <span className="text-xs sm:text-sm font-semibold text-slate-500">
                    Approved
                  </span>
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
                  <span className="text-xs sm:text-sm font-semibold text-slate-500">
                    Completed
                  </span>
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
                <p className="text-base font-semibold text-slate-700">
                  No applications yet.
                </p>
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
                              <div className="font-semibold text-slate-900">
                                {app.fullName}
                              </div>
                              <div className="text-xs text-slate-500">{app.email}</div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                              {app.type === 'student' ? 'Student' : 'Professional'}
                            </td>
                            <td className="py-3.5 px-4 text-slate-800">
                              {app.course || '-'}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                              {formatDuration(app.durationMonths)}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                              {formatDateShort(app.startDate)} –{' '}
                              {formatDateShort(app.endDate)}
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
                        <div className="font-bold text-base text-slate-900">
                          {app.fullName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {app.type === 'student' ? 'Student' : 'Professional'} ·{' '}
                          {app.course}
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
                            {formatDateShort(app.startDate)} –{' '}
                            {formatDateShort(app.endDate)}
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
          </>
        ) : (
          /* ================================================================= */
          /* CERTIFICATES TAB                                                  */
          /* ================================================================= */
          <div className="space-y-8">
            {/* Top Section: Form on Left, Sticky Live Preview on Right (lg: 1024px+), Stacked below 1024px */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Generate Certificate Form */}
              <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden min-w-0">
                <div
                  className="h-1.5 w-full"
                  style={{
                    background:
                      'linear-gradient(90deg, #00B0F0 0%, #1C35EA 50%, #4D19EA 100%)',
                  }}
                />

                <div className="p-4 sm:p-7 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2
                        data-no-scroll-zoom
                        className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl font-bold text-[#1E3A8A]"
                      >
                        Generate Certificate
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Create a verifiable A4 internship certificate with QR code.
                      </p>
                    </div>
                  </div>

                  {linkedAppDocId && (
                    <div className="p-3.5 rounded-xl bg-[#EEF4FF] border border-[#1C35EA]/25 flex items-center justify-between gap-3">
                      <div className="text-xs sm:text-sm text-[#1E3A8A] min-w-0 break-all">
                        <span className="font-semibold">Pre-filled from application:</span>{' '}
                        <span className="font-mono font-bold text-[#1C35EA]">
                          {linkedAppPublicId || linkedAppDocId}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearLinkedApplication}
                        className="text-xs font-semibold text-slate-600 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-white/80 transition-colors cursor-pointer shrink-0"
                      >
                        Unlink
                      </button>
                    </div>
                  )}

                  {certFormError && (
                    <div
                      role="alert"
                      className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{certFormError}</span>
                    </div>
                  )}

                  {certFirebaseErrorCode && (
                    <div
                      role="alert"
                      className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <div className="min-w-0 break-all">
                        <span className="font-semibold">
                          Could not save or export certificate:
                        </span>{' '}
                        <code className="font-mono text-xs bg-rose-100 px-1.5 py-0.5 rounded">
                          {certFirebaseErrorCode}
                        </code>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleGenerateCertificate} className="space-y-4">
                    {/* Internship Type */}
                    <div>
                      <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Internship type
                      </span>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            setCertType('student');
                            setGeneratedCert(null);
                          }}
                          className={`min-h-[44px] px-4 py-2 rounded-xl border text-sm font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer ${
                            certType === 'student'
                              ? 'border-[#1C35EA] bg-[#EEF4FF] text-[#1C35EA]'
                              : 'border-slate-200 bg-[#F4F7FC] text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <GraduationCap className="w-4 h-4 shrink-0" />
                          <span>Student</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setCertType('professional');
                            setGeneratedCert(null);
                          }}
                          className={`min-h-[44px] px-4 py-2 rounded-xl border text-sm font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer ${
                            certType === 'professional'
                              ? 'border-[#1C35EA] bg-[#EEF4FF] text-[#1C35EA]'
                              : 'border-slate-200 bg-[#F4F7FC] text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <Briefcase className="w-4 h-4 shrink-0" />
                          <span>Professional</span>
                        </button>
                      </div>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="cert-full-name"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Full name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="cert-full-name"
                        type="text"
                        required
                        value={certFullName}
                        onChange={(e) => {
                          setCertFullName(e.target.value);
                          setGeneratedCert(null);
                        }}
                        placeholder="e.g. Hari Prasanna"
                        className="w-full h-11 min-h-[44px] px-3.5 text-[16px] rounded-xl border border-slate-200 bg-[#F4F7FC] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#1C35EA]"
                      />
                    </div>

                    {/* Course + Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="cert-course-select"
                          className="block text-xs font-semibold text-slate-700 mb-1"
                        >
                          Course <span className="text-rose-500">*</span>
                        </label>
                        <select
                          id="cert-course-select"
                          value={certCourseSelect}
                          onChange={(e) => handleCourseSelectChange(e.target.value)}
                          className="w-full h-11 min-h-[44px] px-3.5 text-[16px] rounded-xl border border-slate-200 bg-[#F4F7FC] text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#1C35EA] cursor-pointer"
                        >
                          {COURSES.map((courseName) => (
                            <option key={courseName} value={courseName}>
                              {courseName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="cert-duration-select"
                          className="block text-xs font-semibold text-slate-700 mb-1"
                        >
                          Duration <span className="text-rose-500">*</span>
                        </label>
                        <select
                          id="cert-duration-select"
                          value={certDurationMonths}
                          onChange={(e) => {
                            setCertDurationMonths(Number(e.target.value));
                            setGeneratedCert(null);
                          }}
                          className="w-full h-11 min-h-[44px] px-3.5 text-[16px] rounded-xl border border-slate-200 bg-[#F4F7FC] text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#1C35EA] cursor-pointer"
                        >
                          {CERTIFICATE_DURATIONS.map((m) => (
                            <option key={m} value={m}>
                              {m} {m === 1 ? 'month' : 'months'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Custom Course Input if "Other" is selected */}
                    {certCourseSelect === 'Other' && (
                      <div>
                        <label
                          htmlFor="cert-course-other"
                          className="block text-xs font-semibold text-slate-700 mb-1"
                        >
                          Custom course name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="cert-course-other"
                          type="text"
                          required
                          value={certCourseOther}
                          onChange={(e) => {
                            setCertCourseOther(e.target.value);
                            setGeneratedCert(null);
                          }}
                          placeholder="Enter custom course title…"
                          className="w-full h-11 min-h-[44px] px-3.5 text-[16px] rounded-xl border border-slate-200 bg-[#F4F7FC] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#1C35EA]"
                        />
                      </div>
                    )}

                    {/* Dates: 3 in a row on desktop/tablet, stacked on phones */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label
                          htmlFor="cert-start-date"
                          className="block text-xs font-semibold text-slate-700 mb-1"
                        >
                          Start date <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="cert-start-date"
                          type="date"
                          required
                          value={certStartDate}
                          onChange={(e) => {
                            setCertStartDate(e.target.value);
                            setGeneratedCert(null);
                          }}
                          className="w-full h-11 min-h-[44px] px-3 text-[16px] sm:text-sm rounded-xl border border-slate-200 bg-[#F4F7FC] text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#1C35EA]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="cert-end-date"
                          className="block text-xs font-semibold text-slate-700 mb-1"
                        >
                          End date <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="cert-end-date"
                          type="date"
                          required
                          value={certEndDate}
                          onChange={(e) => {
                            setCertEndDate(e.target.value);
                            setGeneratedCert(null);
                          }}
                          className="w-full h-11 min-h-[44px] px-3 text-[16px] sm:text-sm rounded-xl border border-slate-200 bg-[#F4F7FC] text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#1C35EA]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="cert-issue-date"
                          className="block text-xs font-semibold text-slate-700 mb-1"
                        >
                          Issue date <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="cert-issue-date"
                          type="date"
                          required
                          value={certIssueDate}
                          onChange={(e) => {
                            setCertIssueDate(e.target.value);
                            setGeneratedCert(null);
                          }}
                          className="w-full h-11 min-h-[44px] px-3 text-[16px] sm:text-sm rounded-xl border border-slate-200 bg-[#F4F7FC] text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#1C35EA]"
                        />
                      </div>
                    </div>

                    {/* College (only for Student) */}
                    {certType === 'student' && (
                      <div>
                        <label
                          htmlFor="cert-college"
                          className="block text-xs font-semibold text-slate-700 mb-1"
                        >
                          College <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="cert-college"
                          type="text"
                          required
                          value={certCollege}
                          onChange={(e) => {
                            setCertCollege(e.target.value);
                            setGeneratedCert(null);
                          }}
                          placeholder="e.g. Pondicherry Engineering College"
                          className="w-full h-11 min-h-[44px] px-3.5 text-[16px] rounded-xl border border-slate-200 bg-[#F4F7FC] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#1C35EA]"
                        />
                      </div>
                    )}

                    {/* Key Areas of Work (Multi-select chips, max 12) */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-semibold text-slate-700">
                          Key areas of work (max 12) <span className="text-rose-500">*</span>
                        </span>
                        <span className="text-xs font-mono font-semibold text-[#1C35EA]">
                          {certKeyAreas.length} / 12 selected
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-slate-200 bg-[#F8FAFF] max-h-[260px] overflow-y-auto">
                        {CERTIFICATE_SKILLS.map((skill) => {
                          const isSelected = certKeyAreas.includes(skill.name);
                          return (
                            <button
                              key={skill.name}
                              type="button"
                              onClick={() => handleToggleSkill(skill.name)}
                              className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer border ${
                                isSelected
                                  ? 'bg-[#1C35EA] text-white border-[#1C35EA] shadow-2xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-[#1C35EA]/40'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                              <span>{skill.name}</span>
                            </button>
                          );
                        })}

                        {/* Custom skills typed by the admin: added as chips and removable with ✕ */}
                        {certKeyAreas
                          .filter(
                            (name) =>
                              !CERTIFICATE_SKILLS.some(
                                (s) => s.name.toLowerCase() === name.toLowerCase()
                              )
                          )
                          .map((customName) => (
                            <button
                              key={customName}
                              type="button"
                              onClick={() => handleToggleSkill(customName)}
                              aria-label={`Remove ${customName}`}
                              className="min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer border bg-[#4D19EA] text-white border-[#4D19EA] shadow-2xs hover:bg-[#3b11bd]"
                            >
                              <span>{customName}</span>
                              <span
                                aria-hidden="true"
                                className="ml-0.5 text-white/90 hover:text-white font-bold leading-none"
                              >
                                ✕
                              </span>
                            </button>
                          ))}
                      </div>

                      {/* Optional custom tool chip input */}
                      <div className="flex flex-col min-[420px]:flex-row items-stretch min-[420px]:items-center gap-2 mt-2">
                        <input
                          type="text"
                          value={customSkillInput}
                          onChange={(e) => setCustomSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomSkill();
                            }
                          }}
                          placeholder="Add another tool/skill (optional)…"
                          className="flex-1 h-11 min-h-[44px] px-3.5 text-[16px] sm:text-xs rounded-xl border border-slate-200 bg-[#F4F7FC] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#1C35EA]"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomSkill}
                          disabled={!customSkillInput.trim() || certKeyAreas.length >= 12}
                          className="h-11 min-h-[44px] px-4 rounded-xl border border-slate-200 bg-white hover:bg-[#EEF4FF] text-[#1C35EA] text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                          <Plus className="w-4 h-4 shrink-0" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>

                    {/* Custom Certificate Number (optional) */}
                    <div>
                      <label
                        htmlFor="cert-custom-id"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Custom certificate number{' '}
                        <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <input
                        id="cert-custom-id"
                        type="text"
                        value={certCustomId}
                        onChange={(e) => {
                          setCertCustomId(e.target.value);
                          setGeneratedCert(null);
                        }}
                        placeholder="Leave blank to auto-generate (e.g. IAMT-INT-DA-2026-0041)"
                        className="w-full h-11 min-h-[44px] px-3.5 font-mono text-[16px] sm:text-sm rounded-xl border border-slate-200 bg-[#F4F7FC] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#1C35EA]"
                      />
                    </div>

                    {/* Generate Submit Button (Full width on phones and desktop) */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isGeneratingCert}
                        className="w-full min-h-[48px] px-6 py-3 rounded-xl text-white font-semibold text-sm sm:text-base shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-4px_rgba(28,53,234,0.38)] active:scale-[0.98] inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                          background:
                            'linear-gradient(135deg, #00B0F0 0%, #1C35EA 35%, #4D19EA 100%)',
                        }}
                      >
                        {isGeneratingCert ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                            <span>Generating certificate…</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 shrink-0" />
                            <span>Generate</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Generated Certificate Success Banner & Quick Actions */}
                  {generatedCert && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-emerald-950">
                            Certificate generated successfully!
                          </div>
                          <div className="mt-1 font-mono text-sm sm:text-base font-bold text-[#1E3A8A] break-all">
                            {generatedCert.certificateId}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          disabled={Boolean(downloadingCertId)}
                          onClick={() => handleDownloadCertificatePdf(generatedCert)}
                          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1C35EA] hover:bg-[#172bc2] text-white text-xs sm:text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                        >
                          {downloadingCertId === generatedCert.certificateId ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                              <span>Preparing PDF…</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 shrink-0" />
                              <span>Download PDF</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              `https://www.iamtechni.in/verify/${generatedCert.certificateId}`,
                              'Verification link copied!'
                            )
                          }
                          className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-[#EEF4FF] text-[#1C35EA] text-xs sm:text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Link2 className="w-4 h-4 shrink-0" />
                          <span>Copy link</span>
                        </button>

                        <a
                          href={buildWhatsAppShareUrl(generatedCert)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[44px] px-4 py-2 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-100 text-emerald-700 text-xs sm:text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4 shrink-0" />
                          <span>Share on WhatsApp</span>
                        </a>

                        <a
                          href={buildGmailShareUrl(generatedCert)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-[#EEF4FF] text-[#1C35EA] text-xs sm:text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2"
                        >
                          <Mail className="w-4 h-4 shrink-0" />
                          <span>Email</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Scaled Live Preview (sticky on desktop lg:sticky lg:top-6, full width below form on <1024px) */}
              <div className="lg:col-span-6 lg:sticky lg:top-6 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 flex flex-col items-center space-y-3 min-w-0">
                <div className="w-full flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="!font-['Outfit','Space_Grotesk',sans-serif] text-base font-bold text-[#1E3A8A]">
                      Live Certificate Preview
                    </h3>
                    <p className="text-xs text-slate-500">
                      Click the certificate to inspect at full A4 resolution (794 × 1123 px)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFullPreviewCert(generatedCert ?? livePreviewData)}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl border border-slate-200 bg-[#F8FAFF] hover:bg-[#EEF4FF] text-[#1C35EA] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Full size</span>
                  </button>
                </div>

                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Open full-size certificate preview"
                  onClick={() => setFullPreviewCert(generatedCert ?? livePreviewData)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setFullPreviewCert(generatedCert ?? livePreviewData);
                    }
                  }}
                  className="w-full bg-slate-100/80 rounded-xl border border-slate-200/90 p-2 sm:p-4 flex items-center justify-center overflow-hidden cursor-zoom-in group"
                >
                  <div
                    ref={previewWrapperRef}
                    className="w-full max-w-[794px] mx-auto flex justify-center overflow-hidden"
                  >
                    <div
                      style={{
                        width: `${Math.floor(794 * previewScale)}px`,
                        height: `${Math.ceil(1123 * previewScale)}px`,
                        position: 'relative',
                      }}
                      className="shadow-lg bg-white shrink-0"
                    >
                      <div
                        style={{
                          width: '794px',
                          height: '1123px',
                          transform: `scale(${previewScale})`,
                          transformOrigin: 'top left',
                        }}
                      >
                        <CertificateTemplate data={generatedCert ?? livePreviewData} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: All Certificates List */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2
                    data-no-scroll-zoom
                    className="!font-['Outfit','Space_Grotesk',sans-serif] text-lg sm:text-xl font-bold text-[#1E3A8A]"
                  >
                    Issued Certificates ({certificates.length})
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Newest first · Search by recipient name or certificate number
                  </p>
                </div>

                <div className="w-full sm:w-80 relative">
                  <Search
                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={certificateSearchQuery}
                    onChange={(e) => setCertificateSearchQuery(e.target.value)}
                    placeholder="Search by name or certificate ID…"
                    aria-label="Search certificates"
                    className="w-full h-11 min-h-[44px] pl-10 pr-3.5 text-[16px] sm:text-sm rounded-xl border border-slate-200 bg-[#F4F7FC] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#1C35EA]"
                  />
                </div>
              </div>

              {certificatesErrorCode && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5"
                >
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div className="min-w-0 break-all">
                    <span className="font-semibold">Certificate operation error:</span>{' '}
                    <code className="font-mono text-xs bg-rose-100 px-1.5 py-0.5 rounded">
                      {certificatesErrorCode}
                    </code>
                  </div>
                </div>
              )}

              {isCertificatesLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-600">
                  <Loader2 className="w-8 h-8 text-[#1C35EA] animate-spin" />
                  <p className="text-sm font-medium">Loading certificates…</p>
                </div>
              ) : filteredCertificates.length === 0 ? (
                <div className="py-10 text-center space-y-2 text-slate-500">
                  <Award className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">
                    {certificates.length === 0
                      ? 'No certificates generated yet.'
                      : 'No certificates match your search.'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table (1024px and up) */}
                  <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F8FAFF] border-b border-slate-200 text-xs font-mono uppercase tracking-wider text-slate-600">
                          <th className="py-3 px-4 font-bold">Certificate ID</th>
                          <th className="py-3 px-4 font-bold">Name</th>
                          <th className="py-3 px-4 font-bold">Course &amp; Type</th>
                          <th className="py-3 px-4 font-bold">Issue Date</th>
                          <th className="py-3 px-4 font-bold">Status</th>
                          <th className="py-3 px-4 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {filteredCertificates.map((cert) => {
                          const certTemplateObj: CertificateTemplateData = {
                            certificateId: cert.certificateId,
                            fullName: cert.fullName,
                            type: cert.type,
                            course: cert.course,
                            durationMonths: cert.durationMonths,
                            startDate: cert.startDate,
                            endDate: cert.endDate,
                            issueDate: cert.issueDate,
                            college: cert.college,
                            keyAreas: cert.keyAreas,
                            status: cert.status,
                          };
                          return (
                            <tr key={cert.id} className="hover:bg-[#F8FAFF]">
                              <td className="py-3.5 px-4 font-mono font-bold text-[#1E3A8A] break-all max-w-[220px]">
                                {cert.certificateId}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-semibold text-slate-900">
                                  {cert.fullName}
                                </div>
                                {cert.college && (
                                  <div className="text-xs text-slate-500 truncate max-w-xs">
                                    {cert.college}
                                  </div>
                                )}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="text-slate-800 font-medium">
                                  {cert.course}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {cert.type === 'student' ? 'Student' : 'Professional'} ·{' '}
                                  {formatDuration(cert.durationMonths)}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                                {formatCertificateDate(cert.issueDate)}
                              </td>
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                    cert.status === 'revoked'
                                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  }`}
                                >
                                  {cert.status === 'revoked' ? 'Revoked' : 'Valid'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setFullPreviewCert(certTemplateObj)}
                                    className="min-h-[38px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-[#EEF4FF] text-[#1C35EA] text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>View</span>
                                  </button>

                                  <button
                                    type="button"
                                    disabled={Boolean(downloadingCertId)}
                                    onClick={() =>
                                      handleDownloadCertificatePdf(certTemplateObj)
                                    }
                                    className="min-h-[38px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-[#EEF4FF] text-[#1C35EA] text-xs font-semibold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                  >
                                    {downloadingCertId === cert.certificateId ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Download className="w-3.5 h-3.5" />
                                    )}
                                    <span>Download PDF</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyToClipboard(
                                        `https://www.iamtechni.in/verify/${cert.certificateId}`,
                                        'Verification link copied!'
                                      )
                                    }
                                    className="min-h-[38px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-[#EEF4FF] text-slate-700 hover:text-[#1C35EA] text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy link</span>
                                  </button>

                                  <button
                                    type="button"
                                    disabled={updatingCertId === cert.certificateId}
                                    onClick={() => handleToggleCertificateStatus(cert)}
                                    className={`min-h-[38px] px-2.5 py-1.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50 ${
                                      cert.status === 'revoked'
                                        ? 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                        : 'border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700'
                                    }`}
                                  >
                                    {cert.status === 'revoked' ? (
                                      <>
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>Restore</span>
                                      </>
                                    ) : (
                                      <>
                                        <Ban className="w-3.5 h-3.5" />
                                        <span>Revoke</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Stacked Cards on Phones and Small Tablets (below 1024px) */}
                  <div className="lg:hidden space-y-3">
                    {filteredCertificates.map((cert) => {
                      const certTemplateObj: CertificateTemplateData = {
                        certificateId: cert.certificateId,
                        fullName: cert.fullName,
                        type: cert.type,
                        course: cert.course,
                        durationMonths: cert.durationMonths,
                        startDate: cert.startDate,
                        endDate: cert.endDate,
                        issueDate: cert.issueDate,
                        college: cert.college,
                        keyAreas: cert.keyAreas,
                        status: cert.status,
                      };
                      return (
                        <div
                          key={cert.id}
                          className="rounded-xl border border-slate-200 p-4 space-y-3 bg-[#F8FAFF] min-w-0"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-slate-900 break-words">
                                {cert.fullName}
                              </div>
                              <div className="font-mono text-xs font-bold text-[#1C35EA] break-all mt-0.5">
                                {cert.certificateId}
                              </div>
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border shrink-0 ${
                                cert.status === 'revoked'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {cert.status === 'revoked' ? 'Revoked' : 'Valid'}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <div className="text-xs text-slate-600 break-words">
                              {cert.course} ·{' '}
                              {cert.type === 'student' ? 'Student' : 'Professional'} (
                              {formatDuration(cert.durationMonths)})
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              Issued: {formatCertificateDate(cert.issueDate)}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80">
                            <button
                              type="button"
                              onClick={() => setFullPreviewCert(certTemplateObj)}
                              className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-slate-200 bg-white text-[#1C35EA] text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 shrink-0" />
                              <span>View</span>
                            </button>

                            <button
                              type="button"
                              disabled={Boolean(downloadingCertId)}
                              onClick={() => handleDownloadCertificatePdf(certTemplateObj)}
                              className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-slate-200 bg-white text-[#1C35EA] text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              {downloadingCertId === cert.certificateId ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                              ) : (
                                <Download className="w-3.5 h-3.5 shrink-0" />
                              )}
                              <span>Download PDF</span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                copyToClipboard(
                                  `https://www.iamtechni.in/verify/${cert.certificateId}`,
                                  'Verification link copied!'
                                )
                              }
                              className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5 shrink-0" />
                              <span>Copy link</span>
                            </button>

                            <button
                              type="button"
                              disabled={updatingCertId === cert.certificateId}
                              onClick={() => handleToggleCertificateStatus(cert)}
                              className={`w-full min-h-[44px] px-3 py-2 rounded-lg border text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                                cert.status === 'revoked'
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                  : 'border-rose-200 bg-rose-50 text-rose-700'
                              }`}
                            >
                              {cert.status === 'revoked' ? (
                                <>
                                  <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                                  <span>Restore</span>
                                </>
                              ) : (
                                <>
                                  <Ban className="w-3.5 h-3.5 shrink-0" />
                                  <span>Revoke</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </section>
          </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="flex items-stretch gap-1.5">
                  <a
                    href={gmailComposeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFF] hover:bg-[#EEF4FF] text-[#1C35EA] text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-4 h-4 shrink-0" />
                    <span>Email</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedApp.email, 'Email copied')}
                    aria-label="Copy email address"
                    title="Copy email"
                    className="min-h-[44px] min-w-[44px] px-2.5 rounded-xl border border-slate-200 bg-[#F8FAFF] hover:bg-[#EEF4FF] text-[#1C35EA] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    <Copy className="w-4 h-4 shrink-0" />
                  </button>
                </div>

                {isTouchOrMobileDevice ? (
                  <a
                    href={`tel:${selectedApp.phone}`}
                    className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFF] hover:bg-[#EEF4FF] text-[#1C35EA] text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>Call</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        selectedApp.phone,
                        `Phone number copied: ${selectedApp.phone}`
                      )
                    }
                    className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFF] hover:bg-[#EEF4FF] text-[#1C35EA] text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>Call</span>
                  </button>
                )}

                <a
                  href={whatsappUrl}
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
                      onClick={() => handlePrefillCertificateFromApplication(selectedApp)}
                      className="min-h-[44px] px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-xs transition-all hover:opacity-95 inline-flex items-center gap-2 cursor-pointer"
                      style={{
                        background:
                          'linear-gradient(135deg, #00B0F0 0%, #1C35EA 40%, #4D19EA 100%)',
                      }}
                    >
                      <Award className="w-4 h-4 shrink-0" />
                      <span>Generate Certificate</span>
                    </button>
                  )}
                </div>

                {selectedApp.certificateId && (
                  <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
                    <span>
                      Certificate ID:{' '}
                      <strong className="font-mono">{selectedApp.certificateId}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          `https://www.iamtechni.in/verify/${selectedApp.certificateId}`,
                          'Certificate link copied!'
                        )
                      }
                      className="font-semibold text-[#1C35EA] hover:underline cursor-pointer"
                    >
                      Copy verify link
                    </button>
                  </div>
                )}

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
                      <dt className="text-xs font-semibold text-slate-500">
                        Currently working
                      </dt>
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

      {/* Full-Size Certificate Preview Modal */}
      {fullPreviewCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-900/65 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label="Full-size certificate preview"
        >
          <div className="relative w-full max-w-[860px] max-h-[94vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
              <div className="min-w-0">
                <div className="font-mono text-sm font-bold text-[#1C35EA] break-all">
                  {fullPreviewCert.certificateId}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {fullPreviewCert.fullName || 'Applicant'} ·{' '}
                  {fullPreviewCert.course || 'Course'}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={Boolean(downloadingCertId)}
                  onClick={() => handleDownloadCertificatePdf(fullPreviewCert)}
                  className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-[#1C35EA] hover:bg-[#172bc2] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {downloadingCertId === fullPreviewCert.certificateId ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>Download PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      `https://www.iamtechni.in/verify/${fullPreviewCert.certificateId}`,
                      'Verification link copied!'
                    )
                  }
                  className="min-h-[44px] px-3 py-1.5 rounded-xl border border-slate-200 bg-[#F8FAFF] hover:bg-[#EEF4FF] text-[#1C35EA] text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Copy link</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFullPreviewCert(null)}
                  aria-label="Close preview"
                  className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 bg-slate-100">
              <div
                ref={modalPreviewWrapperRef}
                className="w-full max-w-[794px] mx-auto flex justify-center overflow-hidden"
              >
                <div
                  style={{
                    width: `${Math.floor(794 * modalPreviewScale)}px`,
                    height: `${Math.ceil(1123 * modalPreviewScale)}px`,
                    position: 'relative',
                  }}
                  className="shadow-xl bg-white shrink-0"
                >
                  <div
                    style={{
                      width: '794px',
                      height: '1123px',
                      transform: `scale(${modalPreviewScale})`,
                      transformOrigin: 'top left',
                    }}
                  >
                    <CertificateTemplate data={fullPreviewCert} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Error Toast */}
      {pdfError && (
        <div
          role="alert"
          className="fixed bottom-5 right-5 z-[60] bg-rose-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{pdfError}</span>
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
