import React, { useEffect, useRef, useState } from 'react';
import { PageRoute } from '../../types';
import {
  ROBOT_SERVICE_CARDS,
  RobotAnimationState,
} from './RobotController';
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

  const [activeServiceId, setActiveServiceId] = useState<string>(
    ROBOT_SERVICE_CARDS[0].id
  );
  const [animationState, setAnimationState] =
    useState<RobotAnimationState>('explaining');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechEnergy, setSpeechEnergy] = useState<number>(0);
  const [greetTriggerCount, setGreetTriggerCount] = useState<number>(0);
  const [isHeroVisible, setIsHeroVisible] = useState<boolean>(true);

  // Track hero viewport visibility with IntersectionObserver to pause off-screen work
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

  // Scene 1: Trigger automatic welcome wave immediately after hero becomes visible
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAnimationState('greeting');
      setGreetTriggerCount((prev) => prev + 1);
    }, 450);
    return () => window.clearTimeout(timer);
  }, []);

  // Continuous 7-scene / 8-service automatic choreography loop (enabled by default)
  useEffect(() => {
    if (!isAutoPlaying || isSpeaking || !isHeroVisible) return;

    const interval = window.setInterval(() => {
      if (document.hidden) return;

      setActiveServiceId((currentId) => {
        const idx = ROBOT_SERVICE_CARDS.findIndex((c) => c.id === currentId);
        const nextIdx = (idx + 1) % ROBOT_SERVICE_CARDS.length;
        const nextCard = ROBOT_SERVICE_CARDS[nextIdx];
        // When looping back to Scene 1 / greeting card, perform the welcoming wave
        if (nextIdx === 0 || nextCard.primaryGestureState === 'greeting') {
          setGreetTriggerCount((prev) => prev + 1);
        }
        setAnimationState(nextCard.primaryGestureState);
        return nextCard.id;
      });
    }, 4300);

    return () => window.clearInterval(interval);
  }, [isAutoPlaying, isSpeaking, isHeroVisible]);

  // Clean up manual interaction resume timer on unmount
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  // Manual service selection temporarily takes control, then resumes autoplay automatically
  const handleSelectService = (serviceId: string) => {
    const selectedCard = ROBOT_SERVICE_CARDS.find((c) => c.id === serviceId);
    setActiveServiceId(serviceId);
    setAnimationState(selectedCard?.primaryGestureState || 'explaining');
    if (selectedCard?.primaryGestureState === 'greeting') {
      setGreetTriggerCount((prev) => prev + 1);
    }
    setIsAutoPlaying(false);

    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = window.setTimeout(() => {
      setIsAutoPlaying(true);
    }, 8500);
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
    if (speaking) {
      setAnimationState('speaking');
    } else {
      setAnimationState('explaining');
    }
  };

  const handleTriggerGreeting = () => {
    setGreetTriggerCount((prev) => prev + 1);
  };

  const activeCard =
    ROBOT_SERVICE_CARDS.find((c) => c.id === activeServiceId) ||
    ROBOT_SERVICE_CARDS[0];

  return (
    <section
      ref={sectionRef}
      aria-label="IAMTECHNI Futuristic 3D AI Ambassador Hero"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F3F8FF] to-[#FFFFFF] border-b border-slate-200/80 py-6 sm:py-8 lg:py-3 lg:h-[calc(100svh-var(--header-height,74px))] lg:min-h-[540px] lg:max-h-[900px] flex items-center"
    >
      {/* Clean Subtle Technical Grid & Pale-Blue Studio Illumination */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            'radial-gradient(circle at 73% 44%, rgba(8, 123, 250, 0.10) 0%, rgba(0, 199, 242, 0.06) 36%, rgba(255, 255, 255, 0) 68%), linear-gradient(to right, rgba(8, 123, 250, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(8, 123, 250, 0.04) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 48px 48px, 48px 48px',
        }}
      />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-full min-h-0 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
        {/* LEFT COLUMN: 46% Desktop Width — Clean Typography, Synchronized Service Bar & CTAs */}
        <div className="w-full lg:w-[46%] min-h-0 flex flex-col justify-center">
          <HeroContent
            activeServiceId={activeServiceId}
            onSelectServiceCard={handleSelectService}
            onNavigate={onNavigate}
            onOpenProjectModal={onOpenProjectModal}
          />
        </div>

        {/* RIGHT COLUMN: 54% Desktop Width — Large Sculpted 3D Humanoid AI Ambassador */}
        <div className="w-full lg:w-[54%] h-[420px] sm:h-[480px] lg:h-full min-h-0 flex flex-col justify-between py-1">
          {/* Top-Right Compact Optional Speech & Greet Controls */}
          <div className="flex items-center justify-center lg:justify-end">
            <RobotSpeechControls
              customScript={activeCard.speechText}
              onSpeakingStateChange={handleSpeakingStateChange}
              onTriggerGreeting={handleTriggerGreeting}
            />
          </div>

          {/* Dominant 3D Humanoid Robot Stage + Unobtrusive Perimeter Indicators */}
          <div className="relative flex-1 min-h-0 w-full flex flex-col justify-end">
            <div className="flex-1 min-h-0 w-full">
              <RobotScene
                activeServiceId={activeServiceId}
                animationState={animationState}
                isSpeaking={isSpeaking}
                speechEnergy={speechEnergy}
                greetTriggerCount={greetTriggerCount}
                isVisible={isHeroVisible}
                onRobotClick={handleTriggerGreeting}
              />
            </div>

            {/* Synchronized Stage Footer Bar & Perimeter Callouts */}
            <ServiceCards
              activeServiceId={activeServiceId}
              isAutoPlaying={isAutoPlaying}
              onSelectService={handleSelectService}
              onToggleAutoPlay={handleToggleAutoPlay}
              onNavigate={onNavigate}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
