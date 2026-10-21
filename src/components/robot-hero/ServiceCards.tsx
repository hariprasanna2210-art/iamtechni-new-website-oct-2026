import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { getServiceIcon } from '../../utils/serviceIcons';
import {
  getHeroFloatingServiceCards,
  HeroFloatingServiceCard,
} from '../../data/robotScript';

export interface ServiceCardsProps {
  activeServiceSlug: string;
  isAutoPlaying: boolean;
  isSpeaking: boolean;
  captionText: string | null;
  onSelectServiceCard: (card: HeroFloatingServiceCard, shouldScrollAndSpeak?: boolean) => void;
  onToggleAutoPlay: () => void;
  parallaxOffset?: { x: number; y: number };
}

export const mapServiceToOrbitCardId = (idOrSlug: string): string => {
  const cards = getHeroFloatingServiceCards();
  const s = (idOrSlug || '').toLowerCase();
  const exact = cards.find(
    (c) =>
      c.slug.toLowerCase() === s ||
      c.id.toLowerCase() === s ||
      c.robotServiceId.toLowerCase() === s
  );
  if (exact) return exact.slug;
  return cards[0]?.slug || 'ai-machine-learning';
};

// Tablet (md: 768-1023px) stays unchanged; Desktop (lg: 1024px+) places 3 cards on left and 3 on right,
// shifted 16-20px outward from the robot so both raised hands and full card text are always clearly visible.
const getDesktopAndTabletPositionClasses = (card: HeroFloatingServiceCard): string => {
  switch (card.side) {
    case 'left-top':
      return 'top-[13%] left-0 lg:top-[12%] lg:-left-7 xl:-left-8';
    case 'left-mid':
      return 'top-[43%] left-0 lg:top-[43%] lg:-left-10 xl:-left-11';
    case 'left-bottom':
      return 'bottom-[17%] left-0 lg:bottom-[15%] lg:-left-7 xl:-left-8';
    case 'right-top':
      return 'top-[13%] right-0 lg:top-[12%] lg:-right-7 xl:-right-8';
    case 'right-mid':
      return 'top-[43%] right-0 lg:top-[43%] lg:-right-10 xl:-right-11';
    case 'right-bottom':
    default:
      return 'bottom-[17%] right-0 lg:bottom-[15%] lg:-right-7 xl:-right-8';
  }
};

const getMobileChipPositionClasses = (card: HeroFloatingServiceCard): string => {
  switch (card.side) {
    case 'left-top':
      return 'top-[12%] left-0';
    case 'left-mid':
      return 'top-[44%] left-0';
    case 'left-bottom':
      return 'bottom-[14%] left-0';
    case 'right-top':
      return 'top-[12%] right-0';
    case 'right-mid':
      return 'top-[44%] right-0';
    case 'right-bottom':
    default:
      return 'bottom-[14%] right-0';
  }
};

