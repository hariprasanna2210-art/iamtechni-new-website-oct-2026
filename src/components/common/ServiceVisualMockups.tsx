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
  ShoppingBag,
  TrendingUp,
  Smartphone,
  Globe,
  Database,
  Terminal,
  Workflow,
  Search,
  CheckCircle2,
  Lock,
  BarChart3,
  Bot,
  Laptop,
  Check,
  ExternalLink,
  ChevronRight,
  Monitor,
  Flame,
  FileText,
  Clock,
  Eye
} from 'lucide-react';

/* ========================================================================== */
/* 1. WEB DEVELOPMENT BROWSER MOCKUP                                          */
/* ========================================================================== */

export const WebServiceMockup: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [activeView, setActiveView] = useState<'desktop' | 'mobile' | 'code'>('desktop');

  return (
    <div className={`w-full rounded-2xl bg-white border border-slate-200 shadow-md overflow-hidden flex flex-col ${className}`}>
      {/* Browser Window Chrome */}
      <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between text-xs border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/90" />
          <span className="w-3 h-3 rounded-full bg-amber-500/90" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/90" />
          <div className="ml-3 hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-md text-slate-300 font-mono text-[11px] w-64 truncate">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-slate-400">https://</span>iamtechni.client.app
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-0.5 rounded-lg text-[11px] font-mono">
          <button
            onClick={() => setActiveView('desktop')}
            className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
              activeView === 'desktop' ? 'bg-[#1266E8] text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Desktop
          </button>
          <button
            onClick={() => setActiveView('mobile')}
            className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
              activeView === 'mobile' ? 'bg-[#1266E8] text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mobile
          </button>
          <button
            onClick={() => setActiveView('code')}
            className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
              activeView === 'code' ? 'bg-[#1266E8] text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            JSX
          </button>
        </div>
      </div>

      {/* Screen Body */}
      {activeView === 'desktop' && (
        <div className="p-5 sm:p-6 bg-gradient-to-b from-[#F8FAFD] to-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#1266E8] text-white flex items-center justify-center font-bold text-xs">
                IT
              </div>
              <span className="font-bold text-slate-900 text-xs">Modern Web Platform</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Lighthouse: 100/100
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-[10px] font-mono text-slate-500">First Contentful Paint</div>
              <div className="text-base font-extrabold text-[#1266E8]">0.45s</div>
              <div className="text-[9px] text-emerald-600 font-medium">Optimal Band</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-[10px] font-mono text-slate-500">Cumulative Layout Shift</div>
              <div className="text-base font-extrabold text-emerald-600">0.000</div>
              <div className="text-[9px] text-slate-500">Zero Shifting</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-[10px] font-mono text-slate-500">Accessibility Rating</div>
              <div className="text-base font-extrabold text-[#7C3AED]">WCAG AA</div>
              <div className="text-[9px] text-slate-500">Full Compliance</div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900 rounded-xl text-slate-300 font-mono text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">Next.js 15</span>
              <span className="text-slate-500">·</span>
              <span className="text-emerald-400">React 19</span>
              <span className="text-slate-500">·</span>
              <span className="text-amber-300">Tailwind CSS</span>
            </div>
            <span className="text-slate-400 text-[10px]">SSR + Static Edge</span>
          </div>
        </div>
      )}

      {activeView === 'mobile' && (
        <div className="p-6 bg-[#F8FAFD] flex justify-center">
          <div className="w-56 bg-slate-900 rounded-3xl p-3 border-2 border-slate-700 shadow-lg text-white space-y-3">
            <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto" />
            <div className="p-2.5 bg-slate-800/80 rounded-xl space-y-1.5">
              <div className="h-2 w-16 bg-[#1266E8] rounded" />
              <div className="h-2 w-28 bg-slate-600 rounded" />
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-center text-[10px] font-mono">
              <div className="p-2 bg-slate-800/60 rounded-lg">Touch OK</div>
              <div className="p-2 bg-slate-800/60 rounded-lg">48px Targets</div>
            </div>
            <div className="h-7 rounded-lg bg-[#1266E8] flex items-center justify-center text-[10px] font-bold">
              Instant PWA Launch
            </div>
          </div>
        </div>
      )}

      {activeView === 'code' && (
        <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto space-y-1">
          <div className="text-slate-500">// Modern decoupled Next.js component</div>
          <div>
            <span className="text-purple-400">export default async function</span>{' '}
            <span className="text-amber-300">Page</span>() &#123;
          </div>
          <div className="pl-4">
            <span className="text-blue-400">const</span> data ={' '}
            <span className="text-purple-400">await</span>{' '}
            <span className="text-cyan-300">fetchCorporatePayload</span>();
          </div>
          <div className="pl-4">
            <span className="text-purple-400">return</span> &lt;<span className="text-emerald-400">EnterpriseShell</span> data=&#123;data&#125; /&gt;;
          </div>
          <div>&#125;</div>
        </div>
      )}
    </div>
  );
};

/* ========================================================================== */
/* 2. E-COMMERCE STOREFRONT & CHECKOUT MOCKUP                                 */
/* ========================================================================== */

