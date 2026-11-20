import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  Award,
  Check,
  CheckCircle2,
  Copy,
  Download,
  KeyRound,
  Loader2,
  Mail,
  Printer,
  RefreshCw,
  Search,
  Share2,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { downloadCertificatePdf } from '../lib/certificatePdf';
import {
  CertificateTemplate,
  formatCertificateDate,
  type CertificateTemplateData,
  type CertificateType,
} from '../components/certificate/CertificateTemplate';
import { FullScreenLoader } from '../components/common/FullScreenLoader';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { AnimatedHeading } from '../components/common/AnimatedHeading';
import { formatSeoTitle, formatMetaDescription } from '../components/common/SeoHead';
import { PageRoute } from '../types';

export interface VerifyCertificatePageProps {
  onNavigate?: (route: PageRoute) => void;
}

interface CertificateStatusSummary {
  certificateId: string;
  status: 'valid' | 'revoked';
  fullName: string;
  type: CertificateType;
  course: string;
  issueDate?: string;
}

function normalizeCertificateType(raw: unknown): CertificateType {
  if (raw === 'course_completion') return 'course_completion';
  if (raw === 'professional') return 'professional';
  return 'student';
}

interface CachedVerifiedCertificate {
  expiresAt: number;
  data: CertificateTemplateData;
}

const SESSION_CACHE_PREFIX = 'iamtechni_verified_cert_v1_';
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes
const RESEND_COOLDOWN_SECONDS = 60;

