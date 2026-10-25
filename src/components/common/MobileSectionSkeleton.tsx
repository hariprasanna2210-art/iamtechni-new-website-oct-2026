import React, { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export type MobileSkeletonVariant =
  | 'carousel'
  | 'disciplines'
  | 'principles'
  | 'matrix'
  | 'methodology'
  | 'dark-book'
  | 'showcase'
  | 'dark-cards'
  | 'collaborate'
  | 'cards-grid'
  | 'split-detail'
  | 'form-section'
  | 'faq-accordion';

export interface MobileSectionSkeletonProps {
  variant?: MobileSkeletonVariant;
  cardCount?: number;
}

/**
 * Lightweight, zero-layout-shift content skeleton loading state rendered
 * exclusively on mobile devices (< 768px) during initial page load.
 */
export const MobileSectionSkeleton: React.FC<MobileSectionSkeletonProps> = ({
  variant = 'cards-grid',
  cardCount = 2,
}) => {
  // 1. Dark Navy AI Book Skeleton
  if (variant === 'dark-book') {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading section content"
        data-mobile-skeleton="dark-book"
        className="md:hidden py-10 px-4 bg-[#070E24] border-b border-blue-950/80 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto space-y-5">
          {/* Header Skeleton */}
          <div className="space-y-2.5">
            <div className="h-7 w-36 rounded-full skeleton-shimmer-dark border border-blue-500/20" />
            <div className="h-7 w-4/5 rounded-xl skeleton-shimmer-dark" />
            <div className="h-4 w-2/3 rounded-lg skeleton-shimmer-dark opacity-75" />
          </div>

          {/* Chapter Pills Skeleton */}
          <div className="flex items-center gap-2 overflow-hidden">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="h-9 w-24 rounded-xl skeleton-shimmer-dark border border-blue-400/15 shrink-0"
              />
            ))}
          </div>

          {/* Book Spread Card Skeleton */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-5 w-28 rounded-md skeleton-shimmer-dark" />
              <div className="h-5 w-16 rounded-full skeleton-shimmer-dark" />
            </div>
            <div className="h-6 w-3/4 rounded-lg skeleton-shimmer-dark" />
            <div className="space-y-2">
              <div className="h-3.5 w-full rounded skeleton-shimmer-dark opacity-80" />
              <div className="h-3.5 w-5/6 rounded skeleton-shimmer-dark opacity-70" />
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="h-16 rounded-xl skeleton-shimmer-dark border border-white/5" />
              <div className="h-16 rounded-xl skeleton-shimmer-dark border border-white/5" />
            </div>
            <div className="h-10 w-full rounded-xl skeleton-shimmer-dark mt-2" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Dark Navy Flip Cards / Dark Insights Skeleton
  if (variant === 'dark-cards') {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading section content"
        data-mobile-skeleton="dark-cards"
        className="md:hidden py-10 px-4 bg-[#060D21] border-b border-blue-950/80 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto space-y-5">
          <div className="space-y-2.5">
            <div className="h-7 w-40 rounded-full skeleton-shimmer-dark border border-blue-500/20" />
            <div className="h-7 w-3/4 rounded-xl skeleton-shimmer-dark" />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[1, 2].map((idx) => (
              <div
                key={idx}
                className="h-[260px] rounded-2xl bg-white/[0.03] border border-white/10 p-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-24 rounded-md skeleton-shimmer-dark" />
                    <div className="w-8 h-8 rounded-lg skeleton-shimmer-dark" />
                  </div>
                  <div className="h-5 w-4/5 rounded-lg skeleton-shimmer-dark" />
                  <div className="h-3.5 w-full rounded skeleton-shimmer-dark opacity-75" />
                  <div className="h-3.5 w-2/3 rounded skeleton-shimmer-dark opacity-65" />
                </div>
                <div className="h-9 w-full rounded-xl skeleton-shimmer-dark" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. Swipe Carousel Skeleton (Services & Featured Projects)
  if (variant === 'carousel') {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading carousel content"
        data-mobile-skeleton="carousel"
        className="md:hidden py-9 px-4 bg-gradient-to-b from-[#F8FAFF] via-[#F2F6FF] to-[#F8FAFF] border-b border-[#DBEAFE]/80 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Eyebrow & Heading */}
          <div className="space-y-2">
            <div className="h-7 w-40 rounded-full skeleton-shimmer-light border border-[#DBEAFE]" />
            <div className="h-7 w-11/12 rounded-xl skeleton-shimmer-light" />
            <div className="h-4 w-3/4 rounded-lg skeleton-shimmer-subtle" />
          </div>

          {/* Horizontal Category Pills */}
          <div className="flex items-center gap-2 overflow-hidden py-1">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="h-9 w-24 rounded-full skeleton-shimmer-light border border-[#DBEAFE]/80 shrink-0"
              />
            ))}
          </div>

          {/* Primary Active Card + Peek of Next Card */}
          <div className="flex items-stretch gap-3 overflow-hidden">
            <div className="w-[85%] shrink-0 rounded-2xl bg-white border border-[#DBEAFE] p-4 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 rounded-md skeleton-shimmer-light" />
                <div className="w-9 h-9 rounded-xl skeleton-shimmer-light" />
              </div>
              <div className="h-5 w-3/4 rounded-lg skeleton-shimmer-light" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-full rounded skeleton-shimmer-subtle" />
                <div className="h-3.5 w-4/5 rounded skeleton-shimmer-subtle" />
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <div className="h-6 w-16 rounded-md skeleton-shimmer-light" />
                <div className="h-6 w-16 rounded-md skeleton-shimmer-light" />
                <div className="h-6 w-14 rounded-md skeleton-shimmer-light" />
              </div>
              <div className="h-10 w-full rounded-xl skeleton-shimmer-light mt-1" />
            </div>

            {/* Intentional Next-Card Peek */}
            <div className="w-[22%] shrink-0 rounded-2xl bg-white/80 border border-[#DBEAFE]/70 p-3 space-y-3 opacity-75">
              <div className="h-5 w-12 rounded-md skeleton-shimmer-light" />
              <div className="h-5 w-full rounded-lg skeleton-shimmer-light" />
              <div className="h-24 w-full rounded-xl skeleton-shimmer-subtle" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Engineering Disciplines & Compact 3-Column Tool Stack Skeleton
  if (variant === 'disciplines') {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading engineering disciplines"
        data-mobile-skeleton="disciplines"
        className="md:hidden pt-10 pb-6 px-4 bg-gradient-to-b from-[#F8FAFF] via-white to-[#EEF4FF]/60 border-b border-[#DBEAFE]/90 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-4">
          <div className="h-7 w-44 rounded-full skeleton-shimmer-light border border-[#DBEAFE]" />
          <div className="h-8 w-5/6 rounded-xl skeleton-shimmer-light" />
          <div className="h-4 w-4/5 rounded-lg skeleton-shimmer-subtle" />

          {/* 2-Column Feature Callout Boxes */}
          <div className="grid grid-cols-2 gap-2.5 w-full pt-1">
            <div className="rounded-2xl p-3 bg-white border border-[#DBEAFE] space-y-2 text-left">
              <div className="h-4 w-24 rounded skeleton-shimmer-light" />
              <div className="h-3 w-full rounded skeleton-shimmer-subtle" />
            </div>
            <div className="rounded-2xl p-3 bg-white border border-[#DBEAFE] space-y-2 text-left">
              <div className="h-4 w-24 rounded skeleton-shimmer-light" />
              <div className="h-3 w-full rounded skeleton-shimmer-subtle" />
            </div>
          </div>

          {/* 3-Column Compact Mobile Tech Grid (12 items) */}
          <div className="grid grid-cols-3 gap-2 w-full pt-2">
            {Array.from({ length: 9 }).map((_, idx) => (
              <div
                key={idx}
                className="h-9 rounded-xl skeleton-shimmer-light border border-[#DBEAFE]/70"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 5. Core Principles Scroll Section Skeleton
  if (variant === 'principles') {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading core principles"
        data-mobile-skeleton="principles"
        className="md:hidden py-9 px-3 bg-[#DBEAFE]/55 border-b border-[#DBEAFE] overflow-hidden"
      >
        <div className="rounded-[24px] bg-white border border-white p-4 space-y-4 shadow-xs">
          <div className="flex flex-col items-center space-y-2.5">
            <div className="h-7 w-40 rounded-full skeleton-shimmer-light" />
            <div className="h-7 w-4/5 rounded-xl skeleton-shimmer-light" />
            <div className="grid grid-cols-2 gap-2 w-full pt-1">
              <div className="h-10 rounded-full skeleton-shimmer-light" />
              <div className="h-10 rounded-full skeleton-shimmer-subtle" />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {[1, 2].map((idx) => (
              <div key={idx} className="space-y-2">
                <div className="h-[150px] w-full rounded-[20px] skeleton-shimmer-light border border-[#DBEAFE]/80" />
                <div className="h-5 w-3/5 mx-auto rounded-lg skeleton-shimmer-light" />
                <div className="h-3.5 w-4/5 mx-auto rounded skeleton-shimmer-subtle" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 6. Enterprise Solutions Matrix / Methodology / Showcase / Collaborate Skeleton
  if (
    variant === 'matrix' ||
    variant === 'methodology' ||
    variant === 'showcase' ||
    variant === 'collaborate'
  ) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading section"
        data-mobile-skeleton={variant}
        className="md:hidden py-10 px-4 bg-[#F5F8FC] border-b border-slate-200/80 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="space-y-2">
            <div className="h-7 w-36 rounded-full skeleton-shimmer-light border border-[#DBEAFE]" />
            <div className="h-7 w-5/6 rounded-xl skeleton-shimmer-light" />
            <div className="h-4 w-2/3 rounded-lg skeleton-shimmer-subtle" />
          </div>

          {/* Horizontal Tab Strip */}
          <div className="flex items-center gap-2 overflow-hidden">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="h-9 w-28 rounded-xl skeleton-shimmer-light border border-[#DBEAFE] shrink-0"
              />
            ))}
          </div>

          {/* Main Feature Card */}
          <div className="rounded-2xl bg-white border border-slate-200/90 p-4 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="h-5 w-28 rounded-md skeleton-shimmer-light" />
              <div className="h-6 w-20 rounded-full skeleton-shimmer-subtle" />
            </div>
            <div className="h-6 w-3/4 rounded-lg skeleton-shimmer-light" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-full rounded skeleton-shimmer-subtle" />
              <div className="h-3.5 w-5/6 rounded skeleton-shimmer-subtle" />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="h-14 rounded-xl skeleton-shimmer-light" />
              <div className="h-14 rounded-xl skeleton-shimmer-light" />
            </div>
            <div className="h-10 w-full rounded-xl skeleton-shimmer-light" />
          </div>
        </div>
      </div>
    );
  }

  // 7. Form Section Skeleton (Contact / Consultation / Training Enquiry)
  if (variant === 'form-section') {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading form section"
        data-mobile-skeleton="form-section"
        className="md:hidden py-10 px-4 bg-white border-b border-slate-200 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="space-y-2">
            <div className="h-6 w-32 rounded-full skeleton-shimmer-light" />
            <div className="h-7 w-3/4 rounded-xl skeleton-shimmer-light" />
          </div>
          <div className="rounded-2xl bg-[#F8FAFC] border border-slate-200 p-4 space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="h-10 w-full rounded-xl skeleton-shimmer-subtle" />
              <div className="h-10 w-full rounded-xl skeleton-shimmer-subtle" />
              <div className="h-10 w-full rounded-xl skeleton-shimmer-subtle" />
              <div className="h-20 w-full rounded-xl skeleton-shimmer-subtle" />
            </div>
            <div className="h-11 w-full rounded-xl skeleton-shimmer-light" />
          </div>
        </div>
      </div>
    );
  }

  // 8. FAQ Accordion Skeleton
  if (variant === 'faq-accordion') {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading frequently asked questions"
        data-mobile-skeleton="faq-accordion"
        className="md:hidden py-10 px-4 bg-[#F5F7FA] border-b border-slate-200 overflow-hidden"
      >
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="h-6 w-32 rounded-full skeleton-shimmer-light" />
          <div className="h-7 w-3/4 rounded-xl skeleton-shimmer-light mb-3" />
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="h-13 w-full rounded-xl bg-white border border-slate-200 px-4 flex items-center justify-between"
            >
              <div className="h-4 w-3/4 rounded skeleton-shimmer-subtle" />
              <div className="w-5 h-5 rounded-md skeleton-shimmer-light shrink-0" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 9. Split Detail Skeleton (Service Detail / Industry Detail / About / Article)
  if (variant === 'split-detail') {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading section details"
        data-mobile-skeleton="split-detail"
        className="md:hidden py-10 px-4 bg-white border-b border-slate-200 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="h-6 w-32 rounded-full skeleton-shimmer-light" />
          <div className="h-7 w-4/5 rounded-xl skeleton-shimmer-light" />
          <div className="space-y-2">
            <div className="h-3.5 w-full rounded skeleton-shimmer-subtle" />
            <div className="h-3.5 w-11/12 rounded skeleton-shimmer-subtle" />
            <div className="h-3.5 w-3/4 rounded skeleton-shimmer-subtle" />
          </div>
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="rounded-xl bg-[#F8FAFC] border border-slate-200/80 p-3 space-y-2"
              >
                <div className="h-5 w-14 rounded skeleton-shimmer-light" />
                <div className="h-3 w-4/5 rounded skeleton-shimmer-subtle" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 10. Default Cards Grid Skeleton (Services, Solutions, Portfolio, Industries, etc.)
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading cards"
      data-mobile-skeleton="cards-grid"
      className="md:hidden py-10 px-4 bg-[#F8FAFC] border-b border-slate-200 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-36 rounded-full skeleton-shimmer-light border border-[#DBEAFE]" />
          <div className="h-7 w-4/5 rounded-xl skeleton-shimmer-light" />
          <div className="h-4 w-2/3 rounded-lg skeleton-shimmer-subtle" />
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {Array.from({ length: cardCount }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-slate-200/90 p-4 space-y-3 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 rounded-md skeleton-shimmer-light" />
                <div className="w-8 h-8 rounded-xl skeleton-shimmer-light" />
              </div>
              <div className="h-5 w-3/4 rounded-lg skeleton-shimmer-light" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-full rounded skeleton-shimmer-subtle" />
                <div className="h-3.5 w-4/5 rounded skeleton-shimmer-subtle" />
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <div className="h-6 w-16 rounded-md skeleton-shimmer-subtle" />
                <div className="h-6 w-16 rounded-md skeleton-shimmer-subtle" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export interface MobileSectionSkeletonWrapperProps {
  children: React.ReactNode;
  variant?: MobileSkeletonVariant;
  sectionIndex?: number;
  cardCount?: number;
}

let hasCompletedInitialMobileHydration = false;

/**
 * Wraps any non-hero section to display a lightweight content skeleton on mobile devices (< 768px)
 * during initial page load or progressive scroll entry, while keeping desktop (>= 768px)
 * 100% unchanged and immediate.
 */
export const MobileSectionSkeletonWrapper: React.FC<MobileSectionSkeletonWrapperProps> = ({
  children,
  variant = 'cards-grid',
  sectionIndex = 0,
  cardCount = 2,
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Synchronously detect mobile (< 768px) so desktop never experiences any wrapper or skeleton state
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  const [isHydrated, setIsHydrated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 768 || hasCompletedInitialMobileHydration;
  });

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileViewport(mobile);
      if (!mobile) {
        setIsHydrated(true);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobileViewport || prefersReducedMotion || hasCompletedInitialMobileHydration) {
      hasCompletedInitialMobileHydration = true;
      setIsHydrated(true);
      return;
    }

    // Complete hydration in a single synchronized early frame (60ms) across all sections
    // so the Hero paints immediately on frame 1 while avoiding staggered mid-scroll height jumps.
    const timerId = window.setTimeout(() => {
      hasCompletedInitialMobileHydration = true;
      setIsHydrated(true);
    }, 60);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [isMobileViewport, prefersReducedMotion, sectionIndex]);

  // Desktop (>= 768px): Render children directly with zero wrapper or modification
  if (!isMobileViewport) {
    return <>{children}</>;
  }

  // Mobile (< 768px): Show lightweight skeleton during initial load, then smoothly reveal content
  if (!isHydrated) {
    return (
      <div ref={wrapperRef} className="w-full">
        <MobileSectionSkeleton variant={variant} cardCount={cardCount} />
      </div>
    );
  }

  return <div className="w-full">{children}</div>;
};
