import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cloud, Code2, Cpu } from 'lucide-react';
import { ArticleItem, PageRoute } from '../../types';
import { insightsData } from '../../data/insightsData';
import { useSectionInView, useIsWindowScrolling } from '../../utils/useViewportActivity';

interface EngineeringKnowledgeSectionProps {
  onNavigate: (route: PageRoute) => void;
}

interface GlassCardTheme {
  id: 'blue-violet' | 'amber-orange' | 'pink-magenta';
  glowGradient: string;
  cardTintBg: string;
  iconBg: string;
  iconBorder: string;
  iconText: string;
  chipBg: string;
  chipBorder: string;
  chipText: string;
  panelHeaderAccent: string;
  panelFooterAccent: string;
  buttonBg: string;
  buttonHoverBg: string;
  buttonBorder: string;
  buttonText: string;
  borderColor: string;
  hoverBorderColor: string;
}

const GLASS_THEMES: GlassCardTheme[] = [
  // 0: AI & Data -> blue/violet
  {
    id: 'blue-violet',
    glowGradient:
      'radial-gradient(circle at 0% 50%, rgba(124, 58, 237, 0.28) 0%, rgba(59, 130, 246, 0.18) 45%, rgba(255, 255, 255, 0) 78%)',
    cardTintBg: 'linear-gradient(135deg, rgba(238,242,255,0.82) 0%, rgba(255,255,255,0.92) 55%, rgba(245,243,255,0.85) 100%)',
    iconBg: 'bg-violet-500/12',
    iconBorder: 'border-violet-300/80',
    iconText: 'text-violet-700',
    chipBg: 'bg-violet-500/10',
    chipBorder: 'border-violet-300/80',
    chipText: 'text-violet-800',
    panelHeaderAccent: 'text-violet-700',
    panelFooterAccent: 'text-violet-700',
    buttonBg: 'bg-gradient-to-r from-blue-600/12 via-violet-600/14 to-blue-600/10',
    buttonHoverBg: 'hover:from-blue-600/20 hover:via-violet-600/22 hover:to-blue-600/18',
    buttonBorder: 'border-violet-300/90',
    buttonText: 'text-[#1E3A8A]',
    borderColor: 'rgba(196, 181, 253, 0.65)',
    hoverBorderColor: 'rgba(124, 58, 237, 0.55)',
  },
  // 1: Cloud & DevOps -> amber/orange
  {
    id: 'amber-orange',
    glowGradient:
      'radial-gradient(circle at 0% 50%, rgba(245, 158, 11, 0.28) 0%, rgba(249, 115, 22, 0.18) 45%, rgba(255, 255, 255, 0) 78%)',
    cardTintBg: 'linear-gradient(135deg, rgba(255,251,235,0.85) 0%, rgba(255,255,255,0.92) 55%, rgba(255,247,237,0.85) 100%)',
    iconBg: 'bg-amber-500/15',
    iconBorder: 'border-amber-300/85',
    iconText: 'text-amber-700',
    chipBg: 'bg-amber-500/12',
    chipBorder: 'border-amber-300/85',
    chipText: 'text-amber-900',
    panelHeaderAccent: 'text-amber-800',
    panelFooterAccent: 'text-amber-800',
    buttonBg: 'bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/10',
    buttonHoverBg: 'hover:from-amber-500/25 hover:via-orange-500/25 hover:to-amber-500/20',
    buttonBorder: 'border-amber-300/90',
    buttonText: 'text-amber-950',
    borderColor: 'rgba(252, 211, 77, 0.7)',
    hoverBorderColor: 'rgba(245, 158, 11, 0.6)',
  },
  // 2: Web Engineering -> pink/magenta
  {
    id: 'pink-magenta',
    glowGradient:
      'radial-gradient(circle at 0% 50%, rgba(236, 72, 153, 0.26) 0%, rgba(217, 70, 239, 0.18) 45%, rgba(255, 255, 255, 0) 78%)',
    cardTintBg: 'linear-gradient(135deg, rgba(253,242,248,0.85) 0%, rgba(255,255,255,0.92) 55%, rgba(250,245,255,0.85) 100%)',
    iconBg: 'bg-pink-500/12',
    iconBorder: 'border-pink-300/80',
    iconText: 'text-pink-700',
    chipBg: 'bg-pink-500/10',
    chipBorder: 'border-pink-300/80',
    chipText: 'text-pink-800',
    panelHeaderAccent: 'text-pink-700',
    panelFooterAccent: 'text-pink-700',
    buttonBg: 'bg-gradient-to-r from-pink-500/14 via-fuchsia-500/14 to-pink-500/10',
    buttonHoverBg: 'hover:from-pink-500/24 hover:via-fuchsia-500/24 hover:to-pink-500/18',
    buttonBorder: 'border-pink-300/90',
    buttonText: 'text-pink-950',
    borderColor: 'rgba(249, 168, 212, 0.7)',
    hoverBorderColor: 'rgba(236, 72, 153, 0.55)',
  },
];

