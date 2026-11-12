import React from 'react';

export interface HeadingSparkProps {
  isDark?: boolean;
  className?: string;
}

/**
 * HeadingSpark Component
 * 
 * Exact SVG burst / spark lines rendered at the end of each h1 and h2:
 * - viewBox="0 0 48 40"
 * - strokeWidth="4.5" strokeLinecap="round"
 * - inline-block, width 0.7em, height 0.6em, margin-left 0.15em, vertical-align: top, pointer-events: none
 * - Color cycles slowly through brand colors (cyan, blue, purple) in a 4s loop
 * - Gentle pulse zooms in/out (scale 1 -> 1.15 -> 1) every 2.4s in an infinite loop
 * - transform-origin: bottom left
 * - Never causes horizontal scrolling or orphan line break
 */
export const HeadingSpark: React.FC<HeadingSparkProps> = ({
  isDark = false,
  className = '',
}) => {
  return (
    <svg
      viewBox="0 0 48 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="4.5"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className={`heading-spark ${isDark ? 'heading-spark-dark' : 'heading-spark-light'} ${className}`}
      style={{
        display: 'inline-block',
        width: '0.7em',
        height: '0.6em',
        marginLeft: '0.15em',
        verticalAlign: 'top',
        pointerEvents: 'none',
      }}
    >
      <path d="M44 34 L34 33" />
      <path d="M36 16 L28 25" />
      <path d="M21 4 L19 19" />
      <path d="M5 9 L11 21" />
    </svg>
  );
};

export default HeadingSpark;
