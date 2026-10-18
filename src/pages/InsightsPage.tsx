import React, { useState } from 'react';
import { ArrowRight, Search, BookOpen, Clock, Tag, Sparkles } from 'lucide-react';
import { PageRoute } from '../types';
import { PageHero } from '../components/common/PageHero';
import { insightsData } from '../data/insightsData';
import { getCardColorToken } from '../utils/cardColorTokens';
import { getServiceIcon } from '../utils/serviceIcons';

interface InsightsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'AI & Data', 'Cloud & DevOps', 'Web Engineering'];

  const filteredArticles = insightsData.filter((art) => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full">
      {/* Reusable PageHero */}
      <PageHero
        breadcrumbItems={[{ label: 'Insights & Articles' }]}
        onNavigate={onNavigate}
        kicker="ENGINEERING FIELD NOTES"
        category="Knowledge Hub"
        title="Ideas, Knowledge & Practical Engineering"
        tagline="In-depth architectural breakdowns, performance benchmarks, and lessons learned."
        description="Explore technical breakdowns, performance engineering studies, and practical lessons learned building modern software systems, written by our senior engineering team."
        primaryCtaText="Explore Technical Practices"
        onPrimaryCta={() => onNavigate('/services')}
        secondaryCtaText="Schedule Architectural Consultation"
        onSecondaryCta={() => onNavigate('/contact')}
        slug="insights"
      />

      {/* Article Grid Section */}
      <section className="py-20 bg-[#F4F7FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Search & Categories Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-2 border-b border-slate-200">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title or keyword..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#1266E8] focus:outline-hidden bg-white shadow-2xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs w-full md:w-auto">
              {categories.map((cat) => {
                const CatIcon = cat === 'All' ? Sparkles : getServiceIcon(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CatIcon className="w-3.5 h-3.5" />
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredArticles.map((art, idx) => {
              const color = getCardColorToken(idx);
              const ArticleIcon = getServiceIcon(art.category);

              return (
                <article
                  key={art.slug}
                  onClick={() => onNavigate(`/insights/${art.slug}` as PageRoute)}
                  className={`${color.cardBg} ${color.cardBorder} border rounded-2xl p-7 flex flex-col justify-between ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200 cursor-pointer group shadow-2xs interactive-card-lift`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold px-2.5 py-0.5 rounded-md text-[11px] ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}>
                          {art.category}
                        </span>
                        <span className="text-slate-400" aria-hidden="true">·</span>
                        <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {art.readTime}
                        </span>
                      </div>
                      <div className={`w-8 h-8 rounded-lg ${color.iconBg} text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}>
                        <ArticleIcon className="w-4 h-4" />
                      </div>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-slate-950 transition-colors leading-snug mb-3">
                      {art.title}
                    </h2>

                    <p className="text-xs text-slate-700 leading-relaxed mb-6 line-clamp-4">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono text-[11px]">{art.publishedDate}</span>
                    <span className={`${color.accentText} font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform`}>
                      Read Article <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
