import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Sparkles,
  Check,
  Plus,
  Lock,
  FileCheck2,
  Kanban,
  FolderLock,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { PageRoute } from '../../types';
import { COMPANY_CONTACT } from '../../data/companyInfo';

interface CollaborateSectionProps {
  onNavigate: (route: PageRoute) => void;
  onOpenProjectModal: (serviceName?: string) => void;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ACCORDION_ITEMS = [
  { id: 0, title: 'Mutual NDA Executed', icon: FileCheck2 },
  { id: 1, title: 'Phased Sprints', icon: Kanban },
  { id: 2, title: 'Full IP Ownership', icon: FolderLock },
] as const;

const SLIDE_COUNT = 3;
const SLIDE_INTERVAL_MS = 4200;

export const CollaborateSection: React.FC<CollaborateSectionProps> = ({
  onNavigate,
  onOpenProjectModal,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeAccordion, setActiveAccordion] = useState<number>(0);
  const [userInteractedAccordion, setUserInteractedAccordion] = useState<boolean>(false);

  // Auto-slide the horizontal row every 4.2s unless hovered or reduced motion is enabled
  useEffect(() => {
    if (isHovered || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDE_COUNT);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isHovered, prefersReducedMotion]);

  // Auto-advance accordion items every 3.5s
  useEffect(() => {
    if (userInteractedAccordion || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveAccordion((prev) => (prev + 1) % ACCORDION_ITEMS.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [userInteractedAccordion, prefersReducedMotion]);

  const handleSelectAccordion = (index: number) => {
    setUserInteractedAccordion(true);
    setActiveAccordion(index);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + SLIDE_COUNT) % SLIDE_COUNT);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % SLIDE_COUNT);
  };

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative py-16 sm:py-20 bg-[#FFFFFF] text-[#0F1B3D] overflow-hidden border-t border-[#EEF1F5]"
    >
      {/* Soft, large blurred gradient glows behind the single sliding row */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: [0, 35, -20, 0],
                  y: [0, -25, 20, 0],
                  scale: [1, 1.06, 0.96, 1],
                }
          }
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: '#CFF3F0',
            filter: 'blur(120px)',
            opacity: 0.6,
          }}
          className="absolute -top-16 right-[8%] w-[420px] h-[420px] rounded-full"
        />

        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: [0, -30, 25, 0],
                  y: [0, 30, -20, 0],
                  scale: [1, 0.95, 1.05, 1],
                }
          }
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: '#DCE8FF',
            filter: 'blur(120px)',
            opacity: 0.6,
          }}
          className="absolute bottom-0 -left-16 w-[440px] h-[440px] rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Row Controls: Slide Indicator Pills + Prev/Next Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {[0, 1, 2].map((idx) => {
              const isCurrent = activeSlide === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`relative h-2.5 rounded-full transition-all duration-300 cursor-pointer overflow-hidden ${
                    isCurrent
                      ? 'w-14 bg-slate-200'
                      : 'w-3 bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                >
                  {isCurrent && (
                    <motion.span
                      key={`${activeSlide}-${isHovered ? 'paused' : 'playing'}`}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{
                        duration: isHovered ? 0.3 : SLIDE_INTERVAL_MS / 1000,
                        ease: isHovered ? 'easeOut' : 'linear',
                      }}
                      className="block h-full rounded-full bg-gradient-to-r from-[#04C8E8] to-[#1266E8]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevSlide}
              aria-label="Previous slide"
              className="w-9 h-9 rounded-full bg-white border border-[#E2E8F0] text-[#0F1B3D] hover:border-[#04C8E8] hover:text-[#0891B2] shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextSlide}
              aria-label="Next slide"
              className="w-9 h-9 rounded-full bg-white border border-[#E2E8F0] text-[#0F1B3D] hover:border-[#04C8E8] hover:text-[#0891B2] shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
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
              <div className="h-full rounded-[20px] bg-white/95 border border-[#EEF1F5] shadow-[0_20px_50px_rgba(15,27,61,0.08)] p-6 sm:p-8 lg:p-10">
                <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-8 lg:gap-10 items-center h-full">
                  {/* LEFT COLUMN */}
                  <div className="min-[900px]:col-span-6 space-y-5 text-left">
                    <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#0891B2]">
                      <span className="w-2 h-2 rounded-full bg-[#04C8E8]" />
                      <span>READY TO COLLABORATE</span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0F1B3D] leading-[1.15]">
                      Have a challenge? Let’s engineer the solution.
                    </h2>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                      Tell us what you want to build, improve or transform. Let’s explore the right technology and a practical path forward.
                    </p>

                    <div className="pt-2 flex flex-col min-[560px]:flex-row items-stretch min-[560px]:items-center gap-3">
                      <motion.button
                        type="button"
                        whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onOpenProjectModal()}
                        className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#0F1B3D] text-white text-sm font-semibold shadow-[0_14px_30px_rgba(15,27,61,0.18)] hover:bg-[#162654] transition-colors cursor-pointer"
                      >
                        <span>Discuss Your Project</span>
                        <span className="inline-flex items-center transition-transform duration-200 group-hover:translate-x-1">
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onNavigate('/contact')}
                        className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-[#0F1B3D] text-sm font-semibold border border-[#E2E8F0] shadow-[0_10px_25px_rgba(15,27,61,0.06)] hover:border-slate-300 transition-all cursor-pointer"
                      >
                        <span className="w-6 h-6 rounded-full bg-[#EEF4FF] text-[#1266E8] flex items-center justify-center shrink-0">
                          <Mail className="w-3.5 h-3.5" />
                        </span>
                        <span>Contact IAMTECHNI</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* RIGHT COLUMN – Overlapping Rounded Photos + Floating SLA Chip */}
                  <div className="min-[900px]:col-span-6 relative flex justify-center min-[900px]:justify-end py-4">
                    <div className="relative w-full max-w-[440px]">
                      <motion.div
                        animate={prefersReducedMotion ? undefined : { y: [-5, 5, -5] }}
                        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
                        className="relative ml-auto w-[84%] h-[250px] sm:h-[290px] rounded-[20px] overflow-hidden border border-[#EEF1F5] bg-slate-100 shadow-[0_20px_50px_rgba(15,27,61,0.08)]"
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
                        className="absolute -bottom-4 left-0 w-[48%] h-[145px] sm:h-[165px] z-10 rounded-[20px] overflow-hidden border-4 border-white bg-slate-100 shadow-[0_20px_50px_rgba(15,27,61,0.12)]"
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
                        className="absolute -top-3 right-2 sm:-right-2 z-20 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-[#EEF1F5] shadow-[0_20px_50px_rgba(15,27,61,0.10)]"
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        <span className="text-xs font-mono font-bold text-[#0F1B3D] tracking-tight">
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
                  {/* LEFT COLUMN – Label + Subtext + 3-Item Interactive Accordion */}
                  <div className="min-[900px]:col-span-6 space-y-4 text-left">
                    <div className="text-xs font-mono font-bold uppercase tracking-[0.15em] text-[#1266E8]">
                      IAMTECHNI // ENGINEERING_ENGAGEMENT
                    </div>

                    <p className="text-sm sm:text-base font-mono text-slate-600">
                      // Direct collaboration with senior software architects
                    </p>

                    <div className="pt-1 space-y-2.5">
                      {ACCORDION_ITEMS.map((item, idx) => {
                        const isActive = activeAccordion === idx;
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectAccordion(idx)}
                            className={`w-full text-left rounded-[18px] transition-all duration-300 border cursor-pointer relative overflow-hidden ${
                              isActive
                                ? 'bg-white border-[#EEF1F5] shadow-[0_14px_35px_rgba(15,27,61,0.07)] py-3.5 px-5'
                                : 'bg-slate-50/70 hover:bg-white border-[#EEF1F5] py-3 px-5'
                            }`}
                          >
                            <div
                              className={`absolute left-0 top-0 bottom-0 w-1.5 transition-opacity duration-300 bg-[#04C8E8] ${
                                isActive ? 'opacity-100' : 'opacity-0'
                              }`}
                            />

                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                                    isActive
                                      ? 'bg-[#ECFEFF] text-[#0891B2]'
                                      : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <span
                                  className={`text-sm sm:text-base font-bold transition-colors ${
                                    isActive ? 'text-[#0F1B3D]' : 'text-slate-600'
                                  }`}
                                >
                                  {item.title}
                                </span>
                              </div>

                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                                  isActive
                                    ? 'bg-[#04C8E8]/15 text-[#0891B2]'
                                    : 'bg-slate-100 text-slate-400'
                                }`}
                              >
                                {isActive ? (
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                ) : (
                                  <Plus className="w-3.5 h-3.5" />
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* RIGHT COLUMN – Crossfading White UI Card + Status Pill */}
                  <div className="min-[900px]:col-span-6 space-y-3">
                    <div className="relative rounded-[20px] bg-slate-50/60 border border-[#EEF1F5] shadow-inner p-5 sm:p-6 min-h-[235px] flex flex-col justify-between overflow-hidden">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-300/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-300/80" />
                        </div>
                        <span className="text-[11px] font-mono font-semibold text-slate-400">
                          {ACCORDION_ITEMS[activeAccordion].title}
                        </span>
                      </div>

                      <div className="my-auto py-3">
                        <AnimatePresence mode="wait">
                          {activeAccordion === 0 && (
                            <motion.div
                              key="nda-card"
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                              className="max-w-sm mx-auto rounded-2xl border border-slate-100 bg-white p-4 space-y-3 shadow-xs"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-[#ECFEFF] text-[#0891B2] flex items-center justify-center">
                                    <FileCheck2 className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="space-y-1.5">
                                    <div className="h-2 w-24 rounded-full bg-[#0F1B3D]/80" />
                                    <div className="h-1.5 w-14 rounded-full bg-slate-300" />
                                  </div>
                                </div>
                                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                  <Check className="w-3 h-3" />
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <div className="h-1.5 w-full rounded-full bg-slate-200/90" />
                                <div className="h-1.5 w-[90%] rounded-full bg-slate-200/90" />
                                <div className="h-1.5 w-[75%] rounded-full bg-slate-200/90" />
                              </div>

                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                <div className="h-1.5 w-12 rounded-full bg-slate-300" />
                                <svg
                                  viewBox="0 0 140 36"
                                  className="w-28 h-7 text-[#1266E8] overflow-visible"
                                  fill="none"
                                >
                                  <motion.path
                                    d="M6 26 C 22 8, 30 30, 46 16 C 58 6, 68 28, 84 14 C 98 4, 112 22, 134 12"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0, opacity: 0.4 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 1.1, ease: 'easeInOut' }}
                                  />
                                </svg>
                              </div>
                            </motion.div>
                          )}

                          {activeAccordion === 1 && (
                            <motion.div
                              key="sprints-card"
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                              className="grid grid-cols-3 gap-2.5"
                            >
                              {[0, 1, 2].map((col) => (
                                <div
                                  key={col}
                                  className="rounded-xl bg-white border border-slate-100 p-2.5 space-y-2 shadow-xs"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="h-1.5 w-10 rounded-full bg-slate-300" />
                                    <span
                                      className={`w-2 h-2 rounded-full ${
                                        col === 0
                                          ? 'bg-[#04C8E8]'
                                          : col === 1
                                          ? 'bg-[#1266E8]'
                                          : 'bg-emerald-500'
                                      }`}
                                    />
                                  </div>

                                  {[0, 1].map((cardIdx) => (
                                    <motion.div
                                      key={cardIdx}
                                      initial={{ opacity: 0, y: 8 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{
                                        duration: 0.35,
                                        delay: col * 0.08 + cardIdx * 0.1,
                                        ease: EASE_OUT_EXPO,
                                      }}
                                      className="rounded-lg bg-slate-50 p-2 border border-slate-100 space-y-1.5"
                                    >
                                      <div className="h-1.5 w-4/5 rounded-full bg-[#0F1B3D]/75" />
                                      <div className="h-1.5 w-3/5 rounded-full bg-slate-200" />
                                    </motion.div>
                                  ))}
                                </div>
                              ))}
                            </motion.div>
                          )}

                          {activeAccordion === 2 && (
                            <motion.div
                              key="ip-card"
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                              className="max-w-sm mx-auto space-y-2"
                            >
                              {[0, 1, 2].map((row) => (
                                <motion.div
                                  key={row}
                                  initial={{ opacity: 0, x: 12 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: row * 0.07,
                                    ease: EASE_OUT_EXPO,
                                  }}
                                  className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100 shadow-xs"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-[#EEF4FF] text-[#1266E8] flex items-center justify-center">
                                      <FolderLock className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="space-y-1">
                                      <div
                                        className={`h-2 rounded-full bg-[#0F1B3D]/80 ${
                                          row === 0 ? 'w-28' : row === 1 ? 'w-20' : 'w-24'
                                        }`}
                                      />
                                      <div className="h-1.5 w-14 rounded-full bg-slate-300" />
                                    </div>
                                  </div>

                                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-600">
                                    <Lock className="w-2.5 h-2.5" />
                                    <Check className="w-2.5 h-2.5" />
                                  </div>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Small pill below the card showing STATUS & READY TO ARCHITECT */}
                    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-full bg-white border border-[#EEF1F5] shadow-xs text-[11px] font-mono">
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
              <div className="h-full rounded-[20px] bg-white/95 border border-[#EEF1F5] shadow-[0_20px_50px_rgba(15,27,61,0.08)] p-6 sm:p-8 lg:p-10">
                <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-8 lg:gap-10 items-center h-full">
                  {/* LEFT COLUMN – Exact Text & 2x2 Action Buttons */}
                  <div className="min-[900px]:col-span-7 space-y-4 text-left">
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

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F1B3D] leading-snug">
                      Have a project or technology requirement in mind?
                    </h3>

                    <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                      Reach out to our engineering and consulting team directly by phone or email.
                    </p>

                    <div className="pt-2 grid grid-cols-1 min-[560px]:grid-cols-2 gap-3">
                      <motion.a
                        href={COMPANY_CONTACT.phoneTel}
                        whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                        className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_8px_20px_rgba(15,27,61,0.05)] hover:border-teal-400 transition-all group"
                        title={`Call ${COMPANY_CONTACT.phone}`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 text-left">
                          <div className="text-[10px] uppercase font-mono tracking-wider text-teal-600 font-bold">
                            CALL DIRECTLY
                          </div>
                          <div className="font-mono text-xs sm:text-sm font-bold text-[#0F1B3D] truncate">
                            {COMPANY_CONTACT.phone}
                          </div>
                        </div>
                      </motion.a>

                      <motion.a
                        href={COMPANY_CONTACT.emailMailto}
                        whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                        className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_8px_20px_rgba(15,27,61,0.05)] hover:border-[#1266E8] transition-all group"
                        title={`Email ${COMPANY_CONTACT.email}`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#1266E8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 text-left">
                          <div className="text-[10px] uppercase font-mono tracking-wider text-[#1266E8] font-bold">
                            EMAIL INQUIRIES
                          </div>
                          <div className="font-mono text-xs sm:text-sm font-bold text-[#0F1B3D] truncate">
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
                        className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_8px_20px_rgba(15,27,61,0.05)] hover:border-indigo-400 transition-all cursor-pointer group"
                        title="Open IAMTECHNI AI Assistant"
                      >
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-[#0F1B3D]">
                          Ask AI Advisor
                        </span>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onOpenProjectModal()}
                        className="group inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-full bg-[#0F1B3D] text-white text-sm font-semibold shadow-[0_12px_28px_rgba(15,27,61,0.18)] hover:bg-[#162654] transition-colors cursor-pointer"
                      >
                        <span>Start a Project</span>
                        <span className="inline-flex items-center transition-transform duration-200 group-hover:translate-x-1">
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </motion.button>
                    </div>
                  </div>

                  {/* RIGHT COLUMN – Two Smaller Rounded Photos Stacked & Offset */}
                  <div className="min-[900px]:col-span-5 relative h-[240px] sm:h-[270px] flex items-center justify-center">
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

        {/* Centred in light grey mono under the single sliding row */}
        <div className="pt-2 text-center text-xs text-slate-400 font-mono">
          IAMTECHNI // https://iamtechni.in
        </div>
      </div>
    </section>
  );
};
