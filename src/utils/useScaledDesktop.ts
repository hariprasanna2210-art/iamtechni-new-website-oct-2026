import { useState, useEffect } from 'react';

export interface ScaledDesktopState {
  isScaledDesktop: boolean;
  scale: number;
}

/**
 * Detects when a user on a desktop monitor (>=1280px physical width, e.g. 1366x768)
 * is viewing the app in a zoomed browser tab (e.g. 150% Chrome zoom -> 910px CSS width)
 * or desktop preview pane (880px-1023px) that pushed window.innerWidth slightly below 1024px.
 * Returns isScaledDesktop=true and scale = w / 1366 so the 1366px desktop layout renders
 * pixel-for-pixel identically to the live site.
 */
export function useScaledDesktop(): ScaledDesktopState {
  const [state, setState] = useState<ScaledDesktopState>({
    isScaledDesktop: false,
    scale: 1,
  });

  useEffect(() => {
    const update = () => {
      if (typeof window === 'undefined') return;
      const w = window.innerWidth;
      const screenW = window.screen?.width || 0;
      const dpr = window.devicePixelRatio || 1;
      const physicalScreenW = Math.max(screenW, Math.round(screenW * dpr));

      if (w >= 880 && w < 1024 && physicalScreenW >= 1280) {
        setState({
          isScaledDesktop: true,
          scale: w / 1366,
        });
      } else {
        setState({
          isScaledDesktop: false,
          scale: 1,
        });
      }
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return state;
}
