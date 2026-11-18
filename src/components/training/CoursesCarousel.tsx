import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Laptop,
  MapPin,
  Pause,
  Play,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CourseItem } from '../../types';
import { getCourseWhatsAppUrl } from '../../data/coursesData';
import { useSectionInView, useIsWindowScrolling } from '../../utils/useViewportActivity';

interface CourseCardTheme {
  name: string;
  topBarGradient: string;
  activeCardGradient: string;
  activeBorder: string;
  activeGlow: string;
  progressBarGradient: string;
  sideCardGradient: string;
  sideBorder: string;
  sideHoverBorder: string;
  iconBadgeStyle: React.CSSProperties;
  pillBg: string;
  pillText: string;
  pillBorder: string;
  checkColor: string;
  chipBg: string;
  chipText: string;
  chipBorder: string;
}

const COURSE_CARD_THEMES: CourseCardTheme[] = [
  // 0: Brand Cyan (#00B0F0)
  {
    name: 'cyan',
    topBarGradient: 'linear-gradient(90deg, #00B0F0 0%, #38BDF8 100%)',
    activeCardGradient: 'linear-gradient(135deg, #0D2B52 0%, #0369A1 55%, #0095D9 100%)',
    activeBorder: 'border-[#38BDF8]/45',
    activeGlow: 'rgba(0, 176, 240, 0.28)',
    progressBarGradient: 'linear-gradient(90deg, #38BDF8 0%, #00B0F0 50%, #BAE6FD 100%)',
    sideCardGradient: 'linear-gradient(135deg, #FFFFFF 0%, #F4FBFF 60%, #E6F7FE 100%)',
    sideBorder: 'border-sky-200/90',
    sideHoverBorder: 'hover:border-[#00B0F0]',
    iconBadgeStyle: {
      background: 'linear-gradient(135deg, #00B0F0 0%, #0284C7 100%)',
      boxShadow: '0 6px 14px -3px rgba(0, 176, 240, 0.42)',
    },
    pillBg: 'bg-[#E0F6FE]',
    pillText: 'text-[#0369A1]',
    pillBorder: 'border-[#7DD3FC]',
    checkColor: 'text-[#0284C7]',
    chipBg: 'bg-sky-50/95',
    chipText: 'text-[#0369A1]',
    chipBorder: 'border-sky-200/90',
  },
  // 1: Brand Blue (#1C35EA)
  {
    name: 'blue',
    topBarGradient: 'linear-gradient(90deg, #1C35EA 0%, #3B82F6 100%)',
    activeCardGradient: 'linear-gradient(135deg, #14205A 0%, #1E3A8A 48%, #1C35EA 100%)',
    activeBorder: 'border-[#60A5FA]/45',
    activeGlow: 'rgba(28, 53, 234, 0.28)',
    progressBarGradient: 'linear-gradient(90deg, #2563EB 0%, #06B6D4 55%, #93C5FD 100%)',
    sideCardGradient: 'linear-gradient(135deg, #FFFFFF 0%, #F7FAFF 60%, #EBF2FF 100%)',
    sideBorder: 'border-blue-200/90',
    sideHoverBorder: 'hover:border-[#1C35EA]',
    iconBadgeStyle: {
      background: 'linear-gradient(135deg, #1C35EA 0%, #2563EB 100%)',
      boxShadow: '0 6px 14px -3px rgba(28, 53, 234, 0.40)',
    },
    pillBg: 'bg-[#EEF1FF]',
    pillText: 'text-[#1C35EA]',
    pillBorder: 'border-[#BAC4FF]',
    checkColor: 'text-[#1C35EA]',
    chipBg: 'bg-blue-50/95',
    chipText: 'text-[#1E40AF]',
    chipBorder: 'border-blue-200/90',
  },
  // 2: Brand Purple (#4D19EA)
  {
    name: 'purple',
    topBarGradient: 'linear-gradient(90deg, #4D19EA 0%, #8B5CF6 100%)',
    activeCardGradient: 'linear-gradient(135deg, #1A1446 0%, #3B189F 52%, #5B21B6 100%)',
    activeBorder: 'border-[#A78BFA]/45',
    activeGlow: 'rgba(77, 25, 234, 0.28)',
    progressBarGradient: 'linear-gradient(90deg, #8B5CF6 0%, #38BDF8 55%, #DDD6FE 100%)',
    sideCardGradient: 'linear-gradient(135deg, #FFFFFF 0%, #F9F7FF 60%, #F0EBFF 100%)',
    sideBorder: 'border-violet-200/90',
    sideHoverBorder: 'hover:border-[#4D19EA]',
    iconBadgeStyle: {
      background: 'linear-gradient(135deg, #4D19EA 0%, #7C3AED 100%)',
      boxShadow: '0 6px 14px -3px rgba(77, 25, 234, 0.40)',
    },
    pillBg: 'bg-[#F2ECFF]',
    pillText: 'text-[#4D19EA]',
    pillBorder: 'border-[#C8B5FF]',
    checkColor: 'text-[#4D19EA]',
    chipBg: 'bg-violet-50/95',
    chipText: 'text-[#5B21B6]',
    chipBorder: 'border-violet-200/90',
  },
  // 3: Complementary Teal (#0D9488)
  {
    name: 'teal',
    topBarGradient: 'linear-gradient(90deg, #0D9488 0%, #14B8A6 100%)',
    activeCardGradient: 'linear-gradient(135deg, #0D2F3A 0%, #0F5C5B 52%, #0D9488 100%)',
    activeBorder: 'border-[#2DD4BF]/45',
    activeGlow: 'rgba(13, 148, 136, 0.28)',
    progressBarGradient: 'linear-gradient(90deg, #14B8A6 0%, #38BDF8 55%, #99F6E4 100%)',
    sideCardGradient: 'linear-gradient(135deg, #FFFFFF 0%, #F3FCF9 60%, #E4F8F2 100%)',
    sideBorder: 'border-teal-200/90',
    sideHoverBorder: 'hover:border-[#0D9488]',
    iconBadgeStyle: {
      background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
      boxShadow: '0 6px 14px -3px rgba(13, 148, 136, 0.40)',
    },
    pillBg: 'bg-[#E6FAF7]',
    pillText: 'text-[#0F766E]',
    pillBorder: 'border-[#99E2D8]',
    checkColor: 'text-[#0D9488]',
    chipBg: 'bg-teal-50/95',
    chipText: 'text-[#115E59]',
    chipBorder: 'border-teal-200/90',
  },
  // 4: Brand Navy (#14205A)
  {
    name: 'navy',
    topBarGradient: 'linear-gradient(90deg, #14205A 0%, #2563EB 100%)',
    activeCardGradient: 'linear-gradient(135deg, #0F172A 0%, #14205A 52%, #1E3A8A 100%)',
    activeBorder: 'border-[#93C5FD]/40',
    activeGlow: 'rgba(20, 32, 90, 0.30)',
    progressBarGradient: 'linear-gradient(90deg, #00B0F0 0%, #60A5FA 55%, #DBEAFE 100%)',
    sideCardGradient: 'linear-gradient(135deg, #FFFFFF 0%, #F5F7FC 60%, #E9EEF9 100%)',
    sideBorder: 'border-indigo-200/90',
    sideHoverBorder: 'hover:border-[#14205A]',
    iconBadgeStyle: {
      background: 'linear-gradient(135deg, #14205A 0%, #1E3A8A 100%)',
      boxShadow: '0 6px 14px -3px rgba(20, 32, 90, 0.40)',
    },
    pillBg: 'bg-[#ECEFFA]',
    pillText: 'text-[#14205A]',
    pillBorder: 'border-[#B8C2EA]',
    checkColor: 'text-[#14205A]',
    chipBg: 'bg-indigo-50/95',
    chipText: 'text-[#14205A]',
    chipBorder: 'border-indigo-200/90',
  },
  // 5: Complementary Amber (#D97706)
  {
    name: 'amber',
    topBarGradient: 'linear-gradient(90deg, #D97706 0%, #F59E0B 100%)',
    activeCardGradient: 'linear-gradient(135deg, #27170C 0%, #78350F 52%, #B45309 100%)',
    activeBorder: 'border-[#FBBF24]/45',
    activeGlow: 'rgba(217, 119, 6, 0.28)',
    progressBarGradient: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 55%, #FEF3C7 100%)',
    sideCardGradient: 'linear-gradient(135deg, #FFFFFF 0%, #FFFBF2 60%, #FEF3C7 100%)',
    sideBorder: 'border-amber-200/90',
    sideHoverBorder: 'hover:border-[#D97706]',
    iconBadgeStyle: {
      background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
      boxShadow: '0 6px 14px -3px rgba(217, 119, 6, 0.38)',
    },
    pillBg: 'bg-[#FEF3C7]',
    pillText: 'text-[#92400E]',
    pillBorder: 'border-[#FCD34D]',
    checkColor: 'text-[#B45309]',
    chipBg: 'bg-amber-50/95',
    chipText: 'text-[#92400E]',
    chipBorder: 'border-amber-200/90',
  },
  // 6: Complementary Coral Rose (#E11D48)
  {
    name: 'rose',
    topBarGradient: 'linear-gradient(90deg, #E11D48 0%, #FB7185 100%)',
    activeCardGradient: 'linear-gradient(135deg, #2E1025 0%, #881337 52%, #BE123C 100%)',
    activeBorder: 'border-[#FDA4AF]/45',
    activeGlow: 'rgba(225, 29, 72, 0.28)',
    progressBarGradient: 'linear-gradient(90deg, #FB7185 0%, #F43F5E 55%, #FFE4E6 100%)',
    sideCardGradient: 'linear-gradient(135deg, #FFFFFF 0%, #FFF7F9 60%, #FFE4EA 100%)',
    sideBorder: 'border-rose-200/90',
    sideHoverBorder: 'hover:border-[#E11D48]',
    iconBadgeStyle: {
      background: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
      boxShadow: '0 6px 14px -3px rgba(225, 29, 72, 0.38)',
    },
    pillBg: 'bg-[#FFE4EA]',
    pillText: 'text-[#9F1239]',
    pillBorder: 'border-[#FDA4AF]',
    checkColor: 'text-[#BE123C]',
    chipBg: 'bg-rose-50/95',
    chipText: 'text-[#9F1239]',
    chipBorder: 'border-rose-200/90',
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

const SLIDE_DURATION = 5000;

export const CoursesCarousel: React.FC<CoursesCarouselProps> = ({
  courses,
  selectedCategory,
  focusedCourseId,
  locationLinks,
  onEnquire,
  getCourseIconComponent,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const mobileViewportRef = useRef<HTMLDivElement>(null);

  const isSectionInView = useSectionInView(stageRef, '160px 0px', true);
  const isWindowScrolling = useIsWindowScrolling();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentIndexRef = useRef<number>(0);
  currentIndexRef.current = currentIndex;

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isTouching, setIsTouching] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isPausedByUser, setIsPausedByUser] = useState<boolean>(false);
  const [isArrowPaused, setIsArrowPaused] = useState<boolean>(false);
  const arrowPauseTimerRef = useRef<number | null>(null);
  const [isTabHidden, setIsTabHidden] = useState<boolean>(() =>
    typeof document !== 'undefined' ? document.hidden : false
  );

  const isTouchInteractionRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number | null>(null);
  const dragCurrentXRef = useRef<number | null>(null);
  const didDragMoveRef = useRef<boolean>(false);

  const mobileTouchStartRef = useRef<{ x: number; y: number } | null>(null);

  const totalItems = courses.length;

  const triggerArrowPause = useCallback(() => {
    setIsArrowPaused(true);
    if (arrowPauseTimerRef.current !== null) {
      window.clearTimeout(arrowPauseTimerRef.current);
    }
    arrowPauseTimerRef.current = window.setTimeout(() => {
      setIsArrowPaused(false);
      arrowPauseTimerRef.current = null;
    }, SLIDE_DURATION);
  }, []);

  useEffect(() => {
    return () => {
      if (arrowPauseTimerRef.current !== null) {
        window.clearTimeout(arrowPauseTimerRef.current);
      }
    };
  }, []);

  // Pause auto-slide when browser tab is hidden
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const onVisChange = () => setIsTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisChange);
    return () => document.removeEventListener('visibilitychange', onVisChange);
  }, []);

  // Reset to first card whenever category filter changes
  useEffect(() => {
    setCurrentIndex(0);
    currentIndexRef.current = 0;
  }, [selectedCategory]);

  // Clamp index if courses array shrinks
  useEffect(() => {
    if (totalItems > 0 && currentIndex >= totalItems) {
      setCurrentIndex(0);
    }
  }, [totalItems, currentIndex]);

  // If deep-linked via /training/:slug, focus that course card
  useEffect(() => {
    if (!focusedCourseId) return;
    const matchIdx = courses.findIndex((c) => c.id === focusedCourseId);
    if (matchIdx >= 0) {
      setCurrentIndex(matchIdx);
    }
  }, [focusedCourseId, courses]);

  const handlePrev = useCallback(() => {
    if (totalItems <= 1) return;
    triggerArrowPause();
    setCurrentIndex((prev) => ((prev - 1) % totalItems + totalItems) % totalItems);
  }, [totalItems, triggerArrowPause]);

  const handleNext = useCallback(() => {
    if (totalItems <= 1) return;
    triggerArrowPause();
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems, triggerArrowPause]);

  const isAutoSlideActive =
    isSectionInView &&
    !isWindowScrolling &&
    !isHovered &&
    !isTouching &&
    !isDragging &&
    !isPausedByUser &&
    !isArrowPaused &&
    !isTabHidden &&
    !prefersReducedMotion &&
    totalItems > 1;

  // 5-second auto-slide timer (loops back to first card at the end)
  useEffect(() => {
    if (!isAutoSlideActive) return;

    const timerId = window.setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, SLIDE_DURATION);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [currentIndex, isAutoSlideActive, totalItems]);

  // Desktop / tablet pointer drag handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.pointerType === 'touch') {
      isTouchInteractionRef.current = true;
      setIsTouching(true);
      setIsHovered(false);
    }
    dragStartXRef.current = e.clientX;
    dragCurrentXRef.current = e.clientX;
    didDragMoveRef.current = false;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragStartXRef.current === null) return;
    dragCurrentXRef.current = e.clientX;
    if (Math.abs(e.clientX - dragStartXRef.current) > 8) {
      didDragMoveRef.current = true;
    }
  };

  const finishDrag = useCallback(() => {
    if (dragStartXRef.current !== null && dragCurrentXRef.current !== null) {
      const diff = dragStartXRef.current - dragCurrentXRef.current;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
    dragStartXRef.current = null;
    dragCurrentXRef.current = null;
    setIsDragging(false);
    setIsTouching(false);
    window.setTimeout(() => {
      didDragMoveRef.current = false;
    }, 50);
  }, [handleNext, handlePrev]);

  // Mobile single-card touch swipe handlers
  const handleMobileTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    setIsTouching(true);
    mobileTouchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleMobileTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsTouching(false);
    if (!mobileTouchStartRef.current || e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - mobileTouchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - mobileTouchStartRef.current.y;
    mobileTouchStartRef.current = null;

    if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy)) {
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

  if (totalItems === 0) return null;

  const activeCourse = courses[currentIndex] || courses[0];

  // Determine desktop/tablet stage slot offsets (3 cards on desktop: [-1, 0, 1]; 2 on tablet: [0, 1])
  const desktopOffsets =
    totalItems >= 3
      ? [-1, 0, 1]
      : totalItems === 2
      ? [0, 1]
      : [0];

  // Mobile slides include a trailing clone of courses[0] so the next card always peeks at the right edge even on the last course
  const mobileSlides =
    totalItems > 1
      ? [
          ...courses.map((course, idx) => ({ course, realIdx: idx, key: `${course.id}-${idx}` })),
          { course: courses[0], realIdx: 0, key: `${courses[0].id}-peek-clone` },
        ]
      : courses.map((course, idx) => ({ course, realIdx: idx, key: `${course.id}-${idx}` }));

  return (
    <div
      ref={stageRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Explore Our Courses"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="relative w-full focus:outline-none"
    >
      {/* =================================================================== */}
      {/* MOBILE CAROUSEL (< 768px): 1 Centre Card + Next Card Peeking at Edge */}
      {/* =================================================================== */}
      <div className="md:hidden">
        <div className="relative px-2 sm:px-4 py-1">
          {totalItems > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous course"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/95 border border-[#DBEAFE] text-[#1E3A8A] hover:text-[#2563EB] active:scale-95 transition-transform flex items-center justify-center cursor-pointer after:content-[''] after:absolute after:-inset-[8px]"
                style={{ boxShadow: '0 4px 14px rgba(15,23,42,0.18)' }}
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.25]" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next course"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/95 border border-[#DBEAFE] text-[#1E3A8A] hover:text-[#2563EB] active:scale-95 transition-transform flex items-center justify-center cursor-pointer after:content-[''] after:absolute after:-inset-[8px]"
                style={{ boxShadow: '0 4px 14px rgba(15,23,42,0.18)' }}
              >
                <ChevronRight className="w-4 h-4 stroke-[2.25]" />
              </button>
            </>
          )}

          <div
            ref={mobileViewportRef}
            onTouchStart={handleMobileTouchStart}
            onTouchEnd={handleMobileTouchEnd}
            onTouchCancel={() => setIsTouching(false)}
            className="w-full overflow-hidden rounded-2xl touch-pan-y py-2 pl-2 pr-1"
          >
            <div
              className="flex items-stretch w-full min-h-[600px]"
              style={{
                transform: `translateX(-${currentIndex * 86}%)`,
                transition: prefersReducedMotion
                  ? 'none'
                  : 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {mobileSlides.map(({ course, realIdx, key }, slidePos) => {
                const theme = COURSE_CARD_THEMES[realIdx % COURSE_CARD_THEMES.length];
                const CourseIcon = getCourseIconComponent(course.iconName);
                const regional = locationLinks[course.id];
                const isActive = slidePos === currentIndex;
                const formattedNumber = String(realIdx + 1).padStart(2, '0');

                return (
                  <div
                    key={key}
                    onClick={() => {
                      if (!isActive) {
                        setCurrentIndex(realIdx);
                      }
                    }}
                    className={`w-[86%] shrink-0 pr-3 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive
                        ? 'scale-100 opacity-100 z-20'
                        : 'scale-[0.94] opacity-75 z-10 cursor-pointer'
                    }`}
                  >
                    <article
                      id={isActive ? `course-mobile-${course.id}` : undefined}
                      aria-hidden={!isActive}
                      className={`relative w-full h-full min-h-[590px] flex flex-col justify-between p-4 rounded-2xl overflow-hidden border transition-all duration-500 ${
                        isActive ? theme.activeBorder : `${theme.sideBorder}`
                      }`}
                      style={{
                        background: isActive ? theme.activeCardGradient : theme.sideCardGradient,
                        boxShadow: isActive
                          ? `0 18px 38px -8px rgba(15, 23, 42, 0.32), 0 0 28px 0 ${theme.activeGlow}`
                          : '0 8px 20px -6px rgba(30, 58, 138, 0.10)',
                      }}
                    >
                      {/* Top Progress Bar on Active Mobile Card or Subtle Top Gradient on Peeking Card */}
                      {isActive ? (
                        <div
                          aria-hidden="true"
                          className="absolute top-0 left-0 right-0 h-1 bg-white/15 overflow-hidden z-20"
                        >
                          {isAutoSlideActive && (
                            <div
                              key={`mobile-bar-${currentIndex}-${selectedCategory}`}
                              style={{
                                background: theme.progressBarGradient,
                                animationDuration: `${SLIDE_DURATION}ms`,
                              }}
                              className="h-full w-full animate-progress-scale"
                            />
                          )}
                        </div>
                      ) : (
                        <div
                          aria-hidden="true"
                          className="absolute top-0 left-0 right-0 h-1 z-20"
                          style={{ background: theme.topBarGradient }}
                        />
                      )}

                      {/* Decorative Radial Glow */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl"
                        style={{ background: theme.activeGlow }}
                      />

                      {/* Card Body */}
                      <div className="relative z-10 flex-1 flex flex-col">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          {isActive ? (
                            <div className="w-8 h-8 rounded-xl bg-white/15 text-white border border-white/25 flex items-center justify-center shrink-0 shadow-xs">
                              <CourseIcon className="w-4 h-4" />
                            </div>
                          ) : (
                            <div
                              className="w-8 h-8 rounded-xl text-white flex items-center justify-center shrink-0"
                              style={theme.iconBadgeStyle}
                            >
                              <CourseIcon className="w-4 h-4" />
                            </div>
                          )}

                          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide min-w-0">
                            <span
                              className={`font-mono tabular-nums ${
                                isActive ? 'text-white/85' : 'text-slate-500'
                              }`}
                            >
                              {formattedNumber}
                            </span>
                            <span
                              aria-hidden="true"
                              className={isActive ? 'text-white/55' : 'text-slate-300'}
                            >
                              ·
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase truncate max-w-[155px] border ${
                                isActive
                                  ? 'bg-white/15 border-white/25 text-white'
                                  : `${theme.pillBg} ${theme.pillText} ${theme.pillBorder}`
                              }`}
                            >
                              {course.category.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <h3
                          className={`!text-[20px] sm:!text-[22px] !leading-[1.25] font-bold mb-1 ${
                            isActive ? 'text-white' : 'text-[#14205A]'
                          }`}
                        >
                          {course.title}
                        </h3>

                        <p
                          className={`!text-[14px] sm:!text-[15px] !leading-[1.38] mb-2 ${
                            isActive ? 'text-white/90' : 'text-slate-600'
                          }`}
                        >
                          {course.subtitle}
                        </p>

                        {/* Details Stat Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10.5px] font-medium ${
                              isActive
                                ? 'bg-white/14 border-white/20 text-white'
                                : `${theme.chipBg} ${theme.chipText} ${theme.chipBorder}`
                            }`}
                          >
                            <Laptop className="w-3 h-3 shrink-0" />
                            <span>Mode: Live Online, Instructor-Led</span>
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10.5px] font-semibold shrink-0 ${
                              isActive
                                ? 'bg-white/14 border-white/20 text-white'
                                : `${theme.chipBg} ${theme.chipText} ${theme.chipBorder}`
                            }`}
                          >
                            <Calendar className="w-3 h-3 shrink-0" />
                            <span>Batches Open</span>
                          </span>
                        </div>

                        {/* Curriculum Highlights */}
                        <div
                          className={`pt-1.5 border-t mb-2 ${
                            isActive ? 'border-white/15' : 'border-slate-200/75'
                          }`}
                        >
                          <div
                            className={`text-[10px] font-mono uppercase font-bold tracking-wider mb-1 ${
                              isActive ? 'text-white/75' : 'text-slate-500'
                            }`}
                          >
                            Key Curriculum Highlights
                          </div>
                          <div className="grid grid-cols-1 gap-y-1.5">
                            {course.highlights.map((hl, hIdx) => (
                              <div
                                key={hIdx}
                                className={`flex items-start gap-1.5 !text-[13.5px] sm:!text-[14px] !leading-[1.45] ${
                                  isActive ? 'text-white/95' : 'text-slate-700'
                                }`}
                              >
                                <Check
                                  className={`w-3.5 h-3.5 shrink-0 mt-1 ${
                                    isActive ? 'text-white/90' : theme.checkColor
                                  }`}
                                />
                                <span>{hl}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Block: Pushed to bottom with mt-auto so buttons always align */}
                        <div
                          className={`mt-auto pt-1.5 border-t space-y-1.5 ${
                            isActive ? 'border-white/15' : 'border-slate-200/80'
                          }`}
                        >
                          {regional && regional.length > 0 && (
                            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] leading-tight">
                              <span
                                className={`font-mono font-bold inline-flex items-center gap-0.5 ${
                                  isActive ? 'text-white' : 'text-slate-700'
                                }`}
                              >
                                <MapPin className="w-2.5 h-2.5 shrink-0" /> Location Pages:
                              </span>
                              {regional.map((loc) => (
                                <Link
                                  key={loc.path}
                                  to={loc.path}
                                  tabIndex={isActive ? 0 : -1}
                                  onClick={(e) => e.stopPropagation()}
                                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded border transition-colors ${
                                    isActive
                                      ? 'bg-white/15 border-white/25 text-white hover:bg-white/25'
                                      : 'bg-white border-slate-200 text-slate-700'
                                  }`}
                                >
                                  {loc.city}
                                </Link>
                              ))}
                              <Link
                                to="/locations"
                                tabIndex={isActive ? 0 : -1}
                                onClick={(e) => e.stopPropagation()}
                                className={`font-mono hover:underline whitespace-nowrap ml-auto ${
                                  isActive ? 'text-white/95' : 'text-[#1C35EA]'
                                }`}
                              >
                                All locations →
                              </Link>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-2.5 w-full">
                            <button
                              type="button"
                              tabIndex={isActive ? 0 : -1}
                              onClick={(e) => {
                                e.stopPropagation();
                                onEnquire(course.title);
                              }}
                              className={`w-full h-[44px] px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-98 ${
                                isActive
                                  ? 'bg-white text-[#1E3A8A] hover:bg-[#EEF4FF]'
                                  : 'bg-[#14205A] text-white hover:bg-[#1C35EA]'
                              }`}
                            >
                              <span>Enquire Now</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>

                            <a
                              href={getCourseWhatsAppUrl(course.title)}
                              target="_blank"
                              rel="noopener noreferrer"
                              tabIndex={isActive ? 0 : -1}
                              onClick={(e) => e.stopPropagation()}
                              className={`w-full h-[44px] px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 ${
                                isActive
                                  ? 'bg-emerald-500/20 border-emerald-300/40 hover:bg-emerald-500/30 text-white'
                                  : 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                              }`}
                              title={`Enquire about ${course.title} on WhatsApp`}
                            >
                              <WhatsAppIcon
                                className={`w-3.5 h-3.5 ${
                                  isActive ? 'text-emerald-200' : 'text-emerald-600'
                                }`}
                              />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* TABLET (2 Cards, ~300px) & DESKTOP (3 Cards, ~340px): Centre-Focus  */}
      {/* =================================================================== */}
      <div
        className="hidden md:block relative w-full mx-auto px-11 lg:px-14"
        onTouchStart={() => {
          isTouchInteractionRef.current = true;
          setIsTouching(true);
          setIsHovered(false);
        }}
        onTouchEnd={() => setIsTouching(false)}
        onTouchCancel={() => setIsTouching(false)}
        onMouseEnter={() => {
          if (!isTouchInteractionRef.current) {
            setIsHovered(true);
          }
        }}
        onMouseLeave={() => {
          isTouchInteractionRef.current = false;
          setIsHovered(false);
          if (isDragging) finishDrag();
        }}
      >
        {/* Left & Right Non-Overlapping Circular Arrow Buttons */}
        {totalItems > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous course"
              className="flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white hover:bg-[#1E3A8A] border border-[#DBEAFE] hover:border-[#1E3A8A] text-[#1E3A8A] hover:text-white shadow-[0_6px_20px_rgba(30,58,138,0.16)] transition-all duration-200 cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 z-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] after:content-[''] after:absolute after:-inset-[6px]"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next course"
              className="flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white hover:bg-[#1E3A8A] border border-[#DBEAFE] hover:border-[#1E3A8A] text-[#1E3A8A] hover:text-white shadow-[0_6px_20px_rgba(30,58,138,0.16)] transition-all duration-200 cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 z-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] after:content-[''] after:absolute after:-inset-[6px]"
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </>
        )}

        {/* Centre-Focus 3D Perspective Stage */}
        <div className="overflow-x-clip py-3">
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            style={{ perspective: '1200px' }}
            className={`relative w-full select-none touch-pan-y ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <div className="flex items-stretch justify-center gap-5 lg:gap-6 md:min-h-[650px] lg:min-h-[590px]">
              {desktopOffsets.map((offset) => {
                const targetIndex = (currentIndex + offset + totalItems) % totalItems;
                const course = courses[targetIndex];
                if (!course) return null;

                const theme = COURSE_CARD_THEMES[targetIndex % COURSE_CARD_THEMES.length];
                const CourseIcon = getCourseIconComponent(course.iconName);
                const regional = locationLinks[course.id];
                const isCenter = offset === 0;
                const formattedNumber = String(targetIndex + 1).padStart(2, '0');

                // 3 cards on desktop (offset -1, 0, 1); 2 cards on tablet (offset 0, 1)
                const visibilityClasses =
                  totalItems >= 3
                    ? offset === 0
                      ? 'flex'
                      : offset === 1
                      ? 'hidden md:flex'
                      : 'hidden lg:flex'
                    : 'flex';

                // 3D angle & scale transform for centre focus
                const cardTransform = prefersReducedMotion
                  ? 'none'
                  : isCenter
                  ? 'scale(1.03) translateZ(12px) rotateY(0deg)'
                  : offset < 0
                  ? 'scale(0.93) rotateY(7deg) translateX(6px)'
                  : 'scale(0.93) rotateY(-7deg) translateX(-6px)';

                return (
                  <div
                    key={`${course.id}-${offset}`}
                    id={isCenter ? `course-${course.id}` : undefined}
                    onClick={() => {
                      if (didDragMoveRef.current) return;
                      if (!isCenter) {
                        setCurrentIndex(targetIndex);
                      }
                    }}
                    style={{
                      transform: cardTransform,
                      transformStyle: 'preserve-3d',
                    }}
                    className={`md:w-[300px] lg:w-[340px] shrink-0 flex-col transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${visibilityClasses} ${
                      !isCenter ? 'cursor-pointer' : ''
                    } ${
                      isCenter
                        ? 'z-20 opacity-100 hover:-translate-y-1'
                        : 'z-10 opacity-80 hover:opacity-95 hover:-translate-y-1'
                    }`}
                  >
                    <article
                      className={`group relative w-full h-full md:min-h-[648px] lg:min-h-[588px] flex flex-col justify-between rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] border ${
                        isCenter
                          ? `${theme.activeBorder}`
                          : `${theme.sideBorder} ${theme.sideHoverBorder}`
                      }`}
                      style={{
                        background: isCenter ? theme.activeCardGradient : theme.sideCardGradient,
                        boxShadow: isCenter
                          ? `0 22px 48px -10px rgba(15, 23, 42, 0.34), 0 0 36px 2px ${theme.activeGlow}, inset 0 1px 0 rgba(255, 255, 255, 0.25)`
                          : '0 10px 24px -6px rgba(30, 58, 138, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
                      }}
                    >
                      {/* Top Color Accent Strip (side cards) OR Live Auto-Slide Progress Bar (center active card) */}
                      {isCenter ? (
                        <div
                          aria-hidden="true"
                          className="absolute top-0 left-0 right-0 h-1 bg-white/15 overflow-hidden z-20"
                        >
                          {isAutoSlideActive && (
                            <div
                              key={`desktop-bar-${currentIndex}-${selectedCategory}`}
                              style={{
                                background: theme.progressBarGradient,
                                animationDuration: `${SLIDE_DURATION}ms`,
                              }}
                              className="h-full w-full animate-progress-scale"
                            />
                          )}
                        </div>
                      ) : (
                        <div
                          aria-hidden="true"
                          className="absolute top-0 left-0 right-0 h-1 z-20"
                          style={{ background: theme.topBarGradient }}
                        />
                      )}

                      {/* Subtle Decorative Radial Glow */}
                      <div
                        aria-hidden="true"
                        className={`pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl transition-opacity duration-500 ${
                          isCenter ? 'opacity-100' : 'opacity-45 group-hover:opacity-85'
                        }`}
                        style={{ background: theme.activeGlow }}
                      />

                      <div className="relative z-10 p-4 flex-1 flex flex-col">
                        {/* Top Content Block */}
                        <div>
                          {/* Icon Badge + Index & Category Pill */}
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            {isCenter ? (
                              <div className="w-8 h-8 rounded-xl bg-white/15 text-white border border-white/25 shadow-[0_4px_10px_rgba(0,0,0,0.12)] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                                <CourseIcon className="w-4 h-4" />
                              </div>
                            ) : (
                              <div
                                className="w-8 h-8 rounded-xl text-white flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                                style={theme.iconBadgeStyle}
                              >
                                <CourseIcon className="w-4 h-4" />
                              </div>
                            )}

                            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide min-w-0">
                              <span
                                className={`font-mono tabular-nums ${
                                  isCenter ? 'text-white/85' : 'text-slate-500'
                                }`}
                              >
                                {formattedNumber}
                              </span>
                              <span
                                aria-hidden="true"
                                className={isCenter ? 'text-white/55' : 'text-slate-300'}
                              >
                                ·
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold truncate max-w-[165px] border ${
                                  isCenter
                                    ? 'bg-white/15 border-white/25 text-white'
                                    : `${theme.pillBg} ${theme.pillText} ${theme.pillBorder}`
                                }`}
                              >
                                {course.category.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          {/* Course Title */}
                          <h3
                            className={`!text-[20px] lg:!text-[21px] !leading-[1.25] font-bold mb-1 transition-colors duration-300 ${
                              isCenter ? 'text-white' : 'text-[#14205A]'
                            }`}
                          >
                            {course.title}
                          </h3>

                          {/* Full Description */}
                          <p
                            className={`!text-[14px] lg:!text-[14.5px] !leading-[1.38] mb-2 transition-colors duration-300 ${
                              isCenter ? 'text-white/90' : 'text-slate-600'
                            }`}
                          >
                            {course.subtitle}
                          </p>

                          {/* Details Stat Chips */}
                          <div className="flex flex-wrap items-center gap-1.5 mb-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10.5px] tracking-tight font-medium whitespace-nowrap ${
                                isCenter
                                  ? 'bg-white/14 border-white/22 text-white'
                                  : `${theme.chipBg} ${theme.chipText} ${theme.chipBorder}`
                              }`}
                            >
                              <Laptop className="w-3 h-3 shrink-0" />
                              <span>Mode: Live Online, Instructor-Led</span>
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10.5px] tracking-tight font-semibold whitespace-nowrap shrink-0 ${
                                isCenter
                                  ? 'bg-white/14 border-white/22 text-white'
                                  : `${theme.chipBg} ${theme.chipText} ${theme.chipBorder}`
                              }`}
                            >
                              <Calendar className="w-3 h-3 shrink-0" />
                              <span>Batches Open</span>
                            </span>
                          </div>

                          {/* Curriculum Highlights — Full visible list, never truncated */}
                          <div
                            className={`pt-1.5 border-t ${
                              isCenter ? 'border-white/15' : 'border-slate-200/75'
                            }`}
                          >
                            <div
                              className={`text-[10px] font-mono uppercase font-bold tracking-wider mb-1 ${
                                isCenter ? 'text-white/75' : 'text-slate-500'
                              }`}
                            >
                              Key Curriculum Highlights
                            </div>
                            <div className="grid grid-cols-1 gap-y-1.5">
                              {course.highlights.map((hl, hIdx) => (
                                <div
                                  key={hIdx}
                                  className={`flex items-start gap-1.5 !text-[13.5px] !leading-[1.45] ${
                                    isCenter ? 'text-white/95' : 'text-slate-700'
                                  }`}
                                >
                                  <Check
                                    className={`w-3.5 h-3.5 shrink-0 mt-1 ${
                                      isCenter ? 'text-white' : theme.checkColor
                                    }`}
                                  />
                                  <span>{hl}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Bottom Section: Pushed to bottom with mt-auto so buttons always sit at exact same line */}
                        <div className="mt-auto pt-2 space-y-1.5">
                          {regional && regional.length > 0 && (
                            <div
                              className={`pt-1.5 border-t flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] leading-tight ${
                                isCenter ? 'border-white/15' : 'border-slate-200/70'
                              }`}
                            >
                              <span
                                className={`font-mono font-bold inline-flex items-center gap-0.5 ${
                                  isCenter ? 'text-white' : 'text-slate-700'
                                }`}
                              >
                                <MapPin
                                  className={`w-2.5 h-2.5 shrink-0 ${
                                    isCenter ? 'text-white' : 'text-[#1C35EA]'
                                  }`}
                                />{' '}
                                Location Pages:
                              </span>
                              {regional.map((loc) => (
                                <Link
                                  key={loc.path}
                                  to={loc.path}
                                  onClick={(e) => e.stopPropagation()}
                                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded border transition-colors ${
                                    isCenter
                                      ? 'bg-white/15 border-white/25 text-white hover:bg-white/25'
                                      : 'bg-white border-slate-200 text-slate-700 hover:border-[#1C35EA] hover:text-[#1C35EA]'
                                  }`}
                                >
                                  {loc.city}
                                </Link>
                              ))}
                              <Link
                                to="/locations"
                                onClick={(e) => e.stopPropagation()}
                                className={`font-mono whitespace-nowrap ml-auto ${
                                  isCenter
                                    ? 'text-white/95 hover:underline'
                                    : 'text-[#1C35EA] hover:underline'
                                }`}
                              >
                                All locations →
                              </Link>
                            </div>
                          )}

                          {/* Action Buttons — Always at Bottom of Card, Aligned on Same Line */}
                          <div
                            className={`pt-1.5 border-t grid grid-cols-2 gap-2.5 w-full ${
                              isCenter ? 'border-white/15' : 'border-slate-200/80'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (didDragMoveRef.current) return;
                                onEnquire(course.title);
                              }}
                              className={`group/btn w-full h-[44px] lg:h-[40px] px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 ${
                                isCenter
                                  ? 'bg-white text-[#1E3A8A] hover:bg-[#EEF4FF] shadow-[0_6px_18px_rgba(255,255,255,0.22)]'
                                  : 'bg-[#14205A] hover:bg-[#1C35EA] text-white shadow-2xs group-hover:shadow-[0_6px_16px_rgba(28,53,234,0.25)]'
                              }`}
                            >
                              <span>Enquire Now</span>
                              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                            </button>

                            <a
                              href={getCourseWhatsAppUrl(course.title)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={`w-full h-[44px] lg:h-[40px] px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 border ${
                                isCenter
                                  ? 'bg-emerald-500/20 border-emerald-300/40 hover:bg-emerald-500/30 text-white'
                                  : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 text-emerald-900'
                              }`}
                              title={`Enquire about ${course.title} on WhatsApp`}
                            >
                              <WhatsAppIcon
                                className={`w-3.5 h-3.5 ${
                                  isCenter ? 'text-emerald-200' : 'text-emerald-600'
                                }`}
                              />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* DASHBOARD PLAYBACK & PROGRESS DOCK (Counter, Dots, Play/Pause, Arrows) */}
      {/* =================================================================== */}
      {totalItems > 1 && (
        <div
          onMouseEnter={() => {
            if (!isTouchInteractionRef.current) {
              setIsHovered(true);
            }
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
          className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/95 border border-[#DBEAFE]/90 shadow-[0_2px_10px_rgba(37,99,235,0.06)] max-w-3xl mx-auto"
        >
          {/* Left: Active Item Counter & Dynamic Course Title */}
          <div className="flex items-center justify-center sm:justify-start gap-2 min-w-0 max-w-full w-full sm:w-auto">
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#1E3A8A] text-white font-mono text-[11px] font-bold tabular-nums shrink-0">
              {String(currentIndex + 1).padStart(2, '0')} / {String(totalItems).padStart(2, '0')}
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={activeCourse.id}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 4 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? {} : { opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-xs font-bold text-[#1E3A8A] truncate"
              >
                {activeCourse.title}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Center: Interactive Segmented Progress Dots */}
          <div
            className="flex flex-wrap items-center justify-center gap-1.5 max-w-full"
            role="tablist"
            aria-label="Course carousel slide indicators"
          >
            {courses.map((c, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Jump to ${c.title}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] ${
                    isActive
                      ? 'w-6 bg-[#DBEAFE]'
                      : 'w-2 bg-[#93C5FD]/60 hover:bg-[#2563EB]/70'
                  }`}
                >
                  {isActive && (
                    <span
                      key={`dot-${currentIndex}-${selectedCategory}-${isAutoSlideActive ? 'run' : 'pause'}`}
                      style={
                        isAutoSlideActive
                          ? { animationDuration: `${SLIDE_DURATION}ms` }
                          : { width: '100%' }
                      }
                      className={`block h-full w-full bg-[#1E3A8A] rounded-full ${
                        isAutoSlideActive ? 'animate-progress-scale' : ''
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Play/Pause + Prev/Next */}
          <div className="flex items-center justify-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsPausedByUser((p) => !p)}
              aria-label={isPausedByUser ? 'Resume auto-slide' : 'Pause auto-slide'}
              title={isPausedByUser ? 'Resume auto-slide' : 'Pause auto-slide'}
              className="w-8 h-8 rounded-lg bg-white hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white border border-[#DBEAFE] flex items-center justify-center transition-colors cursor-pointer"
            >
              {isPausedByUser ? (
                <Play className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Pause className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous course"
              className="flex w-8 h-8 rounded-lg bg-white hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white border border-[#DBEAFE] items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next course"
              className="flex w-8 h-8 rounded-lg bg-white hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white border border-[#DBEAFE] items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
