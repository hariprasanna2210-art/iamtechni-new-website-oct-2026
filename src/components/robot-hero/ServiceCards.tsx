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

const getCardPositionClasses = (card: HeroFloatingServiceCard): string => {
  const tabletVisibility = card.showOnTablet ? 'md:block' : 'hidden lg:block';
  switch (card.side) {
    case 'left-top':
      return `${tabletVisibility} top-[13%] left-0 sm:left-0 xl:-left-4`;
    case 'left-mid':
      return `${tabletVisibility} top-[43%] left-0 sm:-left-1 xl:-left-6`;
    case 'left-bottom':
      return `${tabletVisibility} bottom-[17%] left-0 sm:left-0 xl:-left-4`;
    case 'right-top':
      return `${tabletVisibility} top-[13%] right-0 sm:right-0 xl:-right-4`;
    case 'right-mid':
      return `${tabletVisibility} top-[43%] right-0 sm:-right-1 xl:-right-6`;
    case 'right-bottom':
    default:
      return `${tabletVisibility} bottom-[17%] right-0 sm:right-0 xl:-right-4`;
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
      {/* 2. LIGHT BEAM FROM ROBOT TO ACTIVE FLOATING SERVICE CARD                  */}
      {/* ========================================================================= */}
      <svg
        aria-hidden="true"
        className="hidden md:block pointer-events-none absolute inset-0 w-full h-full max-w-[560px] max-h-[480px] m-auto z-10 overflow-visible"
        viewBox="0 0 500 450"
        fill="none"
      >
        <defs>
          <linearGradient id="robot-service-beam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity={isSpeaking ? '0.65' : '0.35'} />
            <stop offset="60%" stopColor="#06B6D4" stopOpacity={isSpeaking ? '0.85' : '0.50'} />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.10" />
          </linearGradient>
        </defs>
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
      {/* 3. SYMMETRICAL FLOATING TECHNOLOGY CARDS (6 on Desktop, 4 on Tablet)      */}
      {/*    Full titles visible across 3 left & 3 right without overlapping        */}
      {/* ========================================================================= */}
      <div className="hidden md:block pointer-events-none absolute inset-0 z-20">
        {floatingCards.map((card, idx) => {
          const isActive = card.slug === activeCard.slug;
          const ServiceIcon = getServiceIcon(card.slug);
          const posClasses = getCardPositionClasses(card);

          return (
            <motion.div
              key={card.slug}
              data-robot-control="true"
              className={`pointer-events-auto absolute ${posClasses}`}
              style={{
                x: prefersReducedMotion ? 0 : parallaxOffset.x * 10,
                y: prefersReducedMotion ? 0 : parallaxOffset.y * 6,
              }}
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      y: [0, -4, 0],
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
                className={`group flex items-start gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-300 cursor-pointer backdrop-blur-md w-[198px] xl:w-[216px] min-h-[56px] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                  isActive
                    ? 'bg-white border-2 border-[#2563EB] shadow-[0_0_24px_rgba(37,99,235,0.26)] -translate-y-0.5 scale-[1.02] z-30'
                    : 'bg-white/95 hover:bg-white border border-[#E2E8F0] hover:border-[#06B6D4] shadow-[0_4px_16px_rgba(11,27,63,0.06)] hover:shadow-[0_0_20px_rgba(6,182,212,0.22)] hover:-translate-y-0.5'
                }`}
              >
                <span
                  className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-2xs'
                      : 'bg-[#F1F5F9] text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white'
                  }`}
                >
                  <ServiceIcon className="w-3.5 h-3.5" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[11px] font-bold text-[#0B1B3F] leading-snug line-clamp-2 group-hover:text-[#2563EB] transition-colors">
                      {card.title}
                    </span>
                    {isActive && (
                      <span className="relative flex h-1.5 w-1.5 shrink-0 mt-1">
                        <span
                          className={`${
                            prefersReducedMotion ? '' : 'animate-ping'
                          } absolute inline-flex h-full w-full rounded-full bg-[#06B6D4] opacity-75`}
                        />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#2563EB]" />
                      </span>
                    )}
                  </div>

                  {/* Badge text on default, "Explore →" revealed on hover */}
                  <div className="relative h-[14px] overflow-hidden mt-0.5">
                    <div className="text-[10px] text-[#475569] font-medium leading-tight truncate transition-transform duration-200 group-hover:-translate-y-full">
                      {card.badgeText}
                    </div>
                    <div className="text-[10px] text-[#2563EB] font-bold leading-tight flex items-center gap-0.5 transition-transform duration-200 translate-y-0 group-hover:-translate-y-full">
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
      {/* 4. MOBILE HORIZONTAL SWIPEABLE ROW (< 768px)                              */}
      {/* Tap = speak service summary + smooth scroll to 2nd section (#services)    */}
      {/* ========================================================================= */}
      <div
        data-robot-control="true"
        className="flex md:hidden items-center gap-2 w-full overflow-x-auto scrollbar-none px-1 py-1.5 mb-1"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {floatingCards.map((card) => {
          const isActive = card.slug === activeCard.slug;
          const ServiceIcon = getServiceIcon(card.slug);

          return (
            <a
              key={card.slug}
              href={card.hashHref}
              aria-label={`Explore ${card.title} services`}
              onClick={(e) => {
                e.preventDefault();
                onSelectServiceCard(card, true);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all shrink-0 w-[188px] min-h-[54px] border cursor-pointer ${
                isActive
                  ? 'bg-white border-[#2563EB] shadow-[0_0_16px_rgba(37,99,235,0.22)]'
                  : 'bg-white/95 border-[#E2E8F0]'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-[#2563EB] text-white' : 'bg-blue-50 text-[#2563EB]'
                }`}
              >
                <ServiceIcon className="w-3.5 h-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-[#0B1B3F] leading-snug line-clamp-2">
                  {card.title}
                </div>
                <div className="text-[9.5px] font-semibold text-[#2563EB] flex items-center gap-0.5 mt-0.5">
                  <span>Explore</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 5. CENTERED SCENE CONTROLLER (Directly Under Robot)                       */}
      {/* ========================================================================= */}
      <div data-robot-control="true" className="relative z-20 flex justify-center w-full mt-1">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E2E8F0] shadow-[0_4px_20px_rgba(7,22,56,0.08)]">
          <div className="flex items-center gap-1.5 min-w-0 pr-1">
            <span
              className={`w-1.5 h-1.5 rounded-full bg-[#06B6D4] shrink-0 ${
                prefersReducedMotion ? '' : 'animate-pulse'
              }`}
            />
            <span className="text-xs font-bold text-[#0B1B3F] truncate max-w-[155px] sm:max-w-[195px]">
              {activeCard.title}
            </span>
            <span className="hidden sm:inline text-[11px] text-[#475569] font-normal truncate">
              · {activeCard.sceneLabel}
            </span>
          </div>

          <div className="w-px h-3.5 bg-[#E2E8F0] shrink-0" aria-hidden="true" />

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
                      ? 'w-4.5 bg-[#2563EB]'
                      : 'w-1.5 bg-slate-200 hover:bg-[#06B6D4]'
                  }`}
                />
              );
            })}
          </div>

          <div className="w-px h-3.5 bg-[#E2E8F0] shrink-0" aria-hidden="true" />

          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              onClick={onToggleAutoPlay}
              aria-label={
                isAutoPlaying
                  ? 'Pause auto presentation'
                  : 'Resume auto presentation'
              }
              className="p-1 rounded-md text-[#475569] hover:text-[#2563EB] hover:bg-blue-50 transition-colors cursor-pointer"
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
              className="p-1 rounded-md text-[#475569] hover:text-[#2563EB] hover:bg-blue-50 transition-colors cursor-pointer"
              title="Previous Scene"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next service scene"
              className="p-1 rounded-md text-[#475569] hover:text-[#2563EB] hover:bg-blue-50 transition-colors cursor-pointer"
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
