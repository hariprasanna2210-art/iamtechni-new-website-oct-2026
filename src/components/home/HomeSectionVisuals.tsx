import React, { useState } from 'react';
import {
  Code2,
  Cpu,
  Cloud,
  ShieldCheck,
  Zap,
  Layers,
  Activity,
  Server,
  Sparkles,
  Search,
  Database,
  Terminal,
  Workflow,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronRight,
  Globe,
  Radio,
  FileText
} from 'lucide-react';

/* ========================================================================== */
/* 1. COMPANY INTRODUCTION TECHNOLOGY ILLUSTRATION                            */
/* Connected Full-Stack Systems Architecture Diagram                           */
/* ========================================================================== */

export const CompanyIntroVisual: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'stack' | 'cloud' | 'security'>('stack');

  return (
    <div className={`w-full rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col ${className}`}>
      {/* Top Header */}
      <div className="bg-slate-900 px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-200 truncate">
            IAMTECHNI // ARCHITECTURE_TOPOLOGY
          </span>
        </div>
        <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg text-[11px] font-mono">
          <button
            onClick={() => setActiveTab('stack')}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
              activeTab === 'stack' ? 'bg-[#1266E8] text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Full-Stack
          </button>
          <button
            onClick={() => setActiveTab('cloud')}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
              activeTab === 'cloud' ? 'bg-[#1266E8] text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Multi-Cloud
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
              activeTab === 'security' ? 'bg-[#1266E8] text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Governance
          </button>
        </div>
      </div>

      {/* Main Diagram Canvas */}
      <div className="p-4 sm:p-6 bg-gradient-to-b from-[#F8FAFD] via-white to-[#F0F5FF] space-y-4">
        {activeTab === 'stack' && (
          <div className="space-y-3.5">
            {/* Layer 1: Client Frontends */}
            <div className="p-3 bg-white rounded-xl border border-blue-100 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] font-mono text-slate-500 mb-2">
                <span className="font-bold text-[#1266E8] flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 shrink-0" /> 01. Client Experience Layer
                </span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded font-semibold text-[10px]">
                  FCP &lt;0.5s
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-200/60 text-center">
                  <div className="text-xs font-bold text-slate-900">Next.js 15 App</div>
                  <div className="text-[10px] text-slate-500 font-mono">React 19 Server</div>
                </div>
                <div className="p-2 rounded-lg bg-cyan-50/60 border border-cyan-200/60 text-center">
                  <div className="text-xs font-bold text-slate-900">Mobile Native</div>
                  <div className="text-[10px] text-slate-500 font-mono">iOS &amp; Android</div>
                </div>
                <div className="p-2 rounded-lg bg-violet-50/60 border border-violet-200/60 text-center">
                  <div className="text-xs font-bold text-slate-900">Design System</div>
                  <div className="text-[10px] text-slate-500 font-mono">Tailwind &amp; WCAG</div>
                </div>
              </div>
            </div>

            {/* Connecting Track */}
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <div className="h-4 w-0.5 bg-blue-300" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-white px-2 py-0.5 rounded border border-slate-200 text-center">
                End-to-End Typed Contracts
              </span>
              <div className="h-4 w-0.5 bg-blue-300" />
            </div>

            {/* Layer 2: API & Microservices Mesh */}
            <div className="p-3 bg-white rounded-xl border border-violet-100 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] font-mono text-slate-500 mb-2">
                <span className="font-bold text-[#7C3AED] flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 shrink-0" /> 02. API Gateway &amp; Microservices
                </span>
                <span className="text-[#7C3AED] bg-violet-50 px-2 py-0.2 rounded font-semibold text-[10px]">
                  12k req/s
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2 rounded-lg bg-purple-50/60 border border-purple-200/60 text-center">
                  <div className="text-xs font-bold text-slate-900">Node / Python</div>
                  <div className="text-[10px] text-slate-500 font-mono">Async Microservices</div>
                </div>
                <div className="p-2 rounded-lg bg-indigo-50/60 border border-indigo-200/60 text-center">
                  <div className="text-xs font-bold text-slate-900">Event Mesh</div>
                  <div className="text-[10px] text-slate-500 font-mono">Kafka &amp; Redis PubSub</div>
                </div>
                <div className="p-2 rounded-lg bg-teal-50/60 border border-teal-200/60 text-center">
                  <div className="text-xs font-bold text-slate-900">Private RAG</div>
                  <div className="text-[10px] text-slate-500 font-mono">pgvector &amp; Embeddings</div>
                </div>
              </div>
            </div>

            {/* Connecting Track */}
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <div className="h-4 w-0.5 bg-teal-300" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-white px-2 py-0.5 rounded border border-slate-200 text-center">
                Containerized CI/CD Deployment
              </span>
              <div className="h-4 w-0.5 bg-teal-300" />
            </div>

            {/* Layer 3: Cloud Infrastructure */}
            <div className="p-3 bg-white rounded-xl border border-teal-100 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] font-mono text-slate-500 mb-2">
                <span className="font-bold text-[#0D9488] flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 shrink-0" /> 03. Multi-Cloud &amp; Resilient Storage
                </span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded font-semibold text-[10px]">
                  99.99% SLA
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2 rounded-lg bg-teal-50/60 border border-teal-200/60 text-center">
                  <div className="text-xs font-bold text-slate-900">AWS / Azure</div>
                  <div className="text-[10px] text-slate-500 font-mono">Multi-Region ECS/EKS</div>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-200/60 text-center">
                  <div className="text-xs font-bold text-slate-900">PostgreSQL</div>
                  <div className="text-[10px] text-slate-500 font-mono">Point-in-Time Backup</div>
                </div>
                <div className="p-2 rounded-lg bg-cyan-50/60 border border-cyan-200/60 text-center">
                  <div className="text-xs font-bold text-slate-900">Edge CDN</div>
                  <div className="text-[10px] text-slate-500 font-mono">Global TLS 1.3</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cloud' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Cloud className="w-4 h-4 text-[#1266E8]" /> AWS Cloud Cluster
                </div>
                <p className="text-[11px] text-slate-600">
                  Containerized ECS, Aurora Serverless, and CloudFront edge routing configured via Terraform.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-emerald-600 font-bold">
                  <span>HEALTH: NORMAL</span>
                  <span>LATENCY: 28ms</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Server className="w-4 h-4 text-[#04C8E8]" /> Azure Cloud Cluster
                </div>
                <p className="text-[11px] text-slate-600">
                  Azure App Service, Cosmos DB, and Entra ID enterprise single sign-on integration.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-emerald-600 font-bold">
                  <span>HEALTH: NORMAL</span>
                  <span>LATENCY: 32ms</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl text-white font-mono text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">Automated FinOps Governor</span>
              </div>
              <span className="text-emerald-400 font-bold">Zero Runaway Bills</span>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">OWASP Top 10 Defensive Hardening</div>
                  <div className="text-[10px] text-slate-500 font-mono">SQLi, XSS, CSRF, &amp; IDOR Shields</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                PASSED
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-2xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1266E8] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Full Codebase &amp; IP Ownership</div>
                  <div className="text-[10px] text-slate-500 font-mono">100% Client-Owned Repositories</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold">
                UNCONDITIONAL
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-violet-200 shadow-2xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-50 text-[#7C3AED] flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Continuous Snyk &amp; Dependabot Scan</div>
                  <div className="text-[10px] text-slate-500 font-mono">0 Critical Vulnerabilities</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-bold">
                AUDITED
              </span>
            </div>
          </div>
        )}

        {/* Live Footprint */}
        <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            Active Microservices Mesh
          </span>
          <span className="text-[#1266E8] font-bold">IAMTECHNI QUALITY GATE</span>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* 2. AI NEURAL RAG PIPELINE VISUAL (Dark Mode Section)                       */
/* ========================================================================== */

export const AiNeuralPipelineVisual: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full rounded-2xl bg-[#0F172A] border border-slate-800 shadow-2xl p-4 sm:p-6 text-white font-mono flex flex-col justify-between ${className}`}>
      {/* Top Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#04C8E8] animate-pulse shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold text-slate-200 truncate">PRIVATE_RAG_INFERENCE_PIPELINE</span>
        </div>
        <span className="text-[10px] text-[#04C8E8] bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 font-bold">
          Zero Leakage
        </span>
      </div>

      {/* Pipeline Steps */}
      <div className="space-y-3 my-4">
        {/* Step 1: Query Ingest */}
        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-cyan-500/20 text-[#04C8E8] flex items-center justify-center text-[10px] font-bold shrink-0">
              01
            </div>
            <div>
              <div className="text-slate-200 font-bold text-[11px]">Enterprise Query Embedding</div>
              <div className="text-[10px] text-slate-400">text-embedding-3 · 1536 dims</div>
            </div>
          </div>
          <span className="text-cyan-400 text-[10px] font-bold">&lt;18ms</span>
        </div>

        {/* Step 2: Vector Search */}
        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-blue-500/20 text-[#1266E8] flex items-center justify-center text-[10px] font-bold shrink-0">
              02
            </div>
            <div>
              <div className="text-slate-200 font-bold text-[11px]">Cosine Distance Retrieval</div>
              <div className="text-[10px] text-slate-400">pgvector · HNSW Index Matching</div>
            </div>
          </div>
          <span className="text-emerald-400 text-[10px] font-bold">0.94 Similarity</span>
        </div>

        {/* Step 3: Verified Citation */}
        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-purple-500/20 text-[#5427D9] flex items-center justify-center text-[10px] font-bold shrink-0">
              03
            </div>
            <div>
              <div className="text-slate-200 font-bold text-[11px]">Guardrailed Response Synthesizer</div>
              <div className="text-[10px] text-slate-400">Verifiable Page &amp; Doc Citations</div>
            </div>
          </div>
          <span className="text-purple-400 text-[10px] font-bold">100% Traceable</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs pt-3 border-t border-slate-800">
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-850">
          <div className="text-[9px] text-slate-400 truncate">Prompt Cache</div>
          <div className="text-xs sm:text-sm font-bold text-emerald-400">92% Hit</div>
        </div>
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-850">
          <div className="text-[9px] text-slate-400 truncate">P95 Latency</div>
          <div className="text-xs sm:text-sm font-bold text-cyan-400">340ms</div>
        </div>
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-850">
          <div className="text-[9px] text-slate-400 truncate">Hallucination</div>
          <div className="text-xs sm:text-sm font-bold text-purple-400">0.00%</div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* 3. CTA TERMINAL VISUAL (Collaborative Engineering Terminal)                */
/* ========================================================================== */

export const CtaTerminalVisual: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full max-w-2xl mx-auto rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 text-left font-mono text-xs shadow-2xl backdrop-blur-md ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 text-[11px]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-slate-200 font-bold truncate">IAMTECHNI // ENGINEERING_ENGAGEMENT</span>
        </div>
        <span className="text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
          1 Business Day SLA
        </span>
      </div>

      <div className="py-3.5 space-y-2 text-[11px] text-slate-300">
        <div className="text-slate-400">// Direct collaboration with senior software architects</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <div className="p-2 rounded bg-slate-950 border border-slate-800 text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Mutual NDA Executed</span>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800 text-cyan-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Phased Sprints</span>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800 text-purple-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Full IP Ownership</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
        <span>STATUS: ACCEPTING NEW PROJECTS</span>
        <span className="text-cyan-400 font-bold">READY TO ARCHITECT</span>
      </div>
    </div>
  );
};
