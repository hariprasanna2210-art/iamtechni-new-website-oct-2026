import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { IndustryItem, PageRoute } from '../../types';
import { industriesData } from '../../data/industriesData';
import { getIndustryIcon } from '../../utils/serviceIcons';
import { IndustryIllustration } from '../common/TechIllustrations';

interface BusinessChallengesShowcaseProps {
  onNavigate: (route: PageRoute) => void;
}

interface AccentTheme {
  name: string;
  cardGradient: string;
  ambientGlow: string;
  cardBorder: string;
  iconCircleBg: string;
  iconCircleRing: string;
  iconText: string;
  sectorBadgeBg: string;
  sectorBadgeText: string;
  sectorBadgeBorder: string;
  buttonBorder: string;
  buttonHoverBg: string;
  buttonText: string;
  progressFill: string;
  visualCardBg: string;
  visualCardBorder: string;
  chipBg: string;
  chipText: string;
  chipBorder: string;
}

const ACCENT_THEMES: AccentTheme[] = [
  // 01: Soft Green (like video slide 1)
  {
    name: 'emerald',
    cardGradient:
      'from-[#EAFBF2] via-[#F4FDF8] to-[#FFFFFF]',
    ambientGlow: 'bg-emerald-300/35',
    cardBorder: 'border-emerald-200/80',
    iconCircleBg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
    iconCircleRing: 'ring-8 ring-emerald-400/20 shadow-[0_8px_24px_rgba(16,185,129,0.28)]',
    iconText: 'text-white',
    sectorBadgeBg: 'bg-emerald-500/10',
    sectorBadgeText: 'text-emerald-800',
    sectorBadgeBorder: 'border-emerald-300/70',
    buttonBorder: 'border-emerald-300/90',
    buttonHoverBg: 'hover:bg-emerald-500/10',
    buttonText: 'text-emerald-900',
    progressFill: 'bg-emerald-500',
    visualCardBg: 'from-emerald-500/10 via-white to-teal-500/10',
    visualCardBorder: 'border-emerald-200/90',
    chipBg: 'bg-emerald-50',
    chipText: 'text-emerald-800',
    chipBorder: 'border-emerald-200',
  },
  // 02: Soft Coral / Red (like video slide 2)
  {
    name: 'rose',
    cardGradient:
      'from-[#FFEFF1] via-[#FFF7F8] to-[#FFFFFF]',
    ambientGlow: 'bg-rose-300/35',
    cardBorder: 'border-rose-200/80',
    iconCircleBg: 'bg-gradient-to-br from-rose-400 to-rose-600',
    iconCircleRing: 'ring-8 ring-rose-400/20 shadow-[0_8px_24px_rgba(244,63,94,0.28)]',
    iconText: 'text-white',
    sectorBadgeBg: 'bg-rose-500/10',
    sectorBadgeText: 'text-rose-800',
    sectorBadgeBorder: 'border-rose-300/70',
    buttonBorder: 'border-rose-300/90',
    buttonHoverBg: 'hover:bg-rose-500/10',
    buttonText: 'text-rose-900',
    progressFill: 'bg-rose-500',
    visualCardBg: 'from-rose-500/10 via-white to-orange-500/10',
    visualCardBorder: 'border-rose-200/90',
    chipBg: 'bg-rose-50',
    chipText: 'text-rose-800',
    chipBorder: 'border-rose-200',
  },
  // 03: Soft Warm Yellow / Amber (like video slide 3)
  {
    name: 'amber',
    cardGradient:
      'from-[#FEF9E6] via-[#FFFDF4] to-[#FFFFFF]',
    ambientGlow: 'bg-amber-300/35',
    cardBorder: 'border-amber-200/80',
    iconCircleBg: 'bg-gradient-to-br from-amber-400 to-amber-500',
    iconCircleRing: 'ring-8 ring-amber-400/25 shadow-[0_8px_24px_rgba(245,158,11,0.28)]',
    iconText: 'text-white',
    sectorBadgeBg: 'bg-amber-500/15',
    sectorBadgeText: 'text-amber-900',
    sectorBadgeBorder: 'border-amber-300/80',
    buttonBorder: 'border-amber-300/90',
    buttonHoverBg: 'hover:bg-amber-500/10',
    buttonText: 'text-amber-950',
    progressFill: 'bg-amber-500',
    visualCardBg: 'from-amber-500/10 via-white to-yellow-500/10',
    visualCardBorder: 'border-amber-200/90',
    chipBg: 'bg-amber-50',
    chipText: 'text-amber-900',
    chipBorder: 'border-amber-200',
  },
  // 04: Soft Blue (like video slide 4)
  {
    name: 'blue',
    cardGradient:
      'from-[#EAF3FF] via-[#F5F9FF] to-[#FFFFFF]',
    ambientGlow: 'bg-blue-300/35',
    cardBorder: 'border-blue-200/80',
    iconCircleBg: 'bg-gradient-to-br from-[#2563EB] to-[#1E3A8A]',
    iconCircleRing: 'ring-8 ring-blue-400/20 shadow-[0_8px_24px_rgba(37,99,235,0.28)]',
    iconText: 'text-white',
    sectorBadgeBg: 'bg-blue-500/10',
    sectorBadgeText: 'text-[#1E3A8A]',
    sectorBadgeBorder: 'border-blue-300/70',
    buttonBorder: 'border-blue-300/90',
    buttonHoverBg: 'hover:bg-blue-500/10',
    buttonText: 'text-[#1E3A8A]',
    progressFill: 'bg-[#2563EB]',
    visualCardBg: 'from-blue-500/10 via-white to-indigo-500/10',
    visualCardBorder: 'border-blue-200/90',
    chipBg: 'bg-blue-50',
    chipText: 'text-[#1E3A8A]',
    chipBorder: 'border-blue-200',
  },
  // 05: Soft Indigo / Violet
  {
    name: 'indigo',
    cardGradient:
      'from-[#EEF0FF] via-[#F7F8FF] to-[#FFFFFF]',
    ambientGlow: 'bg-indigo-300/35',
    cardBorder: 'border-indigo-200/80',
    iconCircleBg: 'bg-gradient-to-br from-indigo-500 to-violet-600',
    iconCircleRing: 'ring-8 ring-indigo-400/20 shadow-[0_8px_24px_rgba(99,102,241,0.28)]',
    iconText: 'text-white',
    sectorBadgeBg: 'bg-indigo-500/10',
    sectorBadgeText: 'text-indigo-900',
    sectorBadgeBorder: 'border-indigo-300/70',
    buttonBorder: 'border-indigo-300/90',
    buttonHoverBg: 'hover:bg-indigo-500/10',
    buttonText: 'text-indigo-950',
    progressFill: 'bg-indigo-500',
    visualCardBg: 'from-indigo-500/10 via-white to-violet-500/10',
    visualCardBorder: 'border-indigo-200/90',
    chipBg: 'bg-indigo-50',
    chipText: 'text-indigo-900',
    chipBorder: 'border-indigo-200',
  },
  // 06: Soft Cyan / Teal
  {
    name: 'cyan',
    cardGradient:
      'from-[#E6FAFD] via-[#F3FCFE] to-[#FFFFFF]',
    ambientGlow: 'bg-cyan-300/35',
    cardBorder: 'border-cyan-200/80',
    iconCircleBg: 'bg-gradient-to-br from-cyan-500 to-teal-600',
    iconCircleRing: 'ring-8 ring-cyan-400/20 shadow-[0_8px_24px_rgba(6,182,212,0.28)]',
    iconText: 'text-white',
    sectorBadgeBg: 'bg-cyan-500/10',
    sectorBadgeText: 'text-cyan-900',
    sectorBadgeBorder: 'border-cyan-300/70',
    buttonBorder: 'border-cyan-300/90',
    buttonHoverBg: 'hover:bg-cyan-500/10',
    buttonText: 'text-cyan-950',
    progressFill: 'bg-cyan-600',
    visualCardBg: 'from-cyan-500/10 via-white to-teal-500/10',
    visualCardBorder: 'border-cyan-200/90',
    chipBg: 'bg-cyan-50',
    chipText: 'text-cyan-900',
    chipBorder: 'border-cyan-200',
  },
];