const getThemeForCategory = (category: string, slotIdx: number): GlassCardTheme => {
  const lower = category.toLowerCase();
  if (lower.includes('ai') || lower.includes('data')) return GLASS_THEMES[0];
  if (lower.includes('cloud') || lower.includes('devops')) return GLASS_THEMES[1];
  if (lower.includes('web')) return GLASS_THEMES[2];
  return GLASS_THEMES[slotIdx % GLASS_THEMES.length];
};

const getCategoryIcon = (category: string) => {
  const lower = category.toLowerCase();
  if (lower.includes('ai') || lower.includes('data')) return Cpu;
  if (lower.includes('cloud') || lower.includes('devops')) return Cloud;
  return Code2;
};

interface BenchmarkPanelProps {
  slug: string;
  theme: GlassCardTheme;
  frontCycleCount: number;
}

const ArticleBenchmarkPanel: React.FC<BenchmarkPanelProps> = ({
  slug,
  theme,
  frontCycleCount,
}) => {
  const isRag = slug.toLowerCase().includes('rag') || slug.toLowerCase().includes('vector');

  // Fast count-up state triggered each time front side appears
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    let rafId = 0;
    const duration = 520;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [frontCycleCount]);

  if (isRag) {
    const bmVal = Math.max(1, Math.round(25 * progress));
    const dimVal = Math.max(128, Math.round(1536 * progress));
    const rrfVal = Math.max(1, Math.round(5 * progress));

    return (
      <div className="relative w-full rounded-2xl bg-white/85 backdrop-blur-md border border-[#DBEAFE] p-4 text-[#1E3A8A] overflow-hidden shadow-[0_8px_24px_rgba(30,58,138,0.06)] flex flex-col justify-between gap-3">
        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-200/80 pb-2.5">
          <span
            className={`text-[10px] sm:text-[11px] font-mono ${theme.panelHeaderAccent} font-bold uppercase tracking-wider leading-snug`}
          >
            ARCHITECTURE DIAGRAM // ENTERPRISE RAG
          </span>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
            Hybrid BM25 + pgvector
          </span>
        </div>

        {/* 3 Metric Boxes — Full Values Visible Without "..." */}
        <div className="grid grid-cols-3 gap-2 my-auto py-1 text-center font-mono">
          <div className="p-2.5 bg-[#F8FAFF] rounded-xl border border-[#DBEAFE] flex flex-col justify-between">
            <div className="text-[9.5px] text-slate-600 leading-tight">Lexical</div>
            <div className="text-xs sm:text-sm font-extrabold text-amber-700 my-1 leading-tight tabular-nums">
              BM{bmVal}
            </div>
            <div className="text-[8.5px] text-slate-600 leading-tight">Exact Match</div>
          </div>

          <div className="p-2.5 bg-[#F8FAFF] rounded-xl border border-[#DBEAFE] flex flex-col justify-between">
            <div className="text-[9.5px] text-slate-600 leading-tight">Embedding</div>
            <div className="text-xs sm:text-sm font-extrabold text-[#2563EB] my-1 leading-tight tabular-nums">
              {dimVal}d
            </div>
            <div className="text-[8.5px] text-slate-600 leading-tight">Semantic</div>
          </div>

          <div className="p-2.5 bg-[#F8FAFF] rounded-xl border border-[#DBEAFE] flex flex-col justify-between">
            <div className="text-[9.5px] text-slate-600 leading-tight">Rank Fusion</div>
            <div className="text-xs sm:text-sm font-extrabold text-emerald-700 my-1 leading-tight tabular-nums">
              RRF Top-{rrfVal}
            </div>
            <div className="text-[8.5px] text-slate-600 leading-tight">Verified</div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200/80 text-[10px] text-slate-600 flex flex-wrap items-center justify-between gap-2">
          <span>Grounded Ingest Pipeline</span>
          <span className={`${theme.panelFooterAccent} font-bold`}>15% Token Overlap</span>
        </div>
      </div>
    );
  }

  const availVal = (99.99 * progress).toFixed(2);
  const latVal = Math.max(10, Math.round(85 * progress));
  const k8sVal = Math.max(1, Math.round(8 * progress));

  return (
    <div className="relative w-full rounded-2xl bg-white/85 backdrop-blur-md border border-[#DBEAFE] p-4 text-[#1E3A8A] overflow-hidden shadow-[0_8px_24px_rgba(30,58,138,0.06)] flex flex-col justify-between gap-3">
      <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-200/80 pb-2.5">
        <span
          className={`text-[10px] sm:text-[11px] font-mono ${theme.panelHeaderAccent} font-bold uppercase tracking-wider leading-snug`}
        >
          TECHNICAL BENCHMARK // ENTERPRISE DEPLOYMENT
        </span>
        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
          Zero-Downtime Rollout
        </span>
      </div>

      {/* 3 Metric Boxes — Full Values Visible Without "..." */}
      <div className="grid grid-cols-3 gap-2 my-auto py-1 text-center font-mono">
        <div className="p-2.5 bg-[#F8FAFF] rounded-xl border border-[#DBEAFE] flex flex-col justify-between">
          <div className="text-[9.5px] text-slate-600 leading-tight">Availability</div>
          <div className="text-xs sm:text-sm font-extrabold text-[#1E3A8A] my-1 leading-tight tabular-nums">
            {availVal}%
          </div>
          <div className="text-[8.5px] text-slate-600 leading-tight">Multi-AZ SLA</div>
        </div>

        <div className="p-2.5 bg-[#F8FAFF] rounded-xl border border-[#DBEAFE] flex flex-col justify-between">
          <div className="text-[9.5px] text-slate-600 leading-tight">P99 Latency</div>
          <div className="text-xs sm:text-sm font-extrabold text-[#2563EB] my-1 leading-tight tabular-nums">
            &lt;{latVal}ms
          </div>
          <div className="text-[8.5px] text-slate-600 leading-tight">Edge CDN</div>
        </div>

        <div className="p-2.5 bg-[#F8FAFF] rounded-xl border border-[#DBEAFE] flex flex-col justify-between">
          <div className="text-[9.5px] text-slate-600 leading-tight">Orchestration</div>
          <div className="text-xs sm:text-sm font-extrabold text-emerald-700 my-1 leading-tight tabular-nums">
            K{k8sVal}s / ECS
          </div>
          <div className="text-[8.5px] text-slate-600 leading-tight">GitOps</div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200/80 text-[10px] text-slate-600 flex flex-wrap items-center justify-between gap-2">
        <span>IAMTECHNI Engineering Research Practice</span>
        <span className="text-[#2563EB] font-bold">PRODUCTION BENCHMARKED</span>
      </div>
    </div>
  );
};

