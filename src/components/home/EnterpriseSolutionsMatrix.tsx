import React, { useState } from 'react';
import {
  Brain,
  Cloud,
  Code2,
  BarChart3,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Server,
  Database,
  Lock,
  Layers,
  Sparkles,
  Play,
  RotateCcw
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

interface EnterpriseSolutionsMatrixProps {
  onNavigate: (route: PageRoute) => void;
  onOpenProjectModal: (serviceName?: string) => void;
}

export const EnterpriseSolutionsMatrix: React.FC<EnterpriseSolutionsMatrixProps> = ({
  onNavigate,
  onOpenProjectModal,
}) => {
  const [activePillarIndex, setActivePillarIndex] = useState(0);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const currentPillar = SOLUTION_PILLARS[activePillarIndex];
  const activeStage = currentPillar.architectureStages[activeStageIndex];

  const handleSimulateFlow = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    let stage = 0;
    setActiveStageIndex(0);

    const interval = setInterval(() => {
      stage += 1;
      if (stage < currentPillar.architectureStages.length) {
        setActiveStageIndex(stage);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 900);
  };

  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-white via-slate-50/70 to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#1266E8] text-xs font-mono uppercase tracking-widest font-bold">
            <Layers className="w-3.5 h-3.5 text-[#1266E8]" />
            <span>Enterprise Solutions Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Engineered solutions. Verified business outcomes.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Explore how IAMTECHNI architectures solve critical operational bottlenecks—from private AI document search to resilient multi-cloud modernization.
          </p>
        </div>

        {/* Interactive Domain Pillar Selector (Horizontal Tabs on desktop, scroll on mobile) */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          <div className="flex items-center gap-2 p-1.5 bg-slate-100/90 border border-slate-200 rounded-2xl shadow-2xs">
            {SOLUTION_PILLARS.map((pillar, idx) => {
              const PillarIcon = pillar.icon;
              const isActive = activePillarIndex === idx;

              return (
                <button
                  key={pillar.id}
                  onClick={() => {
                    setActivePillarIndex(idx);
                    setActiveStageIndex(0);
                    setIsSimulating(false);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <PillarIcon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#1266E8]' : 'text-slate-500'
                    }`}
                  />
                  <span>{pillar.tabLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Solution Architecture Display Box */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          
          {/* Top Banner with Solution Summary */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-[#0e1628] to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-[#04C8E8] tracking-wider uppercase font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentPillar.tagline}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {currentPillar.title}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate(currentPillar.targetServiceRoute)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all cursor-pointer"
              >
                <span>View {currentPillar.targetServiceName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenProjectModal(`${currentPillar.title} Inquiry`)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#1266E8] to-[#5427D9] hover:opacity-95 text-white shadow-md transition-all cursor-pointer"
              >
                <span>Discuss Solution Architecture</span>
              </button>
            </div>
          </div>

          {/* Solution Body: 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            
            {/* Left Column (7 cols): Business Problem, Approach, Metrics & Deliverables */}
            <div className="lg:col-span-6 p-6 sm:p-8 space-y-6">
              
              {/* Problem vs Approach Cards */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    The Operational Challenge
                  </div>
                  <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                    {currentPillar.businessProblem}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-900 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#1266E8]" />
                    IAMTECHNI Engineering Approach
                  </div>
                  <p className="text-xs sm:text-sm text-blue-950 leading-relaxed">
                    {currentPillar.engineeringApproach}
                  </p>
                </div>
              </div>

              {/* Verified Quantitative Metrics */}
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Verified Outcome Benchmarks
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentPillar.metrics.map((metric, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                    >
                      <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight text-[#1266E8]">
                        {metric.value}
                      </div>
                      <div className="text-xs font-bold text-slate-800 mt-1">
                        {metric.label}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {metric.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tangible Deliverables List */}
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Production Deliverables Included
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentPillar.deliverables.map((del, dIdx) => (
                    <div
                      key={dIdx}
                      className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies Tagline */}
              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-mono text-slate-500 mr-1 uppercase">
                  Core Toolchain:
                </span>
                {currentPillar.techStack.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 text-[11px] font-mono bg-slate-100 text-slate-700 rounded-md border border-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column (6 cols): Interactive Architecture Execution Simulator */}
            <div className="lg:col-span-6 p-6 sm:p-8 bg-slate-50/60 flex flex-col justify-between space-y-6">
              
              <div>
                {/* Header of the Architecture Visualizer */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#1266E8] font-bold">
                      Interactive Production Topology
                    </div>
                    <div className="text-base font-bold text-slate-900">
                      Request &amp; Execution Pipeline
                    </div>
                  </div>

                  <button
                    onClick={handleSimulateFlow}
                    disabled={isSimulating}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      isSimulating
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs'
                    }`}
                  >
                    {isSimulating ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-[#1266E8] animate-ping" />
                        <span>Simulating Flow...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-[#1266E8]" />
                        <span>Simulate Execution</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                  Click any stage below to inspect the security parameters, protocols, and latency guarantees enforced in our production deployments.
                </p>

                {/* Pipeline Stages Vertical Stack */}
                <div className="space-y-3">
                  {currentPillar.architectureStages.map((stage, sIdx) => {
                    const isSelected = activeStageIndex === sIdx;

                    return (
                      <div
                        key={stage.step}
                        onClick={() => {
                          setActiveStageIndex(sIdx);
                          setIsSimulating(false);
                        }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-white border-[#1266E8] shadow-md ring-1 ring-[#1266E8]/30'
                            : 'bg-white/80 hover:bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 mb-1.5">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-6 h-6 rounded-md text-[11px] font-mono font-bold flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'bg-[#1266E8] text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {stage.step}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-slate-900">
                              {stage.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/70">
                              {stage.protocol}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-[#1266E8]">
                              {stage.metric}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 pl-8 leading-relaxed">
                          {stage.description}
                        </p>

                        {/* Visual Connector Line to next stage */}
                        {sIdx < currentPillar.architectureStages.length - 1 && (
                          <div className="absolute -bottom-3 left-7 w-0.5 h-3 bg-slate-200 pointer-events-none" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Stage Deep-Dive Card */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                  <span className="font-mono text-slate-500 uppercase text-[10px] font-bold">
                    Stage {activeStage.step} Inspection
                  </span>
                  <span className="text-[#1266E8] font-mono text-[11px] font-bold">
                    {activeStage.protocol}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  {activeStage.name}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeStage.description} This layer operates within private VPC subnet boundaries, with zero public egress and automated latency alerting.
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Target SLA: {activeStage.metric}</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> ISO/OWASP Compliant
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Direct CTA / Consultation Bar */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-slate-50 border border-blue-200/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-sm font-bold text-slate-900">
              Need a custom architecture or technical feasibility audit?
            </div>
            <p className="text-xs text-slate-600">
              Our engineering team reviews your existing schemas, infrastructure, and constraints before proposing a scoped sprint plan.
            </p>
          </div>

          <button
            onClick={() => onOpenProjectModal('Enterprise Architecture Feasibility Audit')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm cursor-pointer shrink-0"
          >
            <span>Request Technical Audit</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#04C8E8]" />
          </button>
        </div>

      </div>
    </section>
  );
};