export const ServiceCards: React.FC<ServiceCardsProps> = ({
  activeServiceSlug,
  isAutoPlaying,
  isSpeaking,
  captionText,
  onSelectServiceCard,
  onToggleAutoPlay,
  parallaxOffset = { x: 0, y: 0 },
}) => {
  const prefersReducedMotion = useReducedMotion();
  const floatingCards = getHeroFloatingServiceCards();

  if (floatingCards.length === 0) return null;

  const activeCard =
    floatingCards.find(
      (c) =>
        c.slug === activeServiceSlug ||
        c.id === activeServiceSlug ||
        c.robotServiceId === activeServiceSlug
    ) || floatingCards[0];

  const activeIndex = floatingCards.findIndex((c) => c.slug === activeCard.slug);

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + floatingCards.length) % floatingCards.length;
    onSelectServiceCard(floatingCards[prevIdx], false);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % floatingCards.length;
    onSelectServiceCard(floatingCards[nextIdx], false);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. VISUALLY HIDDEN SCREEN-READER LIVE REGION (No visible caption bubble)  */}
      {/* ========================================================================= */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {captionText || ''}
      </div>

      {/* ========================================================================= */}
      {/* 2. SCALED ORBIT RINGS & LIGHT BEAM FROM ROBOT TO ACTIVE CARD / CHIP       */}
      {/* ========================================================================= */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full max-w-[340px] sm:max-w-[440px] md:max-w-[560px] lg:max-w-[410px] xl:max-w-[430px] 2xl:max-w-[475px] max-h-[320px] md:max-h-[480px] lg:max-h-[345px] xl:max-h-[360px] 2xl:max-h-[395px] m-auto z-10 overflow-visible"
        viewBox="0 0 500 450"
        fill="none"
      >
        <defs>
          <linearGradient id="robot-service-beam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity={isSpeaking ? '0.68' : '0.38'} />
            <stop offset="60%" stopColor="#06B6D4" stopOpacity={isSpeaking ? '0.88' : '0.52'} />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {/* Subtle Scaled Orbit Rings Around the Robot */}
        <circle
          cx="250"
          cy="215"
          r="132"
          stroke="#2563EB"
          strokeOpacity="0.10"
          strokeWidth="1.2"
          strokeDasharray="4 6"
        />
        <circle
          cx="250"
          cy="215"
          r="178"
          stroke="#06B6D4"
          strokeOpacity="0.14"
          strokeWidth="1.2"
        />

        <AnimatePresence mode="wait">
          <motion.g
            key={activeCard.slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          >
            <line
              x1="250"
              y1="215"
              x2={activeCard.beamTarget.x}
              y2={activeCard.beamTarget.y}
              stroke="url(#robot-service-beam)"
              strokeWidth={isSpeaking ? '2.5' : '1.75'}
              strokeDasharray="5 5"
            />
            {!prefersReducedMotion && (
              <motion.circle
                r={isSpeaking ? '3.5' : '2.5'}
                fill="#06B6D4"
                animate={{
                  cx: [250, activeCard.beamTarget.x],
                  cy: [215, activeCard.beamTarget.y],
                  opacity: [0.2, 0.95, 0],
                }}
                transition={{
                  duration: isSpeaking ? 1.1 : 1.8,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            )}
          </motion.g>
        </AnimatePresence>
      </svg>

      {/* ========================================================================= */}
      {/* 3. MOBILE SURROUNDING COMPACT CHIPS (< 768px): 3 Left & 3 Right           */}
      {/*    Unchanged: 32px tall, 11-12px text, rounded-full, shortTitle           */}
      {/* ========================================================================= */}
      <div className="block md:hidden pointer-events-none absolute inset-0 z-20">
        {floatingCards.map((card, idx) => {
          const isActive = card.slug === activeCard.slug;
          const ServiceIcon = getServiceIcon(card.slug);
          const mobilePos = getMobileChipPositionClasses(card);

          return (
            <motion.div
              key={`mobile-chip-${card.slug}`}
              data-robot-control="true"
              className={`pointer-events-auto absolute ${mobilePos}`}
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      y: [0, -3, 0],
                    }
              }
              transition={{
                duration: 4.5 + (idx % 3) * 0.35,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: idx * 0.25,
              }}
            >
              <a
                href={card.hashHref}
                aria-label={`Explore ${card.title} services`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectServiceCard(card, true);
                }}
                className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full text-left transition-all duration-250 cursor-pointer backdrop-blur-md max-w-[126px] sm:max-w-[144px] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                  isActive
                    ? 'bg-gradient-to-r from-[#EEF4FF] via-[#F5F9FF] to-[#ECFEFF] border-2 border-[#2563EB] text-[#1E3A8A] shadow-[0_0_16px_rgba(37,99,235,0.28),inset_0_1px_0_rgba(255,255,255,0.95)] scale-[1.03] z-30'
                    : 'bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 text-[#2563EB] shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] hover:border-[#2563EB]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#1E3A8A] text-white'
                      : 'bg-[#DBEAFE]/80 text-[#1E3A8A]'
                  }`}
                >
                  <ServiceIcon className="w-3 h-3" />
                </span>
                <span
                  className={`text-[11px] font-bold leading-none truncate ${
                    isActive ? 'text-[#1E3A8A]' : 'text-[#2563EB]'
                  }`}
                >
                  {card.shortTitle}
                </span>
              </a>
            </motion.div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 4. TABLET & DESKTOP SURROUNDING FULL CARDS (768px and above): 3 Left & 3 Right */}
      {/*    Desktop (lg:): title 12px, subtitle 10.5px, icon box 28px,             */}
      {/*    padding 8px 12px (py-2 px-3), max-width 180px                          */}
      {/* ========================================================================= */}
      <div className="hidden md:block pointer-events-none absolute inset-0 z-20">
        {floatingCards.map((card, idx) => {
          const isActive = card.slug === activeCard.slug;
          const ServiceIcon = getServiceIcon(card.slug);
          const posClasses = getDesktopAndTabletPositionClasses(card);

          return (
            <motion.div
              key={card.slug}
              data-robot-control="true"
              className={`pointer-events-auto absolute ${posClasses}`}
              style={{
                x: prefersReducedMotion ? 0 : parallaxOffset.x * 8,
                y: prefersReducedMotion ? 0 : parallaxOffset.y * 5,
              }}
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      y: [0, -3.5, 0],
                    }
              }
              transition={{
                duration: 5 + (idx % 3) * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: idx * 0.35,
              }}
            >
              <a
                href={card.hashHref}
                aria-label={`Explore ${card.title} services`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectServiceCard(card, true);
                }}
                className={`group flex items-start gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-300 cursor-pointer backdrop-blur-md w-[186px] lg:w-[172px] xl:w-[180px] lg:max-w-[180px] min-h-[56px] lg:min-h-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                  isActive
                    ? 'bg-gradient-to-r from-[#EEF4FF] via-[#F5F9FF] to-[#ECFEFF] border-2 border-[#2563EB] shadow-[0_0_22px_rgba(37,99,235,0.24),inset_0_1px_0_rgba(255,255,255,0.95)] -translate-y-0.5 scale-[1.02] z-30 lg:z-20'
                    : 'bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 hover:from-[#EEF4FF] hover:to-[#ECFEFF] border border-[#DBEAFE]/90 hover:border-[#2563EB] shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] hover:shadow-[0_4px_18px_rgba(37,99,235,0.18)] hover:-translate-y-0.5'
                }`}
              >
                {/* 28px Icon Box (w-7 h-7) */}
                <span
                  className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                    isActive
                      ? 'bg-[#1E3A8A] text-white shadow-2xs'
                      : 'bg-[#DBEAFE]/85 text-[#1E3A8A] group-hover:bg-[#1E3A8A] group-hover:text-white'
                  }`}
                >
                  <ServiceIcon className="w-3.5 h-3.5" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-1">
                    {/* Title: 11px on tablet, 12px on desktop */}
                    <span className="text-[11px] lg:text-[12px] font-bold text-[#1E3A8A] leading-snug line-clamp-2 group-hover:text-[#2563EB] transition-colors">
                      {card.title}
                    </span>
                    {isActive && (
                      <span className="relative flex h-1.5 w-1.5 shrink-0 mt-1">
                        <span
                          className={`${
                            prefersReducedMotion ? '' : 'animate-ping'
                          } absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-75`}
                        />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#1E3A8A]" />
                      </span>
                    )}
                  </div>

                  {/* Subtitle: 10px on tablet, 10.5px on desktop; "Explore →" revealed on hover */}
                  <div className="relative h-[14px] lg:h-[15px] overflow-hidden mt-0.5">
                    <div className="text-[10px] lg:text-[10.5px] text-[#2563EB] font-semibold leading-tight truncate transition-transform duration-200 group-hover:-translate-y-full">
                      {card.badgeText}
                    </div>
                    <div className="text-[10px] lg:text-[10.5px] text-[#1E3A8A] font-bold leading-tight flex items-center gap-0.5 transition-transform duration-200 translate-y-0 group-hover:-translate-y-full">
                      <span>Explore</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 5. CENTERED SCENE CONTROLLER (Directly Under Robot Platform)              */}
      {/*    Desktop (lg:): height 36px (lg:h-9), font 12.5px (lg:text-[12.5px])    */}
      {/* ========================================================================= */}
      <div
        data-robot-control="true"
        className="relative z-40 flex justify-center w-full mt-1 lg:mt-0.5"
      >
        <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1.5 lg:py-0 lg:h-9 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 backdrop-blur-md border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] max-w-full">
          <div className="flex items-center gap-1.5 min-w-0 pr-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)] shrink-0 ${
                prefersReducedMotion ? '' : 'animate-pulse'
              }`}
            />
            <span className="text-[11px] sm:text-xs lg:text-[12.5px] font-bold text-[#1E3A8A] truncate max-w-[125px] sm:max-w-[195px]">
              {activeCard.title}
            </span>
            <span className="hidden sm:inline text-[11px] lg:text-[12.5px] text-[#2563EB] font-semibold truncate">
              · {activeCard.sceneLabel}
            </span>
          </div>

          <div className="w-px h-3.5 bg-[#DBEAFE] shrink-0" aria-hidden="true" />

          <div
            className="flex items-center gap-1 shrink-0"
            role="tablist"
            aria-label="Robot presentation scene selector"
          >
            {floatingCards.map((card) => {
              const active = card.slug === activeCard.slug;
              return (
                <button
                  key={card.slug}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Highlight ${card.title}`}
                  onClick={() => onSelectServiceCard(card, false)}
                  className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    active
                      ? 'w-4 bg-[#1E3A8A]'
                      : 'w-1.5 bg-[#93C5FD] hover:bg-[#2563EB]'
                  }`}
                />
              );
            })}
          </div>

          <div className="w-px h-3.5 bg-[#DBEAFE] shrink-0" aria-hidden="true" />

          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              onClick={onToggleAutoPlay}
              aria-label={
                isAutoPlaying
                  ? 'Pause auto presentation'
                  : 'Resume auto presentation'
              }
              className="p-1 rounded-md text-[#2563EB] hover:text-[#1E3A8A] hover:bg-[#DBEAFE]/60 transition-colors cursor-pointer"
              title={isAutoPlaying ? 'Pause Auto-Tour' : 'Resume Auto-Tour'}
            >
              {isAutoPlaying ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
            </button>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous service scene"
              className="p-1 rounded-md text-[#2563EB] hover:text-[#1E3A8A] hover:bg-[#DBEAFE]/60 transition-colors cursor-pointer"
              title="Previous Scene"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next service scene"
              className="p-1 rounded-md text-[#2563EB] hover:text-[#1E3A8A] hover:bg-[#DBEAFE]/60 transition-colors cursor-pointer"
              title="Next Scene"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
