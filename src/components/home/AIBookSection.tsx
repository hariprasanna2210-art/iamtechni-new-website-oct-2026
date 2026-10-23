import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Pause,
  Play,
  Search,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import { PageRoute } from '../../types';

interface AIBookSectionProps {
  onNavigate: (route: PageRoute) => void;
}

interface TurnState {
  isTurning: boolean;
  direction: 'next' | 'prev';
  fromSpread: number;
  toSpread: number;
}

const TOTAL_SPREADS = 3;
const TURN_DURATION_SEC = 0.5;
const AUTO_TURN_INTERVAL_MS = 1800;
const TURN_EASE: [number, number, number, number] = [0.645, 0.045, 0.355, 1];

export const AIBookSection: React.FC<AIBookSectionProps> = ({ onNavigate }) => {
  const prefersReducedMotion = false;
  const sectionRef = useRef<HTMLElement | null>(null);

  const [currentSpread, setCurrentSpread] = useState(0);
  const [turnState, setTurnState] = useState<TurnState | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isBookHovered, setIsBookHovered] = useState(false);
  const [autoProgress, setAutoProgress] = useState(0);
  const [newlyRevealedSpread, setNewlyRevealedSpread] = useState<number>(0);

  const triggerTurn = useCallback(
    (targetSpread: number, forcedDirection?: 'next' | 'prev') => {
      if (turnState?.isTurning || targetSpread === currentSpread) return;
      if (targetSpread < 0 || targetSpread >= TOTAL_SPREADS) return;

      setAutoProgress(0);

      const direction: 'next' | 'prev' =
        forcedDirection || (targetSpread > currentSpread ? 'next' : 'prev');

      setTurnState({
        isTurning: true,
        direction,
        fromSpread: currentSpread,
        toSpread: targetSpread,
      });
    },
    [currentSpread, turnState]
  );

  const handleNextSpread = useCallback(() => {
    const next = (currentSpread + 1) % TOTAL_SPREADS;
    triggerTurn(next, 'next');
  }, [currentSpread, triggerTurn]);

  const handlePrevSpread = useCallback(() => {
    const prev = (currentSpread - 1 + TOTAL_SPREADS) % TOTAL_SPREADS;
    triggerTurn(prev, 'prev');
  }, [currentSpread, triggerTurn]);

  const completeTurn = useCallback(() => {
    setTurnState((prev) => {
      if (!prev) return null;
      setCurrentSpread(prev.toSpread);
      setNewlyRevealedSpread(prev.toSpread);
      setAutoProgress(0);
      return null;
    });
  }, []);

  // Guarantee turn completion after TURN_DURATION_SEC on all viewports
  useEffect(() => {
    if (!turnState?.isTurning) return;
    const timer = window.setTimeout(() => {
      completeTurn();
    }, TURN_DURATION_SEC * 1000 + 40);
    return () => window.clearTimeout(timer);
  }, [turnState, completeTurn]);

  // Continuous fast auto-turning pages loop (pauses immediately when hovering over the book)
  useEffect(() => {
    if (!isAutoPlaying || isBookHovered || turnState?.isTurning) {
      return;
    }

    const tickMs = 40;
    const stepIncrement = (tickMs / AUTO_TURN_INTERVAL_MS) * 100;

    const interval = window.setInterval(() => {
      setAutoProgress((prev) => {
        if (prev + stepIncrement >= 100) {
          return 100;
        }
        return prev + stepIncrement;
      });
    }, tickMs);

    return () => window.clearInterval(interval);
  }, [isAutoPlaying, isBookHovered, turnState]);

  useEffect(() => {
    if (autoProgress >= 100 && !turnState?.isTurning && isAutoPlaying && !isBookHovered) {
      handleNextSpread();
    }
  }, [autoProgress, turnState, isAutoPlaying, isBookHovered, handleNextSpread]);

  // Keyboard support: ArrowLeft / ArrowRight when focused inside the book section
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNextSpread();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrevSpread();
    }
  };

  const renderHeroZoomHeading = (
    words: string[],
    Tag: 'h1' | 'h2' | 'h3' = 'h3',
    sizeClass = 'text-2xl sm:text-3xl'
  ) => {
    const MotionTag =
      Tag === 'h1' ? motion.h1 : Tag === 'h2' ? motion.h2 : motion.h3;
    return (
      <MotionTag
        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className={`!font-['Outfit','Space_Grotesk',sans-serif] ${sizeClass} font-bold tracking-[-0.015em] text-[#1E3A8A] leading-[1.2] origin-left cursor-default`}
      >
        {words.map((word, i, arr) => {
          const isLast = i === arr.length - 1;
          return (
            <React.Fragment key={`${word}-${i}`}>
              <motion.span
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
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
        })}
      </MotionTag>
    );
  };

  /* ======================================================================== */
  /* INDIVIDUAL PAGE RENDERERS (Pages 01 to 06)                               */
  /* ======================================================================== */

  const renderLeftPage = (spreadIdx: number, isRevealing = false) => {
    const contentMotionProps =
      prefersReducedMotion || !isRevealing
        ? {}
        : {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
          };

    if (spreadIdx === 0) {
      // SPREAD 1 — LEFT PAGE (01 / 06): Eyebrow, Heading, Paragraph, 3 Chips
      return (
        <motion.div
          {...contentMotionProps}
          className="h-full flex flex-col justify-between p-6 sm:p-9 lg:p-11 select-none"
        >
          <div className="my-auto space-y-4">
            <div className="inline-flex items-center gap-2 h-[34px] px-3 sm:px-4 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 backdrop-blur-md border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-xs font-mono uppercase tracking-widest text-[#2563EB] font-bold">
              <span
                className="w-2 h-2 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)] shrink-0"
                aria-hidden="true"
              />
              <span>Artificial Intelligence &amp; Scalability</span>
            </div>

            {renderHeroZoomHeading(
              ['Put', 'intelligent', 'technology', 'to', 'practical', 'work.'],
              'h2',
              'text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px]'
            )}

            <p className="text-sm sm:text-base bg-gradient-to-r from-[#100C2E] via-[#3A279E] to-[#2557D6] bg-clip-text text-transparent leading-relaxed font-medium">
              We help enterprises move beyond generic chatbot hype. We build grounded, domain-specific AI applications, automated knowledge assistants, and cost-controlled inference pipelines.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono text-[#2563EB]">
              <span className="bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_10px_rgba(37,99,235,0.08)] px-3 py-1 rounded-full text-[#1E3A8A] font-semibold">
                ✓ pgvector Embeddings
              </span>
              <span className="bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_10px_rgba(37,99,235,0.08)] px-3 py-1 rounded-full text-[#2563EB] font-semibold">
                ✓ Verifiable Citations
              </span>
              <span className="bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_10px_rgba(37,99,235,0.08)] px-3 py-1 rounded-full text-[#1E3A8A] font-semibold">
                ✓ Zero Model Training Leakage
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#DBEAFE]/80 flex items-center justify-start text-[11px] font-mono font-bold text-[#2563EB]">
            <span>01 / 06</span>
          </div>
        </motion.div>
      );
    }

    if (spreadIdx === 1) {
      // SPREAD 2 — LEFT PAGE (03 / 06): Private Document RAG
      return (
        <motion.div
          {...contentMotionProps}
          className="h-full flex flex-col justify-between p-6 sm:p-9 lg:p-11 select-none"
        >
          <div className="my-auto space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-[#EEF4FF] text-[#1E3A8A] border border-[#DBEAFE] flex items-center justify-center shadow-[0_4px_16px_rgba(37,99,235,0.12)]">
              <Search className="w-7 h-7 text-[#2563EB]" />
            </div>

            {renderHeroZoomHeading(['Private', 'Document', 'RAG'], 'h3')}

            <div className="h-0.5 w-16 bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-transparent rounded-full" />

            <p className="text-sm sm:text-base bg-gradient-to-r from-[#100C2E] via-[#3A279E] to-[#2557D6] bg-clip-text text-transparent font-medium leading-relaxed max-w-md">
              Query thousands of internal contracts, SOPs, and engineering manuals with verifiable source page citations.
            </p>
          </div>

          <div className="pt-4 border-t border-[#DBEAFE]/80 flex items-center justify-start text-[11px] font-mono font-bold text-[#2563EB]">
            <span>03 / 06</span>
          </div>
        </motion.div>
      );
    }

    // SPREAD 3 — LEFT PAGE (05 / 06): Workflow Automation
    return (
      <motion.div
        {...contentMotionProps}
        className="h-full flex flex-col justify-between p-6 sm:p-9 lg:p-11 select-none"
      >
        <div className="my-auto space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF4FF] text-[#1E3A8A] border border-[#DBEAFE] flex items-center justify-center shadow-[0_4px_16px_rgba(37,99,235,0.12)]">
            <Workflow className="w-7 h-7 text-[#2563EB]" />
          </div>

          {renderHeroZoomHeading(['Workflow', 'Automation'], 'h3')}

          <div className="h-0.5 w-16 bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-transparent rounded-full" />

          <p className="text-sm sm:text-base bg-gradient-to-r from-[#100C2E] via-[#3A279E] to-[#2557D6] bg-clip-text text-transparent font-medium leading-relaxed max-w-md">
            Automated document extraction, invoice classification, and human-in-the-loop review queues.
          </p>
        </div>

        <div className="pt-4 border-t border-[#DBEAFE]/80 flex items-center justify-start text-[11px] font-mono font-bold text-[#2563EB]">
          <span>05 / 06</span>
        </div>
      </motion.div>
    );
  };

  const renderRightPage = (spreadIdx: number, isRevealing = false) => {
    const contentMotionProps =
      prefersReducedMotion || !isRevealing
        ? {}
        : {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
          };

    if (spreadIdx === 0) {
      // SPREAD 1 — RIGHT PAGE (02 / 06): PRIVATE_RAG_INFERENCE_PIPELINE Panel
      return (
        <motion.div
          {...contentMotionProps}
          className="h-full flex flex-col justify-between p-6 sm:p-9 lg:p-11 font-mono select-none"
        >
          <div className="w-full rounded-2xl bg-gradient-to-b from-[#F8FAFF] via-white to-[#EEF4FF]/70 border border-[#DBEAFE] shadow-[0_12px_32px_rgba(30,58,138,0.08)] p-4 sm:p-5 text-[#1E3A8A] flex flex-col justify-between my-auto">
            {/* Top Status */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DBEAFE] pb-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-pulse shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold text-[#1E3A8A] truncate">
                  PRIVATE_RAG_INFERENCE_PIPELINE
                </span>
              </div>
              <span className="text-[10px] text-[#2563EB] bg-[#EEF4FF] px-2.5 py-0.5 rounded-full border border-[#DBEAFE] font-bold">
                Zero Leakage
              </span>
            </div>

            {/* Pipeline Steps */}
            <div className="space-y-2.5 my-3.5">
              {/* Step 1: Query Ingest */}
              <div className="p-3 bg-white rounded-xl border border-[#DBEAFE] shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#EEF4FF] text-[#1E3A8A] border border-[#DBEAFE] flex items-center justify-center text-[10px] font-bold shrink-0">
                    01
                  </div>
                  <div>
                    <div className="text-[#1E3A8A] font-bold text-[11px]">
                      Enterprise Query Embedding
                    </div>
                    <div className="text-[10px] text-[#2563EB]/85">
                      text-embedding-3 · 1536 dims
                    </div>
                  </div>
                </div>
                <span className="text-[#1E3A8A] bg-[#EEF4FF] px-2 py-0.5 rounded border border-[#DBEAFE] text-[10px] font-bold">
                  &lt;18ms
                </span>
              </div>

              {/* Step 2: Vector Search */}
              <div className="p-3 bg-white rounded-xl border border-[#DBEAFE] shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#EEF4FF] text-[#1E3A8A] border border-[#DBEAFE] flex items-center justify-center text-[10px] font-bold shrink-0">
                    02
                  </div>
                  <div>
                    <div className="text-[#1E3A8A] font-bold text-[11px]">
                      Cosine Distance Retrieval
                    </div>
                    <div className="text-[10px] text-[#2563EB]/85">
                      pgvector · HNSW Index Matching
                    </div>
                  </div>
                </div>
                <span className="text-[#1E3A8A] bg-[#EEF4FF] px-2 py-0.5 rounded border border-[#DBEAFE] text-[10px] font-bold">
                  0.94 Similarity
                </span>
              </div>

              {/* Step 3: Verified Citation */}
              <div className="p-3 bg-white rounded-xl border border-[#DBEAFE] shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#EEF4FF] text-[#1E3A8A] border border-[#DBEAFE] flex items-center justify-center text-[10px] font-bold shrink-0">
                    03
                  </div>
                  <div>
                    <div className="text-[#1E3A8A] font-bold text-[11px]">
                      Guardrailed Response Synthesizer
                    </div>
                    <div className="text-[10px] text-[#2563EB]/85">
                      Verifiable Page &amp; Doc Citations
                    </div>
                  </div>
                </div>
                <span className="text-[#1E3A8A] bg-[#EEF4FF] px-2 py-0.5 rounded border border-[#DBEAFE] text-[10px] font-bold">
                  100% Traceable
                </span>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs pt-3 border-t border-[#DBEAFE]">
              <div className="p-2 bg-[#F8FAFF] rounded-lg border border-[#DBEAFE]">
                <div className="text-[9px] text-[#2563EB] font-semibold truncate">
                  Prompt Cache
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#1E3A8A]">
                  92% Hit
                </div>
              </div>
              <div className="p-2 bg-[#F8FAFF] rounded-lg border border-[#DBEAFE]">
                <div className="text-[9px] text-[#2563EB] font-semibold truncate">
                  P95 Latency
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#1E3A8A]">
                  340ms
                </div>
              </div>
              <div className="p-2 bg-[#F8FAFF] rounded-lg border border-[#DBEAFE]">
                <div className="text-[9px] text-[#2563EB] font-semibold truncate">
                  Hallucination
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#1E3A8A]">
                  0.00%
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#DBEAFE]/80 flex items-center justify-end text-[11px] font-mono font-bold text-[#2563EB]">
            <span>02 / 06</span>
          </div>
        </motion.div>
      );
    }

    if (spreadIdx === 1) {
      // SPREAD 2 — RIGHT PAGE (04 / 06): Knowledge Assistants
      return (
        <motion.div
          {...contentMotionProps}
          className="h-full flex flex-col justify-between p-6 sm:p-9 lg:p-11 select-none"
        >
          <div className="my-auto space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-[#EEF4FF] text-[#1E3A8A] border border-[#DBEAFE] flex items-center justify-center shadow-[0_4px_16px_rgba(37,99,235,0.12)]">
              <Cpu className="w-7 h-7 text-[#2563EB]" />
            </div>

            {renderHeroZoomHeading(['Knowledge', 'Assistants'], 'h3')}

            <div className="h-0.5 w-16 bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-transparent rounded-full" />

            <p className="text-sm sm:text-base bg-gradient-to-r from-[#100C2E] via-[#3A279E] to-[#2557D6] bg-clip-text text-transparent font-medium leading-relaxed max-w-md">
              Domain-specific assistants trained on your proprietary processes without leaking data to public training sets.
            </p>
          </div>

          <div className="pt-4 border-t border-[#DBEAFE]/80 flex items-center justify-end text-[11px] font-mono font-bold text-[#2563EB]">
            <span>04 / 06</span>
          </div>
        </motion.div>
      );
    }

    // SPREAD 3 — RIGHT PAGE (06 / 06): Guardrails & Cost FinOps
    return (
      <motion.div
        {...contentMotionProps}
        className="h-full flex flex-col justify-between p-6 sm:p-9 lg:p-11 select-none"
      >
        <div className="my-auto space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF4FF] text-[#1E3A8A] border border-[#DBEAFE] flex items-center justify-center shadow-[0_4px_16px_rgba(37,99,235,0.12)]">
            <ShieldCheck className="w-7 h-7 text-[#2563EB]" />
          </div>

          {renderHeroZoomHeading(['Guardrails', '&', 'Cost', 'FinOps'], 'h3')}

          <div className="h-0.5 w-16 bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-transparent rounded-full" />

          <p className="text-sm sm:text-base bg-gradient-to-r from-[#100C2E] via-[#3A279E] to-[#2557D6] bg-clip-text text-transparent font-medium leading-relaxed max-w-md">
            Cost-aware token budgeting, prompt caching, and defensive filters against prompt injection attacks.
          </p>
        </div>

        <div className="pt-4 border-t border-[#DBEAFE]/80 flex items-center justify-end text-[11px] font-mono font-bold text-[#2563EB]">
          <span>06 / 06</span>
        </div>
      </motion.div>
    );
  };

  // Determine which static pages sit underneath while a page turn is in progress
  const activeLeftSpreadIdx = turnState
    ? turnState.direction === 'next'
      ? turnState.fromSpread
      : turnState.toSpread
    : currentSpread;

  const activeRightSpreadIdx = turnState
    ? turnState.direction === 'next'
      ? turnState.toSpread
      : turnState.fromSpread
    : currentSpread;

  return (
    <section
      ref={sectionRef}
      onKeyDown={handleKeyDown}
      aria-label="Artificial Intelligence & Scalability"
      className="py-24 bg-white text-[#1E3A8A] border-b border-slate-200 relative overflow-hidden"
    >
      {/* Subtle Light-Blue Ambient Glows Matching Hero Palette */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#DBEAFE]/45 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#EEF4FF]/70 rounded-full blur-[120px] pointer-events-none" />

      {/* SEO & Screen-Reader Full DOM Content for Inactive Spreads (ensures all text stays in DOM) */}
      <div className="sr-only" aria-hidden="false">
        {currentSpread !== 0 && (
          <div>
            <p>
              We help enterprises move beyond generic chatbot hype. We build grounded, domain-specific AI applications, automated knowledge assistants, and cost-controlled inference pipelines.
            </p>
            <span>✓ pgvector Embeddings</span>
            <span>✓ Verifiable Citations</span>
            <span>✓ Zero Model Training Leakage</span>
            <span>PRIVATE_RAG_INFERENCE_PIPELINE</span>
            <span>Zero Leakage</span>
            <span>01 Enterprise Query Embedding text-embedding-3 · 1536 dims &lt;18ms</span>
            <span>02 Cosine Distance Retrieval pgvector · HNSW Index Matching 0.94 Similarity</span>
            <span>03 Guardrailed Response Synthesizer Verifiable Page &amp; Doc Citations 100% Traceable</span>
            <span>Prompt Cache 92% Hit</span>
            <span>P95 Latency 340ms</span>
            <span>Hallucination 0.00%</span>
          </div>
        )}
        {currentSpread !== 1 && (
          <div>
            <h3>Private Document RAG</h3>
            <p>
              Query thousands of internal contracts, SOPs, and engineering manuals with verifiable source page citations.
            </p>
            <h3>Knowledge Assistants</h3>
            <p>
              Domain-specific assistants trained on your proprietary processes without leaking data to public training sets.
            </p>
          </div>
        )}
        {currentSpread !== 2 && (
          <div>
            <h3>Workflow Automation</h3>
            <p>
              Automated document extraction, invoice classification, and human-in-the-loop review queues.
            </p>
            <h3>Guardrails &amp; Cost FinOps</h3>
            <p>
              Cost-aware token budgeting, prompt caching, and defensive filters against prompt injection attacks.
            </p>
          </div>
        )}
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Always-Visible Section Header + Book Page-Turn Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 h-[34px] px-3 sm:px-4 mb-3 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 backdrop-blur-md border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-xs font-mono uppercase tracking-widest text-[#2563EB] font-bold">
              <span
                className="w-2 h-2 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)] shrink-0"
                aria-hidden="true"
              />
              <span>Artificial Intelligence &amp; Scalability</span>
            </div>

            {renderHeroZoomHeading(
              ['Put', 'intelligent', 'technology', 'to', 'practical', 'work.'],
              'h1',
              'text-2xl sm:text-3xl lg:text-[36px] xl:text-[40px]'
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div
            className="flex items-center gap-1.5 bg-[#F8FAFF] p-1 rounded-xl border border-[#DBEAFE] shadow-2xs text-xs font-mono"
            role="tablist"
            aria-label="Book spreads"
          >
            {[
              { idx: 0, label: '01–02' },
              { idx: 1, label: '03–04' },
              { idx: 2, label: '05–06' },
            ].map((sp) => {
              const isActive = currentSpread === sp.idx;
              return (
                <button
                  key={sp.idx}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Open pages ${sp.label}`}
                  onClick={() => triggerTurn(sp.idx)}
                  className={`relative overflow-hidden px-3 py-1 rounded-lg transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                    isActive
                      ? 'bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 text-white font-bold shadow-xs'
                      : 'text-[#1E3A8A]/80 hover:text-[#1E3A8A] hover:bg-[#EEF4FF]'
                  }`}
                >
                  <span className="relative z-10">{sp.label}</span>
                  {isActive && isAutoPlaying && !prefersReducedMotion && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-0.5 bg-[#60A5FA] transition-[width] duration-75 ease-linear"
                      style={{ width: `${autoProgress}%` }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAutoPlaying((prev) => !prev)}
              aria-label={isAutoPlaying ? 'Pause auto page turn' : 'Resume auto page turn'}
              title={isAutoPlaying ? 'Pause auto page turn' : 'Resume auto page turn'}
              className="w-9 h-9 rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 text-white shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.28)] flex items-center justify-center transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              {isAutoPlaying ? (
                <Pause className="w-3.5 h-3.5 text-white" />
              ) : (
                <Play className="w-3.5 h-3.5 text-white fill-current" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handlePrevSpread()}
              disabled={Boolean(turnState?.isTurning)}
              aria-label="Previous page spread"
              className="w-9 h-9 rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 text-white shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.28)] flex items-center justify-center transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              type="button"
              onClick={() => handleNextSpread()}
              disabled={Boolean(turnState?.isTurning)}
              aria-label="Next page spread"
              className="w-9 h-9 rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 text-white shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.28)] flex items-center justify-center transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* DESKTOP 3D OPEN BOOK (Two Pages Side-by-Side + Spine + 3D Flip)   */}
        {/* ================================================================= */}
        <div
          onMouseEnter={() => setIsBookHovered(true)}
          onMouseLeave={() => setIsBookHovered(false)}
          className="hidden lg:block relative mx-auto my-2 select-none"
          style={{ perspective: '2000px' }}
        >
          {/* Soft Drop Shadow Under the Whole Book */}
          <div
            aria-hidden="true"
            className="absolute -inset-x-4 -bottom-6 h-16 bg-[#1E3A8A]/12 rounded-[40px] blur-2xl pointer-events-none"
          />

          {/* Stacked Page Edges — Left Outer Stack (3 thin offset layers) */}
          <div
            aria-hidden="true"
            className="absolute top-3 bottom-3 -left-3.5 w-6 rounded-l-[26px] bg-[#E2E8F0] border-l border-y border-[#CBD5E1] shadow-sm pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 -left-2.5 w-6 rounded-l-[25px] bg-[#EEF4FF] border-l border-y border-[#DBEAFE] pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute top-1 bottom-1 -left-1.5 w-6 rounded-l-[24px] bg-[#F8FAFF] border-l border-y border-[#DBEAFE] pointer-events-none"
          />

          {/* Stacked Page Edges — Right Outer Stack (3 thin offset layers) */}
          <div
            aria-hidden="true"
            className="absolute top-3 bottom-3 -right-3.5 w-6 rounded-r-[26px] bg-[#E2E8F0] border-r border-y border-[#CBD5E1] shadow-sm pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 -right-2.5 w-6 rounded-r-[25px] bg-[#EEF4FF] border-r border-y border-[#DBEAFE] pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute top-1 bottom-1 -right-1.5 w-6 rounded-r-[24px] bg-[#F8FAFF] border-r border-y border-[#DBEAFE] pointer-events-none"
          />

          {/* Main Open Book Spread Container */}
          <div
            className="relative grid grid-cols-2 min-h-[500px] rounded-[24px] bg-white border border-[#DBEAFE] shadow-[0_24px_60px_-15px_rgba(30,58,138,0.16)]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* ------------------------------------------------------------- */}
            {/* STATIONARY LEFT PAGE                                          */}
            {/* ------------------------------------------------------------- */}
            <div
              onClick={() => handlePrevSpread()}
              title="Click to turn to previous page"
              className="relative rounded-l-[23px] bg-gradient-to-r from-white via-[#FAFBFD] to-[#F1F5FD] border-r border-[#DBEAFE] overflow-hidden cursor-pointer"
            >
              {/* Subtle inner page border */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-2.5 rounded-l-[16px] border border-[#DBEAFE]/60"
              />
              {/* Spine curvature inner shadow on right edge of left page */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-[#1E3A8A]/[0.09] via-[#1E3A8A]/[0.03] to-transparent z-10"
              />

              {/* Cast shadow on Left Page when turning leaf approaches/leaves it */}
              {turnState && (
                <motion.div
                  aria-hidden="true"
                  initial={{
                    opacity: turnState.direction === 'next' ? 0 : 0.35,
                  }}
                  animate={{
                    opacity:
                      turnState.direction === 'next' ? [0, 0.15, 0.35] : [0.35, 0.15, 0],
                  }}
                  transition={{ duration: TURN_DURATION_SEC, ease: TURN_EASE }}
                  className="pointer-events-none absolute inset-0 bg-[#0F1E4A]/25 z-20"
                />
              )}

              {renderLeftPage(
                activeLeftSpreadIdx,
                !turnState && newlyRevealedSpread === activeLeftSpreadIdx
              )}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* STATIONARY RIGHT PAGE                                         */}
            {/* ------------------------------------------------------------- */}
            <div
              onClick={() => handleNextSpread()}
              title="Click to flip to next page"
              className="relative rounded-r-[23px] bg-gradient-to-l from-white via-[#FAFBFD] to-[#F1F5FD] overflow-hidden cursor-pointer"
            >
              {/* Subtle inner page border */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-2.5 rounded-r-[16px] border border-[#DBEAFE]/60"
              />
              {/* Spine curvature inner shadow on left edge of right page */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-[#1E3A8A]/[0.09] via-[#1E3A8A]/[0.03] to-transparent z-10"
              />

              {/* Cast shadow on Right Page underneath turning leaf */}
              {turnState && (
                <motion.div
                  aria-hidden="true"
                  initial={{
                    opacity: turnState.direction === 'next' ? 0.35 : 0,
                  }}
                  animate={{
                    opacity:
                      turnState.direction === 'next' ? [0.35, 0.18, 0] : [0, 0.18, 0.35],
                  }}
                  transition={{ duration: TURN_DURATION_SEC, ease: TURN_EASE }}
                  className="pointer-events-none absolute inset-0 bg-[#0F1E4A]/25 z-20"
                />
              )}

              {renderRightPage(
                activeRightSpreadIdx,
                !turnState && newlyRevealedSpread === activeRightSpreadIdx
              )}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* CENTRE SPINE CREASE & BINDING                                 */}
            {/* ------------------------------------------------------------- */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 z-30 flex items-center justify-center"
              style={{
                background:
                  'linear-gradient(90deg, rgba(30,58,138,0) 0%, rgba(30,58,138,0.08) 35%, rgba(30,58,138,0.20) 50%, rgba(30,58,138,0.08) 65%, rgba(30,58,138,0) 100%)',
              }}
            >
              <div className="w-px h-full bg-gradient-to-b from-[#93C5FD]/60 via-[#2563EB]/45 to-[#93C5FD]/60" />
            </div>

            {/* ------------------------------------------------------------- */}
            {/* 3D TURNING PAGE LEAF (Front = Right Page, Back = Next Left Page) */}
            {/* ------------------------------------------------------------- */}
            {turnState && (
              <motion.div
                key={`turn-${turnState.fromSpread}-${turnState.toSpread}`}
                initial={{
                  rotateY: turnState.direction === 'next' ? 0 : -180,
                }}
                animate={{
                  rotateY: turnState.direction === 'next' ? -180 : 0,
                }}
                transition={{
                  duration: TURN_DURATION_SEC,
                  ease: TURN_EASE,
                }}
                onAnimationComplete={completeTurn}
                style={{
                  transformOrigin: 'left center',
                  transformStyle: 'preserve-3d',
                }}
                className="pointer-events-none absolute inset-y-0 left-1/2 w-1/2 z-40"
              >
                {/* FRONT FACE OF TURNING LEAF (Shows Right Page of earlier spread) */}
                <div
                  style={{ backfaceVisibility: 'hidden' }}
                  className="absolute inset-0 rounded-r-[23px] bg-gradient-to-l from-white via-[#FAFBFD] to-[#F1F5FD] border border-[#DBEAFE] overflow-hidden shadow-2xl"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-2.5 rounded-r-[16px] border border-[#DBEAFE]/60"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-[#1E3A8A]/[0.09] via-[#1E3A8A]/[0.03] to-transparent z-10"
                  />
                  {/* Dynamic mid-turn paper shading (darkest at ~90deg) */}
                  <motion.div
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.35, 0.08] }}
                    transition={{ duration: TURN_DURATION_SEC, ease: TURN_EASE }}
                    className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#1E3A8A]/35 via-[#1E3A8A]/15 to-transparent z-20"
                  />
                  {renderRightPage(
                    turnState.direction === 'next'
                      ? turnState.fromSpread
                      : turnState.toSpread,
                    false
                  )}
                </div>

                {/* BACK FACE OF TURNING LEAF (Shows Left Page of target spread) */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                  className="absolute inset-0 rounded-l-[23px] bg-gradient-to-r from-white via-[#FAFBFD] to-[#F1F5FD] border border-[#DBEAFE] overflow-hidden shadow-2xl"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-2.5 rounded-l-[16px] border border-[#DBEAFE]/60"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-[#1E3A8A]/[0.09] via-[#1E3A8A]/[0.03] to-transparent z-10"
                  />
                  {/* Dynamic mid-turn paper shading (darkest at ~90deg) */}
                  <motion.div
                    aria-hidden="true"
                    initial={{ opacity: 0.08 }}
                    animate={{ opacity: [0.08, 0.35, 0] }}
                    transition={{ duration: TURN_DURATION_SEC, ease: TURN_EASE }}
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1E3A8A]/35 via-[#1E3A8A]/15 to-transparent z-20"
                  />
                  {renderLeftPage(
                    turnState.direction === 'next'
                      ? turnState.toSpread
                      : turnState.fromSpread,
                    false
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* MOBILE / TABLET BOOK VIEW (<lg: Stacked Spread Pages with Flip)   */}
        {/* ================================================================= */}
        <div
          onMouseEnter={() => setIsBookHovered(true)}
          onMouseLeave={() => setIsBookHovered(false)}
          className="lg:hidden relative mx-auto my-2"
          style={{ perspective: '1600px' }}
        >
          {/* Stacked Page Edges for Mobile Book */}
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 -right-2 w-4 rounded-r-[22px] bg-[#E2E8F0] border-r border-y border-[#CBD5E1] pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute top-1 bottom-1 -right-1 w-4 rounded-r-[22px] bg-[#EEF4FF] border-r border-y border-[#DBEAFE] pointer-events-none"
          />

          <motion.div
            key={`mobile-spread-${currentSpread}`}
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, rotateY: -12, scale: 0.98 }
            }
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: TURN_EASE }}
            style={{ transformOrigin: 'left center' }}
            className="rounded-[24px] bg-gradient-to-b from-white via-[#FAFBFD] to-[#F1F5FD] border border-[#DBEAFE] shadow-[0_20px_50px_-15px_rgba(30,58,138,0.14)] overflow-hidden divide-y divide-[#DBEAFE]"
          >
            <div>{renderLeftPage(currentSpread, true)}</div>
            <div>{renderRightPage(currentSpread, true)}</div>
          </motion.div>

          {/* Mobile Spread Dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to spread ${idx + 1}`}
                onClick={() => triggerTurn(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSpread === idx ? 'w-7 bg-[#1E3A8A]' : 'w-2 bg-[#93C5FD]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ================================================================= */}
        {/* BOTTOM LINE + HERO-MATCHED CTA BUTTON (Always Visible Below Book) */}
        {/* ================================================================= */}
        <div className="mt-10 pt-6 border-t border-[#DBEAFE] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="bg-gradient-to-r from-[#100C2E] via-[#3A279E] to-[#2557D6] bg-clip-text text-transparent font-medium">
            Every AI deployment is backed by privacy compliance, rate-limiting, and evaluation benchmarks.
          </span>
          <button
            type="button"
            onClick={() => onNavigate('/services/ai-machine-learning')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 text-white font-semibold text-xs sm:text-[13px] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.28)] transition-all duration-200 active:scale-[0.98] shrink-0 cursor-pointer"
          >
            <span>Explore AI &amp; Machine Learning Practice</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
};
