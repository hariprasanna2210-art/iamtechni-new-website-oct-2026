import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  SIGNATURE_URL,
  getCertificateSkillConfig,
} from '../../data/certificateSkills';

export const COURSE_COMPLETION_SEAL_URL =
  '/assets/aistudio/WhatsApp_Image_2026-11-20_at_3.58.19_PM_495875eb.jpeg';

export type CertificateType = 'student' | 'professional' | 'course_completion';
export type CertificateLogoOption = 'none' | 'aws' | 'custom';

export interface CertificateTemplateData {
  certificateId: string;
  fullName: string;
  type: CertificateType;
  course: string;
  durationMonths?: number;
  startDate?: string;
  endDate?: string;
  issueDate: string;
  college?: string;
  keyAreas?: string[];
  logo?: CertificateLogoOption;
  customLogoUrl?: string;
  sealUrl?: string;
  status?: 'valid' | 'revoked';
}

export interface CertificateTemplateProps {
  data: CertificateTemplateData;
  containerRef?: React.Ref<HTMLDivElement>;
}

const MONTHS_SHORT = [
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

export function formatCertificateDate(dateStr: string): string {
  if (!dateStr) return '—';
  const trimmed = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [y, m, d] = trimmed.split('-').map(Number);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return `${d} ${MONTHS_SHORT[m - 1]} ${y}`;
    }
  }
  return trimmed;
}

const BRAND_GRADIENT_HORIZONTAL =
  'linear-gradient(90deg, #00B0F0 0%, #1C35EA 50%, #4D19EA 100%)';
const BRAND_GRADIENT_VERTICAL =
  'linear-gradient(180deg, #00B0F0 0%, #1C35EA 50%, #4D19EA 100%)';
const BRAND_GRADIENT_DIAGONAL =
  'linear-gradient(135deg, #00B0F0 0%, #1C35EA 50%, #4D19EA 100%)';

const FONT_SERIF = "'DM Serif Display', Georgia, 'Times New Roman', serif";
const FONT_SANS = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_DISPLAY =
  "'Outfit', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const RECIPIENT_NAME_MAX_WIDTH = 640;
const RECIPIENT_NAME_MAX_FONT_SIZE = 52;
const RECIPIENT_NAME_MIN_FONT_SIZE = 28;

