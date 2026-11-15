import React from 'react';

export interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  label?: string;
  showStatusRole?: boolean;
  className?: string;
}

const BAR_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 48,
  color = '#4D19EA',
  label,
  showStatusRole = true,
  className = '',
}) => {
  const halfSize = size / 2;

  return (
    <div
      role={showStatusRole ? 'status' : undefined}
      aria-live={showStatusRole ? 'polite' : undefined}
      className={`loading-spinner-root inline-flex flex-col items-center justify-center shrink-0 ${
        label ? 'gap-3' : ''
      } ${className}`}
    >
      <div
        aria-hidden="true"
        className="relative shrink-0"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {BAR_INDICES.map((index) => (
          <span
            key={index}
            className="loading-spinner-bar absolute top-0 block"
            style={
              {
                left: '46.25%',
                width: '7.5%',
                height: '27%',
                borderRadius: '999px',
                backgroundColor: color,
                transform: `rotate(${index * 30}deg)`,
                transformOrigin: `50% ${halfSize}px`,
                '--spinner-index': index,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {label ? (
        <span className="text-[14px] leading-snug font-medium text-[#334155] text-center">
          {label}
        </span>
      ) : (
        <span className="sr-only">Loading…</span>
      )}
    </div>
  );
};

export default LoadingSpinner;