function getSessionCachedCertificate(
  certificateId: string
): CertificateTemplateData | null {
  if (typeof window === 'undefined' || !certificateId) return null;
  try {
    const raw = window.sessionStorage.getItem(
      `${SESSION_CACHE_PREFIX}${certificateId.toUpperCase()}`
    );
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedVerifiedCertificate;
    if (
      !parsed ||
      typeof parsed.expiresAt !== 'number' ||
      Date.now() > parsed.expiresAt ||
      !parsed.data
    ) {
      window.sessionStorage.removeItem(
        `${SESSION_CACHE_PREFIX}${certificateId.toUpperCase()}`
      );
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

function setSessionCachedCertificate(data: CertificateTemplateData): void {
  if (typeof window === 'undefined' || !data?.certificateId) return;
  try {
    const payload: CachedVerifiedCertificate = {
      expiresAt: Date.now() + SESSION_TTL_MS,
      data,
    };
    window.sessionStorage.setItem(
      `${SESSION_CACHE_PREFIX}${data.certificateId.toUpperCase()}`,
      JSON.stringify(payload)
    );
  } catch {
    // Ignore storage quota errors
  }
}

function formatDurationLabel(months: number): string {
  const num = Number.isFinite(months) && months > 0 ? months : 1;
  return `${num} ${num === 1 ? 'month' : 'months'}`;
}

export const VerifyCertificatePage: React.FC<VerifyCertificatePageProps> = ({
  onNavigate,
}) => {
  const { certificateId: routeCertId } = useParams<{ certificateId?: string }>();
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState<string>(() =>
    (routeCertId ?? '').trim().toUpperCase()
  );

  // Loader state: null when idle, or the exact message for FullScreenLoader
  const [loaderMessage, setLoaderMessage] = useState<string | null>(null);

  // Step 1 state: status summary from GET /api/certificate-status
  const [statusSummary, setStatusSummary] =
    useState<CertificateStatusSummary | null>(null);
  const [notFoundId, setNotFoundId] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  // Step 1 -> Step 2 OTP state
  const [emailInput, setEmailInput] = useState<string>('');
  const [otpRequestId, setOtpRequestId] = useState<string | null>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendSecondsLeft, setResendSecondsLeft] = useState<number>(0);

  // Step 3 state: full verified certificate returned after OTP verification (or 30-min sessionStorage)
  const [verifiedData, setVerifiedData] =
    useState<CertificateTemplateData | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const certContainerWrapperRef = useRef<HTMLDivElement | null>(null);
  const pdfCaptureRef = useRef<HTMLDivElement | null>(null);
  const [certScale, setCertScale] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 820) {
      return Math.min(1, Math.max(0.25, (window.innerWidth - 36) / 794));
    }
    return 1;
  });
  const lastLookedUpRef = useRef<string | null>(null);

  // 60-second countdown timer for "Resend code"
  useEffect(() => {
    if (resendSecondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setResendSecondsLeft((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendSecondsLeft]);

  // Measure available width with ResizeObserver so the 794x1123 certificate scales smoothly below 820px without sideways scroll
  useEffect(() => {
    const wrapper = certContainerWrapperRef.current;
    if (!wrapper) return;

    const updateFromWidth = (width: number) => {
      if (width > 0) {
        const available =
          typeof window !== 'undefined' && window.innerWidth < 820
            ? Math.min(width, window.innerWidth - 32)
            : width;
        const nextScale =
          available >= 794 ? 1 : Math.max(0.25, (available - 2) / 794);
        setCertScale(nextScale);
      }
    };

    updateFromWidth(wrapper.getBoundingClientRect().width || wrapper.clientWidth);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width =
            entry.contentRect?.width ||
            wrapper.getBoundingClientRect().width ||
            wrapper.clientWidth;
          updateFromWidth(width);
        }
      });
      observer.observe(wrapper);
    }

    const handleWindowResize = () => {
      updateFromWidth(wrapper.getBoundingClientRect().width || wrapper.clientWidth);
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [verifiedData]);

  // Step 1: Check certificate status via GET /api/certificate-status?id=XXX
  const checkCertificateStatus = useCallback(async (rawId: string) => {
    const normalized = rawId.trim().toUpperCase();
    if (!normalized) return;

    setInputValue(normalized);
    setNotFoundId(null);
    setPageError(null);
    setOtpError(null);
    setOtpRequestId(null);
    setOtpDigits(['', '', '', '', '', '']);

    // Check 30-minute sessionStorage cache first
    const cached = getSessionCachedCertificate(normalized);
    if (cached && cached.status === 'valid') {
      setStatusSummary({
        certificateId: cached.certificateId,
        status: cached.status,
        fullName: cached.fullName,
        type: normalizeCertificateType(cached.type),
        course: cached.course,
        issueDate: cached.issueDate,
      });
      setVerifiedData(cached);
      return;
    }

    setVerifiedData(null);
    setStatusSummary(null);
    setLoaderMessage('Checking certificate…');

    try {
      const response = await fetch(
        `/api/certificate-status?id=${encodeURIComponent(normalized)}`,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
        }
      );

      let payload: Record<string, unknown> = {};
      try {
        payload = (await response.json()) as Record<string, unknown>;
      } catch {
        payload = {};
      }

      if (!response.ok) {
        const message =
          typeof payload.error === 'string' && payload.error
            ? payload.error
            : 'Could not verify the certificate at this moment. Please try again.';
        setPageError(message);
        return;
      }

      if (!payload.found) {
        setNotFoundId(normalized);
        return;
      }

      const status = payload.status === 'revoked' ? 'revoked' : 'valid';
      setStatusSummary({
        certificateId: normalized,
        status,
        fullName: String(payload.fullName ?? ''),
        type: normalizeCertificateType(payload.type),
        course: String(payload.course ?? ''),
        issueDate: String(payload.issueDate ?? ''),
      });
    } catch {
      setPageError(
        'Could not verify the certificate at this moment. Please try again.'
      );
    } finally {
      setLoaderMessage(null);
    }
  }, []);

  // Automatically check status when opening /verify/:certificateId
  useEffect(() => {
    const trimmedRouteId = (routeCertId ?? '').trim().toUpperCase();
    if (trimmedRouteId) {
      setInputValue(trimmedRouteId);
      if (lastLookedUpRef.current !== trimmedRouteId) {
        lastLookedUpRef.current = trimmedRouteId;
        checkCertificateStatus(trimmedRouteId);
      }
    } else {
      lastLookedUpRef.current = null;
    }
  }, [routeCertId, checkCertificateStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = inputValue.trim().toUpperCase();
    if (!normalized || Boolean(loaderMessage)) return;
    setInputValue(normalized);
    lastLookedUpRef.current = normalized;

    const currentParam = (routeCertId ?? '').trim().toUpperCase();
    if (currentParam !== normalized) {
      navigate(`/verify/${encodeURIComponent(normalized)}`);
    }
    checkCertificateStatus(normalized);
  };

  // Step 1 -> Step 2: Send OTP to email
  const sendOtpRequest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!statusSummary || statusSummary.status === 'revoked' || Boolean(loaderMessage)) {
      return;
    }

    const trimmedEmail = emailInput.trim().toLowerCase();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setOtpError('Please enter a valid email address.');
      return;
    }

    setOtpError(null);
    setLoaderMessage('Sending code…');

    try {
      const response = await fetch('/api/certificate-otp-send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          certificateId: statusSummary.certificateId,
          email: trimmedEmail,
        }),
      });

      let payload: Record<string, unknown> = {};
      try {
        payload = (await response.json()) as Record<string, unknown>;
      } catch {
        payload = {};
      }

      if (!response.ok || typeof payload.requestId !== 'string') {
        const message =
          typeof payload.error === 'string' && payload.error
            ? payload.error
            : 'Could not send the verification code right now. Please try again.';
        setOtpError(message);
        return;
      }

      setEmailInput(trimmedEmail);
      setOtpRequestId(payload.requestId);
      setOtpDigits(['', '', '', '', '', '']);
      setResendSecondsLeft(RESEND_COOLDOWN_SECONDS);

      // Focus the first digit box after render
      window.setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 60);
    } catch {
      setOtpError(
        'Could not send the verification code right now. Please try again.'
      );
    } finally {
      setLoaderMessage(null);
    }
  };

  // Step 2 -> Step 3: Verify 6-digit OTP
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpRequestId || Boolean(loaderMessage)) return;

    const code = otpDigits.join('');
    if (!/^\d{6}$/.test(code)) {
      setOtpError('Please enter all 6 digits of your verification code.');
      return;
    }

    setOtpError(null);
    setLoaderMessage('Verifying code…');

    try {
      const response = await fetch('/api/certificate-otp-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          requestId: otpRequestId,
          otp: code,
        }),
      });

      let payload: Record<string, unknown> = {};
      try {
        payload = (await response.json()) as Record<string, unknown>;
      } catch {
        payload = {};
      }

      if (!response.ok) {
        const message =
          typeof payload.error === 'string' && payload.error
            ? payload.error
            : 'Could not verify the code right now. Please try again.';
        setOtpError(message);
        return;
      }

      const certType = normalizeCertificateType(payload.type);
      const fullCertData: CertificateTemplateData = {
        certificateId: String(
          payload.certificateId ?? statusSummary?.certificateId ?? ''
        )
          .trim()
          .toUpperCase(),
        fullName: String(payload.fullName ?? ''),
        type: certType,
        course: String(payload.course ?? ''),
        durationMonths:
          certType === 'course_completion' ? 0 : Number(payload.durationMonths ?? 1),
        startDate: String(payload.startDate ?? ''),
        endDate: String(payload.endDate ?? ''),
        issueDate: String(payload.issueDate ?? ''),
        college: String(payload.college ?? ''),
        keyAreas: Array.isArray(payload.keyAreas)
          ? payload.keyAreas.map((item) => String(item)).slice(0, 12)
          : [],
        status: payload.status === 'revoked' ? 'revoked' : 'valid',
      };

      setSessionCachedCertificate(fullCertData);
      setVerifiedData(fullCertData);
      setOtpError(null);
    } catch {
      setOtpError('Could not verify the code right now. Please try again.');
    } finally {
      setLoaderMessage(null);
    }
  };

  const handleDigitChange = (index: number, rawValue: string) => {
    setOtpError(null);
    const digitsOnly = rawValue.replace(/\D/g, '');

    if (!digitsOnly) {
      setOtpDigits((prev) => {
        const next = [...prev];
        next[index] = '';
        return next;
      });
      return;
    }

    // If user pasted or auto-filled multiple digits (e.g. one-time-code autocomplete)
    if (digitsOnly.length > 1) {
      const chars = digitsOnly.slice(0, 6).split('');
      setOtpDigits((prev) => {
        const next = [...prev];
        for (let i = 0; i < 6; i += 1) {
          if (index + i < 6 && chars[i] !== undefined) {
            next[index + i] = chars[i];
          }
        }
        return next;
      });
      const focusIdx = Math.min(5, index + chars.length - 1);
      otpInputRefs.current[focusIdx]?.focus();
      return;
    }

    const singleDigit = digitsOnly.slice(-1);
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = singleDigit;
      return next;
    });

    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace') {
      if (otpDigits[index]) {
        setOtpDigits((prev) => {
          const next = [...prev];
          next[index] = '';
          return next;
        });
      } else if (index > 0) {
        otpInputRefs.current[index - 1]?.focus();
        setOtpDigits((prev) => {
          const next = [...prev];
          next[index - 1] = '';
          return next;
        });
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
      e.preventDefault();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
      e.preventDefault();
    }
  };

  const handleDigitPaste = (
    index: number,
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    setOtpError(null);
    const chars = pasted.split('');
    setOtpDigits((prev) => {
      const next = [...prev];
      if (index === 0 || chars.length === 6) {
        for (let i = 0; i < 6; i += 1) {
          next[i] = chars[i] ?? '';
        }
      } else {
        for (let i = 0; i < chars.length && index + i < 6; i += 1) {
          next[index + i] = chars[i];
        }
      }
      return next;
    });

    const targetFocus =
      index === 0 || chars.length === 6
        ? Math.min(5, chars.length - 1)
        : Math.min(5, index + chars.length - 1);
    otpInputRefs.current[targetFocus]?.focus();
  };

  const handleChangeEmail = () => {
    setOtpRequestId(null);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError(null);
    setResendSecondsLeft(0);
  };

  const handleDownloadPdf = async () => {
    if (!verifiedData || verifiedData.status === 'revoked' || isDownloadingPdf) {
      return;
    }
    const targetEl = pdfCaptureRef.current;
    if (!targetEl) {
      console.error('[VerifyCertificatePage] Certificate PDF capture element not ready.');
      setPageError('Could not create the PDF. Please try again.');
      return;
    }

    setIsDownloadingPdf(true);
    setPageError(null);
    try {
      await downloadCertificatePdf(targetEl, verifiedData.certificateId);
    } catch (err) {
      console.error('[VerifyCertificatePage] PDF download failed:', err);
      setPageError('Could not create the PDF. Please try again.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleCopyVerifyLink = async () => {
    if (!verifiedData) return;
    const url = `https://www.iamtechni.in/verify/${encodeURIComponent(
      verifiedData.certificateId
    )}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const isParamRoute = Boolean(routeCertId && routeCertId.trim());
  const verifyLinkUrl = verifiedData
    ? `https://www.iamtechni.in/verify/${encodeURIComponent(
        verifiedData.certificateId
      )}`
    : 'https://www.iamtechni.in/verify';
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    verifyLinkUrl
  )}`;

  const scaledWidth = Math.floor(794 * certScale);
  const scaledHeight = Math.ceil(1123 * certScale);

  return (
    <div
      className="w-full min-w-0 overflow-x-hidden bg-[#F4F7FC] min-h-[75vh] pb-16"
      style={{
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))',
        fontSize: 'clamp(14px, 0.95vw, 17px)',
      }}
    >
      <Helmet>
        <title>
          {formatSeoTitle(
            isParamRoute
              ? `Verify Certificate ${routeCertId?.trim().toUpperCase()} | IAMTECHNI`
              : 'Verify Internship & Training Certificate | IAMTECHNI'
          )}
        </title>
        <meta
          name="description"
          content={formatMetaDescription(
            'Enter the certificate number to check that an IAMTECHNI internship or training certificate is genuine. Verify official student and professional credentials online.'
          )}
        />
        {isParamRoute && <meta name="robots" content="noindex" />}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Manrope:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400&display=swap"
        />
      </Helmet>

      {/* Print-only stylesheet: prints ONLY the A4 portrait certificate full page with no site header/footer */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 0;
        }
        @media print {
          html, body {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          header, footer, nav, aside {
            display: none !important;
          }
          body * {
            visibility: hidden !important;
          }
          #iamtechni-printable-certificate,
          #iamtechni-printable-certificate * {
            visibility: visible !important;
          }
          #iamtechni-printable-certificate {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 794px !important;
            height: 1123px !important;
            transform: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            z-index: 999999 !important;
          }
        }
      `}</style>

      {/* Off-screen 1:1 unscaled render target (794 × 1123 px) for PDF export and Print */}
      {verifiedData && (
        <div
          id="iamtechni-printable-certificate"
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
            data={verifiedData}
          />
        </div>
      )}

      <Breadcrumbs
        items={[
          { label: 'Training & Courses', route: '/training' },
          { label: 'Verify Certificate' },
        ]}
        onNavigate={(route) => (onNavigate ? onNavigate(route) : navigate(route))}
      />

      {/* Hero / Search Header */}
      <section className="relative overflow-hidden border-b border-slate-200 py-8 sm:py-12 bg-gradient-to-b from-[#F0F5FF] via-[#F8FAFF] to-white">
        <div className="absolute top-0 right-1/4 w-[420px] h-[260px] bg-gradient-to-tr from-[#00B0F0]/15 via-[#1C35EA]/12 to-[#4D19EA]/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 min-h-[32px] px-3.5 py-1 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(28,53,234,0.08)] text-sm font-mono font-bold text-[#1C35EA]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>OFFICIAL CREDENTIAL VERIFICATION</span>
          </div>

          <AnimatedHeading
            as="h1"
            align="center"
            className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.015em] text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)]"
          >
            Verify Certificate
          </AnimatedHeading>

          <p
            className="text-slate-600 max-w-xl mx-auto leading-relaxed"
            style={{ fontSize: 'clamp(14px, 1vw, 17px)' }}
          >
            Enter the certificate number to check that an IAMTECHNI certificate is genuine.
          </p>

          {/* Search Form: stacked full width on mobile, side-by-side from 640px */}
          <form
            onSubmit={handleSearchSubmit}
            className="pt-2 max-w-xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <div className="relative flex-1 min-w-0">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                placeholder="e.g. IAMT-PRO-2026-CBVUZ"
                aria-label="Certificate number"
                className="w-full h-12 min-h-[48px] pl-11 pr-4 font-mono text-[16px] uppercase rounded-xl border border-slate-200 bg-[#F4F7FC] text-slate-900 placeholder:text-slate-400 placeholder:normal-case focus:bg-white focus:outline-hidden focus:border-[#1C35EA] focus:ring-4 focus:ring-[#1C35EA]/15 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={!inputValue.trim() || Boolean(loaderMessage)}
              className="w-full sm:w-auto h-12 min-h-[48px] px-7 rounded-xl text-white font-semibold text-[16px] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-4px_rgba(28,53,234,0.38)] active:scale-[0.98] inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
              style={{
                background:
                  'linear-gradient(135deg, #00B0F0 0%, #1C35EA 35%, #4D19EA 100%)',
              }}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>Verify</span>
            </button>
          </form>
        </div>
      </section>

      {/* Verification Results Section */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-6">
        {/* Not Found */}
        {notFoundId && !loaderMessage && (
          <div
            role="alert"
            className="bg-white rounded-2xl border border-amber-200 shadow-xs p-5 sm:p-6 flex items-start gap-3.5 text-slate-800"
          >
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 min-w-0">
              <p className="text-sm sm:text-base font-semibold text-slate-900">
                No certificate found with this number. Please check the number and try again.
              </p>
              <p className="text-sm text-slate-500 break-all">
                Searched for:{' '}
                <code className="font-mono font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded break-all">
                  {notFoundId}
                </code>
              </p>
            </div>
          </div>
        )}

        {/* Server / Network Error */}
        {pageError && !loaderMessage && (
          <div
            role="alert"
            className="bg-white rounded-2xl border border-rose-200 shadow-xs p-5 sm:p-6 flex items-start gap-3.5 text-rose-800"
          >
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1 min-w-0">
              <p className="text-sm sm:text-base font-semibold text-rose-900">
                {pageError}
              </p>
            </div>
          </div>
        )}

        {/* Revoked Certificate: Red badge + Name & Course. No OTP, no certificate. */}
        {statusSummary && statusSummary.status === 'revoked' && !loaderMessage && (
          <div className="space-y-5">
            <div
              role="status"
              className="rounded-2xl bg-rose-50 border border-rose-200 p-4 sm:p-5 flex items-center gap-3 text-rose-800 shadow-2xs"
            >
              <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
              <span className="text-sm sm:text-base font-bold">
                ✕ This certificate has been revoked and is no longer valid.
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="h-1.5 w-full bg-rose-600" />
              <div className="p-4 sm:p-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
                  <div className="bg-[#F8FAFF] rounded-xl p-3.5 border border-slate-200/80 min-w-0">
                    <dt className="text-sm font-semibold text-slate-500">Name</dt>
                    <dd className="text-slate-900 font-bold mt-1 break-words">
                      {statusSummary.fullName}
                    </dd>
                  </div>
                  <div className="bg-[#F8FAFF] rounded-xl p-3.5 border border-slate-200/80 min-w-0">
                    <dt className="text-sm font-semibold text-slate-500">Course</dt>
                    <dd className="text-slate-900 font-semibold mt-1 break-words">
                      {statusSummary.course}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {/* Valid Certificate — Step 1 & Step 2 (Before OTP is verified) */}
        {statusSummary &&
          statusSummary.status === 'valid' &&
          !verifiedData &&
          !loaderMessage && (
            <div className="space-y-6">
              {/* Green Genuine Badge */}
              <div
                role="status"
                className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 sm:p-5 flex items-center gap-3 text-emerald-900 shadow-2xs"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <span className="text-sm sm:text-base font-bold">
                  ✓ Genuine certificate issued by IAMTECHNI
                </span>
              </div>

              {/* Small Summary Card: Name, Program, Course */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div
                  className="h-1.5 w-full"
                  style={{
                    background:
                      'linear-gradient(90deg, #00B0F0 0%, #1C35EA 50%, #4D19EA 100%)',
                  }}
                />
                <div className="p-4 sm:p-6">
                  <dl
                    className={`grid grid-cols-1 gap-3.5 ${
                      statusSummary.type === 'course_completion'
                        ? 'sm:grid-cols-2 lg:grid-cols-4'
                        : 'sm:grid-cols-3'
                    }`}
                    style={{ fontSize: 'clamp(14px, 0.95vw, 16px)' }}
                  >
                    <div className="bg-[#F8FAFF] rounded-xl p-3.5 border border-slate-200/80 min-w-0">
                      <dt className="text-sm font-semibold text-slate-500">Name</dt>
                      <dd className="text-slate-900 font-bold mt-1 break-words">
                        {statusSummary.fullName}
                      </dd>
                    </div>

                    <div className="bg-[#F8FAFF] rounded-xl p-3.5 border border-slate-200/80 min-w-0">
                      <dt className="text-sm font-semibold text-slate-500">Program</dt>
                      <dd className="text-slate-900 font-semibold mt-1 break-words">
                        {statusSummary.type === 'course_completion'
                          ? 'Course Completion'
                          : statusSummary.type === 'student'
                            ? 'Student Internship'
                            : 'Professional Internship'}
                      </dd>
                    </div>

                    <div className="bg-[#F8FAFF] rounded-xl p-3.5 border border-slate-200/80 min-w-0">
                      <dt className="text-sm font-semibold text-slate-500">Course</dt>
                      <dd className="text-slate-900 font-semibold mt-1 break-words">
                        {statusSummary.course}
                      </dd>
                    </div>

                    {statusSummary.type === 'course_completion' && (
                      <div className="bg-[#F8FAFF] rounded-xl p-3.5 border border-slate-200/80 min-w-0">
                        <dt className="text-sm font-semibold text-slate-500">Issue date</dt>
                        <dd className="text-slate-900 font-semibold mt-1 break-words">
                          {formatCertificateDate(statusSummary.issueDate ?? '')}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {/* Email OTP Box (Step 1: Email input, Step 2: 6-digit OTP input) */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 max-w-xl mx-auto space-y-5">
                {!otpRequestId ? (
                  /* STEP 1: Enter email and click "Send OTP" */
                  <form onSubmit={sendOtpRequest} className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] border border-[#DBEAFE] text-[#1C35EA] flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <h2
                          data-no-scroll-zoom
                          className="!font-['Outfit','Space_Grotesk',sans-serif] text-lg sm:text-xl font-bold text-[#14205A]"
                        >
                          Verify Your Email
                        </h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          To view the full certificate and download it, verify your email.
                        </p>
                      </div>
                    </div>

                    {otpError && (
                      <div
                        role="alert"
                        className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5"
                      >
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{otpError}</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        value={emailInput}
                        onChange={(e) => {
                          setEmailInput(e.target.value);
                          setOtpError(null);
                        }}
                        placeholder="you@example.com"
                        aria-label="Email address"
                        className="flex-1 min-w-0 h-12 min-h-[48px] px-4 text-[16px] rounded-xl border border-slate-200 bg-[#F4F7FC] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#1C35EA] focus:ring-4 focus:ring-[#1C35EA]/15 transition-all"
                      />

                      <button
                        type="submit"
                        disabled={!emailInput.trim() || Boolean(loaderMessage)}
                        className="w-full sm:w-auto h-12 min-h-[48px] px-6 rounded-xl text-white font-semibold text-[16px] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-4px_rgba(28,53,234,0.38)] active:scale-[0.98] inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                        style={{
                          background:
                            'linear-gradient(135deg, #00B0F0 0%, #1C35EA 35%, #4D19EA 100%)',
                        }}
                      >
                        <Mail className="w-4 h-4 shrink-0" />
                        <span>Send OTP</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* STEP 2: Enter 6-digit OTP code */
                  <form onSubmit={handleVerifyOtpSubmit} className="space-y-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] border border-[#DBEAFE] text-[#1C35EA] flex items-center justify-center shrink-0">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <h2
                          data-no-scroll-zoom
                          className="!font-['Outfit','Space_Grotesk',sans-serif] text-lg sm:text-xl font-bold text-[#14205A]"
                        >
                          Enter Verification Code
                        </h2>
                        <p className="text-sm text-slate-600 leading-relaxed break-words">
                          We&apos;ve sent a 6-digit code to{' '}
                          <span className="font-semibold text-[#14205A]">
                            {emailInput}
                          </span>
                        </p>
                      </div>
                    </div>

                    {otpError && (
                      <div
                        role="alert"
                        className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5"
                      >
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{otpError}</span>
                      </div>
                    )}

                    {/* Six separate digit boxes */}
                    <div
                      role="group"
                      aria-label="6-digit verification code"
                      className="grid grid-cols-6 gap-1.5 sm:gap-2.5 max-w-[340px] mx-auto"
                    >
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            otpInputRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          autoComplete={index === 0 ? 'one-time-code' : 'off'}
                          maxLength={index === 0 ? 6 : 1}
                          value={digit}
                          onChange={(e) => handleDigitChange(index, e.target.value)}
                          onKeyDown={(e) => handleDigitKeyDown(index, e)}
                          onPaste={(e) => handleDigitPaste(index, e)}
                          aria-label={`Digit ${index + 1}`}
                          className="w-full h-12 min-h-[48px] text-center font-mono text-[18px] sm:text-xl font-bold rounded-xl border border-slate-300 bg-[#F4F7FC] text-[#14205A] focus:bg-white focus:outline-hidden focus:border-[#1C35EA] focus:ring-4 focus:ring-[#1C35EA]/15 transition-all"
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={
                        otpDigits.join('').length !== 6 || Boolean(loaderMessage)
                      }
                      className="w-full h-12 min-h-[48px] px-6 rounded-xl text-white font-semibold text-[16px] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-4px_rgba(28,53,234,0.38)] active:scale-[0.98] inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background:
                          'linear-gradient(135deg, #00B0F0 0%, #1C35EA 35%, #4D19EA 100%)',
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Verify</span>
                    </button>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-sm">
                      <button
                        type="button"
                        disabled={resendSecondsLeft > 0 || Boolean(loaderMessage)}
                        onClick={() => sendOtpRequest()}
                        className="min-h-[44px] px-2 font-semibold text-[#1C35EA] hover:underline inline-flex items-center gap-1.5 cursor-pointer disabled:text-slate-400 disabled:no-underline disabled:cursor-not-allowed"
                      >
                        <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {resendSecondsLeft > 0
                            ? `Resend code (${resendSecondsLeft}s)`
                            : 'Resend code'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleChangeEmail}
                        className="min-h-[44px] px-2 font-semibold text-slate-600 hover:text-[#1C35EA] hover:underline cursor-pointer"
                      >
                        Change email
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

        {/* Step 3: Full Certificate View (after OTP verification or 30-min sessionStorage cache) */}
        {verifiedData && !loaderMessage && (
          <div className="space-y-6">
            {/* Status Badge */}
            {verifiedData.status === 'revoked' ? (
              <div
                role="status"
                className="rounded-2xl bg-rose-50 border border-rose-200 p-4 sm:p-5 flex items-center gap-3 text-rose-800 shadow-2xs"
              >
                <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                <span className="text-sm sm:text-base font-bold">
                  ✕ This certificate has been revoked and is no longer valid.
                </span>
              </div>
            ) : (
              <div
                role="status"
                className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 sm:p-5 flex items-center gap-3 text-emerald-900 shadow-2xs"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <span className="text-sm sm:text-base font-bold">
                  ✓ Genuine certificate issued by IAMTECHNI
                </span>
              </div>
            )}

            {/* Details Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div
                className="h-1.5 w-full"
                style={{
                  background:
                    verifiedData.status === 'revoked'
                      ? '#DC2626'
                      : 'linear-gradient(90deg, #00B0F0 0%, #1C35EA 50%, #4D19EA 100%)',
                }}
              />
              <div className="p-4 sm:p-7 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="min-w-0">
                    <div className="text-sm font-mono uppercase tracking-wider font-bold text-[#1C35EA]">
                      Credential Summary
                    </div>
                    <h2
                      data-no-scroll-zoom
                      className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-2xl font-bold text-[#14205A] mt-0.5 break-words"
                    >
                      {verifiedData.fullName}
                    </h2>
                  </div>

                  <div className="max-w-full overflow-x-auto font-mono text-sm font-bold px-3 py-1.5 rounded-xl bg-[#F4F7FC] border border-slate-200 text-[#14205A] break-all">
                    {verifiedData.certificateId}
                  </div>
                </div>

                {/* 3 columns on desktop, 2 on tablet, 1 on phones */}
                <dl
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4"
                  style={{ fontSize: 'clamp(14px, 0.95vw, 16px)' }}
                >
                  <div className="bg-[#F8FAFF] rounded-xl p-3.5 border border-slate-200/80 min-w-0">
                    <dt className="text-sm font-semibold text-slate-500">Name</dt>
                    <dd className="text-slate-900 font-bold mt-1 break-words">
                      {verifiedData.fullName}
                    </dd>
                  </div>

                  <div className="bg-[#F8FAFF] rounded-xl p-3.5 border border-slate-200/80 min-w-0">
                    <dt className="text-sm font-semibold text-slate-500">Program</dt>
                    <dd className="text-slate-900 font-semibold mt-1 break-words">
                      {verifiedData.type === 'course_completion'
                        ? 'Course Completion'
                        : verifiedData.type === 'student'
                          ? 'Student Internship'
                          : 'Professional Internship'}
                    </dd>
                  </div>

                  <div className="bg-[#F8FAFF] rounded-xl p-3.5 border border-slate-200/80 min-w-0">
                    <dt className="text-sm font-semibold text-slate-500">Course</dt>
                    <dd className="text-slate-900 font-semibold mt-1 break-words">
                      {verifiedData.course}
                    </dd>
                  </div>

                  {verifiedData.type !== 'course_completion' && (
                    <>
                      <div className="bg-[#F8FAFF] rounded-xl p-3.5 border border-slate-200/80 min-w-0">
                        <dt className="text-sm font-semibold text-slate-500">Duration</dt>
                        <dd className="text-slate-900 font-semibold mt-1">
                          {formatDurationLabel(verifiedData.durationMonths ?? 1)}
                        </dd>
                      </div>

                      <div className="bg-[#F8FAFF] rounded-xl p-3.5 border border-slate-200/80 min-w-0">
                        <dt className="text-sm font-semibold text-slate-500">
                          Internship period
                        </dt>
                        <dd className="text-slate-900 font-semibold mt-1">
                          {formatCertificateDate(verifiedData.startDate ?? '')} –{' '}
                          {formatCertificateDate(verifiedData.endDate ?? '')}
                        </dd>
                      </div>
                    </>
                  )}

                  <div className="bg-[#F8FAFF] rounded-xl p-3.5 border border-slate-200/80 min-w-0">
                    <dt className="text-sm font-semibold text-slate-500">Issue date</dt>
                    <dd className="text-slate-900 font-semibold mt-1">
                      {formatCertificateDate(verifiedData.issueDate)}
                    </dd>
                  </div>

                  <div className="bg-[#F8FAFF] rounded-xl p-3.5 border border-slate-200/80 sm:col-span-2 lg:col-span-3 min-w-0 overflow-x-auto">
                    <dt className="text-sm font-semibold text-slate-500">
                      Certificate number
                    </dt>
                    <dd className="font-mono text-slate-900 font-bold mt-1 break-all">
                      {verifiedData.certificateId}
                    </dd>
                  </div>
                </dl>

                {/* Action Buttons: stacked full-width on narrow phones, 2-col on wider phones, flex-wrap row on sm+ */}
                <div className="pt-2 grid grid-cols-1 min-[420px]:grid-cols-2 sm:flex sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
                  {verifiedData.status !== 'revoked' && (
                    <button
                      type="button"
                      disabled={isDownloadingPdf}
                      onClick={handleDownloadPdf}
                      className="min-h-[44px] px-4 sm:px-5 py-2.5 rounded-xl text-white font-semibold text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-center"
                      style={{
                        background:
                          'linear-gradient(135deg, #00B0F0 0%, #1C35EA 35%, #4D19EA 100%)',
                      }}
                    >
                      {isDownloadingPdf ? (
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
                  )}

                  <button
                    type="button"
                    onClick={handleCopyVerifyLink}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-[#EEF4FF] text-[#1C35EA] font-semibold text-sm transition-colors inline-flex items-center justify-center gap-2 cursor-pointer text-center"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-emerald-700">Link copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 shrink-0" />
                        <span>Copy link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={linkedInShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-[#EEF4FF] text-[#1C35EA] font-semibold text-sm transition-colors inline-flex items-center justify-center gap-2 text-center"
                  >
                    <Share2 className="w-4 h-4 shrink-0" />
                    <span>Share on LinkedIn</span>
                  </a>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-[#EEF4FF] text-slate-700 hover:text-[#1C35EA] font-semibold text-sm transition-colors inline-flex items-center justify-center gap-2 cursor-pointer text-center"
                  >
                    <Printer className="w-4 h-4 shrink-0" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Full Certificate Display: 16px side padding on phones, max 794px on desktop/TVs */}
            <div className="sm:bg-white sm:rounded-2xl sm:border sm:border-slate-200 sm:shadow-xs p-0 sm:p-6 flex flex-col items-center w-full min-w-0">
              <div
                ref={certContainerWrapperRef}
                className="w-full max-w-[794px] mx-auto flex justify-center overflow-hidden"
              >
                <div
                  style={{
                    width: `${scaledWidth}px`,
                    height: `${scaledHeight}px`,
                    position: 'relative',
                  }}
                  className="shadow-xl border border-slate-200/80 bg-white shrink-0 box-border overflow-hidden"
                >
                  <div
                    style={{
                      width: '794px',
                      height: '1123px',
                      transform: `scale(${certScale})`,
                      transformOrigin: 'top left',
                    }}
                  >
                    <CertificateTemplate data={verifiedData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <FullScreenLoader
        isOpen={Boolean(loaderMessage)}
        message={loaderMessage ?? 'Checking certificate…'}
      />
    </div>
  );
};

export default VerifyCertificatePage;
