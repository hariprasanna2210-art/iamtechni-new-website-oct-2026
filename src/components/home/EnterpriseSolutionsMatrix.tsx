import React, { useState, useEffect, useRef } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import {
  Brain,
  Cloud,
  Code2,
  BarChart3,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Sparkles,
  Play,
} from 'lucide-react';
import { PageRoute } from '../../types';

interface SolutionPillar {
  id: string;
  tabLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  title: string;
  businessProblem: string;
  engineeringApproach: string;
  targetServiceRoute: PageRoute;
  targetServiceName: string;
  metrics: {
    value: string;
    label: string;
    detail: string;
  }[];
  techStack: string[];
  deliverables: string[];
  architectureStages: {
    step: string;
    name: string;
    protocol: string;
    description: string;
    metric: string;
    color: string;
  }[];
}

const SOLUTION_PILLARS: SolutionPillar[] = [
  {
    id: 'ai-knowledge',
    tabLabel: 'AI & Knowledge Systems',
    icon: Brain,
    tagline: 'Private Retrieval-Augmented Generation & Workflow Intelligence',
    title: 'Enterprise AI & Knowledge Search Engine',
    businessProblem:
      'Teams waste hours searching across disparate PDFs, SOPs, and internal wiki documents, often relying on outdated answers or risking proprietary data leaks with public consumer AI tools.',
    engineeringApproach:
      'We build private RAG pipelines combining hybrid lexical (BM25) and dense vector embeddings with strict source page citations, role-based access control, and zero third-party training data leakage.',
    targetServiceRoute: '/services/ai-machine-learning',
    targetServiceName: 'AI & Machine Learning',
    metrics: [
      { value: '<15s', label: 'Average Retrieval Time', detail: 'Down from 20+ min manual search' },
      { value: '100%', label: 'Source Verification', detail: 'Exact paragraph and document citations' },
      { value: '0%', label: 'Data Leakage', detail: 'Private VPC boundary; never sent to public models' },
    ],
    techStack: ['Python', 'FastAPI', 'LangChain', 'pgvector', 'Docker', 'AWS Bedrock / Azure OpenAI'],
    deliverables: [
      'Document Ingestion & OCR Preprocessing Pipeline',
      'Role-Gated Hybrid Vector Search Microservice',
      'Real-Time Citation & Hallucination Guardrails',
      'Telemetry Dashboard with Token Cost FinOps',
    ],
    architectureStages: [
      {
        step: '01',
        name: 'Secure Document Ingestion',
        protocol: 'S3 / Blob + OCR',
        description: 'Auto-extracts structured text, tables, and metadata from PDFs, contracts, and markdown.',
        metric: '500+ pgs/min',
        color: 'from-blue-600 to-cyan-500',
      },
      {
        step: '02',
        name: 'Hybrid Embedding & Index',
        protocol: 'BM25 + Dense Vectors',
        description: 'Generates chunked vector embeddings stored in encrypted pgvector partitions.',
        metric: '<45ms Latency',
        color: 'from-cyan-500 to-teal-500',
      },
      {
        step: '03',
        name: 'Guardrail & Re-ranking',
        protocol: 'Cross-Encoder + RBAC',
        description: 'Filters matches by user authorization role and re-ranks passages by relevance.',
        metric: '100% RBAC Enforced',
        color: 'from-violet-600 to-indigo-600',
      },
      {
        step: '04',
        name: 'Grounded Output Delivery',
        protocol: 'SSE Streaming + JSON',
        description: 'Streams synthesized answer with clickable source citations and confidence scores.',
        metric: '<250ms First Token',
        color: 'from-emerald-600 to-teal-600',
      },
    ],
  },
  {
    id: 'cloud-devops',
    tabLabel: 'Cloud Modernization',
    icon: Cloud,
    tagline: 'Resilient Infrastructure, Multi-AZ Failover & FinOps',
    title: 'Zero-Downtime Cloud Infrastructure & DevOps',
    businessProblem:
      'Unmanaged servers, manual deployments, and lack of automated disaster recovery cause frequent downtime, security vulnerabilities, and unpredictable monthly cloud billing spikes.',
    engineeringApproach:
      'We containerize services with Docker & Kubernetes, codify infrastructure via Terraform, establish blue-green CI/CD pipelines, and implement FinOps cost guardrails with continuous health monitoring.',
    targetServiceRoute: '/services/cloud-devops',
    targetServiceName: 'Cloud & DevOps Engineering',
    metrics: [
      { value: '99.98%', label: 'Uptime SLA Target', detail: 'Multi-AZ automated failover topologies' },
      { value: '0 min', label: 'Deployment Downtime', detail: 'Automated blue-green releases & rollbacks' },
      { value: '38%', label: 'Average FinOps Savings', detail: 'Elimination of idle compute & orphaned assets' },
    ],
    techStack: ['AWS', 'Azure', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Datadog', 'Prometheus'],
    deliverables: [
      'Infrastructure as Code (Terraform / OpenTofu)',
      'Automated Multi-Stage CI/CD Deployment Workflows',
      'Isolated VPC Networks & Least-Privilege IAM Roles',
      '24/7 Health Monitoring & PagerDuty Alert Routing',
    ],
    architectureStages: [
      {
        step: '01',
        name: 'Global Edge & WAF Ingress',
        protocol: 'CloudFront + AWS WAF',
        description: 'Shields against DDoS attacks, terminates SSL, and caches static assets globally.',
        metric: '<20ms Edge RTT',
        color: 'from-blue-600 to-cyan-500',
      },
      {
        step: '02',
        name: 'Application Load Balancer',
        protocol: 'HTTP/2 + TLS 1.3',
        description: 'Evenly distributes incoming traffic across auto-scaling container task instances.',
        metric: 'Auto-Scale 1-50x',
        color: 'from-cyan-500 to-teal-500',
      },
      {
        step: '03',
        name: 'Container Cluster (ECS/EKS)',
        protocol: 'Docker Microservices',
        description: 'Fault-tolerant application pods running across multiple availability zones.',
        metric: 'Multi-AZ Active-Active',
        color: 'from-violet-600 to-indigo-600',
      },
      {
        step: '04',
        name: 'Managed Aurora / DynamoDB',
        protocol: 'Encrypted Multi-Region',
        description: 'Automated daily snapshots, sub-millisecond read replicas, and point-in-time recovery.',
        metric: 'Zero-Data Loss RPO',
        color: 'from-emerald-600 to-teal-600',
      },
    ],
  },
  {
    id: 'custom-software',
    tabLabel: 'Full-Stack Software',
    icon: Code2,
    tagline: 'High-Scale TypeScript & Python Web Platforms',
    title: 'Custom Enterprise Software & Web Portals',
    businessProblem:
      'Rigid off-the-shelf software forces employees into clunky workarounds, while legacy monoliths are too fragile to adapt to evolving market requirements and customer demands.',
    engineeringApproach:
      'We engineer modular, strongly-typed web applications using modern React, Node.js, and Python with clean API contracts, automated unit testing, and design systems built for rapid scaling.',
    targetServiceRoute: '/services/custom-software',
    targetServiceName: 'Custom Software Development',
    metrics: [
      { value: '<1.2s', label: 'Largest Contentful Paint', detail: 'Sub-second mobile loading speeds' },
      { value: '95%+', label: 'Automated Test Coverage', detail: 'End-to-end regression safety nets' },
      { value: '100%', label: 'Type Safety', detail: 'End-to-end TypeScript types across API boundaries' },
    ],
    techStack: ['TypeScript', 'React', 'Node.js', 'Next.js', 'PostgreSQL', 'Redis', 'Tailwind CSS'],
    deliverables: [
      'Accessible, Responsive Component Design System',
      'Documented RESTful / GraphQL API Specifications',
      'Role-Based Authentication & Session Management',
      'Comprehensive Playwright & Vitest Automated Tests',
    ],
    architectureStages: [
      {
        step: '01',
        name: 'Responsive Client Application',
        protocol: 'React SPA / SSR',
        description: 'Optimized client bundle delivering instantaneous page transitions and zero layout shifts.',
        metric: '100 Mobile Perf Score',
        color: 'from-blue-600 to-cyan-500',
      },
      {
        step: '02',
        name: 'API Gateway & Rate Limiter',
        protocol: 'JSON Schema Validation',
        description: 'Strict input sanitization, JWT authorization, and adaptive token-bucket throttling.',
        metric: '<8ms Verification',
        color: 'from-cyan-500 to-teal-500',
      },
      {
        step: '03',
        name: 'Domain Service Layer',
        protocol: 'TypeScript Core Logic',
        description: 'Decoupled domain handlers executing business rules, calculations, and state transitions.',
        metric: 'Atomic Transactions',
        color: 'from-violet-600 to-indigo-600',
      },
      {
        step: '04',
        name: 'Persistent Relational Store',
        protocol: 'PostgreSQL + Connection Pool',
        description: 'Normalized database schema with automated index optimization and connection pooling.',
        metric: '<12ms Query Exec',
        color: 'from-emerald-600 to-teal-600',
      },
    ],
  },
  {
    id: 'data-analytics',
    tabLabel: 'Data & Dashboards',
    icon: BarChart3,
    tagline: 'Real-Time Telemetry & Executive KPI Intelligence',
    title: 'Custom Business Intelligence & Telemetry Dashboards',
    businessProblem:
      'Executive decisions are delayed by fragmented spreadsheets and stale monthly PDF reports that hide emerging operational bottlenecks, customer churn, and inventory risks.',
    engineeringApproach:
      'We aggregate data from multiple databases, CRMs, and payment gateways into a unified analytical store, surfacing interactive KPI drilldowns with sub-second response times.',
    targetServiceRoute: '/services/data-analytics',
    targetServiceName: 'Data Analytics & BI',
    metrics: [
      { value: 'Real-Time', label: 'Data Synchronization', detail: 'Event-driven webhooks & streaming feeds' },
      { value: '<200ms', label: 'Drilldown Query Speed', detail: 'Aggregated materialized views & columnar caching' },
      { value: '100%', label: 'Single Source of Truth', detail: 'Consolidated reporting eliminating discrepancies' },
    ],
    techStack: ['ClickHouse', 'PostgreSQL', 'Apache Kafka', 'DuckDB', 'Python', 'Recharts', 'Tailwind'],
    deliverables: [
      'Automated ETL / ELT Extraction Connectors',
      'Normalized Analytical Data Warehouse Schemas',
      'Role-Tailored Executive & Operational Dashboards',
      'Scheduled Daily Digest Reports (Email / Slack)',
    ],
    architectureStages: [
      {
        step: '01',
        name: 'Transactional Event Capture',
        protocol: 'CDC / Webhook Ingestion',
        description: 'Captures change-data events from databases, payment gateways, and CRM activity logs.',
        metric: 'Lossless Streaming',
        color: 'from-blue-600 to-cyan-500',
      },
      {
        step: '02',
        name: 'Stream Ingestion & Buffer',
        protocol: 'Kafka / Redis Stream',
        description: 'De-duplicates and buffers high-velocity operational events before batch transformation.',
        metric: '10k+ Events/sec',
        color: 'from-cyan-500 to-teal-500',
      },
      {
        step: '03',
        name: 'Analytical Data Warehouse',
        protocol: 'Columnar Materialized Views',
        description: 'Optimized analytical tables engineered for millisecond aggregation across millions of rows.',
        metric: '99% Cache Hit Ratio',
        color: 'from-violet-600 to-indigo-600',
      },
      {
        step: '04',
        name: 'Interactive Executive BI UI',
        protocol: 'Real-Time WebSockets',
        description: 'Live charts, cohort analysis, and instant CSV/PDF export with customized role filters.',
        metric: '<100ms Render Time',
        color: 'from-emerald-600 to-teal-600',
      },
    ],
  },
  {
    id: 'digital-commerce',
    tabLabel: 'Digital Commerce',
    icon: ShoppingBag,
    tagline: 'High-Conversion Storefronts & Frictionless Checkout',
    title: 'Enterprise E-Commerce Platforms & Integrations',
    businessProblem:
      'Slow mobile load speeds, rigid checkout funnels, and inventory synchronization mismatches lead to high cart abandonment rates and frustrating customer support tickets.',
    engineeringApproach:
      'We architect fast, decoupled headless storefronts and modern platforms with one-click payment flows (UPI, credit cards, digital wallets), real-time stock reservations, and ERP connectors.',
    targetServiceRoute: '/services/ecommerce',
    targetServiceName: 'E-commerce Development',
    metrics: [
      { value: '<1.5s', label: 'Average Checkout Time', detail: 'Single-step frictionless payment transitions' },
      { value: '+24%', label: 'Mobile Conversion Lift', detail: 'Driven by sub-second Core Web Vitals optimization' },
      { value: '100%', label: 'Inventory Accuracy', detail: 'Atomic multi-warehouse stock reservation locks' },
    ],
    techStack: ['Next.js', 'Shopify / WooCommerce', 'Stripe / Razorpay', 'Redis', 'PostgreSQL', 'Algolia'],
    deliverables: [
      'Mobile-First Responsive High-Speed Storefront',
      'Automated Payment Gateway & Tax Calculation Setup',
      'Real-Time Warehouse Stock & ERP Synchronizer',
      'Abandoned Cart Recovery & Order Telemetry Webhooks',
    ],
    architectureStages: [
      {
        step: '01',
        name: 'Edge-Rendered Storefront',
        protocol: 'Next.js Edge CDN',
        description: 'Instantly serves localized catalog pages, product images, and rich search filters.',
        metric: 'Sub-second Load',
        color: 'from-blue-600 to-cyan-500',
      },
      {
        step: '02',
        name: 'Atomic Cart & Stock Lock',
        protocol: 'Redis Atomic Distributed Lock',
        description: 'Reserves inventory during checkout to prevent double-booking during flash promotions.',
        metric: 'Zero Over-Sells',
        color: 'from-cyan-500 to-teal-500',
      },
      {
        step: '03',
        name: 'Payment Gateway Broker',
        protocol: 'Webhooks + Idempotency Keys',
        description: 'Direct integration with UPI, cards, and wallets with zero payment dropouts.',
        metric: '99.9% Settle Success',
        color: 'from-violet-600 to-indigo-600',
      },
      {
        step: '04',
        name: 'Automated Fulfillment Sync',
        protocol: 'REST ERP / Courier Hooks',
        description: 'Triggers instant dispatch orders, tracking SMS/emails, and accounting invoices.',
        metric: '<3s Fulfillment Handshake',
        color: 'from-emerald-600 to-teal-600',
      },
    ],
  },
];

const BLOCK_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Count-up metric display when scrolled into view
const CountUpMetric: React.FC<{
  value: string;
  prefersReducedMotion: boolean;
}> = ({ value, prefersReducedMotion }) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });
  const [displayValue, setDisplayValue] = useState<string>(value);

  useEffect(() => {
    if (prefersReducedMotion || !isInView) {
      setDisplayValue(value);
      return;
    }

    const match = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const [, prefix, numStr, suffix] = match;
    const targetNum = parseFloat(numStr);
    const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;

    if (targetNum === 0) {
      setDisplayValue(value);
      return;
    }

    const durationMs = 1100;
    const startTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = targetNum * eased;

      if (progress < 1) {
        const formatted =
          decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString();
        setDisplayValue(`${prefix}${formatted}${suffix}`);
        rafId = requestAnimationFrame(tick);
      } else {
        setDisplayValue(value);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [value, isInView, prefersReducedMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue}
    </span>
  );
};

interface EnterpriseSolutionsMatrixProps {
  onNavigate: (route: PageRoute) => void;
  onOpenProjectModal: (serviceName?: string) => void;
}

export const EnterpriseSolutionsMatrix: React.FC<EnterpriseSolutionsMatrixProps> = ({
  onNavigate,
  onOpenProjectModal,
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [activePillarIndex, setActivePillarIndex] = useState(0);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [miniRunnerIndex, setMiniRunnerIndex] = useState(0);

  const simIntervalRef = useRef<number | null>(null);

  const currentPillar = SOLUTION_PILLARS[activePillarIndex];
  const activeStage = currentPillar.architectureStages[activeStageIndex];
  const stageCount = currentPillar.architectureStages.length;

  // Clear simulation interval on unmount
  useEffect(() => {
    return () => {
      if (simIntervalRef.current !== null) {
        window.clearInterval(simIntervalRef.current);
      }
    };
  }, []);

  // Gentle running indicator on the Block 1 mini floating pipeline card
  useEffect(() => {
    if (isSimulating) {
      setMiniRunnerIndex(activeStageIndex);
      return;
    }
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setMiniRunnerIndex((prev) => (prev + 1) % stageCount);
    }, 1800);

    return () => window.clearInterval(timer);
  }, [isSimulating, activeStageIndex, stageCount, prefersReducedMotion]);

  // Simulate Execution: steps through all stages automatically (1.2s each) with progress line, stops on last stage
  const handleSimulateFlow = () => {
    if (isSimulating) return;
    if (simIntervalRef.current !== null) {
      window.clearInterval(simIntervalRef.current);
    }

    setIsSimulating(true);
    let stage = 0;
    setActiveStageIndex(0);

    simIntervalRef.current = window.setInterval(() => {
      stage += 1;
      if (stage < currentPillar.architectureStages.length) {
        setActiveStageIndex(stage);
      } else {
        if (simIntervalRef.current !== null) {
          window.clearInterval(simIntervalRef.current);
          simIntervalRef.current = null;
        }
        setIsSimulating(false);
      }
    }, 1200);
  };

  const blockVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: BLOCK_EASE,
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
      },
    },
  };

  const childVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: BLOCK_EASE,
      },
    },
  };

  // Hero chip style (reused from HeroContent.tsx)
  const heroChipClass =
    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_10px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-[#2563EB] font-['Plus_Jakarta_Sans','Inter',sans-serif] text-xs font-semibold";

  // Hero button style (reused from HeroContent.tsx)
  const heroButtonClass =
    'inline-flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 text-white font-semibold text-xs sm:text-[13px] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.28)] transition-all duration-200 active:scale-[0.98] cursor-pointer';

  const progressFillPercent =
    stageCount > 1 ? (activeStageIndex / (stageCount - 1)) * 100 : 100;

  // Reusable softer royal-navy detail card for Block 4 (shown on right column on tablet/desktop, and below active stage on mobile)
  const renderStageDetailCard = (keyPrefix: string) => (
    <div className="relative rounded-[20px] sm:rounded-[24px] bg-gradient-to-br from-[#162D5E] via-[#1C3873] to-[#1E3A8A] border border-[#60A5FA]/35 shadow-[0_20px_48px_-15px_rgba(30,58,138,0.28)] p-4 sm:p-8 text-white overflow-hidden flex flex-col justify-between min-h-0 sm:min-h-[340px]">
      {/* Soft radial cyan/blue glow matching homepage hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-20 w-72 h-72 rounded-full bg-[#38BDF8]/18 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-[#60A5FA]/20 blur-3xl"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${keyPrefix}-${currentPillar.id}-${activeStage.step}`}
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.98, y: 8 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.98, y: -8 }
          }
          transition={{ duration: 0.32, ease: BLOCK_EASE }}
          className="relative z-10 flex flex-col justify-between h-full space-y-4 sm:space-y-6"
        >
          {/* Top Row: Inspection Label + Protocol Hero Chip */}
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22D3EE] shadow-[0_0_10px_#22D3EE]" />
              <span className="font-mono text-[#22D3EE] uppercase text-[11px] sm:text-xs tracking-[0.12em] font-bold">
                Stage {activeStage.step} Inspection
              </span>
            </div>
            <span className={heroChipClass}>{activeStage.protocol}</span>
          </div>

          {/* Center: Big Stage Number + Stage Title + Highlighted Metric */}
          <div className="space-y-3.5 sm:space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center !font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-3xl font-bold text-[#22D3EE] shadow-inner shrink-0">
                  {activeStage.step}
                </div>
                <div>
                  <div className="text-[10.5px] sm:text-[11px] font-mono uppercase tracking-wider text-slate-300">
                    Active Pipeline Node
                  </div>
                  <h4 className="!font-['Outfit','Space_Grotesk',sans-serif] text-lg sm:text-2xl lg:text-[26px] font-bold tracking-[-0.015em] text-white leading-tight mt-0.5">
                    {activeStage.name}
                  </h4>
                </div>
              </div>

              {/* Large Metric Highlight Box */}
              <div className="px-3.5 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl bg-[#22D3EE]/12 border border-[#22D3EE]/35 backdrop-blur-sm self-start sm:self-auto shrink-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#22D3EE] font-semibold">
                  Verified Metric
                </div>
                <div className="!font-['Outfit','Space_Grotesk',sans-serif] text-lg sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                  {activeStage.metric}
                </div>
              </div>
            </div>

            {/* Stage Description + VPC Security Context */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
              <p className="text-[13px] sm:text-base text-slate-100 leading-relaxed font-medium">
                {activeStage.description}
              </p>
              <p className="hidden sm:block text-xs sm:text-sm text-slate-300 leading-relaxed">
                This layer operates within private VPC subnet boundaries, with zero public egress and automated latency alerting.
              </p>
            </div>
          </div>

          {/* Footer SLA & Compliance Row */}
          <div className="pt-3 sm:pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono text-slate-300">
            <span className="text-[#22D3EE] font-bold">
              Target SLA: {activeStage.metric}
            </span>
            <span className="text-emerald-400 font-semibold inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>ISO/OWASP Compliant</span>
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <section className="py-10 sm:py-24 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF] border-b border-[#DBEAFE]/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={blockVariants}
          className="max-w-3xl mx-auto text-center space-y-2.5 sm:space-y-3"
        >
          <motion.div
            variants={childVariants}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-[#2563EB] text-xs font-mono uppercase tracking-widest font-bold"
          >
            <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Enterprise Solutions Architecture</span>
          </motion.div>
          <motion.h2
            variants={childVariants}
            className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-4xl lg:text-[42px] font-bold tracking-[-0.015em] text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.12)] leading-[1.18]"
          >
            Engineered solutions. Verified business outcomes.
          </motion.h2>
          <motion.p
            variants={childVariants}
            className="text-[13.5px] sm:text-base lg:text-[17px] text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto line-clamp-2 sm:line-clamp-none"
          >
            Explore how IAMTECHNI architectures solve critical operational bottlenecks—from private AI document search to resilient multi-cloud modernization.
          </motion.p>
        </motion.div>

        {/* Interactive Domain Pillar Selector */}
        <div className="space-y-2.5">
          {/* Mobile-Only (<sm) Domain Counter & Quick Prev/Next Bar */}
          <div className="flex sm:hidden items-center justify-between gap-2 px-1">
            <div className="inline-flex items-center gap-2 min-w-0">
              <span className="px-2.5 py-1 rounded-lg bg-[#1E3A8A] text-white font-mono text-xs font-bold shrink-0">
                0{activePillarIndex + 1} / 0{SOLUTION_PILLARS.length}
              </span>
              <span className="text-xs font-semibold text-[#2563EB] truncate">
                Swipe or tap solution domains →
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (simIntervalRef.current !== null) {
                    window.clearInterval(simIntervalRef.current);
                    simIntervalRef.current = null;
                  }
                  setActivePillarIndex(
                    (activePillarIndex - 1 + SOLUTION_PILLARS.length) %
                      SOLUTION_PILLARS.length
                  );
                  setActiveStageIndex(0);
                  setIsSimulating(false);
                }}
                aria-label="Previous solution domain"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white border border-[#DBEAFE] shadow-xs flex items-center justify-center transition-colors cursor-pointer active:scale-95"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (simIntervalRef.current !== null) {
                    window.clearInterval(simIntervalRef.current);
                    simIntervalRef.current = null;
                  }
                  setActivePillarIndex(
                    (activePillarIndex + 1) % SOLUTION_PILLARS.length
                  );
                  setActiveStageIndex(0);
                  setIsSimulating(false);
                }}
                aria-label="Next solution domain"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-[#1E3A8A] hover:bg-[#2563EB] text-white border border-[#1E3A8A] shadow-xs flex items-center justify-center transition-colors cursor-pointer active:scale-95"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
            {/* Mobile-only right-edge fade indicating more scrollable tabs */}
            <div
              aria-hidden="true"
              className="sm:hidden pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#F8FAFD] via-[#F8FAFD]/85 to-transparent z-20"
            />
            <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 pr-6 sm:pr-0 no-scrollbar">
              <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
                {SOLUTION_PILLARS.map((pillar, idx) => {
                  const PillarIcon = pillar.icon;
                  const isActive = activePillarIndex === idx;

                  return (
                    <button
                      key={pillar.id}
                      type="button"
                      onClick={() => {
                        if (simIntervalRef.current !== null) {
                          window.clearInterval(simIntervalRef.current);
                          simIntervalRef.current = null;
                        }
                        setActivePillarIndex(idx);
                        setActiveStageIndex(0);
                        setIsSimulating(false);
                      }}
                      className={`flex items-center gap-2 min-h-[44px] min-w-[44px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-[#1E3A8A] text-white shadow-xs'
                          : 'text-slate-600 hover:text-[#1E3A8A] hover:bg-[#EEF4FF]/60'
                      }`}
                    >
                      <PillarIcon
                        className={`w-4 h-4 ${
                          isActive ? 'text-[#22D3EE]' : 'text-slate-500'
                        }`}
                      />
                      <span>{pillar.tabLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* BLOCK 1 – Header Card (Softer Royal Navy Gradient + Mini Pipeline)  */}
        {/* =================================================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={blockVariants}
          whileHover={prefersReducedMotion ? undefined : { y: -4 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative rounded-[22px] sm:rounded-[28px] bg-gradient-to-br from-[#162D5E] via-[#1C3873] to-[#1E3A8A] border border-[#60A5FA]/35 shadow-[0_20px_48px_-15px_rgba(30,58,138,0.26)] p-5 sm:p-10 lg:p-12 overflow-hidden"
        >
          {/* Soft radial cyan/blue glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#38BDF8]/18 blur-3xl"
          />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
            {/* Left: Eyebrow, Big Heading, Both Hero-Styled Buttons */}
            <div className="md:col-span-7 lg:col-span-7 space-y-3.5 sm:space-y-5">
              <motion.div
                variants={childVariants}
                className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono text-[#22D3EE] tracking-[0.12em] uppercase font-bold"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#22D3EE] shrink-0" />
                <span>{currentPillar.tagline}</span>
              </motion.div>

              <motion.h3
                variants={childVariants}
                className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-3xl lg:text-[38px] font-bold tracking-[-0.015em] text-white leading-[1.2] drop-shadow-[0_2px_10px_rgba(34,211,238,0.18)]"
              >
                {currentPillar.title}
              </motion.h3>

              <motion.div
                variants={childVariants}
                className="pt-1 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3"
              >
                <button
                  type="button"
                  onClick={() => onOpenProjectModal(`${currentPillar.title} Inquiry`)}
                  className={`${heroButtonClass} w-full sm:w-auto`}
                >
                  <span>Discuss Solution Architecture</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate(currentPillar.targetServiceRoute)}
                  className={`${heroButtonClass} w-full sm:w-auto border border-white/15`}
                >
                  <span>View {currentPillar.targetServiceName}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </button>
              </motion.div>
            </div>

            {/* Right: Floating White UI Card showing Mini Pipeline with Green Running Dot (Hidden on mobile <md since Block 4 below shows the interactive pipeline) */}
            <motion.div
              variants={childVariants}
              className="hidden md:flex md:col-span-5 lg:col-span-5 justify-center md:justify-end"
            >
              <div className="w-full max-w-[380px] rounded-2xl bg-white/95 backdrop-blur-md border border-[#DBEAFE] shadow-[0_20px_50px_rgba(4,11,20,0.45)] p-4 sm:p-5 text-slate-900">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#1E3A8A]">
                      Request &amp; Execution Pipeline
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-[#2563EB] bg-[#EEF4FF] px-2 py-0.5 rounded-full">
                    {stageCount} Stages
                  </span>
                </div>

                <div className="relative space-y-2">
                  {currentPillar.architectureStages.map((stg, idx) => {
                    const isRunningHere = miniRunnerIndex === idx;
                    return (
                      <button
                        key={stg.step}
                        type="button"
                        onClick={() => {
                          setActiveStageIndex(idx);
                          setMiniRunnerIndex(idx);
                          setIsSimulating(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                          isRunningHere
                            ? 'bg-[#EEF4FF]/90 border-[#DBEAFE] shadow-2xs'
                            : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-6 h-6 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center shrink-0 transition-colors ${
                              isRunningHere
                                ? 'bg-[#1E3A8A] text-white'
                                : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                          >
                            {stg.step}
                          </span>
                          <span className="text-xs font-bold text-[#1E3A8A] truncate">
                            {stg.name}
                          </span>
                        </div>

                        {/* Moving Green Running Dot */}
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          {isRunningHere ? (
                            <motion.span
                              layoutId="mini-pipeline-running-dot"
                              className="relative flex h-2.5 w-2.5"
                              transition={{
                                type: 'spring',
                                stiffness: 360,
                                damping: 28,
                              }}
                            >
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                            </motion.span>
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* =================================================================== */}
        {/* BLOCK 2 – Challenge vs Approach (2 Equal-Height Rounded Cards)      */}
        {/* =================================================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={blockVariants}
          className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3.5 sm:gap-5 lg:gap-6 items-stretch"
        >
          {/* Card 1: THE OPERATIONAL CHALLENGE */}
          <motion.div
            variants={childVariants}
            whileHover={prefersReducedMotion ? undefined : { y: -4 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="h-full rounded-[20px] sm:rounded-[24px] bg-[#FFF8E7] border border-amber-200/80 p-4 sm:p-8 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_40px_-15px_rgba(217,119,6,0.14)] transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-2 sm:space-y-3">
              <div className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.12em] text-amber-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] shrink-0" />
                <span>The Operational Challenge</span>
              </div>
              <p className="text-[13px] sm:text-base text-[#1E3A8A] font-medium leading-relaxed line-clamp-3 sm:line-clamp-none">
                {currentPillar.businessProblem}
              </p>
            </div>
          </motion.div>

          {/* Thin Arrow/Connector on Desktop/Tablet (Challenge -> Approach) */}
          <motion.div
            variants={childVariants}
            aria-hidden="true"
            className="hidden md:flex flex-col items-center justify-center px-1"
          >
            <div className="w-10 h-10 rounded-full bg-white border border-[#DBEAFE] shadow-xs flex items-center justify-center text-[#2563EB]">
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Card 2: IAMTECHNI ENGINEERING APPROACH */}
          <motion.div
            variants={childVariants}
            whileHover={prefersReducedMotion ? undefined : { y: -4 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="h-full rounded-[20px] sm:rounded-[24px] bg-[#EEF4FF] border border-[#DBEAFE] p-4 sm:p-8 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.14)] transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-2 sm:space-y-3">
              <div className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.12em] text-[#2563EB] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.5)] shrink-0" />
                <span>IAMTECHNI Engineering Approach</span>
              </div>
              <p className="text-[13px] sm:text-base text-[#1E3A8A] font-medium leading-relaxed line-clamp-3 sm:line-clamp-none">
                {currentPillar.engineeringApproach}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* =================================================================== */}
        {/* BLOCK 3 – Verified Outcome Benchmarks (Bento Grid + Deliverables)   */}
        {/* =================================================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={blockVariants}
          className="space-y-4 sm:space-y-6"
        >
          <motion.div
            variants={childVariants}
            className="flex items-center justify-between"
          >
            <div className="text-xs font-mono font-bold uppercase tracking-[0.12em] text-[#1E3A8A]">
              Verified Outcome Benchmarks
            </div>
          </motion.div>

          {/* Bento Metric Grid: 1st Card Highlighted in Hero Cyan/Teal Accent, Others White */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-5">
            {currentPillar.metrics.map((metric, mIdx) => {
              const isHighlighted = mIdx === 0;

              return (
                <motion.div
                  key={`${currentPillar.id}-metric-${mIdx}`}
                  variants={childVariants}
                  whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className={
                    isHighlighted
                      ? 'md:col-span-6 rounded-[20px] sm:rounded-[24px] bg-gradient-to-br from-[#E0F2FE] via-[#ECFEFF] to-[#EEF4FF] text-[#1E3A8A] p-4 sm:p-8 shadow-[0_14px_34px_-12px_rgba(37,99,235,0.14)] border border-[#BAE6FD] flex flex-col justify-between'
                      : 'md:col-span-3 rounded-[20px] sm:rounded-[24px] bg-white border border-slate-200/90 p-4 sm:p-7 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.06)] hover:shadow-[0_18px_36px_-12px_rgba(30,58,138,0.12)] transition-shadow flex flex-col justify-between'
                  }
                >
                  <div>
                    <div
                      className={
                        isHighlighted
                          ? "!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-5xl font-extrabold tracking-tight text-[#1E3A8A]"
                          : "!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-4xl font-extrabold tracking-tight text-[#1E3A8A]"
                      }
                    >
                      <CountUpMetric
                        value={metric.value}
                        prefersReducedMotion={prefersReducedMotion}
                      />
                    </div>
                    <div
                      className={
                        isHighlighted
                          ? 'text-xs sm:text-base font-bold text-[#1E3A8A] mt-1 sm:mt-2'
                          : 'text-xs sm:text-sm font-bold text-[#1E3A8A] mt-1 sm:mt-2'
                      }
                    >
                      {metric.label}
                    </div>
                  </div>

                  <div
                    className={
                      isHighlighted
                        ? 'text-xs sm:text-sm font-semibold text-[#2563EB] mt-1.5 sm:mt-3 leading-snug'
                        : 'text-xs text-slate-500 mt-1.5 sm:mt-3 leading-snug'
                    }
                  >
                    {metric.detail}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Deliverables & Core Toolchain Bento Strip */}
          <motion.div
            variants={childVariants}
            className="rounded-[20px] sm:rounded-[24px] bg-white border border-slate-200/90 p-4 sm:p-7 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.05)] space-y-4 sm:space-y-5"
          >
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-[0.12em] text-[#1E3A8A] mb-2.5 sm:mb-3">
                Production Deliverables Included
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                {currentPillar.deliverables.map((del, dIdx) => (
                  <div
                    key={dIdx}
                    className={`${
                      dIdx >= 2 ? 'hidden sm:flex' : 'flex'
                    } items-start gap-2 text-[13px] sm:text-sm text-slate-700 bg-[#F6F8FB] p-3 sm:p-3.5 rounded-xl border border-slate-200/80`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <span className="leading-snug font-medium">{del}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-mono font-bold text-slate-500 mr-1 uppercase">
                Core Toolchain:
              </span>
              {currentPillar.techStack.map((tech, tIdx) => (
                <span key={tIdx} className={heroChipClass}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
                  <span>{tech}</span>
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* =================================================================== */}
        {/* BLOCK 4 – Request & Execution Pipeline (40% Left List / 60% Right)  */}
        {/* =================================================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={blockVariants}
          className="rounded-[28px] bg-white border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-[0_16px_48px_-15px_rgba(15,23,42,0.07)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left (40% -> 5 cols): Label, Title, Description, Simulate Button, Vertical Stages List */}
            <motion.div
              variants={childVariants}
              className="md:col-span-5 space-y-5"
            >
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#2563EB] font-bold">
                  Interactive Production Topology
                </div>
                <h4 className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-2xl font-bold text-[#1E3A8A] tracking-tight">
                  Request &amp; Execution Pipeline
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Click any stage below to inspect the security parameters, protocols, and latency guarantees enforced in our production deployments.
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleSimulateFlow}
                  disabled={isSimulating}
                  className={`${heroButtonClass} w-full sm:w-auto disabled:opacity-80`}
                >
                  {isSimulating ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-ping" />
                      <span>Simulating Flow...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-white" />
                      <span>Simulate Execution</span>
                    </>
                  )}
                </button>
              </div>

              {/* Stages Vertical List with Animated Progress Line */}
              <div className="relative pl-3 sm:pl-4 space-y-2.5">
                {/* Vertical Track & Animated Progress Line */}
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-slate-200/90 overflow-hidden"
                >
                  <motion.div
                    className="w-full bg-gradient-to-b from-[#2563EB] to-[#22D3EE] rounded-full"
                    initial={false}
                    animate={{ height: `${progressFillPercent}%` }}
                    transition={{ duration: 0.45, ease: BLOCK_EASE }}
                  />
                </div>

                {currentPillar.architectureStages.map((stage, sIdx) => {
                  const isSelected = activeStageIndex === sIdx;

                  return (
                    <div key={stage.step} className="space-y-3">
                      <motion.div
                        whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                        onClick={() => {
                          if (simIntervalRef.current !== null) {
                            window.clearInterval(simIntervalRef.current);
                            simIntervalRef.current = null;
                          }
                          setActiveStageIndex(sIdx);
                          setIsSimulating(false);
                        }}
                        className={`p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-white border border-slate-200/90 border-l-4 border-l-[#22D3EE] shadow-[0_12px_28px_-8px_rgba(30,58,138,0.14)]'
                            : 'bg-[#F6F8FB]/70 hover:bg-[#F6F8FB] border border-transparent text-slate-700'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                                  : 'bg-white text-[#1E3A8A] border border-slate-200'
                              }`}
                            >
                              {stage.step}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-[#1E3A8A] truncate">
                              {stage.name}
                            </span>
                          </div>

                          <span className="text-[11px] font-mono font-bold text-[#0891B2] bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200/80 shrink-0">
                            {stage.metric}
                          </span>
                        </div>

                        <div className="mt-2 pl-9 flex flex-wrap items-center justify-between gap-2">
                          <span className={heroChipClass}>{stage.protocol}</span>
                        </div>

                        <p className="sr-only">{stage.description}</p>
                      </motion.div>

                      {/* Mobile Only: Dark Detail Card appears directly below the active stage */}
                      {isSelected && (
                        <div className="md:hidden pt-1">
                          {renderStageDetailCard('mobile')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right (60% -> 7 cols on Tablet/Desktop): Dark Product-Style Active Stage Detail Card */}
            <motion.div
              variants={childVariants}
              className="hidden md:block md:col-span-7 sticky top-24"
            >
              {renderStageDetailCard('desktop')}
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Direct CTA / Consultation Bar */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={blockVariants}
          className="p-6 sm:p-7 rounded-[24px] bg-gradient-to-r from-[#EEF4FF] via-[#F5F9FF] to-[#ECFEFF] border border-[#DBEAFE] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs"
        >
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-sm sm:text-base font-bold text-[#1E3A8A]">
              Need a custom architecture or technical feasibility audit?
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Our engineering team reviews your existing schemas, infrastructure, and constraints before proposing a scoped sprint plan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenProjectModal('Enterprise Architecture Feasibility Audit')}
            className={`${heroButtonClass} w-full sm:w-auto shrink-0`}
          >
            <span>Request Technical Audit</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