export const EcommerceServiceMockup: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full rounded-2xl bg-white border border-slate-200 shadow-md p-5 sm:p-6 space-y-4 ${className}`}>
      {/* Top Bar with Cart Status */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Headless Commerce Engine</div>
            <div className="text-[10px] font-mono text-slate-500">Global Edge Inventory Sync</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-emerald-700">Sub-second P95</div>
          <div className="text-[10px] font-mono text-slate-500">Stripe &amp; Razorpay</div>
        </div>
      </div>

      {/* Simulated Product & Tiered Cart */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">Enterprise Tier A</span>
            <span className="font-mono text-amber-700 font-bold">₹12,499</span>
          </div>
          <div className="text-[11px] text-slate-600">Dynamic wholesale price book computed in 12ms.</div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Warehouse Stock: 4,200 units reserved</span>
          </div>
        </div>

        <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">One-Click Checkout</span>
            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">Live</span>
          </div>
          <div className="text-[11px] text-slate-600">Zero-redirect UPI, Net Banking, and Card checkout.</div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-700">
            <Zap className="w-3 h-3 text-[#1266E8]" />
            <span>Conversion Lift: +34.2%</span>
          </div>
        </div>
      </div>

      {/* Live Metrics Row */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center font-mono">
        <div className="p-2 bg-slate-50 rounded-lg">
          <div className="text-[10px] text-slate-500">Latency</div>
          <div className="text-xs font-bold text-slate-900">180ms</div>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          <div className="text-[10px] text-slate-500">Peak Load</div>
          <div className="text-xs font-bold text-[#1266E8]">45k QPS</div>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          <div className="text-[10px] text-slate-500">Sync State</div>
          <div className="text-xs font-bold text-emerald-600">100% ACID</div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* 3. CUSTOM SOFTWARE & ENTERPRISE WORKFLOW MOCKUP                            */
/* ========================================================================== */

export const CustomSoftwareMockup: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full rounded-2xl bg-white border border-slate-200 shadow-md p-5 sm:p-6 space-y-4 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1266E8] flex items-center justify-center">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Enterprise Core Application</div>
            <div className="text-[10px] font-mono text-slate-500">Multi-Tenant RBAC &amp; Audit Logs</div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#1266E8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold">
          SOC 2 Ready
        </span>
      </div>

      {/* Workflow Stages */}
      <div className="space-y-2">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-800">Automated Order Orchestration</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-600 font-bold">Running (P99 82ms)</span>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-semibold text-slate-800">ERP &amp; SAP Data Pipeline</span>
          </div>
          <span className="font-mono text-[11px] text-blue-600 font-bold">Synced (Zero Drift)</span>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="font-semibold text-slate-800">Compliance &amp; Digital Signature Vault</span>
          </div>
          <span className="font-mono text-[11px] text-purple-600 font-bold">256-bit Encrypted</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>MICROSERVICES ARCHITECTURE</span>
        <span className="text-[#1266E8] font-bold">99.99% SERVICE LEVEL</span>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* 4. MOBILE APP SMARTPHONE MOCKUP                                            */
/* ========================================================================== */

export const MobileAppMockup: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] text-white p-6 shadow-md border border-slate-800 ${className}`}>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Smartphone Frame */}
        <div className="w-48 bg-slate-950 rounded-[32px] p-3 border-4 border-slate-800 shadow-2xl shrink-0 space-y-3">
          <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto" />
          <div className="p-3 bg-gradient-to-br from-[#1266E8] to-[#04C8E8] rounded-2xl text-white space-y-1 shadow-inner">
            <div className="text-[9px] font-mono uppercase tracking-wider text-blue-100">Native Balance</div>
            <div className="text-sm font-bold">₹8,42,500.00</div>
          </div>
          <div className="space-y-1.5">
            <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 text-[10px] flex items-center justify-between">
              <span className="text-slate-300">Biometric Auth</span>
              <span className="text-emerald-400 font-bold">FaceID</span>
            </div>
            <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 text-[10px] flex items-center justify-between">
              <span className="text-slate-300">Offline SQLite</span>
              <span className="text-cyan-400 font-bold">Synced</span>
            </div>
          </div>
          <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto pt-1" />
        </div>

        {/* Supporting Specs */}
        <div className="space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-blue-500/10 border border-blue-400/30 rounded-lg text-xs font-mono text-[#04C8E8]">
            <Smartphone className="w-3.5 h-3.5" />
            <span>React Native &amp; Flutter</span>
          </div>
          <h4 className="text-base font-bold text-white">Cross-Platform Native Fidelity</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Shared business logic with 60 FPS animations, push notification lifecycles, and direct secure enclave hardware integration.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 text-slate-300">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>iOS App Store</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Play</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* 5. AI & MACHINE LEARNING NEURAL TOPOLOGY MOCKUP                            */
/* ========================================================================== */

