import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { PageRoute } from '../../types';
import { RobotAnimationState } from './RobotController';
import { HERO_SERVICE_SLIDES, HeroServiceSlide } from './heroCarouselData';
import { HeroDarkBackground } from './HeroDarkBackground';
import { HeroContent } from './HeroContent';
import { HeroServiceVisuals } from './HeroServiceVisuals';
import { RobotScene } from '../layout/RobotScene';
import { RobotSpeechControls } from './RobotSpeechControls';
import { ROBOT_SPEECH_DATA } from '../../data/robotScript';

export interface HeroSectionProps {
  onNavigate: (route: PageRoute) => void;
  onOpenProjectModal: (serviceName?: string) => void;
  selectedServiceSlug?: string;
  onSelectServiceSlug?: (slug: string) => void;
}

const MUTE_STORAGE_KEY = 'iamtechni_robot_voice_muted_v1';
const AUTO_ROTATE_INTERVAL_MS = 6000;

/**
 * Selects a clear, natural male English voice for the IAMTECHNI AI Ambassador.
 * Priority: Google UK English Male, Microsoft Ravi / Guy / David, Daniel, Alex, or any male English voice.
 */
function selectPreferredVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const englishVoices = voices.filter((v) =>
    v.lang.toLowerCase().startsWith('en')
  );
  const pool = englishVoices.length > 0 ? englishVoices : voices;

  const priorityNames = [
    'google uk english male',
    'microsoft ravi',
    'microsoft guy',
    'microsoft david',
    'daniel',
    'alex',
  ];

  for (const target of priorityNames) {
    const found = pool.find((v) => v.name.toLowerCase().includes(target));
    if (found) return found;
  }

  const anyMale = pool.find((v) => /\bmale\b/i.test(v.name));
  if (anyMale) return anyMale;

  const langPrefs = ['en-in', 'en-gb', 'en-us'];
  for (const lang of langPrefs) {
    const foundLang = pool.find((v) => v.lang.toLowerCase().startsWith(lang));
    if (foundLang) return foundLang;
  }

  return pool[0] || voices[0] || null;
}

/**
 * Formats speech text so the brand "IAMTECHNI" is always pronounced naturally as "I Am Techni".
 */
