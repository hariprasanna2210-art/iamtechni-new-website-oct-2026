import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { LoadingSpinner } from './LoadingSpinner';

export interface FullScreenLoaderProps {
  isOpen: boolean;
  message: string;
  subtext?: string;
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  isOpen,
  message,
  subtext = 'Please wait a moment',
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  // Fade in/out over 250ms (instant under prefers-reduced-motion)
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }

    setIsVisible(false);
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const timer = setTimeout(
      () => setShouldRender(false),
      reducedMotion ? 0 : 250
    );
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Lock page scrolling while visible and restore cleanly on hide/unmount
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!shouldRender || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-[rgba(255,255,255,0.88)] backdrop-blur-[4px] transition-opacity duration-[250ms] ease-out motion-reduce:transition-none ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-busy={isOpen}
    >
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center text-center max-w-sm px-4 select-none"
      >
        <img
          src="/logo.png"
          srcSet="/logo.png 1x, /iamtechni-logo-2x.png 2x"
          alt=""
          aria-hidden="true"
          width={574}
          height={186}
          className="h-[34px] w-auto aspect-[574/186] object-contain block"
          loading="eager"
          decoding="async"
        />

        <div className="mt-[24px] w-[88px] h-[88px] rounded-full bg-white shadow-[0_10px_30px_-6px_rgba(20,32,90,0.14),0_2px_8px_rgba(77,25,234,0.08)] border border-slate-100/90 flex items-center justify-center">
          <LoadingSpinner
            size={56}
            color="#4D19EA"
            showStatusRole={false}
            hideSrOnly
          />
        </div>

        <span className="mt-[18px] block !text-[16px] font-semibold text-[#14205A] leading-snug">
          {message}
        </span>

        <span className="mt-1 block !text-[13px] font-normal text-[#64748B] leading-snug">
          {subtext}
        </span>
      </div>
    </div>,
    document.body
  );
};

export default FullScreenLoader;
