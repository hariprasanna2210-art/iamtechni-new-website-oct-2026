import React from 'react';
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
  Stethoscope,
  Landmark,
  Factory,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Terminal,
  Database,
  Search,
  Lock,
  Workflow,
  Radio,
  Clock,
  ArrowRight
} from 'lucide-react';

/* ========================================================================== */
/* 1. INDUSTRY-SPECIFIC ILLUSTRATION COMPONENT                                */
/* ========================================================================== */

interface IndustryIllustrationProps {
  industryId: string;
  className?: string;
}

export const IndustryIllustration: React.FC<IndustryIllustrationProps> = ({
  industryId,
  className = '',
}) => {
  const key = industryId.toLowerCase();

  // 1. Healthcare & Life Sciences
  if (key.includes('health') || key.includes('medical') || key.includes('life')) {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-teal-500/10 via-white to-cyan-500/10 rounded-2xl border border-teal-200/90 p-5 overflow-hidden shadow-sm flex flex-col justify-between ${className}`}>
        <div className="absolute top-0 right-0 w-36 h-36 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between border-b border-teal-200/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700 shadow-2xs">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">EHR & Telehealth Pipeline</div>
              <div className="text-[10px] font-mono text-teal-700">HIPAA & HL7/FHIR Compliant</div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            PHI Encrypted
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 my-auto py-2">
          <div className="p-2.5 bg-white rounded-xl border border-teal-100 shadow-2xs text-center">
            <div className="text-[10px] font-mono text-slate-500">Sync Latency</div>
            <div className="text-sm font-extrabold text-teal-700">&lt;120ms</div>
            <div className="text-[9px] text-emerald-600 font-medium">Real-Time Vitals</div>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-teal-100 shadow-2xs text-center">
            <div className="text-[10px] font-mono text-slate-500">Security Audit</div>
            <div className="text-sm font-extrabold text-teal-700">SOC2 Type II</div>
            <div className="text-[9px] text-teal-600 font-medium">Zero-Trust ACL</div>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-teal-100 shadow-2xs text-center">
            <div className="text-[10px] font-mono text-slate-500">FHIR API Rate</div>
            <div className="text-sm font-extrabold text-teal-700">12k req/s</div>
            <div className="text-[9px] text-emerald-600 font-medium">High Concurrency</div>
          </div>
        </div>

        <div className="pt-2 border-t border-teal-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>DECRYPT ON CONSUME</span>
          <span className="text-teal-700 font-bold">100% AUDIT TRAIL</span>
        </div>
      </div>
    );
  }

  // 2. Retail & E-Commerce
  if (key.includes('retail') || key.includes('e-com') || key.includes('store')) {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-amber-500/10 via-white to-orange-500/10 rounded-2xl border border-amber-200/90 p-5 overflow-hidden shadow-sm flex flex-col justify-between ${className}`}>
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shadow-2xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Headless Commerce Architecture</div>
              <div className="text-[10px] font-mono text-amber-700">Global Inventory & Edge Cart</div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
            Sub-second P95
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 my-auto py-2">
          <div className="p-2.5 bg-white rounded-xl border border-amber-100 shadow-2xs text-center">
            <div className="text-[10px] font-mono text-slate-500">Cart Speed</div>
            <div className="text-sm font-extrabold text-amber-700">180ms</div>
            <div className="text-[9px] text-emerald-600 font-medium">Instant Add</div>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-amber-100 shadow-2xs text-center">
            <div className="text-[10px] font-mono text-slate-500">Peak QPS</div>
            <div className="text-sm font-extrabold text-amber-700">45,000</div>
            <div className="text-[9px] text-amber-600 font-medium">Flash Sales</div>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-amber-100 shadow-2xs text-center">
            <div className="text-[10px] font-mono text-slate-500">Checkout Rate</div>
            <div className="text-sm font-extrabold text-emerald-600">+28.4%</div>
            <div className="text-[9px] text-slate-500">One-Click Buy</div>
          </div>
        </div>

        <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>OMNICHANNEL SYNC</span>
          <span className="text-amber-700 font-bold">ZERO STOCK MISMATCH</span>
        </div>
      </div>
    );
  }

  // 3. Financial Services & FinTech
  if (key.includes('fin') || key.includes('bank') || key.includes('wealth')) {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-blue-500/10 via-white to-violet-500/10 rounded-2xl border border-blue-200/90 p-5 overflow-hidden shadow-sm flex flex-col justify-between ${className}`}>
        <div className="absolute top-0 right-0 w-36 h-36 bg-blue-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between border-b border-blue-200/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[#1266E8] shadow-2xs">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">High-Frequency Ledger Engine</div>
              <div className="text-[10px] font-mono text-[#1266E8]">PCI-DSS Level 1 Compliant</div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold">
            ACID Verified
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 my-auto py-2">
          <div className="p-2.5 bg-white rounded-xl border border-blue-100 shadow-2xs text-center">
            <div className="text-[10px] font-mono text-slate-500">Settlement</div>
            <div className="text-sm font-extrabold text-[#1266E8]">&lt;15ms</div>
            <div className="text-[9px] text-emerald-600 font-medium">Real-Time Clearing</div>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-blue-100 shadow-2xs text-center">
            <div className="text-[10px] font-mono text-slate-500">Fraud Detection</div>
            <div className="text-sm font-extrabold text-[#7C3AED]">99.98%</div>
            <div className="text-[9px] text-violet-600 font-medium">Neural Rules</div>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-blue-100 shadow-2xs text-center">
            <div className="text-[10px] font-mono text-slate-500">Encryption</div>
            <div className="text-sm font-extrabold text-blue-900">AES-256</div>
            <div className="text-[9px] text-slate-500">Hardware HSM</div>
          </div>
        </div>

        <div className="pt-2 border-t border-blue-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>DOUBLE ENTRY LEDGER</span>
          <span className="text-[#1266E8] font-bold">0% DATA LOSS</span>
        </div>
      </div>
    );
  }

  // 4. Manufacturing & Industrial IoT
  if (key.includes('manufactur') || key.includes('industrial') || key.includes('iot')) {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-indigo-500/10 via-white to-cyan-500/10 rounded-2xl border border-indigo-200/90 p-5 overflow-hidden shadow-sm flex flex-col justify-between ${className}`}>
        <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between border-b border-indigo-200/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 shadow-2xs">
              <Factory className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Edge Telemetry & Predictive Maintenance</div>
              <div className="text-[10px] font-mono text-indigo-700">MQTT &amp; OPC-UA Gateways</div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-bold">
            Sensors Online
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 my-auto py-2">
          <div className="p-2.5 bg-white rounded-xl border border-indigo-100 shadow-2xs text-center">
            <div className="text-[10px] font-mono text-slate-500">OEE Lift</div>
            <div className="text-sm font-extrabold text-indigo-700">+19.2%</div>
            <div className="text-[9px] text-emerald-600 font-medium">Uptime Gain</div>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-indigo-100 shadow-2xs text-center">
            <div className="text-[10px] font-mono text-slate-500">Telemetry Ingest</div>
            <div className="text-sm font-extrabold text-sky-700">85k msg/s</div>
            <div className="text-[9px] text-sky-600 font-medium">TimescaleDB</div>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-indigo-100 shadow-2xs text-center">
            <div className="text-[10px] font-mono text-slate-500">Anomaly Alert</div>
            <div className="text-sm font-extrabold text-amber-600">&lt;2.1s</div>
            <div className="text-[9px] text-slate-500">Edge Inference</div>
          </div>
        </div>

        <div className="pt-2 border-t border-indigo-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>SCADA COMPATIBLE</span>
          <span className="text-indigo-700 font-bold">FAIL-SAFE REDUNDANCY</span>
        </div>
      </div>
    );
  }

  // 5. Education & EdTech
  if (key.includes('edu') || key.includes('learn') || key.includes('school')) {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-violet-500/10 via-white to-pink-500/10 rounded-2xl border border-violet-200/90 p-5 overflow-hidden shadow-sm flex flex-col justify-between ${className}`}>
        <div className="absolute top-0 right-0 w-36 h-36 bg-violet-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between border-b border-violet-200/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-700 shadow-2xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Adaptive Learning &amp; Assessment</div>
              <div className="text-[10px] font-mono text-violet-700">LTI 1.3 &amp; SCORM Ready</div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200 font-bold">
            Gamified Retention
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 my-auto py-2">
          <div className="p-2.5 bg-white rounded-xl border border-violet-100 shadow-2xs text-center">
            <div className="text-[10px] font-mono text-slate-500">Completion</div>
            <div className="text-sm font-extrabold text-violet-700">+41%</div>
            <div className="text-[9px] text-emerald-600 font-medium">Bite-Sized Modules</div>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-violet-100 shadow-2xs text-center">
            <div className="text-[10px] font-mono text-slate-500">Live Video</div>
            <div className="text-sm font-extrabold text-pink-600">WebRTC</div>
            <div className="text-[9px] text-slate-500">&lt;80ms Jitter</div>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-violet-100 shadow-2xs text-center">
            <div className="text-[10px] font-mono text-slate-500">Concurrent Students</div>
            <div className="text-sm font-extrabold text-emerald-600">50,000+</div>
            <div className="text-[9px] text-slate-500">Auto-Scaling</div>
          </div>
        </div>

        <div className="pt-2 border-t border-violet-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>AI TUTOR ASSIST</span>
          <span className="text-violet-700 font-bold">OFFLINE-FIRST SYNC</span>
        </div>
      </div>
    );
  }

  // 6. Professional Services & Consulting (Default fallback)
  return (
    <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-slate-500/10 via-white to-blue-500/10 rounded-2xl border border-slate-200/90 p-5 overflow-hidden shadow-sm flex flex-col justify-between ${className}`}>
      <div className="absolute top-0 right-0 w-36 h-36 bg-blue-400/15 rounded-full blur-2xl pointer-events-none" />
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shadow-2xs">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">B2B Portal &amp; Contract Automation</div>
            <div className="text-[10px] font-mono text-slate-600">Enterprise SSO &amp; DocuSign</div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 font-bold">
          Role-Based Access
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 my-auto py-2">
        <div className="p-2.5 bg-white rounded-xl border border-slate-100 shadow-2xs text-center">
          <div className="text-[10px] font-mono text-slate-500">Turnaround</div>
          <div className="text-sm font-extrabold text-slate-900">-65%</div>
          <div className="text-[9px] text-emerald-600 font-medium">Faster Sign-Off</div>
        </div>
        <div className="p-2.5 bg-white rounded-xl border border-slate-100 shadow-2xs text-center">
          <div className="text-[10px] font-mono text-slate-500">Security</div>
          <div className="text-sm font-extrabold text-[#1266E8]">SAML 2.0</div>
          <div className="text-[9px] text-slate-500">Okta / Azure AD</div>
        </div>
        <div className="p-2.5 bg-white rounded-xl border border-slate-100 shadow-2xs text-center">
          <div className="text-[10px] font-mono text-slate-500">Client Portal</div>
          <div className="text-sm font-extrabold text-emerald-600">100% White-Label</div>
          <div className="text-[9px] text-slate-500">Multi-Tenant</div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>ENCRYPTED VAULT</span>
        <span className="text-slate-800 font-bold">AUDIT READY</span>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* 2. PROCESS STAGE INTERACTIVE WORKFLOW ILLUSTRATION                         */
