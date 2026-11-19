import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Cpu, Layers, Sparkles } from 'lucide-react';
import { PageRoute } from '../types';
import { PageHero } from '../components/common/PageHero';
import { technologyData } from '../data/technologyData';
import { getCardColorToken } from '../utils/cardColorTokens';
import { getServiceIcon, getTechCategoryIcon } from '../utils/serviceIcons';
import { ScrollReveal, ScrollRevealItem } from '../components/common/ScrollReveal';
import { MobileSectionSkeletonWrapper } from '../components/common/MobileSectionSkeleton';
import { AnimatedHeading } from '../components/common/AnimatedHeading';
import {
  ReactLogoBadge,
  TypeScriptLogoBadge,
  hasReactMention,
  hasTypeScriptMention,
} from '../components/common/TechLogoBadge';

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
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-[#1C35EA]/15 rounded-2xl max-w-3xl shadow-[0_8px_24px_-8px_rgba(20,32,90,0.08)]">
            <button
              onClick={() => setActiveCategory('all')}
              className={`min-h-[44px] min-w-[44px] lg:min-h-[38px] lg:min-w-0 px-3.5 py-2 text-xs sm:text-[13px] font-semibold rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-[#00B0F0] to-[#1C35EA] text-white shadow-[0_4px_12px_rgba(0,176,240,0.3)]'
                  : 'text-[#14205A] hover:text-[#1C35EA] hover:bg-[#F4F8FF]'
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
                  className={`min-h-[44px] min-w-[44px] lg:min-h-[38px] lg:min-w-0 px-3.5 py-2 text-xs sm:text-[13px] font-semibold rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-[#00B0F0] to-[#1C35EA] text-white shadow-[0_4px_12px_rgba(0,176,240,0.3)]'
                      : 'text-[#14205A] hover:text-[#1C35EA] hover:bg-[#F4F8FF]'
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
                className="bg-gradient-to-br from-white via-[#F9FBFF] to-[#F2F7FF] border border-[#1C35EA]/15 rounded-[16px] p-4 sm:p-8 shadow-[0_10px_28px_-8px_rgba(20,32,90,0.08)] space-y-4 sm:space-y-6"
              >
                <div>
                  <div className={`text-xs font-mono font-bold ${groupColor.accentText} uppercase tracking-wider mb-1 flex items-center gap-2`}>
                    <CatHeaderIcon className="w-4 h-4" />
                    <span>PRACTICE ECOSYSTEM // {group.category.toUpperCase()}</span>
                  </div>
                  <AnimatedHeading as="h2" className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-2xl font-extrabold text-[#14205A]">{group.category}</AnimatedHeading>
                  <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {group.description}
                  </p>
                </div>

                <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-1 sm:pt-2" staggerChildren={0.06}>
                  {group.items.map((item, idx) => {
                    const itemColor = getCardColorToken(idx);
                    const ItemIcon = getServiceIcon(item.name);
                    const combinedText = `${item.name} ${item.role} ${item.description}`;
                    const mentionsReact = hasReactMention(combinedText);
                    const mentionsTS = hasTypeScriptMention(combinedText);

                    return (
                      <ScrollRevealItem key={idx} className="h-full">
                        <div
                          className={`h-full ${itemColor.cardBg} ${itemColor.cardBorder} ${itemColor.cardHoverBorder} border rounded-[16px] p-4 sm:p-5 transition-all flex flex-col justify-between interactive-card-lift group`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                                {hasReactMention(item.name) && !hasTypeScriptMention(item.name) ? (
                                  <ReactLogoBadge size={24} />
                                ) : hasTypeScriptMention(item.name) && !hasReactMention(item.name) ? (
                                  <TypeScriptLogoBadge size={24} />
                                ) : (
                                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${itemColor.iconBg} text-white flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform shrink-0`}>
                                    <ItemIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                  </div>
                                )}
                                <h3 className="text-sm sm:text-base font-bold text-[#14205A] truncate">{item.name}</h3>
                                {(mentionsReact || mentionsTS) && (
                                  <span className="inline-flex items-center gap-1 shrink-0">
                                    {mentionsReact && <ReactLogoBadge size={20} />}
                                    {mentionsTS && <TypeScriptLogoBadge size={20} />}
                                  </span>
                                )}
                              </div>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold shrink-0 ${itemColor.badgeBg} ${itemColor.badgeText} border ${itemColor.badgeBorder}`}>
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
          <div className="card-sheen bg-gradient-to-r from-[#EEF4FF] via-[#F5F9FF] to-[#E8F8FF] border border-[#00B0F0]/30 rounded-[16px] p-5 sm:p-12 text-center space-y-3 sm:space-y-4 shadow-[0_10px_28px_-8px_rgba(20,32,90,0.08)]">
            <AnimatedHeading as="h2" align="center" className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-3xl font-extrabold tracking-[-0.015em] text-[#14205A] drop-shadow-[0_2px_12px_rgba(0,176,240,0.16)]">
              Have an existing stack that needs modernization?
            </AnimatedHeading>
            <p className="text-[13.5px] sm:text-base text-slate-700 font-medium max-w-xl mx-auto leading-relaxed">
              We review existing codebases and plan phased migrations with zero downtime and guaranteed business continuity.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onStartProject('IT Consulting & Modernization')}
                className="btn-sheen inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-[#00B0F0] to-[#1C35EA] text-white font-semibold text-sm shadow-[0_8px_20px_-4px_rgba(28,53,234,0.34)] hover:shadow-[0_12px_26px_-4px_rgba(0,176,240,0.45)] hover:-translate-y-0.5 hover:brightness-110 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <span className="relative z-10">Request Stack Audit</span>
                <ArrowRight className="relative z-10 w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
      </MobileSectionSkeletonWrapper>
    </div>
  );
};
