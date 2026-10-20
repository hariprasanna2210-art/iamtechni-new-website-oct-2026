import React from 'react';

export interface IamtechniLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  variant?: 'default' | 'light' | 'dark' | 'white';
}

/**
 * Official IAMTECHNI Brand Logo Component
 * 
 * Uses the exact authentic transparent brand logo cropped from user asset:
 * - 100% transparent background (no box, no border, no artificial background)
 * - Scaled to perfect proportions with responsive sizing
 * - High-DPI support with 2x retina srcset
 * - Symbol extraction for compact launcher, chatbot, and favicons
 */
export const IamtechniLogo: React.FC<IamtechniLogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
  variant = 'default',
}) => {
  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-9 sm:h-10',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
  }[size];

  // Symbol only (for icons, chatbot avatar, compact buttons)
  if (!showWordmark) {
    return (
      <img
        src="/logo-symbol.png"
        alt="IAMTECHNI Symbol Logo"
        width={158}
        height={186}
        className={`${heightClasses} w-auto aspect-[158/186] object-contain select-none shrink-0 ${className}`}
        loading="eager"
        decoding="async"
      />
    );
  }

  // Full Wordmark + Symbol
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/logo.png"
        srcSet="/logo.png 1x, /iamtechni-logo-2x.png 2x"
        alt="IAMTECHNI — Enterprise Software, AI & Cloud Engineering"
        width={574}
        height={186}
        className={`${heightClasses} w-auto aspect-[574/186] object-contain select-none block`}
        loading="eager"
        decoding="async"
      />
    </div>
  );
};