function formatBrandPronunciation(text: string): string {
  return text.replace(/IAMTECHNI/gi, 'I Am Techni');
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenProjectModal,
  selectedServiceSlug,
  onSelectServiceSlug,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isHeroVisible, setIsHeroVisible] = useState<boolean>(true);
  const [greetTriggerCount, setGreetTriggerCount] = useState<number>(0);
  const [gesturePulseState, setGesturePulseState] =
    useState<RobotAnimationState>('presenting');
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 1280px)').matches
      : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(min-width: 1280px)');
    const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    setIsDesktop(mql.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  // Voice Guide State
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState<boolean>(false);
  const [speechEnergy, setSpeechEnergy] = useState<number>(0);
  const [captionText, setCaptionText] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.sessionStorage.getItem(MUTE_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  // Refs for timers & speech synthesis
  const sectionRef = useRef<HTMLElement | null>(null);
  const rotateTimerRef = useRef<number | null>(null);
  const energyIntervalRef = useRef<number | null>(null);
  const keepAliveIntervalRef = useRef<number | null>(null);
  const cachedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const utterancePoolRef = useRef<SpeechSynthesisUtterance[]>([]);
  const voiceSessionIdRef = useRef<number>(0);
  const isMutedRef = useRef<boolean>(isMuted);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const activeSlide: HeroServiceSlide =
    HERO_SERVICE_SLIDES[activeIndex] || HERO_SERVICE_SLIDES[0];

  // Trigger robot pointing/presenting gesture whenever activeIndex changes
  useEffect(() => {
    const slide = HERO_SERVICE_SLIDES[activeIndex] || HERO_SERVICE_SLIDES[0];
    setGesturePulseState(slide.gestureState);
  }, [activeIndex]);

  // IntersectionObserver to pause rotation and speech when hero scrolls out of view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
        setIsHeroVisible(visible);
      },
      { threshold: [0, 0.15, 0.5] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Preload Web Speech API Voices
  const ensureVoicesLoaded = useCallback((): Promise<SpeechSynthesisVoice | null> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve(null);
        return;
      }
      const existing = window.speechSynthesis.getVoices();
      if (existing.length > 0) {
        if (!cachedVoiceRef.current) {
          cachedVoiceRef.current = selectPreferredVoice(existing);
        }
        resolve(cachedVoiceRef.current);
        return;
      }
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        window.speechSynthesis.removeEventListener('voiceschanged', finish);
        const loaded = window.speechSynthesis.getVoices();
        cachedVoiceRef.current = selectPreferredVoice(loaded);
        resolve(cachedVoiceRef.current);
      };
      window.speechSynthesis.addEventListener('voiceschanged', finish);
      window.setTimeout(finish, 600);
    });
  }, []);

  useEffect(() => {
    ensureVoicesLoaded();
  }, [ensureVoicesLoaded]);

  const stopEnergyPulse = useCallback(() => {
    if (energyIntervalRef.current !== null) {
      window.clearInterval(energyIntervalRef.current);
      energyIntervalRef.current = null;
    }
    setSpeechEnergy(0);
  }, []);

  const startEnergyPulse = useCallback(() => {
    stopEnergyPulse();
    if (prefersReducedMotion) {
      setSpeechEnergy(0.35);
      return;
    }
    energyIntervalRef.current = window.setInterval(() => {
      const wave =
        0.35 +
        Math.sin(Date.now() * 0.018) * 0.25 +
        Math.cos(Date.now() * 0.031) * 0.2;
      setSpeechEnergy(Math.max(0.15, Math.min(1, wave)));
    }, 85);
  }, [prefersReducedMotion, stopEnergyPulse]);

  const stopChromeKeepAlive = useCallback(() => {
    if (keepAliveIntervalRef.current !== null) {
      window.clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
  }, []);

  const startChromeKeepAlive = useCallback(() => {
    stopChromeKeepAlive();
    keepAliveIntervalRef.current = window.setInterval(() => {
      if (
        typeof window !== 'undefined' &&
        'speechSynthesis' in window &&
        window.speechSynthesis.speaking &&
        !window.speechSynthesis.paused
      ) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  }, [stopChromeKeepAlive]);

  const cancelSpeech = useCallback(() => {
    voiceSessionIdRef.current += 1;
    stopChromeKeepAlive();
    stopEnergyPulse();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore browser cancel errors
      }
    }
    utterancePoolRef.current = [];
    setIsVoiceSpeaking(false);
    setCaptionText(null);
  }, [stopChromeKeepAlive, stopEnergyPulse]);

  useEffect(() => {
    if (!isHeroVisible && isVoiceSpeaking) {
      cancelSpeech();
    }
  }, [isHeroVisible, isVoiceSpeaking, cancelSpeech]);

  useEffect(() => {
    return () => {
      cancelSpeech();
    };
  }, [cancelSpeech]);

  const speakLine = useCallback(
    async (rawText: string, onDone?: () => void) => {
      if (
        isMutedRef.current ||
        typeof window === 'undefined' ||
        !('speechSynthesis' in window) ||
        typeof SpeechSynthesisUtterance === 'undefined'
      ) {
        onDone?.();
        return;
      }

      const sessionId = voiceSessionIdRef.current + 1;
      voiceSessionIdRef.current = sessionId;

      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }

      const preferredVoice = await ensureVoicesLoaded();
      if (voiceSessionIdRef.current !== sessionId || isMutedRef.current) {
        onDone?.();
        return;
      }

      try {
        const utterance = new SpeechSynthesisUtterance(
          formatBrandPronunciation(rawText)
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
          utterance.lang = preferredVoice.lang;
        } else {
          utterance.lang = 'en-IN';
        }
        utterance.rate = 0.95;
        utterance.pitch = 0.9;
        utterance.volume = 1;

        utterancePoolRef.current.push(utterance);
        if (utterancePoolRef.current.length > 15) {
          utterancePoolRef.current.shift();
        }

        let finished = false;
        const finalize = () => {
          if (finished) return;
          finished = true;
          if (voiceSessionIdRef.current === sessionId) {
            stopChromeKeepAlive();
            stopEnergyPulse();
            setIsVoiceSpeaking(false);
            setCaptionText(null);
            onDone?.();
          }
        };

        utterance.onboundary = () => {
          if (voiceSessionIdRef.current === sessionId) {
            setSpeechEnergy(0.45 + Math.random() * 0.55);
          }
        };
        utterance.onend = finalize;
        utterance.onerror = finalize;

        setCaptionText(rawText);
        setIsVoiceSpeaking(true);
        startEnergyPulse();
        startChromeKeepAlive();
        window.speechSynthesis.speak(utterance);
      } catch {
        stopEnergyPulse();
        setIsVoiceSpeaking(false);
        setCaptionText(null);
        onDone?.();
      }
    },
    [ensureVoicesLoaded, startChromeKeepAlive, startEnergyPulse, stopChromeKeepAlive, stopEnergyPulse]
  );

  // Synchronized 8-Service Auto-Rotation Timer (every 6 seconds, pauses on hover or when paused)
  useEffect(() => {
    if (rotateTimerRef.current !== null) {
      window.clearInterval(rotateTimerRef.current);
      rotateTimerRef.current = null;
    }

    if (!isAutoPlaying || isHovered || !isHeroVisible || isVoiceSpeaking) {
      return;
    }

    rotateTimerRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SERVICE_SLIDES.length);
    }, AUTO_ROTATE_INTERVAL_MS);

    return () => {
      if (rotateTimerRef.current !== null) {
        window.clearInterval(rotateTimerRef.current);
        rotateTimerRef.current = null;
      }
    };
  }, [isAutoPlaying, isHovered, isHeroVisible, isVoiceSpeaking]);

  const handleSelectSlide = useCallback(
    (index: number) => {
      const normalized =
        ((index % HERO_SERVICE_SLIDES.length) + HERO_SERVICE_SLIDES.length) %
        HERO_SERVICE_SLIDES.length;
      setActiveIndex(normalized);
      const targetSlide = HERO_SERVICE_SLIDES[normalized];
      if (targetSlide) {
        onSelectServiceSlug?.(targetSlide.slug);
      }
      if (isVoiceSpeaking && targetSlide) {
        speakLine(targetSlide.spokenLine);
      }
    },
    [isVoiceSpeaking, onSelectServiceSlug, speakLine]
  );

  const handlePrevSlide = useCallback(() => {
    handleSelectSlide(activeIndex - 1);
  }, [activeIndex, handleSelectSlide]);

  const handleNextSlide = useCallback(() => {
    handleSelectSlide(activeIndex + 1);
  }, [activeIndex, handleSelectSlide]);

  // Voice Guide Controls
  const handleToggleVoiceGuide = useCallback(() => {
    setHasInteracted(true);
    if (isVoiceSpeaking) {
      cancelSpeech();
      return;
    }
    if (isMutedRef.current) {
      isMutedRef.current = false;
      setIsMuted(false);
      try {
        window.sessionStorage.setItem(MUTE_STORAGE_KEY, '0');
      } catch {
        // Ignore
      }
    }
    speakLine(activeSlide.spokenLine);
  }, [activeSlide.spokenLine, cancelSpeech, isVoiceSpeaking, speakLine]);

  const handleToggleMute = useCallback(() => {
    setHasInteracted(true);
    const nextMuted = !isMutedRef.current;
    isMutedRef.current = nextMuted;
    setIsMuted(nextMuted);
    try {
      window.sessionStorage.setItem(MUTE_STORAGE_KEY, nextMuted ? '1' : '0');
    } catch {
      // Ignore
    }
    if (nextMuted) {
      cancelSpeech();
    } else {
      speakLine(activeSlide.spokenLine);
    }
  }, [activeSlide.spokenLine, cancelSpeech, speakLine]);

  const handleTriggerGreeting = useCallback(() => {
    setHasInteracted(true);
    setGreetTriggerCount((prev) => prev + 1);
    if (!isMutedRef.current) {
      speakLine(ROBOT_SPEECH_DATA.greetMessage);
    }
  }, [speakLine]);

  // Touch Swipe Support on Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const deltaX = endX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(deltaX) > 44) {
      if (deltaX < 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
  };

  const effectiveAnimationState: RobotAnimationState = isVoiceSpeaking
    ? 'speaking'
    : gesturePulseState;

  return (
    <section
      ref={sectionRef}
      aria-label="IAMTECHNI AI Innovation & Engineering Hero"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-auto pt-6 sm:pt-8 xl:pt-12 pb-6 xl:pb-24 bg-[#040814] text-white overflow-x-clip flex flex-col justify-between select-none"
    >
      {/* Sophisticated Dark Animated Background */}
      <HeroDarkBackground
        activeAccentHex={activeSlide.accentHex}
        activeSecondaryHex={activeSlide.secondaryHex}
      />

      {/* Main Hero Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex-1 min-h-0 flex flex-col justify-between">
        {/* ===================================================================
            DESKTOP 3-COLUMN COMPOSITION (xl: >= 1280px)
            Left (~38%): Dynamic Service Information
            Center (~26%): Main Animated 3D Robot Centerpiece
            Right (~36%): Dynamic Service Visuals Showcase
        =================================================================== */}
        <div
          className="hidden xl:grid items-start gap-8 flex-1 min-h-0 w-full min-w-0"
          style={{ gridTemplateColumns: 'minmax(0, 38fr) minmax(0, 26fr) minmax(0, 36fr)' }}
        >
          {/* LEFT COLUMN: Dynamic Service Information (38%) */}
          <div className="min-w-0 w-full flex flex-col justify-start">
            <HeroContent
              slide={activeSlide}
              onNavigate={onNavigate}
              onOpenProjectModal={onOpenProjectModal}
              mode="desktop"
              isHeadingH1={isDesktop}
            />
          </div>

          {/* CENTER COLUMN: Main Animated 3D Robot Centerpiece (26%) */}
          <div className="min-w-0 w-full relative flex flex-col items-center justify-between h-[clamp(350px,58dvh,530px)] min-h-0 py-0.5">
            {/* Directional Robot Gesture Status Pill */}
            <motion.div
              key={`gesture-pill-${activeSlide.id}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="shrink-0 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#07152E]/85 backdrop-blur-md border border-[#00D2FF]/30 text-[9.5px] xl:text-[10px] font-mono uppercase tracking-widest text-slate-300 shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
            >
              {activeSlide.gestureDirection === 'left' ? (
                <>
                  <ArrowLeft className="w-3 h-3 text-[#00D2FF] animate-pulse shrink-0" />
                  <span>AI AMBASSADOR // PRESENTING SERVICE</span>
                </>
              ) : (
                <>
                  <span>AI AMBASSADOR // SHOWCASING ARCHITECTURE</span>
                  <ArrowRight className="w-3 h-3 text-[#00D2FF] animate-pulse shrink-0" />
                </>
              )}
            </motion.div>

            {/* 3D Robot Stage */}
            <div className="relative w-full flex-1 min-h-[250px] self-stretch flex items-center justify-center">
              <div className="absolute inset-0">
                {isDesktop && (
                  <RobotScene
                    activeServiceId={activeSlide.robotServiceId}
                    animationState={effectiveAnimationState}
                    isSpeaking={isVoiceSpeaking}
                    speechEnergy={speechEnergy}
                    greetTriggerCount={greetTriggerCount}
                    isVisible={isHeroVisible}
                    onRobotClick={handleToggleVoiceGuide}
                  />
                )}
              </div>

              {/* Live Speech Caption Overlay when Voice Guide is active */}
              <AnimatePresence>
                {captionText && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="pointer-events-none absolute bottom-2 inset-x-3 mx-auto max-w-xs rounded-xl bg-[#051024]/92 backdrop-blur-xl border border-[#00D2FF]/40 px-3 py-1.5 text-center text-[11px] text-slate-100 leading-snug shadow-[0_10px_28px_rgba(0,0,0,0.55)]"
                  >
                    {captionText}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Robot Voice & Greeting Controls */}
            <div className="shrink-0 mt-1 flex flex-col items-center">
              <RobotSpeechControls
                isSpeaking={isVoiceSpeaking}
                isMuted={isMuted}
                showTapToHearHint={!hasInteracted && !isMuted}
                onToggleVoiceGuide={handleToggleVoiceGuide}
                onToggleMute={handleToggleMute}
                onTriggerGreeting={handleTriggerGreeting}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Dynamic Service Visuals Showcase (36%) */}
          <div className="min-w-0 w-full flex flex-col justify-start">
            <HeroServiceVisuals slide={activeSlide} onNavigate={onNavigate} />
          </div>
        </div>

        {/* ===================================================================
            MOBILE & TABLET VERTICAL STACK (< 1280px)
            Order:
            1. Text first: eyebrow, heading (max 3 lines), description
            2. Robot: 3D robot stage + voice controls
            3. Cards: service visuals showcase
            4. Chips & both buttons: tech chips + CTA buttons + mb-6 (>=24px)
            5. Slide tabs: scrolling sideways with prev/next controls
        =================================================================== */}
        <div className="flex xl:hidden flex-col items-center justify-between gap-3 sm:gap-4 w-full flex-1 min-h-0 py-1">
          {/* 1. Text first: Service Heading & Short Supporting Description */}
          <HeroContent
            slide={activeSlide}
            onNavigate={onNavigate}
            onOpenProjectModal={onOpenProjectModal}
            mode="mobile-top"
            isHeadingH1={!isDesktop}
          />

          {/* 2. Robot: Central 3D Robot Animation & Compact Voice Controls */}
          <div className="relative w-full min-h-[190px] sm:min-h-[250px] self-stretch flex flex-col items-center justify-center my-1 sm:my-2">
            <div className="relative w-full max-w-[380px] sm:max-w-[440px] h-[180px] sm:h-[240px] self-stretch mx-auto">
              <div className="absolute inset-0">
                {!isDesktop && (
                  <RobotScene
                    activeServiceId={activeSlide.robotServiceId}
                    animationState={effectiveAnimationState}
                    isSpeaking={isVoiceSpeaking}
                    speechEnergy={speechEnergy}
                    greetTriggerCount={greetTriggerCount}
                    isVisible={isHeroVisible}
                    onRobotClick={handleToggleVoiceGuide}
                  />
                )}
              </div>

              {/* Live Speech Caption Overlay on Mobile */}
              <AnimatePresence>
                {captionText && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="pointer-events-none absolute bottom-1 inset-x-3 mx-auto max-w-xs rounded-xl bg-[#051024]/92 backdrop-blur-xl border border-[#00D2FF]/40 px-2.5 py-1 text-center text-[10.5px] text-slate-100 leading-snug shadow-[0_8px_20px_rgba(0,0,0,0.55)]"
                  >
                    {captionText}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="shrink-0 mt-1">
              <RobotSpeechControls
                isSpeaking={isVoiceSpeaking}
                isMuted={isMuted}
                showTapToHearHint={false}
                onToggleVoiceGuide={handleToggleVoiceGuide}
                onToggleMute={handleToggleMute}
                onTriggerGreeting={handleTriggerGreeting}
              />
            </div>
          </div>

          {/* 3. Cards: Dynamic Service Visuals Showcase */}
          <div className="w-full max-w-xl mx-auto my-1 sm:my-2 shrink-0">
            <HeroServiceVisuals slide={activeSlide} onNavigate={onNavigate} compact={true} />
          </div>

          {/* 4. Chips and both buttons: Tech chips + CTA Buttons (with mb-6 space above slide tabs) */}
          <div className="w-full max-w-xl mx-auto shrink-0">
            <HeroContent
              slide={activeSlide}
              onNavigate={onNavigate}
              onOpenProjectModal={onOpenProjectModal}
              mode="mobile-bottom"
            />
          </div>
        </div>

        {/* ===================================================================
            SYNCHRONIZED 8-SERVICE SLIDE TABS BAR
            Tabs on the left (all 8 fully visible) and controls on the far right
        =================================================================== */}
        <div className="relative z-20 mt-3 pt-2.5 sm:pt-3 border-t border-white/10 flex items-center justify-between gap-3 sm:gap-4 w-full shrink-0">
          {/* 8 Service Interactive Tabs (01 Generative AI … 08 Digital Growth) */}
          <div
            role="tablist"
            aria-label="Select active IAMTECHNI service"
            className="flex items-center gap-1.5 sm:gap-2 min-w-0 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap py-1 pr-2"
          >
            {HERO_SERVICE_SLIDES.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Service ${idx + 1}: ${item.categoryLabel}`}
                  onClick={() => handleSelectSlide(idx)}
                  className={`group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200 cursor-pointer shrink-0 min-h-[38px] ${
                    isActive
                      ? 'bg-[#0A1F44] text-white border border-[#00D2FF]/65 shadow-[0_0_14px_rgba(0,210,255,0.25)]'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  <span
                    className={`font-mono text-xs font-bold ${
                      isActive ? 'text-[#00D2FF]' : 'text-slate-500'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <span className="whitespace-nowrap">{item.shortTitle}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Prev, Pause, and Next Buttons — Far right end lined up with hero right-side card */}
          <div className="inline-flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handlePrevSlide}
              aria-label="Previous service"
              className="w-8 h-8 rounded-full bg-[#081632]/90 hover:bg-[#0E244D] border border-white/15 hover:border-[#00D2FF]/60 flex items-center justify-center text-slate-200 hover:text-[#00D2FF] transition-colors cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsAutoPlaying((prev) => !prev)}
              aria-label={isAutoPlaying ? 'Pause service rotation' : 'Resume service rotation'}
              className="w-8 h-8 rounded-full bg-[#081632]/90 hover:bg-[#0E244D] border border-white/15 hover:border-[#00D2FF]/60 flex items-center justify-center text-slate-200 hover:text-[#00D2FF] transition-colors cursor-pointer active:scale-95"
            >
              {isAutoPlaying ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={handleNextSlide}
              aria-label="Next service"
              className="w-8 h-8 rounded-full bg-[#081632]/90 hover:bg-[#0E244D] border border-white/15 hover:border-[#00D2FF]/60 flex items-center justify-center text-slate-200 hover:text-[#00D2FF] transition-colors cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