/* ========================================================================== */

interface ProcessStageVisualProps {
  stageIndex: number;
}

export const ProcessStageVisual: React.FC<ProcessStageVisualProps> = ({ stageIndex }) => {
  switch (stageIndex) {
    case 0: // 01 Discover
      return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-[10px] font-mono font-bold text-[#1266E8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              AUDIT SCANNER
            </span>
            <span className="text-xs font-mono text-emerald-600 font-bold">14 Stakeholder Interviews</span>
          </div>
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <span className="text-slate-700 font-medium">Architecture Bottleneck Audit</span>
              <span className="text-emerald-600 font-bold">✓ Identified</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <span className="text-slate-700 font-medium">Data Model &amp; Compliance Check</span>
              <span className="text-emerald-600 font-bold">✓ Validated</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <span className="text-slate-700 font-medium">ROI &amp; Delivery Milestones</span>
              <span className="text-blue-600 font-bold">Scope Finalized</span>
            </div>
          </div>
        </div>
      );

    case 1: // 02 Define
      return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-[10px] font-mono font-bold text-[#7C3AED] bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
              TECHNICAL BLUEPRINT
            </span>
            <span className="text-xs font-mono text-violet-700 font-bold">API Contracts &amp; Schemas</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-violet-50/60 rounded-xl border border-violet-100">
              <div className="font-bold text-violet-900 mb-1">Database Schema</div>
              <p className="text-[11px] text-slate-600">PostgreSQL with strict foreign keys &amp; pgvector embeddings</p>
            </div>
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
              <div className="font-bold text-blue-900 mb-1">State &amp; APIs</div>
              <p className="text-[11px] text-slate-600">Typed tRPC / OpenAPI contracts for zero runtime mismatch</p>
            </div>
          </div>
        </div>
      );

    case 2: // 03 Design
      return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-[10px] font-mono font-bold text-[#0D9488] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              DESIGN SYSTEM
            </span>
            <span className="text-xs font-mono text-emerald-600 font-bold">WCAG 2.2 AA Verified</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#1266E8]" />
              <div className="w-4 h-4 rounded-full bg-[#04C8E8]" />
              <div className="w-4 h-4 rounded-full bg-[#5427D9]" />
              <div className="w-4 h-4 rounded-full bg-[#0D9488]" />
              <span className="text-[10px] font-mono text-slate-500 ml-auto">Figma UI Kit v3.4</span>
            </div>
            <div className="text-xs text-slate-700 font-medium">Interactive Prototype Tested with 15 Enterprise Users</div>
          </div>
        </div>
      );

    case 3: // 04 Build
      return (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-md text-white space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] text-slate-400 ml-2">iamtechni-engine // compile</span>
            </div>
            <span className="text-emerald-400 text-[10px]">TypeScript Strict: Pass</span>
          </div>
          <div className="space-y-1 text-slate-300 text-[11px]">
            <div>$ npm run test:unit --coverage</div>
            <div className="text-emerald-400">✓ 142 passing tests (98.4% coverage)</div>
            <div>$ vite build --mode production</div>
            <div className="text-cyan-400">✓ dist/assets/index.js (38.2 kB gzipped)</div>
          </div>
        </div>
      );

    case 4: // 05 Validate
      return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              PERFORMANCE AUDIT
            </span>
            <span className="text-xs font-mono text-emerald-600 font-bold">Score: 100/100</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="text-[10px] font-mono text-slate-500">LCP</div>
              <div className="text-base font-extrabold text-emerald-700">0.6s</div>
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="text-[10px] font-mono text-slate-500">FID</div>
              <div className="text-base font-extrabold text-emerald-700">8ms</div>
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="text-[10px] font-mono text-slate-500">CLS</div>
              <div className="text-base font-extrabold text-emerald-700">0.00</div>
            </div>
          </div>
        </div>
      );

    case 5: // 06 Deploy
      return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              CI/CD DEPLOYMENT
            </span>
            <span className="text-xs font-mono text-emerald-600 font-bold">Zero-Downtime Rollout</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-between">
              <span className="text-slate-800 font-medium">Kubernetes Rolling Update</span>
              <span className="text-emerald-600 font-bold">Pod 12/12 Live</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-800 font-medium">SSL / Cloudflare Edge DNS</span>
              <span className="text-slate-600 font-mono">TLS 1.3 Active</span>
            </div>
          </div>
        </div>
      );

    default: // 07 Improve
      return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              CONTINUOUS TELEMETRY
            </span>
            <span className="text-xs font-mono text-amber-600 font-bold">24/7 Monitoring</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200">
              <div className="text-slate-500 text-[10px]">Cloud FinOps</div>
              <div className="text-sm font-bold text-slate-900">-26% Server Cost</div>
            </div>
            <div className="p-2.5 bg-teal-50/60 rounded-xl border border-teal-200">
              <div className="text-slate-500 text-[10px]">Error Rate</div>
              <div className="text-sm font-bold text-emerald-700">0.001% P99</div>
            </div>
          </div>
        </div>
      );
  }
};
