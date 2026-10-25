import React, { useState } from 'react';
import { ArrowRight, Search, Sparkles, Code2, Cpu, Cloud, TrendingUp, ChevronRight, Layers, Bot, ShieldCheck } from 'lucide-react';
import { PageRoute } from '../types';
import { PageHero } from '../components/common/PageHero';
import { servicesData } from '../data/servicesData';
import { getCardColorToken } from '../utils/cardColorTokens';
import { getServiceIcon } from '../utils/serviceIcons';
import { ServiceCardThumbnail } from '../components/common/ServiceVisualMockups';
import { ScrollReveal, ScrollRevealItem } from '../components/common/ScrollReveal';
import { MobileSectionSkeletonWrapper } from '../components/common/MobileSectionSkeleton';

interface ServicesDirectoryPageProps {
  onNavigate: (route: PageRoute) => void;
  onStartProject: (serviceName?: string) => void;
}

export const ServicesDirectoryPage: React.FC<ServicesDirectoryPageProps> = ({
  onNavigate,
  onStartProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Experiences', 'Software', 'AI & Data', 'Cloud & Security', 'Growth & Advisory'];

  const filteredServices = servicesData.filter((srv) => {
    const matchesCat = selectedCategory === 'All' || srv.category === selectedCategory;
    const matchesSearch =
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full">
      {/* ========================================================================= */}
      {/* BESPOKE SERVICES HERO: PageHero with Light Capability Matrix              */}
      {/* ========================================================================= */}
      <PageHero
        breadcrumbItems={[{ label: 'Services Directory' }]}
        onNavigate={onNavigate}
        kicker="18 SPECIALIZED PRACTICES"
        category="Engineering Directory"
        title="Enterprise Engineering Services"
        tagline="From modern web experiences to practical artificial intelligence and multi-cloud resilience."
        description="Explore our specialized engineering disciplines spanning modern web experiences, custom business software, practical artificial intelligence, cloud DevOps, autonomous robotics, and digital growth."
        primaryCtaText="Discuss Your Project Requirements"
        onPrimaryCta={() => onStartProject()}
        secondaryCtaText="Explore Solutions Matrix"
        onSecondaryCta={() => onNavigate('/solutions')}
        slug="services"
        customVisual={
          <div className="relative w-full max-w-md mx-auto aspect-square bg-white rounded-2xl border border-slate-200 shadow-xl p-6 flex flex-col justify-between text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1266E8]" />
                <span className="text-slate-900 font-bold">CAPABILITY_MATRIX</span>
              </div>
              <span className="text-[#1266E8] font-bold bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                18 DISCIPLINES
              </span>
            </div>

            {/* 4 Quadrants Grid with Coordinated Tinted Colors */}
            <div className="grid grid-cols-2 gap-3 my-auto py-2">
              <div className="p-3 bg-[#EAF3FF] rounded-xl border border-blue-200 space-y-1">
                <div className="text-[10px] font-mono text-[#1266E8] font-bold">EXPERIENCES</div>
                <div className="text-xs font-bold text-slate-900">Web &amp; E-Commerce</div>
                <div className="text-[10px] text-slate-600">Next.js · Headless · UI/UX</div>
              </div>

              <div className="p-3 bg-[#E4FAFF] rounded-xl border border-cyan-200 space-y-1">
                <div className="text-[10px] font-mono text-[#0284C7] font-bold">INTELLIGENCE</div>
                <div className="text-xs font-bold text-slate-900">AI &amp; Machine Learning</div>
                <div className="text-[10px] text-slate-600">Private RAG · pgvector</div>
              </div>

              <div className="p-3 bg-[#F0EAFF] rounded-xl border border-violet-200 space-y-1">
                <div className="text-[10px] font-mono text-[#7C3AED] font-bold">INFRASTRUCTURE</div>
                <div className="text-xs font-bold text-slate-900">Cloud &amp; DevOps</div>
                <div className="text-[10px] text-slate-600">AWS · Azure · K8s Pods</div>
              </div>

              <div className="p-3 bg-[#E1F8F2] rounded-xl border border-teal-200 space-y-1">
                <div className="text-[10px] font-mono text-[#0D9488] font-bold">HARDWARE &amp; IOT</div>
                <div className="text-xs font-bold text-slate-900">Robotics &amp; Edge</div>
                <div className="text-[10px] text-slate-600">ROS2 · SLAM · Sensors</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>ZERO VENDOR LOCK-IN</span>
              <span className="text-[#1266E8] font-bold">PRODUCTION VERIFIED</span>
            </div>
          </div>
        }
      />

      {/* Services Grid Section */}
      <MobileSectionSkeletonWrapper variant="cards-grid" sectionIndex={0} cardCount={3}>
      <section className="py-10 sm:py-20 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Category Filter Bar */}
          <div className="mb-6 sm:mb-12 pb-5 sm:pb-8 border-b border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search practices or technologies (e.g. Next.js, RAG, AWS, ROS2)..."
                className="w-full min-h-[42px] pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#2563EB] focus:outline-hidden bg-white shadow-2xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-xl shadow-2xs w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[44px] min-w-[44px] md:min-h-[38px] md:min-w-0 px-3.5 py-2 text-xs sm:text-[13px] font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
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

          {filteredServices.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <p className="text-slate-600 text-sm">No services matched your query "{searchQuery}".</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-3 min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-3 text-xs font-semibold text-[#2563EB] underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8" staggerChildren={0.08}>
              {filteredServices.map((service, idx) => {
                // Deterministic color assignment cycling through 8 distinct palettes
                const color = getCardColorToken(idx);
                const ServiceIcon = getServiceIcon(service.slug);

                return (
                  <ScrollRevealItem key={service.id} className="h-full">
                    <div
                      onClick={() => onNavigate(`/services/${service.slug}` as PageRoute)}
                      className={`${color.cardBg} ${color.cardBorder} h-full border rounded-2xl p-4 sm:p-7 flex flex-col justify-between ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200 cursor-pointer group shadow-xs interactive-card-lift`}
                    >
                      <div>
                        {/* Visual Service Thumbnail Preview */}
                        <ServiceCardThumbnail slug={service.slug} category={service.category} className="mb-3 sm:mb-4" />

                        {/* Top Category Badge & Icon */}
                        <div className="flex items-center justify-between text-xs mb-3 sm:mb-4">
                          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}>
                            {service.category.toUpperCase()}
                          </span>
                          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${color.iconBg} text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}>
                            <ServiceIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                          </div>
                        </div>

                        <h2 className="text-lg sm:text-xl font-bold text-[#1E3A8A] group-hover:text-[#2563EB] transition-colors mb-2 sm:mb-2.5 flex items-center justify-between">
                          <span>{service.title}</span>
                          <span className={`w-2 h-2 rounded-full ${color.dotBg} shrink-0 opacity-80 group-hover:scale-125 transition-transform`} />
                        </h2>

                        <p className="text-[13px] sm:text-sm text-slate-700 leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                          {service.summary}
                        </p>

                        {/* Capabilities Bullet List */}
                        <div className="space-y-1.5 mb-3.5 sm:mb-5 text-xs">
                          <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">
                            Key Capabilities:
                          </div>
                          {service.capabilities.slice(0, 3).map((cap, i) => (
                            <div
                              key={i}
                              className={`${i === 2 ? 'hidden sm:flex' : 'flex'} items-center gap-2 text-slate-700 text-xs sm:text-[13px]`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${color.dotBg} shrink-0`} />
                              <span className="line-clamp-1">{cap.title}</span>
                            </div>
                          ))}
                        </div>

                        {/* Technology Chips */}
                        <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
                          {service.technologies.slice(0, 4).map((tech, i) => (
                            <span
                              key={i}
                              className={`${i === 3 ? 'hidden sm:inline-block' : 'inline-block'} px-2.5 py-0.5 text-[11px] font-mono bg-white/90 text-slate-700 rounded-md border border-slate-200/90`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom CTA Action Strip */}
                      <div className="pt-3 sm:pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold">
                        <span className={`${color.accentText} flex items-center gap-1.5 group-hover:underline`}>
                          Explore Service Architecture
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartProject(service.title);
                          }}
                          className="min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 inline-flex items-center justify-center px-2 md:px-0 text-[11px] font-mono text-slate-500 hover:text-slate-900 cursor-pointer"
                        >
                          Quick Brief
                        </button>
                      </div>
                    </div>
                  </ScrollRevealItem>
                );
              })}
            </ScrollReveal>
          )}
        </div>
      </section>
      </MobileSectionSkeletonWrapper>
    </div>
  );
};
