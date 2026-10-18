import React from 'react';

interface IamtechniLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  variant?: 'default' | 'light' | 'dark' | 'white';
}

/**
 * Official IAMTECHNI Brand Logo & Identity Asset
 * 
 * 100% TRANSPARENT BACKGROUND (zero background plate, zero container box).
 * Exact brand geometry: stylized fluid "it" monogram symbol and modern geometric "iamtechni" wordmark.
 * Precision gradients: Electric Cyan (#00D2FF) -> Vivid Royal Blue (#1266E8) -> High-Tech Violet (#5427D9 / #7C3AED).
 */
export const IamtechniLogo: React.FC<IamtechniLogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
  variant = 'default',
}) => {
  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
  }[size];

  // Distinct ID suffixes to avoid SVG gradient collisions when multiple instances are mounted
  const idSuffix = React.useId().replace(/:/g, '');

  // Wordmark gradient color stops according to background context
  const textGradStops = variant === 'dark' ? (
    <>
      <stop offset="0%" stopColor="#38E1FF" />
      <stop offset="30%" stopColor="#0BA5E9" />
      <stop offset="65%" stopColor="#3B82F6" />
      <stop offset="100%" stopColor="#A855F7" />
    </>
  ) : (
    <>
      <stop offset="0%" stopColor="#00C4EC" />
      <stop offset="28%" stopColor="#0284C7" />
      <stop offset="60%" stopColor="#1266E8" />
      <stop offset="100%" stopColor="#5427D9" />
    </>
  );

  // Symbol only (for favicons, compact badges, mobile icons)
  if (!showWordmark) {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${heightClasses} w-auto aspect-square select-none ${className}`}
        aria-label="IAMTECHNI Brand Symbol"
      >
        <defs>
          <linearGradient id={`sym-grad-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D2FF" />
            <stop offset="50%" stopColor="#1266E8" />
            <stop offset="100%" stopColor="#5427D9" />
          </linearGradient>

          <radialGradient id={`sym-dot-${idSuffix}`} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#5CE7FF" />
            <stop offset="60%" stopColor="#00D2FF" />
            <stop offset="100%" stopColor="#1266E8" />
          </radialGradient>

          <linearGradient id={`sym-wing-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#00D2FF" />
            <stop offset="100%" stopColor="#0072FF" />
          </linearGradient>

          <linearGradient id={`sym-tail-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1266E8" />
            <stop offset="100%" stopColor="#5427D9" />
          </linearGradient>

          <filter id={`sym-glow-${idSuffix}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g transform="translate(-2, 0)">
          {/* Glowing Head Dot ('i' dot) */}
          <circle cx="56" cy="19" r="10.5" fill={`url(#sym-dot-${idSuffix})`} filter={`url(#sym-glow-${idSuffix})`} />

          {/* Left sweeping curved ribbon ('i' stem) */}
          <path
            d="M24 45 C26 35 33 29 46 28 C54 35 56 47 54 59 C52 71 46 81 36 86 C32 78 31 67 27 57 C24 52 23 48 24 45 Z"
            fill={`url(#sym-wing-${idSuffix})`}
          />

          {/* Central spine/torso */}
          <path
            d="M46 30 C40 40 38 53 40 67 C41 76 39 83 31 90 C38 88 45 80 47 71 C50 54 52 41 46 30 Z"
            fill="#1266E8"
          />

          {/* Cyan inner energetic flare */}
          <path
            d="M29 57 C35 67 39 75 37 85 C41 82 44 77 45 70 C45 59 42 51 37 45 C34 49 31 53 29 57 Z"
            fill="#00D2FF"
          />

          {/* Right wing swoop ('t' arm) */}
          <path
            d="M52 34 C63 32 75 38 81 49 C79 57 74 64 68 71 C66 67 65 55 62 46 C59 41 55 37 52 34 Z"
            fill={`url(#sym-grad-${idSuffix})`}
          />

          {/* Dynamic violet sweeping tail */}
          <path
            d="M64 49 C72 49 84 56 87 67 C81 75 72 81 63 85 C69 77 70 68 66 60 C65 56 64 52 64 49 Z"
            fill={`url(#sym-tail-${idSuffix})`}
          />
        </g>
      </svg>
    );
  }

  // Full Brand Logo with Wordmark (100% Transparent, No Background Container)
  return (
    <svg
      viewBox="0 0 380 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${heightClasses} w-auto select-none ${className}`}
      aria-label="IAMTECHNI"
    >
      <defs>
        {/* Symbol full gradient */}
        <linearGradient id={`iam-sym-grad-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D2FF" />
          <stop offset="48%" stopColor="#1266E8" />
          <stop offset="100%" stopColor="#5427D9" />
        </linearGradient>

        {/* Head glow */}
        <radialGradient id={`iam-head-grad-${idSuffix}`} cx="42%" cy="36%" r="62%">
          <stop offset="0%" stopColor="#5CE7FF" />
          <stop offset="60%" stopColor="#00D2FF" />
          <stop offset="100%" stopColor="#1266E8" />
        </radialGradient>

        {/* Wordmark gradient */}
        <linearGradient id={`iam-wordmark-grad-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="0%">
          {textGradStops}
        </linearGradient>

        <linearGradient id={`iam-wing-grad-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#00D2FF" />
          <stop offset="100%" stopColor="#0072FF" />
        </linearGradient>

        <linearGradient id={`iam-tail-grad-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1266E8" />
          <stop offset="100%" stopColor="#5427D9" />
        </linearGradient>

        <filter id={`iam-glow-${idSuffix}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* ================= BRAND SYMBOL ================= */}
      <g transform="translate(6, 2)">
        {/* Glowing Head Dot ('i' dot) */}
        <circle cx="56" cy="20" r="10" fill={`url(#iam-head-grad-${idSuffix})`} filter={`url(#iam-glow-${idSuffix})`} />

        {/* Left sweeping curved ribbon ('i' stem) */}
        <path
          d="M26 46 C28 36 35 30 48 29 C56 36 58 48 56 60 C54 72 48 82 38 87 C34 79 33 68 29 58 C26 53 25 49 26 46 Z"
          fill={`url(#iam-wing-grad-${idSuffix})`}
        />

        {/* Central dynamic torso */}
        <path
          d="M48 31 C42 41 40 54 42 68 C43 77 41 84 33 91 C40 89 47 81 49 72 C52 55 54 42 48 31 Z"
          fill="#1266E8"
        />

        {/* Cyan inner energetic flare */}
        <path
          d="M31 58 C37 68 41 76 39 86 C43 83 46 78 47 71 C47 60 44 52 39 46 C36 50 33 54 31 58 Z"
          fill="#00D2FF"
        />

        {/* Right wing swoop ('t' arm) */}
        <path
          d="M54 35 C65 33 77 39 83 50 C81 58 76 65 70 72 C68 68 67 56 64 47 C61 42 57 38 54 35 Z"
          fill={`url(#iam-sym-grad-${idSuffix})`}
        />

        {/* Dynamic violet sweeping tail */}
        <path
          d="M66 50 C74 50 86 57 89 68 C83 76 74 82 65 86 C71 78 72 69 68 61 C67 57 66 53 66 50 Z"
          fill={`url(#iam-tail-grad-${idSuffix})`}
        />
      </g>

      {/* ================= WORDMARK: iamtechni ================= */}
      {/* 100% Transparent typography */}
      <g transform="translate(112, 0)">
        <text
          x="0"
          y="62"
          fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="46"
          fontWeight="800"
          letterSpacing="-0.035em"
          fill={variant === 'white' ? '#FFFFFF' : `url(#iam-wordmark-grad-${idSuffix})`}
        >
          iamtechni
        </text>
      </g>
    </svg>
  );
};
