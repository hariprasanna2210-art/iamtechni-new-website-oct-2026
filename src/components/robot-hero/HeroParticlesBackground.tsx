import React, { memo } from 'react';

const HeroParticlesBackgroundComponent: React.FC = () => {
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
    />
  );
};

export const HeroParticlesBackground = memo(HeroParticlesBackgroundComponent);
export default HeroParticlesBackground;

