import React, { useState } from 'react';
import { ArrowRight, Search, BookOpen, Clock, Tag, Sparkles } from 'lucide-react';
import { PageRoute } from '../types';
import { PageHero } from '../components/common/PageHero';
import { insightsData } from '../data/insightsData';
import { getCardColorToken } from '../utils/cardColorTokens';
import { getServiceIcon } from '../utils/serviceIcons';
import { ScrollReveal, ScrollRevealItem } from '../components/common/ScrollReveal';
import { ArticleGraphic } from '../components/common/ServiceVisualMockups';

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
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Search & Categories Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title or keyword..."
                className="w-full min-h-[42px] pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#2563EB] focus:outline-hidden bg-white shadow-2xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-xl shadow-2xs w-full md:w-auto">
              {categories.map((cat) => {
                const CatIcon = cat === 'All' ? Sparkles : getServiceIcon(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`min-h-[38px] px-3.5 py-2 text-xs sm:text-[13px] font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      selectedCategory === cat
                        ? 'bg-[#1E3A8A] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#1E3A8A] hover:bg-[#F5F8FC]'
                    }`}
                  >
                    <CatIcon className="w-3.5 h-3.5" />
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured Article Spotlight */}
          {filteredArticles.length > 0 && selectedCategory === 'All' && !searchQuery && (
            <div
              onClick={() => onNavigate(`/insights/${filteredArticles[0].slug}` as PageRoute)}
              className="bg-white border border-blue-200/90 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all cursor-pointer group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-6">
                <ArticleGraphic slug={filteredArticles[0].slug} className="shadow-sm" />
              </div>
              <div className="lg:col-span-6 space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 font-mono font-bold text-[11px]">
                    FEATURED ARCHITECTURE STUDY
                  </span>
                  <span className="font-mono font-bold px-2.5 py-0.5 rounded-md text-[11px] bg-slate-100 text-slate-700">
                    {filteredArticles[0].category}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {filteredArticles[0].readTime}
                  </span>
                </div>

                <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-bold text-[#1E3A8A] group-hover:text-[#2563EB] transition-colors leading-tight">
                  {filteredArticles[0].title}
                </h2>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {filteredArticles[0].excerpt}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-[10px]">
                      IT
                    </div>
                    <div>
                      <span className="font-bold text-[#1E3A8A]">{filteredArticles[0].author.name}</span>
                      <span className="text-slate-400 mx-1.5">·</span>
                      <span className="text-slate-500 font-mono text-[11px]">{filteredArticles[0].publishedDate}</span>
                    </div>
                  </div>
                  <span className="text-[#2563EB] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Featured Study <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          )}

          <ScrollReveal className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerChildren={0.12}>
            {filteredArticles.map((art, idx) => {
              const color = getCardColorToken(idx);
              const ArticleIcon = getServiceIcon(art.category);

              return (
                <ScrollRevealItem key={art.slug} className="h-full">
                  <article
                    onClick={() => onNavigate(`/insights/${art.slug}` as PageRoute)}
                    className={`${color.cardBg} ${color.cardBorder} h-full border rounded-2xl p-6 sm:p-7 flex flex-col justify-between ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200 cursor-pointer group shadow-2xs interactive-card-lift`}
                  >
                    <div>
                      {/* Editorial Article Graphic */}
                      <ArticleGraphic slug={art.slug} className="mb-4" />

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

                      <h2 className="text-lg font-bold text-[#1E3A8A] group-hover:text-[#2563EB] transition-colors leading-snug mb-3">
                        {art.title}
                      </h2>

                      <p className="text-[13.5px] sm:text-sm text-slate-700 leading-relaxed mb-6 line-clamp-4">
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
                </ScrollRevealItem>
              );
            })}
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};