const AUTO_CHANGE_MS = 3800;
const CARD_TRANSITION_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const BusinessChallengesShowcase: React.FC<BusinessChallengesShowcaseProps> = ({
  onNavigate,
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const items: IndustryItem[] = industriesData.slice(0, 6);

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPausedByHoverOrFocus, setIsPausedByHoverOrFocus] = useState(false);
  const stoppedByUserAction = false;

  const touchStartXRef = useRef<number | null>(null);

  const totalItems = items.length;
  const currentItem = items[activeIndex];
  const nextIndex = (activeIndex + 1) % totalItems;
  const nextItem = items[nextIndex];

  const currentTheme = ACCENT_THEMES[activeIndex % ACCENT_THEMES.length];
  const nextTheme = ACCENT_THEMES[nextIndex % ACCENT_THEMES.length];

  const CurrentIcon = getIndustryIcon(currentItem.name);
  const NextIcon = getIndustryIcon(nextItem.name);

  const goToIndex = useCallback(
    (index: number, _fromUserInteraction = false) => {
      const normalized = ((index % totalItems) + totalItems) % totalItems;
      setActiveIndex(normalized);
      setProgress(0);
    },
    [totalItems]
  );

  const handleNext = useCallback(
    (fromUserInteraction = false) => {
      goToIndex(activeIndex + 1, fromUserInteraction);
    },
    [activeIndex, goToIndex]
  );

  const handlePrev = useCallback(
    (fromUserInteraction = false) => {
      goToIndex(activeIndex - 1, fromUserInteraction);
    },
    [activeIndex, goToIndex]
  );

  // Fast auto-change every 2 seconds (pauses when hovering over the card)
  useEffect(() => {
    if (isPausedByHoverOrFocus) {
      return;
    }

    const tickMs = 40;
    const step = (tickMs / AUTO_CHANGE_MS) * 100;

    const timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          return 100;
        }
        return prev + step;
      });
    }, tickMs);

    return () => window.clearInterval(timer);
  }, [isPausedByHoverOrFocus, activeIndex]);

  useEffect(() => {
    if (progress >= 100 && !isPausedByHoverOrFocus) {
      handleNext(false);
    }
  }, [progress, isPausedByHoverOrFocus, handleNext]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const deltaX = endX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        handleNext(true);
      } else {
        handlePrev(true);
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF] border-b border-slate-200 overflow-hidden">
      {/* Full SEO DOM Content for all 6 items so search engines index every item */}
      <div className="sr-only" aria-hidden="false">
        {items.map((ind, idx) => (
          <div key={ind.id}>
            <span>SECTOR 0{idx + 1}</span>
            <h3>{ind.name}</h3>
            <p>{ind.summary}</p>
            <div>Core Challenge Addressed: {ind.coreChallenges[0]}</div>
            <span>Explore Industry Solutions</span>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + Subheading + View All Industries Link */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 h-[34px] px-3 sm:px-4 mb-3 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 backdrop-blur-md border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-xs font-mono uppercase tracking-widest text-[#2563EB] font-bold">
              <span
                className="w-2 h-2 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)] shrink-0"
                aria-hidden="true"
              />
              <span>Domain Solutions</span>
            </div>

            <motion.h2
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl lg:text-[36px] xl:text-[40px] font-bold tracking-[-0.015em] text-[#1E3A8A] leading-[1.2] origin-left cursor-default"
            >
              {['Technology', 'for', 'different', 'business', 'challenges.'].map(
                (word, i, arr) => {
                  const isLast = i === arr.length - 1;
                  return (
                    <React.Fragment key={`${word}-${i}`}>
                      <motion.span
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
                        whileInView={
                          prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }
                        }
                        viewport={{ once: true }}
                        whileHover={
                          prefersReducedMotion
                            ? {}
                            : {
                                scale: 1.07,
                                transition: { duration: 0.22, ease: 'easeOut' },
                              }
                        }
                        transition={{
                          duration: 0.4,
                          delay: prefersReducedMotion ? 0 : 0.05 * i,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className={`inline-block text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.12)] hover:drop-shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-shadow duration-200 ${
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

            <p className="text-[15px] sm:text-base lg:text-[17px] text-slate-600 font-medium mt-3 leading-relaxed max-w-2xl">
              We design and engineer digital systems tailored to the exact regulatory, workflow, and customer contexts of your industry.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/industries')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-5 sm:py-2.5 min-h-[42px] sm:min-h-[44px] rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white font-semibold text-xs sm:text-[13px] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-all duration-200 active:scale-[0.98] cursor-pointer self-start md:self-auto shrink-0"
          >
            <span>View All Industries</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* ================================================================= */}
        {/* MAIN STACKED SHOWCASE CARD                                        */}
        {/* ================================================================= */}
        <div
          onMouseEnter={() => setIsPausedByHoverOrFocus(true)}
          onMouseLeave={() => setIsPausedByHoverOrFocus(false)}
          onFocusCapture={() => setIsPausedByHoverOrFocus(true)}
          onBlurCapture={() => setIsPausedByHoverOrFocus(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          aria-live="polite"
          className="relative max-w-7xl mx-auto"
        >
          {/* Outer Showcase Card Shell with Crossfading Soft Tinted Gradient */}
          <div
            className={`relative min-h-[440px] sm:min-h-[460px] rounded-[28px] border ${currentTheme.cardBorder} shadow-[0_24px_60px_-15px_rgba(15,23,42,0.08)] overflow-hidden transition-colors duration-700 flex flex-col justify-between p-6 sm:p-10 lg:px-14 lg:py-11`}
          >
            {/* Smoothly Crossfading Background Tint Layer */}
            <AnimatePresence initial={false}>
              <motion.div
                key={`bg-${currentItem.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: 'easeInOut' }}
                className={`absolute inset-0 bg-gradient-to-br ${currentTheme.cardGradient} pointer-events-none`}
              />
            </AnimatePresence>

            {/* Soft Radial Corner Glow Matching Current Item Accent */}
            <AnimatePresence initial={false}>
              <motion.div
                key={`glow-${currentItem.id}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
                className={`absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl ${currentTheme.ambientGlow} pointer-events-none`}
              />
            </AnimatePresence>

            {/* Mobile/Tablet (<lg) Top Sector Discoverability & Swipe Control Bar */}
            <div className="relative z-20 flex lg:hidden items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-300/50">
              <div className="inline-flex items-center gap-2 min-w-0">
                <span className="px-2.5 py-1 rounded-lg bg-[#1E3A8A] text-white font-mono text-xs font-bold shrink-0">
                  Sector 0{activeIndex + 1} / 0{items.length}
                </span>
                <span className="text-xs font-semibold text-slate-700 truncate">
                  Swipe or tap arrows →
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  aria-label="Previous sector"
                  onClick={() => handlePrev(true)}
                  className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white border border-slate-200/90 text-slate-800 shadow-2xs flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next sector"
                  onClick={() => handleNext(true)}
                  className="w-9 h-9 rounded-xl bg-[#1E3A8A] hover:bg-[#2563EB] border border-[#1E3A8A] text-white shadow-2xs flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Item Content (Left Text + Right Floating Composition) */}
            <div className="relative z-10 my-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.id}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 30 }
                  }
                  animate={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0 }
                  }
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -30 }
                  }
                  transition={{
                    duration: prefersReducedMotion ? 0.25 : 0.42,
                    ease: CARD_TRANSITION_EASE,
                  }}
                  className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 lg:gap-10 items-center"
                >
                  {/* ------------------------------------------------------- */}
                  {/* CARD LEFT SIDE: Icon Badge, Title, Description, Link    */}
                  {/* ------------------------------------------------------- */}
                  <div className="w-full lg:col-span-6 space-y-4 sm:space-y-5">
                    {/* Rounded Glowing Icon Badge + SECTOR 0X Tag */}
                    <div className="flex items-center gap-3.5">
                      <motion.div
                        initial={
                          prefersReducedMotion
                            ? { opacity: 1 }
                            : { scale: 0.75, opacity: 0 }
                        }
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          duration: 0.45,
                          delay: prefersReducedMotion ? 0 : 0.04,
                          ease: CARD_TRANSITION_EASE,
                        }}
                        className={`w-12 h-12 sm:w-13 sm:h-13 rounded-full ${currentTheme.iconCircleBg} ${currentTheme.iconCircleRing} ${currentTheme.iconText} flex items-center justify-center shrink-0`}
                      >
                        <CurrentIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </motion.div>

                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold ${currentTheme.sectorBadgeBg} ${currentTheme.sectorBadgeText} border ${currentTheme.sectorBadgeBorder}`}
                      >
                        SECTOR 0{activeIndex + 1}
                      </span>
                    </div>

                    {/* Item Title (Unified Hero Heading Color & Font) */}
                    <motion.h3
                      initial={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { opacity: 0, y: 14 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.48,
                        delay: prefersReducedMotion ? 0 : 0.08,
                        ease: CARD_TRANSITION_EASE,
                      }}
                      className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-bold text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)] tracking-[-0.015em] leading-tight"
                    >
                      {currentItem.name}
                    </motion.h3>

                    {/* Item Summary Paragraph */}
                    <motion.p
                      initial={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { opacity: 0, y: 12 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.48,
                        delay: prefersReducedMotion ? 0 : 0.14,
                        ease: CARD_TRANSITION_EASE,
                      }}
                      className="text-sm sm:text-[15px] text-slate-600 font-medium leading-relaxed max-w-xl"
                    >
                      {currentItem.summary}
                    </motion.p>

                    {/* Existing Core Challenge Addressed Block */}
                    <motion.div
                      initial={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { opacity: 0, y: 12 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.48,
                        delay: prefersReducedMotion ? 0 : 0.18,
                        ease: CARD_TRANSITION_EASE,
                      }}
                      className="p-4 rounded-2xl bg-white/90 backdrop-blur-xs border border-[#DBEAFE] shadow-2xs space-y-1 max-w-xl"
                    >
                      <div className="font-bold text-[#1E3A8A] text-[11px] uppercase tracking-wide">
                        Core Challenge Addressed:
                      </div>
                      <div className="text-[13.5px] sm:text-sm text-slate-700 leading-relaxed">
                        {currentItem.coreChallenges[0]}
                      </div>
                    </motion.div>

                    {/* Existing Link ("Explore Industry Solutions →") — Unified Hero Button */}
                    <motion.div
                      initial={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { opacity: 0, y: 10 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: prefersReducedMotion ? 0 : 0.22,
                        ease: CARD_TRANSITION_EASE,
                      }}
                      className="pt-1"
                    >
                      <button
                        type="button"
                        onClick={() => onNavigate('/industries')}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-5 sm:py-2.5 min-h-[42px] sm:min-h-[44px] rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white font-semibold text-xs sm:text-[13px] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-all duration-200 active:scale-[0.98] cursor-pointer group"
                      >
                        <span>Explore Industry Solutions</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </motion.div>
                  </div>

                  {/* ------------------------------------------------------- */}
                  {/* CARD RIGHT SIDE: Staggered Pop-In + Floating UI Visual  */}
                  {/* ------------------------------------------------------- */}
                  <div className="w-full lg:col-span-6 flex items-center justify-center">
                    <div className="relative w-full max-w-[460px] py-4 sm:py-6 px-2 sm:px-6">
                      {/* Element 1: Central Visual Card */}
                      <motion.div
                        initial={
                          prefersReducedMotion
                            ? { opacity: 1, scale: 1 }
                            : { opacity: 0, scale: 0.84 }
                        }
                        animate={
                          prefersReducedMotion
                            ? { opacity: 1, scale: 1 }
                            : {
                                opacity: 1,
                                scale: 1,
                                y: [0, -5, 0, 5, 0],
                              }
                        }
                        transition={{
                          opacity: { duration: 0.4, delay: 0.08, ease: CARD_TRANSITION_EASE },
                          scale: { duration: 0.45, delay: 0.08, ease: CARD_TRANSITION_EASE },
                          y: prefersReducedMotion
                            ? { duration: 0 }
                            : {
                                duration: 3.8,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 0.5,
                              },
                        }}
                        className="relative rounded-[24px] shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)]"
                      >
                        <IndustryIllustration industryId={currentItem.name} />
                      </motion.div>

                      {/* Element 2: Top-Right Floating Pill (Pops in 2nd, floats independently) */}
                      <motion.div
                        initial={
                          prefersReducedMotion
                            ? { opacity: 1, scale: 1 }
                            : { opacity: 0, scale: 0.8 }
                        }
                        animate={
                          prefersReducedMotion
                            ? { opacity: 1, scale: 1 }
                            : {
                                opacity: 1,
                                scale: 1,
                                y: [0, 6, 0, -6, 0],
                              }
                        }
                        transition={{
                          opacity: { duration: 0.38, delay: 0.16, ease: CARD_TRANSITION_EASE },
                          scale: { duration: 0.42, delay: 0.16, ease: CARD_TRANSITION_EASE },
                          y: prefersReducedMotion
                            ? { duration: 0 }
                            : {
                                duration: 3.2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 0.2,
                              },
                        }}
                        className="hidden sm:flex items-center gap-2 absolute -top-2 -right-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/90 shadow-[0_12px_28px_rgba(15,23,42,0.10)] z-20"
                      >
                        <div
                          className={`w-6 h-6 rounded-lg ${currentTheme.iconCircleBg} text-white flex items-center justify-center shrink-0`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-800 max-w-[175px] truncate">
                          {currentItem.suggestedServices[0]?.name}
                        </span>
                      </motion.div>

                      {/* Element 3: Bottom-Left Floating Card (Pops in 3rd, floats independently) */}
                      <motion.div
                        initial={
                          prefersReducedMotion
                            ? { opacity: 1, scale: 1 }
                            : { opacity: 0, scale: 0.8 }
                        }
                        animate={
                          prefersReducedMotion
                            ? { opacity: 1, scale: 1 }
                            : {
                                opacity: 1,
                                scale: 1,
                                y: [0, -6, 0, 6, 0],
                              }
                        }
                        transition={{
                          opacity: { duration: 0.38, delay: 0.24, ease: CARD_TRANSITION_EASE },
                          scale: { duration: 0.42, delay: 0.24, ease: CARD_TRANSITION_EASE },
                          y: prefersReducedMotion
                            ? { duration: 0 }
                            : {
                                duration: 3.6,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 0.4,
                              },
                        }}
                        className="hidden sm:flex items-center gap-2.5 absolute -bottom-3 -left-2 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-200/90 shadow-[0_12px_28px_rgba(15,23,42,0.10)] z-20 max-w-[260px]"
                      >
                        <div
                          className={`w-7 h-7 rounded-xl ${currentTheme.chipBg} ${currentTheme.chipText} border ${currentTheme.chipBorder} flex items-center justify-center shrink-0`}
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[9px] font-mono uppercase tracking-wider text-slate-600 font-bold">
                            OPPORTUNITY
                          </div>
                          <div className="text-[11px] font-semibold text-slate-800 truncate">
                            {currentItem.digitalOpportunities[0]}
                          </div>
                        </div>
                      </motion.div>

                      {/* Element 4: Bottom-Right Floating Accent Icon Badge (Pops in 4th, floats independently) */}
                      <motion.div
                        initial={
                          prefersReducedMotion
                            ? { opacity: 1, scale: 1 }
                            : { opacity: 0, scale: 0.8 }
                        }
                        animate={
                          prefersReducedMotion
                            ? { opacity: 1, scale: 1 }
                            : {
                                opacity: 1,
                                scale: 1,
                                y: [0, 5, 0, -5, 0],
                              }
                        }
                        transition={{
                          opacity: { duration: 0.38, delay: 0.32, ease: CARD_TRANSITION_EASE },
                          scale: { duration: 0.42, delay: 0.32, ease: CARD_TRANSITION_EASE },
                          y: prefersReducedMotion
                            ? { duration: 0 }
                            : {
                                duration: 4.0,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 0.1,
                              },
                        }}
                        className={`hidden sm:flex w-12 h-12 rounded-2xl ${currentTheme.iconCircleBg} text-white shadow-lg items-center justify-center absolute -bottom-2 right-3 z-20`}
                      >
                        <CurrentIcon className="w-6 h-6" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ============================================================= */}
            {/* BOTTOM ROW OF CARD: Peeking Next Item (Left) + Controls (Right) */}
            {/* ============================================================= */}
            <div className="relative z-10 mt-8 pt-5 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Peeking Next Item (Faded ~0.35 opacity like the video, slides up on change) */}
              <AnimatePresence mode="wait">
                <motion.button
                  key={`peek-${nextItem.id}`}
                  type="button"
                  onClick={() => handleNext(true)}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0.38 }
                      : { opacity: 0, y: 18 }
                  }
                  animate={{ opacity: 0.38, y: 0 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -18 }
                  }
                  whileHover={{ opacity: 0.85, scale: 1.01 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.2 : 0.5,
                    ease: CARD_TRANSITION_EASE,
                  }}
                  aria-label={`Next: ${nextItem.name}`}
                  className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 p-3 sm:p-0 rounded-2xl sm:rounded-none bg-white/85 sm:bg-transparent border border-slate-200/90 sm:border-transparent shadow-2xs sm:shadow-none text-left group cursor-pointer self-start !opacity-95 lg:!opacity-40 hover:!opacity-90"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-full ${nextTheme.iconCircleBg} text-white flex items-center justify-center shadow-xs shrink-0`}
                    >
                      <NextIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold">
                        UP NEXT · SECTOR 0{nextIndex + 1} / 0{items.length}
                      </div>
                      <div className="!font-['Outfit','Space_Grotesk',sans-serif] text-sm sm:text-base font-bold text-slate-900 truncate">
                        {nextItem.name}
                      </div>
                    </div>
                  </div>
                  <span className="sm:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1E3A8A] text-white text-[11px] font-bold shrink-0">
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </motion.button>
              </AnimatePresence>

              {/* Progress Bars / Dots + Prev / Next Arrow Buttons */}
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div
                  className="flex items-center gap-1.5"
                  role="tablist"
                  aria-label="Business challenges items"
                >
                  {items.map((item, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-label={`Show item ${idx + 1}: ${item.name}`}
                        onClick={() => goToIndex(idx, true)}
                        className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'w-10 bg-slate-300/75'
                            : 'w-2.5 bg-slate-300/70 hover:bg-slate-400'
                        }`}
                      >
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className={`block h-full rounded-full ${currentTheme.progressFill} transition-[width] duration-75 ease-linear`}
                            style={{
                              width:
                                prefersReducedMotion || stoppedByUserAction
                                  ? '100%'
                                  : `${progress}%`,
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous"
                    onClick={() => handlePrev(true)}
                    className="w-10 h-10 rounded-xl bg-white/90 hover:bg-white border border-slate-200/90 text-slate-700 hover:text-slate-950 shadow-2xs flex items-center justify-center transition-all active:scale-[0.96] cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next"
                    onClick={() => handleNext(true)}
                    className="w-10 h-10 rounded-xl bg-white/90 hover:bg-white border border-slate-200/90 text-slate-700 hover:text-slate-950 shadow-2xs flex items-center justify-center transition-all active:scale-[0.96] cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
