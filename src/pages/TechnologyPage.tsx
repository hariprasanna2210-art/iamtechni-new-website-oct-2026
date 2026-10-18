import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Cpu, Layers, Sparkles } from 'lucide-react';
import { PageRoute } from '../types';
import { PageHero } from '../components/common/PageHero';
import { technologyData } from '../data/technologyData';
import { getCardColorToken } from '../utils/cardColorTokens';
import { getServiceIcon, getTechCategoryIcon } from '../utils/serviceIcons';

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
      <section className="py-20 bg-[#F4F7FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl max-w-2xl shadow-2xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
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
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
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
                className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6"
              >
                <div>
                  <div className={`text-xs font-mono font-bold ${groupColor.accentText} uppercase tracking-wider mb-1 flex items-center gap-2`}>
                    <CatHeaderIcon className="w-4 h-4" />
                    <span>PRACTICE ECOSYSTEM // {group.category.toUpperCase()}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{group.category}</h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    {group.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {group.items.map((item, idx) => {
                    const itemColor = getCardColorToken(idx);
                    const ItemIcon = getServiceIcon(item.name);

                    return (
                      <div
                        key={idx}
                        className={`${itemColor.cardBg} ${itemColor.cardBorder} border rounded-xl p-5 hover:border-slate-300 transition-all flex flex-col justify-between shadow-2xs interactive-card-lift group`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-lg ${itemColor.iconBg} text-white flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform`}>
                                <ItemIcon className="w-4 h-4" />
                              </div>
                              <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                            </div>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${itemColor.badgeBg} ${itemColor.badgeText} border ${itemColor.badgeBorder}`}>
                              {item.level}
                            </span>
                          </div>
                          <div className={`text-[11px] font-semibold ${itemColor.accentText} mb-2 font-mono`}>
                            {item.role}
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 bg-gradient-to-br from-[#1266E8] via-[#0B5CD5] to-[#5427D9] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Have an existing stack that needs modernization?</h2>
          <p className="text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
            We review existing codebases and plan phased migrations with zero downtime and guaranteed business continuity.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onStartProject('IT Consulting & Modernization')}
              className="px-8 py-3.5 text-xs font-bold text-[#1266E8] bg-white rounded-xl hover:bg-blue-50 transition-all shadow-md active:scale-98 cursor-pointer"
            >
              Request Stack Audit
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
