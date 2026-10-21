import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { PageRoute, ServiceItem } from '../../types';
import { servicesData } from '../../data/servicesData';
import { getServiceIcon } from '../../utils/serviceIcons';
import { getToolsForService } from '../../data/heroServiceTools';

export interface HomeServicesSectionProps {
  onNavigate: (route: PageRoute) => void;
  selectedServiceSlug?: string;
  onSelectServiceSlug?: (slug: string) => void;
}

// Canonical list of services generated dynamically from servicesData (first 13 primary unique services)
const CANONICAL_SERVICES: ServiceItem[] = servicesData.slice(0, 13);

export const HomeServicesSection: React.FC<HomeServicesSectionProps> = ({
  onNavigate,
  selectedServiceSlug,
  onSelectServiceSlug,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  // Swipe tracking for touch devices
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const tabsScrollRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  const totalServices = CANONICAL_SERVICES.length;
  const SLIDE_DURATION = 4000; // 4 seconds per slide as requested

  // Find service index by slug or id
  const findServiceIndexBySlug = useCallback((slugOrId: string): number => {
    const clean = (slugOrId || '').trim().toLowerCase();
    if (!clean) return -1;
    return CANONICAL_SERVICES.findIndex(
      (s) =>
        (s.slug && s.slug.toLowerCase() === clean) ||
        (s.id && s.id.toLowerCase() === clean)
    );
  }, []);

  // Go to specific index and scroll active tab into view
  const handleSelectService = useCallback(
    (index: number, updateUrlAndParent = false) => {
      const safeIndex = (index + totalServices) % totalServices;
      setCurrentIndex(safeIndex);
      setProgress(0);

      if (updateUrlAndParent) {
        const svc = CANONICAL_SERVICES[safeIndex];
        if (svc) {
          const slug = svc.slug || svc.id;
          onSelectServiceSlug?.(slug);
          if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', `#services/${slug}`);
          }
        }
      }
    },
    [totalServices, onSelectServiceSlug]
  );

  // Sync when selectedServiceSlug prop changes from HeroSection
  useEffect(() => {
    if (!selectedServiceSlug) return;
    const matchedIdx = findServiceIndexBySlug(selectedServiceSlug);
    if (matchedIdx !== -1) {
      setCurrentIndex(matchedIdx);
      setProgress(0);
    }
  }, [selectedServiceSlug, findServiceIndexBySlug]);

  // Listen for hero card selection custom event & URL hash (#services/<slug>)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const applySlugFromHash = (scrollIntoViewOnInitial = false) => {
      const hash = window.location.hash || '';
      if (hash.startsWith('#services/')) {
        const slug = decodeURIComponent(hash.replace('#services/', '').trim());
        const matchedIdx = findServiceIndexBySlug(slug);
        if (matchedIdx !== -1) {
          setCurrentIndex(matchedIdx);
          setProgress(0);
          onSelectServiceSlug?.(
            CANONICAL_SERVICES[matchedIdx].slug || CANONICAL_SERVICES[matchedIdx].id
          );
          if (scrollIntoViewOnInitial) {
            const el = document.getElementById('services');
            el?.scrollIntoView({
              behavior: prefersReducedMotion ? 'auto' : 'smooth',
              block: 'start',
            });
          }
        }
      }
    };

    applySlugFromHash(true);

    const handleCustomSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ slug?: string }>;
      const slug = customEvent.detail?.slug;
      if (slug) {
        const matchedIdx = findServiceIndexBySlug(slug);
        if (matchedIdx !== -1) {
          setCurrentIndex(matchedIdx);
          setProgress(0);
        }
      }
    };

    const handleHashChange = () => applySlugFromHash(false);

    window.addEventListener('iamtechni:select-service', handleCustomSelect);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('iamtechni:select-service', handleCustomSelect);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [findServiceIndexBySlug, onSelectServiceSlug, prefersReducedMotion]);

  const handlePrev = useCallback(() => {
    handleSelectService(currentIndex - 1, true);
  }, [currentIndex, handleSelectService]);

  const handleNext = useCallback(() => {
    handleSelectService(currentIndex + 1, true);
  }, [currentIndex, handleSelectService]);

  // Keep active tab smoothly scrolled into center on mobile/tablet
  useEffect(() => {
    if (activeTabRef.current && tabsScrollRef.current) {
      const container = tabsScrollRef.current;
      const tab = activeTabRef.current;
      const left = tab.offsetLeft - container.offsetWidth / 2 + tab.offsetWidth / 2;
      container.scrollTo({
        left: Math.max(0, left),
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  }, [currentIndex, prefersReducedMotion]);

  // Auto-play interval + progress bar animation (resets every 4 seconds)
  useEffect(() => {
    if (isHovered || prefersReducedMotion) return;

    const stepMs = 50;
    const progressIncrement = (stepMs / SLIDE_DURATION) * 100;

    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % totalServices);
          return 0;
        }
        return prev + progressIncrement;
      });
    }, stepMs);

    return () => window.clearInterval(interval);
  }, [isHovered, totalServices, prefersReducedMotion]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  return (
    <section
      id="services"
      aria-labelledby="services-section-title"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#FFFFFF] via-[#F8FBFF] to-[#FFFFFF] border-b border-slate-200/80 overflow-hidden scroll-mt-16"
    >
      <div id="services-stage" className="sr-only" aria-hidden="true" />
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 0%, rgba(8, 123, 250, 0.08) 0%, rgba(0, 199, 242, 0.04) 38%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===================================================================== */}
        {/* 1. SECTION HEADER                                                     */}
        {/* ===================================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5 sm:space-y-4 mb-9 sm:mb-11">
          {/* Small Eyebrow */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/90 border border-[#087BFA]/20 text-[#087BFA] text-[10px] sm:text-xs font-bold tracking-[0.10em] uppercase shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#087BFA]" />
            <span>WHAT WE DO</span>
          </div>

          {/* Title with Gradient Highlight */}
          <h2
            id="services-section-title"
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#071638] leading-[1.16]"
          >
            Services Built for Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#087BFA] via-[#00C7F2] to-[#174DEB]">
              Next Stage of Growth
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            End-to-end engineering, AI, cloud, and growth solutions, all under one roof.
          </p>
        </div>

        {/* ===================================================================== */}
        {/* 2. FILTER TABS (Row of Pill Tabs with layoutId Sliding Highlight)     */}
        {/* ===================================================================== */}
        <div className="relative w-full mb-8 sm:mb-10">
          <div
            ref={tabsScrollRef}
            role="tablist"
            aria-label="Filter service by category"
            className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto scrollbar-none py-2 px-1 max-w-full"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {CANONICAL_SERVICES.map((service, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={service.slug || service.id}
                  ref={isActive ? activeTabRef : null}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`service-card-${service.slug || service.id}`}
                  onClick={() => handleSelectService(index, true)}
                  className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#087BFA] ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-slate-600 hover:text-[#087BFA] bg-white/90 border border-slate-200/90 shadow-2xs hover:bg-white'
                  }`}
                >
                  {/* Sliding animated background pill via framer-motion layoutId */}
                  {isActive && (
                    <motion.span
                      layoutId="activeServiceTabPill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#087BFA] to-[#174DEB] shadow-[0_4px_14px_rgba(8,123,250,0.35)] z-0"
                      transition={{
                        type: 'spring',
                        bounce: 0.2,
                        duration: prefersReducedMotion ? 0 : 0.4,
                      }}
                    />
                  )}
                  <span className="relative z-10">{service.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. CARD CAROUSEL (3 on desktop, 2 on tablet, 1 on mobile)             */}
        {/* ===================================================================== */}
        <div
          className="relative w-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Card Viewport Container */}
          <div className="relative w-full overflow-hidden py-4 sm:py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
              {[-1, 0, 1].map((offset) => {
                const targetIndex =
                  (currentIndex + offset + totalServices) % totalServices;
                const service = CANONICAL_SERVICES[targetIndex];
                if (!service) return null;

                const isCenter = offset === 0;
                const ServiceIcon = getServiceIcon(service.slug || service.id);
                const tools = getToolsForService(service.slug || service.id).slice(0, 4);

                return (
                  <div
                    key={`${service.slug || service.id}-${offset}`}
                    className={`transition-all duration-300 ${
                      // Responsive columns:
                      // offset -1: hidden on mobile (< 768px), visible on tablet & desktop
                      // offset 0: always visible (active card)
                      // offset 1: hidden on mobile & tablet (< 1024px), visible on desktop
                      offset === -1
                        ? 'hidden md:block'
                        : offset === 1
                        ? 'hidden lg:block'
                        : 'block'
                    }`}
                  >
                    <motion.div
                      layout
                      initial={prefersReducedMotion ? {} : { opacity: 0.8, scale: 0.96 }}
                      animate={
                        prefersReducedMotion
                          ? {}
                          : {
                              opacity: isCenter ? 1 : 0.88,
                              scale: isCenter ? 1.025 : 0.98,
                            }
                      }
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className={`group relative h-full flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border transition-all duration-300 ${
                        isCenter
                          ? 'border-[#087BFA] shadow-[0_12px_32px_rgba(8,123,250,0.18)] ring-2 ring-[#087BFA]/20 -translate-y-1'
                          : 'border-slate-200/90 shadow-[0_4px_20px_rgba(7,22,56,0.05)] hover:border-[#087BFA]/50 hover:shadow-lg hover:-translate-y-1'
                      }`}
                    >
                      {/* Top Header Row: Icon + Badge */}
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-4">
                          {/* Gradient Rounded Square Icon */}
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#087BFA] via-[#00C7F2] to-[#174DEB] text-white flex items-center justify-center shrink-0 shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                            <ServiceIcon className="w-6 h-6" />
                          </div>

                          {/* Small Category / Tech Tag */}
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#087BFA] border border-[#087BFA]/20 shrink-0">
                            {service.category || 'Engineering'}
                          </span>
                        </div>

                        {/* Card Title */}
                        <h3 className="text-lg sm:text-xl font-bold text-[#071638] group-hover:text-[#087BFA] transition-colors leading-snug mb-2">
                          {service.title}
                        </h3>

                        {/* Description (max 3 lines) */}
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-5">
                          {service.summary || service.tagline}
                        </p>
                      </div>

                      {/* Card Bottom: Tools + Details Link */}
                      <div className="pt-4 border-t border-slate-100 space-y-4">
                        {/* 3-4 Tool Logos for this service */}
                        {tools.length > 0 && (
                          <div>
                            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                              Key Stack &amp; Tools
                            </div>
                            <div className="flex items-center flex-wrap gap-1.5">
                              {tools.map((tool) => {
                                const ToolIcon = tool.icon;
                                return (
                                  <div
                                    key={tool.name}
                                    title={tool.name}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] font-semibold text-slate-700 shadow-2xs group-hover:border-[#087BFA]/30 transition-colors"
                                  >
                                    <span style={{ color: tool.brandColor }}>
                                      <ToolIcon className="w-3.5 h-3.5" />
                                    </span>
                                    <span>{tool.name}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Details → Link */}
                        <button
                          type="button"
                          onClick={() =>
                            onNavigate(
                              `/services/${service.slug || service.id}` as PageRoute
                            )
                          }
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#087BFA] hover:text-[#174DEB] transition-colors group/link cursor-pointer pt-1"
                        >
                          <span>Explore Details</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                        </button>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =================================================================== */}
          {/* 4. CAROUSEL CONTROLS (Progress Bar, Dots, Prev/Next Arrows)         */}
          {/* =================================================================== */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            {/* Thin Progress Bar (fills over 4s slide duration) */}
            <div
              className="w-48 sm:w-64 h-1 bg-slate-100 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              aria-label="Carousel auto-advance progress"
            >
              <div
                className="h-full bg-gradient-to-r from-[#087BFA] to-[#00C7F2] transition-[width] duration-75 ease-linear rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Prev / Dots / Next Row */}
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              {/* Prev Button */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous service"
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#087BFA]/50 text-slate-700 hover:text-[#087BFA] shadow-xs flex items-center justify-center transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#087BFA]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Indicator Dots */}
              <div
                className="flex items-center gap-1.5"
                role="tablist"
                aria-label="Service carousel indicators"
              >
                {CANONICAL_SERVICES.map((service, index) => {
                  const isActive = index === currentIndex;
                  return (
                    <button
                      key={service.slug || service.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Go to ${service.title}`}
                      onClick={() => handleSelectService(index, true)}
                      className={`h-2 rounded-full transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#087BFA] ${
                        isActive
                          ? 'w-6 bg-[#087BFA]'
                          : 'w-2 bg-slate-200 hover:bg-slate-300'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next service"
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#087BFA]/50 text-slate-700 hover:text-[#087BFA] shadow-xs flex items-center justify-center transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#087BFA]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
