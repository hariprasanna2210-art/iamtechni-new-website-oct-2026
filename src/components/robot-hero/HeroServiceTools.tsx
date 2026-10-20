import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { getToolsForService } from '../../data/heroServiceTools';

export interface HeroServiceToolsProps {
  activeServiceSlug?: string;
  className?: string;
}

export const HeroServiceTools: React.FC<HeroServiceToolsProps> = ({
  activeServiceSlug = 'ai-machine-learning',
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const tools = getToolsForService(activeServiceSlug);

  return (
    <div
      className={`relative z-20 flex flex-col items-center justify-center w-full ${className}`}
      aria-label="Active Service Technology Stack"
    >
      <div className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#087BFA]" />
        <span>Core Technologies & Frameworks</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeServiceSlug}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="flex items-center justify-center flex-wrap gap-2 sm:gap-2.5 max-w-full px-2"
        >
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.name}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.82, y: 8 }
                }
                animate={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 1, scale: 1, y: 0 }
                }
                transition={{
                  duration: 0.32,
                  delay: prefersReducedMotion ? 0 : index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group flex flex-col items-center justify-center px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_14px_rgba(7,22,56,0.06)] hover:shadow-md hover:border-[#087BFA]/40 transition-all duration-200 cursor-default min-w-[54px] sm:min-w-[62px] ${
                  index >= 4 ? 'hidden sm:flex' : 'flex'
                }`}
              >
                <div
                  className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                  style={{ color: tool.brandColor }}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="mt-1 text-[10px] sm:text-[11px] font-semibold text-slate-700 tracking-tight leading-none whitespace-nowrap">
                  {tool.name}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
