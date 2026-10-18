import React, { useState } from 'react';
import { Sparkles, Cloud, Cpu, ShieldCheck, Zap, Layers, Activity, Server, Radio, ArrowUpRight } from 'lucide-react';

interface DigitalEcosystemIllustrationProps {
  className?: string;
  onExploreServices?: () => void;
  onDiscussProject?: () => void;
}

export const DigitalEcosystemIllustration: React.FC<DigitalEcosystemIllustrationProps> = ({
  className = '',
  onExploreServices,
  onDiscussProject,
}) => {
  const [activeLayer, setActiveLayer] = useState<'all' | 'ai' | 'cloud'>('all');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Outer Glow & Ambient Lighting (Cyan & Violet Halo) */}
      <div className="absolute -top-6 -left-6 w-72 h-72 bg-[#04C8E8]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-6 -right-6 w-80 h-80 bg-[#5427D9]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1266E8]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Glassmorphic Container with Light Palette */}
      <div className="relative rounded-3xl bg-gradient-to-b from-white/95 via-white/85 to-[#F4F8FF]/90 backdrop-blur-xl border border-white/80 shadow-[0_20px_50px_rgba(18,102,232,0.12),0_1px_3px_rgba(0,0,0,0.05)] p-4 sm:p-6 overflow-hidden">
        
        {/* Subtle Isometric Background Grid (High Contrast Slate) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:28px_28px] opacity-40 pointer-events-none" />

        {/* Top Control Bar: Glassmorphic Capsule */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 pb-3 mb-2 border-b border-slate-200/60">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#04C8E8] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1266E8]" />
            </span>
            <div className="text-xs font-bold text-slate-800 tracking-tight">
              3D Digital Ecosystem Architecture
            </div>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 font-semibold">
              Live Topology
            </span>
          </div>

          {/* Interactive Layer Filter Tabs */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100/80 border border-slate-200/80 shadow-2xs text-[11px] font-medium">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeLayer === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unified Ecosystem
            </button>
            <button
              onClick={() => setActiveLayer('ai')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeLayer === 'ai'
                  ? 'bg-[#5427D9] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-3 h-3 text-[#04C8E8]" />
              <span>Neural AI</span>
            </button>
            <button
              onClick={() => setActiveLayer('cloud')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeLayer === 'cloud'
                  ? 'bg-[#1266E8] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cloud className="w-3 h-3 text-cyan-200" />
              <span>Cloud Mesh</span>
            </button>
          </div>
        </div>

        {/* 3D-INSPIRED ABSTRACT DIGITAL ECOSYSTEM SVG ILLUSTRATION */}
        <div className="relative z-10 w-full aspect-[16/11] sm:aspect-[16/10] flex items-center justify-center">
          <svg
            viewBox="0 0 600 420"
            className="w-full h-full select-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradients for Geometric Lines and Neural Pathways */}
              <linearGradient id="cyan-to-blue-line" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#04C8E8" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#1266E8" stopOpacity="0.85" />
              </linearGradient>

              <linearGradient id="blue-to-violet-line" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1266E8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#5427D9" stopOpacity="0.95" />
              </linearGradient>

              <linearGradient id="cyan-to-violet-line" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#04C8E8" stopOpacity="1" />
                <stop offset="50%" stopColor="#1266E8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="1" />
              </linearGradient>

              {/* Translucent Glassmorphic Gradients */}
              <linearGradient id="glass-plane-top" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#F1F7FF" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#E6F2FF" stopOpacity="0.45" />
              </linearGradient>

              <linearGradient id="glass-plane-mid" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FAF5FF" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#F3E8FF" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#EDE9FE" stopOpacity="0.35" />
              </linearGradient>

              <linearGradient id="glass-plane-base" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0FDFA" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#E0F2FE" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.3" />
              </linearGradient>

              {/* Specular White Highlights */}
              <linearGradient id="specular-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
              </linearGradient>

              {/* Glow Filters for High Contrast */}
              <filter id="soft-glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="soft-glow-violet" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="node-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0F172A" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* ================================================================= */}
            {/* LAYER 1 (BASE TIER): 3D ISOMETRIC CLOUD PLATFORM PLANE            */}
            {/* ================================================================= */}
            <g
              className={`transition-opacity duration-500 ${
                activeLayer === 'ai' ? 'opacity-25' : 'opacity-100'
              }`}
            >
              {/* Isometric Base Grid Matrix */}
              <g stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4" opacity="0.6">
                <line x1="100" y1="280" x2="300" y2="390" />
                <line x1="200" y1="230" x2="400" y2="340" />
                <line x1="300" y1="180" x2="500" y2="290" />
                <line x1="300" y1="390" x2="500" y2="280" />
                <line x1="200" y1="340" x2="400" y2="230" />
                <line x1="100" y1="290" x2="300" y2="180" />
              </g>

              {/* Translucent Frosted Glass Base Tier (Cloud Foundation) */}
              <polygon
                points="300,240 500,320 300,400 100,320"
                fill="url(#glass-plane-base)"
                stroke="#04C8E8"
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
              <line
                x1="100"
                y1="320"
                x2="300"
                y2="240"
                stroke="url(#specular-highlight)"
                strokeWidth="2"
              />

              {/* Cloud Storage & Distributed Clusters on Base Tier */}
              {/* Cloud Node 1: Primary Region */}
              <g transform="translate(180, 310)">
                <polygon points="0,-16 26,-2 0,12 -26,-2" fill="#FFFFFF" stroke="#04C8E8" strokeWidth="1.5" />
                <polygon points="-26,-2 0,12 0,26 -26,12" fill="#E0F2FE" stroke="#04C8E8" strokeWidth="1.2" />
                <polygon points="0,12 26,-2 26,12 0,26" fill="#BAE6FD" stroke="#04C8E8" strokeWidth="1.2" />
                <circle cx="0" cy="-2" r="3" fill="#04C8E8" />
              </g>

              {/* Cloud Node 2: Secondary Region */}
              <g transform="translate(420, 310)">
                <polygon points="0,-16 26,-2 0,12 -26,-2" fill="#FFFFFF" stroke="#1266E8" strokeWidth="1.5" />
                <polygon points="-26,-2 0,12 0,26 -26,12" fill="#DBEAFE" stroke="#1266E8" strokeWidth="1.2" />
                <polygon points="0,12 26,-2 26,12 0,26" fill="#BFDBFE" stroke="#1266E8" strokeWidth="1.2" />
                <circle cx="0" cy="-2" r="3" fill="#1266E8" />
              </g>

              {/* Inter-Region Data Bus (High Contrast Cyan Line with Optical Pulse) */}
              <path
                d="M 180 322 Q 300 370 420 322"
                stroke="#0284C7"
                strokeWidth="2.5"
                strokeDasharray="6 3"
              />
              <path
                d="M 180 322 Q 300 370 420 322"
                stroke="#04C8E8"
                strokeWidth="1.5"
                filter="url(#soft-glow-cyan)"
              />
            </g>

            {/* ================================================================= */}
            {/* LAYER 2 (MIDDLE TIER): FLOATING GLASS ISOMETRIC AI NEURAL CORE    */}
            {/* ================================================================= */}
            <g
              className={`transition-opacity duration-500 ${
                activeLayer === 'cloud' ? 'opacity-30' : 'opacity-100'
              }`}
            >
              {/* Vertical Dimensional Optical Conduits between Base & Middle */}
              <g stroke="#7C3AED" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.65">
                <line x1="180" y1="310" x2="190" y2="190" />
                <line x1="420" y1="310" x2="410" y2="190" />
                <line x1="300" y1="360" x2="300" y2="240" />
              </g>

              {/* Middle Floating Glass Plane (Frosted Lavender Tint) */}
              <polygon
                points="300,120 480,195 300,270 120,195"
                fill="url(#glass-plane-mid)"
                stroke="#7C3AED"
                strokeWidth="1.8"
                strokeOpacity="0.8"
                filter="url(#node-shadow)"
              />
              <line
                x1="120"
                y1="195"
                x2="300"
                y2="120"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeOpacity="0.9"
              />

              {/* Neural Network Interconnect Web (Geometric Cyan & Violet Lines) */}
              <g strokeWidth="2" strokeLinecap="round">
                {/* Cross Connections */}
                <line x1="300" y1="195" x2="200" y2="165" stroke="url(#cyan-to-violet-line)" />
                <line x1="300" y1="195" x2="400" y2="165" stroke="url(#blue-to-violet-line)" />
                <line x1="300" y1="195" x2="230" y2="230" stroke="url(#cyan-to-blue-line)" />
                <line x1="300" y1="195" x2="370" y2="230" stroke="url(#cyan-to-violet-line)" />
                <line x1="200" y1="165" x2="300" y2="135" stroke="#04C8E8" strokeDasharray="4 2" />
                <line x1="400" y1="165" x2="300" y2="135" stroke="#7C3AED" strokeDasharray="4 2" />
                <line x1="230" y1="230" x2="300" y2="255" stroke="#04C8E8" strokeDasharray="4 2" />
                <line x1="370" y1="230" x2="300" y2="255" stroke="#7C3AED" strokeDasharray="4 2" />
              </g>

              {/* Neural Node: Left (Ingestion Vector) */}
              <g
                transform="translate(200, 165)"
                className="cursor-pointer transition-transform hover:scale-125"
                onMouseEnter={() => setHoveredNode('vector')}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle cx="0" cy="0" r="14" fill="#04C8E8" fillOpacity="0.2" />
                <circle cx="0" cy="0" r="9" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" filter="url(#node-shadow)" />
                <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
              </g>

              {/* Neural Node: Right (Reranker & Citations) */}
              <g
                transform="translate(400, 165)"
                className="cursor-pointer transition-transform hover:scale-125"
                onMouseEnter={() => setHoveredNode('citations')}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle cx="0" cy="0" r="14" fill="#7C3AED" fillOpacity="0.2" />
                <circle cx="0" cy="0" r="9" fill="#5427D9" stroke="#FFFFFF" strokeWidth="2" filter="url(#node-shadow)" />
                <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
              </g>

              {/* Neural Node: Bottom Left (Embedding Cluster) */}
              <g
                transform="translate(230, 230)"
                className="cursor-pointer transition-transform hover:scale-125"
                onMouseEnter={() => setHoveredNode('embedding')}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle cx="0" cy="0" r="12" fill="#04C8E8" fillOpacity="0.2" />
                <circle cx="0" cy="0" r="7" fill="#04C8E8" stroke="#FFFFFF" strokeWidth="1.5" />
              </g>

              {/* Neural Node: Bottom Right (Zero-Leakage Guardrail) */}
              <g
                transform="translate(370, 230)"
                className="cursor-pointer transition-transform hover:scale-125"
                onMouseEnter={() => setHoveredNode('guardrail')}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle cx="0" cy="0" r="12" fill="#7C3AED" fillOpacity="0.2" />
                <circle cx="0" cy="0" r="7" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="1.5" />
              </g>

              {/* CENTRAL COGNITIVE CORE: 3D Pulsing Multilayer Neural Center */}
              <g
                transform="translate(300, 195)"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode('core')}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Radiating Concentric Halos */}
                <circle cx="0" cy="0" r="32" stroke="#04C8E8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" className="animate-spin origin-center" />
                <circle cx="0" cy="0" r="24" stroke="#5427D9" strokeWidth="1.5" opacity="0.8" />
                <circle cx="0" cy="0" r="18" fill="#FFFFFF" filter="url(#node-shadow)" />
                {/* 3D Sphere Core */}
                <circle cx="0" cy="0" r="13" fill="url(#blue-to-violet-line)" />
                <circle cx="-3" cy="-3" r="5" fill="#04C8E8" />
                <circle cx="-4" cy="-4" r="2" fill="#FFFFFF" />
              </g>
            </g>

            {/* ================================================================= */}
            {/* LAYER 3 (TOP TIER): FLOATING GLASS HEADS-UP INTERFACE PANELS      */}
            {/* ================================================================= */}
            {/* Floating Glass Tag 1: Neural Vector Precision (Top-Left) */}
            <g transform="translate(130, 75)" className="filter drop-shadow-md">
              <rect
                x="0"
                y="0"
                width="135"
                height="46"
                rx="12"
                fill="#FFFFFF"
                fillOpacity="0.9"
                stroke="#04C8E8"
                strokeWidth="1.5"
              />
              <circle cx="16" cy="18" r="4.5" fill="#0284C7" />
              <text x="27" y="21" fill="#0F172A" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif">
                Neural Vector Core
              </text>
              <text x="14" y="36" fill="#0284C7" fontSize="10" fontWeight="600" fontFamily="JetBrains Mono, monospace">
                1536-dim • 99.4% Rec
              </text>
            </g>

            {/* Floating Glass Tag 2: Cloud Orchestration Mesh (Top-Right) */}
            <g transform="translate(355, 60)" className="filter drop-shadow-md">
              <rect
                x="0"
                y="0"
                width="145"
                height="46"
                rx="12"
                fill="#FFFFFF"
                fillOpacity="0.9"
                stroke="#5427D9"
                strokeWidth="1.5"
              />
              <circle cx="16" cy="18" r="4.5" fill="#7C3AED" />
              <text x="27" y="21" fill="#0F172A" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif">
                Multi-Cloud Fabric
              </text>
              <text x="14" y="36" fill="#6D28D9" fontSize="10" fontWeight="600" fontFamily="JetBrains Mono, monospace">
                48 Regions • 99.99% SLA
              </text>
            </g>

            {/* Floating Glass Tag 3: Sub-second Latency Metric (Bottom-Center) */}
            <g transform="translate(210, 360)" className="filter drop-shadow-md">
              <rect
                x="0"
                y="0"
                width="180"
                height="38"
                rx="19"
                fill="#FFFFFF"
                fillOpacity="0.95"
                stroke="#1266E8"
                strokeWidth="1.5"
              />
              <circle cx="20" cy="19" r="4" fill="#10B981" />
              <text x="32" y="23" fill="#1E293B" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif">
                Zero-Leakage Private Enclave
              </text>
            </g>

            {/* Glowing Connecting Optical Beams from Central Core to Floating Tags */}
            <path
              d="M 300 195 Q 240 130 195 121"
              stroke="#04C8E8"
              strokeWidth="1.8"
              strokeDasharray="4 3"
              opacity="0.8"
            />
            <path
              d="M 300 195 Q 360 120 425 106"
              stroke="#7C3AED"
              strokeWidth="1.8"
              strokeDasharray="4 3"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Dynamic Context Notification Banner (Based on Node Hover) */}
        <div className="relative z-20 mt-2 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-[#1266E8]" />
            <span className="font-semibold text-slate-900">
              {hoveredNode === 'core' && 'Central Cognitive Core: Transformer inference & semantic reranking engine.'}
              {hoveredNode === 'vector' && 'Neural Vector Pipeline: BM25 + dense embedding hybrid search.'}
              {hoveredNode === 'citations' && 'Deterministic Citations: 100% verifiable source attribution.'}
              {hoveredNode === 'embedding' && 'Private Vector Embeddings: Ingested locally without public exposure.'}
              {hoveredNode === 'guardrail' && 'Zero-Leakage Guardrail: PII masking and automated prompt defense.'}
              {!hoveredNode && 'Unified Digital Ecosystem: Seamlessly connecting Cloud, AI, and Modern Web.'}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-600 font-medium">
            <span className="text-[#04C8E8] font-bold">CYAN</span>: Cloud Conduits
            <span>•</span>
            <span className="text-[#5427D9] font-bold">VIOLET</span>: AI Neural Weights
          </div>
        </div>
      </div>
    </div>
  );
};
