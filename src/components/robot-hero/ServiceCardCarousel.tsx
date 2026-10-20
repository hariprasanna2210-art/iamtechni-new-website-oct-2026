import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Globe,
  ShoppingBag,
  Code2,
  Smartphone,
  Cpu,
  BarChart3,
  Cloud,
  ShieldCheck,
  TrendingUp,
  Palette,
  Compass,
  GraduationCap,
  Bot,
  Play,
  Pause,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { PageRoute, ServiceItem } from '../../types';
import { servicesData } from '../../data/servicesData';

export interface ServiceCardCarouselProps {
  activeServiceSlug?: string;
  onSelectService: (service: ServiceItem) => void;
  onNavigate: (route: PageRoute) => void;
  isAutoPlaying?: boolean;
}

// Extract the 13 canonical services from servicesData
export const UNIQUE_SERVICES: ServiceItem[] = servicesData.slice(0, 13);

export const getServiceCategoryIcon = (category: string, id: string) => {
  const lowerId = id.toLowerCase();
  if (lowerId.includes('ai') || lowerId.includes('machine-learning') || lowerId.includes('generative')) {
    return <Cpu className="w-4 h-4" />;
  }
  if (lowerId.includes('robotics')) {
    return <Bot className="w-4 h-4" />;
  }
  if (lowerId.includes('data') || lowerId.includes('analytics')) {
    return <BarChart3 className="w-4 h-4" />;
  }
  if (lowerId.includes('cloud') || lowerId.includes('devops')) {
    return <Cloud className="w-4 h-4" />;
  }
  if (lowerId.includes('security') || lowerId.includes('cyber')) {
    return <ShieldCheck className="w-4 h-4" />;
  }
  if (lowerId.includes('mobile') || lowerId.includes('app')) {
    return <Smartphone className="w-4 h-4" />;
  }
  if (lowerId.includes('e-commerce') || lowerId.includes('ecommerce') || lowerId.includes('store')) {
    return <ShoppingBag className="w-4 h-4" />;
  }
  if (lowerId.includes('ui') || lowerId.includes('design')) {
    return <Palette className="w-4 h-4" />;
  }
  if (lowerId.includes('seo') || lowerId.includes('marketing')) {
    return <TrendingUp className="w-4 h-4" />;
  }
  if (lowerId.includes('consulting') || lowerId.includes('strategy')) {
    return <Compass className="w-4 h-4" />;
  }
  if (lowerId.includes('training') || lowerId.includes('skill')) {
    return <GraduationCap className="w-4 h-4" />;
  }
  if (lowerId.includes('software')) {
    return <Code2 className="w-4 h-4" />;
  }
  return <Globe className="w-4 h-4" />;
};

