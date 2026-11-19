import React from 'react';

interface TechLogoBadgeProps {
  size?: number;
  className?: string;
}

/**
 * Official React Logo Badge (Cyan #00B0F0 / #61DAFB) with soft glow (20px to 24px)
 */
export const ReactLogoBadge: React.FC<TechLogoBadgeProps> = ({ size = 22, className = '' }) => (
  <span
    className={`inline-flex items-center justify-center rounded-md bg-[#00B0F0]/15 border border-[#00B0F0]/45 text-[#00B0F0] shadow-[0_0_12px_rgba(0,176,240,0.38)] shrink-0 transition-transform duration-200 hover:scale-105 ${className}`}
    style={{ width: `${size}px`, height: `${size}px` }}
    title="React"
    aria-hidden="true"
  >
    <svg
      width={Math.round(size * 0.68)}
      height={Math.round(size * 0.68)}
      viewBox="-11.5 -10.23174 23 20.46348"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="0" cy="0" r="2.05" fill="#00B0F0" />
      <g stroke="#00B0F0" strokeWidth="1.35" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  </span>
);

/**
 * Official TypeScript Logo Badge (Blue #1C35EA / #3178C6) with soft glow (20px to 24px)
 */
export const TypeScriptLogoBadge: React.FC<TechLogoBadgeProps> = ({ size = 22, className = '' }) => (
  <span
    className={`inline-flex items-center justify-center rounded-md bg-gradient-to-br from-[#00B0F0]/25 to-[#1C35EA] border border-[#00B0F0]/40 text-white shadow-[0_0_12px_rgba(28,53,234,0.42)] shrink-0 transition-transform duration-200 hover:scale-105 ${className}`}
    style={{ width: `${size}px`, height: `${size}px` }}
    title="TypeScript"
    aria-hidden="true"
  >
    <svg
      width={Math.round(size * 0.68)}
      height={Math.round(size * 0.68)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 3H21V21H3V3Z"
        fill="#1C35EA"
      />
      <path
        d="M13.5 11.2H11.1V18.5H9.1V11.2H6.7V9.6H13.5V11.2ZM14.5 16.4C15.1 16.8 15.9 17.1 16.7 17.1C17.5 17.1 18 16.8 18 16.3C18 15.7 17.4 15.5 16.3 15.1C14.8 14.5 14.1 13.8 14.1 12.4C14.1 10.8 15.4 9.5 17.4 9.5C18.4 9.5 19.2 9.7 19.8 10.1L19.2 11.6C18.7 11.3 18.1 11.1 17.4 11.1C16.6 11.1 16.1 11.5 16.1 12C16.1 12.5 16.6 12.8 17.8 13.2C19.3 13.8 20 14.5 20 15.9C20 17.6 18.7 18.7 16.5 18.7C15.4 18.7 14.4 18.4 13.8 17.9L14.5 16.4Z"
        fill="#FFFFFF"
      />
    </svg>
  </span>
);

/**
 * Helper to detect if a string mentions React or TypeScript
 */
export function hasReactMention(text: string): boolean {
  return /\bReact(?:\.js|JS|\s+Native)?\b/i.test(text);
}

export function hasTypeScriptMention(text: string): boolean {
  return /\bTypeScript\b/i.test(text);
}
