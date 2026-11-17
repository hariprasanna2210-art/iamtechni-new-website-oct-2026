import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  SIGNATURE_URL,
  getCertificateSkillConfig,
} from '../../data/certificateSkills';

export interface CertificateTemplateData {
  certificateId: string;
  fullName: string;
  type: 'student' | 'professional';
  course: string;
  durationMonths: number;
  startDate: string;
  endDate: string;
  issueDate: string;
  college?: string;
  keyAreas: string[];
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
  const recipientNameRef = React.useRef<HTMLDivElement | null>(null);
  const [nameFontSize, setNameFontSize] = React.useState<number>(
    RECIPIENT_NAME_MAX_FONT_SIZE
  );
  const isStudent = data.type === 'student';
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
    Number.isFinite(data.durationMonths) && data.durationMonths > 0
      ? data.durationMonths
      : 1;
  const formattedStart = formatCertificateDate(data.startDate);
  const formattedEnd = formatCertificateDate(data.endDate);
  const formattedIssue = formatCertificateDate(data.issueDate);
  const displayCertId = data.certificateId.trim() || 'IAMT-STU-2026-XXXXX';
  const verifyUrl = `https://www.iamtechni.in/verify/${encodeURIComponent(
    displayCertId
  )}`;

  const visibleSkills = (data.keyAreas ?? []).slice(0, 12);
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
            ? '34px 48px 22px 48px'
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
            gap: isTwoRowSkills ? '18px' : '30px',
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
              Certificate of Internship
            </div>

            <div
              style={{
                fontFamily: FONT_SERIF,
                fontSize: '24px',
                fontWeight: 400,
                color: '#14205A',
                lineHeight: 1.25,
                whiteSpace: 'nowrap',
              }}
            >
              {isStudent
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

            {/* Full Name with 16px space below before the paragraph */}
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
              {isStudent ? (
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

          {/* 3. KEY AREAS OF WORK Block (56px icon circles, >=36px tall labels with overflow visible) */}
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
        </div>

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
            Founder &amp; CEO
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