export const ServiceCardCarousel: React.FC<ServiceCardCarouselProps> = ({
  activeServiceSlug,
  onSelectService,
  onNavigate,
  isAutoPlaying = true,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Touch tracking for mobile swipe support
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const SLIDE_DURATION = 4000; // 4 seconds per slide as requested

  // Synchronize index when external activeServiceSlug changes
  useEffect(() => {
    if (!activeServiceSlug) return;
    const foundIdx = UNIQUE_SERVICES.findIndex(
      (s) =>
        s.slug === activeServiceSlug ||
        s.id === activeServiceSlug ||
        activeServiceSlug.includes(s.slug) ||
        s.slug.includes(activeServiceSlug)
    );
    if (foundIdx !== -1 && foundIdx !== currentIndex) {
      setDirection(foundIdx > currentIndex ? 1 : -1);
      setCurrentIndex(foundIdx);
      setProgress(0);
    }
  }, [activeServiceSlug, currentIndex]);

  const goToSlide = useCallback(
    (index: number, newDirection = 1) => {
      const nextIndex =
        (index + UNIQUE_SERVICES.length) % UNIQUE_SERVICES.length;
      setDirection(newDirection);
      setCurrentIndex(nextIndex);
      setProgress(0);
      onSelectService(UNIQUE_SERVICES[nextIndex]);
    },
    [onSelectService]
  );

  const handlePrev = useCallback(() => {
    goToSlide(currentIndex - 1, -1);
  }, [currentIndex, goToSlide]);

  const handleNext = useCallback(() => {
    goToSlide(currentIndex + 1, 1);
  }, [currentIndex, goToSlide]);

  // Auto-playing timer with progress tracking (pauses on hover)
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;

    const intervalTime = 50;
    const step = (intervalTime / SLIDE_DURATION) * 100;

    const timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => window.clearInterval(timer);
  }, [isAutoPlaying, isPaused, handleNext, SLIDE_DURATION]);

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
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > 45) {
      handleNext();
    } else if (distance < -45) {
      handlePrev();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const currentService = UNIQUE_SERVICES[currentIndex] || UNIQUE_SERVICES[0];

  const slideVariants = {
    enter: (dir: number) => ({
      x: prefersReducedMotion ? 0 : dir > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.35,
        ease: 'easeOut' as const,
      },
    },
    exit: (dir: number) => ({
      x: prefersReducedMotion ? 0 : dir > 0 ? -20 : 20,
      opacity: 0,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.25,
        ease: 'easeIn' as const,
      },
    }),
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="w-full relative group/carousel select-none"
    >
      {/* CARD CONTAINER */}
      <div className="w-full bg-white/95 rounded-2xl border border-blue-200/80 p-3.5 sm:p-4 shadow-[0_4px_24px_rgba(8,123,250,0.07)] backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(8,123,250,0.12)] hover:border-blue-300">
        {/* Animated Progress Bar along the top edge */}
        <div
          className="absolute top-0 left-0 right-0 h-1 bg-slate-100/80 overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="h-full bg-gradient-to-r from-[#087BFA] via-[#00C7F2] to-[#174DEB] transition-all ease-linear"
            style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
              transitionDuration: isPaused ? '0ms' : '50ms',
            }}
          />
        </div>

        {/* Carousel Slide Content */}
        <div className="min-h-[92px] sm:min-h-[100px] flex flex-col justify-between pt-1">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentService.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col space-y-1.5"
            >
              {/* Header Row: Icon, Title, Category Tag, Details link */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#087BFA] to-[#174DEB] text-white flex items-center justify-center shrink-0 shadow-xs">
                    {getServiceCategoryIcon(
                      currentService.category,
                      currentService.id
                    )}
                  </span>
                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                    <h3 className="text-sm sm:text-base font-bold text-[#071638] truncate">
                      {currentService.title}
                    </h3>
                    <span className="text-[11px] sm:text-xs text-[#087BFA] font-semibold shrink-0 bg-blue-50/90 px-2 py-0.5 rounded-full border border-blue-200/60">
                      {currentService.category}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onNavigate(`/services/${currentService.slug}` as PageRoute)
                  }
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#087BFA] hover:text-[#0052cc] transition-colors shrink-0 cursor-pointer group/link pl-1"
                  title={`View details for ${currentService.title}`}
                >
                  <span className="hidden xs:inline">Details</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </button>
              </div>

              {/* Tagline / Summary */}
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal line-clamp-2 pt-0.5">
                {currentService.tagline ||
                  currentService.summary.slice(0, 140) + '...'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Bottom Control Strip: Counter, Dots, Arrow buttons */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Slide Counter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-mono font-bold text-[#071638] tabular-nums">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-slate-400">/</span>
            <span className="text-[11px] font-mono text-slate-400 tabular-nums">
              {String(UNIQUE_SERVICES.length).padStart(2, '0')}
            </span>
            {isPaused && (
              <span className="ml-1 text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded">
                Paused
              </span>
            )}
          </div>

          {/* Dot Indicators */}
          <div
            className="flex items-center gap-1 shrink-0 overflow-hidden"
            role="tablist"
            aria-label="Service carousel slides"
          >
            {(() => {
              const total = UNIQUE_SERVICES.length;
              const maxDots = 7;
              let start = Math.max(0, currentIndex - Math.floor(maxDots / 2));
              let end = Math.min(total, start + maxDots);
              if (end - start < maxDots) {
                start = Math.max(0, end - maxDots);
              }
              return UNIQUE_SERVICES.slice(start, end).map((s, sliceIdx) => {
                const idx = start + sliceIdx;
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Go to slide ${idx + 1}: ${s.title}`}
                    onClick={() => goToSlide(idx, idx > currentIndex ? 1 : -1)}
                    className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'w-4.5 bg-[#087BFA]'
                        : 'w-1.5 bg-slate-200 hover:bg-[#00C7F2]'
                    }`}
                  />
                );
              });
            })()}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous service"
              className="p-1 rounded-md text-slate-500 hover:text-[#087BFA] hover:bg-blue-50 transition-colors cursor-pointer"
              title="Previous Service"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next service"
              className="p-1 rounded-md text-slate-500 hover:text-[#087BFA] hover:bg-blue-50 transition-colors cursor-pointer"
              title="Next Service"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
