import React from 'react';
import {
  Sparkles,
  Layers,
  Cpu,
  Smartphone,
  ShoppingBag,
  TrendingUp,
  Cloud,
  ShieldCheck,
  Bot,
  Database,
  Compass,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Activity,
  Globe,
  Radio,
  Workflow,
  Search,
  Share2,
  Terminal,
  Zap,
  BarChart3,
  Server,
  Lock,
  GitBranch,
  RefreshCw,
  Code2,
  Palette,
  FileText,
} from 'lucide-react';

interface PageHeroVisualProps {
  type: string;
}

export const PageHeroVisual: React.FC<PageHeroVisualProps> = ({ type }) => {
  // Normalize slug to handle aliases
  const normalized = type.toLowerCase().trim();

  switch (normalized) {
    /* ========================================================================== */
    /* 1. WEBSITE DEVELOPMENT / WEB DEVELOPMENT                                   */
    /* ========================================================================== */
    case 'web-development':
    case 'website-development':
      return (
        <div className="relative w-full max-w-lg mx-auto aspect-[16/11]">
          {/* Ambient Glows */}
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#04C8E8]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#1266E8]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Browser Window Mockup */}
          <div className="relative w-full h-full bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col">
            {/* Browser Header Bar */}
            <div className="bg-slate-100 px-4 py-3 flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-3 px-3 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-mono text-slate-600 flex items-center gap-1.5 shadow-2xs">
                  <span className="text-emerald-500 font-bold">https://</span>enterprise.iamtechni.in
                </span>
              </div>
              <div className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Core Vitals: 100/100
              </div>
            </div>

            {/* Browser Content Area */}
            <div className="flex-1 p-5 bg-gradient-to-br from-slate-50/60 via-white to-blue-50/40 flex flex-col justify-between">
              {/* Mockup Header */}
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#04C8E8] to-[#1266E8] flex items-center justify-center text-white text-[10px] font-bold">
                    it
                  </div>
                  <div className="h-3 w-24 bg-slate-300 rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="h-2 w-12 bg-slate-200 rounded" />
                  <div className="h-2 w-12 bg-slate-200 rounded" />
                  <div className="h-2 w-14 bg-[#1266E8] rounded" />
                </div>
              </div>

              {/* Mockup Hero Split */}
              <div className="grid grid-cols-12 gap-4 items-center my-auto">
                <div className="col-span-7 space-y-2">
                  <div className="h-4 w-5/6 bg-slate-900 rounded font-bold" />
                  <div className="h-2 w-full bg-slate-300 rounded" />
                  <div className="h-2 w-4/5 bg-slate-200 rounded" />
                  <div className="pt-2 flex gap-2">
                    <div className="h-6 w-20 bg-[#1266E8] rounded-md text-white text-[9px] font-bold flex items-center justify-center">
                      Launch App
                    </div>
                    <div className="h-6 w-16 bg-slate-100 border border-slate-200 rounded-md" />
                  </div>
                </div>
                <div className="col-span-5 aspect-square rounded-xl bg-gradient-to-tr from-[#04C8E8] via-[#1266E8] to-[#5427D9] p-3 flex flex-col justify-between text-white shadow-md">
                  <div className="text-[9px] font-mono opacity-90 uppercase">REACT 19 / VITE</div>
                  <div className="text-xs font-bold leading-tight">Sub-Second Hydration</div>
                  <div className="text-[9px] font-mono opacity-90">WCAG 2.2 AA</div>
                </div>
              </div>

              {/* Performance Metrics Row */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/70">
                <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs text-center">
                  <div className="text-[9px] font-mono text-slate-400">FID</div>
                  <div className="text-xs font-bold text-emerald-600">6ms</div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs text-center">
                  <div className="text-[9px] font-mono text-slate-400">CLS</div>
                  <div className="text-xs font-bold text-emerald-600">0.00</div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs text-center">
                  <div className="text-[9px] font-mono text-slate-400">LCP</div>
                  <div className="text-xs font-bold text-emerald-600">0.68s</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Mobile Device Overlay */}
          <div className="absolute -bottom-5 -right-5 w-36 bg-slate-900 rounded-2xl p-1.5 border-2 border-slate-700 shadow-xl hidden sm:block">
            <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-1.5" />
            <div className="bg-white rounded-xl p-2 space-y-1.5 text-center">
              <div className="w-5 h-5 rounded-md bg-[#1266E8] mx-auto flex items-center justify-center text-white text-[8px] font-bold">
                it
              </div>
              <div className="h-1.5 w-14 bg-slate-300 rounded mx-auto" />
              <div className="h-1 w-20 bg-slate-200 rounded mx-auto" />
              <div className="text-[8px] font-mono text-emerald-600 font-bold pt-1">
                100% Mobile Ready
              </div>
            </div>
          </div>
        </div>
      );

    /* ========================================================================== */
    /* 2. E-COMMERCE DEVELOPMENT / ECOMMERCE                                      */
    /* ========================================================================== */
    case 'ecommerce':
    case 'ecommerce-development':
      return (
        <div className="relative w-full max-w-lg mx-auto aspect-[16/11]">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#EA580C]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#7C3AED]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl p-5 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#EA580C]">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">IAMTECHNI Commerce Engine</div>
                  <div className="text-[10px] text-slate-500 font-mono">Headless Architecture &amp; Cart</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 font-bold">
                Stripe &amp; Razorpay Ready
              </span>
            </div>

            {/* Product & Cart Showcase */}
            <div className="grid grid-cols-12 gap-4 items-center my-auto">
              <div className="col-span-7 bg-[#FFF7F2] p-4 rounded-xl border border-orange-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-bold uppercase">
                    Conversion Optimized
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">$2,450.00</span>
                </div>
                <div className="text-sm font-bold text-slate-900">Enterprise SaaS Storefront</div>
                <div className="text-xs text-slate-600">Sub-second checkout, real-time inventory sync &amp; multi-currency.</div>
                <div className="pt-1 flex items-center gap-2 text-[10px] font-mono text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>0.3s One-Click Checkout</span>
                </div>
              </div>

              <div className="col-span-5 space-y-2">
                <div className="p-3 rounded-xl bg-violet-50 border border-violet-200/80 text-center">
                  <div className="text-[10px] font-mono text-violet-700 font-bold">AOV LIFT</div>
                  <div className="text-base font-extrabold text-[#7C3AED]">+34.8%</div>
                  <div className="text-[9px] text-slate-500">Post-Launch</div>
                </div>
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200/80 text-center">
                  <div className="text-[10px] font-mono text-teal-700 font-bold">UPTIME SLA</div>
                  <div className="text-base font-extrabold text-teal-700">99.99%</div>
                  <div className="text-[9px] text-slate-500">Black Friday Peak</div>
                </div>
              </div>
            </div>

            {/* Bottom Stream Status */}
            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>HEADLESS SHOPIFY &amp; NEXT COMMERCE</span>
              <span className="text-[#EA580C] font-bold">ZERO FRICTION FUNNEL</span>
            </div>
          </div>
        </div>
      );

    /* ========================================================================== */
    /* 3. CUSTOM SOFTWARE DEVELOPMENT                                             */
    /* ========================================================================== */
    case 'custom-software':
    case 'custom-software-development':
      return (
        <div className="relative w-full max-w-lg mx-auto aspect-[16/11]">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                  <Workflow className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Microservice Mesh &amp; Event Bus</div>
                  <div className="text-[10px] text-slate-500 font-mono">Distributed Enterprise Architecture</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200 font-bold">
                TypeScript + Python
              </span>
            </div>

            {/* Architecture Node Diagram */}
            <div className="grid grid-cols-3 gap-3 my-auto py-2">
              <div className="p-3 bg-[#EEF2FF] rounded-xl border border-indigo-200/80 space-y-1">
                <div className="text-[10px] font-mono text-indigo-700 font-bold">API GATEWAY</div>
                <div className="text-xs font-bold text-slate-900">GraphQL &amp; REST</div>
                <div className="text-[10px] text-slate-500">&lt;24ms Global Latency</div>
              </div>
              <div className="p-3 bg-[#E0F2FE] rounded-xl border border-sky-200/80 space-y-1">
                <div className="text-[10px] font-mono text-sky-700 font-bold">WORKFLOW ENGINE</div>
                <div className="text-xs font-bold text-slate-900">Event-Driven</div>
                <div className="text-[10px] text-slate-500">Kafka &amp; BullMQ Queues</div>
              </div>
              <div className="p-3 bg-[#E0E7FF] rounded-xl border border-indigo-200/80 space-y-1">
                <div className="text-[10px] font-mono text-indigo-700 font-bold">DATA REPOSITORY</div>
                <div className="text-xs font-bold text-slate-900">PostgreSQL + Redis</div>
                <div className="text-[10px] text-slate-500">ACID Compliance</div>
              </div>
            </div>

            {/* Bottom Status */}
            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Type-Safe Contracts
              </span>
              <span className="text-indigo-700 font-bold">ZERO TECH DEBT</span>
            </div>
          </div>
        </div>
      );

    /* ========================================================================== */
    /* 4. UI/UX DESIGN                                                            */
    /* ========================================================================== */
    case 'ui-ux-design':
      return (
        <div className="relative w-full max-w-lg mx-auto aspect-[16/11]">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-[#7C3AED]">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Enterprise Design System</div>
                  <div className="text-[10px] text-slate-500 font-mono">Tokens · Components · WCAG AAA</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded border border-violet-200 font-bold">
                Figma to Production
              </span>
            </div>

            {/* Design Tokens & Palette Preview */}
            <div className="grid grid-cols-12 gap-4 items-center my-auto">
              <div className="col-span-7 space-y-2.5">
                <div className="text-xs font-bold text-slate-900">Atomic Component Library</div>
                <div className="flex gap-2">
                  <div className="h-7 px-3 bg-[#1266E8] text-white text-[10px] font-bold rounded-lg flex items-center">
                    Primary Button
                  </div>
                  <div className="h-7 px-3 bg-white border border-slate-300 text-slate-700 text-[10px] font-semibold rounded-lg flex items-center">
                    Secondary
                  </div>
                  <div className="h-7 px-3 bg-violet-100 text-[#7C3AED] text-[10px] font-bold rounded-lg flex items-center">
                    Active State
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="w-4 h-4 rounded-full bg-[#04C8E8]" title="#04C8E8 Cyan" />
                  <span className="w-4 h-4 rounded-full bg-[#1266E8]" title="#1266E8 Royal Blue" />
                  <span className="w-4 h-4 rounded-full bg-[#5427D9]" title="#5427D9 Violet" />
                  <span className="w-4 h-4 rounded-full bg-[#0D9488]" title="#0D9488 Teal" />
                  <span className="w-4 h-4 rounded-full bg-[#EA580C]" title="#EA580C Coral" />
                  <span className="text-[10px] font-mono text-slate-400 ml-2">HEX Tokens</span>
                </div>
              </div>

              <div className="col-span-5 bg-gradient-to-br from-violet-50 to-pink-50 p-3.5 rounded-xl border border-violet-200/80 text-center space-y-1">
                <div className="text-[10px] font-mono text-violet-700 font-bold">ACCESSIBILITY</div>
                <div className="text-lg font-extrabold text-[#7C3AED]">WCAG AAA</div>
                <div className="text-[9px] text-slate-600">4.5:1 Minimum Contrast</div>
                <div className="text-[8px] font-mono text-emerald-600 font-bold">100% Screen Reader Tested</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>USER RESEARCH &amp; USABILITY BENCHMARKS</span>
              <span className="text-[#7C3AED] font-bold">HUMAN-CENTERED UX</span>
            </div>
          </div>
        </div>
      );

    /* ========================================================================== */
    /* 5. MOBILE APP DEVELOPMENT                                                  */
    /* ========================================================================== */
    case 'mobile-apps':
    case 'mobile-app-development':
      return (
        <div className="relative w-full max-w-lg mx-auto aspect-[16/11]">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">iOS &amp; Android Ecosystem</div>
                  <div className="text-[10px] text-slate-500 font-mono">React Native &amp; Flutter Architecture</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200 font-bold">
                60 FPS Native Performance
              </span>
            </div>

            {/* Mobile Showcase */}
            <div className="grid grid-cols-12 gap-4 items-center my-auto">
              <div className="col-span-6 bg-slate-900 rounded-2xl p-3 text-white shadow-md space-y-2">
                <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto" />
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>9:41 AM</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>5G</span>
                  </div>
                </div>
                <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl space-y-1">
                  <div className="text-[9px] uppercase font-mono tracking-wider opacity-80">BIOMETRIC PASSKEY</div>
                  <div className="text-xs font-bold">Secure Mobile Auth</div>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded" />
                <div className="h-1.5 w-3/4 bg-slate-800 rounded" />
              </div>

              <div className="col-span-6 space-y-2.5">
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200/80">
                  <div className="text-[10px] font-mono text-purple-700 font-bold">OFFLINE-FIRST</div>
                  <div className="text-xs font-bold text-slate-900">WatermelonDB Sync</div>
                  <div className="text-[10px] text-slate-500">Instant offline read &amp; queue</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200/80">
                  <div className="text-[10px] font-mono text-[#1266E8] font-bold">APP STORE RATING</div>
                  <div className="text-xs font-bold text-slate-900">4.9 / 5.0 Average</div>
                  <div className="text-[10px] text-slate-500">100,000+ Downloads</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>CROSS-PLATFORM SPEED</span>
              <span className="text-purple-700 font-bold">SINGLE CODEBASE</span>
            </div>
          </div>
        </div>
      );

    /* ========================================================================== */
    /* 6. AI & MACHINE LEARNING                                                   */
    /* ========================================================================== */
    case 'ai-machine-learning':
      return (
        <div className="relative w-full max-w-lg mx-auto aspect-[16/11]">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#04C8E8]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#5427D9]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[#1266E8]">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Cognitive Neural Inference Engine</div>
                  <div className="text-[10px] text-slate-500 font-mono">Hybrid RAG &amp; Vector Embeddings</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 font-bold">
                99.4% Factual Accuracy
              </span>
            </div>

            {/* Neural Topology Preview */}
            <div className="grid grid-cols-12 gap-4 items-center my-auto">
              <div className="col-span-7 bg-[#F0F5FF] p-4 rounded-xl border border-blue-200/80 space-y-2">
                <div className="text-[10px] font-mono text-[#1266E8] font-bold">VECTOR RETRIEVAL PIPELINE</div>
                <div className="text-xs font-bold text-slate-900">Dense Embedding + BM25 Reranking</div>
                <div className="text-xs text-slate-600">Zero model hallucinations with strict citation provenance.</div>
                <div className="flex gap-1.5 pt-1">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white border border-blue-200 text-blue-800">
                    pgvector
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white border border-blue-200 text-blue-800">
                    Cohere Rerank
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white border border-blue-200 text-blue-800">
                    LlamaIndex
                  </span>
                </div>
              </div>

              <div className="col-span-5 space-y-2">
                <div className="p-3 bg-violet-50 rounded-xl border border-violet-200 text-center">
                  <div className="text-[10px] font-mono text-[#7C3AED] font-bold">INFERENCE SPEED</div>
                  <div className="text-base font-extrabold text-[#5427D9]">&lt;120ms</div>
                  <div className="text-[9px] text-slate-500">TTFT Latency</div>
                </div>
                <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200 text-center">
                  <div className="text-[10px] font-mono text-[#0284C7] font-bold">DATA ISOLATION</div>
                  <div className="text-base font-extrabold text-[#0284C7]">SOC-2 Zero Leak</div>
                  <div className="text-[9px] text-slate-500">VPC Enclave</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>DETERMINISTIC CITATIONS</span>
              <span className="text-[#1266E8] font-bold">PRODUCTION ENTERPRISE AI</span>
            </div>
          </div>
        </div>
      );

    /* ========================================================================== */
    /* 7. GENERATIVE AI                                                           */
    /* ========================================================================== */
    case 'generative-ai':
      return (
        <div className="relative w-full max-w-lg mx-auto aspect-[16/11]">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Generative AI Enterprise Suite</div>
                  <div className="text-[10px] text-slate-500 font-mono">Custom LLMs, Agents &amp; Workflows</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded border border-cyan-200 font-bold">
                Multi-Modal Models
              </span>
            </div>

            {/* Prompt Console Mockup */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 my-auto">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>SYSTEM PROMPT // GROUNDED_ASSISTANT</span>
                <span className="text-emerald-600 font-bold">TOKEN STREAMING ACTIVE</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-800 font-mono shadow-2xs">
                &gt; Synthesizing 42 enterprise audit reports with exact paragraph citations...
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-1.5 bg-white rounded border border-slate-200">
                  <div className="text-[9px] text-slate-400 font-mono">Precision</div>
                  <div className="text-xs font-bold text-slate-900">99.8%</div>
                </div>
                <div className="p-1.5 bg-white rounded border border-slate-200">
                  <div className="text-[9px] text-slate-400 font-mono">Cost Reduction</div>
                  <div className="text-xs font-bold text-emerald-600">-68%</div>
                </div>
                <div className="p-1.5 bg-white rounded border border-slate-200">
                  <div className="text-[9px] text-slate-400 font-mono">Guardrails</div>
                  <div className="text-xs font-bold text-[#1266E8]">Active</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>FINE-TUNED ENTERPRISE AGENTS</span>
              <span className="text-[#04C8E8] font-bold">ZERO LEAKAGE VPC</span>
            </div>
          </div>
        </div>
      );

    /* ========================================================================== */
    /* 8. ROBOTICS & EMERGING TECHNOLOGIES                                        */
    /* ========================================================================== */
    case 'robotics':
    case 'robotics-emerging-tech':
      return (
        <div className="relative w-full max-w-lg mx-auto aspect-[16/11]">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-[#0D9488]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">ROS2 Telemetry &amp; Spatial Lidar</div>
                  <div className="text-[10px] text-slate-500 font-mono">Edge Computing &amp; Autonomous Systems</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 font-bold flex items-center gap-1">
                <Radio className="w-3 h-3 text-[#0D9488]" /> Edge Node Active
              </span>
            </div>

            {/* Radar / Spatial Map Graphic */}
            <div className="grid grid-cols-12 gap-4 items-center my-auto py-1">
              <div className="col-span-5 relative aspect-square flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200 p-2">
                <svg viewBox="0 0 160 160" className="w-full h-full">
                  <circle cx="80" cy="80" r="70" stroke="#CBD5E1" strokeWidth="1" fill="none" />
                  <circle cx="80" cy="80" r="45" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" fill="none" />
                  <circle cx="80" cy="80" r="20" stroke="#04C8E8" strokeWidth="1.5" fill="none" />
                  <line x1="80" y1="10" x2="80" y2="150" stroke="#CBD5E1" strokeWidth="1" />
                  <line x1="10" y1="80" x2="150" y2="80" stroke="#CBD5E1" strokeWidth="1" />
                  <line x1="80" y1="80" x2="135" y2="35" stroke="#04C8E8" strokeWidth="2" opacity="0.8" />
                  <circle cx="80" cy="80" r="4" fill="#04C8E8" />
                  <circle cx="110" cy="55" r="4" fill="#0284C7" />
                  <circle cx="60" cy="110" r="3.5" fill="#5427D9" />
                </svg>
              </div>

              <div className="col-span-7 space-y-2">
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl space-y-1">
                  <div className="text-[10px] font-mono text-[#0D9488] font-bold">AUTONOMOUS NAVIGATION</div>
                  <div className="text-xs font-bold text-slate-900">SLAM Real-Time Localization</div>
                  <div className="text-[10px] text-slate-600">Coordinate Precision: &plusmn;2mm</div>
                </div>
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-slate-700">
                  <span className="font-bold text-[#1266E8]">WebRTC Stream: </span>
                  18ms low-latency edge sensor bridge.
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>HARDWARE SAFETY ENVELOPE: LOCKED</span>
              <span className="text-[#0D9488] font-bold">OPC-UA STREAMING</span>
            </div>
          </div>
        </div>
      );

    /* ========================================================================== */
    /* 9. DIGITAL MARKETING & SEO                                                 */
    /* ========================================================================== */
    case 'digital-marketing':
    case 'seo':
    case 'social-media-marketing':
      return (
        <div className="relative w-full max-w-lg mx-auto aspect-[16/11]">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Organic Growth &amp; SERP Intelligence</div>
                  <div className="text-[10px] text-slate-500 font-mono">Technical SEO &amp; Acquisition Funnels</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200 font-bold">
                Rank #1 Strategy
              </span>
            </div>

            {/* Growth Graph & SERP Snippet */}
            <div className="space-y-3 my-auto">
              {/* Google SERP Snippet Preview */}
              <div className="p-3 bg-[#FAFBFD] rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <Globe className="w-3 h-3 text-[#1266E8]" />
                  <span>https://iamtechni.in › enterprise-services</span>
                </div>
                <div className="text-xs font-bold text-blue-700 hover:underline cursor-pointer">
                  Top Enterprise Engineering &amp; AI Practice — IAMTECHNI
                </div>
                <div className="text-[11px] text-slate-600 line-clamp-1">
                  Sub-second web performance, custom AI architectures, and resilient cloud systems for scaling businesses.
                </div>
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl">
                  <div className="text-[9px] font-mono text-rose-700 font-bold">ORGANIC TRAFFIC</div>
                  <div className="text-sm font-extrabold text-rose-900">+312%</div>
                </div>
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="text-[9px] font-mono text-emerald-700 font-bold">KEYWORDS RANK #1</div>
                  <div className="text-sm font-extrabold text-emerald-900">140+</div>
                </div>
                <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="text-[9px] font-mono text-amber-700 font-bold">CONVERSION RATE</div>
                  <div className="text-sm font-extrabold text-amber-900">4.8%</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>DATA-DRIVEN ROI ATTRIBUTION</span>
              <span className="text-rose-700 font-bold">PROVABLE REVENUE GROWTH</span>
            </div>
          </div>
        </div>
      );

    /* ========================================================================== */
    /* 10. CLOUD COMPUTING, DEVOPS & CI/CD                                        */
    /* ========================================================================== */
    case 'cloud-computing':
    case 'cloud-devops':
    case 'devops':
    case 'cloud-migration':
      return (
        <div className="relative w-full max-w-lg mx-auto aspect-[16/11]">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-[#0284C7]">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Multi-Cloud Resilience &amp; CI/CD</div>
                  <div className="text-[10px] text-slate-500 font-mono">AWS · Azure · Kubernetes Orchestration</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200 font-bold">
                99.99% SLA Uptime
              </span>
            </div>

            {/* Multi-Region Cloud Topology */}
            <div className="grid grid-cols-2 gap-3 my-auto py-1">
              <div className="p-3 bg-sky-50/80 rounded-xl border border-sky-200 space-y-1">
                <div className="text-[10px] font-mono text-[#0284C7] font-bold">AWS CLOUD CLUSTER</div>
                <div className="text-xs font-bold text-slate-900">EKS Auto-Scaling Pods</div>
                <div className="text-[10px] text-slate-600">Zero-downtime blue/green deployment</div>
              </div>
              <div className="p-3 bg-teal-50/80 rounded-xl border border-teal-200 space-y-1">
                <div className="text-[10px] font-mono text-[#0D9488] font-bold">AZURE HYBRID MESH</div>
                <div className="text-xs font-bold text-slate-900">Geo-Replicated Storage</div>
                <div className="text-[10px] text-slate-600">Disaster Recovery RTO &lt; 2 mins</div>
              </div>
            </div>

            {/* Pipeline Stage Bar */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>GITOPS CI/CD PIPELINE</span>
                <span className="text-emerald-600 font-bold">BUILD #412 PASSED</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-center text-[9px] font-mono font-bold">
                <span className="p-1 rounded bg-emerald-100 text-emerald-800">Lint: OK</span>
                <span className="p-1 rounded bg-emerald-100 text-emerald-800">Test: 100%</span>
                <span className="p-1 rounded bg-emerald-100 text-emerald-800">Docker: OK</span>
                <span className="p-1 rounded bg-emerald-100 text-emerald-800">Deploy: LIVE</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>FINOPS COST OPTIMIZATION: -40%</span>
              <span className="text-[#0284C7] font-bold">ZERO DOWNTIME GUARANTEED</span>
            </div>
          </div>
        </div>
      );

    /* ========================================================================== */
    /* 11. DATA ANALYTICS & BUSINESS INTELLIGENCE                                 */
    /* ========================================================================== */
    case 'data-analytics':
      return (
        <div className="relative w-full max-w-lg mx-auto aspect-[16/11]">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Executive Analytics &amp; Forecasting</div>
                  <div className="text-[10px] text-slate-500 font-mono">Modern Data Stack · dbt · Snowflake</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 font-bold">
                Real-Time Telemetry
              </span>
            </div>

            {/* Chart Grid */}
            <div className="grid grid-cols-12 gap-4 items-center my-auto">
              <div className="col-span-7 bg-[#ECFDF5] p-3.5 rounded-xl border border-emerald-200/80 space-y-2">
                <div className="text-[10px] font-mono text-[#059669] font-bold">REVENUE FORECAST (Q4)</div>
                <div className="text-lg font-extrabold text-slate-900">$4.82M</div>
                {/* SVG Mini Bar Chart */}
                <div className="h-12 flex items-end gap-1.5 pt-1">
                  <div className="w-full h-4 bg-emerald-300 rounded-t" />
                  <div className="w-full h-6 bg-emerald-400 rounded-t" />
                  <div className="w-full h-8 bg-emerald-500 rounded-t" />
                  <div className="w-full h-7 bg-emerald-400 rounded-t" />
                  <div className="w-full h-10 bg-emerald-600 rounded-t" />
                  <div className="w-full h-12 bg-emerald-700 rounded-t" />
                </div>
              </div>

              <div className="col-span-5 space-y-2">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
                  <div className="text-[10px] font-mono text-[#1266E8] font-bold">DATA FRESHNESS</div>
                  <div className="text-base font-extrabold text-[#1266E8]">&lt; 5s Stream</div>
                  <div className="text-[9px] text-slate-500">Kafka Pipeline</div>
                </div>
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-center">
                  <div className="text-[10px] font-mono text-[#0D9488] font-bold">ANOMALY DETECT</div>
                  <div className="text-base font-extrabold text-[#0D9488]">Zero Spikes</div>
                  <div className="text-[9px] text-slate-500">Automated Alerts</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>INTERACTIVE EXECUTIVE DASHBOARDS</span>
              <span className="text-emerald-700 font-bold">DECISION VELOCITY</span>
            </div>
          </div>
        </div>
      );

    /* ========================================================================== */
    /* 12. CYBERSECURITY                                                          */
    /* ========================================================================== */
    case 'cybersecurity':
      return (
        <div className="relative w-full max-w-lg mx-auto aspect-[16/11]">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Zero-Trust Defense Enclave</div>
                  <div className="text-[10px] text-slate-500 font-mono">SOC-2 · OWASP Top 10 · Penetration Audits</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 font-bold">
                100% Passed Audits
              </span>
            </div>

            {/* Security Nodes */}
            <div className="grid grid-cols-2 gap-3 my-auto py-1">
              <div className="p-3 bg-red-50/80 rounded-xl border border-red-200 space-y-1">
                <div className="text-[10px] font-mono text-red-700 font-bold">PENETRATION TESTING</div>
                <div className="text-xs font-bold text-slate-900">0 Critical Vulnerabilities</div>
                <div className="text-[10px] text-slate-600">Continuous automated code scanning</div>
              </div>
              <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-200 space-y-1">
                <div className="text-[10px] font-mono text-indigo-700 font-bold">ENCRYPTION PROTOCOL</div>
                <div className="text-xs font-bold text-slate-900">AES-256 + TLS 1.3</div>
                <div className="text-[10px] text-slate-600">Rest &amp; transit key rotation</div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>MFA / SSO Enforced (Okta &amp; Azure AD)</span>
              </span>
              <span className="font-mono text-[10px] text-emerald-700 font-bold">HARDENED</span>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>ZERO-TRUST IDENTITY ARCHITECTURE</span>
              <span className="text-red-700 font-bold">FORTIFIED SECURITY</span>
            </div>
          </div>
        </div>
      );

    /* ========================================================================== */
    /* 13. IT CONSULTING & TECHNICAL TRAINING                                     */
    /* ========================================================================== */
    case 'it-consulting':
    case 'training':
      return (
        <div className="relative w-full max-w-lg mx-auto aspect-[16/11]">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Enterprise Technology Advisory</div>
                  <div className="text-[10px] text-slate-500 font-mono">Modernization Roadmaps &amp; Capability Transfer</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 font-bold">
                Architecture First
              </span>
            </div>

            {/* Strategic Roadmap Canvas */}
            <div className="grid grid-cols-3 gap-3 my-auto py-1">
              <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-200 space-y-1">
                <div className="text-[10px] font-mono text-amber-800 font-bold">PHASE 1</div>
                <div className="text-xs font-bold text-slate-900">Audit &amp; Baseline</div>
                <div className="text-[10px] text-slate-600">Tech debt cataloging</div>
              </div>
              <div className="p-3 bg-blue-50/90 rounded-xl border border-blue-200 space-y-1">
                <div className="text-[10px] font-mono text-[#1266E8] font-bold">PHASE 2</div>
                <div className="text-xs font-bold text-slate-900">Modern Architecture</div>
                <div className="text-[10px] text-slate-600">Decoupled services</div>
              </div>
              <div className="p-3 bg-emerald-50/90 rounded-xl border border-emerald-200 space-y-1">
                <div className="text-[10px] font-mono text-emerald-800 font-bold">PHASE 3</div>
                <div className="text-xs font-bold text-slate-900">Team Enablement</div>
                <div className="text-[10px] text-slate-600">Hands-on labs</div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
              <span className="font-semibold text-slate-900">Strategic ROI: Guaranteed tech roadmap with 3-year TCO reduction.</span>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>INDEPENDENT TECHNICAL GOVERNANCE</span>
              <span className="text-amber-800 font-bold">EXECUTIVE CLARITY</span>
            </div>
          </div>
        </div>
      );

    /* ========================================================================== */
    /* 14. DEFAULT / BUSINESS SOLUTIONS ARCHITECTURE                             */
    /* ========================================================================== */
    default:
      return (
        <div className="relative w-full max-w-lg mx-auto aspect-[16/11]">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#1266E8]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#04C8E8]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-full h-full bg-gradient-to-br from-white via-[#F8FAFD] to-blue-50/40 rounded-2xl border border-slate-200 shadow-xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#1266E8]" />
                <span className="text-xs font-bold text-slate-900 font-mono">IAMTECHNI // ENTERPRISE_SOLUTION</span>
              </div>
              <span className="text-[10px] font-mono text-[#1266E8] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 font-bold">
                PRACTICE STANDARD
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 my-auto">
              <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
                <div className="text-[10px] font-mono text-[#1266E8] uppercase font-bold">ARCHITECTURE FIRST</div>
                <div className="text-sm font-bold text-slate-900">Engineered Rigor</div>
                <div className="text-xs text-slate-600">Strict TypeScript typing, modular contracts, and zero legacy bloat.</div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
                <div className="text-[10px] font-mono text-[#04C8E8] uppercase font-bold">SCALE &amp; VELOCITY</div>
                <div className="text-sm font-bold text-slate-900">Sub-Second Delivery</div>
                <div className="text-xs text-slate-600">Validated with Core Web Vitals, automated CI/CD and SOC-2 compliance.</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <CheckCircle2 className="w-4 h-4" /> 100% Codebase Ownership
              </span>
              <span className="text-[#1266E8] font-bold">VERIFIED BENCHMARKS</span>
            </div>
          </div>
        </div>
      );
  }
};
