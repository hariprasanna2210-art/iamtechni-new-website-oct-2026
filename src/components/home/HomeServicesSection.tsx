import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Play,
  Pause,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { PageRoute, ServiceItem } from '../../types';
import { servicesData } from '../../data/servicesData';
import { getServiceIcon } from '../../utils/serviceIcons';
import { getToolsForService } from '../../data/heroServiceTools';

export interface ShowcaseCarouselToolBadge {
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
  brandColor?: string;
}

export interface ShowcaseCarouselItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  icon: React.ComponentType<{ className?: string }>;
  highlights: string[];
  stackLabel?: string;
  tools: ShowcaseCarouselToolBadge[];
  ctaLabel: string;
  onCtaClick: () => void;
}

export interface ShowcaseCardCarouselSectionProps {
  sectionId: string;
  stageAnchorId?: string;
  eyebrow: string;
  heading: string;
  subtitle: string;
  items: ShowcaseCarouselItem[];
  allItemsLabel: string;
  onAllItemsClick: () => void;
  selectedSlug?: string;
  onSelectSlug?: (slug: string) => void;
  enableServiceHashSync?: boolean;
}

export const ShowcaseCardCarouselSection: React.FC<ShowcaseCardCarouselSectionProps> = ({
  sectionId,
  stageAnchorId,
  eyebrow,
  heading,
  subtitle,
  items,
  allItemsLabel,
  onAllItemsClick,
  selectedSlug,
  onSelectSlug,
  enableServiceHashSync = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [progress, setProgress] = useState(0);

  // Pointer & touch drag/swipe tracking for desktop and mobile
  const dragStartXRef = useRef<number | null>(null);
  const dragCurrentXRef = useRef<number | null>(null);
  const didDragMoveRef = useRef<boolean>(false);
  const isTouchInteractionRef = useRef<boolean>(false);

  const tabsScrollRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);
  const onSelectSlugRef = useRef(onSelectSlug);
  const lastSyncedSlugRef = useRef<string | undefined>(selectedSlug);

  useEffect(() => {
    onSelectSlugRef.current = onSelectSlug;
  }, [onSelectSlug]);

  const totalItems = items.length;
  const SLIDE_DURATION = 3600; // 3.6 seconds per slide for comfortable reading

  // Find item index by slug or id
  const findItemIndexBySlug = useCallback(
    (slugOrId: string): number => {
      const clean = (slugOrId || '').trim().toLowerCase();
      if (!clean) return -1;
      return items.findIndex(
        (s) =>
          (s.slug && s.slug.toLowerCase() === clean) ||
          (s.id && s.id.toLowerCase() === clean)
      );
    },
    [items]
  );

  // Go to specific index and scroll active tab into view
  const handleSelectItem = useCallback(
    (index: number, updateUrlAndParent = false, updateHash = false) => {
      if (totalItems === 0) return;
      const safeIndex = ((index % totalItems) + totalItems) % totalItems;
      setCurrentIndex(safeIndex);
      setProgress(0);

      const item = items[safeIndex];
      if (item) {
        const slug = item.slug || item.id;
        lastSyncedSlugRef.current = slug;
        if (updateUrlAndParent) {
          onSelectSlugRef.current?.(slug);
          if (enableServiceHashSync && updateHash && typeof window !== 'undefined') {
            window.history.replaceState(null, '', `#services/${slug}`);
          }
        }
      }
    },
    [totalItems, items, enableServiceHashSync]
  );

  // Sync parent whenever currentIndex changes
  useEffect(() => {
    const item = items[currentIndex];
    if (!item) return;
    const slug = item.slug || item.id;
    if (slug) {
      lastSyncedSlugRef.current = slug;
      onSelectSlugRef.current?.(slug);
    }
  }, [currentIndex, items]);

  // Sync when selectedSlug prop changes externally
  useEffect(() => {
    if (!selectedSlug) return;
    if (selectedSlug === lastSyncedSlugRef.current) return;
    const matchedIdx = findItemIndexBySlug(selectedSlug);
    if (matchedIdx !== -1) {
      lastSyncedSlugRef.current = selectedSlug;
      setCurrentIndex(matchedIdx);
      setProgress(0);
    }
  }, [selectedSlug, findItemIndexBySlug]);

  // Listen for hero card selection custom event & URL hash (#services/<slug>) when enabled
  useEffect(() => {
    if (!enableServiceHashSync || typeof window === 'undefined') return;

    const applySlugFromHash = (scrollIntoViewOnInitial = false) => {
      const hash = window.location.hash || '';
      if (hash.startsWith('#services/')) {
        const slug = decodeURIComponent(hash.replace('#services/', '').trim());
        const matchedIdx = findItemIndexBySlug(slug);
        if (matchedIdx !== -1) {
          const targetSlug = items[matchedIdx].slug || items[matchedIdx].id;
          lastSyncedSlugRef.current = targetSlug;
          setCurrentIndex(matchedIdx);
          setProgress(0);
          onSelectSlugRef.current?.(targetSlug);
          if (scrollIntoViewOnInitial) {
            const el = document.getElementById(sectionId);
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
        const matchedIdx = findItemIndexBySlug(slug);
        if (matchedIdx !== -1) {
          const targetSlug = items[matchedIdx].slug || items[matchedIdx].id;
          lastSyncedSlugRef.current = targetSlug;
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
  }, [enableServiceHashSync, findItemIndexBySlug, items, prefersReducedMotion, sectionId]);

  const handlePrev = useCallback(() => {
    if (totalItems === 0) return;
    setCurrentIndex((prevIndex) => ((prevIndex - 1) % totalItems + totalItems) % totalItems);
    setProgress(0);
  }, [totalItems]);

  const handleNext = useCallback(() => {
    if (totalItems === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
    setProgress(0);
  }, [totalItems]);

  // Keep active tab smoothly scrolled into center on mobile/tablet/desktop
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

  // Single timer in useEffect: auto-slides every 2 seconds (2000ms), loops infinitely,
  // pauses immediately on hover (cards, arrows, dots) or touch/drag, and resumes 2s after release/leave.
  useEffect(() => {
    if (
      isHovered ||
      isTouching ||
      isDragging ||
      isPausedByUser ||
      prefersReducedMotion ||
      totalItems <= 1
    ) {
      setProgress(0);
      return;
    }

    let startTime = Date.now();
    setProgress(0);

    const timerId = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= SLIDE_DURATION) {
        startTime = Date.now();
        setProgress(0);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
      } else {
        setProgress((elapsed / SLIDE_DURATION) * 100);
      }
    }, 40);

    return () => {
      window.clearInterval(timerId);
    };
  }, [
    currentIndex,
    isHovered,
    isTouching,
    isDragging,
    isPausedByUser,
    totalItems,
    prefersReducedMotion,
  ]);

  // Unified Drag / Swipe handlers for both desktop mouse and mobile touch
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

  useEffect(() => {
    if (!isDragging && !isTouching) return;
    const handleGlobalPointerEnd = () => {
      finishDrag();
    };
    window.addEventListener('pointerup', handleGlobalPointerEnd);
    window.addEventListener('pointercancel', handleGlobalPointerEnd);
    window.addEventListener('touchend', handleGlobalPointerEnd);
    window.addEventListener('touchcancel', handleGlobalPointerEnd);
    window.addEventListener('blur', handleGlobalPointerEnd);
    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerEnd);
      window.removeEventListener('pointercancel', handleGlobalPointerEnd);
      window.removeEventListener('touchend', handleGlobalPointerEnd);
      window.removeEventListener('touchcancel', handleGlobalPointerEnd);
      window.removeEventListener('blur', handleGlobalPointerEnd);
    };
  }, [isDragging, isTouching, finishDrag]);

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  const activeItem = items[currentIndex] || items[0];
  const headingWords = useMemo(() => heading.trim().split(/\s+/), [heading]);

  if (!activeItem) return null;

  return (
    <section
      id={sectionId}
      aria-labelledby={`${sectionId}-section-title`}
      onKeyDown={handleKeyDown}
      className="relative w-full py-14 sm:py-18 lg:py-22 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF] border-b border-[#DBEAFE]/80 overflow-hidden scroll-mt-16"
    >
      {stageAnchorId && <div id={stageAnchorId} className="sr-only" aria-hidden="true" />}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===================================================================== */}
        {/* 1. MODERN SECTION HEADER                                              */}
        {/* ===================================================================== */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4 mb-8 sm:mb-10">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 h-[32px] px-3 sm:px-4 max-w-full rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-[#2563EB] font-mono text-[10.5px] min-[360px]:text-xs font-bold tracking-widest uppercase">
            <span
              className="w-2 h-2 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)] shrink-0"
              aria-hidden="true"
            />
            <span className="truncate">{eyebrow}</span>
          </div>

          {/* Section Title (Hero Section Heading Color #1E3A8A + drop shadow, Plus Jakarta Sans Extrabold, tight tracking, with hover zoom-in/zoom-out) */}
          <motion.h2
            id={`${sectionId}-section-title`}
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="!font-['Plus_Jakarta_Sans','Inter',sans-serif] text-[26px] min-[360px]:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-[#1E3A8A] leading-[1.12] origin-center cursor-default"
          >
            {headingWords.map((word, i, arr) => {
              const isLast = i === arr.length - 1;
              return (
                <React.Fragment key={`${word}-${i}`}>
                  <motion.span
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
                    whileHover={
                      prefersReducedMotion
                        ? {}
                        : {
                            scale: 1.06,
                            transition: { duration: 0.22, ease: 'easeOut' },
                          }
                    }
                    transition={{
                      duration: 0.4,
                      delay: prefersReducedMotion ? 0 : 0.05 * i,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`inline-block text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.12)] hover:drop-shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-[transform,filter] duration-200 ${
                      isLast ? 'mr-0' : 'mr-[0.24em]'
                    }`}
                  >
                    {word}
                  </motion.span>
                  {!isLast && ' '}
                </React.Fragment>
              );
            })}
          </motion.h2>

          {/* Subtitle Paragraph */}
          <p className="!font-['Inter','Plus_Jakarta_Sans',sans-serif] text-[15px] sm:text-base lg:text-[17px] text-slate-600 font-medium leading-[1.68] max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* ===================================================================== */}
        {/* 2. DYNAMIC ICON + NUMBERED FILTER TRACK                               */}
        {/* ===================================================================== */}
        <div className="relative w-full max-w-5xl mx-auto mb-5 sm:mb-8">
          {/* Mobile-Only Discoverability Header above Filter Track */}
          <div className="flex md:hidden items-center justify-between gap-2 px-1 mb-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#1E3A8A] uppercase tracking-wider">
              <span className="px-2 py-0.5 rounded-md bg-[#1E3A8A] text-white">
                {String(currentIndex + 1).padStart(2, '0')} / {String(totalItems).padStart(2, '0')}
              </span>
              <span className="truncate max-w-[170px] text-[#1E3A8A]/90">
                {activeItem.title}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] shrink-0">
              <span>Swipe categories</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div className="relative p-1.5 rounded-2xl bg-gradient-to-r from-[#EEF4FF]/90 via-[#F5F9FF]/95 to-[#ECFEFF]/85 backdrop-blur-md border border-[#DBEAFE]/90 shadow-[0_4px_20px_rgba(30,58,138,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] overflow-hidden">
            {/* Mobile-only right-edge gradient cue indicating more scrollable tabs */}
            <div
              aria-hidden="true"
              className="md:hidden pointer-events-none absolute inset-y-1 right-0 w-10 bg-gradient-to-l from-[#ECFEFF] via-[#F5F9FF]/85 to-transparent z-20 rounded-r-xl"
            />
            <div
              ref={tabsScrollRef}
              role="tablist"
              aria-label={`Filter ${sectionId} item`}
              className="flex items-center justify-start gap-1.5 overflow-x-auto no-scrollbar py-1 pl-1 pr-7 md:px-1 max-w-full"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {items.map((item, index) => {
                const isActive = index === currentIndex;
                const TabIcon = item.icon;
                const formattedIdx = String(index + 1).padStart(2, '0');

                return (
                  <button
                    key={item.slug || item.id}
                    ref={isActive ? activeTabRef : null}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`${sectionId}-card-${item.slug || item.id}`}
                    onClick={() => handleSelectItem(index, true, true)}
                    className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl text-xs sm:text-[13px] font-semibold transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] ${
                      isActive
                        ? 'text-white font-bold'
                        : 'text-[#1E3A8A]/85 hover:text-[#1E3A8A] hover:bg-white/70'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={`${sectionId}-activeTabPill`}
                        className="absolute inset-0 rounded-xl bg-[#1E3A8A] shadow-[0_4px_12px_rgba(30,58,138,0.25)] z-0"
                        transition={{
                          type: 'spring',
                          bounce: 0.18,
                          duration: prefersReducedMotion ? 0 : 0.38,
                        }}
                      />
                    )}
                    <span
                      className={`relative z-10 text-[10.5px] font-mono tabular-nums ${
                        isActive ? 'text-[#93C5FD]' : 'text-[#1D4ED8]'
                      }`}
                    >
                      {formattedIdx}
                    </span>
                    <TabIcon
                      className={`relative z-10 w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-white' : 'text-[#2563EB]'
                      }`}
                    />
                    <span className="relative z-10">{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. DYNAMIC LAYERED CAROUSEL STAGE                                     */}
        {/*    - Desktop (lg+): 3 full compact cards + peeking side cards         */}
        {/*    - Tablet (md): 2 compact cards                                     */}
        {/*    - Mobile (<md): 1 centered active card + next-card preview         */}
        {/* ===================================================================== */}
        <div
          className="relative w-full max-w-5xl mx-auto"
          onTouchStart={() => {
            isTouchInteractionRef.current = true;
            setIsTouching(true);
            setIsHovered(false);
          }}
          onTouchEnd={() => {
            setIsTouching(false);
          }}
          onTouchCancel={() => {
            setIsTouching(false);
          }}
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
          {/* Mobile-Only Top Swipe Cue & Quick Prev/Next Controls */}
          <div className="flex md:hidden items-center justify-between gap-2 mb-2.5 px-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A8A]">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
              <span>Swipe card or tap arrows to browse ({totalItems} total)</span>
            </span>
            <div className="inline-flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous item"
                className="w-9 h-9 rounded-xl bg-white hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white border border-[#DBEAFE] shadow-xs flex items-center justify-center transition-colors cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next item"
                className="w-9 h-9 rounded-xl bg-[#1E3A8A] hover:bg-[#2563EB] text-white border border-[#1E3A8A] shadow-xs flex items-center justify-center transition-colors cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Edge Fade Gradients over the Peeking Cards */}
          <div
            aria-hidden="true"
            className="hidden lg:block pointer-events-none absolute inset-y-0 -left-44 w-48 bg-gradient-to-r from-[#F8FAFD] via-[#F8FAFD]/85 to-transparent z-20"
          />
          <div
            aria-hidden="true"
            className="hidden lg:block pointer-events-none absolute inset-y-0 -right-44 w-48 bg-gradient-to-l from-[#F8FAFD] via-[#F8FAFD]/85 to-transparent z-20"
          />

          {/* Tablet & Desktop Left Round Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-[#1E3A8A] border border-[#DBEAFE] hover:border-[#1E3A8A] text-[#1E3A8A] hover:text-white shadow-[0_6px_20px_rgba(30,58,138,0.14)] transition-all duration-200 cursor-pointer absolute -left-3 lg:-left-6 top-1/2 -translate-y-1/2 z-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>

          {/* Tablet & Desktop Right Round Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-[#1E3A8A] border border-[#DBEAFE] hover:border-[#1E3A8A] text-[#1E3A8A] hover:text-white shadow-[0_6px_20px_rgba(30,58,138,0.14)] transition-all duration-200 cursor-pointer absolute -right-3 lg:-right-6 top-1/2 -translate-y-1/2 z-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]"
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>

          {/* Draggable / Swipeable Carousel Track */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            className={`relative w-full py-2 sm:py-6 select-none touch-pan-y ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 items-stretch lg:w-[152%] xl:w-[156%] lg:relative lg:left-1/2 lg:-translate-x-1/2">
              {[-2, -1, 0, 1, 2].map((offset) => {
                const targetIndex = (currentIndex + offset + totalItems) % totalItems;
                const item = items[targetIndex];
                if (!item) return null;

                const isCenter = offset === 0;
                const isPeek = offset === -2 || offset === 2;
                const ItemIcon = item.icon;
                const tools = (item.tools || []).slice(0, 4);
                const keyHighlights = (item.highlights || []).slice(0, 2);
                const formattedNumber = String(targetIndex + 1).padStart(2, '0');

                const visibilityClasses =
                  offset === 0
                    ? 'block'
                    : offset === 1
                    ? 'hidden md:block'
                    : offset === -1
                    ? 'hidden lg:block'
                    : 'hidden lg:block';

                return (
                  <motion.div
                    layout
                    transition={{
                      layout: {
                        duration: prefersReducedMotion ? 0 : 0.42,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }}
                    key={`${item.slug || item.id}-${offset}`}
                    id={isCenter ? `${sectionId}-card-${item.slug || item.id}` : undefined}
                    onClick={() => {
                      if (didDragMoveRef.current) return;
                      if (!isCenter) {
                        handleSelectItem(targetIndex, true, false);
                      }
                    }}
                    className={`h-full w-full max-w-[380px] md:max-w-[330px] lg:max-w-[315px] mx-auto flex flex-col transition-[transform,opacity] duration-[400ms] ease-out ${visibilityClasses} ${
                      isCenter
                        ? 'z-20 md:scale-[1.035] lg:scale-[1.045]'
                        : isPeek
                        ? 'z-0 opacity-35 hover:opacity-60 scale-95'
                        : 'z-10 opacity-95 hover:opacity-100 scale-100 hover:-translate-y-0.5'
                    }`}
                  >
                    <div
                      className={`group relative h-full flex flex-col justify-between p-5 sm:p-5 rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-[400ms] ease-out ${
                        isCenter
                          ? 'bg-gradient-to-br from-[#1E3A8A]/95 via-[#1E3A8A]/90 to-[#2563EB]/90 border border-[#60A5FA]/40 shadow-[0_18px_38px_rgba(30,58,138,0.24),inset_0_1px_0_rgba(255,255,255,0.22)] -translate-y-1'
                          : 'bg-gradient-to-br from-[#FFFFFF] via-[#F8FBFF] to-[#EEF4FF]/85 border border-[#DBEAFE] shadow-[0_6px_20px_rgba(30,58,138,0.06),inset_0_1px_0_rgba(255,255,255,0.95)] hover:border-[#93C5FD]'
                      }`}
                    >
                      {/* Live Top Progress Bar inside the Active Center Card */}
                      {isCenter && (
                        <div
                          aria-hidden="true"
                          className="absolute top-0 left-0 right-0 h-1 bg-white/15 overflow-hidden"
                        >
                          <div
                            className="h-full bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#93C5FD] transition-[width] duration-75 ease-linear"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}

                      {/* Subtle Decorative Radial Glow inside Active Card */}
                      {isCenter && (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#60A5FA]/20 blur-2xl"
                        />
                      )}

                      {/* Top Content Block */}
                      <div className="relative z-10">
                        {/* Header Row: Icon Box + Index/Category Metadata */}
                        <div className="flex items-center justify-between gap-2.5 mb-3">
                          <div
                            className={`w-10 h-10 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                              isCenter
                                ? 'bg-white/15 text-white border border-white/25 shadow-[0_4px_12px_rgba(0,0,0,0.12)]'
                                : 'bg-gradient-to-br from-[#EEF4FF] to-[#DBEAFE]/80 text-[#1E3A8A] border border-[#DBEAFE]'
                            }`}
                          >
                            <ItemIcon className="w-4.5 h-4.5" />
                          </div>

                          <div
                            className={`flex items-center gap-1.5 text-[11px] font-bold tracking-wide transition-colors duration-[400ms] ${
                              isCenter ? 'text-[#BFDBFE]' : 'text-[#2563EB]'
                            }`}
                          >
                            <span className="font-mono tabular-nums opacity-85">
                              {formattedNumber}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="truncate max-w-[175px]">
                              {item.category || 'Engineering'}
                            </span>
                          </div>
                        </div>

                        {/* Card Title */}
                        <h3
                          className={`text-base sm:text-[17px] font-bold leading-snug mb-2 transition-colors duration-[400ms] ${
                            isCenter
                              ? 'text-white'
                              : 'text-[#1E3A8A] group-hover:text-[#2563EB]'
                          }`}
                        >
                          {item.title}
                        </h3>

                        {/* Concise Description */}
                        <p
                          className={`text-[13.5px] sm:text-xs lg:text-[13px] leading-relaxed line-clamp-3 sm:line-clamp-2 mb-3.5 transition-colors duration-[400ms] ${
                            isCenter
                              ? 'text-blue-50/95'
                              : 'text-slate-600 font-medium'
                          }`}
                        >
                          {item.summary}
                        </p>

                        {/* Dynamic Core Highlights List (2 key items) */}
                        {keyHighlights.length > 0 && (
                          <div
                            className={`space-y-1.5 mb-3.5 pt-2.5 border-t transition-colors duration-[400ms] ${
                              isCenter ? 'border-white/15' : 'border-[#DBEAFE]/70'
                            }`}
                          >
                            {keyHighlights.map((highlight) => (
                              <div
                                key={highlight}
                                className="flex items-center gap-2 text-xs leading-snug"
                              >
                                <CheckCircle2
                                  className={`w-3.5 h-3.5 shrink-0 ${
                                    isCenter ? 'text-[#93C5FD]' : 'text-[#2563EB]'
                                  }`}
                                />
                                <span
                                  className={`font-medium truncate ${
                                    isCenter ? 'text-white/95' : 'text-[#1E3A8A]/90'
                                  }`}
                                >
                                  {highlight}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Bottom: Key Stack & Tools + Action Row */}
                      <div
                        className={`relative z-10 pt-3 border-t space-y-3 transition-colors duration-[400ms] ${
                          isCenter ? 'border-white/15' : 'border-[#DBEAFE]/80'
                        }`}
                      >
                        {tools.length > 0 && (
                          <div>
                            <div
                              className={`text-[10px] uppercase font-bold tracking-wider mb-1.5 transition-colors duration-[400ms] ${
                                isCenter ? 'text-[#BFDBFE]' : 'text-[#2563EB]/85'
                              }`}
                            >
                              {item.stackLabel || 'Key Stack & Tools'}
                            </div>
                            <div className="flex items-center flex-wrap gap-1.5">
                              {tools.map((tool) => {
                                const ToolIcon = tool.icon;
                                return (
                                  <div
                                    key={tool.name}
                                    title={tool.name}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors duration-[400ms] ${
                                      isCenter
                                        ? 'bg-white/14 border border-white/20 text-white'
                                        : 'bg-white border border-[#DBEAFE] text-[#1E3A8A] shadow-2xs'
                                    }`}
                                  >
                                    {ToolIcon && (
                                      <span
                                        style={{
                                          color: isCenter ? '#93C5FD' : tool.brandColor || '#2563EB',
                                        }}
                                      >
                                        <ToolIcon className="w-3 h-3" />
                                      </span>
                                    )}
                                    <span>{tool.name}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Action Bar */}
                        <div className="flex items-center justify-between pt-0.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (didDragMoveRef.current) return;
                              item.onCtaClick();
                            }}
                            className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all duration-200 group/link cursor-pointer ${
                              isCenter
                                ? 'px-3.5 py-2 min-h-[38px] rounded-lg bg-white text-[#1E3A8A] hover:bg-[#EEF4FF] shadow-xs'
                                : 'py-1.5 text-[#1E3A8A] hover:text-[#2563EB]'
                            }`}
                          >
                            <span>{item.ctaLabel}</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
                          </button>

                          {!isCenter && (
                            <span className="text-[11px] font-semibold text-[#2563EB]/80 group-hover:text-[#2563EB] transition-colors">
                              Click to focus
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile-Only (<md) Intentional Next-Card Preview Strip */}
            {totalItems > 1 && (() => {
              const nextIndex = (currentIndex + 1) % totalItems;
              const nextItem = items[nextIndex];
              if (!nextItem) return null;
              const NextIcon = nextItem.icon;
              const nextFormatted = String(nextIndex + 1).padStart(2, '0');
              return (
                <div className="md:hidden mt-3 max-w-[380px] mx-auto">
                  <button
                    type="button"
                    onClick={() => handleSelectItem(nextIndex, true, false)}
                    className="w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-white via-[#F8FBFF] to-[#EEF4FF] border border-[#BFDBFE] shadow-[0_6px_18px_rgba(30,58,138,0.08)] text-left transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] border border-[#DBEAFE] text-[#1E3A8A] flex items-center justify-center shrink-0">
                        <NextIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#2563EB]">
                          <span>Up Next · {nextFormatted}/{String(totalItems).padStart(2, '0')}</span>
                        </div>
                        <div className="text-xs font-bold text-[#1E3A8A] truncate">
                          {nextItem.title}
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1E3A8A] text-white text-[11px] font-bold shrink-0">
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </div>
              );
            })()}
          </div>

          {/* =================================================================== */}
          {/* 4. DYNAMIC INTERACTIVE PLAYBACK & PROGRESS DOCK                     */}
          {/* =================================================================== */}
          <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 px-3.5 sm:px-4 py-3 rounded-2xl bg-gradient-to-r from-[#EEF4FF]/90 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.06)] max-w-3xl mx-auto">
            {/* Left: Active Item Counter & Dynamic Title */}
            <div className="flex items-center justify-center sm:justify-start gap-2 min-w-0 max-w-full">
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-[#1E3A8A] text-white font-mono text-xs font-bold tabular-nums shrink-0">
                {String(currentIndex + 1).padStart(2, '0')} / {String(totalItems).padStart(2, '0')}
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeItem.slug || activeItem.id}
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 4 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? {} : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs sm:text-[13px] font-bold text-[#1E3A8A] truncate"
                >
                  {activeItem.title}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Center: Interactive Segmented Progress Dots */}
            <div
              className="flex flex-wrap items-center justify-center gap-1.5 max-w-full"
              role="tablist"
              aria-label={`${sectionId} carousel slide indicators`}
            >
              {items.map((it, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={it.slug || it.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Jump to ${it.title}`}
                    onClick={() => handleSelectItem(idx, true, false)}
                    className={`relative h-2.5 rounded-full overflow-hidden transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] ${
                      isActive
                        ? 'w-7 bg-[#DBEAFE]'
                        : 'w-2 bg-[#93C5FD]/60 hover:bg-[#2563EB]/70'
                    }`}
                  >
                    {isActive && (
                      <span
                        className="block h-full bg-[#1E3A8A] rounded-full transition-[width] duration-75 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right: Play/Pause + Prev/Next + All Items Link */}
            <div className="flex items-center justify-center gap-2 shrink-0 max-w-full">
              <button
                type="button"
                onClick={() => setIsPausedByUser((p) => !p)}
                aria-label={isPausedByUser ? 'Resume auto-slide' : 'Pause auto-slide'}
                title={isPausedByUser ? 'Resume auto-slide' : 'Pause auto-slide'}
                className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-white hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white border border-[#DBEAFE] flex items-center justify-center transition-colors cursor-pointer"
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
                aria-label="Previous slide"
                className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-white hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white border border-[#DBEAFE] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next slide"
                className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-white hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white border border-[#DBEAFE] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-[#DBEAFE] mx-0.5" aria-hidden="true" />

              <button
                type="button"
                onClick={onAllItemsClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>{allItemsLabel}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

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
  const serviceCarouselItems = useMemo<ShowcaseCarouselItem[]>(
    () =>
      CANONICAL_SERVICES.map((service) => ({
        id: service.id,
        slug: service.slug || service.id,
        title: service.title,
        category: service.category || 'Engineering',
        summary: service.summary || service.tagline,
        icon: getServiceIcon(service.slug || service.id),
        highlights: (service.capabilities || []).slice(0, 2).map((cap) => cap.title),
        stackLabel: 'Key Stack & Tools',
        tools: getToolsForService(service.slug || service.id)
          .slice(0, 4)
          .map((t) => ({
            name: t.name,
            icon: t.icon,
            brandColor: t.brandColor,
          })),
        ctaLabel: 'Explore Details',
        onCtaClick: () =>
          onNavigate(`/services/${service.slug || service.id}` as PageRoute),
      })),
    [onNavigate]
  );

  return (
    <ShowcaseCardCarouselSection
      sectionId="services"
      stageAnchorId="services-stage"
      eyebrow="What We Do · 13 Core Disciplines"
      heading="Services Built for Your Next Stage of Growth"
      subtitle="End-to-end engineering, AI, cloud, and growth solutions, all under one roof."
      items={serviceCarouselItems}
      allItemsLabel="All Services"
      onAllItemsClick={() => onNavigate('/services')}
      selectedSlug={selectedServiceSlug}
      onSelectSlug={onSelectServiceSlug}
      enableServiceHashSync={true}
    />
  );
};


