import React, { memo, useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';

let engineInitPromise: Promise<void> | null = null;

function ensureParticlesEngineInitialized(): Promise<void> {
  if (!engineInitPromise) {
    engineInitPromise = initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });
  }
  return engineInitPromise;
}

const HeroParticlesBackgroundComponent: React.FC = () => {
  const [init, setInit] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    let mounted = true;
    ensureParticlesEngineInitialized().then(() => {
      if (mounted) {
        setInit(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: {
        enable: false,
      },
      fpsLimit: 60,
      detectRetina: true,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      background: {
        color: {
          value: 'transparent',
        },
      },
      interactivity: {
        detectsOn: 'window',
        events: {
          onHover: {
            enable: !prefersReducedMotion,
            mode: 'repulse',
          },
          onClick: {
            enable: false,
          },
          resize: {
            enable: true,
            delay: 0.25,
          },
        },
        modes: {
          repulse: {
            distance: 90,
            duration: 0.6,
            factor: 2,
            speed: 0.4,
            maxSpeed: 1.2,
            easing: 'ease-out-quad',
          },
        },
      },
      particles: {
        number: {
          value: 45,
          density: {
            enable: true,
            width: 1280,
            height: 800,
          },
        },
        color: {
          value: ['#10B981', '#F59E0B', '#8B5CF6', '#FB7185', '#14B8A6'],
        },
        shape: {
          type: 'circle',
        },
        opacity: {
          value: {
            min: 0.25,
            max: 0.55,
          },
          animation: {
            enable: !prefersReducedMotion,
            speed: 0.5,
            sync: false,
          },
        },
        size: {
          value: {
            min: 3,
            max: 16,
          },
          animation: {
            enable: !prefersReducedMotion,
            speed: 1.5,
            sync: false,
          },
        },
        links: {
          enable: false,
        },
        move: {
          enable: !prefersReducedMotion,
          direction: 'top',
          speed: {
            min: 0.4,
            max: 0.8,
          },
          random: true,
          straight: false,
          outModes: {
            default: 'out',
          },
        },
      },
      responsive: [
        {
          maxWidth: 1024,
          options: {
            particles: {
              number: {
                value: 28,
                density: {
                  enable: false,
                },
              },
            },
          },
        },
        {
          maxWidth: 767,
          options: {
            interactivity: {
              events: {
                onHover: {
                  enable: false,
                },
              },
            },
            particles: {
              number: {
                value: 18,
                density: {
                  enable: false,
                },
              },
            },
          },
        },
      ],
    }),
    [prefersReducedMotion]
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 w-full h-full z-0 overflow-hidden"
      style={{
        background: [
          'radial-gradient(circle at 16% 22%, rgba(253, 230, 205, 0.55) 0%, transparent 52%)',
          'radial-gradient(circle at 84% 26%, rgba(237, 233, 254, 0.55) 0%, transparent 50%)',
          'radial-gradient(circle at 52% 86%, rgba(209, 250, 229, 0.45) 0%, transparent 55%)',
          'radial-gradient(circle at 72% 62%, rgba(254, 243, 199, 0.42) 0%, transparent 48%)',
          'linear-gradient(135deg, #FAF8F5 0%, #F4F5F0 48%, #F6F3FA 100%)',
        ].join(', '),
      }}
    >
      {init && (
        <Particles
          id="hero-tsparticles"
          className="pointer-events-none absolute inset-0 w-full h-full"
          options={options}
        />
      )}
    </div>
  );
};

export const HeroParticlesBackground = memo(HeroParticlesBackgroundComponent);
export default HeroParticlesBackground;
