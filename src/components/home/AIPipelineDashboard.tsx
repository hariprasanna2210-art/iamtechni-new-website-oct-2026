import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Database,
  Lock,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';

type DashboardView = 'overview' | 'detail' | 'governance';
type AutonomyLevelId = 'human_review' | 'suggest' | 'approve_first' | 'act_report';

interface PipelineTaskRow {
  id: string;
  label: string;
  meta: string;
  status: 'Completed' | 'Running' | 'Executing' | 'Awaiting approval';
  elapsed: string;
}

interface DomainPerformanceBar {
  domain: string;
  pct: number;
  color: string;
}

interface PipelineStepData {
  index: number;
  stepCode: '01' | '02' | '03';
  title: string;
  subLabel: string;
  metricText: string;
  metricTarget: number;
  metricFormat: (val: number) => string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  borderAccent: string;
  icon: React.FC<{ className?: string }>;
  sparklinePoints: string;
  sparklineFillPoints: string;
  automationSegments: {
    actReport: number;
    approveFirst: number;
    suggest: number;
  };
  recentWork: [
    { label: string; status: 'Completed' | 'Running' },
    { label: string; status: 'Completed' | 'Running' },
  ];
  rightNowTasks: PipelineTaskRow[];
  bestDomains: DomainPerformanceBar[];
  guardrails: string[];
}

