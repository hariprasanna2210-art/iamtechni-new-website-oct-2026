import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Sparkles,
  Check,
  Lock,
  Shield,
  FileCheck2,
  Kanban,
  FolderLock,
  Code2,
  Palette,
  FileText,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { PageRoute } from '../../types';
import { COMPANY_CONTACT } from '../../data/companyInfo';
import { PRIMARY_PHONE, PRIMARY_PHONE_LINK } from '../../constants/contact';
import { useSectionInView, useIsWindowScrolling } from '../../utils/useViewportActivity';

interface CollaborateSectionProps {
  onNavigate: (route: PageRoute) => void;
  onOpenProjectModal: (serviceName?: string) => void;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ACCORDION_ITEMS = [
  {
    id: 0,
    title: 'Mutual NDA Executed',
    desc: 'Your idea stays confidential from day one.',
    icon: FileCheck2,
  },
  {
    id: 1,
    title: 'Phased Sprints',
    desc: 'Clear milestones, regular demos, steady progress.',
    icon: Kanban,
  },
  {
    id: 2,
    title: 'Full IP Ownership',
    desc: 'Everything we build for you belongs to you.',
    icon: FolderLock,
  },
] as const;

const SLIDE_COUNT = 3;
const SLIDE_INTERVAL_MS = 4200;

export const CollaborateSection: React.FC<CollaborateSectionProps> = ({
  onNavigate,
  onOpenProjectModal,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [sectionRef, isSectionInView] = useSectionInView<HTMLElement>(0.15);
  const isWindowScrolling = useIsWindowScrolling();
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeAccordion, setActiveAccordion] = useState<number>(0);
  const [accordionPausedUntil, setAccordionPausedUntil] = useState<number>(0);

  const isAutoPlaying =
    !isHovered && !prefersReducedMotion && isSectionInView && !isWindowScrolling;

  // Auto-slide the horizontal row every 4.2s only when in view, not hovered, and not actively scrolling
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDE_COUNT);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isAutoPlaying]);

  // Auto-advance stepper items every 4.5s (loop) only when in view and not actively scrolling
  useEffect(() => {
    if (prefersReducedMotion || !isSectionInView || isWindowScrolling) return;
    const timer = window.setInterval(() => {
      if (Date.now() < accordionPausedUntil) return;
      setActiveAccordion((prev) => (prev + 1) % ACCORDION_ITEMS.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [accordionPausedUntil, prefersReducedMotion, isSectionInView, isWindowScrolling]);

  const handleSelectAccordion = (index: number) => {
    setActiveAccordion(index);
    setAccordionPausedUntil(Date.now() + 10000);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + SLIDE_COUNT) % SLIDE_COUNT);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % SLIDE_COUNT);
  };

  const shouldAnimateGlow = !prefersReducedMotion && isSectionInView;

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative py-10 sm:py-20 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF] text-[#1E3A8A] overflow-hidden border-t border-[#DBEAFE]/80"
    >
      {/* GPU-friendly soft radial gradient glows behind the single sliding row */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={
            !shouldAnimateGlow
              ? { x: 0, y: 0, scale: 1 }
              : {
                  x: [0, 35, -20, 0],
                  y: [0, -25, 20, 0],
                  scale: [1, 1.06, 0.96, 1],
                }
          }
          transition={{ duration: 13, repeat: shouldAnimateGlow ? Infinity : 0, ease: 'easeInOut' }}
          style={{
            background:
              'radial-gradient(circle, rgba(220, 232, 255, 0.65) 0%, rgba(220, 232, 255, 0) 70%)',
          }}
          className="absolute -top-24 right-[4%] w-[540px] h-[540px] rounded-full"
        />

        <motion.div
          animate={
            !shouldAnimateGlow
              ? { x: 0, y: 0, scale: 1 }
              : {
                  x: [0, -30, 25, 0],
                  y: [0, 30, -20, 0],
                  scale: [1, 0.95, 1.05, 1],
                }
          }
          transition={{ duration: 15, repeat: shouldAnimateGlow ? Infinity : 0, ease: 'easeInOut' }}
          style={{
            background:
              'radial-gradient(circle, rgba(224, 242, 254, 0.65) 0%, rgba(224, 242, 254, 0) 70%)',
          }}
          className="absolute -bottom-16 -left-24 w-[560px] h-[560px] rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Row Controls: Slide Indicator Pills + Named Mobile Step Tabs + Prev/Next Buttons */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {[0, 1, 2].map((idx) => {
                const isCurrent = activeSlide === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    className={`hidden md:inline-flex relative h-2.5 rounded-full transition-all duration-300 cursor-pointer overflow-hidden ${
                      isCurrent
                        ? 'w-14 bg-slate-200'
                        : 'w-3 bg-slate-200 hover:bg-slate-300'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  >
                    {isCurrent && (
                      <span
                        key={`${activeSlide}`}
                        className="block h-full w-full rounded-full bg-gradient-to-r from-[#04C8E8] to-[#1266E8] animate-progress-scale"
                        style={{
                          animationDuration: `${SLIDE_INTERVAL_MS}ms`,
                          animationPlayState: isAutoPlaying ? 'running' : 'paused',
                        }}
                      />
                    )}
                  </button>
                );
              })}
              <span className="md:hidden text-xs font-mono font-bold text-[#1E3A8A]">
                0{activeSlide + 1} / 03 · Swipe or tap
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevSlide}
                aria-label="Previous slide"
                className="w-11 h-11 min-w-[44px] min-h-[44px] md:w-10 md:h-10 md:min-w-0 md:min-h-0 rounded-full bg-white border border-[#E2E8F0] text-[#0F1B3D] hover:border-[#04C8E8] hover:text-[#0891B2] shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                aria-label="Next slide"
                className="w-11 h-11 min-w-[44px] min-h-[44px] md:w-10 md:h-10 md:min-w-0 md:min-h-0 rounded-full bg-white border border-[#E2E8F0] text-[#0F1B3D] hover:border-[#04C8E8] hover:text-[#0891B2] shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile-Only (<md) Named Slide Selector Pills for Instant Discoverability */}
          <div className="grid grid-cols-3 gap-2 md:hidden">
            {[
              { idx: 0, label: '01. Collaborate' },
              { idx: 1, label: '02. How We Work' },
              { idx: 2, label: '03. Direct Contact' },
            ].map((tab) => {
              const isCurrent = activeSlide === tab.idx;
              return (
                <button
                  key={tab.idx}
                  type="button"
                  onClick={() => setActiveSlide(tab.idx)}
                  className={`min-h-[44px] min-w-[44px] px-2.5 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer truncate flex items-center justify-center ${
                    isCurrent
                      ? 'bg-[#1E3A8A] text-white shadow-xs'
                      : 'bg-white/90 text-[#1E3A8A] border border-[#DBEAFE]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================================================================= */}
        {/* SINGLE HORIZONTAL SLIDING ROW (All 3 cards in one flex row)       */}
        {/* ================================================================= */}
        <div className="relative overflow-hidden rounded-[24px]">
          <motion.div
            animate={{ x: `-${activeSlide * 100}%` }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.7,
              ease: EASE_OUT_EXPO,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) {
                handleNextSlide();
              } else if (info.offset.x > 60) {
                handlePrevSlide();
              }
            }}
            className="flex flex-row flex-nowrap items-stretch w-full"
          >
            {/* ------------------------------------------------------------- */}
            {/* SLIDE 1 – Hero CTA ("READY TO COLLABORATE")                   */}
            {/* ------------------------------------------------------------- */}
            <div className="w-full shrink-0 px-1">
              <div className="h-full rounded-[20px] bg-white/95 border border-[#EEF1F5] shadow-[0_20px_50px_rgba(15,27,61,0.08)] p-4 sm:p-8 lg:p-10">
                <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 items-center h-full">
                  {/* LEFT COLUMN */}
                  <div className="min-[900px]:col-span-6 space-y-3 sm:space-y-4 text-left">
                    <div className="inline-flex items-center gap-2 h-[32px] sm:h-[34px] px-3 sm:px-4 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-xs font-mono font-bold uppercase tracking-widest text-[#2563EB]">
                      <span className="w-2 h-2 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)] shrink-0" />
                      <span>READY TO COLLABORATE</span>
                    </div>

                    <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl lg:text-[38px] font-bold tracking-[-0.015em] text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)] leading-[1.18]">
                      Have a challenge? Let’s engineer the solution.
                    </h2>

                    <p className="text-[13.5px] sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl">
                      Tell us what you want to build, improve or transform. Let’s explore the right technology and a practical path forward.
                    </p>

                    <div className="pt-1 sm:pt-2 flex flex-row flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => onOpenProjectModal()}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-5 sm:py-2.5 min-h-[44px] min-w-[44px] rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white text-xs sm:text-[13px] font-semibold shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                      >
                        <span>Discuss Your Project</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigate('/contact')}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-5 sm:py-2.5 min-h-[44px] min-w-[44px] rounded-lg bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 hover:from-white hover:to-[#F0F9FF] text-[#1E3A8A] hover:text-[#2563EB] text-xs sm:text-[13px] font-semibold border border-[#DBEAFE]/90 shadow-[0_2px_10px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                        <span>Contact IAMTECHNI</span>
                      </button>
                    </div>
                  </div>

                  {/* RIGHT COLUMN – Overlapping Rounded Photos + Floating SLA Chip */}
                  <div className="min-[900px]:col-span-6 relative flex justify-center min-[900px]:justify-end py-1 sm:py-4">
                    <div className="relative w-full max-w-[440px]">
                      <motion.div
                        animate={prefersReducedMotion ? undefined : { y: [-5, 5, -5] }}
                        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
                        className="relative ml-auto w-full sm:w-[84%] h-[165px] sm:h-[290px] rounded-[18px] sm:rounded-[20px] overflow-hidden border border-[#EEF1F5] bg-slate-100 shadow-[0_20px_50px_rgba(15,27,61,0.08)]"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
                          alt="Senior engineering team collaborating at a modern workspace"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1B3D]/15 via-transparent to-transparent" />
                      </motion.div>

                      <motion.div
                        animate={prefersReducedMotion ? undefined : { y: [6, -6, 6] }}
                        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                        className="hidden sm:block absolute -bottom-4 left-0 w-[48%] h-[145px] sm:h-[165px] z-10 rounded-[20px] overflow-hidden border-4 border-white bg-slate-100 shadow-[0_20px_50px_rgba(15,27,61,0.12)]"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=80"
                          alt="Software architects reviewing system architecture"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </motion.div>

                      <motion.div
                        animate={prefersReducedMotion ? undefined : { y: [-4, 4, -4] }}
                        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                        className="absolute -top-2.5 sm:-top-3 right-2 sm:-right-2 z-20 inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white border border-[#EEF1F5] shadow-[0_20px_50px_rgba(15,27,61,0.10)]"
                      >
                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        <span className="text-[11px] sm:text-xs font-mono font-bold text-[#0F1B3D] tracking-tight">
                          1 Business Day SLA
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* SLIDE 2 – Engagement Accordion + Live Preview Card            */}
            {/* ------------------------------------------------------------- */}
            <div className="w-full shrink-0 px-1">
              <div className="h-full rounded-[20px] bg-white/95 border border-[#EEF1F5] shadow-[0_20px_50px_rgba(15,27,61,0.08)] p-6 sm:p-8 lg:p-10">
                <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-8 lg:gap-10 items-center h-full">
                  {/* LEFT COLUMN – Vertical Stepper with Connected Nodes & Expandable Cards */}
                  <div className="min-[900px]:col-span-5 lg:col-span-6 space-y-4 text-left">
                    <div className="text-xs font-mono font-bold uppercase tracking-[0.15em] text-[#1266E8]">
                      IAMTECHNI // ENGINEERING_ENGAGEMENT
                    </div>

                    <p className="text-sm sm:text-base font-mono text-slate-600">
                      // Direct collaboration with senior software architects
                    </p>

                    <div className="pt-2 flex flex-col">
                      {ACCORDION_ITEMS.map((item, idx) => {
                        const isActive = activeAccordion === idx;
                        const isCompleted = activeAccordion > idx;
                        const IconComponent = item.icon;
                        const isLast = idx === ACCORDION_ITEMS.length - 1;

                        return (
                          <div key={item.id} className="flex items-stretch gap-3 sm:gap-4">
                            {/* Stepper Node & Connecting Line */}
                            <div className="flex flex-col items-center shrink-0 w-11 md:w-8">
                              <button
                                type="button"
                                onClick={() => handleSelectAccordion(idx)}
                                aria-label={`Select step ${idx + 1}: ${item.title}`}
                                className={`w-11 h-11 min-w-[44px] min-h-[44px] md:w-8 md:h-8 md:min-w-0 md:min-h-0 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-all duration-300 z-10 cursor-pointer ${
                                  isCompleted
                                    ? 'bg-[#1266E8] text-white shadow-xs'
                                    : isActive
                                    ? 'bg-gradient-to-br from-[#04C8E8] to-[#1266E8] text-white shadow-[0_0_14px_rgba(4,200,232,0.45)] ring-2 ring-[#04C8E8]/40 ring-offset-2 ring-offset-white'
                                    : 'bg-slate-100 text-slate-400 border border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                {isCompleted ? (
                                  <Check className="w-4 h-4 stroke-[2.5]" />
                                ) : (
                                  <span>{idx + 1}</span>
                                )}
                              </button>

                              {!isLast && (
                                <div className="w-0.5 grow my-1.5 bg-slate-200 rounded-full relative overflow-hidden min-h-[28px]">
                                  <div
                                    className={`w-full transition-all duration-500 bg-gradient-to-b from-[#04C8E8] to-[#1266E8] rounded-full ${
                                      activeAccordion > idx ? 'h-full' : 'h-0'
                                    }`}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Step Button Card */}
                            <button
                              type="button"
                              onClick={() => handleSelectAccordion(idx)}
                              className={`w-full text-left rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden mb-3 border ${
                                isActive
                                  ? 'bg-white border-l-4 border-l-[#04C8E8] border-y-[#EEF1F5] border-r-[#EEF1F5] shadow-[0_12px_28px_rgba(15,27,61,0.08)] p-4'
                                  : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200/60 p-3 sm:p-3.5'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
                                    isActive
                                      ? 'bg-[#ECFEFF] text-[#0891B2]'
                                      : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div
                                    className={`text-sm sm:text-base font-bold transition-colors ${
                                      isActive ? 'text-[#0F1B3D]' : 'text-slate-600'
                                    }`}
                                  >
                                    {item.title}
                                  </div>
                                  {isActive && (
                                    <motion.p
                                      initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                                      className="text-[13px] sm:text-[14px] text-slate-500 mt-1 leading-snug overflow-hidden font-normal"
                                    >
                                      {item.desc}
                                    </motion.p>
                                  )}
                                </div>
                              </div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* RIGHT COLUMN – Clean Preview Panel (NDA / Sprints / IP Handover) */}
                  <div className="min-[900px]:col-span-7 lg:col-span-6 space-y-3">
                    <div className="relative rounded-[20px] bg-white border border-[#E6EAF0] shadow-sm p-4 sm:p-6 min-h-[350px] flex flex-col justify-between overflow-hidden">
                      {/* Preview Header: Window dots + Step X of 3 chip + Title + Progress bar */}
                      <div className="space-y-2.5 pb-3 border-b border-slate-100">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                          </div>

                          <div className="flex items-center gap-2 min-w-0">
                            <span className="px-2 py-0.5 rounded-full bg-cyan-50 border border-cyan-200/80 text-[#0891B2] font-mono text-[10px] font-bold shrink-0">
                              Step {activeAccordion + 1} of 3
                            </span>
                            <span className="text-xs font-mono font-semibold text-[#0F1B3D] truncate">
                              {ACCORDION_ITEMS[activeAccordion].title}
                            </span>
                          </div>
                        </div>

                        {/* Step Duration Progress Bar */}
                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            key={`progress-${activeAccordion}-${accordionPausedUntil}`}
                            initial={{ width: prefersReducedMotion ? '100%' : '0%' }}
                            animate={{ width: '100%' }}
                            transition={{
                              duration: prefersReducedMotion ? 0 : 4.5,
                              ease: 'linear',
                            }}
                            className="h-full rounded-full bg-gradient-to-r from-[#04C8E8] to-[#1266E8]"
                          />
                        </div>
                      </div>

                      {/* Preview Body with AnimatePresence crossfade & slight slide */}
                      <div className="my-auto py-3">
                        <AnimatePresence mode="wait">
                          {/* STEP 1: MUTUAL NDA PREVIEW */}
                          {activeAccordion === 0 && (
                            <motion.div
                              key="nda-preview"
                              initial={{
                                opacity: 0,
                                x: prefersReducedMotion ? 0 : 20,
                                scale: prefersReducedMotion ? 1 : 0.98,
                              }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{
                                opacity: 0,
                                x: prefersReducedMotion ? 0 : -20,
                                scale: prefersReducedMotion ? 1 : 0.98,
                              }}
                              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                              className="w-full space-y-3"
                            >
                              {/* Document Card: Non-Disclosure Agreement */}
                              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 space-y-3 shadow-xs">
                                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-[#ECFEFF] text-[#0891B2] flex items-center justify-center">
                                      <FileCheck2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className="text-xs sm:text-sm font-bold text-[#0F1B3D]">
                                        Non-Disclosure Agreement
                                      </h4>
                                      <p className="text-[10px] font-mono text-slate-400">
                                        MUTUAL_CONFIDENTIALITY_DOC
                                      </p>
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                    MUTUAL NDA
                                  </span>
                                </div>

                                {/* Signature Rows: Client & IAMTECHNI */}
                                <div className="space-y-2">
                                  {/* Row 1: Client */}
                                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="text-[11px] font-mono font-bold text-[#0F1B3D] w-14 sm:w-20 shrink-0">
                                        Client
                                      </span>
                                      <div className="h-6 w-28 sm:w-36 flex items-center">
                                        <svg
                                          viewBox="0 0 140 28"
                                          className="w-full h-full text-[#1266E8] overflow-visible"
                                          fill="none"
                                        >
                                          <motion.path
                                            d="M4 18 C 16 6, 26 24, 40 12 C 50 4, 58 22, 72 10 C 84 2, 96 18, 114 8 C 124 2, 130 14, 136 6"
                                            stroke="currentColor"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            initial={
                                              prefersReducedMotion ? false : { pathLength: 0, opacity: 0.3 }
                                            }
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{
                                              duration: prefersReducedMotion ? 0 : 1.1,
                                              ease: 'easeInOut',
                                            }}
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 font-mono text-[10px] font-bold shrink-0">
                                      <Check className="w-3 h-3 stroke-[2.5]" />
                                      Signed
                                    </span>
                                  </div>

                                  {/* Row 2: IAMTECHNI */}
                                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="text-[11px] font-mono font-bold text-[#0F1B3D] w-14 sm:w-20 shrink-0">
                                        IAMTECHNI
                                      </span>
                                      <div className="h-6 w-28 sm:w-36 flex items-center">
                                        <svg
                                          viewBox="0 0 140 28"
                                          className="w-full h-full text-[#0891B2] overflow-visible"
                                          fill="none"
                                        >
                                          <motion.path
                                            d="M6 14 C 20 24, 30 6, 44 20 C 56 28, 66 6, 80 16 C 94 22, 108 4, 122 14 C 130 18, 134 10, 138 10"
                                            stroke="currentColor"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            initial={
                                              prefersReducedMotion ? false : { pathLength: 0, opacity: 0.3 }
                                            }
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{
                                              duration: prefersReducedMotion ? 0 : 1.1,
                                              delay: prefersReducedMotion ? 0 : 0.35,
                                              ease: 'easeInOut',
                                            }}
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 font-mono text-[10px] font-bold shrink-0">
                                      <Check className="w-3 h-3 stroke-[2.5]" />
                                      Signed
                                    </span>
                                  </div>
                                </div>

                                {/* Shield icon with "Confidential" pop-in */}
                                <motion.div
                                  initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{
                                    duration: prefersReducedMotion ? 0 : 0.4,
                                    delay: prefersReducedMotion ? 0 : 0.65,
                                    ease: EASE_OUT_EXPO,
                                  }}
                                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold"
                                >
                                  <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span className="font-mono text-[11px] font-bold tracking-tight">
                                    Confidential · Legally Protected from Day 1
                                  </span>
                                </motion.div>
                              </div>
                            </motion.div>
                          )}

                          {/* STEP 2: PHASED SPRINTS PREVIEW */}
                          {activeAccordion === 1 && (
                            <motion.div
                              key="sprints-preview"
                              initial={{
                                opacity: 0,
                                x: prefersReducedMotion ? 0 : 20,
                                scale: prefersReducedMotion ? 1 : 0.98,
                              }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{
                                opacity: 0,
                                x: prefersReducedMotion ? 0 : -20,
                                scale: prefersReducedMotion ? 1 : 0.98,
                              }}
                              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                              className="w-full space-y-3"
                            >
                              {/* Horizontal Timeline Bar with animated progress line L-to-R */}
                              <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={prefersReducedMotion ? false : { width: '0%' }}
                                  animate={{ width: '100%' }}
                                  transition={{
                                    duration: prefersReducedMotion ? 0 : 1.2,
                                    ease: 'easeInOut',
                                  }}
                                  className="h-full rounded-full bg-gradient-to-r from-[#04C8E8] via-[#1266E8] to-emerald-500"
                                />
                              </div>

                              {/* 3 Milestone Cards */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                {[
                                  {
                                    sprint: 'Sprint 1 · Plan',
                                    chip: 'Demo 1',
                                    tasks: 'Architecture & UX',
                                    status: 'Done',
                                    delay: 0,
                                  },
                                  {
                                    sprint: 'Sprint 2 · Build',
                                    chip: 'Demo 2',
                                    tasks: 'Core Engine & APIs',
                                    status: 'Done',
                                    delay: 0.12,
                                  },
                                  {
                                    sprint: 'Sprint 3 · Launch',
                                    chip: 'Demo 3',
                                    tasks: 'QA & Deployment',
                                    status: 'Ready',
                                    delay: 0.24,
                                  },
                                ].map((card) => (
                                  <motion.div
                                    key={card.sprint}
                                    initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                      duration: prefersReducedMotion ? 0 : 0.4,
                                      delay: prefersReducedMotion ? 0 : card.delay,
                                      ease: EASE_OUT_EXPO,
                                    }}
                                    className="rounded-2xl border border-slate-200/80 bg-white p-3 space-y-2.5 shadow-xs"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-cyan-50 border border-cyan-200/70 text-[#0891B2]">
                                        {card.chip}
                                      </span>
                                      <span className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                                        <Check className="w-3 h-3 stroke-[2.5]" />
                                      </span>
                                    </div>

                                    <div>
                                      <h5 className="text-xs font-bold text-[#0F1B3D]">
                                        {card.sprint}
                                      </h5>
                                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                                        {card.tasks}
                                      </p>
                                    </div>

                                    <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono">
                                      <span className="text-slate-400">Milestone</span>
                                      <span className="font-semibold text-emerald-600">
                                        ✓ {card.status}
                                      </span>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>

                              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-mono text-slate-600">
                                <span className="text-[11px] font-semibold">// Bi-weekly review demos</span>
                                <span className="text-[10px] font-bold text-[#1266E8]">100% TRANSPARENT</span>
                              </div>
                            </motion.div>
                          )}

                          {/* STEP 3: FULL IP OWNERSHIP PREVIEW */}
                          {activeAccordion === 2 && (
                            <motion.div
                              key="ip-preview"
                              initial={{
                                opacity: 0,
                                x: prefersReducedMotion ? 0 : 20,
                                scale: prefersReducedMotion ? 1 : 0.98,
                              }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{
                                opacity: 0,
                                x: prefersReducedMotion ? 0 : -20,
                                scale: prefersReducedMotion ? 1 : 0.98,
                              }}
                              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                              className="w-full space-y-3"
                            >
                              {/* Folder Card: Your Project */}
                              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 space-y-3 shadow-xs">
                                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-[#EEF4FF] text-[#1266E8] flex items-center justify-center">
                                      <FolderLock className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className="text-xs sm:text-sm font-bold text-[#0F1B3D]">
                                        Your Project // Deliverables
                                      </h4>
                                      <p className="text-[10px] font-mono text-slate-400">
                                        COMPLETE_ASSET_HANDOVER
                                      </p>
                                    </div>
                                  </div>
                                  {/* Lock icon with "100% yours" */}
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[11px] font-bold">
                                    <Lock className="w-3 h-3 text-emerald-600" />
                                    100% yours
                                  </span>
                                </div>

                                {/* 3 rows sliding in: Source code, Design files, Documentation */}
                                <div className="space-y-2">
                                  {[
                                    {
                                      title: 'Source code',
                                      sub: 'Full Git repository & commit history',
                                      icon: Code2,
                                      delay: 0,
                                    },
                                    {
                                      title: 'Design files',
                                      sub: 'UI design system, tokens & vector assets',
                                      icon: Palette,
                                      delay: 0.12,
                                    },
                                    {
                                      title: 'Documentation',
                                      sub: 'Architecture blueprints & deployment guides',
                                      icon: FileText,
                                      delay: 0.24,
                                    },
                                  ].map((row) => {
                                    const RowIcon = row.icon;
                                    return (
                                      <motion.div
                                        key={row.title}
                                        initial={prefersReducedMotion ? false : { opacity: 0, x: 15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                          duration: prefersReducedMotion ? 0 : 0.35,
                                          delay: prefersReducedMotion ? 0 : row.delay,
                                          ease: EASE_OUT_EXPO,
                                        }}
                                        className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-slate-50/80 border border-slate-100"
                                      >
                                        <div className="flex items-center gap-2.5">
                                          <div className="w-6 h-6 rounded-md bg-white border border-slate-200/80 text-[#0891B2] flex items-center justify-center shrink-0">
                                            <RowIcon className="w-3.5 h-3.5" />
                                          </div>
                                          <div className="min-w-0">
                                            <div className="text-xs font-bold text-[#0F1B3D]">
                                              {row.title}
                                            </div>
                                            <div className="text-[10px] font-mono text-slate-400 truncate">
                                              {row.sub}
                                            </div>
                                          </div>
                                        </div>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-mono text-[10px] font-bold shrink-0">
                                          <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                                          Assigned
                                        </span>
                                      </motion.div>
                                    );
                                  })}
                                </div>

                                {/* Arrow animation moving folder toward Client badge */}
                                <div className="pt-1 flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-slate-50 to-cyan-50/40 border border-slate-200/70 text-xs">
                                  <span className="font-mono text-slate-500 font-semibold text-[11px]">
                                    Ownership Transfer:
                                  </span>
                                  <div className="flex items-center gap-2 text-[#0891B2] font-mono font-bold text-xs">
                                    <span>All IP &amp; Assets</span>
                                    <motion.div
                                      animate={prefersReducedMotion ? undefined : { x: [0, 5, 0] }}
                                      transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                      }}
                                    >
                                      <ArrowRight className="w-3.5 h-3.5 text-[#1266E8]" />
                                    </motion.div>
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                                      Client
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Small pill below the card showing STATUS & READY TO ARCHITECT with gently pulsing green dot */}
                    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-full bg-white border border-[#E6EAF0] shadow-xs text-[11px] font-mono">
                      <div className="inline-flex items-center gap-2 text-slate-600 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>STATUS: ACCEPTING NEW PROJECTS</span>
                      </div>
                      <span className="font-bold text-[#0891B2] tracking-wider">
                        READY TO ARCHITECT
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* SLIDE 3 – Direct Inquiries & Project Discovery Split Card     */}
            {/* ------------------------------------------------------------- */}
            <div className="w-full shrink-0 px-1">
              <div className="h-full rounded-[20px] bg-white/95 border border-[#EEF1F5] shadow-[0_20px_50px_rgba(15,27,61,0.08)] p-4 sm:p-8 lg:p-10">
                <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 items-center h-full">
                  {/* LEFT COLUMN – Exact Text & 2x2 Action Buttons */}
                  <div className="min-[900px]:col-span-7 space-y-3 sm:space-y-4 text-left">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span className="text-[#0891B2] font-bold uppercase tracking-wider">
                        DIRECT INQUIRIES &amp; PROJECT DISCOVERY
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500 font-medium">
                        Response within 24 hours
                      </span>
                    </div>

                    <h3 className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-3xl font-bold text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)] leading-snug">
                      Have a project or technology requirement in mind?
                    </h3>

                    <p className="text-[13.5px] sm:text-base text-slate-600 max-w-xl leading-relaxed">
                      Reach out to our engineering and consulting team directly by phone or email.
                    </p>

                    <div className="pt-1 sm:pt-2 grid grid-cols-1 min-[560px]:grid-cols-2 gap-2.5 sm:gap-3">
                      <motion.a
                        href={`tel:${PRIMARY_PHONE_LINK}`}
                        whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                        className="min-h-[44px] min-w-[44px] inline-flex items-center gap-3 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-white border border-[#DBEAFE] shadow-[0_8px_20px_rgba(30,58,138,0.05)] hover:border-[#93C5FD] transition-all group"
                        title={`Call ${PRIMARY_PHONE}`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 text-left">
                          <div className="text-[10px] uppercase font-mono tracking-wider text-teal-600 font-bold">
                            CALL DIRECTLY
                          </div>
                          <div className="font-mono text-xs sm:text-sm font-bold text-[#1E3A8A] truncate">
                            {PRIMARY_PHONE}
                          </div>
                        </div>
                      </motion.a>

                      <motion.a
                        href={COMPANY_CONTACT.emailMailto}
                        whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                        className="min-h-[44px] min-w-[44px] inline-flex items-center gap-3 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-white border border-[#DBEAFE] shadow-[0_8px_20px_rgba(30,58,138,0.05)] hover:border-[#93C5FD] transition-all group"
                        title={`Email ${COMPANY_CONTACT.email}`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#2563EB] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 text-left">
                          <div className="text-[10px] uppercase font-mono tracking-wider text-[#2563EB] font-bold">
                            EMAIL INQUIRIES
                          </div>
                          <div className="font-mono text-xs sm:text-sm font-bold text-[#1E3A8A] truncate">
                            {COMPANY_CONTACT.email}
                          </div>
                        </div>
                      </motion.a>

                      <motion.button
                        type="button"
                        whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          window.dispatchEvent(new CustomEvent('iamtechni:open-chat'))
                        }
                        className="min-h-[44px] min-w-[44px] inline-flex items-center gap-3 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-white border border-[#DBEAFE] shadow-[0_8px_20px_rgba(30,58,138,0.05)] hover:border-[#93C5FD] transition-all cursor-pointer group"
                        title="Open IAMTECHNI AI Assistant"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#2563EB] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-[#1E3A8A]">
                          Ask AI Advisor
                        </span>
                      </motion.button>

                      <button
                        type="button"
                        onClick={() => onOpenProjectModal()}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 min-h-[44px] min-w-[44px] sm:min-h-[48px] rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white text-xs sm:text-[13px] font-semibold shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                      >
                        <span>Start a Project</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* RIGHT COLUMN – Two Smaller Rounded Photos Stacked & Offset */}
                  <div className="hidden sm:flex min-[900px]:col-span-5 relative h-[240px] sm:h-[270px] items-center justify-center">
                    <div className="relative w-full max-w-[360px] h-full">
                      <motion.div
                        animate={prefersReducedMotion ? undefined : { y: [-6, 6, -6] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-0 left-0 w-[64%] h-[165px] sm:h-[185px] rounded-[20px] overflow-hidden border border-[#EEF1F5] bg-slate-100 shadow-[0_20px_50px_rgba(15,27,61,0.08)]"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80"
                          alt="Engineering consultant discussing project discovery"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </motion.div>

                      <motion.div
                        animate={prefersReducedMotion ? undefined : { y: [6, -6, 6] }}
                        transition={{
                          duration: 5.4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 0.35,
                        }}
                        className="absolute bottom-0 right-0 w-[64%] h-[165px] sm:h-[185px] z-10 rounded-[20px] overflow-hidden border-4 border-white bg-slate-100 shadow-[0_20px_50px_rgba(15,27,61,0.12)]"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=700&q=80"
                          alt="Technical discovery session with IAMTECHNI architects"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile-Only (<md) Next Slide Preview Strip */}
        {(() => {
          const slideMeta = [
            { num: '01', title: 'Ready to Collaborate — Project Initiation' },
            { num: '02', title: 'Engineering Engagement — 3-Step Delivery' },
            { num: '03', title: 'Direct Inquiries — Contact & Architecture Desk' },
          ];
          const nextIdx = (activeSlide + 1) % 3;
          const nextSlide = slideMeta[nextIdx];
          return (
            <div className="md:hidden">
              <button
                type="button"
                onClick={handleNextSlide}
                className="w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/95 border border-[#BFDBFE] shadow-[0_6px_18px_rgba(30,58,138,0.08)] text-left transition-all active:scale-[0.99] cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#2563EB]">
                    Up Next · Slide {nextSlide.num} / 03
                  </div>
                  <div className="text-xs font-bold text-[#1E3A8A] truncate">
                    {nextSlide.title}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1E3A8A] text-white text-xs font-bold shrink-0">
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>
          );
        })()}

        {/* Centred in light grey mono under the single sliding row */}
        <div className="pt-2 text-center">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="Go to IAMTECHNI homepage"
            className="group min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-transparent border border-transparent text-xs text-slate-400 font-mono hover:bg-[#1B3152] hover:border-[#5CE1E6]/60 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(92,225,230,0.18)] focus-visible:bg-[#1B3152] focus-visible:border-[#5CE1E6]/60 focus-visible:text-white focus-visible:-translate-y-0.5 focus-visible:shadow-[0_6px_20px_rgba(92,225,230,0.18)] focus:outline-hidden transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            <span>IAMTECHNI // https://iamtechni.in</span>
            <span
              aria-hidden="true"
              className="inline-block opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-focus-visible:opacity-100 group-focus-visible:translate-x-1 transition-all duration-200"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};
