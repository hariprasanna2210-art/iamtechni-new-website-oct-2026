import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { PageRoute } from '../../types';
import { HeroContent } from './HeroContent';
import { HeroParticlesBackground } from './HeroParticlesBackground';
import { RobotScene } from '../layout/RobotScene';
import { ServiceCards, mapServiceToOrbitCardId } from './ServiceCards';
import { RobotSpeechControls } from './RobotSpeechControls';
import {
  ROBOT_SPEECH_DATA,
  getHeroFloatingServiceCards,
  getRobotTourSteps,
  getStepReadingDurationMs,
  HeroFloatingServiceCard,
} from '../../data/robotScript';

const MUTE_STORAGE_KEY = 'iamtechni_robot_muted';

export interface HeroSectionProps {
  onNavigate: (route: PageRoute) => void;
  onOpenProjectModal: (serviceName?: string) => void;
  selectedServiceSlug?: string;
  onSelectServiceSlug?: (slug: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenProjectModal,
  selectedServiceSlug,
  onSelectServiceSlug,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const floatingCards = useMemo(() => getHeroFloatingServiceCards(), []);
  const tourSteps = useMemo(() => getRobotTourSteps(floatingCards), [floatingCards]);

  const [activeServiceSlug, setActiveServiceSlug] = useState<string>(() =>
    selectedServiceSlug
      ? mapServiceToOrbitCardId(selectedServiceSlug)
      : floatingCards[0]?.slug || 'ai-machine-learning'
  );
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState<boolean>(false);
  const [isRobotTalkingVisual, setIsRobotTalkingVisual] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return (
        typeof window !== 'undefined' &&
        window.sessionStorage.getItem(MUTE_STORAGE_KEY) === '1'
      );
    } catch {
      return false;
    }
  });
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [speechEnergy, setSpeechEnergy] = useState<number>(0);
  const [captionText, setCaptionText] = useState<string | null>(null);
  const [greetTriggerCount, setGreetTriggerCount] = useState<number>(0);
  const [isHeroVisible, setIsHeroVisible] = useState<boolean>(true);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Stable refs so state updates never cancel speech or reset timers in useEffect cleanups
  const tourSessionIdRef = useRef<number>(0);
  const currentTourStepRef = useRef<number>(0);
  const isAutoPlayingRef = useRef<boolean>(true);
  const isHeroVisibleRef = useRef<boolean>(true);
  const isMutedRef = useRef<boolean>(isMuted);
  const hasInteractedRef = useRef<boolean>(false);
  const voiceTourEnabledRef = useRef<boolean>(false);
  const hasCompletedVoiceTourOnceRef = useRef<boolean>(false);
  const isCardScrollSpeechRef = useRef<boolean>(false);
  const hasStartedInitialTourRef = useRef<boolean>(false);

  // Timers & Chrome speechSynthesis GC / 15s cutoff workarounds
  const stepTimerRef = useRef<number | null>(null);
  const energyIntervalRef = useRef<number | null>(null);
  const chromeKeepAliveRef = useRef<number | null>(null);
  const utterancePoolRef = useRef<SpeechSynthesisUtterance[]>([]);
  const onSelectServiceSlugRef = useRef(onSelectServiceSlug);

  useEffect(() => {
    onSelectServiceSlugRef.current = onSelectServiceSlug;
  }, [onSelectServiceSlug]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    isAutoPlayingRef.current = isAutoPlaying;
  }, [isAutoPlaying]);

  // Sync with external selectedServiceSlug prop if updated by parent/carousel
  useEffect(() => {
    if (selectedServiceSlug) {
      const targetHeroSlug = mapServiceToOrbitCardId(selectedServiceSlug);
      const matched = floatingCards.find(
        (c) => c.slug === targetHeroSlug || c.id === targetHeroSlug
      );
      if (matched) {
        setActiveServiceSlug(matched.slug);
      }
    }
  }, [selectedServiceSlug, floatingCards]);

  const stopEnergyPulse = useCallback(() => {
    if (energyIntervalRef.current !== null) {
      window.clearInterval(energyIntervalRef.current);
      energyIntervalRef.current = null;
    }
    setSpeechEnergy(0);
    setIsRobotTalkingVisual(false);
  }, []);

  const startEnergyPulse = useCallback(() => {
    if (energyIntervalRef.current !== null) {
      window.clearInterval(energyIntervalRef.current);
    }
    setIsRobotTalkingVisual(true);
    setSpeechEnergy(0.75);
    energyIntervalRef.current = window.setInterval(() => {
      setSpeechEnergy(0.4 + Math.random() * 0.6);
    }, 100);
  }, []);

  const stopChromeKeepAlive = useCallback(() => {
    if (chromeKeepAliveRef.current !== null) {
      window.clearInterval(chromeKeepAliveRef.current);
      chromeKeepAliveRef.current = null;
    }
  }, []);

  // Standard Chrome workaround: pause() then resume() every 10 seconds while speaking
  const startChromeKeepAlive = useCallback(() => {
    stopChromeKeepAlive();
    chromeKeepAliveRef.current = window.setInterval(() => {
      if (
        typeof window !== 'undefined' &&
        'speechSynthesis' in window &&
        window.speechSynthesis.speaking &&
        !window.speechSynthesis.paused
      ) {
        try {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } catch {
          // Ignore pause/resume errors
        }
      }
    }, 10000);
  }, [stopChromeKeepAlive]);

  const clearStepTimer = useCallback(() => {
    if (stepTimerRef.current !== null) {
      window.clearTimeout(stepTimerRef.current);
      stepTimerRef.current = null;
    }
  }, []);

  const cancelBrowserSpeechOnly = useCallback(() => {
    stopChromeKeepAlive();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore cancel errors
      }
    }
    setIsVoiceSpeaking(false);
  }, [stopChromeKeepAlive]);

  // Select preferred English voice (prefer en-IN, fall back to en-US)
  const selectBestVoice = useCallback((voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    if (!voices || voices.length === 0) return null;

    const enInVoice =
      voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('en-in') &&
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Microsoft'))
      ) || voices.find((v) => v.lang.toLowerCase().startsWith('en-in'));

    if (enInVoice) return enInVoice;

    const enUsVoice =
      voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('en-us') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Microsoft') ||
            v.name.includes('Samantha'))
      ) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('en-us')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('en'));

    return enUsVoice || null;
  }, []);

  // Wait for voices to load (speechSynthesis.onvoiceschanged) so the first line is never skipped
  const ensureVoicesLoaded = useCallback((): Promise<SpeechSynthesisVoice | null> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve(null);
        return;
      }
      const existing = window.speechSynthesis.getVoices();
      if (existing && existing.length > 0) {
        resolve(selectBestVoice(existing));
        return;
      }

      let resolved = false;
      const done = () => {
        if (resolved) return;
        resolved = true;
        const loaded = window.speechSynthesis.getVoices();
        resolve(selectBestVoice(loaded));
      };

      const prevHandler = window.speechSynthesis.onvoiceschanged;
      window.speechSynthesis.onvoiceschanged = (ev) => {
        if (typeof prevHandler === 'function') {
          prevHandler.call(window.speechSynthesis, ev);
        }
        done();
      };

      window.setTimeout(done, 550);
    });
  }, [selectBestVoice]);

  // Speak a single utterance in the queue, keeping it in utterancePoolRef so Chrome never GCs it
  const speakSingleUtterance = useCallback(
    async (text: string, sessionId: number, onComplete: () => void) => {
      if (tourSessionIdRef.current !== sessionId) return;

      const durationMs = getStepReadingDurationMs(text);
      const canSpeakAudio =
        voiceTourEnabledRef.current &&
        !isMutedRef.current &&
        hasInteractedRef.current &&
        typeof window !== 'undefined' &&
        'speechSynthesis' in window &&
        typeof SpeechSynthesisUtterance !== 'undefined';

      if (!canSpeakAudio) {
        setIsVoiceSpeaking(false);
        clearStepTimer();
        stepTimerRef.current = window.setTimeout(() => {
          if (tourSessionIdRef.current === sessionId) {
            onComplete();
          }
        }, durationMs);
        return;
      }

      const preferredVoice = await ensureVoicesLoaded();
      if (tourSessionIdRef.current !== sessionId) return;

      // Re-check in case user muted while waiting for voices
      if (!voiceTourEnabledRef.current || isMutedRef.current) {
        setIsVoiceSpeaking(false);
        clearStepTimer();
        stepTimerRef.current = window.setTimeout(() => {
          if (tourSessionIdRef.current === sessionId) {
            onComplete();
          }
        }, durationMs);
        return;
      }

      try {
        const utterance = new SpeechSynthesisUtterance(text);
        if (preferredVoice) {
          utterance.voice = preferredVoice;
          utterance.lang = preferredVoice.lang;
        } else {
          utterance.lang = 'en-IN';
        }
        utterance.rate = 0.95;
        utterance.pitch = 1.02;

        // Keep reference in array to prevent Chrome garbage collection mid-speech
        utterancePoolRef.current.push(utterance);
        if (utterancePoolRef.current.length > 25) {
          utterancePoolRef.current.shift();
        }

        let finished = false;
        const finalize = () => {
          if (finished) return;
          finished = true;
          clearStepTimer();
          if (tourSessionIdRef.current === sessionId) {
            onComplete();
          }
        };

        utterance.onboundary = () => {
          if (tourSessionIdRef.current === sessionId) {
            setSpeechEnergy(0.45 + Math.random() * 0.55);
          }
        };

        utterance.onend = () => {
          finalize();
        };

        utterance.onerror = () => {
          finalize();
        };

        // Safety fallback timer only if browser speech hangs without firing onend
        clearStepTimer();
        stepTimerRef.current = window.setTimeout(() => {
          finalize();
        }, durationMs + 7500);

        setIsVoiceSpeaking(true);
        startChromeKeepAlive();
        window.speechSynthesis.speak(utterance);
      } catch {
        setIsVoiceSpeaking(false);
        clearStepTimer();
        stepTimerRef.current = window.setTimeout(() => {
          if (tourSessionIdRef.current === sessionId) {
            onComplete();
          }
        }, durationMs);
      }
    },
    [clearStepTimer, ensureVoicesLoaded, startChromeKeepAlive]
  );

  // Recursive queue runner for the guided tour steps
  const runTourStep = useCallback(
    (stepIndex: number, sessionId: number) => {
      if (tourSessionIdRef.current !== sessionId) return;
      if (!isAutoPlayingRef.current || !isHeroVisibleRef.current) {
        stopEnergyPulse();
        setIsVoiceSpeaking(false);
        return;
      }

      const safeIndex = ((stepIndex % tourSteps.length) + tourSteps.length) % tourSteps.length;
      currentTourStepRef.current = safeIndex;
      const step = tourSteps[safeIndex];
      if (!step) return;

      // Switch scene, highlight floating card when voice tour is active, and show live caption
      if (voiceTourEnabledRef.current) {
        setActiveServiceSlug(step.serviceSlug);
      }
      setCaptionText(step.text);
      startEnergyPulse();

      if (step.type === 'welcome') {
        setGreetTriggerCount((prev) => prev + 1);
      }

      speakSingleUtterance(step.text, sessionId, () => {
        if (tourSessionIdRef.current !== sessionId) return;

        const isLastStep = safeIndex >= tourSteps.length - 1;
        if (isLastStep) {
          // Tour completed one full cycle
          if (voiceTourEnabledRef.current) {
            // After the voice tour completes once, do not loop the voice; return to silent caption loop
            hasCompletedVoiceTourOnceRef.current = true;
            voiceTourEnabledRef.current = false;
          }
          stopChromeKeepAlive();
          setIsVoiceSpeaking(false);
          stopEnergyPulse();
          setCaptionText(null);

          // Pause 3 seconds after the closing line, then loop the tour again (captions only)
          clearStepTimer();
          stepTimerRef.current = window.setTimeout(() => {
            if (tourSessionIdRef.current === sessionId && isAutoPlayingRef.current && isHeroVisibleRef.current) {
              runTourStep(0, sessionId);
            }
          }, 3000);
        } else {
          // Advance immediately to the next utterance in the queue
          runTourStep(safeIndex + 1, sessionId);
        }
      });
    },
    [clearStepTimer, speakSingleUtterance, startEnergyPulse, stopChromeKeepAlive, stopEnergyPulse, tourSteps]
  );

  // Stop voice and pause tour completely (used by Stop button)
  const stopAndPauseTour = useCallback(() => {
    tourSessionIdRef.current += 1;
    isCardScrollSpeechRef.current = false;
    voiceTourEnabledRef.current = false;
    clearStepTimer();
    cancelBrowserSpeechOnly();
    stopEnergyPulse();
    setCaptionText(null);
    setIsAutoPlaying(false);
    isAutoPlayingRef.current = false;
  }, [cancelBrowserSpeechOnly, clearStepTimer, stopEnergyPulse]);

  // 1. AUTO TOUR ON PAGE LOAD: 1.5 seconds after hero loads, start guided tour automatically
  useEffect(() => {
    const initialTimer = window.setTimeout(() => {
      hasStartedInitialTourRef.current = true;
      if (isAutoPlayingRef.current && isHeroVisibleRef.current) {
        const sessionId = tourSessionIdRef.current + 1;
        tourSessionIdRef.current = sessionId;
        runTourStep(0, sessionId);
      }
    }, 1500);

    return () => {
      window.clearTimeout(initialTimer);
    };
  }, [runTourStep]);

  // 2. VOICE STARTS ON FIRST INTERACTION: listen once for first pointerdown or keydown on document
  useEffect(() => {
    if (hasInteracted) return;

    const handleFirstInteraction = (e: Event) => {
      if (hasInteractedRef.current) return;
      hasInteractedRef.current = true;
      setHasInteracted(true);

      // If user clicked directly on a dedicated robot control button, card, or the services carousel section, let its own handler manage state
      const target = e.target as HTMLElement | null;
      if (
        target &&
        typeof target.closest === 'function' &&
        (target.closest('[data-robot-control="true"]') || target.closest('#services'))
      ) {
        return;
      }

      if (isMutedRef.current || hasCompletedVoiceTourOnceRef.current || !isHeroVisibleRef.current) {
        return;
      }

      // Unlock speech and start speaking from the CURRENT line of the tour (do not restart from beginning)
      voiceTourEnabledRef.current = true;
      isAutoPlayingRef.current = true;
      setIsAutoPlaying(true);
      hasStartedInitialTourRef.current = true;

      clearStepTimer();
      cancelBrowserSpeechOnly();

      const sessionId = tourSessionIdRef.current + 1;
      tourSessionIdRef.current = sessionId;
      runTourStep(currentTourStepRef.current, sessionId);
    };

    document.addEventListener('pointerdown', handleFirstInteraction, { once: true, capture: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true, capture: true });

    return () => {
      document.removeEventListener('pointerdown', handleFirstInteraction, { capture: true });
      document.removeEventListener('keydown', handleFirstInteraction, { capture: true });
    };
  }, [hasInteracted, cancelBrowserSpeechOnly, clearStepTimer, runTourStep]);

  // 3. CONTROLS: Voice Guide / Stop toggle button
  const handleToggleVoiceGuide = useCallback(() => {
    hasInteractedRef.current = true;
    setHasInteracted(true);

    if (isVoiceSpeaking) {
      // Stop silences the voice and pauses the tour
      stopAndPauseTour();
    } else {
      // Clicking Voice Guide again restarts the voice tour from the beginning (Step 0)
      if (isMutedRef.current) {
        isMutedRef.current = false;
        setIsMuted(false);
        try {
          window.sessionStorage.setItem(MUTE_STORAGE_KEY, '0');
        } catch {
          // Ignore storage error
        }
      }
      clearStepTimer();
      cancelBrowserSpeechOnly();

      voiceTourEnabledRef.current = true;
      hasCompletedVoiceTourOnceRef.current = false;
      isAutoPlayingRef.current = true;
      setIsAutoPlaying(true);

      const sessionId = tourSessionIdRef.current + 1;
      tourSessionIdRef.current = sessionId;
      runTourStep(0, sessionId);
    }
  }, [isVoiceSpeaking, stopAndPauseTour, clearStepTimer, cancelBrowserSpeechOnly, runTourStep]);

  // Clicking the robot itself: if speaking, stop; otherwise unlock/start voice from current step (or restart if paused)
  const handleRobotClick = useCallback(() => {
    hasInteractedRef.current = true;
    setHasInteracted(true);

    if (isVoiceSpeaking) {
      stopAndPauseTour();
      return;
    }

    if (isMutedRef.current) return;

    clearStepTimer();
    cancelBrowserSpeechOnly();
    voiceTourEnabledRef.current = true;
    hasCompletedVoiceTourOnceRef.current = false;
    isAutoPlayingRef.current = true;
    setIsAutoPlaying(true);

    const sessionId = tourSessionIdRef.current + 1;
    tourSessionIdRef.current = sessionId;
    runTourStep(currentTourStepRef.current, sessionId);
  }, [isVoiceSpeaking, stopAndPauseTour, clearStepTimer, cancelBrowserSpeechOnly, runTourStep]);

  // Mute / Unmute toggle (remembers mute state in sessionStorage inside try/catch; captions keep running)
  const handleToggleMute = useCallback(() => {
    hasInteractedRef.current = true;
    setHasInteracted(true);

    const nextMuted = !isMutedRef.current;
    isMutedRef.current = nextMuted;
    setIsMuted(nextMuted);

    try {
      window.sessionStorage.setItem(MUTE_STORAGE_KEY, nextMuted ? '1' : '0');
    } catch {
      // Ignore sessionStorage errors
    }

    if (nextMuted) {
      // Turn sound off permanently for this visit, but keep captions running
      voiceTourEnabledRef.current = false;
      cancelBrowserSpeechOnly();
      if (isAutoPlayingRef.current && isHeroVisibleRef.current) {
        clearStepTimer();
        const sessionId = tourSessionIdRef.current + 1;
        tourSessionIdRef.current = sessionId;
        runTourStep(currentTourStepRef.current, sessionId);
      }
    } else {
      // Unmuted: start speaking from current step if tour is active
      voiceTourEnabledRef.current = true;
      hasCompletedVoiceTourOnceRef.current = false;
      if (isAutoPlayingRef.current && isHeroVisibleRef.current) {
        clearStepTimer();
        cancelBrowserSpeechOnly();
        const sessionId = tourSessionIdRef.current + 1;
        tourSessionIdRef.current = sessionId;
        runTourStep(currentTourStepRef.current, sessionId);
      }
    }
  }, [cancelBrowserSpeechOnly, clearStepTimer, runTourStep]);

  // Greet button: wave + speak greeting line, then resume silent caption loop
  const handleTriggerGreeting = useCallback(() => {
    hasInteractedRef.current = true;
    setHasInteracted(true);

    clearStepTimer();
    cancelBrowserSpeechOnly();

    const sessionId = tourSessionIdRef.current + 1;
    tourSessionIdRef.current = sessionId;
    voiceTourEnabledRef.current = !isMutedRef.current;

    setGreetTriggerCount((prev) => prev + 1);
    setCaptionText(ROBOT_SPEECH_DATA.greetMessage);
    startEnergyPulse();

    speakSingleUtterance(ROBOT_SPEECH_DATA.greetMessage, sessionId, () => {
      if (tourSessionIdRef.current !== sessionId) return;
      stopChromeKeepAlive();
      setIsVoiceSpeaking(false);
      stopEnergyPulse();
      setCaptionText(null);
      voiceTourEnabledRef.current = false;

      if (isAutoPlayingRef.current && isHeroVisibleRef.current) {
        stepTimerRef.current = window.setTimeout(() => {
          if (tourSessionIdRef.current === sessionId) {
            runTourStep(currentTourStepRef.current, sessionId);
          }
        }, 1800);
      }
    });
  }, [
    clearStepTimer,
    cancelBrowserSpeechOnly,
    startEnergyPulse,
    speakSingleUtterance,
    stopChromeKeepAlive,
    stopEnergyPulse,
    runTourStep,
  ]);

  // Clicking a floating card: speak that service's line and scroll to 2nd section (#services)
  const handleSelectServiceCard = useCallback(
    (card: HeroFloatingServiceCard, shouldScrollAndSpeak = true) => {
      hasInteractedRef.current = true;
      setHasInteracted(true);

      setActiveServiceSlug(card.slug);
      onSelectServiceSlugRef.current?.(card.slug);

      const matchedStepIdx = tourSteps.findIndex(
        (s) => s.type === 'service' && s.serviceSlug === card.slug
      );
      if (matchedStepIdx !== -1) {
        currentTourStepRef.current = matchedStepIdx;
      }

      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `#services/${card.slug}`);
        window.dispatchEvent(
          new CustomEvent('iamtechni:select-service', { detail: { slug: card.slug } })
        );
      }

      clearStepTimer();
      cancelBrowserSpeechOnly();

      const sessionId = tourSessionIdRef.current + 1;
      tourSessionIdRef.current = sessionId;

      if (shouldScrollAndSpeak) {
        isCardScrollSpeechRef.current = true;
        voiceTourEnabledRef.current = !isMutedRef.current;

        const servicesEl = document.getElementById('services');
        if (servicesEl) {
          servicesEl.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start',
          });
        }

        setCaptionText(card.spokenLine);
        startEnergyPulse();

        speakSingleUtterance(card.spokenLine, sessionId, () => {
          if (tourSessionIdRef.current === sessionId) {
            isCardScrollSpeechRef.current = false;
            voiceTourEnabledRef.current = false;
            stopChromeKeepAlive();
            setIsVoiceSpeaking(false);
            stopEnergyPulse();
            setCaptionText(null);
          }
        });
      } else {
        // Scene controller dot / prev / next click: switch to that service step in the tour
        if (isAutoPlayingRef.current && isHeroVisibleRef.current && matchedStepIdx !== -1) {
          runTourStep(matchedStepIdx, sessionId);
        } else {
          setCaptionText(card.spokenLine);
        }
      }
    },
    [
      tourSteps,
      clearStepTimer,
      cancelBrowserSpeechOnly,
      prefersReducedMotion,
      startEnergyPulse,
      speakSingleUtterance,
      stopChromeKeepAlive,
      stopEnergyPulse,
      runTourStep,
    ]
  );

  // Scene controller Play / Pause toggle
  const handleToggleAutoPlay = useCallback(() => {
    const next = !isAutoPlayingRef.current;
    isAutoPlayingRef.current = next;
    setIsAutoPlaying(next);

    if (!next) {
      tourSessionIdRef.current += 1;
      voiceTourEnabledRef.current = false;
      clearStepTimer();
      cancelBrowserSpeechOnly();
      stopEnergyPulse();
    } else {
      const sessionId = tourSessionIdRef.current + 1;
      tourSessionIdRef.current = sessionId;
      runTourStep(currentTourStepRef.current, sessionId);
    }
  }, [clearStepTimer, cancelBrowserSpeechOnly, stopEnergyPulse, runTourStep]);

  // Stop voice and pause tour when scrolling out of the hero; resume silent tour when scrolling back
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visible = entry.isIntersecting;
          isHeroVisibleRef.current = visible;
          setIsHeroVisible(visible);

          if (!visible) {
            if (!isCardScrollSpeechRef.current) {
              tourSessionIdRef.current += 1;
              voiceTourEnabledRef.current = false;
              clearStepTimer();
              cancelBrowserSpeechOnly();
              stopEnergyPulse();
            }
          } else if (
            visible &&
            hasStartedInitialTourRef.current &&
            isAutoPlayingRef.current &&
            !isCardScrollSpeechRef.current
          ) {
            const sessionId = tourSessionIdRef.current + 1;
            tourSessionIdRef.current = sessionId;
            runTourStep(currentTourStepRef.current, sessionId);
          }
        });
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [clearStepTimer, cancelBrowserSpeechOnly, stopEnergyPulse, runTourStep]);

  // Preload voices and stop voice / pause tour when switching browser tabs or leaving page
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        tourSessionIdRef.current += 1;
        isCardScrollSpeechRef.current = false;
        voiceTourEnabledRef.current = false;
        clearStepTimer();
        cancelBrowserSpeechOnly();
        stopEnergyPulse();
      } else if (
        hasStartedInitialTourRef.current &&
        isAutoPlayingRef.current &&
        isHeroVisibleRef.current
      ) {
        const sessionId = tourSessionIdRef.current + 1;
        tourSessionIdRef.current = sessionId;
        runTourStep(currentTourStepRef.current, sessionId);
      }
    };

    const handleBeforeUnload = () => {
      tourSessionIdRef.current += 1;
      clearStepTimer();
      cancelBrowserSpeechOnly();
      stopEnergyPulse();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      tourSessionIdRef.current += 1;
      clearStepTimer();
      cancelBrowserSpeechOnly();
      stopEnergyPulse();
    };
  }, [clearStepTimer, cancelBrowserSpeechOnly, stopEnergyPulse, runTourStep]);

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

  const activeCard =
    floatingCards.find((c) => c.slug === activeServiceSlug) || floatingCards[0];

  const showTapToHearHint = !hasInteracted && !isMuted && !isVoiceSpeaking;

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-label="IAMTECHNI Futuristic AI Ambassador Hero"
      className="relative w-full overflow-hidden bg-[#FAF8F5] border-b border-slate-200/80 pt-2 pb-20 sm:pt-3 sm:pb-20 lg:py-6 h-auto lg:h-[calc(100svh-var(--header-height,65px))] lg:min-h-[540px] lg:max-h-[860px] flex items-center"
    >
      {/* tsParticles Floating Circles Background (z-0, decorative) */}
      <HeroParticlesBackground />

      {/* Main Page Container
          DOM order: Text column first (for SEO & screen readers), Robot column second.
          Visual order: Below 1024px -> Robot first (order-1), Text second (order-2).
          Desktop (1024px+) -> Text left (lg:order-1), Robot right (lg:order-2). */}
      <div className="relative z-10 w-full max-w-[1440px] 2xl:max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-0 flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6 lg:gap-8">
        {/* LEFT COLUMN (1st in HTML DOM): Eyebrow → Headline → Subtitle → CTAs → Trust Row */}
        <div className="w-full lg:w-[46%] xl:w-[45%] min-h-0 flex flex-col justify-center order-2 lg:order-1 items-center lg:items-start text-center lg:text-left">
          <HeroContent
            onNavigate={onNavigate}
            onOpenProjectModal={onOpenProjectModal}
          />
        </div>

        {/* RIGHT COLUMN (2nd in HTML DOM): 3D Coded Humanoid Robot Presenter Stage
            Desktop scene wrapper scaled down by ~25%: ~500px at 1280px, 520px at 1366px/1440px, 580px at 1920px,
            vertically centered with the left text column and clear of the bottom-right AI chat button. */}
        <div className="w-full lg:w-[54%] xl:w-[55%] h-auto lg:h-full min-h-0 flex flex-col justify-center items-center order-1 lg:order-2 relative">
          <div className="relative w-full max-w-[calc(100vw-32px)] md:max-w-[640px] lg:max-w-[500px] xl:max-w-[520px] 2xl:max-w-[580px] h-[420px] md:h-[430px] lg:h-[405px] xl:h-[420px] 2xl:h-[455px] flex flex-col items-center justify-between my-auto">
            {/* Centered Pill-Shaped Voice Control Toolbar Directly Above the Robot's Head */}
            <div className="relative z-40 flex justify-center w-full mb-0.5 pointer-events-auto">
              <RobotSpeechControls
                isSpeaking={isVoiceSpeaking}
                isMuted={isMuted}
                showTapToHearHint={showTapToHearHint}
                onToggleVoiceGuide={handleToggleVoiceGuide}
                onToggleMute={handleToggleMute}
                onTriggerGreeting={handleTriggerGreeting}
              />
            </div>

            {/* Centered 3D Coded Humanoid Robot Presenter (230px on mobile, 320px on tablet, scaled proportional stage on desktop).
                On desktop (lg:), z-30 places the robot and its hands ABOVE the floating cards (z-20), while pointer-events-none keeps all cards clickable. */}
            <div className="relative z-10 lg:z-30 lg:pointer-events-none w-[172px] sm:w-[200px] md:w-full lg:w-full h-[230px] md:h-[320px] lg:h-full lg:flex-1 min-h-0 flex items-center justify-center mx-auto">
              <RobotScene
                activeServiceId={activeCard?.robotServiceId || 'ai-ml'}
                animationState={activeCard?.gestureState || 'presenting'}
                isSpeaking={isRobotTalkingVisual}
                speechEnergy={speechEnergy}
                greetTriggerCount={greetTriggerCount}
                isVisible={isHeroVisible}
                onRobotClick={handleRobotClick}
              />
            </div>

            {/* Symmetrical Floating Service Cards (6 surrounding chips on mobile, 6 full cards on tablet/desktop) + Scene Controller */}
            <ServiceCards
              activeServiceSlug={activeCard?.slug || 'ai-machine-learning'}
              isAutoPlaying={isAutoPlaying}
              isSpeaking={isRobotTalkingVisual}
              captionText={captionText}
              onSelectServiceCard={handleSelectServiceCard}
              onToggleAutoPlay={handleToggleAutoPlay}
              parallaxOffset={parallax}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
