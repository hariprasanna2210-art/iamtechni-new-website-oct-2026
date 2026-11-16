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

const FONT_NEWSREADER = "'Newsreader', Georgia, 'Times New Roman', serif";
const FONT_MANROPE = "'Manrope', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_GREAT_VIBES = "'Great Vibes', cursive";

export const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  data,
  containerRef,
}) => {
  const isStudent = data.type === 'student';
  const displayName = data.fullName.trim() || 'Applicant Full Name';
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
  const visibleSkills = (data.keyAreas ?? []).slice(0, 6);
  const isRevoked = data.status === 'revoked';

  return (
    <div
      ref={containerRef}
      style={{
        width: '794px',
        height: '1123px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        color: '#14205A',
        fontFamily: FONT_MANROPE,
        boxSizing: 'border-box',
        userSelect: 'none',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* Ensure Google Fonts are loaded whenever CertificateTemplate is rendered */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Manrope:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400&display=swap"
      />

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
          padding: '54px 56px 36px 56px',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        {/* Top Headings Block */}
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
              fontFamily: FONT_NEWSREADER,
              fontSize: '40px',
              fontWeight: 600,
              color: '#2A3366',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              marginBottom: '10px',
            }}
          >
            Certificate of Internship
          </div>

          <div
            style={{
              fontFamily: FONT_NEWSREADER,
              fontSize: '24px',
              fontWeight: 500,
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
              marginTop: '18px',
            }}
          />
        </div>

        {/* Center Recipient & Paragraph Block with faint symbol watermark behind the name */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '10px 0',
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
              top: '48px',
              left: '50%',
              transform: 'translate(-50%, -25%)',
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
              fontFamily: FONT_MANROPE,
              fontSize: '15px',
              fontWeight: 500,
              color: '#3B4157',
              lineHeight: 1.4,
              marginBottom: '12px',
            }}
          >
            This is to certify that
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              fontFamily: FONT_NEWSREADER,
              fontSize: '52px',
              fontWeight: 600,
              color: '#14205A',
              lineHeight: 1.12,
              letterSpacing: '-0.01em',
              marginBottom: '20px',
              maxWidth: '650px',
              wordBreak: 'break-word',
            }}
          >
            {displayName}
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              fontFamily: FONT_MANROPE,
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

        {/* Key Areas of Work + Issuing Date / Value ID Row */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            gap: '26px',
          }}
        >
          {/* KEY AREAS OF WORK */}
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
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: BRAND_GRADIENT_HORIZONTAL,
                color: '#FFFFFF',
                fontFamily: FONT_MANROPE,
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '6px 18px',
                borderRadius: '9999px',
                lineHeight: 1.2,
                marginBottom: '18px',
                boxShadow: '0 4px 12px rgba(28, 53, 234, 0.18)',
              }}
            >
              KEY AREAS OF WORK
            </div>

            {visibleSkills.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  gap: '24px',
                  flexWrap: 'nowrap',
                }}
              >
                {visibleSkills.map((toolName) => {
                  const skill = getCertificateSkillConfig(toolName);
                  const IconComponent = skill.icon;
                  return (
                    <div
                      key={toolName}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '72px',
                      }}
                    >
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '9999px',
                          background: skill.useBrandGradient
                            ? BRAND_GRADIENT_DIAGONAL
                            : skill.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 10px rgba(20, 32, 90, 0.12)',
                          marginBottom: '8px',
                        }}
                      >
                        <IconComponent
                          size={22}
                          color={skill.iconColor}
                          strokeWidth={2.1}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: FONT_MANROPE,
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#14205A',
                          lineHeight: 1.25,
                          textAlign: 'center',
                          wordBreak: 'break-word',
                        }}
                      >
                        {toolName}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
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
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontFamily: FONT_MANROPE,
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
                  fontFamily: FONT_MANROPE,
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
                  fontFamily: FONT_MANROPE,
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
                  fontFamily: FONT_MANROPE,
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
              fontFamily: FONT_MANROPE,
              fontSize: '11px',
              fontWeight: 500,
              color: '#64748B',
              lineHeight: 1.2,
            }}
          >
            Scan to verify
          </span>
        </div>

        {/* Right: Signature + Hari Prasanna.R + Founder & CEO */}
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
          {SIGNATURE_URL ? (
            <img
              src={SIGNATURE_URL}
              alt="Signature of Hari Prasanna.R"
              crossOrigin="anonymous"
              style={{
                height: '46px',
                width: 'auto',
                objectFit: 'contain',
                marginBottom: '4px',
                display: 'block',
              }}
            />
          ) : (
            <div
              style={{
                fontFamily: FONT_GREAT_VIBES,
                fontSize: '34px',
                fontWeight: 400,
                color: '#14205A',
                lineHeight: 1.15,
                marginBottom: '2px',
                paddingRight: '2px',
              }}
            >
              Hari Prasanna.R
            </div>
          )}

          <div
            style={{
              width: '150px',
              height: '1px',
              backgroundColor: '#CBD5E1',
              marginBottom: '6px',
            }}
          />

          <div
            style={{
              fontFamily: FONT_MANROPE,
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
              fontFamily: FONT_MANROPE,
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
              fontFamily: FONT_MANROPE,
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
