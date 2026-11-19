import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
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
  headerBg: string;
  hoverBorder: string;
  progressBarGradient: string;
  iconColor: string;
  iconBadgeBg: string;
  checkColor: string;
  chipBg: string;
  chipText: string;
  primaryBtnBg: string;
  secondaryBtnBg: string;
  curriculumOutlineBtn: string;
}

const COURSE_CARD_THEMES: CourseCardTheme[] = [
  // 0: Brand Cyan (#00B0F0)
  {
    name: 'cyan',
    headerBg: 'linear-gradient(135deg, #0284C7 0%, #00B0F0 100%)',
    hoverBorder: 'hover:border-[#00B0F0]',
    progressBarGradient: 'linear-gradient(90deg, #BAE6FD 0%, #FFFFFF 100%)',
    iconColor: '#0284C7',
    iconBadgeBg: '#FFFFFF',
    checkColor: 'text-[#0284C7]',
    chipBg: 'bg-sky-50',
    chipText: 'text-[#0369A1]',
    primaryBtnBg: 'bg-[#0284C7] hover:bg-[#0369A1] text-white',
    secondaryBtnBg: 'bg-sky-50 hover:bg-sky-100 text-[#0369A1]',
    curriculumOutlineBtn:
      'border-[#0284C7]/60 text-[#0284C7] hover:bg-sky-50 hover:border-[#0284C7]',
  },
  // 1: Brand Blue (#1C35EA)
  {
    name: 'blue',
    headerBg: 'linear-gradient(135deg, #1E3A8A 0%, #1C35EA 100%)',
    hoverBorder: 'hover:border-[#1C35EA]',
    progressBarGradient: 'linear-gradient(90deg, #93C5FD 0%, #FFFFFF 100%)',
    iconColor: '#1C35EA',
    iconBadgeBg: '#FFFFFF',
    checkColor: 'text-[#1C35EA]',
    chipBg: 'bg-blue-50',
    chipText: 'text-[#1E40AF]',
    primaryBtnBg: 'bg-[#1C35EA] hover:bg-[#1E3A8A] text-white',
    secondaryBtnBg: 'bg-blue-50 hover:bg-blue-100 text-[#1C35EA]',
    curriculumOutlineBtn:
      'border-[#1C35EA]/60 text-[#1C35EA] hover:bg-blue-50 hover:border-[#1C35EA]',
  },
  // 2: Brand Purple (#4D19EA)
  {
    name: 'purple',
    headerBg: 'linear-gradient(135deg, #4D19EA 0%, #6D28D9 100%)',
    hoverBorder: 'hover:border-[#4D19EA]',
    progressBarGradient: 'linear-gradient(90deg, #DDD6FE 0%, #FFFFFF 100%)',
    iconColor: '#4D19EA',
    iconBadgeBg: '#FFFFFF',
    checkColor: 'text-[#4D19EA]',
    chipBg: 'bg-violet-50',
    chipText: 'text-[#5B21B6]',
    primaryBtnBg: 'bg-[#4D19EA] hover:bg-[#3B189F] text-white',
    secondaryBtnBg: 'bg-violet-50 hover:bg-violet-100 text-[#4D19EA]',
    curriculumOutlineBtn:
      'border-[#4D19EA]/60 text-[#4D19EA] hover:bg-violet-50 hover:border-[#4D19EA]',
  },
  // 3: Complementary Teal (#0D9488)
  {
    name: 'teal',
    headerBg: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
    hoverBorder: 'hover:border-[#0D9488]',
    progressBarGradient: 'linear-gradient(90deg, #99F6E4 0%, #FFFFFF 100%)',
    iconColor: '#0D9488',
    iconBadgeBg: '#FFFFFF',
    checkColor: 'text-[#0D9488]',
    chipBg: 'bg-teal-50',
    chipText: 'text-[#115E59]',
    primaryBtnBg: 'bg-[#0D9488] hover:bg-[#0F766E] text-white',
    secondaryBtnBg: 'bg-teal-50 hover:bg-teal-100 text-[#0F766E]',
    curriculumOutlineBtn:
      'border-[#0D9488]/60 text-[#0D9488] hover:bg-teal-50 hover:border-[#0D9488]',
  },
  // 4: Brand Navy (#14205A)
  {
    name: 'navy',
    headerBg: 'linear-gradient(135deg, #14205A 0%, #1E3A8A 100%)',
    hoverBorder: 'hover:border-[#14205A]',
    progressBarGradient: 'linear-gradient(90deg, #7DD3FC 0%, #FFFFFF 100%)',
    iconColor: '#14205A',
    iconBadgeBg: '#FFFFFF',
    checkColor: 'text-[#14205A]',
    chipBg: 'bg-indigo-50',
    chipText: 'text-[#14205A]',
    primaryBtnBg: 'bg-[#14205A] hover:bg-[#1E3A8A] text-white',
    secondaryBtnBg: 'bg-indigo-50 hover:bg-indigo-100 text-[#14205A]',
    curriculumOutlineBtn:
      'border-[#14205A]/60 text-[#14205A] hover:bg-indigo-50 hover:border-[#14205A]',
  },
  // 5: Complementary Amber (#D97706)
  {
    name: 'amber',
    headerBg: 'linear-gradient(135deg, #B45309 0%, #D97706 100%)',
    hoverBorder: 'hover:border-[#D97706]',
    progressBarGradient: 'linear-gradient(90deg, #FDE68A 0%, #FFFFFF 100%)',
    iconColor: '#D97706',
    iconBadgeBg: '#FFFFFF',
    checkColor: 'text-[#D97706]',
    chipBg: 'bg-amber-50',
    chipText: 'text-[#92400E]',
    primaryBtnBg: 'bg-[#D97706] hover:bg-[#B45309] text-white',
    secondaryBtnBg: 'bg-amber-50 hover:bg-amber-100 text-[#92400E]',
    curriculumOutlineBtn:
      'border-[#D97706]/60 text-[#D97706] hover:bg-amber-50 hover:border-[#D97706]',
  },
  // 6: Complementary Coral Rose (#E11D48)
  {
    name: 'rose',
    headerBg: 'linear-gradient(135deg, #BE123C 0%, #E11D48 100%)',
    hoverBorder: 'hover:border-[#E11D48]',
    progressBarGradient: 'linear-gradient(90deg, #FECDD3 0%, #FFFFFF 100%)',
    iconColor: '#E11D48',
    iconBadgeBg: '#FFFFFF',
    checkColor: 'text-[#E11D48]',
    chipBg: 'bg-rose-50',
    chipText: 'text-[#9F1239]',
    primaryBtnBg: 'bg-[#E11D48] hover:bg-[#BE123C] text-white',
    secondaryBtnBg: 'bg-rose-50 hover:bg-rose-100 text-[#9F1239]',
    curriculumOutlineBtn:
      'border-[#E11D48]/60 text-[#E11D48] hover:bg-rose-50 hover:border-[#E11D48]',
  },
];

function WhatsAppIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
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

const SLIDE_DURATION = 2500;

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

  // 2.5-second auto-slide timer (loops back to first card at the end)
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

  const [openCurriculumIds, setOpenCurriculumIds] = useState<Record<string, boolean>>({});

  const toggleCurriculum = (courseId: string) => {
    setOpenCurriculumIds((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  if (totalItems === 0) return null;

  const activeCourse = courses[currentIndex] || courses[0];

  // 3 cards on desktop: [-1, 0, 1]; 2 on tablet: [0, 1]
  const desktopOffsets =
    totalItems >= 3
      ? [-1, 0, 1]
      : totalItems === 2
      ? [0, 1]
      : [0];

  const renderCardContent = (
    course: CourseItem,
    courseIndex: number,
    isActiveProgressCard: boolean,
    isMobileCard: boolean
  ) => {
    const theme = COURSE_CARD_THEMES[courseIndex % COURSE_CARD_THEMES.length];
    const CourseIcon = getCourseIconComponent(course.iconName);
    const regional = locationLinks[course.id];
    const formattedNumber = String(courseIndex + 1).padStart(2, '0');
    const isCurriculumOpen = Boolean(openCurriculumIds[course.id]);
    const curriculumPanelId = `course-curriculum-${isMobileCard ? 'mobile-' : ''}${course.id}`;

    return (
      <article
        id={
          isActiveProgressCard
            ? isMobileCard
              ? `course-mobile-${course.id}`
              : `course-${course.id}`
            : undefined
        }
        className={`group relative w-full h-full flex flex-col bg-white rounded-[16px] overflow-hidden border border-transparent ${theme.hoverBorder} shadow-[0_10px_28px_-6px_rgba(15,23,42,0.12)] hover:shadow-[0_20px_42px_-8px_rgba(15,23,42,0.22)] transition-all duration-300`}
      >
        {/* Solid Colour Header (~100 px) */}
        <div
          data-testid={`course-card-header-${course.id}`}
          className="relative h-[100px] shrink-0 px-3.5 pt-2.5 pb-2 flex flex-col justify-between overflow-hidden"
          style={{ background: theme.headerBg }}
        >
          {/* Auto-Slide Progress Bar on Active Card */}
          {isActiveProgressCard && isAutoSlideActive && (
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-1 bg-white/20 overflow-hidden z-20"
            >
              <div
                key={`bar-${currentIndex}-${selectedCategory}`}
                style={{
                  background: theme.progressBarGradient,
                  animationDuration: `${SLIDE_DURATION}ms`,
                }}
                className="h-full w-full animate-progress-scale"
              />
            </div>
          )}

          {/* Top Row: White Rounded Icon Badge + Course Number & Category */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <div
              data-testid={`course-icon-badge-${course.id}`}
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundColor: theme.iconBadgeBg,
                color: theme.iconColor,
                boxShadow:
                  '0 0 18px rgba(255, 255, 255, 0.5), 0 4px 12px rgba(15, 23, 42, 0.16)',
              }}
            >
              <CourseIcon className="w-5 h-5 stroke-[2.25]" />
            </div>

            <div className="flex items-center gap-1 text-[10.5px] font-bold tracking-wide min-w-0">
              <span className="font-mono tabular-nums text-white/90">
                {formattedNumber}
              </span>
              <span aria-hidden="true" className="text-white/60">
                ·
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9.5px] font-mono font-bold uppercase truncate max-w-[130px] bg-white/20 text-white backdrop-blur-xs">
                {course.category.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Course Title: White, Bold, 19 px */}
          <h3 className="relative z-10 !text-[18px] lg:!text-[19px] !leading-[1.18] font-bold text-white line-clamp-2">
            {course.title}
          </h3>
        </div>

        {/* Clean White Card Body (14 px text, 1.45 line spacing) */}
        <div className="p-3.5 flex-1 flex flex-col justify-between bg-white">
          <div>
            {/* Course Description (14 px, 1.45 line-height) */}
            <p className="!text-[14px] !leading-[1.45] text-slate-600 mb-2">
              {course.subtitle}
            </p>

            {/* Mode & Batches Open Chips */}
            <div className="flex flex-wrap items-center gap-1 mb-2.5">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap ${theme.chipBg} ${theme.chipText}`}
              >
                <Laptop className="w-3 h-3 shrink-0" />
                <span>Mode: Live Online, Instructor-Led</span>
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap shrink-0 ${theme.chipBg} ${theme.chipText}`}
              >
                <Calendar className="w-3 h-3 shrink-0" />
                <span>Batches Open</span>
              </span>
            </div>

            {/* View / Hide Curriculum Toggle Button (36 px tall, 13 px label, outline style in card colour) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (didDragMoveRef.current) return;
                toggleCurriculum(course.id);
              }}
              aria-expanded={isCurriculumOpen}
              aria-controls={curriculumPanelId}
              className={`w-full h-[36px] px-3 rounded-lg border bg-white !text-[13px] font-semibold leading-none flex items-center justify-between gap-2 transition-colors duration-200 motion-reduce:transition-none cursor-pointer ${theme.curriculumOutlineBtn}`}
            >
              <span>{isCurriculumOpen ? 'Hide Curriculum' : 'View Curriculum'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
                  isCurriculumOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Collapsible Key Curriculum Highlights (always present in HTML for SEO) */}
            <div
              id={curriculumPanelId}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                isCurriculumOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="pt-2.5">
                  <div className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400 mb-1.5">
                    Key Curriculum Highlights
                  </div>
                  <div className="grid grid-cols-1 gap-y-1.5">
                    {course.highlights.map((hl, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-start gap-1.5 !text-[14px] !leading-[1.45] text-slate-700"
                      >
                        <Check
                          className={`w-3.5 h-3.5 shrink-0 mt-1 stroke-[2.5] ${theme.checkColor}`}
                        />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Block: Location Links + Three Action Buttons in One Row */}
          <div className="mt-auto pt-2.5 space-y-2">
            {regional && regional.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-[10px] leading-tight">
                <span className="font-mono font-bold inline-flex items-center gap-0.5 text-slate-700">
                  <MapPin className="w-2.5 h-2.5 shrink-0 text-[#1C35EA]" /> Location Pages:
                </span>
                {regional.map((loc) => (
                  <Link
                    key={loc.path}
                    to={loc.path}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-[#1C35EA] transition-colors"
                  >
                    {loc.city}
                  </Link>
                ))}
                <Link
                  to="/locations"
                  onClick={(e) => e.stopPropagation()}
                  className="font-mono text-[#1C35EA] hover:underline whitespace-nowrap ml-auto"
                >
                  All locations →
                </Link>
              </div>
            )}

            {/* Two-Row Action Buttons at Bottom of Every Card (38px tall, 13px label, 12px horizontal padding, 8px gap) */}
            <div
              data-testid={`course-card-bottom-actions-${course.id}`}
              className="relative z-40 flex flex-col gap-2 w-full"
            >
              {/* Row 1: Main Full-Width "Enquire Now" Button with Right Arrow */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (didDragMoveRef.current) return;
                  onEnquire(course.title);
                }}
                className={`group/btn w-full h-[38px] px-3 rounded-full !text-[13px] font-semibold leading-none transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-98 ${theme.primaryBtnBg}`}
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-[3px]" />
              </button>

              {/* Row 2: "WhatsApp" and "Know More" Side-by-Side (Half Width Each, 8px Gap) */}
              <div className="grid grid-cols-2 gap-2 w-full">
                <a
                  href={getCourseWhatsAppUrl(course.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="group/btn w-full h-[38px] px-3 rounded-full !text-[13px] font-semibold leading-none bg-emerald-50 hover:bg-emerald-100 text-emerald-900 transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-98"
                  title={`Enquire about ${course.title} on WhatsApp`}
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (didDragMoveRef.current) return;
                    onEnquire(course.title);
                  }}
                  className={`group/btn w-full h-[38px] px-3 rounded-full !text-[13px] font-semibold leading-none transition-all duration-200 flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer active:scale-98 ${theme.secondaryBtnBg}`}
                >
                  <span>Know More</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-[3px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  };

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
      {/* MOBILE CAROUSEL (< 768px): 1 Card Visible (85% Screen Width)        */}
      {/* =================================================================== */}
      <div className="md:hidden">
        <div className="relative py-1">
          {totalItems > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous course"
                className="absolute left-0.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/95 border border-[#DBEAFE] text-[#1E3A8A] hover:text-[#2563EB] active:scale-95 transition-transform flex items-center justify-center cursor-pointer after:content-[''] after:absolute after:-inset-[8px]"
                style={{ boxShadow: '0 4px 14px rgba(15,23,42,0.18)' }}
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.25]" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next course"
                className="absolute right-0.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/95 border border-[#DBEAFE] text-[#1E3A8A] hover:text-[#2563EB] active:scale-95 transition-transform flex items-center justify-center cursor-pointer after:content-[''] after:absolute after:-inset-[8px]"
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
            className="w-full overflow-hidden rounded-[16px] touch-pan-y py-3"
          >
            <div
              className="flex items-stretch w-full"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: prefersReducedMotion
                  ? 'none'
                  : 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {courses.map((course, idx) => (
                <div
                  key={`${course.id}-${idx}`}
                  className="w-full shrink-0 flex justify-center"
                >
                  <div className="w-[85vw] max-w-[96%] flex flex-col">
                    {renderCardContent(course, idx, idx === currentIndex, true)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* TABLET (2 Cards, ~250px) & DESKTOP (3 Cards, ~270px): Equal Height  */}
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

        <div className="overflow-x-clip py-3">
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            className={`relative w-full select-none touch-pan-y ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <div className="flex items-stretch justify-center gap-5 lg:gap-6">
              {desktopOffsets.map((offset) => {
                const targetIndex = (currentIndex + offset + totalItems) % totalItems;
                const course = courses[targetIndex];
                if (!course) return null;

                const isCenter = offset === 0;

                // 3 cards on desktop (offset -1, 0, 1); 2 cards on tablet (offset 0, 1)
                const visibilityClasses =
                  totalItems >= 3
                    ? offset === 0
                      ? 'flex'
                      : offset === 1
                      ? 'hidden md:flex'
                      : 'hidden lg:flex'
                    : 'flex';

                return (
                  <div
                    key={`${course.id}-${offset}`}
                    onClick={() => {
                      if (didDragMoveRef.current) return;
                      if (!isCenter) {
                        setCurrentIndex(targetIndex);
                      }
                    }}
                    className={`md:w-[250px] lg:w-[270px] shrink-0 flex-col transition-transform duration-300 hover:-translate-y-1 ${visibilityClasses}`}
                  >
                    {renderCardContent(course, targetIndex, isCenter, false)}
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
