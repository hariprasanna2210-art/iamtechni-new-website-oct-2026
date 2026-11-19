import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';

export interface MarqueePageLink {
  name: string;
  href: string;
}

export const MARQUEE_PAGE_LINKS: MarqueePageLink[] = [
  { name: 'Services', href: '/services' },
  { name: 'Web Development', href: '/services/web-development' },
  { name: 'Custom Software', href: '/services/custom-software' },
  { name: 'Mobile Applications', href: '/services/mobile-apps' },
  { name: 'AI & Machine Learning', href: '/services/ai-machine-learning' },
  { name: 'Cloud & DevOps', href: '/services/cloud-devops' },
  { name: 'E-commerce Development', href: '/services/ecommerce' },
  { name: 'Solutions', href: '/solutions' },
  { name: 'Industries', href: '/industries' },
  { name: 'Training', href: '/training' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Technology', href: '/technology' },
  { name: 'Insights', href: '/insights' },
  { name: 'About', href: '/about' },
  { name: 'Careers', href: '/careers' },
  { name: 'Locations', href: '/locations' },
  { name: 'Contact', href: '/contact' },
  { name: 'Verify Certificate', href: '/verify' },
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms of Use', href: '/terms' },
];

export const PageLinkMarquee: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);

  return (
    <nav
      aria-label="Quick Page Links"
      data-testid="page-link-marquee"
      className="relative w-full bg-[#14205A] border-t border-white/10 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onTouchCancel={() => setIsPaused(false)}
    >
      {prefersReducedMotion ? (
        <ul className="max-w-[1440px] mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-2 list-none m-0">
          {MARQUEE_PAGE_LINKS.map((item) => (
            <li key={item.href} className="inline-flex items-center">
              <Link
                to={item.href}
                className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[36px] px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 hover:border-[#00B0F0] text-white hover:text-[#00B0F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B0F0] text-[13.5px] font-medium transition-colors whitespace-nowrap"
              >
                <span
                  aria-hidden="true"
                  className="w-1.5 h-1.5 rounded-full bg-[#00B0F0] mr-2 shrink-0"
                />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="relative flex items-center w-full overflow-hidden">
          {/* Left fade overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-20 bg-gradient-to-r from-[#14205A] via-[#14205A]/85 to-transparent z-10"
          />

          {/* Right fade overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-20 bg-gradient-to-l from-[#14205A] via-[#14205A]/85 to-transparent z-10"
          />

          {/* Continuous scrolling track */}
          <div
            data-testid="page-link-marquee-track"
            className={`animate-tech-marquee flex items-center [animation-duration:38s] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] active:[animation-play-state:paused] ${
              isPaused ? '[animation-play-state:paused]' : ''
            }`}
          >
            {/* Primary semantic links for screen readers and search engines */}
            <ul className="flex items-center shrink-0 list-none m-0 p-0">
              {MARQUEE_PAGE_LINKS.map((item) => (
                <li key={item.href} className="inline-flex items-center shrink-0">
                  <Link
                    to={item.href}
                    className="inline-flex items-center min-h-[44px] sm:min-h-[40px] px-3.5 text-[13.5px] sm:text-[14px] font-medium text-white hover:text-[#00B0F0] focus-visible:text-[#00B0F0] focus-visible:outline-none focus-visible:underline transition-colors whitespace-nowrap"
                  >
                    {item.name}
                  </Link>
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-[#00B0F0] shrink-0 mx-1"
                  />
                </li>
              ))}
            </ul>

            {/* Duplicate copy for seamless continuous right-to-left loop */}
            <div aria-hidden="true" className="flex items-center shrink-0">
              {MARQUEE_PAGE_LINKS.map((item) => (
                <div key={`dup-${item.href}`} className="inline-flex items-center shrink-0">
                  <Link
                    to={item.href}
                    tabIndex={-1}
                    className="inline-flex items-center min-h-[44px] sm:min-h-[40px] px-3.5 text-[13.5px] sm:text-[14px] font-medium text-white hover:text-[#00B0F0] transition-colors whitespace-nowrap"
                  >
                    {item.name}
                  </Link>
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-[#00B0F0] shrink-0 mx-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
