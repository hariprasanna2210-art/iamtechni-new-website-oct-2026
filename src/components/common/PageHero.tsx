import React from 'react';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { PageRoute } from '../../types';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { PageHeroVisual } from '../heroes/PageHeroVisuals';
import { getCardColorTokenBySlug } from '../../utils/cardColorTokens';

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
  // Deterministically get coordinated accent token for this service
  const token = getCardColorTokenBySlug(slug);

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
        className={`relative overflow-hidden border-b border-[#DBEAFE]/80 py-14 sm:py-18 lg:py-22 ${bgGradient}`}
      >
        {/* Layered Soft Ambient Glows for Visual Depth */}
        <div
          className={`absolute top-0 right-1/4 w-[480px] h-[320px] bg-gradient-to-tr ${ambientGlow} rounded-full blur-[100px] pointer-events-none`}
        />
        <div
          className="absolute -bottom-10 left-10 w-[300px] h-[240px] bg-gradient-to-tr from-[#DBEAFE]/35 to-transparent rounded-full blur-[80px] pointer-events-none"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Typography, Value Proposition & Actions */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              {/* Top Kicker Pill — Unified Hero Eyebrow Pill */}
              <div className="inline-flex flex-wrap items-center gap-2 min-h-[34px] px-3 sm:px-4 py-1 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 backdrop-blur-md border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-xs font-mono font-bold text-[#2563EB] max-w-full">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)] shrink-0" />
                {category && (
                  <>
                    <span className="text-[#1E3A8A]">{category.toUpperCase()}</span>
                    <span className="text-[#93C5FD] hidden sm:inline">|</span>
                  </>
                )}
                <span className="text-[#2563EB]">{kicker}</span>
              </div>

              {/* Large, Professional Headline — Unified Hero Font & Color Effect */}
              <h1 className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold tracking-[-0.015em] text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)] leading-[1.16] text-balance">
                {title}
              </h1>

              {/* Tagline if provided — Unified Soft Blue Gradient Effect */}
              {tagline && (
                <p className="text-base sm:text-lg font-semibold bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] bg-clip-text text-transparent leading-snug">
                  {tagline}
                </p>
              )}

              {/* Concise Service-Specific Description */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-medium">
                {description}
              </p>

              {/* Primary & Secondary Action CTAs — Unified Hero Button Color, Size & Layout */}
              <div className="pt-1 flex flex-row flex-wrap items-center gap-2.5 sm:gap-3">
                {onPrimaryCta && (
                  <button
                    type="button"
                    onClick={onPrimaryCta}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 min-h-[40px] rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white font-semibold text-xs sm:text-[13px] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                  >
                    <span>{primaryCtaText || `Discuss Your ${title} Project`}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white shrink-0" />
                  </button>
                )}

                {onSecondaryCta && (
                  <button
                    type="button"
                    onClick={onSecondaryCta}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 min-h-[40px] rounded-lg bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 hover:from-white hover:to-[#F0F9FF] text-[#1E3A8A] hover:text-[#2563EB] font-semibold text-xs sm:text-[13px] border border-[#DBEAFE]/90 shadow-[0_2px_10px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
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
