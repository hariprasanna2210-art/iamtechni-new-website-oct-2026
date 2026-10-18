import React from 'react';

interface IamtechniLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
}

/**
 * Official IAMTECHNI brand asset.
 * Rendered with a 100% TRANSPARENT background (zero box, zero plate, zero container).
 * Preserves the exact stylized cyan/blue/violet "it" symbol and "iamtechni" wordmark
 * with exact brand gradient colors (#04C8E8 -> #1266E8 -> #5427D9).
 */
export const IamtechniLogo: React.FC<IamtechniLogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
}) => {
  const heightClasses = {
    sm: 'h-7 sm:h-8',
    md: 'h-9 sm:h-10',
    lg: 'h-11 sm:h-12',
    xl: 'h-14 sm:h-16',
  }[size];

  // Symbol only (for favicon, mobile compact avatars, etc.)
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
          <linearGradient id="sym-grad-cyan-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#04C8E8" />
            <stop offset="55%" stopColor="#1266E8" />
            <stop offset="100%" stopColor="#5427D9" />
          </linearGradient>
          <radialGradient id="sym-head-glow" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#38E1FF" />
            <stop offset="70%" stopColor="#04C8E8" />
            <stop offset="100%" stopColor="#1266E8" />
          </radialGradient>
          <filter id="sym-soft-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Head Sphere (dot of the 'i') */}
        <circle cx="50" cy="20" r="9" fill="url(#sym-head-glow)" filter="url(#sym-soft-blur)" />

        {/* Sweeping left ribbon ('i' body) */}
        <path
          d="M24 45 C28 34 38 32 48 32 C54 42 55 54 53 66 C51 77 45 86 36 91 C33 83 31 71 27 61 C24 55 23 50 24 45 Z"
          fill="url(#sym-grad-cyan-blue)"
        />

        {/* Central blue fluid torso */}
        <path
          d="M48 34 C43 42 42 55 43 68 C44 77 42 84 35 91 C41 89 47 82 48 74 C51 58 53 45 48 34 Z"
          fill="#1266E8"
        />

        {/* Dynamic 't' wing sweep flowing to violet */}
        <path
          d="M52 38 C62 36 73 42 78 52 C76 60 70 66 65 74 C63 70 63 58 60 48 C58 43 55 40 52 38 Z"
          fill="url(#sym-grad-cyan-blue)"
        />
        <path
          d="M62 52 C70 52 81 58 84 69 C79 77 70 83 62 87 C67 79 69 70 65 62 C64 58 63 55 62 52 Z"
          fill="#5427D9"
        />
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
        {/* Symbol gradient */}
        <linearGradient id="iam-sym-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#04C8E8" />
          <stop offset="48%" stopColor="#1266E8" />
          <stop offset="100%" stopColor="#5427D9" />
        </linearGradient>

        {/* Head glow */}
        <radialGradient id="iam-head-grad" cx="45%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#5CE7FF" />
          <stop offset="65%" stopColor="#04C8E8" />
          <stop offset="100%" stopColor="#1266E8" />
        </radialGradient>

        {/* Wordmark gradient: electric cyan -> vibrant royal blue -> deep violet */}
        <linearGradient id="iam-wordmark-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#04C8E8" />
          <stop offset="28%" stopColor="#0BA5E9" />
          <stop offset="55%" stopColor="#1266E8" />
          <stop offset="82%" stopColor="#3B34E0" />
          <stop offset="100%" stopColor="#5427D9" />
        </linearGradient>

        <filter id="iam-glow" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* ================= SYMBOL ================= */}
      <g transform="translate(4, 0)">
        {/* Glowing Head Dot */}
        <circle cx="56" cy="22" r="9.5" fill="url(#iam-head-grad)" filter="url(#iam-glow)" />

        {/* Left sweeping curved wing (cyan to blue) */}
        <path
          d="M26 48 C28 42 34 33 46 32 C54 39 56 49 55 60 C54 71 49 80 40 85 C37 77 35 66 31 58 C28 54 26 51 26 48 Z"
          fill="url(#iam-sym-grad)"
        />

        {/* Central spine/downward swoop */}
        <path
          d="M49 34 C44 42 42 54 44 67 C45 76 43 83 36 90 C42 88 48 81 49 73 C52 57 54 44 49 34 Z"
          fill="#1266E8"
        />

        {/* Lower dynamic cyan accent */}
        <path
          d="M31 58 C37 68 40 76 39 85 C42 83 45 79 46 72 C46 62 44 54 40 48 C37 51 34 54 31 58 Z"
          fill="#04C8E8"
        />

        {/* Right wing/t-arm curving down into violet */}
        <path
          d="M54 37 C64 36 74 42 80 52 C79 60 74 66 69 73 C67 69 67 58 64 49 C62 44 58 40 54 37 Z"
          fill="url(#iam-sym-grad)"
        />

        {/* Bottom right violet tail curve */}
        <path
          d="M65 52 C72 52 83 58 86 68 C81 76 72 82 64 86 C69 78 71 70 67 62 C66 58 65 55 65 52 Z"
          fill="#5427D9"
        />
      </g>

      {/* ================= WORDMARK: iamtechni ================= */}
      {/* Exact geometric proportions, no background, pure transparent */}
      <g transform="translate(108, 0)">
        {/* first 'i' */}
        <circle cx="10" cy="33" r="4.2" fill="#04C8E8" />
        <rect x="6" y="44" width="8" height="29" rx="3.5" fill="url(#iam-wordmark-grad)" />

        {/* 'a' */}
        <path
          d="M42 44 V73 H34.5 V68.5 C32 72 27 74 22 74 C14 74 9 68.5 9 60 C9 51.5 15 46.5 24 46.5 C28 46.5 32 47.5 34.5 49 V47.5 C34.5 44 31 42 25 42 C20 42 16 43.5 12 45.5 L10 39.5 C15 36.5 21 35 26 35 C36 35 42 39 42 48 Z M34.5 56 C32.5 54.5 29 53.5 25 53.5 C19.5 53.5 16.5 56 16.5 60 C16.5 64 19.5 66.5 24 66.5 C29.5 66.5 34.5 62.5 34.5 57.5 Z"
          fill="url(#iam-wordmark-grad)"
          transform="translate(14, 0)"
        />

        {/* 'm' */}
        <path
          d="M68 44 V73 H60.5 V49 C60.5 44 57.5 42 53.5 42 C49 42 45 45 45 51 V73 H37.5 V49 C37.5 44 34.5 42 30.5 42 C26 42 22 45 22 51 V73 H14.5 V44 H22 V48 C24.5 45 28.5 43 33 43 C37.5 43 41 45.5 43 49 C46 45 50.5 43 55.5 43 C63.5 43 68 47.5 68 56 Z"
          fill="url(#iam-wordmark-grad)"
          transform="translate(48, 0)"
        />

        {/* 't' */}
        <path
          d="M21 34 V44 H29 V50.5 H21 V65 C21 68 22.5 69.5 25.5 69.5 C27 69.5 28.5 69 29.5 68.5 L31 74 C29 75.5 26 76 23 76 C16 76 13.5 72 13.5 65 V50.5 H7 V44 H13.5 V36 Z"
          fill="url(#iam-wordmark-grad)"
          transform="translate(122, 0)"
        />

        {/* 'e' */}
        <path
          d="M40 59 H15.5 C16 66 20.5 68.5 26.5 68.5 C31 68.5 35 67 38.5 64.5 L41 70.5 C36.5 73.5 31.5 75 25.5 75 C14.5 75 7.5 67.5 7.5 56 C7.5 45 14.5 37 25 37 C35.5 37 40.5 45.5 40 56 Z M15.5 53 H32.5 C32 47.5 28.5 43.5 24.5 43.5 C20 43.5 16.5 47.5 15.5 53 Z"
          fill="url(#iam-wordmark-grad)"
          transform="translate(150, 0)"
        />

        {/* 'c' */}
        <path
          d="M34 46.5 L31 52 C28.5 50 25.5 49 22 49 C15.5 49 11 53.5 11 60 C11 66.5 15.5 71 22 71 C25.5 71 29 69.5 31.5 67.5 L34.5 73 C31 75.5 26.5 77 21 77 C11 77 3.5 69.5 3.5 59 C3.5 48.5 11.5 43 21.5 43 C26.5 43 30.5 44.5 34 46.5 Z"
          fill="url(#iam-wordmark-grad)"
          transform="translate(186, 0)"
        />

        {/* 'h' */}
        <path
          d="M35 44 V73 H27.5 V50 C27.5 44.5 24 42 19.5 42 C15 42 11 45.5 11 52 V73 H3.5 V28 H11 V48 C13.5 45 17.5 43 22.5 43 C30.5 43 35 47.5 35 56 Z"
          fill="url(#iam-wordmark-grad)"
          transform="translate(216, 0)"
        />

        {/* 'n' */}
        <path
          d="M35 44 V73 H27.5 V50 C27.5 44.5 24 42 19.5 42 C15 42 11 45.5 11 52 V73 H3.5 V44 H11 V48 C13.5 45 17.5 43 22.5 43 C30.5 43 35 47.5 35 56 Z"
          fill="url(#iam-wordmark-grad)"
          transform="translate(247, 0)"
        />

        {/* final 'i' */}
        <circle cx="288" cy="33" r="4.2" fill="#5427D9" />
        <rect x="284" y="44" width="8" height="29" rx="3.5" fill="url(#iam-wordmark-grad)" />
      </g>
    </svg>
  );
};