const PIPELINE_STEPS: PipelineStepData[] = [
  {
    index: 0,
    stepCode: '01',
    title: 'Enterprise Query Embedding',
    subLabel: 'text-embedding-3 · 1536 dims',
    metricText: '<18ms',
    metricTarget: 18,
    metricFormat: (v) => `<${Math.max(1, Math.round(v))}ms`,
    accentColor: '#04C8E8',
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-[#04C8E8]',
    borderAccent: 'hover:border-cyan-500/50',
    icon: Cpu,
    sparklinePoints: '0,24 18,20 36,21 54,14 72,15 90,9 108,11 126,5',
    sparklineFillPoints: '0,28 0,24 18,20 36,21 54,14 72,15 90,9 108,11 126,5 126,28',
    automationSegments: { actReport: 62, approveFirst: 26, suggest: 12 },
    recentWork: [
      { label: 'Indexed policy PDF', status: 'Completed' },
      { label: 'Vectorized 1,536-dim chunks', status: 'Running' },
    ],
    rightNowTasks: [
      {
        id: 'emb-1',
        label: 'Chunk & embed Q3 Security SOP manual (42 pages)',
        meta: 'Namespace: sec_ops_v4 · Token batch #418',
        status: 'Executing',
        elapsed: '00:12',
      },
      {
        id: 'emb-2',
        label: 'Re-index updated vendor MSA clauses',
        meta: 'text-embedding-3 · Cosine normalized',
        status: 'Completed',
        elapsed: '00:04',
      },
      {
        id: 'emb-3',
        label: 'Approve new HR handbook ingestion schema',
        meta: 'PII redaction pre-check passed',
        status: 'Awaiting approval',
        elapsed: '02:15',
      },
    ],
    bestDomains: [
      { domain: 'Policy documents', pct: 98, color: 'from-cyan-400 to-blue-500' },
      { domain: 'Product manuals', pct: 95, color: 'from-cyan-400 to-teal-400' },
      { domain: 'Contracts', pct: 92, color: 'from-blue-400 to-indigo-500' },
      { domain: 'Support tickets', pct: 89, color: 'from-purple-400 to-cyan-400' },
    ],
    guardrails: [
      'Never trains on client data',
      'Never embeds unredacted PII or credentials',
      'Never writes vectors outside isolated tenant schema',
    ],
  },
  {
    index: 1,
    stepCode: '02',
    title: 'Cosine Distance Retrieval',
    subLabel: 'pgvector · HNSW Index Matching',
    metricText: '0.94 Similarity',
    metricTarget: 0.94,
    metricFormat: (v) => `${v.toFixed(2)} Similarity`,
    accentColor: '#10B981',
    badgeBg: 'bg-blue-500/20',
    badgeText: 'text-[#1266E8]',
    borderAccent: 'hover:border-blue-500/50',
    icon: Database,
    sparklinePoints: '0,25 18,22 36,17 54,18 72,12 90,10 108,7 126,4',
    sparklineFillPoints: '0,28 0,25 18,22 36,17 54,18 72,12 90,10 108,7 126,4 126,28',
    automationSegments: { actReport: 54, approveFirst: 32, suggest: 14 },
    recentWork: [
      { label: 'Re-ranked results', status: 'Running' },
      { label: 'HNSW index partition scan', status: 'Completed' },
    ],
    rightNowTasks: [
      {
        id: 'ret-1',
        label: 'Hybrid lexical + HNSW top-k passage retrieval',
        meta: 'pgvector · ef_search=64 · threshold ≥ 0.88',
        status: 'Executing',
        elapsed: '00:08',
      },
      {
        id: 'ret-2',
        label: 'Cross-encoder semantic re-ranking on 12 passages',
        meta: 'Top similarity: 0.94 · Zero cross-tenant hits',
        status: 'Completed',
        elapsed: '00:03',
      },
      {
        id: 'ret-3',
        label: 'Expand retrieval scope to archived legal annex',
        meta: 'Requires compliance reviewer sign-off',
        status: 'Awaiting approval',
        elapsed: '04:10',
      },
    ],
    bestDomains: [
      { domain: 'Contracts', pct: 96, color: 'from-emerald-400 to-cyan-400' },
      { domain: 'Policy documents', pct: 94, color: 'from-blue-400 to-cyan-400' },
      { domain: 'Support tickets', pct: 91, color: 'from-indigo-400 to-blue-500' },
      { domain: 'Product manuals', pct: 88, color: 'from-purple-400 to-blue-400' },
    ],
    guardrails: [
      'Never trains on client data',
      'Never retrieves chunks across tenant RBAC boundaries',
      'Never returns passages below 0.82 similarity threshold',
    ],
  },
  {
    index: 2,
    stepCode: '03',
    title: 'Guardrailed Response Synthesizer',
    subLabel: 'Verifiable Page & Doc Citations',
    metricText: '100% Traceable',
    metricTarget: 100,
    metricFormat: (v) => `${Math.round(v)}% Traceable`,
    accentColor: '#A855F7',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-[#5427D9]',
    borderAccent: 'hover:border-purple-500/50',
    icon: ShieldCheck,
    sparklinePoints: '0,23 18,19 36,15 54,15 72,11 90,8 108,6 126,3',
    sparklineFillPoints: '0,28 0,23 18,19 36,15 54,15 72,11 90,8 108,6 126,3 126,28',
    automationSegments: { actReport: 48, approveFirst: 38, suggest: 14 },
    recentWork: [
      { label: 'Indexed policy PDF', status: 'Completed' },
      { label: 'Re-ranked results', status: 'Running' },
    ],
    rightNowTasks: [
      {
        id: 'syn-1',
        label: 'Synthesize SLA compliance summary with page citations',
        meta: 'Cited: Master_SLA_2025.pdf (p. 14, p. 19)',
        status: 'Executing',
        elapsed: '00:19',
      },
      {
        id: 'syn-2',
        label: 'Draft vendor security questionnaire response #402',
        meta: '4 verifiable citations attached · 0 unsupported claims',
        status: 'Awaiting approval',
        elapsed: '01:42',
      },
      {
        id: 'syn-3',
        label: 'Verify citation grounding on Architecture Runbook',
        meta: '100% traceable · Hallucination score 0.00%',
        status: 'Completed',
        elapsed: '00:06',
      },
    ],
    bestDomains: [
      { domain: 'Policy documents', pct: 97, color: 'from-purple-400 to-cyan-400' },
      { domain: 'Contracts', pct: 95, color: 'from-indigo-400 to-purple-400' },
      { domain: 'Support tickets', pct: 92, color: 'from-cyan-400 to-blue-500' },
      { domain: 'Product manuals', pct: 90, color: 'from-emerald-400 to-cyan-400' },
    ],
    guardrails: [
      'Never trains on client data',
      'Never answers without a citation',
      'Never extrapolates beyond retrieved source passages',
    ],
  },
];

const AUTONOMY_LEVELS: {
  id: AutonomyLevelId;
  label: string;
  badge?: string;
  desc: string;
}[] = [
  {
    id: 'human_review',
    label: 'Human review',
    desc: 'Flags context and citations; team writes final response.',
  },
  {
    id: 'suggest',
    label: 'Suggest',
    desc: 'Drafts grounded answer with page links for review.',
  },
  {
    id: 'approve_first',
    label: 'Approve first',
    badge: 'Recommended',
    desc: 'Publishes cited response immediately after 1-click sign-off.',
  },
  {
    id: 'act_report',
    label: 'Act and report',
    desc: 'Answers verified internal queries within policy limits.',
  },
];

const GOVERNANCE_RULES = [
  {
    action: 'Answer internal FAQs',
    level: 'Act and report',
    levelDot: 'bg-emerald-400',
    undoWindow: '24h',
    last30Days: '48 of 50 unchanged',
    highlightLast30: true,
  },
  {
    action: 'Draft customer replies',
    level: 'Approve first',
    levelDot: 'bg-cyan-400',
    undoWindow: '15m',
    last30Days: '36 approved · 0 undone',
    highlightLast30: false,
  },
  {
    action: 'Update knowledge base',
    level: 'Suggest',
    levelDot: 'bg-purple-400',
    undoWindow: '24h',
    last30Days: '22 indexed · 100% cited',
    highlightLast30: false,
  },
  {
    action: 'Send external email',
    level: 'Human review',
    levelDot: 'bg-amber-400',
    undoWindow: 'Always hold',
    last30Days: '100% human reviewed',
    highlightLast30: false,
  },
];

const ALWAYS_HUMAN_APPROVAL = [
  'Sharing data outside the company',
  'Deleting records',
  'Messages to external customers',
  'Changing access permissions',
];

export const AIPipelineDashboard: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.25 });

  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(2); // Default detail step 03
  const [selectedAutonomy, setSelectedAutonomy] =
    useState<AutonomyLevelId>('approve_first');
  const [promotionReviewed, setPromotionReviewed] = useState(false);

  const [userInteracted, setUserInteracted] = useState(false);
  const [isHoveredOrFocused, setIsHoveredOrFocused] = useState(false);

  // First-view count-up progress (0 -> 1)
  const [countProgress, setCountProgress] = useState(prefersReducedMotion ? 1 : 0);
  const hasCountedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCountProgress(1);
      return;
    }
    if (!isInView || hasCountedRef.current) return;
    hasCountedRef.current = true;

    const duration = 1100;
    const start = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCountProgress(eased);
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, prefersReducedMotion]);

  // Auto-play demo loop: Overview (5s) -> open card 03 detail (6s) -> Governance view (6s) -> back to Overview
  useEffect(() => {
    if (prefersReducedMotion || userInteracted || isHoveredOrFocused || !isInView) {
      return;
    }

    const durationMs = activeView === 'overview' ? 5000 : 6000;
    const timer = window.setTimeout(() => {
      if (activeView === 'overview') {
        setSelectedStepIdx(2); // Card 03
        setActiveView('detail');
      } else if (activeView === 'detail') {
        setActiveView('governance');
      } else {
        setActiveView('overview');
      }
    }, durationMs);

    return () => window.clearTimeout(timer);
  }, [
    activeView,
    prefersReducedMotion,
    userInteracted,
    isHoveredOrFocused,
    isInView,
  ]);

  const stopAutoPlayAndRun = useCallback((action: () => void) => {
    setUserInteracted(true);
    action();
  }, []);

  // Escape key returns to Overview when in Detail or Governance view
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && activeView !== 'overview') {
      e.preventDefault();
      stopAutoPlayAndRun(() => setActiveView('overview'));
    }
  };

  const selectedStep = PIPELINE_STEPS[selectedStepIdx] || PIPELINE_STEPS[2];

  const promptCacheVal = Math.round(92 * countProgress);
  const latencyVal = Math.round(340 * countProgress);

  const renderStatusChip = (
    status: PipelineTaskRow['status']
  ) => {
    if (status === 'Executing' || status === 'Running') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-700/70 text-[#04C8E8] text-[9.5px] font-bold shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#04C8E8] animate-pulse" />
          {status}
        </span>
      );
    }
    if (status === 'Awaiting approval') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-700/60 text-amber-300 text-[9.5px] font-bold shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[9.5px] font-bold shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        {status}
      </span>
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHoveredOrFocused(true)}
      onMouseLeave={() => setIsHoveredOrFocused(false)}
      onFocusCapture={() => setIsHoveredOrFocused(true)}
      onBlurCapture={() => setIsHoveredOrFocused(false)}
      onKeyDown={handleKeyDown}
      className={`w-full rounded-2xl bg-[#0F172A] border border-slate-800/95 shadow-[0_24px_60px_-15px_rgba(2,6,23,0.85)] p-3.5 sm:p-5 text-white font-mono flex flex-col justify-between relative overflow-hidden ${className}`}
    >
      {/* Ambient top glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-16 w-56 h-56 rounded-full bg-[#04C8E8]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-16 w-56 h-56 rounded-full bg-[#5427D9]/15 blur-3xl"
      />

      {/* =================================================================== */}
      {/* TOP BAR: Pipeline Title + Zero Leakage Chip + 3-Metric Stat Strip   */}
      {/* =================================================================== */}
      <div className="relative z-10 border-b border-slate-800/90 pb-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#04C8E8] animate-pulse shrink-0" />
            <span className="text-[10.5px] sm:text-xs font-bold text-slate-100 truncate">
              PRIVATE_RAG_INFERENCE_PIPELINE
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700/80">
              Illustrative
            </span>
            <span className="text-[10px] text-[#04C8E8] bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 font-bold">
              Zero Leakage
            </span>
          </div>
        </div>

        {/* Stat Strip with the 3 Existing Metrics (92% Hit, 340ms, 0.00%) */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs">
          <div className="p-2 bg-slate-950/95 rounded-lg border border-slate-800/90">
            <div className="text-[9px] text-slate-400 truncate">Prompt Cache</div>
            <div className="text-xs sm:text-sm font-bold text-emerald-400 tabular-nums">
              {countProgress >= 1 ? '92% Hit' : `${promptCacheVal}% Hit`}
            </div>
          </div>
          <div className="p-2 bg-slate-950/95 rounded-lg border border-slate-800/90">
            <div className="text-[9px] text-slate-400 truncate">P95 Latency</div>
            <div className="text-xs sm:text-sm font-bold text-cyan-400 tabular-nums">
              {countProgress >= 1 ? '340ms' : `${latencyVal}ms`}
            </div>
          </div>
          <div className="p-2 bg-slate-950/95 rounded-lg border border-slate-800/90">
            <div className="text-[9px] text-slate-400 truncate">Hallucination</div>
            <div className="text-xs sm:text-sm font-bold text-purple-400 tabular-nums">
              0.00%
            </div>
          </div>
        </div>

        {/* Navigation Tabs + 3 Jump Dots */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div
            className="inline-flex items-center gap-1 bg-slate-900/95 p-0.5 rounded-lg border border-slate-800"
            role="tablist"
            aria-label="AI operations dashboard views"
          >
            {(
              [
                { id: 'overview', label: 'Overview' },
                { id: 'detail', label: `Step ${selectedStep.stepCode}` },
                { id: 'governance', label: 'Governance' },
              ] as { id: DashboardView; label: string }[]
            ).map((tab) => {
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Switch to ${tab.label} view`}
                  onClick={() => stopAutoPlayAndRun(() => setActiveView(tab.id))}
                  className={`relative px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#04C8E8] ${
                    isActive ? 'text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="ai-pipeline-view-tab"
                      className="absolute inset-0 rounded-md bg-[#04C8E8]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 3 Small View Jump Dots */}
          <div className="flex items-center gap-1.5" role="group" aria-label="Jump between views">
            {(['overview', 'detail', 'governance'] as DashboardView[]).map((v, idx) => {
              const isCurrent = activeView === v;
              const dotLabels = ['Overview view', 'Step detail view', 'Governance view'];
              return (
                <button
                  key={v}
                  type="button"
                  aria-label={dotLabels[idx]}
                  aria-current={isCurrent ? 'true' : undefined}
                  onClick={() => stopAutoPlayAndRun(() => setActiveView(v))}
                  className={`h-2 rounded-full transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#04C8E8] ${
                    isCurrent
                      ? 'w-5 bg-[#04C8E8]'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* INTERACTIVE VIEW STAGE (View 1: Overview, View 2: Detail, View 3: Governance) */}
      {/* =================================================================== */}
      <LayoutGroup id="iamtechni-rag-dashboard">
        <div className="relative z-10 mt-3 min-h-[360px] max-h-[450px] overflow-y-auto pr-0.5 scrollbar-thin">
          <AnimatePresence mode="wait">
            {/* ------------------------------------------------------------- */}
            {/* VIEW 1: PIPELINE OVERVIEW (3 Agent-Style Pipeline Step Cards) */}
            {/* ------------------------------------------------------------- */}
            {activeView === 'overview' && (
              <motion.div
                key="view-overview"
                initial={prefersReducedMotion ? { opacity: 1 } : 'hidden'}
                animate="visible"
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.06 },
                  },
                }}
                className="space-y-2.5"
              >
                {PIPELINE_STEPS.map((step) => {
                  const StepIcon = step.icon;
                  const formattedMetric =
                    countProgress >= 1
                      ? step.metricText
                      : step.metricFormat(step.metricTarget * countProgress);

                  return (
                    <motion.div
                      key={step.stepCode}
                      layoutId={`pipeline-card-${step.stepCode}`}
                      variants={{
                        hidden: { opacity: 0, y: 12 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                        },
                      }}
                      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                      className={`group rounded-xl bg-slate-900/95 border border-slate-800/90 ${step.borderAccent} hover:shadow-[0_10px_28px_-10px_rgba(4,200,232,0.22)] transition-shadow`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          stopAutoPlayAndRun(() => {
                            setSelectedStepIdx(step.index);
                            setActiveView('detail');
                          })
                        }
                        aria-label={`Inspect step ${step.stepCode} ${step.title} (${step.metricText})`}
                        className="w-full text-left p-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#04C8E8] rounded-xl space-y-2.5"
                      >
                        {/* Card Top Row: Rounded Square Icon + Step Badge + Title/Sub-label + Active Chip + Metric */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-lg ${step.badgeBg} ${step.badgeText} border border-white/10 flex flex-col items-center justify-center shrink-0`}
                            >
                              <StepIcon className="w-3.5 h-3.5" />
                              <span className="text-[8px] font-bold leading-none mt-0.5">
                                {step.stepCode}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-slate-100 font-bold text-[11px] truncate">
                                  {step.title}
                                </span>
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-950/90 border border-emerald-700/60 text-emerald-300 text-[9px] font-bold">
                                  ● Active
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                                {step.subLabel}
                              </div>
                            </div>
                          </div>

                          {/* Big Existing Metric + Animated Sparkline */}
                          <div className="flex flex-col items-end shrink-0">
                            <span
                              className="text-[11px] sm:text-xs font-extrabold tracking-tight"
                              style={{ color: step.accentColor }}
                            >
                              {formattedMetric}
                            </span>
                            <svg
                              className="w-16 h-4 mt-0.5 overflow-visible"
                              viewBox="0 0 126 28"
                              aria-hidden="true"
                            >
                              <polygon
                                points={step.sparklineFillPoints}
                                fill={step.accentColor}
                                fillOpacity="0.12"
                              />
                              <motion.polyline
                                fill="none"
                                stroke={step.accentColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points={step.sparklinePoints}
                                initial={
                                  prefersReducedMotion
                                    ? { pathLength: 1 }
                                    : { pathLength: 0 }
                                }
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.9, ease: 'easeOut' }}
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Segmented "Automation level" bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[9px] text-slate-400">
                            <span className="uppercase tracking-wider">Automation level</span>
                            <span className="text-slate-500">Illustrative</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-950 overflow-hidden flex gap-0.5">
                            <motion.div
                              initial={prefersReducedMotion ? false : { width: 0 }}
                              animate={{ width: `${step.automationSegments.actReport}%` }}
                              transition={{ duration: 0.7, ease: 'easeOut' }}
                              className="h-full bg-[#04C8E8] rounded-l-full"
                            />
                            <motion.div
                              initial={prefersReducedMotion ? false : { width: 0 }}
                              animate={{ width: `${step.automationSegments.approveFirst}%` }}
                              transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                              className="h-full bg-[#1266E8]"
                            />
                            <motion.div
                              initial={prefersReducedMotion ? false : { width: 0 }}
                              animate={{ width: `${step.automationSegments.suggest}%` }}
                              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                              className="h-full bg-[#A855F7] rounded-r-full"
                            />
                          </div>
                        </div>

                        {/* 2 "Recent work" rows with status chips */}
                        <div className="pt-1.5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {step.recentWork.map((rw, rwIdx) => (
                            <div
                              key={rwIdx}
                              className="flex items-center justify-between gap-1.5 bg-slate-950/75 px-2 py-1 rounded border border-slate-800/70 text-[9.5px]"
                            >
                              <span className="text-slate-300 truncate">{rw.label}</span>
                              {renderStatusChip(rw.status)}
                            </div>
                          ))}
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* VIEW 2: STEP DETAIL (Expanded Shared LayoutId Card)           */}
            {/* ------------------------------------------------------------- */}
            {activeView === 'detail' && (
              <motion.div
                key={`view-detail-${selectedStep.stepCode}`}
                layoutId={`pipeline-card-${selectedStep.stepCode}`}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                className="rounded-xl bg-slate-900/95 border border-slate-700/90 p-3.5 space-y-3"
              >
                {/* Detail Top Bar: Back Button + Step Switcher Pills */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                  <button
                    type="button"
                    onClick={() => stopAutoPlayAndRun(() => setActiveView('overview'))}
                    aria-label="Back to pipeline overview"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3 text-[#04C8E8]" />
                    <span>Overview</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {PIPELINE_STEPS.map((st) => (
                      <button
                        key={st.stepCode}
                        type="button"
                        onClick={() =>
                          stopAutoPlayAndRun(() => setSelectedStepIdx(st.index))
                        }
                        aria-label={`View step ${st.stepCode} ${st.title}`}
                        className={`px-2 py-0.5 rounded text-[9.5px] font-bold cursor-pointer transition-colors ${
                          selectedStepIdx === st.index
                            ? 'bg-[#1266E8] text-white'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {st.stepCode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Step Identity Header */}
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.08 }}
                  className="flex flex-wrap items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg ${selectedStep.badgeBg} ${selectedStep.badgeText} border border-white/10 flex items-center justify-center font-bold text-xs`}
                    >
                      {selectedStep.stepCode}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">
                          {selectedStep.title}
                        </span>
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300 text-[9px] font-bold">
                          ● Active
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {selectedStep.subLabel}
                      </div>
                    </div>
                  </div>
                  <span
                    className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800"
                    style={{ color: selectedStep.accentColor }}
                  >
                    {selectedStep.metricText}
                  </span>
                </motion.div>

                {/* "Right now": 3 live-looking task rows */}
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: 0.12 }}
                  className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-2"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-slate-200 uppercase tracking-wider">
                      Right now
                    </span>
                    <span className="text-[9px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      Illustrative
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {selectedStep.rightNowTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-2 rounded-lg bg-slate-900/90 border border-slate-800/80 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="text-[10.5px] font-bold text-slate-200 truncate">
                            {task.label}
                          </div>
                          <div className="text-[9.5px] text-slate-400 truncate">
                            {task.meta}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {renderStatusChip(task.status)}
                          <span className="text-[9px] text-slate-500 tabular-nums">
                            {task.elapsed}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Bottom Grid: "Where it performs best" (4 horizontal bars) + "Guardrails" */}
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: 0.18 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                >
                  {/* Where it performs best */}
                  <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-200">
                        Where it performs best
                      </span>
                      <span className="text-[8.5px] text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                        Illustrative
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {selectedStep.bestDomains.map((bar, bIdx) => (
                        <div key={bar.domain} className="space-y-0.5">
                          <div className="flex items-center justify-between text-[9.5px]">
                            <span className="text-slate-300">{bar.domain}</span>
                            <span className="text-cyan-400 font-bold tabular-nums">
                              {bar.pct}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
                            <motion.div
                              initial={prefersReducedMotion ? false : { width: 0 }}
                              animate={{ width: `${bar.pct}%` }}
                              transition={{
                                duration: 0.65,
                                delay: 0.1 + bIdx * 0.06,
                                ease: 'easeOut',
                              }}
                              className={`h-full rounded-full bg-gradient-to-r ${bar.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Guardrails */}
                  <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-[10px] mb-1.5">
                        <span className="font-bold text-slate-200 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-[#04C8E8]" />
                          Guardrails
                        </span>
                        <span className="text-[9px] text-emerald-400 font-bold">
                          ENFORCED
                        </span>
                      </div>
                      <ul className="space-y-1.5">
                        {selectedStep.guardrails.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-1.5 text-[9.5px] text-slate-300 leading-snug"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        stopAutoPlayAndRun(() => setActiveView('governance'))
                      }
                      aria-label="Open Earned Autonomy and Governance view"
                      className="w-full mt-1 py-1.5 px-2.5 rounded-lg bg-[#1266E8]/25 hover:bg-[#1266E8]/40 border border-[#1266E8]/50 text-[#04C8E8] text-[9.5px] font-bold flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>View Earned Autonomy</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* VIEW 3: EARNED AUTONOMY & GOVERNANCE                          */}
            {/* ------------------------------------------------------------- */}
            {activeView === 'governance' && (
              <motion.div
                key="view-governance"
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-2.5"
              >
                {/* Dark Highlight Card: "Synthesizer has earned more autonomy" */}
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#0B132B] via-[#111C38] to-[#1A1443] border border-cyan-500/35 shadow-lg space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-[#04C8E8] uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      Earned autonomy
                    </span>
                    <span className="text-[8.5px] text-slate-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700">
                      Illustrative
                    </span>
                  </div>

                  <div className="text-xs font-bold text-white">
                    Synthesizer has earned more autonomy
                  </div>
                  <div className="text-[10px] text-slate-300">
                    48 of 50 responses approved unchanged in the last 30 days · 0 leaks.
                  </div>

                  {/* Animated 50-Tick Progress Bar (48 of 50 filled) */}
                  <div
                    className="flex items-center gap-[2px] pt-1"
                    aria-label="48 of 50 responses approved unchanged"
                  >
                    {Array.from({ length: 50 }).map((_, idx) => {
                      const isFilled = idx < 48;
                      return (
                        <motion.span
                          key={idx}
                          initial={
                            prefersReducedMotion
                              ? { opacity: 1 }
                              : { opacity: 0.15, scaleY: 0.4 }
                          }
                          animate={{ opacity: 1, scaleY: 1 }}
                          transition={{
                            duration: 0.22,
                            delay: prefersReducedMotion ? 0 : idx * 0.01,
                          }}
                          className={`flex-1 h-2.5 rounded-[1px] ${
                            isFilled ? 'bg-emerald-400' : 'bg-slate-700'
                          }`}
                        />
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          stopAutoPlayAndRun(() => {
                            setPromotionReviewed((prev) => !prev);
                            setSelectedAutonomy('act_report');
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-[#04C8E8] hover:bg-[#04C8E8]/85 text-slate-950 font-bold text-[10px] transition-colors cursor-pointer"
                      >
                        {promotionReviewed ? 'Promotion Active ✓' : 'Review promotion'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          stopAutoPlayAndRun(() => {
                            setPromotionReviewed(false);
                            setSelectedAutonomy('approve_first');
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-[10px] transition-colors cursor-pointer"
                      >
                        Not now
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => stopAutoPlayAndRun(() => setActiveView('overview'))}
                      className="text-[9.5px] text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Back to Overview
                    </button>
                  </div>
                </div>

                {/* Autonomy Level Selector (4 options with layoutId highlight) */}
                <div className="p-2.5 rounded-xl bg-slate-900/95 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[9.5px]">
                    <span className="font-bold text-slate-200 uppercase tracking-wider">
                      Autonomy level selector
                    </span>
                    <span className="text-slate-400">Click to configure</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {AUTONOMY_LEVELS.map((lvl) => {
                      const isSelected = selectedAutonomy === lvl.id;
                      return (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() =>
                            stopAutoPlayAndRun(() => setSelectedAutonomy(lvl.id))
                          }
                          aria-pressed={isSelected}
                          className={`relative text-left p-2 rounded-lg border transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#04C8E8] ${
                            isSelected
                              ? 'border-[#04C8E8] text-white'
                              : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {isSelected && (
                            <motion.div
                              layoutId="autonomy-level-active"
                              className="absolute inset-0 rounded-lg bg-[#04C8E8]/12 border border-[#04C8E8]"
                              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                            />
                          )}
                          <div className="relative z-10 flex flex-wrap items-center justify-between gap-1 mb-1">
                            <span className="text-[9.5px] font-bold text-slate-100">
                              {lvl.label}
                            </span>
                            {lvl.badge && (
                              <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                                {lvl.badge}
                              </span>
                            )}
                          </div>
                          <p className="relative z-10 text-[8.5px] text-slate-400 leading-tight">
                            {lvl.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Small Rules Table (Desktop table / Mobile stacked cards) + Always Requires Human Approval */}
                <div className="grid grid-cols-1 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-900/95 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[9.5px]">
                      <span className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1">
                        <Workflow className="w-3 h-3 text-[#04C8E8]" />
                        Per-action governance rules
                      </span>
                      <span className="text-[8.5px] text-slate-400 bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800">
                        Illustrative
                      </span>
                    </div>

                    {/* Desktop/Tablet Compact Table */}
                    <div className="hidden sm:block">
                      <div className="grid grid-cols-12 gap-1 text-[8.5px] uppercase text-slate-500 pb-1 border-b border-slate-800">
                        <div className="col-span-4">Action</div>
                        <div className="col-span-3">Level</div>
                        <div className="col-span-2">Undo window</div>
                        <div className="col-span-3 text-right">Last 30 days</div>
                      </div>
                      <div className="divide-y divide-slate-800/70">
                        {GOVERNANCE_RULES.map((rule) => (
                          <div
                            key={rule.action}
                            className="grid grid-cols-12 gap-1 items-center py-1.5 text-[9.5px]"
                          >
                            <div className="col-span-4 text-slate-200 font-bold truncate">
                              {rule.action}
                            </div>
                            <div className="col-span-3 flex items-center gap-1 text-slate-300 truncate">
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${rule.levelDot}`}
                              />
                              <span className="truncate">{rule.level}</span>
                            </div>
                            <div className="col-span-2 text-slate-400 truncate">
                              {rule.undoWindow}
                            </div>
                            <div
                              className={`col-span-3 text-right truncate font-semibold ${
                                rule.highlightLast30
                                  ? 'text-emerald-400'
                                  : 'text-slate-400'
                              }`}
                            >
                              {rule.last30Days}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mobile Stacked Rows (no horizontal scroll) */}
                    <div className="sm:hidden space-y-1.5">
                      {GOVERNANCE_RULES.map((rule) => (
                        <div
                          key={rule.action}
                          className="p-2 rounded-lg bg-slate-950/90 border border-slate-800 space-y-1 text-[9.5px]"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-200">
                              {rule.action}
                            </span>
                            <span className="inline-flex items-center gap-1 text-slate-300">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${rule.levelDot}`}
                              />
                              {rule.level}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[8.5px] text-slate-400">
                            <span>Undo: {rule.undoWindow}</span>
                            <span
                              className={
                                rule.highlightLast30
                                  ? 'text-emerald-400 font-bold'
                                  : 'text-slate-400'
                              }
                            >
                              {rule.last30Days}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* "Always requires human approval" card */}
                  <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1.5">
                    <div className="flex items-center justify-between text-[9.5px]">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-amber-400" />
                        Always requires human approval
                      </span>
                      <span className="text-[8.5px] text-slate-500">HARD POLICY</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {ALWAYS_HUMAN_APPROVAL.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-1.5 text-[9.5px] text-slate-300 bg-slate-900/80 px-2 py-1 rounded border border-slate-800/80"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </div>
  );
};
