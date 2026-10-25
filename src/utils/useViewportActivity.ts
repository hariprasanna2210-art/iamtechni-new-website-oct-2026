import { useState, useEffect, useRef, RefObject } from 'react';

/**
 * Lightweight IntersectionObserver hook that tracks when a section is within (or near)
 * the viewport. Supports both:
 * 1) Passing an existing ref: `const inView = useSectionInView(sectionRef, '120px 0px', true)`
 * 2) Creating a tuple `[ref, inView]`: `const [sectionRef, inView] = useSectionInView<HTMLElement>(0.15)`
 */
export function useSectionInView(
  ref: RefObject<Element | null>,
  rootMargin?: string,
  initialValue?: boolean
): boolean;
export function useSectionInView<T extends Element = HTMLElement>(
  threshold?: number,
  rootMargin?: string,
  initialValue?: boolean
): [RefObject<T | null>, boolean];
export function useSectionInView<T extends Element = HTMLElement>(
  refOrThreshold?: RefObject<Element | null> | number,
  rootMargin = '160px 0px',
  initialValue = false
): boolean | [RefObject<T | null>, boolean] {
  const internalRef = useRef<T | null>(null);
  const isRefArg =
    typeof refOrThreshold === 'object' &&
    refOrThreshold !== null &&
    'current' in refOrThreshold;

  const targetRef = isRefArg
    ? (refOrThreshold as RefObject<Element | null>)
    : (internalRef as unknown as RefObject<Element | null>);
  const threshold = typeof refOrThreshold === 'number' ? refOrThreshold : 0.01;

  const [inView, setInView] = useState<boolean>(initialValue);

  useEffect(() => {
    const el = targetRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setInView(entry.isIntersecting);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [targetRef, rootMargin, threshold]);

  if (isRefArg) {
    return inView;
  }
  return [internalRef, inView];
}

/**
 * Tracks whether the user is actively scrolling the window.
 * Auto-rotating carousels and background card flips pause during active scroll
 * gestures to prevent mid-scroll layout changes and main-thread frame drops.
 */
let globalIsScrolling = false;
let globalScrollTimer: number | null = null;
const scrollListeners = new Set<(scrolling: boolean) => void>();

function initGlobalScrollTracker() {
  if (typeof window === 'undefined' || scrollListeners.size > 0) return;

  const handleScroll = () => {
    if (!globalIsScrolling) {
      globalIsScrolling = true;
      scrollListeners.forEach((fn) => fn(true));
    }
    if (globalScrollTimer !== null) {
      window.clearTimeout(globalScrollTimer);
    }
    globalScrollTimer = window.setTimeout(() => {
      globalIsScrolling = false;
      scrollListeners.forEach((fn) => fn(false));
    }, 160);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

export function useIsWindowScrolling(): boolean {
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    initGlobalScrollTracker();
    const listener = (scrolling: boolean) => {
      setIsScrolling(scrolling);
    };
    scrollListeners.add(listener);
    return () => {
      scrollListeners.delete(listener);
    };
  }, []);

  return isScrolling;
}
