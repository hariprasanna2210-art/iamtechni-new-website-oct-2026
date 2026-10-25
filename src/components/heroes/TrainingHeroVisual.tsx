import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Cpu,
  Cloud,
  Database,
  Bot,
  Sparkles,
  Workflow,
  ShieldCheck,
  CheckCircle2,
  Laptop,
} from 'lucide-react';

interface TrainingHeroVisualProps {
  className?: string;
}

export const TrainingHeroVisual: React.FC<TrainingHeroVisualProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'cloud' | 'ai'>('editor');

  return (
    <div className={`relative w-full max-w-lg mx-auto ${className}`}>
      {/* Ambient Halo Glows */}
      <div className="absolute -top-8 -left-8 w-64 h-64 bg-[#04C8E8]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-[#5427D9]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#1266E8]/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Glassmorphic Laptop & Tech Composition Container */}
      <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-[0_20px_50px_rgba(18,102,232,0.14),0_1px_3px_rgba(0,0,0,0.06)] p-4 sm:p-6 overflow-hidden">
        
        {/* Top Window Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-3 h-3 rounded-full bg-rose-400 shrink-0" />
            <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
            <span className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-[11px] font-mono font-bold text-slate-700 ml-1 truncate">
              iamtechni-lab // main.ts
            </span>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-[11px] font-mono">
            <button
              onClick={() => setActiveTab('editor')}
              className={`min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 inline-flex items-center justify-center px-2.5 md:px-2 py-0.5 rounded transition-all cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-white text-[#1266E8] font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              FullStack
            </button>
            <button
              onClick={() => setActiveTab('cloud')}
              className={`min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 inline-flex items-center justify-center px-2.5 md:px-2 py-0.5 rounded transition-all cursor-pointer ${
                activeTab === 'cloud'
                  ? 'bg-white text-[#04C8E8] font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cloud
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 inline-flex items-center justify-center px-2.5 md:px-2 py-0.5 rounded transition-all cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-white text-[#7C3AED] font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              AI &amp; Data
            </button>
          </div>
        </div>

        {/* Realistic Interactive Code & Lab Editor Screen */}
        <div className="relative bg-[#0B1120] rounded-2xl p-3.5 sm:p-4 font-mono text-xs text-slate-200 border border-slate-800 shadow-inner overflow-x-auto min-h-[200px]">
          {/* Subtle line numbers & syntax */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80 text-[10px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-emerald-400 font-bold">READY TO EXECUTE</span>
            </div>
            <span>TypeScript 5.8 · Docker Pod</span>
          </div>

          {activeTab === 'editor' && (
            <div className="pt-3 space-y-1 text-[11px] leading-relaxed">
              <p>
                <span className="text-purple-400">import</span> &#123;{' '}
                <span className="text-cyan-300">FastAPI</span>,{' '}
                <span className="text-cyan-300">PostgreSQL</span>,{' '}
                <span className="text-cyan-300">NextAuth</span> &#125;{' '}
                <span className="text-purple-400">from</span>{' '}
                <span className="text-emerald-300">'@iamtechni/stack'</span>;
              </p>
              <p className="pt-1 text-slate-500">// 1. Build Production-Grade Full Stack App</p>
              <p>
                <span className="text-blue-400">const</span>{' '}
                <span className="text-amber-300">studentApp</span> ={' '}
                <span className="text-purple-400">new</span>{' '}
                <span className="text-cyan-300">FullStackProject</span>(&#123;
              </p>
              <p className="pl-4">
                frontend: <span className="text-emerald-300">'React 19 + TypeScript'</span>,
              </p>
              <p className="pl-4">
                backend: <span className="text-emerald-300">'Node.js / Python API'</span>,
              </p>
              <p className="pl-4">
                database: <span className="text-emerald-300">'PostgreSQL Vector Mesh'</span>,
              </p>
              <p className="pl-4">
                deployment: <span className="text-emerald-300">'AWS Container + CI/CD'</span>
              </p>
              <p>&#125;);</p>
              <p className="pt-1 text-cyan-300">
                &gt; yarn test:all <span className="text-emerald-400">✓ 142 passing (1.2s)</span>
              </p>
            </div>
          )}

          {activeTab === 'cloud' && (
            <div className="pt-3 space-y-1 text-[11px] leading-relaxed">
              <p className="text-slate-500">// 2. Infrastructure as Code (AWS &amp; Azure)</p>
              <p>
                <span className="text-purple-400">resource</span>{' '}
                <span className="text-emerald-300">"aws_ecs_cluster"</span>{' '}
                <span className="text-amber-300">"iamtechni_core"</span> &#123;
              </p>
              <p className="pl-4">
                name = <span className="text-emerald-300">"production-student-cohort"</span>
              </p>
              <p className="pl-4">
                capacity_providers = [<span className="text-emerald-300">"FARGATE"</span>,{' '}
                <span className="text-emerald-300">"FARGATE_SPOT"</span>]
              </p>
              <p>&#125;</p>
              <p className="pt-1 text-emerald-400">
                &gt; terraform apply -auto-approve
              </p>
              <p className="text-slate-400">
                Apply complete! Resources: 14 added, 0 changed, 0 destroyed.
              </p>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="pt-3 space-y-1 text-[11px] leading-relaxed">
              <p className="text-slate-500">// 3. Applied Machine Learning &amp; RAG</p>
              <p>
                <span className="text-purple-400">from</span> langchain_community{' '}
                <span className="text-purple-400">import</span> VectorPipeline
              </p>
              <p>
                <span className="text-blue-400">rag_model</span> = VectorPipeline(
              </p>
              <p className="pl-4">
                embeddings=<span className="text-emerald-300">'text-embedding-3-small'</span>,
              </p>
              <p className="pl-4">
                vector_store=<span className="text-cyan-300">pgvector_client</span>
              </p>
              <p>)</p>
              <p className="pt-1 text-purple-300">
                &gt; Accuracy: 98.7% · Citations: Verified
              </p>
            </div>
          )}
        </div>

        {/* Floating Interactive Badge Elements */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200/80">
          <div className="p-2.5 rounded-xl bg-[#EAF3FF] border border-blue-200/90 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1266E8] text-white flex items-center justify-center shrink-0">
              <Code2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-[#1266E8] font-bold uppercase truncate">
                Dev &amp; Python
              </div>
              <div className="text-[11px] font-bold text-slate-900 truncate">Practical Labs</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#E4FAFF] border border-cyan-200/90 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0284C7] text-white flex items-center justify-center shrink-0">
              <Cloud className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-[#0284C7] font-bold uppercase truncate">
                AWS &amp; Azure
              </div>
              <div className="text-[11px] font-bold text-slate-900 truncate">Cloud Topologies</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F0EAFF] border border-violet-200/90 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#7C3AED] text-white flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-[#7C3AED] font-bold uppercase truncate">
                AI &amp; DevOps
              </div>
              <div className="text-[11px] font-bold text-slate-900 truncate">Applied RAG</div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
            <span>100% Practical &amp; Industry-Aligned Curriculum</span>
          </span>
          <span className="text-[#1266E8] font-bold">BATCHES OPEN</span>
        </div>
      </div>
    </div>
  );
};
