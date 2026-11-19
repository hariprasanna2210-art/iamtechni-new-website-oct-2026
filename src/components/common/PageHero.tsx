import React from 'react';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { PageRoute } from '../../types';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { PageHeroVisual } from '../heroes/PageHeroVisuals';
import { AnimatedHeading } from './AnimatedHeading';

export interface PageHeroProps {
  // Breadcrumb information
  breadcrumbItems?: { label: string; route?: PageRoute }[];
  onNavigate?: (route: PageRoute) => void;

  // Content
  kicker?: string;
  category?: string;
  title: string;
  tagline?: string;
  description: string;

  // CTAs
  primaryCtaText?: string;
  onPrimaryCta?: () => void;
  secondaryCtaText?: string;
  onSecondaryCta?: () => void;

  // Visual type & accent styling
  slug: string;
  customVisual?: React.ReactNode;
  
  // Custom theme override (optional, otherwise resolved deterministically)
  themeOverride?: {
    bgGradient?: string;
    ambientGlow?: string;
    badgeBg?: string;
    badgeText?: string;
    badgeBorder?: string;
    buttonGradient?: string;
  };
}

export const PageHero: React.FC<PageHeroProps> = ({
  breadcrumbItems,
  onNavigate,
  kicker = 'IAMTECHNI PRACTICE',
  category,
  title,
  tagline,
  description,
  primaryCtaText,
  onPrimaryCta,
  secondaryCtaText = 'Explore All Services',
  onSecondaryCta,
  slug,
  customVisual,
  themeOverride,
}) => {
  // Soft, light background gradient matching the sitewide IAMTECHNI palette
  const bgGradient =
    themeOverride?.bgGradient ||
    'bg-gradient-to-b from-[#F5F8FC] via-[#F9FBFF] to-[#FFFFFF]';

  const ambientGlow =
    themeOverride?.ambientGlow ||
    'from-[#DBEAFE]/45 via-[#EEF4FF]/40 to-[#ECFEFF]/35';

  return (
    <div className="w-full">
      {breadcrumbItems && onNavigate && (
        <Breadcrumbs items={breadcrumbItems} onNavigate={onNavigate} />
      )}

      <section
        className={`relative overflow-hidden border-b border-[#DBEAFE]/80 py-7 sm:py-14 lg:py-20 ${bgGradient}`}
      >
        {/* Layered Soft Animated Ambient Glows for Visual Depth (stopped for reduced motion) */}
        <div
          className={`absolute top-0 right-1/4 w-[480px] h-[320px] bg-gradient-to-tr ${ambientGlow} rounded-full blur-[100px] pointer-events-none animate-hero-ambient`}
        />
        <div
          className="absolute -bottom-10 left-10 w-[340px] h-[260px] bg-gradient-to-tr from-[#00B0F0]/18 via-[#1C35EA]/12 to-transparent rounded-full blur-[85px] pointer-events-none animate-hero-ambient-reverse"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-10 lg:gap-12 items-center">
            {/* Left Column: Typography, Value Proposition & Actions */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-5 relative">
              {/* Gentle glow behind the main heading */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-4 -left-6 w-80 h-36 rounded-full bg-gradient-to-r from-[#00B0F0]/16 via-[#1C35EA]/12 to-[#4D19EA]/10 blur-2xl"
              />

              {/* Top Kicker Pill — Unified Hero Eyebrow Pill */}
              <div className="relative inline-flex flex-wrap items-center gap-2 min-h-[32px] sm:min-h-[34px] px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 backdrop-blur-md border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-[11px] sm:text-xs font-mono font-bold text-[#1C35EA] max-w-full">
                <span className="w-2 h-2 rounded-full bg-[#00B0F0] shadow-[0_0_8px_rgba(0,176,240,0.5)] shrink-0" />
                {category && (
                  <>
                    <span className="text-[#14205A]">{category.toUpperCase()}</span>
                    <span className="text-[#00B0F0] hidden sm:inline">|</span>
                  </>
                )}
                <span className="text-[#1C35EA]">{kicker}</span>
              </div>

              {/* Large, Professional Headline — Unified Hero Font & Gentle Glow */}
              <AnimatedHeading
                as="h1"
                className="relative !font-['Outfit','Space_Grotesk',sans-serif] text-[clamp(1.55rem,3.6vw,2.75rem)] font-extrabold tracking-[-0.02em] text-[#14205A] drop-shadow-[0_2px_14px_rgba(0,176,240,0.16)] leading-[1.15] text-balance"
              >
                {title}
              </AnimatedHeading>

              {/* Tagline if provided */}
              {tagline && (
                <p className="relative text-[14.5px] sm:text-lg font-semibold text-[#14205A] leading-snug max-w-2xl">
                  {tagline}
                </p>
              )}

              {/* Concise Service-Specific Description */}
              <p className="relative text-[13.5px] sm:text-base lg:text-[17px] text-slate-700 leading-[1.65] sm:leading-[1.7] max-w-2xl line-clamp-3 sm:line-clamp-none">
                {description}
              </p>

              {/* Primary & Secondary Action CTAs — Cyan-to-Blue Primary Gradient + Sheen & Clean Secondary Outline */}
              <div className="relative pt-1 sm:pt-2 flex flex-col min-[440px]:flex-row flex-wrap items-stretch min-[440px]:items-center gap-2.5 sm:gap-3">
                {onPrimaryCta && (
                  <button
                    type="button"
                    onClick={onPrimaryCta}
                    className="btn-sheen group inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 min-h-[44px] min-w-[44px] rounded-xl bg-gradient-to-r from-[#00B0F0] to-[#1C35EA] text-white font-semibold text-xs sm:text-sm shadow-[0_8px_20px_-4px_rgba(28,53,234,0.34)] hover:shadow-[0_12px_26px_-4px_rgba(0,176,240,0.45)] hover:-translate-y-0.5 hover:brightness-110 transition-all duration-200 active:scale-[0.98] cursor-pointer"
                  >
                    <span className="relative z-10">{primaryCtaText || `Discuss Your ${title} Project`}</span>
                    <ArrowRight className="relative z-10 w-4 h-4 text-white shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                )}

                {onSecondaryCta && (
                  <button
                    type="button"
                    onClick={onSecondaryCta}
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 min-h-[44px] min-w-[44px] rounded-xl bg-white/95 hover:bg-[#F4FAFF] text-[#14205A] hover:text-[#1C35EA] font-semibold text-xs sm:text-sm border border-[#1C35EA]/30 hover:border-[#00B0F0] shadow-[0_4px_14px_rgba(20,32,90,0.06)] hover:-translate-y-0.5 hover:brightness-105 transition-all duration-200 active:scale-[0.98] cursor-pointer"
                  >
                    <span>{secondaryCtaText}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Bespoke High-Fidelity Visual Composition */}
            <div className="lg:col-span-5 flex items-center justify-center w-full">
              {customVisual || <PageHeroVisual type={slug} />}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
