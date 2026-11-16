import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import {
  AlertCircle,
  Award,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Loader2,
  Printer,
  Search,
  Share2,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { downloadCertificatePdf } from '../lib/certificatePdf';
import {
  CertificateTemplate,
  formatCertificateDate,
  type CertificateTemplateData,
} from '../components/certificate/CertificateTemplate';
import { FullScreenLoader } from '../components/common/FullScreenLoader';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { AnimatedHeading } from '../components/common/AnimatedHeading';
import { PageRoute } from '../types';

export interface VerifyCertificatePageProps {
  onNavigate?: (route: PageRoute) => void;
}

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function extractFirebaseErrorCode(err: unknown): string {
  const code = (err as { code?: string })?.code;
  if (code) return code;
  const msg = (err as { message?: string })?.message;
  return msg || 'unknown-error';
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
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifiedData, setVerifiedData] = useState<CertificateTemplateData | null>(
    null
  );
  const [notFoundId, setNotFoundId] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const certContainerWrapperRef = useRef<HTMLDivElement | null>(null);
  const pdfCaptureRef = useRef<HTMLDivElement | null>(null);
  const [certScale, setCertScale] = useState<number>(1);
  const lastLookedUpRef = useRef<string | null>(null);

  // Compute responsive scale for the 794x1123 certificate so it is full size on desktop and scaled down on mobile, never cut off
  useEffect(() => {
    const updateScale = () => {
      const wrapper = certContainerWrapperRef.current;
      if (!wrapper) return;
      const availableWidth = wrapper.clientWidth;
      if (availableWidth > 0) {
        const nextScale = Math.min(1, availableWidth / 794);
        setCertScale(nextScale);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [verifiedData]);

  const performVerification = useCallback(async (rawId: string) => {
    const normalized = rawId.trim().toUpperCase();
    if (!normalized) return;

    setInputValue(normalized);
    setIsVerifying(true);
    setNotFoundId(null);
    setErrorCode(null);

    try {
      const lookupTask = async () => {
        if (!isFirebaseConfigured || !db) {
          throw new Error('Firebase is not configured.');
        }
        return getDoc(doc(db, 'certificates', normalized));
      };

      const [snapResult] = await Promise.allSettled([
        lookupTask(),
        wait(600),
      ]);

      if (snapResult.status === 'rejected') {
        throw snapResult.reason;
      }

      const docSnap = snapResult.value;
      if (!docSnap.exists()) {
        setVerifiedData(null);
        setNotFoundId(normalized);
        return;
      }

      const d = docSnap.data() as Record<string, unknown>;
      const certData: CertificateTemplateData = {
        certificateId: String(d.certificateId ?? docSnap.id).trim().toUpperCase(),
        fullName: String(d.fullName ?? ''),
        type: d.type === 'professional' ? 'professional' : 'student',
        course: String(d.course ?? ''),
        durationMonths: Number(d.durationMonths ?? 1),
        startDate: String(d.startDate ?? ''),
        endDate: String(d.endDate ?? ''),
        issueDate: String(d.issueDate ?? ''),
        college: String(d.college ?? ''),
        keyAreas: Array.isArray(d.keyAreas)
          ? d.keyAreas.map((item) => String(item)).slice(0, 6)
          : [],
        status: d.status === 'revoked' ? 'revoked' : 'valid',
      };

      setVerifiedData(certData);
      setNotFoundId(null);
    } catch (err) {
      setVerifiedData(null);
      setNotFoundId(null);
      setErrorCode(extractFirebaseErrorCode(err));
    } finally {
      setIsVerifying(false);
    }
  }, []);

  // Automatically verify when opening /verify/:certificateId
  useEffect(() => {
    const trimmedRouteId = (routeCertId ?? '').trim().toUpperCase();
    if (trimmedRouteId) {
      setInputValue(trimmedRouteId);
      if (lastLookedUpRef.current !== trimmedRouteId) {
        lastLookedUpRef.current = trimmedRouteId;
        performVerification(trimmedRouteId);
      }
    } else {
      lastLookedUpRef.current = null;
    }
  }, [routeCertId, performVerification]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = inputValue.trim().toUpperCase();
    if (!normalized || isVerifying) return;
    setInputValue(normalized);
    lastLookedUpRef.current = normalized;

    const currentParam = (routeCertId ?? '').trim().toUpperCase();
    if (currentParam !== normalized) {
      navigate(`/verify/${encodeURIComponent(normalized)}`);
    }
    performVerification(normalized);
  };

  const handleDownloadPdf = async () => {
    if (!verifiedData || verifiedData.status === 'revoked' || isDownloadingPdf) {
      return;
    }
    const targetEl = pdfCaptureRef.current;
    if (!targetEl) return;

    setIsDownloadingPdf(true);
    setErrorCode(null);
    try {
      await downloadCertificatePdf(targetEl, verifiedData.certificateId);
    } catch (err) {
      setErrorCode(extractFirebaseErrorCode(err));
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

  return (
    <div className="w-full min-w-0 bg-[#F4F7FC] min-h-[75vh] pb-16">
      <Helmet>
        <title>
          {isParamRoute
            ? `Verify Certificate ${routeCertId?.trim().toUpperCase()} | IAMTECHNI`
            : 'Verify Certificate | IAMTECHNI'}
        </title>
        <meta
          name="description"
          content="Enter the certificate number to check that an IAMTECHNI internship certificate is genuine."
        />
        {isParamRoute && <meta name="robots" content="noindex" />}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Manrope:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400&display=swap"
        />
      </Helmet>

      {/* Print-only stylesheet so window.print() prints the certificate cleanly */}
      <style>{`
        @media print {
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
          }
        }
      `}</style>

      {/* Off-screen 1:1 unscaled render target for PDF export and Print */}
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

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 min-h-[32px] px-3.5 py-1 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(28,53,234,0.08)] text-xs font-mono font-bold text-[#1C35EA]">
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

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Enter the certificate number to check that an IAMTECHNI certificate is genuine.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleFormSubmit}
            className="pt-2 max-w-xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <div className="relative flex-1">
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
                className="w-full h-12 min-h-[48px] pl-11 pr-4 font-mono text-sm sm:text-base uppercase rounded-xl border border-slate-200 bg-[#F4F7FC] text-slate-900 placeholder:text-slate-400 placeholder:normal-case focus:bg-white focus:outline-hidden focus:border-[#1C35EA] focus:ring-4 focus:ring-[#1C35EA]/15 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={!inputValue.trim() || isVerifying}
              className="h-12 min-h-[48px] px-7 rounded-xl text-white font-semibold text-sm sm:text-base shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-4px_rgba(28,53,234,0.38)] active:scale-[0.98] inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
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
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-6">
        {/* c) Not Found */}
        {notFoundId && !isVerifying && (
          <div
            role="alert"
            className="bg-white rounded-2xl border border-amber-200 shadow-xs p-5 sm:p-6 flex items-start gap-3.5 text-slate-800"
          >
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm sm:text-base font-semibold text-slate-900">
                No certificate found with this number. Please check the number and try again.
              </p>
              <p className="text-xs sm:text-sm text-slate-500">
                Searched for:{' '}
                <code className="font-mono font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                  {notFoundId}
                </code>
              </p>
            </div>
          </div>
        )}

        {/* d) Error */}
        {errorCode && !isVerifying && (
          <div
            role="alert"
            className="bg-white rounded-2xl border border-rose-200 shadow-xs p-5 sm:p-6 flex items-start gap-3.5 text-rose-800"
          >
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm sm:text-base font-semibold text-rose-900">
                Could not verify the certificate at this moment. Please try again.
              </p>
              <p className="text-xs text-rose-700">
                Error code:{' '}
                <code className="font-mono bg-rose-100 px-1.5 py-0.5 rounded">
                  {errorCode}
                </code>
              </p>
            </div>
          </div>
        )}

        {/* a) & b) Found Certificate */}
        {verifiedData && !isVerifying && (
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
                  ✓ Verified – This certificate is genuine and was issued by IAMTECHNI.
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
              <div className="p-5 sm:p-7 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider font-bold text-[#1C35EA]">
                      Credential Summary
                    </div>
                    <h2
                      data-no-scroll-zoom
                      className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-2xl font-bold text-[#14205A] mt-0.5"
                    >
                      {verifiedData.fullName}
                    </h2>
                  </div>

                  <div className="font-mono text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl bg-[#F4F7FC] border border-slate-200 text-[#14205A]">
                    {verifiedData.certificateId}
                  </div>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="bg-[#F8FAFF] rounded-xl p-3.5 border border-slate-200/80">
                    <dt className="text-xs font-semibold text-slate-500">Name</dt>
                    <dd className="text-slate-900 font-bold mt-1">
                      {verifiedData.fullName}
                    </dd>
                  </div>

                  <div className="bg-[#F8FAFF] rounded-xl p-3.5 border border-slate-200/80">
                    <dt className="text-xs font-semibold text-slate-500">Program</dt>
                    <dd className="text-slate-900 font-semibold mt-1">
                      {verifiedData.type === 'student'
                        ? 'Student Internship'
                        : 'Professional Internship'}
                    </dd>
                  </div>

                  <div className="bg-[#F8FAFF] rounded-xl p-3.5 border border-slate-200/80">
                    <dt className="text-xs font-semibold text-slate-500">Course</dt>
                    <dd className="text-slate-900 font-semibold mt-1">
                      {verifiedData.course}
                    </dd>
                  </div>

                  <div className="bg-[#F8FAFF] rounded-xl p-3.5 border border-slate-200/80">
                    <dt className="text-xs font-semibold text-slate-500">Duration</dt>
                    <dd className="text-slate-900 font-semibold mt-1">
                      {formatDurationLabel(verifiedData.durationMonths)}
                    </dd>
                  </div>

                  <div className="bg-[#F8FAFF] rounded-xl p-3.5 border border-slate-200/80">
                    <dt className="text-xs font-semibold text-slate-500">
                      Internship period
                    </dt>
                    <dd className="text-slate-900 font-semibold mt-1">
                      {formatCertificateDate(verifiedData.startDate)} –{' '}
                      {formatCertificateDate(verifiedData.endDate)}
                    </dd>
                  </div>

                  <div className="bg-[#F8FAFF] rounded-xl p-3.5 border border-slate-200/80">
                    <dt className="text-xs font-semibold text-slate-500">Issue date</dt>
                    <dd className="text-slate-900 font-semibold mt-1">
                      {formatCertificateDate(verifiedData.issueDate)}
                    </dd>
                  </div>

                  <div className="bg-[#F8FAFF] rounded-xl p-3.5 border border-slate-200/80 sm:col-span-2 lg:col-span-3">
                    <dt className="text-xs font-semibold text-slate-500">
                      Certificate number
                    </dt>
                    <dd className="font-mono text-slate-900 font-bold mt-1 break-all">
                      {verifiedData.certificateId}
                    </dd>
                  </div>
                </dl>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {verifiedData.status !== 'revoked' && (
                    <button
                      type="button"
                      disabled={isDownloadingPdf}
                      onClick={handleDownloadPdf}
                      className="min-h-[44px] px-5 py-2.5 rounded-xl text-white font-semibold text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
                    className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-[#EEF4FF] text-[#1C35EA] font-semibold text-sm transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
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
                    className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-[#EEF4FF] text-[#1C35EA] font-semibold text-sm transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4 shrink-0" />
                    <span>Share on LinkedIn</span>
                  </a>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-[#EEF4FF] text-slate-700 hover:text-[#1C35EA] font-semibold text-sm transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4 shrink-0" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Full Certificate Display (Full size on desktop, scaled to fit screen width on mobile, never cut off) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3 sm:p-6 flex flex-col items-center">
              <div
                ref={certContainerWrapperRef}
                className="w-full flex justify-center overflow-hidden"
              >
                <div
                  style={{
                    width: `${Math.round(794 * certScale)}px`,
                    height: `${Math.round(1123 * certScale)}px`,
                    position: 'relative',
                  }}
                  className="shadow-xl border border-slate-200/80"
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
        isOpen={isVerifying}
        message="Verifying certificate…"
      />
    </div>
  );
};

export default VerifyCertificatePage;
