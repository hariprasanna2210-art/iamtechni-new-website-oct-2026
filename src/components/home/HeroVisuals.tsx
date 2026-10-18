import React from 'react';

interface HeroVisualProps {
  slideIndex: number;
}

export const HeroVisual: React.FC<HeroVisualProps> = ({ slideIndex }) => {
  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/11] max-w-xl mx-auto flex items-center justify-center p-4">
      {/* Background ambient glow matching IAMTECHNI colors */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#1266E8]/10 via-[#04C8E8]/10 to-[#5427D9]/10 rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Container Frame */}
      <div className="relative w-full h-full bg-[#080B11] border border-slate-800/80 rounded-2xl p-6 overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Top subtle technical bar */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#04C8E8]" />
            <span className="text-slate-300 font-medium tracking-wide">
              {slideIndex === 0 && 'ARCHITECTURE // DIGITAL_FOUNDATIONS'}
              {slideIndex === 1 && 'COGNITIVE_CORE // RETRIEVAL_AUGMENTED_AI'}
              {slideIndex === 2 && 'DISTRIBUTED_SYSTEMS // CLOUD_CONTAINERS'}
              {slideIndex === 3 && 'GROWTH_TELEMETRY // CONVERSION_ENGINE'}
            </span>
          </div>
          <span className="text-slate-500 text-[11px] font-mono tabular-nums">
            0{slideIndex + 1} / 04
          </span>
        </div>

        {/* Center Graphic by Slide */}
        <div className="relative flex-1 flex items-center justify-center py-4">
          {slideIndex === 0 && (
            /* Slide 1: Digital Transformation — Isometric Cube & Optical Data Streams */
            <svg viewBox="0 0 400 300" className="w-full h-full max-h-64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="trans-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#04C8E8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#1266E8" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="trans-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1266E8" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#5427D9" stopOpacity="0.4" />
                </linearGradient>
                <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#04C8E8" />
                  <stop offset="100%" stopColor="#1266E8" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Grid Background Plane */}
              <g opacity="0.25" stroke="#334155" strokeWidth="1" strokeDasharray="3 3">
                <line x1="40" y1="230" x2="360" y2="230" />
                <line x1="60" y1="200" x2="340" y2="200" />
                <line x1="90" y1="170" x2="310" y2="170" />
                <line x1="200" y1="60" x2="60" y2="250" />
                <line x1="200" y1="60" x2="340" y2="250" />
                <line x1="200" y1="60" x2="200" y2="270" />
              </g>

              {/* Central Isometric Structure */}
              {/* Top Face */}
              <polygon points="200,80 270,120 200,160 130,120" fill="url(#trans-grad-1)" stroke="#04C8E8" strokeWidth="1.5" />
              {/* Left Face */}
              <polygon points="130,120 200,160 200,240 130,200" fill="url(#trans-grad-2)" stroke="#1266E8" strokeWidth="1.5" />
              {/* Right Face */}
              <polygon points="200,160 270,120 270,200 200,240" fill="#0E1626" stroke="#5427D9" strokeWidth="1.5" />

              {/* Optical Data Tracks */}
              <path d="M60 140 C110 130 140 180 200 160 C260 140 290 190 340 160" stroke="#04C8E8" strokeWidth="2" strokeDasharray="6 4" />
              <path d="M70 210 C120 190 150 240 200 210 C250 180 280 230 330 200" stroke="#5427D9" strokeWidth="1.5" />

              {/* Floating Pulse Nodes */}
              <circle cx="200" cy="80" r="5" fill="#04C8E8" />
              <circle cx="270" cy="120" r="4.5" fill="#1266E8" />
              <circle cx="130" cy="120" r="4.5" fill="#38BDF8" />
              <circle cx="200" cy="160" r="6" fill="#FFFFFF" />
              <circle cx="200" cy="240" r="4" fill="#5427D9" />

              {/* Code Tags */}
              <rect x="75" y="100" width="84" height="22" rx="4" fill="#0F172A" stroke="#334155" />
              <text x="85" y="115" fill="#04C8E8" fontSize="10" fontFamily="JetBrains Mono">ENGINEERING</text>

              <rect x="245" y="215" width="80" height="22" rx="4" fill="#0F172A" stroke="#334155" />
              <text x="255" y="230" fill="#A855F7" fontSize="10" fontFamily="JetBrains Mono">TRANSFORM</text>
            </svg>
          )}

          {slideIndex === 1 && (
            /* Slide 2: AI & Machine Learning — Neural Core & Vector Graph */
            <svg viewBox="0 0 400 300" className="w-full h-full max-h-64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#5427D9" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#1266E8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#04C8E8" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Ambient Circular Aura */}
              <circle cx="200" cy="150" r="85" fill="url(#core-glow)" />

              {/* Concentric Coordinate Rings */}
              <circle cx="200" cy="150" r="105" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
              <circle cx="200" cy="150" r="70" stroke="#1E293B" strokeWidth="1" />
              <circle cx="200" cy="150" r="40" stroke="#04C8E8" strokeWidth="1.5" opacity="0.6" />

              {/* Neural Interconnect Synapses */}
              <line x1="200" y1="150" x2="120" y2="85" stroke="#04C8E8" strokeWidth="1.5" opacity="0.7" />
              <line x1="200" y1="150" x2="280" y2="85" stroke="#5427D9" strokeWidth="1.5" opacity="0.7" />
              <line x1="200" y1="150" x2="100" y2="180" stroke="#1266E8" strokeWidth="1.5" opacity="0.7" />
              <line x1="200" y1="150" x2="300" y2="180" stroke="#04C8E8" strokeWidth="1.5" opacity="0.7" />
              <line x1="200" y1="150" x2="160" y2="245" stroke="#5427D9" strokeWidth="1.5" opacity="0.7" />
              <line x1="200" y1="150" x2="240" y2="245" stroke="#1266E8" strokeWidth="1.5" opacity="0.7" />

              {/* Synapse Nodes */}
              <circle cx="200" cy="150" r="12" fill="#04C8E8" />
              <circle cx="200" cy="150" r="6" fill="#FFFFFF" />

              <circle cx="120" cy="85" r="7" fill="#1266E8" stroke="#04C8E8" strokeWidth="2" />
              <circle cx="280" cy="85" r="7" fill="#5427D9" stroke="#9333EA" strokeWidth="2" />
              <circle cx="100" cy="180" r="6" fill="#04C8E8" />
              <circle cx="300" cy="180" r="6" fill="#1266E8" />
              <circle cx="160" cy="245" r="5" fill="#5427D9" />
              <circle cx="240" cy="245" r="5" fill="#04C8E8" />

              {/* Grounded Citation Badges */}
              <rect x="70" y="60" width="80" height="20" rx="4" fill="#0F172A" stroke="#1E293B" />
              <text x="80" y="74" fill="#94A3B8" fontSize="9" fontFamily="JetBrains Mono">pgvector: 1536d</text>

              <rect x="250" y="60" width="85" height="20" rx="4" fill="#0F172A" stroke="#1E293B" />
              <text x="260" y="74" fill="#38BDF8" fontSize="9" fontFamily="JetBrains Mono">RAG_CITATION</text>
            </svg>
          )}

          {slideIndex === 2 && (
            /* Slide 3: Software & Cloud Engineering — Container Stack & CI/CD */
            <svg viewBox="0 0 400 300" className="w-full h-full max-h-64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="cloud-block-1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
              </defs>

              {/* Cloud Network Tracks */}
              <line x1="50" y1="150" x2="350" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="200" y1="50" x2="200" y2="250" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

              {/* Tier 1: Client Gateway */}
              <rect x="130" y="45" width="140" height="42" rx="8" fill="url(#cloud-block-1)" stroke="#04C8E8" strokeWidth="1.5" />
              <text x="145" y="67" fill="#F8FAFC" fontSize="11" fontWeight="600" fontFamily="Plus Jakarta Sans">Nginx Edge / SSL</text>
              <text x="145" y="80" fill="#64748B" fontSize="9" fontFamily="JetBrains Mono">TLS 1.3 · High Avail</text>

              {/* Tier 2: Microservices Layer */}
              <rect x="70" y="125" width="120" height="48" rx="8" fill="url(#cloud-block-1)" stroke="#1266E8" strokeWidth="1.5" />
              <text x="82" y="148" fill="#F8FAFC" fontSize="11" fontWeight="600" fontFamily="Plus Jakarta Sans">Node.js API</text>
              <text x="82" y="162" fill="#38BDF8" fontSize="9" fontFamily="JetBrains Mono">Pod 1A · AutoScale</text>

              <rect x="210" y="125" width="120" height="48" rx="8" fill="url(#cloud-block-1)" stroke="#1266E8" strokeWidth="1.5" />
              <text x="222" y="148" fill="#F8FAFC" fontSize="11" fontWeight="600" fontFamily="Plus Jakarta Sans">Python Worker</text>
              <text x="222" y="162" fill="#818CF8" fontSize="9" fontFamily="JetBrains Mono">Task Queue · Celery</text>

              {/* Tier 3: Database & Cache Cluster */}
              <rect x="110" y="210" width="180" height="48" rx="8" fill="url(#cloud-block-1)" stroke="#5427D9" strokeWidth="1.5" />
              <text x="125" y="233" fill="#F8FAFC" fontSize="11" fontWeight="600" fontFamily="Plus Jakarta Sans">PostgreSQL Cluster</text>
              <text x="125" y="247" fill="#C084FC" fontSize="9" fontFamily="JetBrains Mono">Primary-Replica · Multi-AZ</text>

              {/* Connecting Data Pulses */}
              <circle cx="200" cy="98" r="3" fill="#04C8E8" />
              <circle cx="130" cy="185" r="3" fill="#1266E8" />
              <circle cx="270" cy="185" r="3" fill="#5427D9" />
            </svg>
          )}

          {slideIndex === 3 && (
            /* Slide 4: Digital Growth — Performance Curves & Conversion Telemetry */
            <svg viewBox="0 0 400 300" className="w-full h-full max-h-64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="growth-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#04C8E8" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#04C8E8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Background Chart Grid */}
              <g opacity="0.2" stroke="#475569" strokeWidth="1">
                <line x1="50" y1="70" x2="350" y2="70" strokeDasharray="3 3" />
                <line x1="50" y1="120" x2="350" y2="120" strokeDasharray="3 3" />
                <line x1="50" y1="170" x2="350" y2="170" strokeDasharray="3 3" />
                <line x1="50" y1="220" x2="350" y2="220" />
              </g>

              {/* Growth Trajectory Curve */}
              <path
                d="M50 215 C100 210, 130 195, 170 160 C210 125, 260 135, 300 90 C320 65, 340 55, 350 48"
                fill="none"
                stroke="#04C8E8"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Area under curve */}
              <path
                d="M50 215 C100 210, 130 195, 170 160 C210 125, 260 135, 300 90 C320 65, 340 55, 350 48 L350 220 L50 220 Z"
                fill="url(#growth-fill)"
              />

              {/* Secondary Trajectory (SEO / Search Visibility) */}
              <path
                d="M50 218 C110 215, 150 180, 200 170 C250 160, 290 130, 350 100"
                fill="none"
                stroke="#5427D9"
                strokeWidth="2"
                strokeDasharray="5 3"
              />

              {/* Milestone Dots */}
              <circle cx="170" cy="160" r="5" fill="#1266E8" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="300" cy="90" r="5.5" fill="#04C8E8" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="350" cy="48" r="6" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" />

              {/* Metric Card Overlay */}
              <g transform="translate(60, 80)">
                <rect width="105" height="50" rx="6" fill="#0F172A" stroke="#334155" />
                <text x="12" y="22" fill="#64748B" fontSize="9" fontFamily="JetBrains Mono">SEARCH VISIBILITY</text>
                <text x="12" y="42" fill="#38BDF8" fontSize="16" fontWeight="700" fontFamily="Plus Jakarta Sans">+140%</text>
              </g>

              <g transform="translate(240, 160)">
                <rect width="105" height="50" rx="6" fill="#0F172A" stroke="#334155" />
                <text x="12" y="22" fill="#64748B" fontSize="9" fontFamily="JetBrains Mono">CONVERSION RATE</text>
                <text x="12" y="42" fill="#A855F7" fontSize="16" fontWeight="700" fontFamily="Plus Jakarta Sans">3.8x</text>
              </g>
            </svg>
          )}
        </div>

        {/* Bottom Technical Spec Bar */}
        <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span>ENGINE: ENTERPRISE_VITE</span>
            <span>·</span>
            <span>STACK: REACT_TS</span>
          </div>
          <span className="text-[#04C8E8]">STATUS: PRODUCTION_READY</span>
        </div>
      </div>
    </div>
  );
};
