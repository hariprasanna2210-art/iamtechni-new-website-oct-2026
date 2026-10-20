import React from 'react';
import {
  Cpu,
  Globe,
  Smartphone,
  Cloud,
  TrendingUp,
  Code2,
  Bot,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { PageRoute } from '../../types';
import { ROBOT_SERVICE_CARDS } from './RobotController';

export interface ServiceCardsProps {
  activeServiceId: string;
  isAutoPlaying: boolean;
  onSelectService: (serviceId: string) => void;
  onToggleAutoPlay: () => void;
  onNavigate: (route: PageRoute) => void;
  parallaxOffset?: { x: number; y: number };
}

export const getCardIcon = (id: string) => {
  switch (id) {
    case 'ai-ml':
      return <Cpu className="w-4 h-4" />;
    case 'web-dev':
      return <Globe className="w-4 h-4" />;
    case 'mobile-apps':
      return <Smartphone className="w-4 h-4" />;
    case 'cloud-devops':
      return <Cloud className="w-4 h-4" />;
    case 'digital-marketing':
      return <TrendingUp className="w-4 h-4" />;
    case 'custom-software':
      return <Code2 className="w-4 h-4" />;
    case 'robotics':
      return <Bot className="w-4 h-4" />;
    case 'ui-ux':
    default:
      return <BarChart3 className="w-4 h-4" />;
  }
};

export const mapServiceToOrbitCardId = (idOrSlug: string): string => {
  const s = (idOrSlug || '').toLowerCase();
  if (
    s.includes('ai') ||
    s.includes('machine') ||
    s.includes('data') ||
    s.includes('robot') ||
    s.includes('genai') ||
    s.includes('generative')
  ) {
    return 'ai-ml';
  }
  if (
    s.includes('cloud') ||
    s.includes('devops') ||
    s.includes('security') ||
    s.includes('cyber') ||
    s.includes('migration')
  ) {
    return 'cloud-devops';
  }
  if (
    s.includes('marketing') ||
    s.includes('seo') ||
    s.includes('social') ||
    s.includes('consult') ||
    s.includes('training')
  ) {
    return 'digital-marketing';
  }
  return 'web-dev';
};

export const ORBIT_CARDS_CONFIG = [
  {
    id: 'ai-ml',
    serviceSlug: 'ai-ml',
    side: 'left',
    positionClasses: 'top-[10%] left-0 sm:left-1 xl:-left-2',
    floatOffset: 0,
    duration: 5.2,
  },
  {
    id: 'web-dev',
    serviceSlug: 'web-dev',
    side: 'left',
    positionClasses: 'bottom-[18%] left-0 sm:left-1 xl:-left-2',
    floatOffset: 1.2,
    duration: 5.6,
  },
  {
    id: 'cloud-devops',
    serviceSlug: 'cloud-devops',
    side: 'right',
    positionClasses: 'top-[10%] right-0 sm:right-1 xl:-right-2',
    floatOffset: 0.6,
    duration: 5.0,
  },
  {
    id: 'digital-marketing',
    serviceSlug: 'digital-marketing',
    side: 'right',
    positionClasses: 'bottom-[18%] right-0 sm:right-1 xl:-right-2',
    floatOffset: 1.8,
    duration: 5.4,
  },
];

export const ServiceCards: React.FC<ServiceCardsProps> = ({
  activeServiceId,
  isAutoPlaying,
  onSelectService,
  onToggleAutoPlay,
  parallaxOffset = { x: 0, y: 0 },
}) => {
  const prefersReducedMotion = useReducedMotion();
  const activeOrbitId = mapServiceToOrbitCardId(activeServiceId);

  const matchedSceneCard =
    ROBOT_SERVICE_CARDS.find(
      (c) =>
        c.id === activeServiceId ||
        c.route.includes(activeServiceId) ||
        activeServiceId.includes(c.id)
    ) ||
    ROBOT_SERVICE_CARDS.find((c) => c.id === activeOrbitId) ||
    ROBOT_SERVICE_CARDS[0];

  const activeIndex = ROBOT_SERVICE_CARDS.findIndex(
    (c) => c.id === matchedSceneCard.id
  );

  const handlePrev = () => {
    const prevIdx =
      (activeIndex - 1 + ROBOT_SERVICE_CARDS.length) %
      ROBOT_SERVICE_CARDS.length;
    onSelectService(ROBOT_SERVICE_CARDS[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % ROBOT_SERVICE_CARDS.length;
    onSelectService(ROBOT_SERVICE_CARDS[nextIdx].id);
  };

  return (
    <>
      {/* 1. 4 SYMMETRICAL FLOATING CARDS (Desktop & Tablet >= 768px) */}
      <div className="hidden md:block pointer-events-none absolute inset-0 z-20">
        {ORBIT_CARDS_CONFIG.map((cfg) => {
          const card = ROBOT_SERVICE_CARDS.find((c) => c.id === cfg.id);
          if (!card) return null;

          const isActive =
            card.id === activeServiceId || card.id === activeOrbitId;

          return (
            <motion.div
              key={card.id}
              className={`pointer-events-auto absolute ${cfg.positionClasses}`}
              style={{
                x: prefersReducedMotion ? 0 : parallaxOffset.x * 14,
                y: prefersReducedMotion ? 0 : parallaxOffset.y * 10,
              }}
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      y: [0, -7, 0],
                    }
              }
              transition={{
                duration: cfg.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: cfg.floatOffset,
              }}
            >
              <button
                type="button"
                onClick={() => onSelectService(card.id)}
                className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-300 cursor-pointer backdrop-blur-md ${
                  isActive
                    ? 'bg-white border-2 border-[#087BFA] shadow-[0_0_24px_rgba(8,123,250,0.32)] scale-105 z-30'
                    : 'bg-white/92 hover:bg-white border border-slate-200/90 hover:border-[#087BFA]/40 shadow-[0_4px_16px_rgba(7,22,56,0.06)] hover:shadow-md'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                    isActive
                      ? 'bg-[#087BFA] text-white shadow-xs'
                      : 'bg-[#F3F8FF] text-[#087BFA] group-hover:bg-[#087BFA]/10'
                  }`}
                >
                  {getCardIcon(card.id)}
                </span>
                <div className="pr-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#071638] leading-tight group-hover:text-[#087BFA] transition-colors">
                      {card.shortTitle}
                    </span>
                    {isActive && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C7F2] opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#087BFA]" />
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium leading-tight">
                    {card.badgeText}
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* 2. MOBILE COMPACT SERVICE ROW (< 768px) */}
      <div className="flex md:hidden items-center justify-center flex-wrap gap-1.5 w-full px-2 mb-2">
        {ORBIT_CARDS_CONFIG.map((cfg) => {
          const card = ROBOT_SERVICE_CARDS.find((c) => c.id === cfg.id);
          if (!card) return null;
          const isActive = card.id === activeServiceId || card.id === activeOrbitId;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelectService(card.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                isActive
                  ? 'bg-white border-[#087BFA] text-[#087BFA] shadow-xs'
                  : 'bg-white/80 border-slate-200 text-slate-600'
              }`}
            >
              <span className="w-3.5 h-3.5 flex items-center justify-center text-[#087BFA]">
                {getCardIcon(card.id)}
              </span>
              <span>{card.shortTitle}</span>
            </button>
          );
        })}
      </div>

      {/* 3. CENTERED SCENE CONTROLLER (Directly Under Robot) */}
      <div className="relative z-20 flex justify-center w-full mt-1">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_20px_rgba(7,22,56,0.08)]">
          <div className="flex items-center gap-1.5 min-w-0 pr-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C7F2] shrink-0 animate-pulse" />
            <span className="text-xs font-bold text-[#071638] truncate max-w-[125px] sm:max-w-[155px]">
              {matchedSceneCard.shortTitle}
            </span>
            <span className="hidden sm:inline text-[11px] text-slate-500 font-normal truncate">
              · {matchedSceneCard.sceneLabel}
            </span>
          </div>

          <div className="w-px h-3.5 bg-slate-200 shrink-0" aria-hidden="true" />

          <div
            className="flex items-center gap-1 shrink-0"
            role="tablist"
            aria-label="Robot presentation scene selector"
          >
            {ROBOT_SERVICE_CARDS.map((card) => {
              const active =
                card.id === activeServiceId ||
                card.id === activeOrbitId ||
                card.route.includes(activeServiceId);
              return (
                <button
                  key={card.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Jump to ${card.title}`}
                  onClick={() => onSelectService(card.id)}
                  className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    active
                      ? 'w-4.5 bg-[#087BFA]'
                      : 'w-1.5 bg-slate-200 hover:bg-[#00C7F2]'
                  }`}
                />
              );
            })}
          </div>

          <div className="w-px h-3.5 bg-slate-200 shrink-0" aria-hidden="true" />

          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              onClick={onToggleAutoPlay}
              aria-label={
                isAutoPlaying
                  ? 'Pause auto presentation'
                  : 'Resume auto presentation'
              }
              className="p-1 rounded-md text-slate-600 hover:text-[#087BFA] hover:bg-blue-50 transition-colors cursor-pointer"
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
              className="p-1 rounded-md text-slate-600 hover:text-[#087BFA] hover:bg-blue-50 transition-colors cursor-pointer"
              title="Previous Scene"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next service scene"
              className="p-1 rounded-md text-slate-600 hover:text-[#087BFA] hover:bg-blue-50 transition-colors cursor-pointer"
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
