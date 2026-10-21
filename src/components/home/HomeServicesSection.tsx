import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [isDragging, setIsDragging] = useState(false);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [progress, setProgress] = useState(0);

  // Pointer & touch drag/swipe tracking for desktop and mobile
  const dragStartXRef = useRef<number | null>(null);
  const dragCurrentXRef = useRef<number | null>(null);
  const didDragMoveRef = useRef<boolean>(false);

  const tabsScrollRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  const totalServices = CANONICAL_SERVICES.length;
  const SLIDE_DURATION = 4000; // 4 seconds per slide

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
    (index: number, updateUrlAndParent = false, updateHash = false) => {
      const safeIndex = (index + totalServices) % totalServices;
      setCurrentIndex(safeIndex);
      setProgress(0);

      if (updateUrlAndParent) {
        const svc = CANONICAL_SERVICES[safeIndex];
        if (svc) {
          const slug = svc.slug || svc.id;
          onSelectServiceSlug?.(slug);
          if (updateHash && typeof window !== 'undefined') {
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
    if (matchedIdx !== -1 && matchedIdx !== currentIndex) {
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
    handleSelectService(currentIndex - 1, true, false);
  }, [currentIndex, handleSelectService]);

  const handleNext = useCallback(() => {
    handleSelectService(currentIndex + 1, true, false);
  }, [currentIndex, handleSelectService]);

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

  // Auto-play interval + progress bar animation (resets every 4 seconds, pauses on hover, drag, or user pause)
  useEffect(() => {
    if (isHovered || isDragging || isPausedByUser || prefersReducedMotion) return;

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
  }, [isHovered, isDragging, isPausedByUser, totalServices, prefersReducedMotion]);

  // Unified Drag / Swipe handlers for both desktop mouse and mobile touch
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
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

  const finishDrag = () => {
    if (!isDragging) return;
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
    window.setTimeout(() => {
      didDragMoveRef.current = false;
    }, 50);
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  const activeService = CANONICAL_SERVICES[currentIndex] || CANONICAL_SERVICES[0];

  return (
    <section
      id="services"
      aria-labelledby="services-section-title"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (isDragging) finishDrag();
      }}
      className="relative w-full py-14 sm:py-18 lg:py-22 bg-gradient-to-b from-[#F8FAFF] via-[#F2F7FF] to-[#FFFFFF] border-b border-[#DBEAFE]/80 overflow-hidden scroll-mt-16"
    >
      <div id="services-stage" className="sr-only" aria-hidden="true" />

      {/* Dynamic Ambient Mesh Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 18%, rgba(30, 58, 138, 0.07) 0%, rgba(37, 99, 235, 0.04) 42%, transparent 72%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[680px] h-[260px] rounded-full bg-gradient-to-r from-[#DBEAFE]/45 via-[#E0E7FF]/35 to-[#CFFAFE]/35 blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===================================================================== */}
        {/* 1. MODERN SECTION HEADER (Exact Font Design from Reference Image)     */}
        {/* ===================================================================== */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4 mb-8 sm:mb-10">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 h-[32px] px-3 sm:px-4 max-w-full rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-[#1266E8] font-mono text-[10.5px] min-[360px]:text-xs font-bold tracking-widest uppercase">
            <span
              className="w-2 h-2 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)] shrink-0"
              aria-hidden="true"
            />
            <span className="truncate">What We Do · 13 Core Disciplines</span>
          </div>

          {/* Section Title (Hero Section Heading Color #1E3A8A + drop shadow, Plus Jakarta Sans Extrabold, tight tracking, with hover zoom-in/zoom-out) */}
          <motion.h2
            id="services-section-title"
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="!font-['Plus_Jakarta_Sans','Inter',sans-serif] text-[26px] min-[360px]:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-[#1E3A8A] leading-[1.12] origin-center cursor-default"
          >
            {['Services', 'Built', 'for', 'Your', 'Next', 'Stage', 'of', 'Growth'].map(
              (word, i, arr) => {
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
              }
            )}
          </motion.h2>

          {/* Subtitle Paragraph (Clean Inter / Plus Jakarta Sans Regular #374151, matching reference image) */}
          <p className="!font-['Inter','Plus_Jakarta_Sans',sans-serif] text-sm min-[360px]:text-base sm:text-[17px] text-[#374151] font-normal leading-[1.65] max-w-2xl mx-auto">
            End-to-end engineering, AI, cloud, and growth solutions, all under one roof.
          </p>
        </div>

        {/* ===================================================================== */}
        {/* 2. DYNAMIC ICON + NUMBERED FILTER TRACK                               */}
        {/* ===================================================================== */}
        <div className="relative w-full max-w-5xl mx-auto mb-6 sm:mb-8">
          <div className="p-1.5 rounded-2xl bg-gradient-to-r from-[#EEF4FF]/90 via-[#F5F9FF]/95 to-[#ECFEFF]/85 backdrop-blur-md border border-[#DBEAFE]/90 shadow-[0_4px_20px_rgba(30,58,138,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div
              ref={tabsScrollRef}
              role="tablist"
              aria-label="Filter service by category"
              className="flex items-center justify-start gap-1.5 overflow-x-auto scrollbar-none py-1 px-1 max-w-full"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {CANONICAL_SERVICES.map((service, index) => {
                const isActive = index === currentIndex;
                const TabIcon = getServiceIcon(service.slug || service.id);
                const formattedIdx = String(index + 1).padStart(2, '0');

                return (
                  <button
                    key={service.slug || service.id}
                    ref={isActive ? activeTabRef : null}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`service-card-${service.slug || service.id}`}
                    onClick={() => handleSelectService(index, true, true)}
                    className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] ${
                      isActive
                        ? 'text-white font-bold'
                        : 'text-[#1E3A8A]/85 hover:text-[#1E3A8A] hover:bg-white/70'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeServiceTabPill"
                        className="absolute inset-0 rounded-xl bg-[#1E3A8A] shadow-[0_4px_12px_rgba(30,58,138,0.25)] z-0"
                        transition={{
                          type: 'spring',
                          bounce: 0.18,
                          duration: prefersReducedMotion ? 0 : 0.38,
                        }}
                      />
                    )}
                    <span
                      className={`relative z-10 text-[10px] font-mono tabular-nums ${
                        isActive ? 'text-[#93C5FD]' : 'text-[#2563EB]/70'
                      }`}
                    >
                      {formattedIdx}
                    </span>
                    <TabIcon
                      className={`relative z-10 w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-white' : 'text-[#2563EB]'
                      }`}
                    />
                    <span className="relative z-10">{service.title}</span>
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
        {/*    - Mobile (<md): 1 centered active card                             */}
        {/* ===================================================================== */}
        <div className="relative w-full max-w-5xl mx-auto">
          {/* Desktop Edge Fade Gradients over the Peeking Cards */}
          <div
            aria-hidden="true"
            className="hidden lg:block pointer-events-none absolute inset-y-0 -left-44 w-48 bg-gradient-to-r from-[#F5F9FF] via-[#F5F9FF]/85 to-transparent z-20"
          />
          <div
            aria-hidden="true"
            className="hidden lg:block pointer-events-none absolute inset-y-0 -right-44 w-48 bg-gradient-to-l from-[#F5F9FF] via-[#F5F9FF]/85 to-transparent z-20"
          />

          {/* Tablet & Desktop Left Round Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous service"
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-[#1E3A8A] border border-[#DBEAFE] hover:border-[#1E3A8A] text-[#1E3A8A] hover:text-white shadow-[0_6px_20px_rgba(30,58,138,0.14)] transition-all duration-200 cursor-pointer absolute -left-3 lg:-left-6 top-1/2 -translate-y-1/2 z-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>

          {/* Tablet & Desktop Right Round Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next service"
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
            className={`relative w-full py-4 sm:py-6 select-none touch-pan-y ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 items-stretch lg:w-[152%] xl:w-[156%] lg:relative lg:left-1/2 lg:-translate-x-1/2">
              {[-2, -1, 0, 1, 2].map((offset) => {
                const targetIndex =
                  (currentIndex + offset + totalServices) % totalServices;
                const service = CANONICAL_SERVICES[targetIndex];
                if (!service) return null;

                const isCenter = offset === 0;
                const isPeek = offset === -2 || offset === 2;
                const ServiceIcon = getServiceIcon(service.slug || service.id);
                const tools = getToolsForService(service.slug || service.id).slice(0, 4);
                const keyCapabilities = (service.capabilities || []).slice(0, 2);
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
                    key={service.slug || service.id}
                    id={isCenter ? `service-card-${service.slug || service.id}` : undefined}
                    onClick={() => {
                      if (didDragMoveRef.current) return;
                      if (!isCenter) {
                        handleSelectService(targetIndex, true, false);
                      }
                    }}
                    className={`h-full w-full max-w-[305px] sm:max-w-[315px] mx-auto flex flex-col transition-[transform,opacity] duration-[400ms] ease-out ${visibilityClasses} ${
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
                          ? 'bg-gradient-to-br from-[#1E3A8A]/92 via-[#1E3A8A]/86 to-[#2563EB]/85 border border-[#60A5FA]/40 shadow-[0_18px_38px_rgba(30,58,138,0.24),inset_0_1px_0_rgba(255,255,255,0.22)] -translate-y-1'
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
                            className="h-full bg-gradient-to-r from-[#93C5FD] via-[#FFFFFF] to-[#60A5FA] transition-[width] duration-75 ease-linear"
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
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                              isCenter
                                ? 'bg-white/15 text-white border border-white/25 shadow-[0_4px_12px_rgba(0,0,0,0.12)]'
                                : 'bg-gradient-to-br from-[#EEF4FF] to-[#DBEAFE]/80 text-[#1E3A8A] border border-[#DBEAFE]'
                            }`}
                          >
                            <ServiceIcon className="w-4.5 h-4.5" />
                          </div>

                          <div
                            className={`flex items-center gap-1.5 text-[10.5px] font-bold tracking-wide transition-colors duration-[400ms] ${
                              isCenter ? 'text-[#BFDBFE]' : 'text-[#2563EB]'
                            }`}
                          >
                            <span className="font-mono tabular-nums opacity-80">
                              {formattedNumber}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{service.category || 'Engineering'}</span>
                          </div>
                        </div>

                        {/* Card Title */}
                        <h3
                          className={`text-[15px] sm:text-[16px] font-bold leading-snug mb-1.5 transition-colors duration-[400ms] ${
                            isCenter
                              ? 'text-white'
                              : 'text-[#1E3A8A] group-hover:text-[#2563EB]'
                          }`}
                        >
                          {service.title}
                        </h3>

                        {/* Concise Description */}
                        <p
                          className={`text-xs leading-relaxed line-clamp-2 mb-3 transition-colors duration-[400ms] ${
                            isCenter ? 'text-[#E2E8F0]' : 'text-slate-600'
                          }`}
                        >
                          {service.summary || service.tagline}
                        </p>

                        {/* Dynamic Core Capabilities List (2 key capabilities) */}
                        {keyCapabilities.length > 0 && (
                          <div
                            className={`space-y-1.5 mb-3 pt-2.5 border-t transition-colors duration-[400ms] ${
                              isCenter ? 'border-white/12' : 'border-[#DBEAFE]/70'
                            }`}
                          >
                            {keyCapabilities.map((cap) => (
                              <div
                                key={cap.title}
                                className="flex items-center gap-1.5 text-[11px] leading-tight"
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
                                  {cap.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Bottom: Key Stack & Tools + Action Row */}
                      <div
                        className={`relative z-10 pt-2.5 border-t space-y-2.5 transition-colors duration-[400ms] ${
                          isCenter ? 'border-white/15' : 'border-[#DBEAFE]/80'
                        }`}
                      >
                        {tools.length > 0 && (
                          <div>
                            <div
                              className={`text-[9.5px] uppercase font-bold tracking-wider mb-1.5 transition-colors duration-[400ms] ${
                                isCenter ? 'text-[#BFDBFE]' : 'text-[#2563EB]/85'
                              }`}
                            >
                              Key Stack &amp; Tools
                            </div>
                            <div className="flex items-center flex-wrap gap-1">
                              {tools.map((tool) => {
                                const ToolIcon = tool.icon;
                                return (
                                  <div
                                    key={tool.name}
                                    title={tool.name}
                                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10.5px] font-semibold transition-colors duration-[400ms] ${
                                      isCenter
                                        ? 'bg-white/12 border border-white/18 text-white'
                                        : 'bg-white border border-[#DBEAFE] text-[#1E3A8A] shadow-2xs'
                                    }`}
                                  >
                                    <span
                                      style={{
                                        color: isCenter ? '#93C5FD' : tool.brandColor,
                                      }}
                                    >
                                      <ToolIcon className="w-3 h-3" />
                                    </span>
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
                              onNavigate(
                                `/services/${service.slug || service.id}` as PageRoute
                              );
                            }}
                            className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all duration-200 group/link cursor-pointer ${
                              isCenter
                                ? 'px-3 py-1.5 rounded-lg bg-white text-[#1E3A8A] hover:bg-[#EEF4FF] shadow-xs'
                                : 'text-[#1E3A8A] hover:text-[#2563EB]'
                            }`}
                          >
                            <span>Explore Details</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
                          </button>

                          {!isCenter && (
                            <span className="text-[10px] font-semibold text-[#2563EB]/75 group-hover:text-[#2563EB] transition-colors">
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
          </div>

          {/* =================================================================== */}
          {/* 4. DYNAMIC INTERACTIVE PLAYBACK & PROGRESS DOCK                     */}
          {/* =================================================================== */}
          <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#EEF4FF]/90 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.06)] max-w-3xl mx-auto">
            {/* Left: Active Service Counter & Dynamic Title */}
            <div className="flex items-center justify-center sm:justify-start gap-2 min-w-0 max-w-full">
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#1E3A8A] text-white font-mono text-[11px] font-bold tabular-nums shrink-0">
                {String(currentIndex + 1).padStart(2, '0')} / {String(totalServices).padStart(2, '0')}
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeService.slug || activeService.id}
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 4 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? {} : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs font-bold text-[#1E3A8A] truncate"
                >
                  {activeService.title}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Center: Interactive Segmented Progress Dots */}
            <div
              className="flex flex-wrap items-center justify-center gap-1 min-[360px]:gap-1.5 max-w-full"
              role="tablist"
              aria-label="Service carousel slide indicators"
            >
              {CANONICAL_SERVICES.map((svc, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={svc.slug || svc.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Jump to ${svc.title}`}
                    onClick={() => handleSelectService(idx, true, false)}
                    className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] ${
                      isActive
                        ? 'w-6 min-[360px]:w-7 bg-[#DBEAFE]'
                        : 'w-1.5 min-[360px]:w-2 bg-[#93C5FD]/60 hover:bg-[#2563EB]/70'
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

            {/* Right: Play/Pause + Prev/Next + All Services Link */}
            <div className="flex items-center justify-center gap-1.5 shrink-0 max-w-full">
              <button
                type="button"
                onClick={() => setIsPausedByUser((p) => !p)}
                aria-label={isPausedByUser ? 'Resume auto-slide' : 'Pause auto-slide'}
                title={isPausedByUser ? 'Resume auto-slide' : 'Pause auto-slide'}
                className="w-7 h-7 rounded-lg bg-white hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white border border-[#DBEAFE] flex items-center justify-center transition-colors cursor-pointer"
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
                aria-label="Previous service"
                className="w-7 h-7 rounded-lg bg-white hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white border border-[#DBEAFE] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next service"
                className="w-7 h-7 rounded-lg bg-white hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white border border-[#DBEAFE] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <div className="w-px h-4 bg-[#DBEAFE] mx-0.5" aria-hidden="true" />

              <button
                type="button"
                onClick={() => onNavigate('/services')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 text-white text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                <Layers className="w-3 h-3 shrink-0" />
                <span>All Services</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

