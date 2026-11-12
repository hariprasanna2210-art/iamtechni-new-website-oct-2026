import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

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

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  as = 'h2',
  children,
  className = '',
  isDark = false,
  align,
  hasHighlight,
  id,
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const isCentered = align === 'center' || className.includes('text-center') || className.includes('items-center');
  const isRight = align === 'right' || className.includes('text-right');
  const transformOrigin = isCentered ? 'center center' : isRight ? 'right center' : 'left center';

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

  const hoverGradientClass = hasHighlight
    ? ''
    : isDark
    ? 'heading-hover-gradient-dark'
    : 'heading-hover-gradient-light';

  const MotionTag = as === 'h1' ? motion.h1 : motion.h2;

  return (
    <MotionTag
      id={id}
      initial={prefersReducedMotion ? false : { scale: 0.9, opacity: 0 }}
      whileInView={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
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
      {children}
    </MotionTag>
  );
};

export default AnimatedHeading;
