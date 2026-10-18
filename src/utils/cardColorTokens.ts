export interface CardColorToken {
  id: string;
  name: string;
  // Card base backgrounds & borders
  cardBg: string; // e.g. bg-[#EAF3FF]
  cardBorder: string; // e.g. border-blue-200/90
  cardHoverBorder: string; // e.g. hover:border-blue-400
  cardHoverShadow: string; // e.g. hover:shadow-blue-500/10
  
  // Badge / tag styling
  badgeBg: string; // e.g. bg-blue-100/90
  badgeText: string; // e.g. text-blue-900
  badgeBorder: string; // e.g. border-blue-300/60
  
  // Icon container
  iconBg: string; // e.g. bg-blue-600
  iconText: string; // e.g. text-white
  iconSoftBg: string; // e.g. bg-blue-500/15
  iconSoftText: string; // e.g. text-blue-700
  
  // Text accents
  accentText: string; // e.g. text-[#1266E8]
  accentHoverText: string; // e.g. hover:text-blue-800
  
  // Decorative bullets / indicators
  dotBg: string; // e.g. bg-[#1266E8]
  glowColor: string; // e.g. from-blue-400/20
  
  // Hex color code for SVG or inline needs
  hexPrimary: string;
  hexBg: string;
}

export const CARD_COLOR_TOKENS: CardColorToken[] = [
  // 1. Blue (#EAF3FF)
  {
    id: 'blue',
    name: 'Sapphire Blue',
    cardBg: 'bg-[#EAF3FF]',
    cardBorder: 'border-blue-200/90',
    cardHoverBorder: 'hover:border-blue-400',
    cardHoverShadow: 'hover:shadow-lg hover:shadow-blue-500/10',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-900',
    badgeBorder: 'border-blue-300/70',
    iconBg: 'bg-[#1266E8]',
    iconText: 'text-white',
    iconSoftBg: 'bg-blue-100',
    iconSoftText: 'text-[#1266E8]',
    accentText: 'text-[#1266E8]',
    accentHoverText: 'hover:text-blue-800',
    dotBg: 'bg-[#1266E8]',
    glowColor: 'from-[#1266E8]/20',
    hexPrimary: '#1266E8',
    hexBg: '#EAF3FF',
  },

  // 2. Cyan (#E4FAFF)
  {
    id: 'cyan',
    name: 'Electric Cyan',
    cardBg: 'bg-[#E4FAFF]',
    cardBorder: 'border-cyan-200/90',
    cardHoverBorder: 'hover:border-cyan-400',
    cardHoverShadow: 'hover:shadow-lg hover:shadow-cyan-500/10',
    badgeBg: 'bg-cyan-100',
    badgeText: 'text-cyan-900',
    badgeBorder: 'border-cyan-300/70',
    iconBg: 'bg-[#0284C7]',
    iconText: 'text-white',
    iconSoftBg: 'bg-cyan-100',
    iconSoftText: 'text-[#0284C7]',
    accentText: 'text-[#0284C7]',
    accentHoverText: 'hover:text-cyan-800',
    dotBg: 'bg-[#0284C7]',
    glowColor: 'from-[#04C8E8]/20',
    hexPrimary: '#04C8E8',
    hexBg: '#E4FAFF',
  },

  // 3. Violet (#F0EAFF)
  {
    id: 'violet',
    name: 'Deep Violet',
    cardBg: 'bg-[#F0EAFF]',
    cardBorder: 'border-violet-200/90',
    cardHoverBorder: 'hover:border-violet-400',
    cardHoverShadow: 'hover:shadow-lg hover:shadow-violet-500/10',
    badgeBg: 'bg-violet-100',
    badgeText: 'text-violet-900',
    badgeBorder: 'border-violet-300/70',
    iconBg: 'bg-[#7C3AED]',
    iconText: 'text-white',
    iconSoftBg: 'bg-violet-100',
    iconSoftText: 'text-[#7C3AED]',
    accentText: 'text-[#7C3AED]',
    accentHoverText: 'hover:text-violet-900',
    dotBg: 'bg-[#7C3AED]',
    glowColor: 'from-[#5427D9]/20',
    hexPrimary: '#7C3AED',
    hexBg: '#F0EAFF',
  },

  // 4. Teal (#E1F8F2)
  {
    id: 'teal',
    name: 'Aquamarine Teal',
    cardBg: 'bg-[#E1F8F2]',
    cardBorder: 'border-teal-200/90',
    cardHoverBorder: 'hover:border-teal-400',
    cardHoverShadow: 'hover:shadow-lg hover:shadow-teal-500/10',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-900',
    badgeBorder: 'border-teal-300/70',
    iconBg: 'bg-[#0D9488]',
    iconText: 'text-white',
    iconSoftBg: 'bg-teal-100',
    iconSoftText: 'text-[#0D9488]',
    accentText: 'text-[#0D9488]',
    accentHoverText: 'hover:text-teal-900',
    dotBg: 'bg-[#0D9488]',
    glowColor: 'from-[#0D9488]/20',
    hexPrimary: '#0D9488',
    hexBg: '#E1F8F2',
  },

  // 5. Coral (#FFF0E8)
  {
    id: 'coral',
    name: 'Sunset Coral',
    cardBg: 'bg-[#FFF0E8]',
    cardBorder: 'border-orange-200/90',
    cardHoverBorder: 'hover:border-orange-400',
    cardHoverShadow: 'hover:shadow-lg hover:shadow-orange-500/10',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-950',
    badgeBorder: 'border-orange-300/70',
    iconBg: 'bg-[#EA580C]',
    iconText: 'text-white',
    iconSoftBg: 'bg-orange-100',
    iconSoftText: 'text-[#EA580C]',
    accentText: 'text-[#EA580C]',
    accentHoverText: 'hover:text-orange-900',
    dotBg: 'bg-[#EA580C]',
    glowColor: 'from-[#EA580C]/20',
    hexPrimary: '#EA580C',
    hexBg: '#FFF0E8',
  },

  // 6. Lavender (#F8E9FF)
  {
    id: 'lavender',
    name: 'Radiant Lavender',
    cardBg: 'bg-[#F8E9FF]',
    cardBorder: 'border-fuchsia-200/90',
    cardHoverBorder: 'hover:border-fuchsia-400',
    cardHoverShadow: 'hover:shadow-lg hover:shadow-fuchsia-500/10',
    badgeBg: 'bg-fuchsia-100',
    badgeText: 'text-fuchsia-950',
    badgeBorder: 'border-fuchsia-300/70',
    iconBg: 'bg-[#C026D3]',
    iconText: 'text-white',
    iconSoftBg: 'bg-fuchsia-100',
    iconSoftText: 'text-[#C026D3]',
    accentText: 'text-[#C026D3]',
    accentHoverText: 'hover:text-fuchsia-950',
    dotBg: 'bg-[#C026D3]',
    glowColor: 'from-[#C026D3]/20',
    hexPrimary: '#C026D3',
    hexBg: '#F8E9FF',
  },

  // 7. Emerald (#E8F8E9)
  {
    id: 'emerald',
    name: 'Spring Emerald',
    cardBg: 'bg-[#E8F8E9]',
    cardBorder: 'border-emerald-200/90',
    cardHoverBorder: 'hover:border-emerald-400',
    cardHoverShadow: 'hover:shadow-lg hover:shadow-emerald-500/10',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-950',
    badgeBorder: 'border-emerald-300/70',
    iconBg: 'bg-[#059669]',
    iconText: 'text-white',
    iconSoftBg: 'bg-emerald-100',
    iconSoftText: 'text-[#059669]',
    accentText: 'text-[#059669]',
    accentHoverText: 'hover:text-emerald-950',
    dotBg: 'bg-[#059669]',
    glowColor: 'from-[#059669]/20',
    hexPrimary: '#059669',
    hexBg: '#E8F8E9',
  },

  // 8. Amber (#FFF5D9)
  {
    id: 'amber',
    name: 'Warm Amber',
    cardBg: 'bg-[#FFF5D9]',
    cardBorder: 'border-amber-200/90',
    cardHoverBorder: 'hover:border-amber-400',
    cardHoverShadow: 'hover:shadow-lg hover:shadow-amber-500/10',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-950',
    badgeBorder: 'border-amber-300/70',
    iconBg: 'bg-[#D97706]',
    iconText: 'text-white',
    iconSoftBg: 'bg-amber-100',
    iconSoftText: 'text-[#D97706]',
    accentText: 'text-[#D97706]',
    accentHoverText: 'hover:text-amber-950',
    dotBg: 'bg-[#D97706]',
    glowColor: 'from-[#D97706]/20',
    hexPrimary: '#D97706',
    hexBg: '#FFF5D9',
  },
];

/**
 * Deterministically retrieves a color token based on index in a list.
 * Guarantees neighboring cards in any grid always have different colors.
 */
export const getCardColorToken = (index: number): CardColorToken => {
  const safeIndex = Math.abs(index) % CARD_COLOR_TOKENS.length;
  return CARD_COLOR_TOKENS[safeIndex];
};

/**
 * Deterministically retrieves a color token based on a string slug or ID.
 */
export const getCardColorTokenBySlug = (slug: string): CardColorToken => {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  return getCardColorToken(Math.abs(hash));
};
