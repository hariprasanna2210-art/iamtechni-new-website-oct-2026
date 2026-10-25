import React from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Layers, ShieldAlert, Sparkles } from 'lucide-react';
import { PageRoute } from '../types';
import { PageHero } from '../components/common/PageHero';
import { industriesData } from '../data/industriesData';
import { getCardColorToken } from '../utils/cardColorTokens';
import { getIndustryIcon } from '../utils/serviceIcons';
import { IndustryIllustration } from '../components/common/TechIllustrations';
import { ScrollReveal, ScrollRevealItem } from '../components/common/ScrollReveal';
import { MobileSectionSkeletonWrapper } from '../components/common/MobileSectionSkeleton';

interface IndustriesPageProps {
  onNavigate: (route: PageRoute) => void;
  onStartProject: (serviceName?: string) => void;
}

export const IndustriesPage: React.FC<IndustriesPageProps> = ({
  onNavigate,
  onStartProject,
}) => {
  return (
    <div className="w-full">
      {/* PageHero */}
      <PageHero
        breadcrumbItems={[{ label: 'Industries' }]}
        onNavigate={onNavigate}
        kicker="DOMAIN-SPECIFIC ENGINEERING"
        category="Verticals"
        title="Technology for Distinct Industry Challenges"
        tagline="Engineered for your vertical’s compliance, workflow realities, and scale."
        description="Every vertical operates under unique constraints, compliance frameworks, and customer expectations. We engineer domain-aware web, cloud, and AI solutions aligned with your sector’s reality."
        primaryCtaText="Discuss Industry Scenarios"
        onPrimaryCta={() => onStartProject('Industry Transformation Scoping')}
        secondaryCtaText="Explore All Services"
        onSecondaryCta={() => onNavigate('/services')}
        slug="industries"
      />

      {/* Industries Grid */}
      <MobileSectionSkeletonWrapper variant="cards-grid" sectionIndex={0} cardCount={3}>
      <section className="py-10 sm:py-20 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="space-y-6 sm:space-y-12" staggerChildren={0.15}>
            {industriesData.map((ind, idx) => {
              const color = getCardColorToken(idx);
              const IndIcon = getIndustryIcon(ind.name);

              return (
                <ScrollRevealItem key={ind.id}>
                  <div
                    className={`${color.cardBg} ${color.cardBorder} border rounded-2xl p-4 sm:p-8 shadow-sm ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200 interactive-card-lift`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-slate-200/70">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs font-mono">
                          <div className={`w-8 h-8 rounded-lg ${color.iconBg} text-white flex items-center justify-center shadow-xs shrink-0`}>
                            <IndIcon className="w-4 h-4" />
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-md font-bold ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}>
                            SECTOR 0{idx + 1}
                          </span>
                          <span className="text-slate-400 hidden sm:inline">·</span>
                          <span className="text-slate-600 font-semibold hidden sm:inline">{ind.name.toUpperCase()}</span>
                        </div>
                        <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-2xl font-bold text-[#1E3A8A] pt-1">{ind.name}</h2>
                        <p className="text-[13px] sm:text-sm text-slate-600 max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none">
                          {ind.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onStartProject(`${ind.name} Solutions`)}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-5 sm:py-2.5 min-h-[44px] min-w-[44px] rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white font-semibold text-xs sm:text-[13px] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                        >
                          <span>Discuss Sector Project</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Grid Split: 3 Columns for specs + 1 Column for Architecture Illustration */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 pt-4 sm:pt-6">
                      {/* Left Specs: 3 Columns */}
                      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        {/* Column 1: Core Challenges */}
                        <div className="bg-white/85 p-3.5 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                          <div>
                            <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 sm:mb-3 flex items-center gap-1.5 font-mono">
                              <ShieldAlert className="w-4 h-4 text-amber-500" /> Operational Friction
                            </h3>
                            <ul className="space-y-2 sm:space-y-2.5 text-[13px] sm:text-[13.5px] text-slate-600 leading-snug">
                              {ind.coreChallenges.map((ch, i) => (
                                <li
                                  key={i}
                                  className={`${i >= 2 ? 'hidden sm:flex' : 'flex'} items-start gap-2`}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                  <span>{ch}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Column 2: Digital Opportunities */}
                        <div className="bg-white/85 p-3.5 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                          <div>
                            <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 sm:mb-3 flex items-center gap-1.5 font-mono">
                              <Sparkles className="w-4 h-4 text-[#04C8E8]" /> Strategic Opportunities
                            </h3>
                            <ul className="space-y-2 sm:space-y-2.5 text-[13px] sm:text-[13.5px] text-slate-600 leading-snug">
                              {ind.digitalOpportunities.map((op, i) => (
                                <li
                                  key={i}
                                  className={`${i >= 2 ? 'hidden sm:flex' : 'flex'} items-start gap-2`}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#04C8E8] mt-1.5 shrink-0" />
                                  <span>{op}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Column 3: IAMTECHNI Solutions */}
                        <div className="bg-white/85 p-3.5 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                          <div>
                            <h3 className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${color.accentText} mb-2 sm:mb-3 flex items-center gap-1.5 font-mono`}>
                              <Layers className="w-4 h-4" /> IAMTECHNI Delivery
                            </h3>
                            <ul className="space-y-2 sm:space-y-2.5 text-[13px] sm:text-[13.5px] text-slate-600 leading-snug">
                              {ind.iamtechniSolutions.map((sol, i) => (
                                <li
                                  key={i}
                                  className={`${i >= 2 ? 'hidden sm:flex' : 'flex'} items-start gap-2`}
                                >
                                  <CheckCircle2 className={`w-3.5 h-3.5 ${color.accentText} shrink-0 mt-0.5`} />
                                  <span>{sol}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Custom Technology Architecture Illustration for this Industry */}
                      <div className="lg:col-span-5 flex flex-col justify-center">
                        <IndustryIllustration industryId={ind.name} />
                      </div>
                    </div>

                    {/* Related Services */}
                    <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-2 text-slate-600">
                        <span className="font-semibold text-slate-800">Recommended Practices:</span>
                        {ind.suggestedServices.map((srv, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => onNavigate(srv.route)}
                            className={`min-h-[44px] min-w-[44px] inline-flex items-center px-2 md:px-0 md:min-h-0 md:min-w-0 ${color.accentText} font-semibold hover:underline cursor-pointer`}
                          >
                            {srv.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollRevealItem>
              );
            })}
          </ScrollReveal>
        </div>
      </section>
      </MobileSectionSkeletonWrapper>
    </div>
  );
};
