import React from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Layers, ShieldAlert, Sparkles } from 'lucide-react';
import { PageRoute } from '../types';
import { PageHero } from '../components/common/PageHero';
import { industriesData } from '../data/industriesData';
import { getCardColorToken } from '../utils/cardColorTokens';
import { getIndustryIcon } from '../utils/serviceIcons';
import { IndustryIllustration } from '../components/common/TechIllustrations';
import { ScrollReveal, ScrollRevealItem } from '../components/common/ScrollReveal';

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
      <section className="py-20 bg-[#F4F7FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="space-y-12" staggerChildren={0.15}>
            {industriesData.map((ind, idx) => {
              const color = getCardColorToken(idx);
              const IndIcon = getIndustryIcon(ind.name);

              return (
                <ScrollRevealItem key={ind.id}>
                  <div
                    className={`${color.cardBg} ${color.cardBorder} border rounded-2xl p-8 shadow-sm ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200 interactive-card-lift`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-200/70">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs font-mono">
                          <div className={`w-8 h-8 rounded-lg ${color.iconBg} text-white flex items-center justify-center shadow-xs shrink-0`}>
                            <IndIcon className="w-4 h-4" />
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-md font-bold ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}>
                            SECTOR 0{idx + 1}
                          </span>
                          <span className="text-slate-400 hidden sm:inline">·</span>
                          <span className="text-slate-600 font-semibold">{ind.name.toUpperCase()}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 pt-1">{ind.name}</h2>
                        <p className="text-sm text-slate-700 max-w-2xl leading-relaxed">
                          {ind.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onStartProject(`${ind.name} Solutions`)}
                          className="px-5 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-900 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs hover:bg-slate-50 cursor-pointer active:scale-98"
                        >
                          <span>Discuss Sector Project</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Grid Split: 3 Columns for specs + 1 Column for Architecture Illustration */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
                      {/* Left Specs: 3 Columns */}
                      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Column 1: Core Challenges */}
                        <div className="bg-white/80 p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5 font-mono">
                              <ShieldAlert className="w-4 h-4 text-amber-500" /> Operational Friction
                            </h3>
                            <ul className="space-y-2 text-xs text-slate-600">
                              {ind.coreChallenges.map((ch, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                  <span>{ch}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Column 2: Digital Opportunities */}
                        <div className="bg-white/80 p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5 font-mono">
                              <Sparkles className="w-4 h-4 text-[#04C8E8]" /> Strategic Opportunities
                            </h3>
                            <ul className="space-y-2 text-xs text-slate-600">
                              {ind.digitalOpportunities.map((op, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#04C8E8] mt-1.5 shrink-0" />
                                  <span>{op}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Column 3: IAMTECHNI Solutions */}
                        <div className="bg-white/80 p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                          <div>
                            <h3 className={`text-xs font-bold uppercase tracking-wider ${color.accentText} mb-3 flex items-center gap-1.5 font-mono`}>
                              <Layers className="w-4 h-4" /> IAMTECHNI Delivery
                            </h3>
                            <ul className="space-y-2 text-xs text-slate-600">
                              {ind.iamtechniSolutions.map((sol, i) => (
                                <li key={i} className="flex items-start gap-2">
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
                    <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-2 text-slate-600">
                        <span className="font-semibold text-slate-800">Recommended Practices:</span>
                        {ind.suggestedServices.map((srv, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => onNavigate(srv.route)}
                            className={`${color.accentText} font-semibold hover:underline cursor-pointer`}
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
    </div>
  );
};
