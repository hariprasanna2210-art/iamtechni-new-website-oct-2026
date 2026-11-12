import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HeadingSpark } from './HeadingSpark';

export interface AnimatedHeadingProps {
  as?: 'h1' | 'h2' | 'h3';
  children: React.ReactNode;
  className?: string;
  isDark?: boolean;
  align?: 'left' | 'center' | 'right';
  showSpark?: boolean;
  hasHighlight?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

/**
 * AnimatedHeading Component
 * 
 * Reusable animated heading for h1, h2 (and h3 cards):
 * - h1/h2: Scroll zoom in { scale: 0.9, opacity: 0 } -> { scale: 1, opacity: 1 } over 0.6s
 * - h1/h2: Scroll zoom out on leave via viewport { once: false, amount: 0.5 }
 * - h1/h2: Desktop hover zoom: scale 1.03
 * - h1/h2: transform-origin: left center for left-aligned, center for centered
 * - h1/h2: HeadingSpark burst lines icon placed inline directly after the last word,
 *          preventing line break between last word and icon via white-space: nowrap
 * - Highlighted words get slow 6s flowing gradient
 * - Plain headings change to brand gradient on hover (0.4s transition)
 * - h3 (Card titles): only small hover zoom (scale 1.03), no icon, no scroll animation
 * - Respects prefers-reduced-motion
 */
export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  as = 'h2',
  children,
  className = '',
  isDark = false,
  align,
  showSpark = true,
  hasHighlight,
  id,
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Determine alignment from props or className
  const isCentered = align === 'center' || className.includes('text-center') || className.includes('items-center');
  const isRight = align === 'right' || className.includes('text-right');
  const transformOrigin = isCentered ? 'center center' : isRight ? 'right center' : 'left center';

  // Card titles (h3): small hover zoom only, no scroll animation, no spark
  if (as === 'h3') {
    return (
      <motion.h3
        id={id}
        style={{
          transformOrigin,
          ...style,
        }}
        whileHover={
          prefersReducedMotion
            ? undefined
            : { scale: 1.03, transition: { duration: 0.25, ease: 'easeOut' } }
        }
        className={`${className} cursor-default`}
      >
        {children}
      </motion.h3>
    );
  }

  // Hover gradient class if no highlight is present
  const hoverGradientClass = hasHighlight
    ? ''
    : isDark
    ? 'heading-hover-gradient-dark'
    : 'heading-hover-gradient-light';

  // Helper to wrap the last word and the spark together in a nowrap span
  const renderContentWithSpark = () => {
    if (!showSpark) return children;

    const childrenArray = React.Children.toArray(children);
    if (childrenArray.length > 0) {
      const lastChild = childrenArray[childrenArray.length - 1];
      if (typeof lastChild === 'string') {
        const trimmed = lastChild.trimEnd();
        const lastSpaceIdx = trimmed.lastIndexOf(' ');
        const leading = lastSpaceIdx === -1 ? '' : trimmed.slice(0, lastSpaceIdx + 1);
        const lastWord = lastSpaceIdx === -1 ? trimmed : trimmed.slice(lastSpaceIdx + 1);
        const allPrev = childrenArray.slice(0, -1);
        return (
          <>
            {allPrev}
            {leading}
            <span className="inline-block whitespace-nowrap">
              {lastWord}
              <HeadingSpark isDark={isDark} />
            </span>
          </>
        );
      }
    }

    // For other complex children, append spark in nowrap container
    return (
      <>
        {children}
        <span className="inline-block whitespace-nowrap">
          <HeadingSpark isDark={isDark} />
        </span>
      </>
    );
  };

  const MotionTag = as === 'h1' ? motion.h1 : motion.h2;

  return (
    <MotionTag
      id={id}
      initial={prefersReducedMotion ? false : { scale: 0.9, opacity: 0 }}
      whileInView={prefersReducedMotion ? false : { scale: 1, opacity: 1 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      whileHover={
        prefersReducedMotion
          ? undefined
          : { scale: 1.03, transition: { duration: 0.25, ease: 'easeOut' } }
      }
      style={{
        transformOrigin,
        ...style,
      }}
      className={`${hoverGradientClass} ${className}`}
    >
      {renderContentWithSpark()}
    </MotionTag>
  );
};

export default AnimatedHeading;
