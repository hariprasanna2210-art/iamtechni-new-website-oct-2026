import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Filter, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { PageRoute } from '../types';
import { PageHero } from '../components/common/PageHero';
import { solutionsData } from '../data/solutionsData';
import { getCardColorToken } from '../utils/cardColorTokens';
import { getServiceIcon } from '../utils/serviceIcons';
import { ServiceCardThumbnail } from '../components/common/ServiceVisualMockups';
import { ScrollReveal, ScrollRevealItem } from '../components/common/ScrollReveal';

interface SolutionsPageProps {
  onNavigate: (route: PageRoute) => void;
  onStartProject: (serviceName?: string) => void;
}

export const SolutionsPage: React.FC<SolutionsPageProps> = ({
  onNavigate,
  onStartProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', 'Operational', 'Intelligence', 'Infrastructure', 'Commerce'];

  const filteredSolutions =
    selectedCategory === 'All'
      ? solutionsData
      : solutionsData.filter((s) => s.category === selectedCategory);

  return (
    <div className="w-full">
      {/* Unified PageHero for Solutions Page */}
      <PageHero
        breadcrumbItems={[{ label: 'Solutions' }]}
        onNavigate={onNavigate}
        kicker="OUTCOME-DRIVEN ARCHITECTURES"
        category="Transformations"
        title="Business Solutions & Digital Transformation"
        tagline="Engineered around concrete organizational objectives and ROI metrics."
        description="We engineer custom solutions tailored to concrete organizational objectives: automating repetitive administrative operations, deploying verified private AI knowledge search, and modernizing legacy cloud systems."
        primaryCtaText="Consult on Solution Architecture"
        onPrimaryCta={() => onStartProject('Enterprise Solution Architecture')}
        secondaryCtaText="Explore All Services"
        onSecondaryCta={() => onNavigate('/services')}
        slug="solutions"
      />

      {/* Solutions Section */}
      <section className="py-20 bg-[#F4F7FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold">
                Categorized Solutions
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Explore Implementation Blueprints
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Solution Cards with Coordinated Distinct Colors */}
          <ScrollReveal className="space-y-8" staggerChildren={0.12}>
            {filteredSolutions.map((sol, idx) => {
              const color = getCardColorToken(idx);
              const SolutionIcon = getServiceIcon(sol.relatedServiceName || sol.category);

              return (
                <ScrollRevealItem key={sol.id}>
                  <div
                    className={`${color.cardBg} ${color.cardBorder} border rounded-2xl p-8 shadow-sm ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200 interactive-card-lift`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-200/70">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono mb-2">
                          <div className={`w-10 h-10 rounded-xl ${color.iconBg} text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-110 transition-transform`}>
                            <SolutionIcon className="w-5 h-5" />
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-md font-bold ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}>
                            {sol.category.toUpperCase()} SOLUTION
                          </span>
                          <span className="text-slate-400 hidden sm:inline">·</span>
                          <span className="text-slate-600 font-semibold">CUSTOM IMPLEMENTATION</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">{sol.title}</h3>
                        <p className="text-sm text-slate-700 max-w-2xl leading-relaxed">
                          {sol.summary}
                        </p>
                      </div>

                      <button
                        onClick={() => onStartProject(sol.title)}
                        className={`px-5 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-900 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer active:scale-98`}
                      >
                        <span>Consult on this Solution</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Problem vs Proposed Approach + Visual Blueprint Preview */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-stretch">
                      <div className="lg:col-span-4 bg-white/80 p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">
                            The Business Problem
                          </h4>
                          <p className="text-xs text-slate-700 leading-relaxed">{sol.problem}</p>
                        </div>
                      </div>

                      <div className="lg:col-span-4 bg-white/80 p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                        <div>
                          <h4 className={`text-xs font-bold uppercase tracking-wider ${color.accentText} mb-2 font-mono`}>
                            IAMTECHNI Architectural Approach
                          </h4>
                          <p className="text-xs text-slate-700 leading-relaxed">{sol.proposedApproach}</p>
                        </div>
                      </div>

                      <div className="lg:col-span-4 flex items-center">
                        <ServiceCardThumbnail
                          slug={sol.relatedServiceName || sol.category}
                          category={sol.category}
                          className="h-full"
                        />
                      </div>
                    </div>

                    {/* Measurable Impact Banner */}
                    <div className="mt-6 p-4 rounded-xl bg-white border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                      <div className="text-xs text-slate-700">
                        <span className={`font-bold ${color.accentText}`}>Verified Benefit: </span>
                        {sol.potentialBenefits[0]}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-md text-[10px] font-mono font-medium text-slate-700">
                          {sol.relatedServiceName}
                        </span>
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
