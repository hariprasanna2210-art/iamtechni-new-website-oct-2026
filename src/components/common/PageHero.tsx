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

  // Background gradient with gentle pastel tint corresponding to the service
  const bgGradient =
    themeOverride?.bgGradient ||
    `bg-gradient-to-b from-[${token.hexBg}] via-[#F8FAFD] to-white`;

  const ambientGlow =
    themeOverride?.ambientGlow ||
    `from-[${token.hexPrimary}]/15 via-[#1266E8]/10 to-[#5427D9]/15`;

  const buttonGradient =
    themeOverride?.buttonGradient ||
    'bg-gradient-to-r from-[#1266E8] via-[#0B5CD5] to-[#5427D9]';

  return (
    <div className="w-full">
      {breadcrumbItems && onNavigate && (
        <Breadcrumbs items={breadcrumbItems} onNavigate={onNavigate} />
      )}

      <section
        className={`relative overflow-hidden border-b border-slate-200 py-16 lg:py-24 ${bgGradient}`}
      >
        {/* Layered Ambient Glows for Visual Depth */}
        <div
          className={`absolute top-0 right-1/4 w-[500px] h-[350px] bg-gradient-to-tr ${ambientGlow} rounded-full blur-[100px] pointer-events-none`}
        />
        <div
          className="absolute -bottom-10 left-10 w-[300px] h-[250px] bg-gradient-to-tr from-[#04C8E8]/10 to-transparent rounded-full blur-[80px] pointer-events-none"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Typography, Value Proposition & Actions */}
            <div className="lg:col-span-7 space-y-6">
              {/* Top Kicker Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 shadow-2xs text-xs font-mono font-semibold text-slate-800">
                <span className={`w-2 h-2 rounded-full ${token.dotBg}`} />
                {category && (
                  <>
                    <span className={token.accentText}>{category.toUpperCase()}</span>
                    <span className="text-slate-300">|</span>
                  </>
                )}
                <span className="text-slate-700">{kicker}</span>
              </div>

              {/* Large, Professional Headline */}
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12] text-balance">
                {title}
              </h1>

              {/* Tagline if provided */}
              {tagline && (
                <p className="text-lg sm:text-xl font-semibold text-slate-800 leading-snug">
                  {tagline}
                </p>
              )}

              {/* Concise Service-Specific Description */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                {description}
              </p>

              {/* Primary & Secondary Action CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                {onPrimaryCta && (
                  <button
                    onClick={onPrimaryCta}
                    className={`inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white ${buttonGradient} hover:opacity-95 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer`}
                  >
                    <span>{primaryCtaText || `Discuss Your ${title} Project`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {onSecondaryCta && (
                  <button
                    onClick={onSecondaryCta}
                    className="px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-200/90 shadow-2xs cursor-pointer"
                  >
                    {secondaryCtaText}
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Bespoke High-Fidelity Visual Composition */}
            <div className="lg:col-span-5 flex items-center justify-center">
              {customVisual || <PageHeroVisual type={slug} />}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
