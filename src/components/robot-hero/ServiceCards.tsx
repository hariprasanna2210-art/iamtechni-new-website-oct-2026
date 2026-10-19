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
import { PageRoute } from '../../types';
import { ROBOT_SERVICE_CARDS } from './RobotController';

export interface ServiceCardsProps {
  activeServiceId: string;
  isAutoPlaying: boolean;
  onSelectService: (id: string) => void;
  onToggleAutoPlay: () => void;
  onNavigate: (route: PageRoute) => void;
}

const getCardIcon = (id: string) => {
  switch (id) {
    case 'ai-ml':
      return <Cpu className="w-3.5 h-3.5" />;
    case 'web-dev':
      return <Globe className="w-3.5 h-3.5" />;
    case 'mobile-apps':
      return <Smartphone className="w-3.5 h-3.5" />;
    case 'cloud-devops':
      return <Cloud className="w-3.5 h-3.5" />;
    case 'digital-marketing':
      return <TrendingUp className="w-3.5 h-3.5" />;
    case 'software-solutions':
      return <Code2 className="w-3.5 h-3.5" />;
    case 'robotics-automation':
      return <Bot className="w-3.5 h-3.5" />;
    case 'uiux-analytics':
    default:
      return <BarChart3 className="w-3.5 h-3.5" />;
  }
};

export const ServiceCards: React.FC<ServiceCardsProps> = ({
  activeServiceId,
  isAutoPlaying,
  onSelectService,
  onToggleAutoPlay,
}) => {
  const activeIndex = Math.max(
    0,
    ROBOT_SERVICE_CARDS.findIndex((c) => c.id === activeServiceId)
  );
  const activeCard = ROBOT_SERVICE_CARDS[activeIndex] || ROBOT_SERVICE_CARDS[0];

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

  // Show 4 unobtrusive perimeter callout nodes on desktop (2 left perimeter, 2 right perimeter)
  // positioned far outside the robot's head/chest silhouette
  const perimeterIndices = [0, 1, 3, 4];

  return (
    <>
      {/* 1. UNOBTRUSIVE PERIMETER CALLOUT BADGES (Never obscure the robot's face or torso) */}
      <div className="hidden xl:block pointer-events-none absolute inset-0 z-10">
        {perimeterIndices.map((cardIdx, slotIdx) => {
          const card = ROBOT_SERVICE_CARDS[cardIdx];
          if (!card) return null;
          const isSelected = card.id === activeServiceId;

          const slotPosition =
            slotIdx === 0
              ? 'top-[14%] left-2'
              : slotIdx === 1
                ? 'bottom-[28%] left-2'
                : slotIdx === 2
                  ? 'top-[14%] right-2'
                  : 'bottom-[28%] right-2';

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelectService(card.id)}
              className={`pointer-events-auto absolute ${slotPosition} flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'bg-white border-2 border-[#087BFA] shadow-[0_10px_24px_rgba(8,123,250,0.18)] -translate-y-0.5'
                  : 'bg-white/95 hover:bg-white border border-[#087BFA]/20 shadow-[0_4px_14px_rgba(7,22,56,0.05)] hover:border-[#087BFA]/45'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                  isSelected
                    ? 'bg-[#087BFA] text-white'
                    : 'bg-[#F3F8FF] text-[#087BFA]'
                }`}
              >
                {getCardIcon(card.id)}
              </span>
              <div>
                <div className="text-[11px] font-bold text-[#071638] leading-tight">
                  {card.shortTitle}
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  {card.badgeText}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. COMPACT STAGE FOOTER BAR (Synchronized Scene Indicator & Tour Controls) */}
      <div className="relative z-20 mx-auto lg:ml-4 lg:mr-auto w-full max-w-md px-3.5 py-2 rounded-2xl bg-white/95 border border-[#087BFA]/20 shadow-[0_8px_24px_rgba(7,22,56,0.06)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#00C7F2] shrink-0" />
          <span className="text-xs font-bold text-[#071638] truncate">
            {activeCard.title}
          </span>
          <span className="hidden sm:inline text-[11px] text-slate-500 truncate">
            · {activeCard.sceneLabel}
          </span>
        </div>

        {/* 8-Step Dots + Prev/Next/Autoplay */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="flex items-center gap-1"
            role="tablist"
            aria-label="Robot presentation sequence"
          >
            {ROBOT_SERVICE_CARDS.map((card) => {
              const active = card.id === activeServiceId;
              return (
                <button
                  key={card.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Jump to ${card.title}`}
                  onClick={() => onSelectService(card.id)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    active
                      ? 'w-5 bg-[#087BFA]'
                      : 'w-1.5 bg-slate-200 hover:bg-[#00C7F2]'
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
            <button
              type="button"
              onClick={onToggleAutoPlay}
              aria-label={
                isAutoPlaying
                  ? 'Pause automatic sequence'
                  : 'Resume automatic sequence'
              }
              className="p-1 rounded-md text-slate-600 hover:text-[#087BFA] transition-colors cursor-pointer"
              title={isAutoPlaying ? 'Pause Auto-Tour' : 'Resume Auto-Tour'}
            >
              {isAutoPlaying ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous scene"
              className="p-1 rounded-md text-slate-600 hover:text-[#087BFA] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next scene"
              className="p-1 rounded-md text-slate-600 hover:text-[#087BFA] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
