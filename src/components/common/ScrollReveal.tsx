import React, { ReactNode } from 'react';
import { motion, Variants, useReducedMotion } from 'framer-motion';

export interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  duration?: number;
  yOffset?: number;
  once?: boolean;
  amount?: number | 'some' | 'all';
  as?: 'div' | 'section' | 'article' | 'ul' | 'ol' | 'main';
}

export interface ScrollRevealItemProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  yOffset?: number;
  as?: 'div' | 'li' | 'article' | 'section';
}

/**
 * Container variant that controls staggered reveal of child elements
 */
const createContainerVariants = (
  staggerChildren = 0.12,
  delayChildren = 0.05
): Variants => ({
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
      when: 'beforeChildren',
    },
  },
});

/**
 * Child item variant for staggered fade-up
 */
const createItemVariants = (
  duration = 0.55,
  yOffset = 24
): Variants => ({
  hidden: {
    opacity: 0,
    y: yOffset,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      ease: [0.21, 0.47, 0.32, 0.98], // smooth modern cubic-bezier
    },
  },
});

/**
 * ScrollReveal: Parent container that detects when section enters viewport
 * and triggers staggered fade-up animations on nested ScrollRevealItem children.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  staggerChildren = 0.12,
  delayChildren = 0.05,
  once = true,
  amount = 0.15,
  as = 'div',
}) => {
  const shouldReduceMotion = useReducedMotion();

  // If reduced motion is requested, render without transforms
  if (shouldReduceMotion) {
    const Component = as as any;
    return <Component className={className}>{children}</Component>;
  }

  const MotionComponent = (motion as any)[as] || motion.div;

  return (
    <MotionComponent
      variants={createContainerVariants(staggerChildren, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};

/**
 * ScrollRevealItem: Individual card, column, or element within a ScrollReveal container.
 * Automatically participates in the parent container's stagger sequence.
 */
export const ScrollRevealItem: React.FC<ScrollRevealItemProps> = ({
  children,
  className = '',
  duration = 0.55,
  yOffset = 24,
  as = 'div',
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Component = as as any;
    return <Component className={className}>{children}</Component>;
  }

  const MotionComponent = (motion as any)[as] || motion.div;

  return (
    <MotionComponent
      variants={createItemVariants(duration, yOffset)}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};

/**
 * Standalone Section Wrapper that provides entrance effect for whole sections
 */
interface ScrollRevealSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  once?: boolean;
  amount?: number | 'some' | 'all';
}

export const ScrollRevealSection: React.FC<ScrollRevealSectionProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  yOffset = 28,
  once = true,
  amount = 0.15,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <section className={className}>{children}</section>;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
};
