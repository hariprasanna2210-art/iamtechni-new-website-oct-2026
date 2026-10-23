import React from 'react';
import { ArrowRight, MessageSquare, CheckCircle2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { PageRoute } from '../../types';

export interface HeroContentProps {
  onNavigate: (route: PageRoute) => void;
  onOpenProjectModal: (serviceName?: string) => void;
  activeServiceSlug?: string;
  onSelectService?: (serviceSlugOrId: string) => void;
  isAutoPlaying?: boolean;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  onNavigate,
  onOpenProjectModal,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const headlineWords = [
    { text: 'Build', isHighlight: false },
    { text: 'Smarter.', isHighlight: true },
    { text: 'Innovate', isHighlight: false, lineBreakAfter: true },
    { text: 'Faster.', isHighlight: true },
    { text: 'Grow', isHighlight: false },
    { text: 'Further.', isHighlight: true, isLast: true },
  ];

  return (
    <div className="w-full max-w-[580px] flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* 1. Eyebrow Pill */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: -6 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="inline-flex items-center gap-1.5 sm:gap-2 self-center lg:self-start h-[34px] px-3 sm:px-4 py-0 mb-2 max-w-full rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 backdrop-blur-md border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-[#2563EB] font-['Plus_Jakarta_Sans','Inter',sans-serif] text-[10.5px] min-[375px]:text-[12px] sm:text-[13.5px] font-bold tracking-[0] leading-none whitespace-nowrap shrink-0"
      >
        <span
          className="w-2 h-2 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)] shrink-0"
          aria-hidden="true"
        />
        <span className="truncate">IAMTECHNI | Technology that moves you forward</span>
      </motion.div>

      {/* 2. Headline (Crisp white on dark hero background, Outfit/Space Grotesk font, zoom-in/zoom-out ONLY on hover) */}
      <motion.h1
        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="mt-0! !font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-bold tracking-[-0.015em] text-white leading-[1.2] origin-center lg:origin-left cursor-default"
      >
        {headlineWords.map((word, i) => (
          <React.Fragment key={`${word.text}-${i}`}>
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
                delay: prefersReducedMotion ? 0 : 0.06 * i,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`inline-block text-white drop-shadow-[0_2px_10px_rgba(34,211,238,0.18)] hover:drop-shadow-[0_4px_16px_rgba(34,211,238,0.35)] transition-shadow duration-200 ${
                word.isLast || word.lineBreakAfter ? 'mr-[0.24em] lg:mr-0' : 'mr-[0.24em]'
              }`}
            >
              {word.text}
            </motion.span>
            {!word.isLast && ' '}
            {word.lineBreakAfter && <br className="hidden lg:block" />}
          </React.Fragment>
        ))}
      </motion.h1>

      {/* 3. Subtitle */}
      <motion.p
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 6 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.4, ease: 'easeOut' }}
        className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium max-w-[540px] lg:max-w-none"
      >
        We transform ideas into intelligent digital solutions through AI,
        software engineering, modern web experiences, cloud technologies, and
        digital growth.
      </motion.p>

      {/* 4. Primary & Secondary CTA Buttons */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 6 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.52, ease: 'easeOut' }}
        className="w-full pt-0.5 flex flex-row flex-wrap items-center justify-center lg:justify-start gap-2.5"
      >
        <button
          type="button"
          onClick={() => onNavigate('/services')}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 text-white font-semibold text-xs sm:text-[13px] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.28)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <span>Explore Our Services</span>
          <ArrowRight className="w-3.5 h-3.5 text-white" />
        </button>

        <button
          type="button"
          onClick={() => onOpenProjectModal('General Technology Inquiry')}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 text-white font-semibold text-xs sm:text-[13px] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.28)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-white" />
          <span>Talk to Our Team</span>
        </button>
      </motion.div>

      {/* 5. Trust Row (Same color palette as Eyebrow Pill, with reduced distance in between) */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.65, ease: 'easeOut' }}
        className="w-full pt-1.5 border-t border-[#DBEAFE]/90 flex items-center justify-center lg:justify-start flex-wrap gap-x-1.5 gap-y-1.5 text-xs text-[#2563EB] font-['Plus_Jakarta_Sans','Inter',sans-serif]"
      >
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_10px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
          <span>13 Core Disciplines</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_10px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)] shrink-0" />
          <span>AI · Cloud · Web · Growth</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_10px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)] shrink-0" />
          <span>India &amp; Global Delivery</span>
        </div>
      </motion.div>
    </div>
  );
};
