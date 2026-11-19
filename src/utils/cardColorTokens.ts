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
  // 1. Brand Blue (#1C35EA) & White Subtle Gradient
  {
    id: 'blue',
    name: 'Sapphire Blue',
    cardBg: 'bg-gradient-to-br from-white via-[#F6F9FF] to-[#EEF4FF] rounded-[16px] shadow-[0_10px_28px_-8px_rgba(20,32,90,0.08)]',
    cardBorder: 'border-[#1C35EA]/15',
    cardHoverBorder: 'hover:border-[#1C35EA]/40',
    cardHoverShadow: 'hover:shadow-[0_14px_32px_-8px_rgba(28,53,234,0.14)]',
    badgeBg: 'bg-[#EEF4FF]',
    badgeText: 'text-[#14205A]',
    badgeBorder: 'border-[#1C35EA]/20',
    iconBg: 'bg-gradient-to-br from-[#00B0F0] to-[#1C35EA]',
    iconText: 'text-white',
    iconSoftBg: 'bg-[#EEF4FF]',
    iconSoftText: 'text-[#1C35EA]',
    accentText: 'text-[#1C35EA]',
    accentHoverText: 'hover:text-[#14205A]',
    dotBg: 'bg-[#1C35EA]',
    glowColor: 'from-[#1C35EA]/12',
    hexPrimary: '#1C35EA',
    hexBg: '#F4F8FF',
  },

  // 2. Brand Cyan (#00B0F0) & White Subtle Gradient
  {
    id: 'cyan',
    name: 'Electric Cyan',
    cardBg: 'bg-gradient-to-br from-white via-[#F4FBFF] to-[#E8F8FF] rounded-[16px] shadow-[0_10px_28px_-8px_rgba(20,32,90,0.08)]',
    cardBorder: 'border-[#00B0F0]/22',
    cardHoverBorder: 'hover:border-[#00B0F0]/50',
    cardHoverShadow: 'hover:shadow-[0_14px_32px_-8px_rgba(0,176,240,0.14)]',
    badgeBg: 'bg-[#E8F8FF]',
    badgeText: 'text-[#14205A]',
    badgeBorder: 'border-[#00B0F0]/30',
    iconBg: 'bg-gradient-to-br from-[#00B0F0] to-[#1C35EA]',
    iconText: 'text-white',
    iconSoftBg: 'bg-[#E8F8FF]',
    iconSoftText: 'text-[#00B0F0]',
    accentText: 'text-[#1C35EA]',
    accentHoverText: 'hover:text-[#00B0F0]',
    dotBg: 'bg-[#00B0F0]',
    glowColor: 'from-[#00B0F0]/14',
    hexPrimary: '#00B0F0',
    hexBg: '#F2FAFD',
  },

  // 3. Brand Purple (#4D19EA) & White Subtle Gradient
  {
    id: 'violet',
    name: 'Deep Violet',
    cardBg: 'bg-gradient-to-br from-white via-[#F7F5FF] to-[#EFEAFF] rounded-[16px] shadow-[0_10px_28px_-8px_rgba(20,32,90,0.08)]',
    cardBorder: 'border-[#4D19EA]/16',
    cardHoverBorder: 'hover:border-[#4D19EA]/40',
    cardHoverShadow: 'hover:shadow-[0_14px_32px_-8px_rgba(77,25,234,0.14)]',
    badgeBg: 'bg-[#F2EEFF]',
    badgeText: 'text-[#14205A]',
    badgeBorder: 'border-[#4D19EA]/22',
    iconBg: 'bg-gradient-to-br from-[#1C35EA] to-[#4D19EA]',
    iconText: 'text-white',
    iconSoftBg: 'bg-[#F2EEFF]',
    iconSoftText: 'text-[#4D19EA]',
    accentText: 'text-[#4D19EA]',
    accentHoverText: 'hover:text-[#1C35EA]',
    dotBg: 'bg-[#4D19EA]',
    glowColor: 'from-[#4D19EA]/12',
    hexPrimary: '#4D19EA',
    hexBg: '#F6F4FF',
  },

  // 4. Brand Navy (#14205A) & Cyan Subtle Gradient
  {
    id: 'teal',
    name: 'Aquamarine Teal',
    cardBg: 'bg-gradient-to-br from-white via-[#F4FAFF] to-[#EAF5FF] rounded-[16px] shadow-[0_10px_28px_-8px_rgba(20,32,90,0.08)]',
    cardBorder: 'border-[#00B0F0]/20',
    cardHoverBorder: 'hover:border-[#00B0F0]/45',
    cardHoverShadow: 'hover:shadow-[0_14px_32px_-8px_rgba(20,32,90,0.14)]',
    badgeBg: 'bg-[#EEF6FF]',
    badgeText: 'text-[#14205A]',
    badgeBorder: 'border-[#00B0F0]/25',
    iconBg: 'bg-gradient-to-br from-[#14205A] to-[#1C35EA]',
    iconText: 'text-white',
    iconSoftBg: 'bg-[#EEF6FF]',
    iconSoftText: 'text-[#14205A]',
    accentText: 'text-[#14205A]',
    accentHoverText: 'hover:text-[#1C35EA]',
    dotBg: 'bg-[#00B0F0]',
    glowColor: 'from-[#00B0F0]/12',
    hexPrimary: '#00B0F0',
    hexBg: '#F4FAFF',
  },

  // 5. Brand Blue-Cyan Fusion Subtle Gradient
  {
    id: 'coral',
    name: 'Sunset Coral',
    cardBg: 'bg-gradient-to-br from-white via-[#F5F8FF] to-[#EBF3FF] rounded-[16px] shadow-[0_10px_28px_-8px_rgba(20,32,90,0.08)]',
    cardBorder: 'border-[#1C35EA]/16',
    cardHoverBorder: 'hover:border-[#00B0F0]/45',
    cardHoverShadow: 'hover:shadow-[0_14px_32px_-8px_rgba(28,53,234,0.14)]',
    badgeBg: 'bg-[#EEF4FF]',
    badgeText: 'text-[#14205A]',
    badgeBorder: 'border-[#1C35EA]/22',
    iconBg: 'bg-gradient-to-br from-[#00B0F0] to-[#1C35EA]',
    iconText: 'text-white',
    iconSoftBg: 'bg-[#EEF4FF]',
    iconSoftText: 'text-[#1C35EA]',
    accentText: 'text-[#1C35EA]',
    accentHoverText: 'hover:text-[#00B0F0]',
    dotBg: 'bg-[#1C35EA]',
    glowColor: 'from-[#1C35EA]/12',
    hexPrimary: '#1C35EA',
    hexBg: '#F5F8FF',
  },

  // 6. Brand Purple-Blue Fusion Subtle Gradient
  {
    id: 'lavender',
    name: 'Radiant Lavender',
    cardBg: 'bg-gradient-to-br from-white via-[#F8F6FF] to-[#F0EBFF] rounded-[16px] shadow-[0_10px_28px_-8px_rgba(20,32,90,0.08)]',
    cardBorder: 'border-[#4D19EA]/18',
    cardHoverBorder: 'hover:border-[#4D19EA]/45',
    cardHoverShadow: 'hover:shadow-[0_14px_32px_-8px_rgba(77,25,234,0.14)]',
    badgeBg: 'bg-[#F3EFFF]',
    badgeText: 'text-[#14205A]',
    badgeBorder: 'border-[#4D19EA]/25',
    iconBg: 'bg-gradient-to-br from-[#4D19EA] to-[#1C35EA]',
    iconText: 'text-white',
    iconSoftBg: 'bg-[#F3EFFF]',
    iconSoftText: 'text-[#4D19EA]',
    accentText: 'text-[#4D19EA]',
    accentHoverText: 'hover:text-[#14205A]',
    dotBg: 'bg-[#4D19EA]',
    glowColor: 'from-[#4D19EA]/12',
    hexPrimary: '#4D19EA',
    hexBg: '#F8F6FF',
  },

  // 7. Brand Cyan-Navy Subtle Gradient
  {
    id: 'emerald',
    name: 'Spring Emerald',
    cardBg: 'bg-gradient-to-br from-white via-[#F3FBFF] to-[#E6F6FF] rounded-[16px] shadow-[0_10px_28px_-8px_rgba(20,32,90,0.08)]',
    cardBorder: 'border-[#00B0F0]/22',
    cardHoverBorder: 'hover:border-[#00B0F0]/50',
    cardHoverShadow: 'hover:shadow-[0_14px_32px_-8px_rgba(0,176,240,0.14)]',
    badgeBg: 'bg-[#E8F8FF]',
    badgeText: 'text-[#14205A]',
    badgeBorder: 'border-[#00B0F0]/28',
    iconBg: 'bg-gradient-to-br from-[#00B0F0] to-[#14205A]',
    iconText: 'text-white',
    iconSoftBg: 'bg-[#E8F8FF]',
    iconSoftText: 'text-[#00B0F0]',
    accentText: 'text-[#14205A]',
    accentHoverText: 'hover:text-[#00B0F0]',
    dotBg: 'bg-[#00B0F0]',
    glowColor: 'from-[#00B0F0]/14',
    hexPrimary: '#00B0F0',
    hexBg: '#F3FBFF',
  },

  // 8. Brand Royal Navy (#14205A) & Blue (#1C35EA) Subtle Gradient
  {
    id: 'amber',
    name: 'Warm Amber',
    cardBg: 'bg-gradient-to-br from-white via-[#F4F7FF] to-[#EAEFFF] rounded-[16px] shadow-[0_10px_28px_-8px_rgba(20,32,90,0.08)]',
    cardBorder: 'border-[#14205A]/15',
    cardHoverBorder: 'hover:border-[#1C35EA]/45',
    cardHoverShadow: 'hover:shadow-[0_14px_32px_-8px_rgba(20,32,90,0.14)]',
    badgeBg: 'bg-[#EEF2FF]',
    badgeText: 'text-[#14205A]',
    badgeBorder: 'border-[#14205A]/20',
    iconBg: 'bg-gradient-to-br from-[#14205A] to-[#4D19EA]',
    iconText: 'text-white',
    iconSoftBg: 'bg-[#EEF2FF]',
    iconSoftText: 'text-[#14205A]',
    accentText: 'text-[#14205A]',
    accentHoverText: 'hover:text-[#1C35EA]',
    dotBg: 'bg-[#14205A]',
    glowColor: 'from-[#14205A]/12',
    hexPrimary: '#14205A',
    hexBg: '#F4F7FF',
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