export const AiMlServiceMockup: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full rounded-2xl bg-[#0B1120] border border-slate-800 text-white p-5 sm:p-6 shadow-md space-y-4 font-mono ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Neural Inference Engine</div>
            <div className="text-[10px] text-slate-400">Transformer Weights &amp; Embeddings</div>
          </div>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
          98.9% Accuracy
        </span>
      </div>

      {/* Layer Architecture */}
      <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400">Embedding Dim</div>
          <div className="text-sm font-bold text-cyan-400">1,536</div>
          <div className="text-[9px] text-slate-500">Dense Vector</div>
        </div>
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400">Inference P95</div>
          <div className="text-sm font-bold text-purple-400">18ms</div>
          <div className="text-[9px] text-slate-500">TensorRT Optimized</div>
        </div>
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400">Throughput</div>
          <div className="text-sm font-bold text-emerald-400">2.4k tps</div>
          <div className="text-[9px] text-slate-500">GPU Auto-Scale</div>
        </div>
      </div>

      {/* Code / Pipeline Snapshot */}
      <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-[11px] text-slate-300 space-y-1">
        <div className="text-slate-500">// Real-time predictive anomaly classification</div>
        <div>
          model.<span className="text-purple-400">predict</span>(stream_payload) <span className="text-slate-500">→</span>{' '}
          <span className="text-emerald-400">&#123; class: "NOMINAL", conf: 0.994 &#125;</span>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* 6. GENERATIVE AI & RAG CITATION ASSISTANT MOCKUP                           */
/* ========================================================================== */

export const GenerativeAiMockup: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full rounded-2xl bg-white border border-slate-200 shadow-md p-5 sm:p-6 space-y-3.5 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Enterprise RAG Knowledge Assistant</div>
            <div className="text-[10px] font-mono text-purple-700">Grounded with Verifiable Citations</div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-bold">
          Zero Hallucination
        </span>
      </div>

      {/* Query & Answer Bubble */}
      <div className="space-y-2 text-xs">
        <div className="p-2.5 bg-slate-100 rounded-xl text-slate-800 font-medium">
          <span className="font-bold text-slate-900">User: </span>
          What are the safety shutdown steps in Section 4.2 of SOP-2026?
        </div>
        <div className="p-3 bg-purple-50/70 border border-purple-200/90 rounded-xl space-y-2 text-slate-800">
          <div className="flex items-center gap-1.5 text-purple-700 font-bold font-mono text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Grounded Response:</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Per SOP-2026 revision 4: Isolate secondary feed valves, verify pressure under 14 PSI, and engage mechanical lockouts prior to electrical breaker disengagement.
          </p>
          <div className="p-2 bg-white rounded-lg border border-purple-100 text-[10px] font-mono flex items-center justify-between text-purple-900">
            <span>Source: SOP-2026_Rev4.pdf (Page 18, ¶3)</span>
            <span className="text-emerald-600 font-bold">100% Match</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* 7. CLOUD COMPUTING & DEVOPS PIPELINE MOCKUPS                               */
/* ========================================================================== */

export const CloudServiceMockup: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full rounded-2xl bg-white border border-slate-200 shadow-md p-5 sm:p-6 space-y-4 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
            <Cloud className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Multi-Cloud Distributed Mesh</div>
            <div className="text-[10px] font-mono text-cyan-700">AWS &amp; Microsoft Azure Topologies</div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
          Multi-AZ Active
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs font-mono">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-[10px] text-slate-500">VPC Peering</div>
          <div className="text-sm font-bold text-cyan-700">&lt;2ms</div>
          <div className="text-[9px] text-slate-400">Inter-Region</div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-[10px] text-slate-500">Auto-Scaling</div>
          <div className="text-sm font-bold text-emerald-600">3-30 Pods</div>
          <div className="text-[9px] text-slate-400">Target CPU 70%</div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-[10px] text-slate-500">Database</div>
          <div className="text-sm font-bold text-[#1266E8]">Postgres HA</div>
          <div className="text-[9px] text-slate-400">Replica Sync</div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-[10px] text-slate-500">FinOps Lift</div>
          <div className="text-sm font-bold text-purple-700">-32% Cost</div>
          <div className="text-[9px] text-slate-400">Right-Sized</div>
        </div>
      </div>

      <div className="p-3 bg-cyan-50/50 rounded-xl border border-cyan-200/70 text-xs text-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-600" />
          <span className="font-medium">Infrastructure as Code: Terraform &amp; OpenTofu</span>
        </div>
        <span className="text-[11px] font-mono text-cyan-800 font-bold">100% Declarative</span>
      </div>
    </div>
  );
};

export const DevOpsServiceMockup: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full rounded-2xl bg-slate-900 border border-slate-800 text-white p-5 sm:p-6 shadow-md space-y-4 font-mono ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Automated CI/CD Pipeline</div>
            <div className="text-[10px] text-slate-400">GitOps &amp; Zero-Downtime Rollout</div>
          </div>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
          Pipeline: Passing (2m 14s)
        </span>
      </div>

      {/* CI/CD Stages */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700">
          <div className="text-[10px] text-slate-400">1. Lint &amp; Test</div>
          <div className="text-emerald-400 font-bold">✓ 214 tests</div>
        </div>
        <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700">
          <div className="text-[10px] text-slate-400">2. Docker Build</div>
          <div className="text-cyan-400 font-bold">✓ 42 MB image</div>
        </div>
        <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700">
          <div className="text-[10px] text-slate-400">3. Trivy Security</div>
          <div className="text-emerald-400 font-bold">✓ 0 CVEs</div>
        </div>
        <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700">
          <div className="text-[10px] text-slate-400">4. K8s Deploy</div>
          <div className="text-purple-400 font-bold">✓ Rolling (0 downtime)</div>
        </div>
      </div>

      <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>ArgoCD · Kubernetes 1.32 · Harbor Registry</span>
        <span className="text-emerald-400 font-bold">Sync: Healthy</span>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* 8. DATA ANALYTICS & CYBERSECURITY MOCKUPS                                  */
/* ========================================================================== */

export const AnalyticsServiceMockup: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full rounded-2xl bg-white border border-slate-200 shadow-md p-5 sm:p-6 space-y-4 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Real-Time Telemetry &amp; BI</div>
            <div className="text-[10px] font-mono text-teal-700">ClickHouse &amp; Apache Superset</div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-bold">
          Live Streaming
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-200">
          <div className="text-[10px] font-mono text-slate-500">Query Speed</div>
          <div className="text-base font-extrabold text-teal-850">14ms</div>
          <div className="text-[9px] text-emerald-600 font-medium">10M records</div>
        </div>
        <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200">
          <div className="text-[10px] font-mono text-slate-500">Event Ingest</div>
          <div className="text-base font-extrabold text-[#1266E8]">120k/s</div>
          <div className="text-[9px] text-blue-600 font-medium">Kafka Cluster</div>
        </div>
        <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200">
          <div className="text-[10px] font-mono text-slate-500">Data Freshness</div>
          <div className="text-base font-extrabold text-purple-700">&lt;1.0s</div>
          <div className="text-[9px] text-purple-600 font-medium">Zero Lag</div>
        </div>
      </div>
    </div>
  );
};