interface FlipGlassCardProps {
  slotIndex: number;
  articles: ArticleItem[];
  onNavigate: (route: PageRoute) => void;
  isSectionActive: boolean;
}

const FlipGlassCard: React.FC<FlipGlassCardProps> = ({
  slotIndex,
  articles,
  onNavigate,
  isSectionActive,
}) => {
  const [articleCursor, setArticleCursor] = useState(0);
  const [isFlippedToBack, setIsFlippedToBack] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [frontCycleCount, setFrontCycleCount] = useState(0);

  const isHoveredRef = useRef(false);
  isHoveredRef.current = isHovered;

  const currentArticle = articles[articleCursor % articles.length];
  const theme = getThemeForCategory(currentArticle.category, slotIndex);
  const CategoryIcon = getCategoryIcon(currentArticle.category);

  // Auto-flip in a staggered wave only when the section is visible in viewport and user is not actively scrolling
  useEffect(() => {
    if (!isSectionActive) return;

    const staggerDelayMs = slotIndex * 200;
    let intervalId: number | undefined;

    const startTimeout = window.setTimeout(() => {
      const triggerFlip = () => {
        if (isHoveredRef.current) return;
        setIsFlippedToBack((prev) => {
          const nextIsBack = !prev;
          if (!nextIsBack) {
            setFrontCycleCount((c) => c + 1);
            if (articles.length > 1) {
              setArticleCursor((idx) => (idx + 1) % articles.length);
            }
          }
          return nextIsBack;
        });
      };

      intervalId = window.setInterval(triggerFlip, 4600);
    }, staggerDelayMs);

    return () => {
      window.clearTimeout(startTimeout);
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [slotIndex, articles.length, isSectionActive]);

  // Hovering a card pauses auto-flip and flips it to the BACK so user can read and click
  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsFlippedToBack(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Touch / click on card body flips the card; keyboard Enter/Space flips the card
  const handleCardClick = () => {
    setIsFlippedToBack((prev) => {
      const next = !prev;
      if (!next) {
        setFrontCycleCount((c) => c + 1);
      }
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if ((e.target as HTMLElement)?.tagName.toLowerCase() === 'button') {
        return;
      }
      e.preventDefault();
      handleCardClick();
    }
  };

  const effectiveRotateY = isHovered ? 180 : isFlippedToBack ? 180 : 0;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="group"
      aria-label={`${currentArticle.category}: ${currentArticle.title}`}
      style={{ perspective: '1200px' }}
      className="group relative h-[330px] sm:h-[390px] w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-[20px] cursor-pointer select-none"
    >
      <motion.div
        animate={{ rotateY: effectiveRotateY }}
        transition={{
          duration: 0.45,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full"
      >
        {/* ================================================================= */}
        {/* FRONT FACE: Benchmark Panel + Category Tag + Read Time            */}
        {/* ================================================================= */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: theme.cardTintBg,
            borderColor: isHovered ? theme.hoverBorderColor : theme.borderColor,
          }}
          className="absolute inset-0 rounded-[20px] border p-4 sm:p-6 flex flex-col justify-between overflow-hidden md:backdrop-blur-md shadow-[0_16px_42px_-10px_rgba(30,58,138,0.12)] transition-colors duration-300"
        >
          {/* Soft Coloured Glow Blob on LEFT Edge */}
          <div
            aria-hidden="true"
            style={{ background: theme.glowGradient }}
            className="pointer-events-none absolute -left-12 top-0 bottom-0 w-56 blur-xl sm:blur-2xl opacity-85 group-hover:opacity-100 transition-opacity duration-300"
          />

          {/* Top Row: Tinted Rounded Square Icon + Category Chip + Read Time Chip */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-xl ${theme.iconBg} border ${theme.iconBorder} ${theme.iconText} flex items-center justify-center shadow-2xs shrink-0`}
              >
                <CategoryIcon className="w-5 h-5" />
              </div>
              <span
                className={`font-mono font-bold px-2.5 py-1 rounded-lg text-[11px] ${theme.chipBg} ${theme.chipText} border ${theme.chipBorder}`}
              >
                {currentArticle.category}
              </span>
            </div>

            <span className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-white/80 text-slate-600 border border-slate-200/90 font-semibold">
              {currentArticle.readTime}
            </span>
          </div>

          {/* Center: Benchmark Panel with Fast Count-Up & Zero Truncation */}
          <div className="relative z-10 my-auto py-2">
            <ArticleBenchmarkPanel
              slug={currentArticle.slug}
              theme={theme}
              frontCycleCount={frontCycleCount}
            />
          </div>

          {/* Bottom Row: Published Date + Title Preview Hint + Mobile Tap-to-Flip Cue */}
          <div className="relative z-10 pt-3 border-t border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-mono text-[11px] text-slate-600 shrink-0">
                {currentArticle.publishedDate}
              </span>
              <span className="text-[11px] font-bold text-[#1E3A8A] truncate">
                {currentArticle.title}
              </span>
            </div>
            <div className="flex md:hidden items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#1E3A8A]/90 text-white text-[11px] font-semibold">
              <span>Tap card to flip for article summary</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* BACK FACE: Category Tag, Read Time, Title, Excerpt, Read Button   */}
        {/* ================================================================= */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: theme.cardTintBg,
            borderColor: isHovered ? theme.hoverBorderColor : theme.borderColor,
          }}
          className="absolute inset-0 rounded-[20px] border p-4 sm:p-6 flex flex-col justify-between overflow-hidden md:backdrop-blur-md shadow-[0_16px_42px_-10px_rgba(30,58,138,0.12)] transition-colors duration-300"
        >
          {/* Soft Coloured Glow Blob on LEFT Edge (Brighter on hover) */}
          <div
            aria-hidden="true"
            style={{ background: theme.glowGradient }}
            className="pointer-events-none absolute -left-10 top-0 bottom-0 w-64 blur-xl sm:blur-2xl opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          />

          <div className="relative z-10 space-y-4">
            {/* Top Row: Small Icon in Rounded Square + Category & Read Time Chips */}
            <div className="flex items-center justify-between gap-2">
              <div
                className="flex items-center gap-2.5"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${theme.iconBg} border ${theme.iconBorder} ${theme.iconText} flex items-center justify-center shadow-2xs shrink-0`}
                >
                  <CategoryIcon className="w-5 h-5" />
                </div>
                <span
                  className={`font-mono font-bold px-2.5 py-1 rounded-lg text-[11px] ${theme.chipBg} ${theme.chipText} border ${theme.chipBorder}`}
                >
                  {currentArticle.category}
                </span>
              </div>

              <span className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-white/80 text-slate-600 border border-slate-200/90 font-semibold">
                {currentArticle.readTime}
              </span>
            </div>

            {/* Article Title */}
            <h3 className="!font-['Outfit','Space_Grotesk',sans-serif] text-lg sm:text-[19px] font-bold text-[#1E3A8A] leading-snug">
              {currentArticle.title}
            </h3>

            {/* Article Excerpt */}
            <p className="text-[13.5px] sm:text-sm text-slate-700 leading-relaxed">
              {currentArticle.excerpt}
            </p>
          </div>

          {/* Bottom Full-Width Tinted Button + Published Date */}
          <div className="relative z-10 pt-3 border-t border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
              <span>{currentArticle.publishedDate}</span>
              <span className={`font-semibold ${theme.chipText}`}>
                {currentArticle.author.role}
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(`/insights/${currentArticle.slug}` as PageRoute);
              }}
              className="w-full h-[44px] min-h-[44px] min-w-[44px] px-5 rounded-lg bg-[#1E3A8A]/90 hover:bg-[#1E3A8A]/80 text-white font-semibold text-xs sm:text-[13px] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.28)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-between whitespace-nowrap cursor-pointer group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
            >
              <span>Read Article</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const EngineeringKnowledgeSection: React.FC<EngineeringKnowledgeSectionProps> = ({
  onNavigate,
}) => {
  const [sectionRef, isSectionInView] = useSectionInView<HTMLElement>(0.15);
  const isWindowScrolling = useIsWindowScrolling();
  const isSectionActive = isSectionInView && !isWindowScrolling;

  // Distribute articles across 3 card slots (if > 3 articles, slots rotate through additional articles)
  const slotCount = Math.min(3, insightsData.length);
  const cardSlots: ArticleItem[][] = Array.from({ length: slotCount }, (_, slotIdx) =>
    insightsData.filter((_, artIdx) => artIdx % slotCount === slotIdx)
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-10 sm:py-24 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF] border-b border-slate-200 overflow-hidden"
    >
      {/* Subtle Ambient Background Accents for Glass Depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 bg-[#DBEAFE]/40 rounded-full blur-2xl sm:blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-1/4 w-96 h-96 bg-[#EEF4FF]/60 rounded-full blur-2xl sm:blur-[130px]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Matched with White Background & Hero Reference Style) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-12 gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 h-[32px] sm:h-[34px] px-3 sm:px-4 mb-2.5 sm:mb-3 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 backdrop-blur-md border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-xs font-mono uppercase tracking-widest text-[#2563EB] font-bold">
              <span
                className="w-2 h-2 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)] shrink-0"
                aria-hidden="true"
              />
              <span>Engineering Knowledge</span>
            </div>

            <motion.h2
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl lg:text-[36px] xl:text-[40px] font-bold tracking-[-0.015em] text-[#1E3A8A] leading-[1.2] origin-left cursor-default"
            >
              {['Ideas,', 'knowledge', 'and', 'practical', 'engineering.'].map(
                (word, i, arr) => {
                  const isLast = i === arr.length - 1;
                  return (
                    <React.Fragment key={`${word}-${i}`}>
                      <motion.span
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{
                          scale: 1.06,
                          transition: { duration: 0.22, ease: 'easeOut' },
                        }}
                        transition={{
                          opacity: { duration: 0.4, delay: 0.05 * i },
                          y: { duration: 0.4, delay: 0.05 * i },
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
                }
              )}
            </motion.h2>

            <p className="text-[13.5px] sm:text-base lg:text-[17px] text-slate-600 font-medium mt-2 sm:mt-3 leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-none">
              Technical articles, architecture reviews, and field notes written by our senior engineering team.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/insights')}
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 text-white font-semibold text-xs sm:text-[13px] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.28)] transition-all duration-200 active:scale-[0.98] cursor-pointer self-start md:self-auto shrink-0"
          >
            <span>Browse All Articles</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* 3D Flip Glass Cards Grid: 3 in a row on Desktop, 2 on Tablet, 2 compact on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-7">
          {cardSlots.map((slotArticles, slotIdx) => (
            <div
              key={slotArticles[0]?.slug || slotIdx}
              className={slotIdx === 2 ? 'hidden md:block' : 'block'}
            >
              <FlipGlassCard
                slotIndex={slotIdx}
                articles={slotArticles}
                onNavigate={onNavigate}
                isSectionActive={isSectionActive}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
