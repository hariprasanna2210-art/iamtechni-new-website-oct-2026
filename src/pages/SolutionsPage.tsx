import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Filter, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { PageRoute } from '../types';
import { PageHero } from '../components/common/PageHero';
import { solutionsData } from '../data/solutionsData';
import { getCardColorToken } from '../utils/cardColorTokens';
import { getServiceIcon } from '../utils/serviceIcons';
import { ServiceCardThumbnail } from '../components/common/ServiceVisualMockups';
import { ScrollReveal, ScrollRevealItem } from '../components/common/ScrollReveal';
import { MobileSectionSkeletonWrapper } from '../components/common/MobileSectionSkeleton';

interface SolutionsPageProps {
  slug?: string;
  onNavigate: (route: PageRoute) => void;
  onStartProject: (serviceName?: string) => void;
}

export const SolutionsPage: React.FC<SolutionsPageProps> = ({
  slug,
  onNavigate,
  onStartProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', 'Operational', 'Intelligence', 'Infrastructure', 'Commerce'];

  useEffect(() => {
    if (slug) {
      setSelectedCategory('All');
      const timer = setTimeout(() => {
        const el = document.getElementById(`solution-${slug}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [slug]);

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
      <MobileSectionSkeletonWrapper variant="cards-grid" sectionIndex={0} cardCount={3}>
      <section className="py-10 sm:py-20 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-2 border-b border-slate-200">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-bold">
                Categorized Solutions
              </div>
              <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-2xl font-bold text-[#1E3A8A] mt-1 drop-shadow-[0_2px_8px_rgba(30,58,138,0.08)]">
                Explore Implementation Blueprints
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[44px] min-w-[44px] md:min-h-[38px] md:min-w-0 px-3.5 py-2 text-xs sm:text-[13px] font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#1E3A8A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#1E3A8A] hover:bg-[#F5F8FC]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Solution Cards with Coordinated Distinct Colors */}
          <ScrollReveal className="space-y-5 sm:space-y-8" staggerChildren={0.12}>
            {filteredSolutions.map((sol, idx) => {
              const color = getCardColorToken(idx);
              const SolutionIcon = getServiceIcon(sol.relatedServiceName || sol.category);

              return (
                <ScrollRevealItem key={sol.id}>
                  <div
                    id={`solution-${sol.id}`}
                    className={`${color.cardBg} ${color.cardBorder} border rounded-2xl p-4 sm:p-8 shadow-sm ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200 interactive-card-lift`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-slate-200/70">
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono mb-1.5 sm:mb-2">
                          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${color.iconBg} text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-110 transition-transform`}>
                            <SolutionIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-md font-bold ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}>
                            {sol.category.toUpperCase()} SOLUTION
                          </span>
                          <span className="text-slate-400 hidden sm:inline">·</span>
                          <span className="text-slate-600 font-semibold hidden sm:inline">CUSTOM IMPLEMENTATION</span>
                        </div>
                        <h3 className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-2xl font-bold text-[#1E3A8A]">{sol.title}</h3>
                        <p className="text-[13px] sm:text-sm text-slate-600 max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none">
                          {sol.summary}
                        </p>
                      </div>

                      <button
                        onClick={() => onStartProject(sol.title)}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-5 sm:py-2.5 min-h-[44px] min-w-[44px] rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white font-semibold text-xs sm:text-[13px] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-all duration-200 active:scale-[0.98] cursor-pointer shrink-0 self-start md:self-auto"
                      >
                        <span>Consult on this Solution</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Problem vs Proposed Approach + Visual Blueprint Preview */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6 pt-4 sm:pt-6 items-stretch">
                      <div className="lg:col-span-4 bg-white/85 p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                        <div>
                          <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 sm:mb-2 font-mono">
                            The Business Problem
                          </h4>
                          <p className="text-[13px] sm:text-sm text-slate-700 leading-relaxed line-clamp-3 sm:line-clamp-none">{sol.problem}</p>
                        </div>
                      </div>

                      <div className="lg:col-span-4 bg-white/85 p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                        <div>
                          <h4 className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${color.accentText} mb-1.5 sm:mb-2 font-mono`}>
                            IAMTECHNI Architectural Approach
                          </h4>
                          <p className="text-[13px] sm:text-sm text-slate-700 leading-relaxed line-clamp-3 sm:line-clamp-none">{sol.proposedApproach}</p>
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
                    <div className="mt-4 sm:mt-6 p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 shadow-2xs">
                      <div className="text-[13px] sm:text-sm text-slate-700">
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
      </MobileSectionSkeletonWrapper>
    </div>
  );
};
