import React from 'react';

interface HeroDarkBackgroundProps {
  activeAccentHex?: string;
  activeSecondaryHex?: string;
}

export const HeroDarkBackground: React.FC<HeroDarkBackgroundProps> = ({
  activeAccentHex = '#00D2FF',
  activeSecondaryHex = '#7C3AED',
}) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none bg-[#040814]"
    >
      {/* 1. Deep Midnight Navy & Charcoal Base Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 80% at 50% 42%, #0A1836 0%, #060E22 52%, #030712 100%)',
        }}
      />

      {/* 2. Subtle Ambient Cyan / Electric Blue Left & Center-Stage Illumination */}
      <div
        className="absolute -top-[18%] left-[4%] w-[46rem] h-[46rem] rounded-full opacity-25 blur-[130px] transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle, ${activeAccentHex} 0%, rgba(8, 123, 250, 0.25) 48%, transparent 74%)`,
        }}
      />

      {/* 3. Restrained Purple Accent Illumination on Upper-Right Visual Stage */}
      <div
        className="absolute top-[8%] right-[2%] w-[42rem] h-[42rem] rounded-full opacity-20 blur-[140px] transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle, ${activeSecondaryHex} 0%, rgba(124, 58, 237, 0.22) 45%, transparent 72%)`,
        }}
      />

      {/* 4. Soft Radial Halo Glow Directly Behind the Central Robot */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] sm:w-[38rem] lg:w-[44rem] h-[30rem] sm:h-[38rem] lg:h-[44rem] rounded-full opacity-35 blur-[90px]"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 210, 255, 0.34) 0%, rgba(37, 99, 235, 0.18) 38%, rgba(124, 58, 237, 0.08) 62%, transparent 78%)',
        }}
      />

      {/* 5. Faint Precision Technical Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(56, 189, 248, 0.45) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.45) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse 85% 75% at 50% 48%, black 25%, transparent 90%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 85% 75% at 50% 48%, black 25%, transparent 90%)',
        }}
      />

      {/* 6. Subtle Circuit-Board Traces & Fixed Geometric Architectural Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.18]"
        viewBox="0 0 1600 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="heroCircuitCyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0" />
            <stop offset="45%" stopColor="#00D2FF" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="heroCircuitPurple" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
            <stop offset="50%" stopColor="#00D2FF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Left Architectural Circuit Traces */}
        <path
          d="M 40 160 H 240 L 290 210 H 520"
          stroke="url(#heroCircuitCyan)"
          strokeWidth="1.2"
        />
        <circle cx="290" cy="210" r="3" fill="#00D2FF" fillOpacity="0.55" />
        <path
          d="M 80 730 H 310 L 360 680 H 590"
          stroke="url(#heroCircuitCyan)"
          strokeWidth="1.2"
        />
        <circle cx="360" cy="680" r="3" fill="#38BDF8" fillOpacity="0.5" />

        {/* Right Architectural Circuit Traces */}
        <path
          d="M 1560 180 H 1340 L 1290 230 H 1060"
          stroke="url(#heroCircuitPurple)"
          strokeWidth="1.2"
        />
        <circle cx="1290" cy="230" r="3" fill="#A78BFA" fillOpacity="0.55" />
        <path
          d="M 1520 720 H 1280 L 1230 670 H 1020"
          stroke="url(#heroCircuitPurple)"
          strokeWidth="1.2"
        />
        <circle cx="1230" cy="670" r="3" fill="#00D2FF" fillOpacity="0.5" />

        {/* Central Stage Concentric Technical Rings */}
        <circle
          cx="800"
          cy="440"
          r="255"
          stroke="#00D2FF"
          strokeOpacity="0.14"
          strokeWidth="1"
          strokeDasharray="6 10"
        />
        <circle
          cx="800"
          cy="440"
          r="325"
          stroke="#3B82F6"
          strokeOpacity="0.1"
          strokeWidth="1"
        />
        <circle
          cx="800"
          cy="440"
          r="395"
          stroke="#8B5CF6"
          strokeOpacity="0.08"
          strokeWidth="1"
          strokeDasharray="3 14"
        />

        {/* Fixed Corner Calibration Reticles */}
        <g stroke="#38BDF8" strokeOpacity="0.3" strokeWidth="1.2">
          <path d="M 48 64 V 44 H 68" />
          <path d="M 1552 64 V 44 H 1532" />
          <path d="M 48 836 V 856 H 68" />
          <path d="M 1552 836 V 856 H 1532" />
        </g>
      </svg>

      {/* 7. Top & Bottom Vignette for Seamless Header/Section Transitions */}
      <div
        className="absolute inset-x-0 top-0 h-24"
        style={{
          background:
            'linear-gradient(to bottom, rgba(3, 7, 18, 0.72) 0%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-28"
        style={{
          background:
            'linear-gradient(to top, rgba(3, 7, 18, 0.92) 0%, transparent 100%)',
        }}
      />
    </div>
  );
};
