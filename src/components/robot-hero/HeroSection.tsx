import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';
import { PageRoute } from '../../types';
import { ROBOT_SERVICE_CARDS } from './RobotController';
import { HeroContent } from './HeroContent';
import { RobotScene } from '../layout/RobotScene';
import { ServiceCards } from './ServiceCards';
import { RobotSpeechControls } from './RobotSpeechControls';

export interface HeroSectionProps {
  onNavigate: (route: PageRoute) => void;
  onOpenProjectModal: (serviceName?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenProjectModal,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Active service tracked by id
  const [activeServiceSlug, setActiveServiceSlug] = useState<string>('web-dev');

  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechEnergy, setSpeechEnergy] = useState<number>(0);
  const [greetTriggerCount, setGreetTriggerCount] = useState<number>(0);
  const [isHeroVisible, setIsHeroVisible] = useState<boolean>(true);

  // Mouse Parallax coordinates (-0.5 to 0.5)
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (prefersReducedMotion || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setParallax({ x: nx, y: ny });
    },
    [prefersReducedMotion]
  );

  const handlePointerLeave = useCallback(() => {
    setParallax({ x: 0, y: 0 });
  }, []);

  // Track hero viewport visibility with IntersectionObserver to pause when off-screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsHeroVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-playing scene tour every 6 seconds
  useEffect(() => {
    if (!isAutoPlaying || !isHeroVisible || isSpeaking) return;

    const interval = window.setInterval(() => {
      setActiveServiceSlug((prev) => {
        const idx = ROBOT_SERVICE_CARDS.findIndex(
          (c) => c.id === prev || c.route.includes(prev) || prev.includes(c.id)
        );
        const nextIdx = (idx + 1) % ROBOT_SERVICE_CARDS.length;
        return ROBOT_SERVICE_CARDS[nextIdx].id;
      });
    }, 6000);

    return () => window.clearInterval(interval);
  }, [isAutoPlaying, isHeroVisible, isSpeaking]);

  // Trigger welcome wave on load
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setGreetTriggerCount((prev) => prev + 1);
    }, 600);
    return () => window.clearTimeout(timer);
  }, []);

  // Clean up manual interaction resume timer on unmount
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  // Service selection handler from Chips, Cards, or Scene Controller
  const handleSelectService = (idOrSlug: string) => {
    setActiveServiceSlug(idOrSlug);
    setGreetTriggerCount((prev) => prev + 1);
  };

  const handleToggleAutoPlay = () => {
    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
    }
    setIsAutoPlaying((prev) => !prev);
  };

  const handleSpeakingStateChange = (speaking: boolean, energy: number) => {
    setIsSpeaking(speaking);
    setSpeechEnergy(energy);
  };

  const handleTriggerGreeting = () => {
    setGreetTriggerCount((prev) => prev + 1);
  };

  // Find relevant speech script based on active service
  const matchedRobotCard =
    ROBOT_SERVICE_CARDS.find(
      (c) =>
        c.id === activeServiceSlug ||
        c.route.includes(activeServiceSlug) ||
        activeServiceSlug.includes(c.id)
    ) || ROBOT_SERVICE_CARDS[0];

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-label="IAMTECHNI Futuristic AI Ambassador Hero"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F4F8FF] to-[#FFFFFF] border-b border-slate-200/80 py-8 sm:py-10 lg:py-8 lg:min-h-[calc(100svh-var(--header-height,74px))] lg:max-h-[1020px] flex items-center"
    >
      {/* 1. Subtle Technical Precision Grid & Pale-Blue Ambient Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 74% 45%, rgba(8, 123, 250, 0.12) 0%, rgba(0, 199, 242, 0.06) 38%, rgba(255, 255, 255, 0) 70%), linear-gradient(to right, rgba(8, 123, 250, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(8, 123, 250, 0.04) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 48px 48px, 48px 48px',
        }}
      />

      {/* 2. Main Page Container (Aligned with Navbar Logo & CTA Bounds) */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-0 flex flex-col md:flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Eyebrow → Headline → Subtitle → 9 Chips → Active Card → CTAs */}
        {/* Mobile: text first (order-1) | Desktop: left side (order-1)               */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-[48%] xl:w-[46%] min-h-0 flex flex-col justify-center order-1 md:order-2 lg:order-1 items-center lg:items-start text-center lg:text-left">
          <HeroContent
            activeServiceSlug={activeServiceSlug}
            onSelectService={handleSelectService}
            onNavigate={onNavigate}
            onOpenProjectModal={onOpenProjectModal}
            isAutoPlaying={isAutoPlaying && isHeroVisible}
          />
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: 3D Coded Humanoid Robot Presenter Stage (Canvas)            */}
        {/* Tablet: robot stacked above text (order-1) | Desktop: right side (order-2) */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-[52%] xl:w-[54%] min-h-0 flex flex-col justify-center items-center order-2 md:order-1 lg:order-2 relative">
          {/* STAGE CONTAINER WITH 4 CARDS, TOP-RIGHT VOICE CONTROLS & 3D ROBOT */}
          <div className="relative w-full max-w-[620px] h-[400px] sm:h-[460px] lg:h-[500px] xl:h-[530px] flex flex-col items-center justify-between">
            {/* Top-Right Voice Note & Wave Buttons */}
            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-30 pointer-events-auto">
              <RobotSpeechControls
                customScript={matchedRobotCard.speechText}
                autoPlay={false}
                onSpeakingStateChange={handleSpeakingStateChange}
                onTriggerGreeting={handleTriggerGreeting}
              />
            </div>

            {/* Centered 3D Coded Humanoid Robot Presenter */}
            <div className="relative w-full flex-1 min-h-[300px] sm:min-h-[360px] flex items-center justify-center">
              <RobotScene
                activeServiceId={activeServiceSlug}
                animationState={matchedRobotCard.primaryGestureState}
                isSpeaking={isSpeaking}
                speechEnergy={speechEnergy}
                greetTriggerCount={greetTriggerCount}
                isVisible={isHeroVisible}
                onRobotClick={handleTriggerGreeting}
              />
            </div>

            {/* 4 Symmetrical Floating Cards + Centered Scene Controller */}
            <ServiceCards
              activeServiceId={activeServiceSlug}
              isAutoPlaying={isAutoPlaying}
              onSelectService={handleSelectService}
              onToggleAutoPlay={handleToggleAutoPlay}
              onNavigate={onNavigate}
              parallaxOffset={parallax}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
