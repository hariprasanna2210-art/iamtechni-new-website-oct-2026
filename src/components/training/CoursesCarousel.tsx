import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Laptop,
  MapPin,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CourseItem } from '../../types';
import { getCourseWhatsAppUrl } from '../../data/coursesData';

interface CourseCardTheme {
  name: string;
  primaryHex: string;
  secondaryHex: string;
  topBarGradient: string;
  topWashGradient: string;
  glowGradient: string;
  cardBorder: string;
  cardHoverBorder: string;
  cardHoverShadow: string;
  iconBadgeStyle: React.CSSProperties;
  pillBg: string;
  pillText: string;
  pillBorder: string;
  checkColor: string;
  chipBg: string;
  chipText: string;
  chipBorder: string;
  buttonBg: string;
  buttonHoverShadow: string;
}

const COURSE_CARD_THEMES: CourseCardTheme[] = [
  // 0: Brand Cyan (#00B0F0)
  {
    name: 'cyan',
    primaryHex: '#00B0F0',
    secondaryHex: '#0284C7',
    topBarGradient: 'linear-gradient(90deg, #00B0F0 0%, #0EA5E9 100%)',
    topWashGradient:
      'linear-gradient(135deg, rgba(0, 176, 240, 0.16) 0%, rgba(14, 165, 233, 0.06) 55%, rgba(255, 255, 255, 0) 100%)',
    glowGradient:
      'radial-gradient(circle at 85% 15%, rgba(0, 176, 240, 0.34), rgba(0, 176, 240, 0) 70%)',
    cardBorder: 'border-sky-200/85',
    cardHoverBorder: 'hover:border-[#00B0F0]',
    cardHoverShadow: 'hover:shadow-[0_18px_40px_-14px_rgba(0,176,240,0.32)]',
    iconBadgeStyle: {
      background: 'linear-gradient(135deg, #00B0F0 0%, #0284C7 100%)',
      boxShadow: '0 8px 18px -4px rgba(0, 176, 240, 0.45)',
    },
    pillBg: 'bg-[#E0F6FE]',
    pillText: 'text-[#0369A1]',
    pillBorder: 'border-[#7DD3FC]',
    checkColor: 'text-[#0284C7]',
    chipBg: 'bg-sky-50/90',
    chipText: 'text-[#0369A1]',
    chipBorder: 'border-sky-200/80',
    buttonBg: 'bg-[#0369A1] hover:bg-[#0284C7]',
    buttonHoverShadow: 'group-hover:shadow-[0_6px_20px_rgba(0,176,240,0.38)]',
  },
  // 1: Brand Blue (#1C35EA)
  {
    name: 'blue',
    primaryHex: '#1C35EA',
    secondaryHex: '#2563EB',
    topBarGradient: 'linear-gradient(90deg, #1C35EA 0%, #3B82F6 100%)',
    topWashGradient:
      'linear-gradient(135deg, rgba(28, 53, 234, 0.15) 0%, rgba(59, 130, 246, 0.06) 55%, rgba(255, 255, 255, 0) 100%)',
    glowGradient:
      'radial-gradient(circle at 85% 15%, rgba(28, 53, 234, 0.30), rgba(28, 53, 234, 0) 70%)',
    cardBorder: 'border-blue-200/85',
    cardHoverBorder: 'hover:border-[#1C35EA]',
    cardHoverShadow: 'hover:shadow-[0_18px_40px_-14px_rgba(28,53,234,0.30)]',
    iconBadgeStyle: {
      background: 'linear-gradient(135deg, #1C35EA 0%, #2563EB 100%)',
      boxShadow: '0 8px 18px -4px rgba(28, 53, 234, 0.42)',
    },
    pillBg: 'bg-[#EEF1FF]',
    pillText: 'text-[#1C35EA]',
    pillBorder: 'border-[#BAC4FF]',
    checkColor: 'text-[#1C35EA]',
    chipBg: 'bg-blue-50/90',
    chipText: 'text-[#1E40AF]',
    chipBorder: 'border-blue-200/80',
    buttonBg: 'bg-[#1C35EA] hover:bg-[#162BC2]',
    buttonHoverShadow: 'group-hover:shadow-[0_6px_20px_rgba(28,53,234,0.38)]',
  },
  // 2: Brand Purple (#4D19EA)
  {
    name: 'purple',
    primaryHex: '#4D19EA',
    secondaryHex: '#7C3AED',
    topBarGradient: 'linear-gradient(90deg, #4D19EA 0%, #8B5CF6 100%)',
    topWashGradient:
      'linear-gradient(135deg, rgba(77, 25, 234, 0.15) 0%, rgba(139, 92, 246, 0.06) 55%, rgba(255, 255, 255, 0) 100%)',
    glowGradient:
      'radial-gradient(circle at 85% 15%, rgba(77, 25, 234, 0.30), rgba(77, 25, 234, 0) 70%)',
    cardBorder: 'border-violet-200/85',
    cardHoverBorder: 'hover:border-[#4D19EA]',
    cardHoverShadow: 'hover:shadow-[0_18px_40px_-14px_rgba(77,25,234,0.30)]',
    iconBadgeStyle: {
      background: 'linear-gradient(135deg, #4D19EA 0%, #7C3AED 100%)',
      boxShadow: '0 8px 18px -4px rgba(77, 25, 234, 0.42)',
    },
    pillBg: 'bg-[#F2ECFF]',
    pillText: 'text-[#4D19EA]',
    pillBorder: 'border-[#C8B5FF]',
    checkColor: 'text-[#4D19EA]',
    chipBg: 'bg-violet-50/90',
    chipText: 'text-[#5B21B6]',
    chipBorder: 'border-violet-200/80',
    buttonBg: 'bg-[#4D19EA] hover:bg-[#3F13C4]',
    buttonHoverShadow: 'group-hover:shadow-[0_6px_20px_rgba(77,25,234,0.38)]',
  },
  // 3: Complementary Emerald Teal (#0D9488)
  {
    name: 'teal',
    primaryHex: '#0D9488',
    secondaryHex: '#0F766E',
    topBarGradient: 'linear-gradient(90deg, #0D9488 0%, #14B8A6 100%)',
    topWashGradient:
      'linear-gradient(135deg, rgba(13, 148, 136, 0.15) 0%, rgba(20, 184, 166, 0.06) 55%, rgba(255, 255, 255, 0) 100%)',
    glowGradient:
      'radial-gradient(circle at 85% 15%, rgba(13, 148, 136, 0.30), rgba(13, 148, 136, 0) 70%)',
    cardBorder: 'border-teal-200/85',
    cardHoverBorder: 'hover:border-[#0D9488]',
    cardHoverShadow: 'hover:shadow-[0_18px_40px_-14px_rgba(13,148,136,0.30)]',
    iconBadgeStyle: {
      background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
      boxShadow: '0 8px 18px -4px rgba(13, 148, 136, 0.42)',
    },
    pillBg: 'bg-[#E6FAF7]',
    pillText: 'text-[#0F766E]',
    pillBorder: 'border-[#99E2D8]',
    checkColor: 'text-[#0D9488]',
    chipBg: 'bg-teal-50/90',
    chipText: 'text-[#115E59]',
    chipBorder: 'border-teal-200/80',
    buttonBg: 'bg-[#0F766E] hover:bg-[#0D9488]',
    buttonHoverShadow: 'group-hover:shadow-[0_6px_20px_rgba(13,148,136,0.38)]',
  },
  // 4: Brand Navy (#14205A)
  {
    name: 'navy',
    primaryHex: '#14205A',
    secondaryHex: '#1E3A8A',
    topBarGradient: 'linear-gradient(90deg, #14205A 0%, #1E3A8A 100%)',
    topWashGradient:
      'linear-gradient(135deg, rgba(20, 32, 90, 0.15) 0%, rgba(30, 58, 138, 0.06) 55%, rgba(255, 255, 255, 0) 100%)',
    glowGradient:
      'radial-gradient(circle at 85% 15%, rgba(20, 32, 90, 0.28), rgba(20, 32, 90, 0) 70%)',
    cardBorder: 'border-indigo-200/85',
    cardHoverBorder: 'hover:border-[#14205A]',
    cardHoverShadow: 'hover:shadow-[0_18px_40px_-14px_rgba(20,32,90,0.30)]',
    iconBadgeStyle: {
      background: 'linear-gradient(135deg, #14205A 0%, #1E3A8A 100%)',
      boxShadow: '0 8px 18px -4px rgba(20, 32, 90, 0.42)',
    },
    pillBg: 'bg-[#ECEFFA]',
    pillText: 'text-[#14205A]',
    pillBorder: 'border-[#B8C2EA]',
    checkColor: 'text-[#14205A]',
    chipBg: 'bg-indigo-50/90',
    chipText: 'text-[#14205A]',
    chipBorder: 'border-indigo-200/80',
    buttonBg: 'bg-[#14205A] hover:bg-[#1E3A8A]',
    buttonHoverShadow: 'group-hover:shadow-[0_6px_20px_rgba(20,32,90,0.36)]',
  },
  // 5: Complementary Warm Amber (#D97706)
  {
    name: 'amber',
    primaryHex: '#D97706',
    secondaryHex: '#B45309',
    topBarGradient: 'linear-gradient(90deg, #D97706 0%, #F59E0B 100%)',
    topWashGradient:
      'linear-gradient(135deg, rgba(217, 119, 6, 0.15) 0%, rgba(245, 158, 11, 0.06) 55%, rgba(255, 255, 255, 0) 100%)',
    glowGradient:
      'radial-gradient(circle at 85% 15%, rgba(217, 119, 6, 0.28), rgba(217, 119, 6, 0) 70%)',
    cardBorder: 'border-amber-200/90',
    cardHoverBorder: 'hover:border-[#D97706]',
    cardHoverShadow: 'hover:shadow-[0_18px_40px_-14px_rgba(217,119,6,0.28)]',
    iconBadgeStyle: {
      background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
      boxShadow: '0 8px 18px -4px rgba(217, 119, 6, 0.40)',
    },
    pillBg: 'bg-[#FEF3C7]',
    pillText: 'text-[#92400E]',
    pillBorder: 'border-[#FCD34D]',
    checkColor: 'text-[#B45309]',
    chipBg: 'bg-amber-50/95',
    chipText: 'text-[#92400E]',
    chipBorder: 'border-amber-200/85',
    buttonBg: 'bg-[#B45309] hover:bg-[#92400E]',
    buttonHoverShadow: 'group-hover:shadow-[0_6px_20px_rgba(217,119,6,0.36)]',
  },
  // 6: Complementary Coral Rose (#E11D48)
  {
    name: 'rose',
    primaryHex: '#E11D48',
    secondaryHex: '#BE123C',
    topBarGradient: 'linear-gradient(90deg, #E11D48 0%, #FB7185 100%)',
    topWashGradient:
      'linear-gradient(135deg, rgba(225, 29, 72, 0.14) 0%, rgba(251, 113, 133, 0.06) 55%, rgba(255, 255, 255, 0) 100%)',
    glowGradient:
      'radial-gradient(circle at 85% 15%, rgba(225, 29, 72, 0.28), rgba(225, 29, 72, 0) 70%)',
    cardBorder: 'border-rose-200/90',
    cardHoverBorder: 'hover:border-[#E11D48]',
    cardHoverShadow: 'hover:shadow-[0_18px_40px_-14px_rgba(225,29,72,0.28)]',
    iconBadgeStyle: {
      background: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
      boxShadow: '0 8px 18px -4px rgba(225, 29, 72, 0.40)',
    },
    pillBg: 'bg-[#FFE4EA]',
    pillText: 'text-[#9F1239]',
    pillBorder: 'border-[#FDA4AF]',
    checkColor: 'text-[#BE123C]',
    chipBg: 'bg-rose-50/90',
    chipText: 'text-[#9F1239]',
    chipBorder: 'border-rose-200/80',
    buttonBg: 'bg-[#BE123C] hover:bg-[#9F1239]',
    buttonHoverShadow: 'group-hover:shadow-[0_6px_20px_rgba(225,29,72,0.36)]',
  },
];

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export interface CoursesCarouselProps {
  courses: CourseItem[];
  selectedCategory: string;
  focusedCourseId?: string;
  locationLinks: Record<string, { city: string; path: string; label: string }[]>;
  onEnquire: (courseTitle: string) => void;
  getCourseIconComponent: (iconName: string) => React.ComponentType<{ className?: string }>;
}

