import React, { useEffect, useRef, useState } from 'react';

/**
 * SquircleShiftBackground
 * Permanent animated background for the homepage Hero section ONLY.
 * Renders a grid of rounded squares (squircles, ~40px, 8px gap on desktop; fewer boxes on mobile)
 * over the hero's dark navy/teal base (#0A1A2F -> #0B2233).
 * A slow diagonal wave passes across the grid: squircles gently scale (0.85 -> 1),
 * rotate slightly, and brighten from navy to teal/cyan (#22D3EE) and back (max opacity 0.35).
 */
export const SquircleShiftBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = reducedMotionQuery.matches;

    let width = 0;
    let height = 0;
    let dpr = 1;

    let rafId: number | null = null;
    let initRafId: number | null = null;
    let isHeroVisible = true;
    let isTabVisible = !document.hidden;
    let resizeTimer: number | null = null;

    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    const initScene = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect ? rect.width : window.innerWidth;
      height = rect ? rect.height : window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const drawSquirclePath = (
      context: CanvasRenderingContext2D,
      halfSize: number,
      radius: number
    ) => {
      const r = Math.min(radius, halfSize);
      context.beginPath();
      context.moveTo(-halfSize + r, -halfSize);
      context.lineTo(halfSize - r, -halfSize);
      context.quadraticCurveTo(halfSize, -halfSize, halfSize, -halfSize + r);
      context.lineTo(halfSize, halfSize - r);
      context.quadraticCurveTo(halfSize, halfSize, halfSize - r, halfSize);
      context.lineTo(-halfSize + r, halfSize);
      context.quadraticCurveTo(-halfSize, halfSize, -halfSize, halfSize - r);
      context.lineTo(-halfSize, -halfSize + r);
      context.quadraticCurveTo(-halfSize, -halfSize, -halfSize + r, -halfSize);
      context.closePath();
    };

    const drawFrame = (now: number) => {
      if (!width || !height) return;

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.08;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.08;

      // 1. Hero dark navy/teal base (#0A1A2F -> #0B2233)
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0A1A2F');
      bgGrad.addColorStop(0.55, '#091E32');
      bgGrad.addColorStop(1, '#0B2233');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle ambient teal/cyan depth glows behind the stage
      const maxDim = Math.max(width, height);
      const tSec = prefersReducedMotion ? 2.4 : now * 0.001;

      const rightGlowX = width * 0.68 + Math.cos(tSec * 0.35) * 24 + currentParallaxX * 0.35;
      const rightGlowY = height * 0.52 + Math.sin(tSec * 0.28) * 18 + currentParallaxY * 0.35;
      const rightGlow = ctx.createRadialGradient(
        rightGlowX,
        rightGlowY,
        0,
        rightGlowX,
        rightGlowY,
        maxDim * 0.45
      );
      rightGlow.addColorStop(0, 'rgba(34, 211, 238, 0.16)');
      rightGlow.addColorStop(0.45, 'rgba(20, 184, 166, 0.09)');
      rightGlow.addColorStop(1, 'rgba(10, 26, 47, 0)');
      ctx.fillStyle = rightGlow;
      ctx.fillRect(0, 0, width, height);

      // 3. Squircle Shift Grid
      // Desktop: ~40px rounded squares with 8px gap.
      // Mobile (<768px): larger stride/gap so fewer boxes are rendered for lightweight mobile performance.
      const isMobile = width < 768;
      const boxSize = isMobile ? 38 : 40;
      const gap = isMobile ? 18 : 8;
      const stride = boxSize + gap;
      const cornerRadius = isMobile ? 10 : 11;

      const cols = Math.ceil(width / stride) + 2;
      const rows = Math.ceil(height / stride) + 2;

      const offsetX = ((width - (cols - 1) * stride) * 0.5) + currentParallaxX * 0.5;
      const offsetY = ((height - (rows - 1) * stride) * 0.5) + currentParallaxY * 0.5;

      // Navy base color (rgb(19, 47, 82)) -> Teal/Cyan peak color (#22D3EE = rgb(34, 211, 238))
      const navyR = 19;
      const navyG = 47;
      const navyB = 82;

      const cyanR = 34;
      const cyanG = 211;
      const cyanB = 238;

      for (let row = 0; row < rows; row++) {
        const cy = offsetY + row * stride;
        if (cy < -stride || cy > height + stride) continue;

        for (let col = 0; col < cols; col++) {
          const cx = offsetX + col * stride;
          if (cx < -stride || cx > width + stride) continue;

          // Slow diagonal wave travelling from top-left to bottom-right
          const diagPhase = (col * 0.28 + row * 0.28) - tSec * 1.15;
          const secondaryRipple = Math.sin(col * 0.14 - row * 0.16 + tSec * 0.65) * 0.35;
          const rawWave = (Math.sin(diagPhase + secondaryRipple) + 1) * 0.5;
          // Smooth wave crest in [0, 1]
          const wave = Math.pow(rawWave, 1.65);

          // Scale gently from 0.85 -> 1.0
          const scale = 0.85 + wave * 0.15;
          // Slight rotation as the wave passes
          const rotation = Math.sin(diagPhase) * 0.085 * (0.35 + wave * 0.65);

          // Color interpolation from navy to teal/cyan (#22D3EE)
          const r = Math.round(navyR + (cyanR - navyR) * wave);
          const g = Math.round(navyG + (cyanG - navyG) * wave);
          const b = Math.round(navyB + (cyanB - navyB) * wave);

          // Max opacity strictly capped at 0.35 so text stays readable
          const fillAlpha = Math.min(0.35, 0.055 + wave * 0.21);
          const strokeAlpha = Math.min(0.35, 0.09 + wave * 0.26);

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(rotation);
          ctx.scale(scale, scale);

          drawSquirclePath(ctx, boxSize * 0.5, cornerRadius);

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fillAlpha.toFixed(3)})`;
          ctx.fill();

          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${strokeAlpha.toFixed(3)})`;
          ctx.stroke();

          ctx.restore();
        }
      }

      // 4. Keep the dark gradient behind the hero text so the heading and copy stay crisp and readable
      if (width >= 1024) {
        const textReadabilityGrad = ctx.createLinearGradient(0, 0, width * 0.62, 0);
        textReadabilityGrad.addColorStop(0, 'rgba(7, 18, 34, 0.72)');
        textReadabilityGrad.addColorStop(0.58, 'rgba(8, 22, 40, 0.46)');
        textReadabilityGrad.addColorStop(1, 'rgba(10, 26, 47, 0)');
        ctx.fillStyle = textReadabilityGrad;
        ctx.fillRect(0, 0, width, height);
      } else {
        const mobileReadabilityGrad = ctx.createLinearGradient(0, height * 0.35, 0, height);
        mobileReadabilityGrad.addColorStop(0, 'rgba(7, 18, 34, 0.18)');
        mobileReadabilityGrad.addColorStop(0.45, 'rgba(7, 18, 34, 0.58)');
        mobileReadabilityGrad.addColorStop(1, 'rgba(7, 18, 34, 0.78)');
        ctx.fillStyle = mobileReadabilityGrad;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.restore();
    };

    const startLoop = () => {
      if (prefersReducedMotion || rafId !== null || !isHeroVisible || !isTabVisible) return;
      const tick = (now: number) => {
        if (!isHeroVisible || !isTabVisible) {
          rafId = null;
          return;
        }
        drawFrame(now);
        rafId = window.requestAnimationFrame(tick);
      };
      rafId = window.requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    initRafId = window.requestAnimationFrame((now) => {
      initScene();
      drawFrame(now);
      setIsReady(true);

      if (!prefersReducedMotion) {
        startLoop();
      }
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion || !width || !height) return;
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetParallaxX = -normX * 12;
      targetParallaxY = -normY * 12;
    };

    const handleResize = () => {
      if (resizeTimer !== null) {
        window.clearTimeout(resizeTimer);
      }
      resizeTimer = window.setTimeout(() => {
        initScene();
        drawFrame(performance.now());
      }, 120);
    };

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && isHeroVisible && !prefersReducedMotion) {
        startLoop();
      } else {
        stopLoop();
      }
    };

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        stopLoop();
        drawFrame(performance.now());
      } else if (isHeroVisible && isTabVisible) {
        startLoop();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        isHeroVisible = entry.isIntersecting;
        if (isHeroVisible && isTabVisible && !prefersReducedMotion) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(canvas);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      if (initRafId !== null) {
        window.cancelAnimationFrame(initRafId);
      }
      stopLoop();
      if (resizeTimer !== null) {
        window.clearTimeout(resizeTimer);
      }
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full transition-opacity duration-700 ease-out ${
        isReady ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
};

export default SquircleShiftBackground;
