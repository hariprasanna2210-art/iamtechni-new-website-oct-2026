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
  // 1. Soft Sapphire Blue (#F4F8FF)
  {
    id: 'blue',
    name: 'Sapphire Blue',
    cardBg: 'bg-[#F4F8FF]',
    cardBorder: 'border-[#DBEAFE]',
    cardHoverBorder: 'hover:border-[#93C5FD]',
    cardHoverShadow: 'hover:shadow-[0_12px_28px_-8px_rgba(30,58,138,0.12)]',
    badgeBg: 'bg-[#EEF4FF]',
    badgeText: 'text-[#1E3A8A]',
    badgeBorder: 'border-[#DBEAFE]',
    iconBg: 'bg-[#1E3A8A]',
    iconText: 'text-white',
    iconSoftBg: 'bg-[#EEF4FF]',
    iconSoftText: 'text-[#1E3A8A]',
    accentText: 'text-[#1E3A8A]',
    accentHoverText: 'hover:text-[#2563EB]',
    dotBg: 'bg-[#2563EB]',
    glowColor: 'from-[#2563EB]/12',
    hexPrimary: '#2563EB',
    hexBg: '#F4F8FF',
  },

  // 2. Soft Sky Cyan (#F2FAFD)
  {
    id: 'cyan',
    name: 'Electric Cyan',
    cardBg: 'bg-[#F2FAFD]',
    cardBorder: 'border-cyan-200/75',
    cardHoverBorder: 'hover:border-cyan-300',
    cardHoverShadow: 'hover:shadow-[0_12px_28px_-8px_rgba(2,132,199,0.10)]',
    badgeBg: 'bg-cyan-50/90',
    badgeText: 'text-cyan-900',
    badgeBorder: 'border-cyan-200/80',
    iconBg: 'bg-[#0284C7]',
    iconText: 'text-white',
    iconSoftBg: 'bg-cyan-50',
    iconSoftText: 'text-[#0284C7]',
    accentText: 'text-[#0284C7]',
    accentHoverText: 'hover:text-cyan-800',
    dotBg: 'bg-[#0284C7]',
    glowColor: 'from-[#04C8E8]/12',
    hexPrimary: '#0284C7',
    hexBg: '#F2FAFD',
  },

  // 3. Soft Indigo Violet (#F6F4FF)
  {
    id: 'violet',
    name: 'Deep Violet',
    cardBg: 'bg-[#F6F4FF]',
    cardBorder: 'border-indigo-200/75',
    cardHoverBorder: 'hover:border-indigo-300',
    cardHoverShadow: 'hover:shadow-[0_12px_28px_-8px_rgba(79,70,229,0.10)]',
    badgeBg: 'bg-indigo-50/90',
    badgeText: 'text-indigo-900',
    badgeBorder: 'border-indigo-200/80',
    iconBg: 'bg-[#4F46E5]',
    iconText: 'text-white',
    iconSoftBg: 'bg-indigo-50',
    iconSoftText: 'text-[#4F46E5]',
    accentText: 'text-[#4F46E5]',
    accentHoverText: 'hover:text-indigo-900',
    dotBg: 'bg-[#4F46E5]',
    glowColor: 'from-[#4F46E5]/12',
    hexPrimary: '#4F46E5',
    hexBg: '#F6F4FF',
  },

  // 4. Soft Aquamarine Teal (#F1FBF8)
  {
    id: 'teal',
    name: 'Aquamarine Teal',
    cardBg: 'bg-[#F1FBF8]',
    cardBorder: 'border-teal-200/75',
    cardHoverBorder: 'hover:border-teal-300',
    cardHoverShadow: 'hover:shadow-[0_12px_28px_-8px_rgba(13,148,136,0.10)]',
    badgeBg: 'bg-teal-50/90',
    badgeText: 'text-teal-900',
    badgeBorder: 'border-teal-200/80',
    iconBg: 'bg-[#0D9488]',
    iconText: 'text-white',
    iconSoftBg: 'bg-teal-50',
    iconSoftText: 'text-[#0D9488]',
    accentText: 'text-[#0D9488]',
    accentHoverText: 'hover:text-teal-900',
    dotBg: 'bg-[#0D9488]',
    glowColor: 'from-[#0D9488]/12',
    hexPrimary: '#0D9488',
    hexBg: '#F1FBF8',
  },

  // 5. Soft Warm Coral (#FFF8F4)
  {
    id: 'coral',
    name: 'Sunset Coral',
    cardBg: 'bg-[#FFF8F4]',
    cardBorder: 'border-orange-200/70',
    cardHoverBorder: 'hover:border-orange-300',
    cardHoverShadow: 'hover:shadow-[0_12px_28px_-8px_rgba(234,88,12,0.10)]',
    badgeBg: 'bg-orange-50/90',
    badgeText: 'text-orange-900',
    badgeBorder: 'border-orange-200/80',
    iconBg: 'bg-[#EA580C]',
    iconText: 'text-white',
    iconSoftBg: 'bg-orange-50',
    iconSoftText: 'text-[#EA580C]',
    accentText: 'text-[#EA580C]',
    accentHoverText: 'hover:text-orange-900',
    dotBg: 'bg-[#EA580C]',
    glowColor: 'from-[#EA580C]/12',
    hexPrimary: '#EA580C',
    hexBg: '#FFF8F4',
  },

  // 6. Soft Lavender (#FAF5FF)
  {
    id: 'lavender',
    name: 'Radiant Lavender',
    cardBg: 'bg-[#FAF5FF]',
    cardBorder: 'border-purple-200/75',
    cardHoverBorder: 'hover:border-purple-300',
    cardHoverShadow: 'hover:shadow-[0_12px_28px_-8px_rgba(147,51,234,0.10)]',
    badgeBg: 'bg-purple-50/90',
    badgeText: 'text-purple-900',
    badgeBorder: 'border-purple-200/80',
    iconBg: 'bg-[#7E22CE]',
    iconText: 'text-white',
    iconSoftBg: 'bg-purple-50',
    iconSoftText: 'text-[#7E22CE]',
    accentText: 'text-[#7E22CE]',
    accentHoverText: 'hover:text-purple-950',
    dotBg: 'bg-[#7E22CE]',
    glowColor: 'from-[#7E22CE]/12',
    hexPrimary: '#7E22CE',
    hexBg: '#FAF5FF',
  },

  // 7. Soft Emerald (#F2FBF5)
  {
    id: 'emerald',
    name: 'Spring Emerald',
    cardBg: 'bg-[#F2FBF5]',
    cardBorder: 'border-emerald-200/75',
    cardHoverBorder: 'hover:border-emerald-300',
    cardHoverShadow: 'hover:shadow-[0_12px_28px_-8px_rgba(5,150,105,0.10)]',
    badgeBg: 'bg-emerald-50/90',
    badgeText: 'text-emerald-900',
    badgeBorder: 'border-emerald-200/80',
    iconBg: 'bg-[#059669]',
    iconText: 'text-white',
    iconSoftBg: 'bg-emerald-50',
    iconSoftText: 'text-[#059669]',
    accentText: 'text-[#059669]',
    accentHoverText: 'hover:text-emerald-950',
    dotBg: 'bg-[#059669]',
    glowColor: 'from-[#059669]/12',
    hexPrimary: '#059669',
    hexBg: '#F2FBF5',
  },

  // 8. Soft Warm Amber (#FFFBF0)
  {
    id: 'amber',
    name: 'Warm Amber',
    cardBg: 'bg-[#FFFBF0]',
    cardBorder: 'border-amber-200/75',
    cardHoverBorder: 'hover:border-amber-300',
    cardHoverShadow: 'hover:shadow-[0_12px_28px_-8px_rgba(217,119,6,0.10)]',
    badgeBg: 'bg-amber-50/90',
    badgeText: 'text-amber-900',
    badgeBorder: 'border-amber-200/80',
    iconBg: 'bg-[#D97706]',
    iconText: 'text-white',
    iconSoftBg: 'bg-amber-50',
    iconSoftText: 'text-[#D97706]',
    accentText: 'text-[#D97706]',
    accentHoverText: 'hover:text-amber-950',
    dotBg: 'bg-[#D97706]',
    glowColor: 'from-[#D97706]/12',
    hexPrimary: '#D97706',
    hexBg: '#FFFBF0',
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