export const CybersecurityMockup: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full rounded-2xl bg-[#0e1628] border border-slate-800 text-white p-5 sm:p-6 shadow-md space-y-4 font-mono ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">SOC &amp; Zero-Trust Firewall</div>
            <div className="text-[10px] text-slate-400">Continuous Mutual TLS &amp; WAF</div>
          </div>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
          Status: Shield Active
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-200">OWASP Top 10 Mitigation Engine</span>
          </div>
          <span className="text-emerald-400 font-bold">14,280 Blocked</span>
        </div>
        <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-slate-200">mTLS Handshake &amp; Hardware HSM</span>
          </div>
          <span className="text-cyan-400 font-bold">AES-256 Validated</span>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* 9. UI/UX DESIGN & DIGITAL MARKETING MOCKUPS                                */
/* ========================================================================== */

export const UiUxDesignMockup: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full rounded-2xl bg-white border border-slate-200 shadow-md p-5 sm:p-6 space-y-4 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Design System &amp; Component Kit</div>
            <div className="text-[10px] font-mono text-slate-500">WCAG AA &amp; Fluid Typography</div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200 font-bold">
          Figma Token Sync
        </span>
      </div>

      {/* Palette Tokens */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#1266E8] shadow-2xs" title="Cobalt Primary" />
          <div className="w-6 h-6 rounded-lg bg-[#04C8E8] shadow-2xs" title="Cyan Accent" />
          <div className="w-6 h-6 rounded-lg bg-[#5427D9] shadow-2xs" title="Violet Deep" />
          <div className="w-6 h-6 rounded-lg bg-[#0D9488] shadow-2xs" title="Teal Metric" />
          <div className="w-6 h-6 rounded-lg bg-slate-900 shadow-2xs" title="Slate 900" />
        </div>
        <span className="text-[11px] font-mono text-slate-600">80+ Tokenized UI Atoms</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center text-xs">
        <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="text-[10px] font-mono text-slate-500">Usability Score</div>
          <div className="text-sm font-bold text-emerald-600">94 / 100</div>
        </div>
        <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="text-[10px] font-mono text-slate-500">Developer Handoff</div>
          <div className="text-sm font-bold text-[#1266E8]">100% Typed</div>
        </div>
      </div>
    </div>
  );
};

