import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Cpu, Layers, Sparkles } from 'lucide-react';
import { PageRoute } from '../types';
import { PageHero } from '../components/common/PageHero';
import { technologyData } from '../data/technologyData';
import { getCardColorToken } from '../utils/cardColorTokens';
import { getServiceIcon, getTechCategoryIcon } from '../utils/serviceIcons';
import { ScrollReveal, ScrollRevealItem } from '../components/common/ScrollReveal';
import { MobileSectionSkeletonWrapper } from '../components/common/MobileSectionSkeleton';

interface TechnologyPageProps {
  onNavigate: (route: PageRoute) => void;
  onStartProject: (serviceName?: string) => void;
}

export const TechnologyPage: React.FC<TechnologyPageProps> = ({
  onNavigate,
  onStartProject,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredCategories =
    activeCategory === 'all'
      ? technologyData
      : technologyData.filter((c) => c.id === activeCategory);

  return (
    <div className="w-full">
      {/* Reusable PageHero */}
      <PageHero
        breadcrumbItems={[{ label: 'Technology Stack' }]}
        onNavigate={onNavigate}
        kicker="DISCIPLINED TOOLCHAIN"
        category="Tech Stack"
        title="The Right Tools for the Right Solution"
        tagline="We select frameworks, databases, and runtimes built for durability and sub-second performance."
        description="We choose frameworks, databases, cloud runtimes, and models that emphasize durability, developer ergonomics, security, and sub-second performance without unnecessary vendor lock-in."
        primaryCtaText="Request Architecture Audit"
        onPrimaryCta={() => onStartProject('IT Consulting & Modernization')}
        secondaryCtaText="Explore All Services"
        onSecondaryCta={() => onNavigate('/services')}
        slug="technology"
      />

      {/* Categories Stack Section */}
      <MobileSectionSkeletonWrapper variant="cards-grid" sectionIndex={0} cardCount={3}>
      <section className="py-10 sm:py-20 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-xl max-w-3xl shadow-2xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`min-h-[44px] min-w-[44px] md:min-h-[38px] md:min-w-0 px-3.5 py-2 text-xs sm:text-[13px] font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#1E3A8A] hover:bg-[#F5F8FC]'
              }`}
            >
              All Disciplines
            </button>
            {technologyData.map((cat) => {
              const CatIcon = getTechCategoryIcon(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`min-h-[44px] min-w-[44px] md:min-h-[38px] md:min-w-0 px-3.5 py-2 text-xs sm:text-[13px] font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? 'bg-[#1E3A8A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#1E3A8A] hover:bg-[#F5F8FC]'
                  }`}
                >
                  <CatIcon className="w-3.5 h-3.5" />
                  <span>{cat.category}</span>
                </button>
              );
            })}
          </div>

          {filteredCategories.map((group, groupIdx) => {
            const groupColor = getCardColorToken(groupIdx);
            const CatHeaderIcon = getTechCategoryIcon(group.id);

            return (
              <div
                key={group.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-8 shadow-sm space-y-4 sm:space-y-6"
              >
                <div>
                  <div className={`text-xs font-mono font-bold ${groupColor.accentText} uppercase tracking-wider mb-1 flex items-center gap-2`}>
                    <CatHeaderIcon className="w-4 h-4" />
                    <span>PRACTICE ECOSYSTEM // {group.category.toUpperCase()}</span>
                  </div>
                  <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-2xl font-bold text-[#1E3A8A]">{group.category}</h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {group.description}
                  </p>
                </div>

                <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-1 sm:pt-2" staggerChildren={0.06}>
                  {group.items.map((item, idx) => {
                    const itemColor = getCardColorToken(idx);
                    const ItemIcon = getServiceIcon(item.name);

                    return (
                      <ScrollRevealItem key={idx} className="h-full">
                        <div
                          className={`h-full ${itemColor.cardBg} ${itemColor.cardBorder} border rounded-xl p-4 sm:p-5 hover:border-slate-300 transition-all flex flex-col justify-between shadow-2xs interactive-card-lift group`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                              <div className="flex items-center gap-2 sm:gap-2.5">
                                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${itemColor.iconBg} text-white flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform`}>
                                  <ItemIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <h3 className="text-sm sm:text-base font-bold text-slate-900">{item.name}</h3>
                              </div>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${itemColor.badgeBg} ${itemColor.badgeText} border ${itemColor.badgeBorder}`}>
                                {item.level}
                              </span>
                            </div>
                            <div className={`text-xs font-semibold ${itemColor.accentText} mb-1.5 sm:mb-2 font-mono`}>
                              {item.role}
                            </div>
                            <p className="text-[13px] sm:text-sm text-slate-700 leading-relaxed line-clamp-2 sm:line-clamp-none">{item.description}</p>
                          </div>
                        </div>
                      </ScrollRevealItem>
                    );
                  })}
                </ScrollReveal>
              </div>
            );
          })}
        </div>
      </section>
      </MobileSectionSkeletonWrapper>

      {/* Call to Action Banner */}
      <MobileSectionSkeletonWrapper variant="split-detail" sectionIndex={1}>
      <section className="py-10 sm:py-20 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#EEF4FF] via-[#F5F9FF] to-[#ECFEFF] border border-[#DBEAFE] rounded-2xl p-5 sm:p-12 text-center space-y-3 sm:space-y-4 shadow-[0_8px_30px_rgba(37,99,235,0.08)]">
            <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-3xl font-bold tracking-[-0.015em] text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)]">
              Have an existing stack that needs modernization?
            </h2>
            <p className="text-[13.5px] sm:text-base text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
              We review existing codebases and plan phased migrations with zero downtime and guaranteed business continuity.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onStartProject('IT Consulting & Modernization')}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white font-semibold text-sm shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <span>Request Stack Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
      </MobileSectionSkeletonWrapper>
    </div>
  );
};