export const CoursesCarousel: React.FC<CoursesCarouselProps> = ({
  courses,
  selectedCategory,
  focusedCourseId,
  locationLinks,
  onEnquire,
  getCourseIconComponent,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);

  const [cardsPerView, setCardsPerView] = useState<number>(() => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  });

  const [viewportWidth, setViewportWidth] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Touch swipe tracking (mobile/tablet)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const getGapForCardsPerView = (count: number) => {
    if (count >= 3) return 24;
    if (count === 2) return 20;
    return 16;
  };

  const gap = getGapForCardsPerView(cardsPerView);
  const maxIndex = Math.max(0, courses.length - cardsPerView);

  // Responsive breakpoint listener + ResizeObserver for exact card pixel width
  useEffect(() => {
    const updateMetrics = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1280;
      const nextCards = w >= 1024 ? 3 : w >= 768 ? 2 : 1;
      setCardsPerView(nextCards);
      if (viewportRef.current) {
        setViewportWidth(viewportRef.current.clientWidth);
      }
    };

    updateMetrics();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && viewportRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateMetrics();
      });
      resizeObserver.observe(viewportRef.current);
    }

    window.addEventListener('resize', updateMetrics);
    return () => {
      window.removeEventListener('resize', updateMetrics);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  // Reset carousel to first card when category filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCategory]);

  // If deep-linked via /training/:slug, position the carousel so the target card is visible
  useEffect(() => {
    if (!focusedCourseId) return;
    const matchIndex = courses.findIndex((c) => c.id === focusedCourseId);
    if (matchIndex >= 0) {
      setActiveIndex(Math.min(matchIndex, maxIndex));
    }
  }, [focusedCourseId, courses, maxIndex]);

  // Clamp activeIndex if viewport resizes from 1 -> 3 cards
  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  const cardWidth =
    viewportWidth > 0 ? (viewportWidth - gap * (cardsPerView - 1)) / cardsPerView : undefined;
  const translateX = cardWidth !== undefined ? -(activeIndex * (cardWidth + gap)) : 0;

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Explore Our Courses"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Desktop / Tablet Side Arrow Buttons */}
      {maxIndex > 0 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeIndex === 0}
            aria-label="Previous courses"
            className="hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-white/95 border border-slate-200 text-[#14205A] shadow-md hover:shadow-lg hover:border-[#1C35EA]/50 hover:text-[#1C35EA] hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-35 disabled:pointer-events-none absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={activeIndex >= maxIndex}
            aria-label="Next courses"
            className="hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-white/95 border border-slate-200 text-[#14205A] shadow-md hover:shadow-lg hover:border-[#1C35EA]/50 hover:text-[#1C35EA] hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-35 disabled:pointer-events-none absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Horizontal Carousel Viewport */}
      <div
        ref={viewportRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="overflow-x-clip py-4 -my-4 touch-pan-y select-none sm:select-auto"
      >
        <motion.div
          className="flex items-stretch"
          style={{ gap: `${gap}px` }}
          animate={{ x: translateX }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 }
          }
        >
          {courses.map((course, idx) => {
            const theme = COURSE_CARD_THEMES[idx % COURSE_CARD_THEMES.length];
            const CourseIcon = getCourseIconComponent(course.iconName);
            const regional = locationLinks[course.id];

            return (
              <div
                key={course.id}
                id={`course-${course.id}`}
                style={
                  cardWidth !== undefined
                    ? { width: `${cardWidth}px`, minWidth: `${cardWidth}px` }
                    : { width: '100%', minWidth: '100%' }
                }
                className="shrink-0 flex"
              >
                <article
                  className={`group relative w-full h-full bg-white rounded-2xl border ${theme.cardBorder} ${theme.cardHoverBorder} ${theme.cardHoverShadow} shadow-xs overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                    shouldReduceMotion ? '' : 'hover:-translate-y-1.5'
                  }`}
                >
                  {/* Dashboard Card Top Accent Strip + Soft Gradient & Hover Glow Header */}
                  <div className="relative overflow-hidden">
                    {/* Top colour accent bar */}
                    <div
                      className="h-1.5 w-full"
                      style={{ background: theme.topBarGradient }}
                    />

                    {/* Soft gradient header area */}
                    <div
                      className="relative px-5 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-4"
                      style={{ background: theme.topWashGradient }}
                    >
                      {/* Hover-intensifying radial glow orb */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full opacity-55 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                        style={{ background: theme.glowGradient }}
                      />

                      {/* Icon badge + Category pill */}
                      <div className="relative flex items-center justify-between gap-3 mb-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-wide border ${theme.pillBg} ${theme.pillText} ${theme.pillBorder}`}
                        >
                          {course.category.toUpperCase()}
                        </span>

                        <div
                          className="w-11 h-11 rounded-xl text-white flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                          style={theme.iconBadgeStyle}
                        >
                          <CourseIcon className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Course Title & Short Description */}
                      <div className="relative">
                        <h3 className="text-lg sm:text-xl font-bold text-[#14205A] mb-1.5 leading-snug">
                          {course.title}
                        </h3>
                        <p className="text-[13px] sm:text-sm text-slate-600 leading-relaxed">
                          {course.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Body: Details Stat Chips, Highlights, Location Links & Actions */}
                  <div className="px-5 pb-5 pt-3 sm:px-6 sm:pb-6 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-4">
                      {/* Existing details as small stat chips with icons */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11.5px] font-medium ${theme.chipBg} ${theme.chipText} ${theme.chipBorder}`}
                        >
                          <Laptop className="w-3.5 h-3.5 shrink-0" />
                          <span>Mode: Live Online, Instructor-Led</span>
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11.5px] font-semibold ${theme.chipBg} ${theme.chipText} ${theme.chipBorder}`}
                        >
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>Batches Open</span>
                        </span>
                      </div>

                      {/* Key Curriculum Highlights */}
                      <div className="space-y-2 pt-3 border-t border-slate-100">
                        <div className="text-[11px] font-mono uppercase text-slate-500 font-bold tracking-wider">
                          Key Curriculum Highlights
                        </div>
                        <div className="space-y-1.5">
                          {course.highlights.map((hl, hIdx) => (
                            <div
                              key={hIdx}
                              className={`${hIdx >= 2 ? 'hidden sm:flex' : 'flex'} items-start gap-2 text-[13px] text-slate-700`}
                            >
                              <Check className={`w-3.5 h-3.5 ${theme.checkColor} shrink-0 mt-0.5`} />
                              <span className="leading-snug">{hl}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-1">
                      {/* Matching Regional Location Pages */}
                      {regional && regional.length > 0 && (
                        <div className="pt-2.5 border-t border-slate-100">
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1.5">
                            <span className="font-bold text-slate-700 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#1C35EA]" /> Location Pages:
                            </span>
                            <Link to="/locations" className="text-[#1C35EA] hover:underline">
                              All locations →
                            </Link>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {regional.map((loc) => (
                              <Link
                                key={loc.path}
                                to={loc.path}
                                className="text-[11.5px] font-medium px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 hover:border-[#1C35EA] hover:text-[#1C35EA] text-slate-700 transition-colors"
                              >
                                {loc.city}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer Action Buttons */}
                      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => onEnquire(course.title)}
                          className={`group/btn w-full py-2.5 px-3 min-h-[44px] min-w-[44px] ${theme.buttonBg} ${theme.buttonHoverShadow} text-white rounded-xl text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-98 ${
                            shouldReduceMotion ? '' : 'group-hover:-translate-y-0.5'
                          }`}
                        >
                          <span>Enquire Now</span>
                          <ArrowRight
                            className={`w-3.5 h-3.5 transition-transform duration-300 ${
                              shouldReduceMotion ? '' : 'group-hover:translate-x-1'
                            }`}
                          />
                        </button>

                        <a
                          href={getCourseWhatsAppUrl(course.title)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-3 min-h-[44px] min-w-[44px] bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-98"
                          title={`Enquire about ${course.title} on WhatsApp`}
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom Controls: Left/Right Arrows (on mobile) + Dot Indicators */}
      {maxIndex > 0 && (
        <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeIndex === 0}
            aria-label="Previous courses"
            className="flex md:hidden items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-[#14205A] shadow-xs hover:border-[#1C35EA]/50 hover:text-[#1C35EA] active:scale-95 transition-all cursor-pointer disabled:opacity-35 disabled:pointer-events-none shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            className="flex flex-wrap items-center justify-center gap-1"
            role="tablist"
            aria-label="Course carousel slides"
          >
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => {
              const isActive = dotIdx === activeIndex;
              return (
                <button
                  key={dotIdx}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Show slide ${dotIdx + 1}`}
                  onClick={() => setActiveIndex(dotIdx)}
                  className="p-1.5 cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C35EA] rounded-full"
                >
                  <span
                    className={`block h-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-7 bg-[#1C35EA]'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={activeIndex >= maxIndex}
            aria-label="Next courses"
            className="flex md:hidden items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-[#14205A] shadow-xs hover:border-[#1C35EA]/50 hover:text-[#1C35EA] active:scale-95 transition-all cursor-pointer disabled:opacity-35 disabled:pointer-events-none shrink-0"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