export const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  data,
  containerRef,
}) => {
  const [signatureLoadFailed, setSignatureLoadFailed] = React.useState(false);
  const [sealLoadFailed, setSealLoadFailed] = React.useState(false);
  const recipientNameRef = React.useRef<HTMLDivElement | null>(null);
  const [nameFontSize, setNameFontSize] = React.useState<number>(
    RECIPIENT_NAME_MAX_FONT_SIZE
  );
  const isStudent = data.type === 'student';
  const isCourseCompletion = data.type === 'course_completion';
  const showAwsLogo = isCourseCompletion && data.logo === 'aws';
  const customLogoSrc = (data.customLogoUrl ?? '').trim();
  const showCustomLogo =
    isCourseCompletion && data.logo === 'custom' && customLogoSrc.length > 0;
  const showAnyCourseLogo = showAwsLogo || showCustomLogo;
  const resolvedSealUrl =
    data.sealUrl === undefined ? COURSE_COMPLETION_SEAL_URL : data.sealUrl.trim();
  const showCourseSeal =
    isCourseCompletion && resolvedSealUrl.length > 0 && !sealLoadFailed;

  React.useEffect(() => {
    setSealLoadFailed(false);
  }, [resolvedSealUrl]);

  const displayName = data.fullName.trim() || 'Applicant Full Name';

  const adjustRecipientNameSize = React.useCallback(() => {
    const el = recipientNameRef.current;
    if (!el) return;

    const prevFontSize = el.style.fontSize;
    let nextSize = RECIPIENT_NAME_MAX_FONT_SIZE;
    el.style.fontSize = `${nextSize}px`;

    while (
      nextSize > RECIPIENT_NAME_MIN_FONT_SIZE &&
      el.scrollWidth > RECIPIENT_NAME_MAX_WIDTH
    ) {
      nextSize -= 1;
      el.style.fontSize = `${nextSize}px`;
    }

    el.style.fontSize = prevFontSize;
    setNameFontSize((current) => (current === nextSize ? current : nextSize));
  }, []);

  React.useLayoutEffect(() => {
    let active = true;
    adjustRecipientNameSize();

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (active) {
          adjustRecipientNameSize();
        }
      });
    }

    return () => {
      active = false;
    };
  }, [displayName, adjustRecipientNameSize]);
  const displayCourse = data.course.trim() || 'Course Name';
  const displayCollege = (data.college ?? '').trim() || 'College / University';
  const durationNum =
    typeof data.durationMonths === 'number' &&
    Number.isFinite(data.durationMonths) &&
    data.durationMonths > 0
      ? data.durationMonths
      : 1;
  const formattedStart = formatCertificateDate(data.startDate ?? '');
  const formattedEnd = formatCertificateDate(data.endDate ?? '');
  const formattedIssue = formatCertificateDate(data.issueDate);
  const displayCertId =
    data.certificateId.trim() ||
    (isCourseCompletion
      ? 'IAMT-CRS-2026-XXXXX'
      : isStudent
        ? 'IAMT-STU-2026-XXXXX'
        : 'IAMT-PRO-2026-XXXXX');
  const verifyUrl = `https://www.iamtechni.in/verify/${encodeURIComponent(
    displayCertId
  )}`;

  const visibleSkills = (data.keyAreas ?? []).slice(0, 12);
  const showKeyAreasBlock = !isCourseCompletion || visibleSkills.length > 0;
  const isTwoRowSkills = visibleSkills.length > 6;
  const skillRows: string[][] = isTwoRowSkills
    ? [
        visibleSkills.slice(0, Math.ceil(visibleSkills.length / 2)),
        visibleSkills.slice(Math.ceil(visibleSkills.length / 2)),
      ]
    : [visibleSkills];

  const isRevoked = data.status === 'revoked';

  return (
    <div
      ref={containerRef}
      style={{
        width: '794px',
        height: '1123px',
        minWidth: '794px',
        minHeight: '1123px',
        maxWidth: '794px',
        maxHeight: '1123px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        color: '#14205A',
        fontFamily: FONT_SANS,
        boxSizing: 'border-box',
        userSelect: 'none',
        WebkitFontSmoothing: 'antialiased',
      }}
    >

      {/* Top ~78% light tint #F5F9FF (876px of 1123px is 78.0%) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '876px',
          backgroundColor: '#F5F9FF',
          zIndex: 1,
        }}
      />

      {/* Two soft gradient circles in the top-right corner (12% and 18% opacity) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-110px',
          right: '-110px',
          width: '340px',
          height: '340px',
          borderRadius: '9999px',
          background: BRAND_GRADIENT_DIAGONAL,
          opacity: 0.12,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-45px',
          right: '-45px',
          width: '210px',
          height: '210px',
          borderRadius: '9999px',
          background: BRAND_GRADIENT_DIAGONAL,
          opacity: 0.18,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Vertical gradient band 22px wide on the left edge */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '22px',
          background: BRAND_GRADIENT_VERTICAL,
          zIndex: 5,
        }}
      />

      {/* Gradient bar 8px tall along the top */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '8px',
          background: BRAND_GRADIENT_HORIZONTAL,
          zIndex: 6,
        }}
      />

      {/* Gradient strip 18px tall at the bottom */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '18px',
          background: BRAND_GRADIENT_HORIZONTAL,
          zIndex: 6,
        }}
      />

      {/* Main Upper Content Area (top 876px, right of 22px left band) */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '22px',
          right: 0,
          height: '868px',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isTwoRowSkills
            ? showCourseSeal
              ? '24px 48px 18px 48px'
              : '34px 48px 22px 48px'
            : showCourseSeal
              ? '42px 56px 26px 56px'
              : '54px 56px 30px 56px',
          boxSizing: 'border-box',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Grouped Main Content Stack: Title/Subtitle, Recipient/Paragraph, Key Areas */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            flex: 1,
            minHeight: 0,
            gap: isCourseCompletion
              ? isTwoRowSkills
                ? showAnyCourseLogo
                  ? showCourseSeal
                    ? '12px'
                    : '18px'
                  : showCourseSeal
                    ? '16px'
                    : '22px'
                : visibleSkills.length > 0
                  ? showAnyCourseLogo
                    ? showCourseSeal
                      ? '18px'
                      : '24px'
                    : showCourseSeal
                      ? '22px'
                      : '30px'
                  : showCourseSeal
                    ? '32px'
                    : '44px'
              : isTwoRowSkills
                ? '18px'
                : '30px',
          }}
        >
          {/* 1. Title & Program Subtitle Block */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div
              style={{
                fontFamily: FONT_SERIF,
                fontSize: '40px',
                fontWeight: 400,
                color: '#2A3366',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                marginBottom: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              {isCourseCompletion
                ? 'Certification of Completion'
                : 'Certificate of Internship'}
            </div>

            <div
              style={{
                fontFamily: FONT_SERIF,
                fontSize: '24px',
                fontWeight: 400,
                color: '#14205A',
                lineHeight: 1.25,
                whiteSpace: isCourseCompletion ? 'normal' : 'nowrap',
                maxWidth: isCourseCompletion ? '620px' : undefined,
              }}
            >
              {isCourseCompletion
                ? displayCourse
                : isStudent
                  ? 'Student Internship Program'
                  : 'Professional Internship Program'}
            </div>

            {/* Decorative subtle accent bar */}
            <div
              style={{
                width: '72px',
                height: '3px',
                borderRadius: '999px',
                background: BRAND_GRADIENT_HORIZONTAL,
                marginTop: '14px',
              }}
            />
          </div>

          {/* 2. Center Recipient & Paragraph Block with faint symbol watermark behind the name */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {/* Faint watermark of /iamtechni-symbol.png (about 150px wide, opacity 0.06) centred behind the name */}
            <img
              src="/iamtechni-symbol.png"
              alt=""
              aria-hidden="true"
              crossOrigin="anonymous"
              style={{
                position: 'absolute',
                top: '56px',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '150px',
                height: 'auto',
                opacity: 0.06,
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            <div
              style={{
                position: 'relative',
                zIndex: 1,
                fontFamily: FONT_SANS,
                fontSize: '15px',
                fontWeight: 500,
                color: '#3B4157',
                lineHeight: 1.4,
                marginBottom: '8px',
              }}
            >
              This is to certify that
            </div>

            {/* Full Name with 16px space below before paragraph */}
            <div
              ref={recipientNameRef}
              data-cert-recipient-name="true"
              style={{
                position: 'relative',
                zIndex: 1,
                fontFamily: FONT_SERIF,
                fontSize: `${nameFontSize}px`,
                fontWeight: 400,
                color: '#14205A',
                lineHeight: 1.12,
                letterSpacing: '-0.01em',
                marginBottom: '16px',
                maxWidth: '646px',
                whiteSpace: 'nowrap',
              }}
            >
              {displayName}
            </div>

            <div
              style={{
                position: 'relative',
                zIndex: 1,
                fontFamily: FONT_SANS,
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: 1.6,
                color: '#3B4157',
                maxWidth: '560px',
                margin: '0 auto',
              }}
            >
              {isCourseCompletion ? (
                <>
                  Has successfully completed all coursework and project
                  requirements for the{' '}
                  <strong style={{ fontWeight: 700, color: '#14205A' }}>
                    {displayCourse}
                  </strong>{' '}
                  program as prescribed by{' '}
                  <strong style={{ fontWeight: 700, color: '#14205A' }}>
                    IAMTECHNI
                  </strong>
                  .
                </>
              ) : isStudent ? (
                <>
                  a student of{' '}
                  <strong style={{ fontWeight: 700, color: '#14205A' }}>
                    {displayCollege}
                  </strong>
                  , has successfully completed a{' '}
                  <strong style={{ fontWeight: 700, color: '#14205A' }}>
                    {durationNum}-month
                  </strong>{' '}
                  internship in{' '}
                  <strong style={{ fontWeight: 700, color: '#14205A' }}>
                    {displayCourse}
                  </strong>{' '}
                  at{' '}
                  <strong style={{ fontWeight: 700, color: '#14205A' }}>
                    IAMTECHNI
                  </strong>{' '}
                  from{' '}
                  <strong style={{ fontWeight: 600, color: '#14205A' }}>
                    {formattedStart}
                  </strong>{' '}
                  to{' '}
                  <strong style={{ fontWeight: 600, color: '#14205A' }}>
                    {formattedEnd}
                  </strong>
                  , demonstrating dedication, a strong learning attitude and
                  practical skills in real-world {displayCourse} projects.
                </>
              ) : (
                <>
                  has successfully completed a{' '}
                  <strong style={{ fontWeight: 700, color: '#14205A' }}>
                    {durationNum}-month
                  </strong>{' '}
                  Professional Internship in{' '}
                  <strong style={{ fontWeight: 700, color: '#14205A' }}>
                    {displayCourse}
                  </strong>{' '}
                  at{' '}
                  <strong style={{ fontWeight: 700, color: '#14205A' }}>
                    IAMTECHNI
                  </strong>{' '}
                  from{' '}
                  <strong style={{ fontWeight: 600, color: '#14205A' }}>
                    {formattedStart}
                  </strong>{' '}
                  to{' '}
                  <strong style={{ fontWeight: 600, color: '#14205A' }}>
                    {formattedEnd}
                  </strong>
                  , demonstrating dedication, a strong learning attitude and
                  practical skills in real-world {displayCourse} projects.
                </>
              )}
            </div>
          </div>

          {/* 3. KEY AREAS OF WORK Block (always shown for internship; shown for Course Completion only when areas are selected) */}
          {showKeyAreasBlock && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              overflow: 'visible',
            }}
          >
            <div
              data-cert-key-areas-pill="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '24px',
                lineHeight: 1,
                padding: '0 14px',
                background: BRAND_GRADIENT_HORIZONTAL,
                color: '#FFFFFF',
                fontFamily: FONT_SANS,
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                borderRadius: '9999px',
                marginBottom: isTwoRowSkills ? '12px' : '16px',
                boxShadow: '0 4px 12px rgba(28, 53, 234, 0.18)',
                boxSizing: 'border-box',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                KEY AREAS OF WORK
              </span>
            </div>

            {visibleSkills.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: isTwoRowSkills ? '10px' : '12px',
                  width: '100%',
                  overflow: 'visible',
                }}
              >
                {skillRows.map((rowItems, rowIndex) => (
                  <div
                    key={rowIndex}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      gap: isTwoRowSkills ? '16px' : '20px',
                      flexWrap: 'nowrap',
                      overflow: 'visible',
                    }}
                  >
                    {rowItems.map((toolName) => {
                      const skill = getCertificateSkillConfig(toolName);
                      const IconComponent = skill.icon;
                      const circleSize = 56;
                      const iconSize = isTwoRowSkills ? 24 : 26;
                      const labelFontSize = isTwoRowSkills ? '11.5px' : '12.5px';

                      return (
                        <div
                          key={toolName}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: isTwoRowSkills ? '90px' : '92px',
                            minWidth: 0,
                            overflow: 'visible',
                          }}
                        >
                          <div
                            style={{
                              width: `${circleSize}px`,
                              height: `${circleSize}px`,
                              borderRadius: '9999px',
                              background: skill.useBrandGradient
                                ? BRAND_GRADIENT_DIAGONAL
                                : skill.bgColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 4px 10px rgba(20, 32, 90, 0.12)',
                              marginBottom: isTwoRowSkills ? '6px' : '8px',
                              flexShrink: 0,
                            }}
                          >
                            <IconComponent
                              size={iconSize}
                              color={skill.iconColor}
                              strokeWidth={2.1}
                            />
                          </div>
                          <span
                            style={{
                              fontFamily: FONT_SANS,
                              fontSize: labelFontSize,
                              fontWeight: 600,
                              color: '#14205A',
                              lineHeight: 1.3,
                              textAlign: 'center',
                              width: '100%',
                              maxWidth: '92px',
                              minHeight: '36px',
                              overflow: 'visible',
                              display: 'block',
                              wordBreak: 'break-word',
                              overflowWrap: 'anywhere',
                              paddingBottom: '2px',
                            }}
                          >
                            {toolName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
          )}

          {/* 3b. Optional AWS or Custom logo in lower body (same position as Key Areas of Work icons, above Issuing date & Value ID) */}
          {showAwsLogo && (
            <div
              data-cert-aws-logo="true"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <svg
                width={94}
                height={58}
                viewBox="0 55 640 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="AWS"
                style={{ display: 'block' }}
              >
                <path
                  fill="#252F3E"
                  d="M180.41 203.01c-.72 22.65 10.6 32.68 10.88 39.05a8.164 8.164 0 0 1-4.1 6.27l-12.8 8.96a10.66 10.66 0 0 1-5.63 1.92c-.43-.02-8.19 1.83-20.48-25.61a78.608 78.608 0 0 1-62.61 29.45c-16.28.89-60.4-9.24-58.13-56.21-1.59-38.28 34.06-62.06 70.93-60.05 7.1.02 21.6.37 46.99 6.27v-15.62c2.69-26.46-14.7-46.99-44.81-43.91-2.4.01-19.4-.5-45.84 10.11-7.36 3.38-8.3 2.82-10.75 2.82-7.41 0-4.36-21.48-2.94-24.2 5.21-6.4 35.86-18.35 65.94-18.18a76.857 76.857 0 0 1 55.69 17.28 70.285 70.285 0 0 1 17.67 52.36l-.01 69.29zM93.99 235.4c32.43-.47 46.16-19.97 49.29-30.47 2.46-10.05 2.05-16.41 2.05-27.4-9.67-2.32-23.59-4.85-39.56-4.87-15.15-1.14-42.82 5.63-41.74 32.26-1.24 16.79 11.12 31.4 29.96 30.48zm170.92 23.05c-7.86.72-11.52-4.86-12.68-10.37l-49.8-164.65c-.97-2.78-1.61-5.65-1.92-8.58a4.61 4.61 0 0 1 3.86-5.25c.24-.04-2.13 0 22.25 0 8.78-.88 11.64 6.03 12.55 10.37l35.72 140.83 33.16-140.83c.53-3.22 2.94-11.07 12.8-10.24h17.16c2.17-.18 11.11-.5 12.68 10.37l33.42 142.63L420.98 80.1c.48-2.18 2.72-11.37 12.68-10.37h19.72c.85-.13 6.15-.81 5.25 8.58-.43 1.85 3.41-10.66-52.75 169.9-1.15 5.51-4.82 11.09-12.68 10.37h-18.69c-10.94 1.15-12.51-9.66-12.68-10.75L328.67 110.7l-32.78 136.99c-.16 1.09-1.73 11.9-12.68 10.75h-18.3zm273.48 5.63c-5.88.01-33.92-.3-57.36-12.29a12.802 12.802 0 0 1-7.81-11.91v-10.75c0-8.45 6.2-6.9 8.83-5.89 10.04 4.06 16.48 7.14 28.81 9.6 36.65 7.53 52.77-2.3 56.72-4.48 13.15-7.81 14.19-25.68 5.25-34.95-10.48-8.79-15.48-9.12-53.13-21-4.64-1.29-43.7-13.61-43.79-52.36-.61-28.24 25.05-56.18 69.52-55.95 12.67-.01 46.43 4.13 55.57 15.62 1.35 2.09 2.02 4.55 1.92 7.04v10.11c0 4.44-1.62 6.66-4.87 6.66-7.71-.86-21.39-11.17-49.16-10.75-6.89-.36-39.89.91-38.41 24.97-.43 18.96 26.61 26.07 29.7 26.89 36.46 10.97 48.65 12.79 63.12 29.58 17.14 22.25 7.9 48.3 4.35 55.44-19.08 37.49-68.42 34.44-69.26 34.42z"
                />
                <path
                  fill="#FF9900"
                  d="M578.59 368.94c-70.03 51.72-171.69 79.25-258.49 79.25A469.127 469.127 0 0 1 2.83 327.46c-6.53-5.89-.77-13.96 7.17-9.47a637.37 637.37 0 0 0 316.88 84.12 630.22 630.22 0 0 0 241.59-49.55c11.78-5 21.77 7.8 10.12 16.38zM607.78 335.65c-8.96-11.52-59.28-5.38-81.81-2.69-6.79.77-7.94-5.12-1.79-9.47 40.07-28.17 105.88-20.1 113.44-10.63 7.55 9.47-2.05 75.41-39.56 106.91-5.76 4.87-11.27 2.3-8.71-4.1 8.44-21.25 27.39-68.49 18.43-80.02z"
                />
              </svg>
            </div>
          )}

          {showCustomLogo && (
            <div
              data-cert-custom-logo="true"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <div
                style={{
                  width: '94px',
                  height: '58px',
                  padding: '2px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={customLogoSrc}
                  alt="Organization Logo"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Course Completion only: 120px round seal aligned with left edge of Issuing date & Value ID row */}
        {showCourseSeal && (
          <div
            data-cert-course-seal="true"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%',
              maxWidth: '580px',
              marginTop: isTwoRowSkills ? '12px' : '16px',
              marginBottom: isTwoRowSkills ? '4px' : '8px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '9999px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow:
                  '0 6px 16px rgba(20, 32, 90, 0.18), 0 2px 6px rgba(20, 32, 90, 0.12)',
                flexShrink: 0,
              }}
            >
              <img
                src={resolvedSealUrl}
                alt="IAMTECHNI Certificate of Excellence Seal"
                crossOrigin="anonymous"
                width={120}
                height={120}
                onError={() => setSealLoadFailed(true)}
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'contain',
                  display: 'block',
                  borderRadius: '9999px',
                  mixBlendMode: 'multiply',
                }}
              />
            </div>
          </div>
        )}

        {/* Issuing date & Value ID two-column row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '580px',
            paddingTop: '8px',
            flexShrink: 0,
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: '12px',
                fontWeight: 500,
                color: '#64748B',
                lineHeight: 1.3,
                marginBottom: '4px',
              }}
            >
              Issuing date
            </div>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: '15px',
                fontWeight: 700,
                color: '#14205A',
                lineHeight: 1.3,
              }}
            >
              {formattedIssue}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: '12px',
                fontWeight: 500,
                color: '#64748B',
                lineHeight: 1.3,
                marginBottom: '4px',
              }}
            >
              Value ID
            </div>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: '15px',
                fontWeight: 700,
                color: '#14205A',
                lineHeight: 1.3,
                letterSpacing: '0.02em',
              }}
            >
              {displayCertId}
            </div>
          </div>
        </div>
      </div>

      {/* Thin gradient divider line above the footer */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '876px',
          left: '22px',
          right: 0,
          height: '2px',
          background: BRAND_GRADIENT_HORIZONTAL,
          zIndex: 4,
        }}
      />

      {/* Footer (white, from 878px to 1105px, above the 18px bottom strip) */}
      <div
        style={{
          position: 'absolute',
          top: '878px',
          bottom: '18px',
          left: '22px',
          right: 0,
          backgroundColor: '#FFFFFF',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 52px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Left: /logo-on-white.png (about 170px wide) */}
        <div
          style={{
            width: '210px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <img
            src="/logo-on-white.png"
            alt="IAMTECHNI"
            crossOrigin="anonymous"
            style={{
              width: '170px',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

        {/* Centre: 70px QR code linking to https://www.iamtechni.in/verify/{certificateId} + "Scan to verify" */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              padding: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <QRCodeCanvas
              value={verifyUrl}
              size={70}
              bgColor="#FFFFFF"
              fgColor="#14205A"
              level="M"
            />
          </div>
          <span
            style={{
              marginTop: '6px',
              fontFamily: FONT_SANS,
              fontSize: '11px',
              fontWeight: 500,
              color: '#64748B',
              lineHeight: 1.2,
            }}
          >
            Scan to verify
          </span>
        </div>

        {/* Right: Signature (fixed 64px height + 6px space before printed name) + Hari Prasanna.R + Founder & CEO */}
        <div
          style={{
            width: '210px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'center',
            textAlign: 'right',
          }}
        >
          <div
            style={{
              height: '64px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              marginBottom: '6px',
              boxSizing: 'border-box',
            }}
          >
            {SIGNATURE_URL && !signatureLoadFailed ? (
              <img
                src={SIGNATURE_URL}
                alt="Signature of Hari Prasanna.R"
                width={121}
                height={62}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  setSignatureLoadFailed(true);
                }}
                style={{
                  width: '121px',
                  height: '62px',
                  maxWidth: '190px',
                  objectFit: 'contain',
                  display: 'block',
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  fontFamily: FONT_SERIF,
                  fontStyle: 'italic',
                  fontSize: '30px',
                  fontWeight: 400,
                  color: '#14205A',
                  lineHeight: 1.15,
                  paddingRight: '2px',
                  whiteSpace: 'nowrap',
                }}
              >
                Hari Prasanna.R
              </div>
            )}
          </div>

          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: '14px',
              fontWeight: 600,
              color: '#14205A',
              lineHeight: 1.25,
            }}
          >
            Hari Prasanna.R
          </div>

          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: '12px',
              fontWeight: 600,
              color: '#1C35EA',
              lineHeight: 1.25,
              marginTop: '2px',
            }}
          >
            {isCourseCompletion ? 'Manager' : 'Founder & CEO'}
          </div>
        </div>
      </div>

      {/* Large diagonal REVOKED watermark in red at 20% opacity if status === 'revoked' */}
      {isRevoked && (
        <div
          aria-label="Certificate Revoked"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              transform: 'rotate(-35deg)',
              fontFamily: FONT_DISPLAY,
              fontSize: '116px',
              fontWeight: 800,
              letterSpacing: '0.14em',
              color: '#DC2626',
              opacity: 0.2,
              border: '10px solid #DC2626',
              padding: '12px 44px',
              borderRadius: '16px',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            REVOKED
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateTemplate;
