import React, { useEffect, useRef } from 'react';
import {
  ArrowRight,
  MessageSquare,
  ArrowUpRight,
  Cpu,
  Globe,
  Smartphone,
  Cloud,
  TrendingUp,
  Code2,
  Bot,
  BarChart3,
} from 'lucide-react';
import gsap from 'gsap';
import { PageRoute } from '../../types';
import { ROBOT_SERVICE_CARDS } from './RobotController';

export interface HeroContentProps {
  activeServiceId: string;
  onSelectServiceCard: (cardId: string) => void;
  onNavigate: (route: PageRoute) => void;
  onOpenProjectModal: (serviceName?: string) => void;
}

const getServiceIcon = (id: string) => {
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
    case 'software-solutions':
      return <Code2 className="w-4 h-4" />;
    case 'robotics-automation':
      return <Bot className="w-4 h-4" />;
    case 'uiux-analytics':
    default:
      return <BarChart3 className="w-4 h-4" />;
  }
};

export const HeroContent: React.FC<HeroContentProps> = ({
  activeServiceId,
  onSelectServiceCard,
  onNavigate,
  onOpenProjectModal,
}) => {
  const activeServiceRef = useRef<HTMLDivElement | null>(null);

  const activeIndex = Math.max(
    0,
    ROBOT_SERVICE_CARDS.findIndex((c) => c.id === activeServiceId)
  );
  const activeCard = ROBOT_SERVICE_CARDS[activeIndex] || ROBOT_SERVICE_CARDS[0];

  // Subtle transition whenever activeServiceId updates in sync with the 3D robot
  useEffect(() => {
    const el = activeServiceRef.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      { y: 3 },
      { y: 0, duration: 0.32, ease: 'power2.out', clearProps: 'transform' }
    );
  }, [activeServiceId]);

  return (
    <div className="flex flex-col justify-center min-h-0 space-y-3.5 xl:space-y-4 text-left">
      {/* Eyebrow */}
      <div>
        <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-extrabold tracking-[0.14em] uppercase text-[#087BFA]">
          <span className="w-2 h-2 rounded-full bg-[#00C7F2] shrink-0" />
          <span>IAMTECHNI | TECHNOLOGY THAT MOVES YOU FORWARD</span>
        </div>
      </div>

      {/* Main Headline (Responsive clamp for 1366x768 through 1440x900+) */}
      <h1 className="text-[clamp(1.85rem,3.1vw,3.35rem)] font-extrabold tracking-tight text-[#071638] leading-[1.08]">
        Build <span className="text-[#087BFA]">Smarter.</span>{' '}
        Innovate{' '}
        <span className="bg-gradient-to-r from-[#087BFA] via-[#174DEB] to-[#00C7F2] bg-clip-text text-transparent">
          Faster.
        </span>{' '}
        Grow <span className="text-[#174DEB]">Further.</span>
      </h1>

      {/* Supporting Description */}
      <p className="text-[clamp(0.875rem,1.05vw,1.05rem)] text-slate-600 leading-relaxed max-w-xl font-normal">
        We transform ideas into intelligent digital solutions through AI,
        software engineering, modern web experiences, cloud technologies, and
        digital growth.
      </p>

      {/* Compact Animated Service Label & Synchronized Explanation */}
      <div className="pt-0.5 space-y-2.5">
        {/* Live Synchronized Active Service Banner */}
        <div
          ref={activeServiceRef}
          className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#087BFA]/25 shadow-[0_8px_28px_rgba(7,22,56,0.06)]"
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-6 h-6 rounded-lg bg-[#087BFA] text-white flex items-center justify-center shrink-0">
                {getServiceIcon(activeCard.id)}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#071638] truncate">
                {activeCard.title}
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold text-[#087BFA]">
                · {activeCard.badgeText}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate(activeCard.route)}
              className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-[#087BFA] hover:text-[#174DEB] transition-colors cursor-pointer"
            >
              <span>Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
            {activeCard.explanation}
          </p>
        </div>

        {/* Compact Interactive 8-Service Selector Grid */}
        <div
          className="flex flex-wrap gap-1.5"
          role="tablist"
          aria-label="IAMTECHNI Core Services"
        >
          {ROBOT_SERVICE_CARDS.map((card) => {
            const isActive = card.id === activeServiceId;
            return (
              <button
                key={card.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectServiceCard(card.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? 'bg-[#087BFA] text-white border-[#087BFA] shadow-[0_4px_12px_rgba(8,123,250,0.24)]'
                    : 'bg-white/95 hover:bg-[#F3F8FF] text-[#071638] border-slate-200/90 hover:border-[#087BFA]/40'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-[#00C7F2]' : 'bg-[#087BFA]/50'
                  }`}
                />
                <span>{card.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary & Secondary CTA Buttons */}
      <div className="pt-1 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
        <button
          type="button"
          onClick={() => onNavigate('/services')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#087BFA] to-[#174DEB] hover:from-[#174DEB] hover:to-[#7200F5] text-white font-bold text-xs sm:text-sm shadow-[0_10px_24px_rgba(8,123,250,0.26)] hover:shadow-[0_14px_30px_rgba(23,77,235,0.32)] transition-all active:scale-[0.99] cursor-pointer"
        >
          <span>Explore Our Services</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onOpenProjectModal('General Technology Inquiry')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-[#F3F8FF] text-[#071638] font-bold text-xs sm:text-sm border-2 border-[#087BFA]/30 hover:border-[#087BFA] shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-[#087BFA]" />
          <span>Talk to Our Team</span>
        </button>
      </div>
    </div>
  );
};
