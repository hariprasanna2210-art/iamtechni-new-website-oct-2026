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
import { useSectionInView, useIsWindowScrolling } from '../../utils/useViewportActivity';

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
  /**
   * When true, mobile devices (< 768px) render all items vertically in a natural
   * page-scrolling stack instead of a horizontal auto-sliding carousel, while
   * tablet and desktop (>= 768px) preserve the full horizontal carousel unchanged.
   */
  mobileVerticalStack?: boolean;
}

// =========================================================================
// MOBILE SERVICES SECTION (< 768px)
// Preserves 100% identical visual design (pills row, card gradients, tags,
// counter, dots) while sliding one card at a time via CSS translateX (0.35s ease)
// every 3s with 36px edge-overlapping arrow buttons and passive touch swipe.
// =========================================================================
const MobileServicesSection: React.FC<ShowcaseCardCarouselSectionProps> = ({
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
  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const pillsTrackRef = useRef<HTMLDivElement | null>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isSectionInView = useSectionInView(sectionRef, '40px 0px', true);

  const [activeIndex, setActiveIndex] = useState(0);
  const [interactionRevision, setInteractionRevision] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState<boolean>(() =>
    typeof document !== 'undefined' ? document.hidden : false
  );

  const activeIndexRef = useRef(0);
  const onSelectSlugRef = useRef(onSelectSlug);
  const nextDelayMsRef = useRef<number>(2000);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const totalItems = items.length;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
    const item = items[activeIndex];
    if (item) {
      onSelectSlugRef.current?.(item.slug || item.id);
    }
  }, [activeIndex, items]);

  useEffect(() => {
    onSelectSlugRef.current = onSelectSlug;
  }, [onSelectSlug]);

  // Keep active quick-jump pill centered in the horizontal pills bar without affecting vertical scroll
  useEffect(() => {
    const activePill = pillRefs.current[activeIndex];
    const track = pillsTrackRef.current;
    if (activePill && track) {
      const left = activePill.offsetLeft - track.offsetWidth / 2 + activePill.offsetWidth / 2;
      track.scrollTo({
        left: Math.max(0, left),
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  }, [activeIndex, prefersReducedMotion]);

  // Pause when browser tab is hidden
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const goToIndex = useCallback(
    (targetIndex: number, pauseDurationMs = 3000) => {
      if (totalItems <= 0) return;
      const wrapped = ((targetIndex % totalItems) + totalItems) % totalItems;
      nextDelayMsRef.current = pauseDurationMs;
      setActiveIndex(wrapped);
      setInteractionRevision((r) => r + 1);
    },
    [totalItems]
  );

  const handlePrevArrow = useCallback(() => {
    goToIndex(activeIndexRef.current - 1, 3000);
  }, [goToIndex]);

  const handleNextArrow = useCallback(() => {
    goToIndex(activeIndexRef.current + 1, 3000);
  }, [goToIndex]);

  // Single timer for 2s auto-slide and 3s post-interaction pause (cleared on unmount)
  useEffect(() => {
    if (
      prefersReducedMotion ||
      !isSectionInView ||
      isTabHidden ||
      isTouching ||
      totalItems <= 1
    ) {
      return;
    }

    const delay = nextDelayMsRef.current;
    const timerId = window.setTimeout(() => {
      nextDelayMsRef.current = 2000;
      setActiveIndex((prev) => (prev + 1) % totalItems);
    }, delay);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [
    activeIndex,
    interactionRevision,
    prefersReducedMotion,
    isSectionInView,
    isTabHidden,
    isTouching,
    totalItems,
  ]);

  // Passive touchstart/touchend listeners with 40px horizontal threshold
  useEffect(() => {
    const el = viewportRef.current;
    if (!el || totalItems <= 1) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartXRef.current = e.touches[0].clientX;
        touchStartYRef.current = e.touches[0].clientY;
        setIsTouching(true);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartXRef.current !== null && e.changedTouches.length > 0) {
        const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
        const deltaY =
          touchStartYRef.current !== null
            ? e.changedTouches[0].clientY - touchStartYRef.current
            : 0;

        if (Math.abs(deltaX) >= 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
          nextDelayMsRef.current = 3000;
          if (deltaX < 0) {
            setActiveIndex((prev) => (prev + 1) % totalItems);
          } else {
            setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
          }
          setInteractionRevision((r) => r + 1);
        }
      }
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      setIsTouching(false);
    };

    const onTouchCancel = () => {
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      setIsTouching(false);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchCancel, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchCancel);
    };
  }, [totalItems]);

  // Handle URL hash sync (#services/<slug>) and hero card selection events
  useEffect(() => {
    if (!enableServiceHashSync && !selectedSlug) return;
    const findIndex = (slug: string) => {
      const clean = (slug || '').trim().toLowerCase();
      if (!clean) return -1;
      return items.findIndex(
        (s) =>
          (s.slug && s.slug.toLowerCase() === clean) ||
          (s.id && s.id.toLowerCase() === clean)
      );
    };

    if (selectedSlug) {
      const idx = findIndex(selectedSlug);
      if (idx !== -1 && idx !== activeIndexRef.current) {
        setActiveIndex(idx);
      }
    }

    if (!enableServiceHashSync || typeof window === 'undefined') return;

    const handleCustomSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ slug?: string }>;
      const slug = customEvent.detail?.slug;
      if (slug) {
        const idx = findIndex(slug);
        if (idx !== -1) {
          goToIndex(idx, 3000);
        }
      }
    };

    const handleHash = () => {
      const hash = window.location.hash || '';
      if (hash.startsWith('#services/')) {
        const slug = decodeURIComponent(hash.replace('#services/', '').trim());
        const idx = findIndex(slug);
        if (idx !== -1) {
          goToIndex(idx, 3000);
        }
      }
    };

    handleHash();
    window.addEventListener('iamtechni:select-service', handleCustomSelect);
    window.addEventListener('hashchange', handleHash);
    return () => {
      window.removeEventListener('iamtechni:select-service', handleCustomSelect);
      window.removeEventListener('hashchange', handleHash);
    };
  }, [enableServiceHashSync, selectedSlug, items, goToIndex]);

  if (totalItems === 0) return null;

  return (
    <motion.section
      ref={sectionRef}
      id={sectionId}
      aria-labelledby={`${sectionId}-section-title`}
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative w-full bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF] border-b border-[#DBEAFE] py-7 sm:py-10 overflow-hidden"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '1px 520px',
      }}
    >
      {stageAnchorId && <div id={stageAnchorId} className="sr-only" aria-hidden="true" />}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto px-4 mb-3.5">
          <div className="inline-flex items-center gap-2 h-[32px] px-3.5 rounded-full bg-white border border-[#DBEAFE] text-[#2563EB] font-mono text-[11px] font-bold tracking-widest uppercase mb-2 shadow-2xs">
            <span
              className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0"
              aria-hidden="true"
            />
            <span className="truncate">{eyebrow}</span>
          </div>

          <h2
            id={`${sectionId}-section-title`}
            className="!font-['Plus_Jakarta_Sans','Inter',sans-serif] text-[23px] min-[360px]:text-[26px] font-extrabold tracking-[-0.03em] text-[#1E3A8A] leading-[1.2] mb-1.5"
          >
            {heading}
          </h2>

          <p className="!font-['Inter','Plus_Jakarta_Sans',sans-serif] text-[13px] min-[360px]:text-[13.5px] text-slate-600 font-medium leading-[1.55]">
            {subtitle}
          </p>
        </div>

        {/* Service / Project Pills Row (Synced with Active Card; Tapping Jumps & Pauses for 3s) */}
        <div className="px-4 mb-3">
          <div
            ref={pillsTrackRef}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1"
            style={{ WebkitOverflowScrolling: 'touch' }}
            aria-label={sectionId === 'projects' ? 'Quick jump to project' : 'Quick jump to service'}
          >
            {items.map((it, idx) => {
              const formattedIdx = String(idx + 1).padStart(2, '0');
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={it.slug || it.id}
                  ref={(el) => {
                    pillRefs.current[idx] = el;
                  }}
                  type="button"
                  onClick={() => goToIndex(idx, 3000)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer border ${
                    isSelected
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                      : 'bg-white text-[#1E3A8A] border-[#DBEAFE] hover:bg-[#EEF4FF]'
                  }`}
                >
                  <span
                    className={`font-mono text-[10.5px] tabular-nums font-bold ${
                      isSelected ? 'text-[#93C5FD]' : 'text-[#2563EB]'
                    }`}
                  >
                    {formattedIdx}
                  </span>
                  <span>{it.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Single-Card Carousel Stage with 36px Edge-Overlapping White Circle Arrows */}
        <div className="px-5 py-1.5">
          <div className="relative w-full">
            {/* Left Arrow: 36px circle overlapping card's left edge by half its width (18px), 44px tap area */}
            <button
              type="button"
              onClick={handlePrevArrow}
              aria-label={sectionId === 'projects' ? 'Previous project' : 'Previous service'}
              className="absolute -left-[18px] top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white text-[#1E3A8A] hover:text-[#2563EB] active:text-[#2563EB] hover:scale-95 active:scale-95 transition-[transform,color] duration-150 flex items-center justify-center cursor-pointer after:content-[''] after:absolute after:-inset-[4px]"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            >
              <ChevronLeft className="w-4.5 h-4.5 stroke-[2.25]" />
            </button>

            {/* Right Arrow: 36px circle overlapping card's right edge by half its width (18px), 44px tap area */}
            <button
              type="button"
              onClick={handleNextArrow}
              aria-label={sectionId === 'projects' ? 'Next project' : 'Next service'}
              className="absolute -right-[18px] top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white text-[#1E3A8A] hover:text-[#2563EB] active:text-[#2563EB] hover:scale-95 active:scale-95 transition-[transform,color] duration-150 flex items-center justify-center cursor-pointer after:content-[''] after:absolute after:-inset-[4px]"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            >
              <ChevronRight className="w-4.5 h-4.5 stroke-[2.25]" />
            </button>

            {/* Card Viewport: One Card at a Time, Single CSS translateX Track (0.3s ease-out) */}
            <div
              ref={viewportRef}
              className="w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E3A8A]/95 via-[#1E3A8A]/90 to-[#2563EB]/90 border border-[#60A5FA]/40 shadow-[0_18px_38px_rgba(30,58,138,0.24),inset_0_1px_0_rgba(255,255,255,0.22)] touch-pan-y"
              role="region"
              aria-label={
                sectionId === 'projects'
                  ? 'Projects horizontal carousel'
                  : 'Services horizontal carousel'
              }
            >
              <div
                className="flex items-stretch w-full"
                style={{
                  transform: `translateX(-${activeIndex * 100}%)`,
                  transition: prefersReducedMotion
                    ? 'none'
                    : 'transform 0.3s ease-out',
                }}
              >
                {items.map((item, idx) => {
                  const isProjects = sectionId === 'projects';
                  const ItemIcon = item.icon;
                  const tools = (item.tools || []).slice(0, 3);
                  const keyHighlights = (item.highlights || []).slice(0, 2);
                  const formattedNumber = String(idx + 1).padStart(2, '0');
                  const formattedTotal = String(totalItems).padStart(2, '0');

                  return (
                    <article
                      key={item.slug || item.id}
                      id={`${sectionId}-mobile-card-${item.slug || item.id}`}
                      aria-hidden={idx !== activeIndex}
                      className={`group relative w-full shrink-0 ${
                        isProjects ? 'h-[416px]' : 'h-[304px]'
                      } flex flex-col justify-between p-5 overflow-hidden bg-gradient-to-br from-[#1E3A8A]/95 via-[#1E3A8A]/90 to-[#2563EB]/90`}
                    >
                      {/* Top Content Block: Icon Box + Number/Category + White Title + 3-Line Description (+ 2 Result Points for Projects) */}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between gap-2.5 mb-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/15 text-white border border-white/25 shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
                            <ItemIcon className="w-4.5 h-4.5" />
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-[#BFDBFE] min-w-0">
                            <span className="font-mono tabular-nums px-2 py-0.5 rounded-md bg-white/14 border border-white/20 text-white shrink-0">
                              {formattedNumber} / {formattedTotal}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="truncate max-w-[125px]">
                              {item.category || 'Engineering'}
                            </span>
                          </div>
                        </div>

                        <h3
                          className={`text-base font-bold leading-snug mb-2 text-white ${
                            isProjects ? 'line-clamp-2' : 'line-clamp-1'
                          }`}
                        >
                          {item.title}
                        </h3>

                        <p className="text-[13px] leading-relaxed line-clamp-3 text-blue-50/95">
                          {item.summary}
                        </p>

                        {isProjects && keyHighlights.length > 0 && (
                          <div className="space-y-1.5 mt-2.5 pt-2.5 border-t border-white/15">
                            {keyHighlights.map((highlight) => (
                              <div
                                key={highlight}
                                className="flex items-start gap-2 text-xs leading-snug"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-white mt-0.5" />
                                <span className="font-medium line-clamp-2 text-white/95">
                                  {highlight}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Bottom: KEY STACK Translucent Chips + White CTA Button */}
                      <div className="relative z-10 pt-3 border-t border-white/15 space-y-3">
                        {tools.length > 0 && (
                          <div>
                            <div className="text-[10px] uppercase font-bold tracking-wider mb-1.5 text-[#BFDBFE]">
                              {isProjects ? item.stackLabel || 'Key Stack & Tools' : 'KEY STACK'}
                            </div>
                            <div className="flex items-center flex-wrap gap-1.5">
                              {tools.map((tool) => {
                                const ToolIcon = tool.icon;
                                return (
                                  <div
                                    key={tool.name}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white/14 border border-white/20 text-white"
                                  >
                                    {ToolIcon && (
                                      <span
                                        style={{ color: '#93C5FD' }}
                                        className="shrink-0"
                                      >
                                        <ToolIcon className="w-3 h-3" />
                                      </span>
                                    )}
                                    <span className="truncate max-w-[85px]">{tool.name}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="pt-0.5">
                          <button
                            type="button"
                            tabIndex={idx === activeIndex ? 0 : -1}
                            onClick={() => item.onCtaClick()}
                            className="w-full inline-flex items-center justify-between gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-white text-[#1E3A8A] hover:bg-[#EEF4FF] text-xs font-bold shadow-xs transition-all duration-200 group/link cursor-pointer active:scale-[0.99]"
                          >
                            <span>{item.ctaLabel}</span>
                            <ArrowRight className="w-4 h-4 text-[#1E3A8A] shrink-0 transition-transform group-hover/link:translate-x-0.5" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Projects Dock (Counter + Project Title + Dots + All Projects) vs Services Row */}
        {sectionId === 'projects' ? (
          <div className="mx-4 mt-3 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-[#EEF4FF]/90 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.06)] flex flex-col gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-[#1E3A8A] text-white font-mono text-xs font-bold tabular-nums shrink-0">
                {String(activeIndex + 1).padStart(2, '0')} / {String(totalItems).padStart(2, '0')}
              </span>
              <span className="text-[13px] font-bold text-[#1E3A8A] truncate">
                {items[activeIndex]?.title}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div
                className="flex items-center gap-1.5"
                role="tablist"
                aria-label={`${sectionId} carousel slide indicators`}
              >
                {items.map((it, i) => (
                  <button
                    key={it.slug || it.id}
                    type="button"
                    role="tab"
                    aria-selected={i === activeIndex}
                    aria-label={`Jump to ${it.title}`}
                    onClick={() => goToIndex(i, 3000)}
                    className={`h-2 rounded-full transition-all duration-200 cursor-pointer p-0 border-0 ${
                      i === activeIndex
                        ? 'w-6 bg-[#1E3A8A]'
                        : 'w-2 bg-[#93C5FD]/60 hover:bg-[#2563EB]/70'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={onAllItemsClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>{allItemsLabel}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between px-4 mt-3">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1E3A8A] text-white font-mono text-xs font-bold tabular-nums">
              <span>{String(activeIndex + 1).padStart(2, '0')}</span>
              <span className="text-[#93C5FD]">/</span>
              <span>{String(totalItems).padStart(2, '0')}</span>
            </div>

            <div className="flex items-center gap-1" aria-hidden="true">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goToIndex(i, 3000)}
                  aria-label={`Go to service ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer p-0 border-0 ${
                    i === activeIndex
                      ? 'w-5 bg-[#1E3A8A]'
                      : 'w-1.5 bg-[#BFDBFE] hover:bg-[#93C5FD]'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={onAllItemsClick}
              className="inline-flex items-center gap-1 px-2 py-1 min-h-[44px] text-xs font-bold text-[#2563EB] hover:text-[#1E3A8A] cursor-pointer"
            >
              <span>{allItemsLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </motion.section>
  );
};

// =========================================================================
// DESKTOP & TABLET HORIZONTAL CAROUSEL (>= 768px)
// Preserved 100% untouched: styling, animations, controls, tabs, and behavior.
// =========================================================================
const DesktopShowcaseCarousel: React.FC<ShowcaseCardCarouselSectionProps> = ({
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
  const sectionRef = useRef<HTMLElement | null>(null);
  const isSectionInView = useSectionInView(sectionRef, '120px 0px', true);
  const isWindowScrolling = useIsWindowScrolling();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPausedByUser, setIsPausedByUser] = useState(false);

  // Pointer & touch drag/swipe tracking for desktop carousel
  const dragStartXRef = useRef<number | null>(null);
  const dragCurrentXRef = useRef<number | null>(null);
  const didDragMoveRef = useRef<boolean>(false);
  const isTouchInteractionRef = useRef<boolean>(false);

  const currentIndexRef = useRef<number>(0);
  const tabsScrollRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);
  const onSelectSlugRef = useRef(onSelectSlug);
  const lastSyncedSlugRef = useRef<string | undefined>(selectedSlug);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

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

  // Go to specific index and optionally sync URL hash
  const handleSelectItem = useCallback(
    (index: number, updateUrlAndParent = false, updateHash = false) => {
      if (totalItems === 0) return;
      const safeIndex = ((index % totalItems) + totalItems) % totalItems;
      currentIndexRef.current = safeIndex;
      setCurrentIndex(safeIndex);

      const item = items[safeIndex];
      if (item) {
        const slug = item.slug || item.id;
        lastSyncedSlugRef.current = slug;
        if (updateUrlAndParent) {
          onSelectSlugRef.current?.(slug);
        }
      }
    },
    [totalItems, items]
  );

  // Sync when selectedSlug prop changes externally
  useEffect(() => {
    if (!selectedSlug) return;
    if (selectedSlug === lastSyncedSlugRef.current) return;
    const matchedIdx = findItemIndexBySlug(selectedSlug);
    if (matchedIdx !== -1) {
      lastSyncedSlugRef.current = selectedSlug;
      currentIndexRef.current = matchedIdx;
      setCurrentIndex(matchedIdx);
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
          currentIndexRef.current = matchedIdx;
          setCurrentIndex(matchedIdx);
          onSelectSlugRef.current?.(targetSlug);
          if (scrollIntoViewOnInitial) {
            const fallbackSectionEl = document.getElementById(sectionId);
            fallbackSectionEl?.scrollIntoView({
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
          currentIndexRef.current = matchedIdx;
          setCurrentIndex(matchedIdx);
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
  }, [
    enableServiceHashSync,
    findItemIndexBySlug,
    items,
    prefersReducedMotion,
    sectionId,
  ]);

  const handlePrev = useCallback(() => {
    if (totalItems === 0) return;
    setCurrentIndex((prevIndex) => ((prevIndex - 1) % totalItems + totalItems) % totalItems);
  }, [totalItems]);

  const handleNext = useCallback(() => {
    if (totalItems === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
  }, [totalItems]);

  // Keep active tab scrolled into center on tablet/desktop without interrupting vertical scroll
  useEffect(() => {
    if (!isSectionInView || isWindowScrolling) return;
    if (activeTabRef.current && tabsScrollRef.current) {
      const container = tabsScrollRef.current;
      const tab = activeTabRef.current;
      const left = tab.offsetLeft - container.offsetWidth / 2 + tab.offsetWidth / 2;
      container.scrollTo({
        left: Math.max(0, left),
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  }, [currentIndex, prefersReducedMotion, isSectionInView, isWindowScrolling]);

  const isAutoSlideActive =
    isSectionInView &&
    !isWindowScrolling &&
    !isHovered &&
    !isTouching &&
    !isDragging &&
    !isPausedByUser &&
    !prefersReducedMotion &&
    totalItems > 1;

  // Single lightweight timeout per slide
  useEffect(() => {
    if (!isAutoSlideActive) return;

    const timerId = window.setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
    }, SLIDE_DURATION);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [currentIndex, isAutoSlideActive, totalItems]);

  // Unified Drag / Swipe handlers for desktop mouse
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
      ref={sectionRef}
      id={sectionId}
      aria-labelledby={`${sectionId}-section-title`}
      onKeyDown={handleKeyDown}
      className="relative w-full bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF] border-b border-[#DBEAFE]/80 scroll-mt-16 py-10 sm:py-18 lg:py-22 overflow-hidden"
    >
      {stageAnchorId && <div id={stageAnchorId} className="sr-only" aria-hidden="true" />}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===================================================================== */}
        {/* 1. MODERN SECTION HEADER                                              */}
        {/* ===================================================================== */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-4 mb-6 sm:mb-10">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 h-[32px] px-3 sm:px-4 max-w-full rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-[#2563EB] font-mono text-xs font-bold tracking-widest uppercase">
            <span
              className="w-2 h-2 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)] shrink-0"
              aria-hidden="true"
            />
            <span className="truncate">{eyebrow}</span>
          </div>

          {/* Section Title */}
          <motion.h2
            id={`${sectionId}-section-title`}
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="!font-['Plus_Jakarta_Sans','Inter',sans-serif] text-[28px] sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-[#1E3A8A] leading-[1.14] origin-center cursor-default"
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
          <p className="!font-['Inter','Plus_Jakarta_Sans',sans-serif] text-sm sm:text-base lg:text-[17px] text-slate-600 font-medium leading-[1.55] sm:leading-[1.68] max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* 2. DYNAMIC ICON + NUMBERED FILTER TRACK */}
        <div className="relative w-full max-w-5xl mx-auto mb-5 sm:mb-8">
          <div className="relative p-1.5 rounded-2xl bg-gradient-to-r from-[#EEF4FF]/90 via-[#F5F9FF]/95 to-[#ECFEFF]/85 backdrop-blur-md border border-[#DBEAFE]/90 shadow-[0_4px_20px_rgba(30,58,138,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] overflow-hidden">
            <div
              ref={tabsScrollRef}
              role="tablist"
              aria-label={`Filter ${sectionId} item`}
              className="flex items-center justify-start gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 max-w-full"
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
                        ? 'text-white font-bold shadow-[0_4px_12px_rgba(30,58,138,0.25)] bg-[#1E3A8A]'
                        : 'text-[#1E3A8A]/85 hover:text-[#1E3A8A] hover:bg-white/70'
                    }`}
                  >
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

        {/* 3. DYNAMIC LAYERED CAROUSEL STAGE */}
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
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-[#1E3A8A] border border-[#DBEAFE] hover:border-[#1E3A8A] text-[#1E3A8A] hover:text-white shadow-[0_6px_20px_rgba(30,58,138,0.14)] transition-all duration-200 cursor-pointer absolute -left-3 lg:-left-6 top-1/2 -translate-y-1/2 z-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>

          {/* Tablet & Desktop Right Round Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-[#1E3A8A] border border-[#DBEAFE] hover:border-[#1E3A8A] text-[#1E3A8A] hover:text-white shadow-[0_6px_20px_rgba(30,58,138,0.14)] transition-all duration-200 cursor-pointer absolute -right-3 lg:-right-6 top-1/2 -translate-y-1/2 z-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]"
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>

          {/* Draggable Carousel Track */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            className={`relative w-full py-4 sm:py-6 select-none touch-pan-y ${
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
                  <div
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
                      className={`group relative h-full flex flex-col justify-between p-4 sm:p-5 rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-[400ms] ease-out ${
                        isCenter
                          ? 'bg-gradient-to-br from-[#1E3A8A]/95 via-[#1E3A8A]/90 to-[#2563EB]/90 border border-[#60A5FA]/40 shadow-[0_18px_38px_rgba(30,58,138,0.24),inset_0_1px_0_rgba(255,255,255,0.22)] -translate-y-1'
                          : 'bg-gradient-to-br from-[#FFFFFF] via-[#F8FBFF] to-[#EEF4FF]/85 border border-[#DBEAFE] shadow-[0_6px_20px_rgba(30,58,138,0.06),inset_0_1px_0_rgba(255,255,255,0.95)] hover:border-[#93C5FD]'
                      }`}
                    >
                      {/* Live Top Progress Bar inside Active Card */}
                      {isCenter && (
                        <div
                          aria-hidden="true"
                          className="absolute top-0 left-0 right-0 h-1 bg-white/15 overflow-hidden"
                        >
                          {isAutoSlideActive && (
                            <div
                              key={`bar-${currentIndex}`}
                              style={{ animationDuration: `${SLIDE_DURATION}ms` }}
                              className="h-full w-full bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#93C5FD] animate-progress-scale"
                            />
                          )}
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
                        {/* Header Row */}
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
                          className={`text-[13px] sm:text-xs lg:text-[13px] leading-relaxed line-clamp-2 mb-3 transition-colors duration-[400ms] ${
                            isCenter
                              ? 'text-blue-50/95'
                              : 'text-slate-600 font-medium'
                          }`}
                        >
                          {item.summary}
                        </p>

                        {/* Key Highlights (2 items) */}
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
                              {tools.map((tool, tIdx) => {
                                const ToolIcon = tool.icon;
                                return (
                                  <div
                                    key={tool.name}
                                    title={tool.name}
                                    className={`${
                                      tIdx >= 3 ? 'hidden sm:inline-flex' : 'inline-flex'
                                    } items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors duration-[400ms] ${
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
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. DYNAMIC INTERACTIVE PLAYBACK & PROGRESS DOCK */}
          <div className="mt-5 flex flex-row items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#EEF4FF]/90 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.06)] max-w-3xl mx-auto">
            {/* Left: Active Item Counter & Dynamic Title */}
            <div className="flex items-center justify-start gap-2 min-w-0 max-w-full">
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
                  className="text-[13px] font-bold text-[#1E3A8A] truncate"
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
                        key={`dot-${currentIndex}-${isAutoSlideActive ? 'run' : 'pause'}`}
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

            {/* Right: Play/Pause + Prev/Next + All Items Link */}
            <div className="flex items-center justify-center gap-2 shrink-0 max-w-full">
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
                aria-label="Previous slide"
                className="flex w-8 h-8 rounded-lg bg-white hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white border border-[#DBEAFE] items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next slide"
                className="flex w-8 h-8 rounded-lg bg-white hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white border border-[#DBEAFE] items-center justify-center transition-colors cursor-pointer"
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

// =========================================================================
// SHOWCASE CARD CAROUSEL DISPATCHER
// Conditionally renders lightweight native swipe row on mobile (< 768px)
// and full-featured desktop carousel on desktop (>= 768px). Only ONE mounts!
// =========================================================================
export const ShowcaseCardCarouselSection: React.FC<ShowcaseCardCarouselSectionProps> = (props) => {
  const [isDesktopOrTablet, setIsDesktopOrTablet] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(min-width: 768px)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(min-width: 768px)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDesktopOrTablet(e.matches);
    };
    setIsDesktopOrTablet(mql.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  // On mobile (< 768px), mount only the lightweight mobile carousel
  if (!isDesktopOrTablet) {
    return <MobileServicesSection {...props} />;
  }

  return <DesktopShowcaseCarousel {...props} />;
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
      mobileVerticalStack={true}
    />
  );
};