export const MarketingSeoMockup: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full rounded-2xl bg-white border border-slate-200 shadow-md p-5 sm:p-6 space-y-4 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Technical SEO &amp; Growth Engine</div>
            <div className="text-[10px] font-mono text-slate-500">Semantic Schema &amp; Organic Rankings</div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
          Top 3 SERP
        </span>
      </div>

      {/* Simulated Google SERP Card */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
        <div className="text-[11px] text-slate-600 flex items-center gap-1.5 font-mono">
          <span className="text-emerald-700">https://iamtechni.in</span>
          <span>›</span>
          <span>enterprise-engineering</span>
        </div>
        <div className="text-xs font-bold text-[#1266E8] hover:underline cursor-pointer">
          Enterprise Software Architecture &amp; Cloud Transformation | IAMTECHNI
        </div>
        <div className="text-[11px] text-slate-600 leading-relaxed">
          High-performance web, custom software, and multi-cloud engineering for growth-focused organizations.
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
        <div className="p-2 bg-slate-50 rounded-lg">
          <div className="text-[10px] text-slate-500">Organic CTR</div>
          <div className="text-xs font-bold text-emerald-600">+48.2%</div>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          <div className="text-[10px] text-slate-500">Index Speed</div>
          <div className="text-xs font-bold text-slate-900">&lt;6 hrs</div>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          <div className="text-[10px] text-slate-500">Core Vitals</div>
          <div className="text-xs font-bold text-[#1266E8]">100% Pass</div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* 10. ROBOTICS & EMERGING TECH MOCKUP                                        */
/* ========================================================================== */

export const RoboticsServiceMockup: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full rounded-2xl bg-slate-950 border border-slate-800 text-white p-5 sm:p-6 shadow-md space-y-4 font-mono ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">ROS 2 Kinematics &amp; Edge Telemetry</div>
            <div className="text-[10px] text-slate-400">Micro-ROS &amp; Real-time RTOS Gateways</div>
          </div>
        </div>
        <span className="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
          Jitter: &lt;0.4ms
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400">6-Axis Sync</div>
          <div className="text-sm font-bold text-cyan-400">1,000 Hz</div>
        </div>
        <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400">Obstacle Avoidance</div>
          <div className="text-sm font-bold text-emerald-400">LiDAR 3D</div>
        </div>
        <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400">Fail-Safe</div>
          <div className="text-sm font-bold text-rose-400">E-STOP Active</div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* 11. GENERAL SERVICE VISUAL DISPATCHER                                      */
/* ========================================================================== */

export const ServiceVisualDispatcher: React.FC<{ slug?: string; category?: string; className?: string }> = ({
  slug = '',
  className = ''
}) => {
  const s = slug.toLowerCase();

  if (s.includes('web') || s.includes('website')) {
    return <WebServiceMockup className={className} />;
  }
  if (s.includes('e-com') || s.includes('ecommerce')) {
    return <EcommerceServiceMockup className={className} />;
  }
  if (s.includes('custom') || s.includes('software')) {
    return <CustomSoftwareMockup className={className} />;
  }
  if (s.includes('mobile') || s.includes('app')) {
    return <MobileAppMockup className={className} />;
  }
  if (s.includes('ai-') || s.includes('machine-learning') || s.includes('ml')) {
    return <AiMlServiceMockup className={className} />;
  }
  if (s.includes('gen') || s.includes('generative')) {
    return <GenerativeAiMockup className={className} />;
  }
  if (s.includes('cloud') || s.includes('migration')) {
    return <CloudServiceMockup className={className} />;
  }
  if (s.includes('devops')) {
    return <DevOpsServiceMockup className={className} />;
  }
  if (s.includes('analytics') || s.includes('data')) {
    return <AnalyticsServiceMockup className={className} />;
  }
  if (s.includes('cyber') || s.includes('security')) {
    return <CybersecurityMockup className={className} />;
  }
  if (s.includes('ui') || s.includes('ux') || s.includes('design')) {
    return <UiUxDesignMockup className={className} />;
  }
  if (s.includes('seo') || s.includes('market') || s.includes('social')) {
    return <MarketingSeoMockup className={className} />;
  }
  if (s.includes('robot') || s.includes('emerging')) {
    return <RoboticsServiceMockup className={className} />;
  }

  // Fallback
  return <WebServiceMockup className={className} />;
};

/* ========================================================================== */
/* 11.5 SERVICE CARD THUMBNAIL (For Directory & Overview Cards)               */
/* ========================================================================== */

export const ServiceCardThumbnail: React.FC<{ slug?: string; category?: string; className?: string }> = ({
  slug = '',
  category = '',
  className = ''
}) => {
  const s = slug.toLowerCase();

  // 1. Web Development
  if (s.includes('web') || s.includes('website')) {
    return (
      <div className={`relative w-full aspect-[16/8] bg-gradient-to-br from-[#1266E8]/10 via-white to-blue-50/50 rounded-xl border border-blue-200/80 p-3 overflow-hidden shadow-2xs flex flex-col justify-between ${className}`}>
        <div className="flex items-center justify-between border-b border-blue-100 pb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-mono text-slate-400 ml-1.5 truncate max-w-[140px]">https://app.iamtechni.in</span>
          </div>
          <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-bold shrink-0">
            100 FCP
          </span>
        </div>
        <div className="flex items-center justify-between my-auto">
          <div className="space-y-0.5">
            <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-[#1266E8]" /> Next.js 15 App Router
            </div>
            <div className="text-[9px] font-mono text-slate-500">React 19 Server Components</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-extrabold text-[#1266E8]">0.45s</div>
            <div className="text-[9px] text-emerald-600 font-medium">Core Web Vitals</div>
          </div>
        </div>
        <div className="pt-1 border-t border-blue-100 flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span>TAILWIND 4 · TYPESCRIPT</span>
          <span className="text-[#1266E8] font-bold">PRODUCTION READY</span>
        </div>
      </div>
    );
  }

  // 2. E-Commerce
  if (s.includes('e-com') || s.includes('ecommerce') || s.includes('store')) {
    return (
      <div className={`relative w-full aspect-[16/8] bg-gradient-to-br from-amber-500/10 via-white to-orange-50/50 rounded-xl border border-amber-200/80 p-3 overflow-hidden shadow-2xs flex flex-col justify-between ${className}`}>
        <div className="flex items-center justify-between border-b border-amber-100 pb-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-900">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-600" /> Headless Storefront
          </div>
          <span className="text-[9px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 font-bold shrink-0">
            P99 &lt;180ms
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 my-auto text-center font-mono">
          <div className="p-1 rounded bg-amber-50/80 border border-amber-100">
            <div className="text-[8px] text-slate-400">Edge Cart</div>
            <div className="text-xs font-bold text-slate-800">&lt;25ms</div>
          </div>
          <div className="p-1 rounded bg-amber-50/80 border border-amber-100">
            <div className="text-[8px] text-slate-400">Conversion</div>
            <div className="text-xs font-bold text-emerald-600">+34%</div>
          </div>
          <div className="p-1 rounded bg-amber-50/80 border border-amber-100">
            <div className="text-[8px] text-slate-400">Checkout</div>
            <div className="text-xs font-bold text-amber-700">1-Click</div>
          </div>
        </div>
        <div className="pt-1 border-t border-amber-100 flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span>STRIPE · SHOPIFY PLUS</span>
          <span className="text-amber-700 font-bold">ZERO INVENTORY DELAY</span>
        </div>
      </div>
    );
  }

  // 3. Custom Software
  if (s.includes('custom') || s.includes('software')) {
    return (
      <div className={`relative w-full aspect-[16/8] bg-gradient-to-br from-cyan-500/10 via-white to-sky-50/50 rounded-xl border border-cyan-200/80 p-3 overflow-hidden shadow-2xs flex flex-col justify-between ${className}`}>
        <div className="flex items-center justify-between border-b border-cyan-100 pb-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-900">
            <Terminal className="w-3.5 h-3.5 text-[#04C8E8]" /> Enterprise ERP / CRM
          </div>
          <span className="text-[9px] font-mono text-cyan-800 bg-cyan-50 px-1.5 py-0.2 rounded border border-cyan-200 font-bold shrink-0">
            Schema Typed
          </span>
        </div>
        <div className="flex items-center justify-between my-auto">
          <div className="space-y-0.5">
            <div className="text-[11px] font-bold text-slate-800">Event-Driven Architecture</div>
            <div className="text-[9px] font-mono text-slate-500">PostgreSQL · GraphQL · Redis</div>
          </div>
          <div className="p-1.5 rounded bg-cyan-50 border border-cyan-100 text-center font-mono">
            <div className="text-[8px] text-slate-500">API Sync</div>
            <div className="text-xs font-bold text-[#04C8E8]">100% Audit</div>
          </div>
        </div>
        <div className="pt-1 border-t border-cyan-100 flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span>ROLE-BASED ACL · ZERO LOCK-IN</span>
          <span className="text-cyan-700 font-bold">100% TESTED</span>
        </div>
      </div>
    );
  }

  // 4. Mobile Apps
  if (s.includes('mobile') || s.includes('app')) {
    return (
      <div className={`relative w-full aspect-[16/8] bg-gradient-to-br from-indigo-500/10 via-white to-blue-50/50 rounded-xl border border-indigo-200/80 p-3 overflow-hidden shadow-2xs flex flex-col justify-between ${className}`}>
        <div className="flex items-center justify-between border-b border-indigo-100 pb-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-900">
            <Smartphone className="w-3.5 h-3.5 text-indigo-600" /> React Native &amp; Flutter
          </div>
          <span className="text-[9px] font-mono text-indigo-800 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200 font-bold shrink-0">
            iOS + Android
          </span>
        </div>
        <div className="flex items-center justify-between my-auto">
          <div className="space-y-0.5">
            <div className="text-[11px] font-bold text-slate-800">Offline-First Synchronization</div>
            <div className="text-[9px] font-mono text-slate-500">WatermelonDB · Push Notifications</div>
          </div>
          <div className="p-1.5 rounded bg-indigo-50 border border-indigo-100 text-center font-mono">
            <div className="text-[8px] text-slate-500">60 FPS</div>
            <div className="text-xs font-bold text-indigo-600">Native Feel</div>
          </div>
        </div>
        <div className="pt-1 border-t border-indigo-100 flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span>SHARED CODEBASE · 90%+ REUSE</span>
          <span className="text-indigo-700 font-bold">STORE APPROVED</span>
        </div>
      </div>
    );
  }

  // 5. AI & ML / Generative AI
  if (s.includes('ai-') || s.includes('machine-learning') || s.includes('ml') || s.includes('gen')) {
    return (
      <div className={`relative w-full aspect-[16/8] bg-gradient-to-br from-purple-500/10 via-white to-violet-50/50 rounded-xl border border-purple-200/80 p-3 overflow-hidden shadow-2xs flex flex-col justify-between ${className}`}>
        <div className="flex items-center justify-between border-b border-purple-100 pb-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-900">
            <Cpu className="w-3.5 h-3.5 text-[#7C3AED]" /> Grounded AI &amp; Private RAG
          </div>
          <span className="text-[9px] font-mono text-purple-800 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 font-bold shrink-0">
            pgvector
          </span>
        </div>
        <div className="flex items-center justify-between my-auto">
          <div className="space-y-0.5">
            <div className="text-[11px] font-bold text-slate-800">Domain-Specific Knowledge Hub</div>
            <div className="text-[9px] font-mono text-slate-500">Verifiable Citations · Zero Leakage</div>
          </div>
          <div className="p-1.5 rounded bg-purple-50 border border-purple-100 text-center font-mono">
            <div className="text-[8px] text-slate-500">Prompt Cache</div>
            <div className="text-xs font-bold text-[#7C3AED]">92% Hit</div>
          </div>
        </div>
        <div className="pt-1 border-t border-purple-100 flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span>ZERO PUBLIC TRAINING LEAKAGE</span>
          <span className="text-purple-700 font-bold">SOC2 READY</span>
        </div>
      </div>
    );
  }

  // 6. Cloud & DevOps
  if (s.includes('cloud') || s.includes('devops') || s.includes('migration')) {
    return (
      <div className={`relative w-full aspect-[16/8] bg-gradient-to-br from-teal-500/10 via-white to-emerald-50/50 rounded-xl border border-teal-200/80 p-3 overflow-hidden shadow-2xs flex flex-col justify-between ${className}`}>
        <div className="flex items-center justify-between border-b border-teal-100 pb-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-900">
            <Cloud className="w-3.5 h-3.5 text-[#0D9488]" /> Multi-Cloud AWS &amp; Azure
          </div>
          <span className="text-[9px] font-mono text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200 font-bold shrink-0">
            99.99% SLA
          </span>
        </div>
        <div className="flex items-center justify-between my-auto">
          <div className="space-y-0.5">
            <div className="text-[11px] font-bold text-slate-800">CI/CD &amp; Zero Downtime Deploy</div>
            <div className="text-[9px] font-mono text-slate-500">Docker · Kubernetes · Terraform</div>
          </div>
          <div className="p-1.5 rounded bg-teal-50 border border-teal-100 text-center font-mono">
            <div className="text-[8px] text-slate-500">Global P99</div>
            <div className="text-xs font-bold text-[#0D9488]">&lt;45ms</div>
          </div>
        </div>
        <div className="pt-1 border-t border-teal-100 flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span>AUTOMATED FINOPS GOVERNANCE</span>
          <span className="text-teal-700 font-bold">SECURITY HARDENED</span>
        </div>
      </div>
    );
  }

  // 7. Security / Cybersecurity
  if (s.includes('cyber') || s.includes('security')) {
    return (
      <div className={`relative w-full aspect-[16/8] bg-gradient-to-br from-rose-500/10 via-white to-red-50/50 rounded-xl border border-rose-200/80 p-3 overflow-hidden shadow-2xs flex flex-col justify-between ${className}`}>
        <div className="flex items-center justify-between border-b border-rose-100 pb-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-900">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> Defensive Security Mesh
          </div>
          <span className="text-[9px] font-mono text-rose-800 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 font-bold shrink-0">
            OWASP Top 10
          </span>
        </div>
        <div className="flex items-center justify-between my-auto">
          <div className="space-y-0.5">
            <div className="text-[11px] font-bold text-slate-800">Zero-Trust Network ACL</div>
            <div className="text-[9px] font-mono text-slate-500">TLS 1.3 · Continuous Snyk Scan</div>
          </div>
          <div className="p-1.5 rounded bg-rose-50 border border-rose-100 text-center font-mono">
            <div className="text-[8px] text-slate-500">Critical Vulns</div>
            <div className="text-xs font-bold text-emerald-600">0 Reported</div>
          </div>
        </div>
        <div className="pt-1 border-t border-rose-100 flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span>ENCRYPTED AT REST &amp; TRANSIT</span>
          <span className="text-rose-700 font-bold">AUDITED ACL</span>
        </div>
      </div>
    );
  }

  // 8. Marketing, Analytics, UI/UX, Robotics, and others
  return (
    <div className={`relative w-full aspect-[16/8] bg-gradient-to-br from-blue-500/10 via-white to-slate-50 rounded-xl border border-slate-200/80 p-3 overflow-hidden shadow-2xs flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-900">
          <Layers className="w-3.5 h-3.5 text-[#1266E8]" /> Engineering Practice
        </div>
        <span className="text-[9px] font-mono text-[#1266E8] bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 font-bold shrink-0">
          Verified
        </span>
      </div>
      <div className="flex items-center justify-between my-auto">
        <div className="space-y-0.5">
          <div className="text-[11px] font-bold text-slate-800">Production Standards</div>
          <div className="text-[9px] font-mono text-slate-500">Typed Contracts · Automated Gates</div>
        </div>
        <div className="p-1.5 rounded bg-blue-50 border border-blue-100 text-center font-mono">
          <div className="text-[8px] text-slate-500">Quality</div>
          <div className="text-xs font-bold text-[#1266E8]">100% Code</div>
        </div>
      </div>
      <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono text-slate-400">
        <span>IAMTECHNI PRACTICE STANDARDS</span>
        <span className="text-[#1266E8] font-bold">DISCOVERY READY</span>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* 12. PROJECT PORTFOLIO VISUAL THUMBNAIL                                     */
/* ========================================================================== */

export const ProjectVisualThumbnail: React.FC<{ projectId: string; className?: string }> = ({
  projectId,
  className = ''
}) => {
  const id = projectId.toLowerCase();

  // 1. Omnichannel Retail
  if (id.includes('retail') || id.includes('omnichannel')) {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-amber-500/10 via-white to-blue-500/10 rounded-2xl border border-amber-200/90 p-4 sm:p-5 overflow-hidden flex flex-col justify-between shadow-2xs group-hover:shadow-md transition-shadow ${className}`}>
        <div className="flex items-center justify-between border-b border-amber-100 pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-mono text-slate-500 ml-1.5">storefront.b2b.app</span>
          </div>
          <span className="text-[10px] font-mono text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded font-bold">Headless Cart</span>
        </div>
        <div className="space-y-2 py-2">
          <div className="p-2 bg-white rounded-xl border border-amber-200 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              <div className="text-xs font-bold text-slate-900">Wholesale Tier B</div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600">₹14,900</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Redis volatile stock reservation active</span>
          </div>
        </div>
        <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>NEXT.js APP ROUTER</span>
          <span className="text-amber-700 font-bold">180ms P95 CHECKOUT</span>
        </div>
      </div>
    );
  }

  // 2. Enterprise RAG Assistant
  if (id.includes('rag') || id.includes('knowledge') || id.includes('assistant')) {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-violet-500/10 via-white to-blue-500/10 rounded-2xl border border-violet-200/90 p-4 sm:p-5 overflow-hidden flex flex-col justify-between shadow-2xs group-hover:shadow-md transition-shadow ${className}`}>
        <div className="flex items-center justify-between border-b border-violet-100 pb-2.5">
          <div className="flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-violet-600" />
            <span className="text-xs font-bold text-slate-900">RAG Document Assistant</span>
          </div>
          <span className="text-[10px] font-mono text-violet-800 bg-violet-100/70 px-2 py-0.5 rounded font-bold">FastAPI + pgvector</span>
        </div>
        <div className="space-y-2 py-2">
          <div className="p-2.5 bg-violet-50 rounded-xl border border-violet-200 text-xs text-slate-800">
            <div className="font-semibold text-violet-900 text-[11px] mb-1">Source Verified Answer:</div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              Section 3.2 verifies dual-signature approval with zero hallucinations.
            </p>
          </div>
        </div>
        <div className="pt-2 border-t border-violet-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>HYBRID BM25 + VECTOR</span>
          <span className="text-violet-700 font-bold">EXACT CITATIONS</span>
        </div>
      </div>
    );
  }

  // 3. Telemedicine / Healthcare
  if (id.includes('telemedicine') || id.includes('health') || id.includes('ehr')) {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-teal-500/10 via-white to-cyan-500/10 rounded-2xl border border-teal-200/90 p-4 sm:p-5 overflow-hidden flex flex-col justify-between shadow-2xs group-hover:shadow-md transition-shadow ${className}`}>
        <div className="flex items-center justify-between border-b border-teal-100 pb-2.5">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold text-slate-900">Clinical EHR &amp; Telehealth</span>
          </div>
          <span className="text-[10px] font-mono text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded font-bold">HIPAA Compliant</span>
        </div>
        <div className="grid grid-cols-2 gap-2 py-2">
          <div className="p-2 bg-white rounded-xl border border-teal-200 text-center">
            <div className="text-[10px] font-mono text-slate-500">WebRTC Video</div>
            <div className="text-xs font-bold text-teal-700">&lt;65ms Jitter</div>
          </div>
          <div className="p-2 bg-white rounded-xl border border-teal-200 text-center">
            <div className="text-[10px] font-mono text-slate-500">FHIR Sync</div>
            <div className="text-xs font-bold text-emerald-600">Encrypted PHI</div>
          </div>
        </div>
        <div className="pt-2 border-t border-teal-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>ZERO-TRUST AUDIT</span>
          <span className="text-teal-700 font-bold">EHR INTEGRATED</span>
        </div>
      </div>
    );
  }

  // 4. Industrial IoT
  return (
    <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-indigo-500/10 via-white to-blue-500/10 rounded-2xl border border-indigo-200/90 p-4 sm:p-5 overflow-hidden flex flex-col justify-between shadow-2xs group-hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between border-b border-indigo-100 pb-2.5">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-900">IoT Telemetry &amp; SCADA</span>
        </div>
        <span className="text-[10px] font-mono text-indigo-800 bg-indigo-100/70 px-2 py-0.5 rounded font-bold">TimescaleDB</span>
      </div>
      <div className="grid grid-cols-2 gap-2 py-2">
        <div className="p-2 bg-white rounded-xl border border-indigo-200 text-center">
          <div className="text-[10px] font-mono text-slate-500">Telemetry Ingest</div>
          <div className="text-xs font-bold text-indigo-700">85,000 msg/s</div>
        </div>
        <div className="p-2 bg-white rounded-xl border border-indigo-200 text-center">
          <div className="text-[10px] font-mono text-slate-500">Predictive Anomaly</div>
          <div className="text-xs font-bold text-emerald-600">&lt;1.8s Alert</div>
        </div>
      </div>
      <div className="pt-2 border-t border-indigo-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>MQTT / OPC-UA GATEWAY</span>
        <span className="text-indigo-700 font-bold">FAIL-SAFE EDGE</span>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* 13. ARTICLE EDITORIAL GRAPHIC FOR INSIGHTS                                 */
/* ========================================================================== */

export const ArticleGraphic: React.FC<{ slug: string; className?: string }> = ({
  slug,
  className = ''
}) => {
  const s = slug.toLowerCase();

  if (s.includes('rag') || s.includes('vector')) {
    return (
      <div className={`relative w-full aspect-[16/9] bg-gradient-to-br from-[#0B1120] via-slate-900 to-[#1e1b4b] rounded-2xl p-6 text-white overflow-hidden border border-slate-800 shadow-md flex flex-col justify-between ${className}`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
            ARCHITECTURE DIAGRAM // ENTERPRISE RAG
          </span>
          <span className="text-[11px] font-mono text-emerald-400">Hybrid BM25 + pgvector</span>
        </div>
        <div className="grid grid-cols-3 gap-3 my-auto py-2 text-center text-xs font-mono">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700">
            <div className="text-[10px] text-slate-400">Lexical Precision</div>
            <div className="text-base font-bold text-amber-300">BM25 Search</div>
            <div className="text-[9px] text-slate-400">Exact SKU &amp; Section</div>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700">
            <div className="text-[10px] text-slate-400">Dense Embedding</div>
            <div className="text-base font-bold text-cyan-400">Cosine 1536d</div>
            <div className="text-[9px] text-slate-400">Semantic Context</div>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700">
            <div className="text-[10px] text-slate-400">Reciprocal Rank</div>
            <div className="text-base font-bold text-emerald-400">RRF Top-5</div>
            <div className="text-[9px] text-slate-400">Zero Hallucination</div>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Grounded Ingest Pipeline</span>
          <span className="text-purple-300 font-bold">15% Token Sliding Overlap</span>
        </div>
      </div>
    );
  }

  // Cloud FinOps / Micro-Frontends / Zero-Trust fallbacks
  return (
    <div className={`relative w-full aspect-[16/9] bg-gradient-to-br from-[#090D1A] via-slate-900 to-[#0e1e38] rounded-2xl p-6 text-white overflow-hidden border border-slate-800 shadow-md flex flex-col justify-between ${className}`}>
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <span className="text-xs font-mono text-[#04C8E8] font-bold uppercase tracking-wider">
          TECHNICAL BENCHMARK // ENTERPRISE DEPLOYMENT
        </span>
        <span className="text-[11px] font-mono text-emerald-400">Zero-Downtime Rollout</span>
      </div>
      <div className="grid grid-cols-3 gap-3 my-auto py-2 text-center text-xs font-mono">
        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700">
          <div className="text-[10px] text-slate-400">Performance</div>
          <div className="text-base font-bold text-[#1266E8]">99.99%</div>
          <div className="text-[9px] text-slate-400">Availability SLA</div>
        </div>
        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700">
          <div className="text-[10px] text-slate-400">P99 Latency</div>
          <div className="text-base font-bold text-cyan-400">&lt;85ms</div>
          <div className="text-[9px] text-slate-400">Edge CDN Cache</div>
        </div>
        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700">
          <div className="text-[10px] text-slate-400">Infrastructure</div>
          <div className="text-base font-bold text-emerald-400">Kubernetes</div>
          <div className="text-[9px] text-slate-400">GitOps Managed</div>
        </div>
      </div>
      <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span>IAMTECHNI Engineering Research Practice</span>
        <span className="text-[#04C8E8] font-bold">PRODUCTION BENCHMARKED</span>
      </div>
    </div>
  );
};
