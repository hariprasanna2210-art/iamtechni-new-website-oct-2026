import { servicesData } from './servicesData';
import { ServiceItem, PageRoute } from '../types';
import { RobotAnimationState } from '../components/robot-hero/RobotController';

/**
 * Data-driven speech scripts for the IAMTECHNI AI Ambassador Robot.
 * All spoken lines are derived from this file and servicesData.ts.
 */
export const ROBOT_SPEECH_DATA = {
  welcomeIntro:
    'Welcome to IAMTECHNI. We help businesses build smarter, innovate faster, and grow further. Let me show you what we do.',
  closingLine:
    "That's what we do at IAMTECHNI. Click any technology to learn more, or talk to our team.",
  greetMessage: 'Hi! Welcome to IAMTECHNI. How can we help you today?',
};

export interface HeroFloatingServiceCard {
  id: string;
  slug: string;
  sceneNumber: number;
  sceneLabel: string;
  title: string;
  shortTitle: string;
  badgeText: string;
  category: string;
  tagline: string;
  spokenLine: string;
  hashHref: string;
  detailRoute: PageRoute;
  side: 'left-top' | 'left-mid' | 'left-bottom' | 'right-top' | 'right-mid' | 'right-bottom';
  showOnTablet: boolean;
  beamTarget: { x: number; y: number };
  gestureState: RobotAnimationState;
  robotServiceId: string;
}

export interface RobotTourStep {
  index: number;
  type: 'welcome' | 'service' | 'closing';
  text: string;
  serviceSlug: string;
  card?: HeroFloatingServiceCard;
}

const SHORT_TITLE_MAP: Record<string, string> = {
  'ai-machine-learning': 'AI & ML',
  'custom-software': 'Custom Software',
  'web-development': 'Web Dev',
  'cloud-devops': 'Cloud & DevOps',
  'mobile-apps': 'Mobile Apps',
  'digital-marketing': 'Marketing & SEO',
};

const SYMMETRIC_SLOTS: {
  side: HeroFloatingServiceCard['side'];
  showOnTablet: boolean;
  beamTarget: { x: number; y: number };
  gestureState: RobotAnimationState;
  robotServiceId: string;
}[] = [
  {
    side: 'left-top',
    showOnTablet: true,
    beamTarget: { x: 85, y: 78 },
    gestureState: 'pointing',
    robotServiceId: 'ai-ml',
  },
  {
    side: 'left-mid',
    showOnTablet: true,
    beamTarget: { x: 65, y: 215 },
    gestureState: 'presenting',
    robotServiceId: 'custom-software',
  },
  {
    side: 'left-bottom',
    showOnTablet: true,
    beamTarget: { x: 85, y: 348 },
    gestureState: 'pointing',
    robotServiceId: 'web-dev',
  },
  {
    side: 'right-top',
    showOnTablet: true,
    beamTarget: { x: 415, y: 78 },
    gestureState: 'pointing',
    robotServiceId: 'cloud-devops',
  },
  {
    side: 'right-mid',
    showOnTablet: true,
    beamTarget: { x: 435, y: 215 },
    gestureState: 'presenting',
    robotServiceId: 'mobile-apps',
  },
  {
    side: 'right-bottom',
    showOnTablet: true,
    beamTarget: { x: 415, y: 348 },
    gestureState: 'pointing',
    robotServiceId: 'digital-marketing',
  },
];

/**
 * Formats a concise spoken 1-2 sentence summary for any service from servicesData.ts
 */
export function buildServiceSpokenLine(service: ServiceItem): string {
  const cleanTitle = service.title.replace(/&/g, 'and');
  const firstSentence =
    (service.tagline || service.summary || '')
      .split(/(?<=[.!?])\s+/)[0]
      .trim() || service.title;
  return `${cleanTitle}: ${firstSentence}`;
}

/**
 * Derives a compact shortTitle for mobile chips if not explicitly mapped
 */
function deriveShortTitle(service: ServiceItem): string {
  const slug = service.slug || service.id;
  if (SHORT_TITLE_MAP[slug]) {
    return SHORT_TITLE_MAP[slug];
  }
  return service.title
    .replace('Artificial Intelligence', 'AI')
    .replace('Machine Learning', 'ML')
    .replace('Application Development', 'Dev')
    .replace('Development', 'Dev')
    .replace('Engineering', '')
    .replace('Digital ', '')
    .trim();
}

/**
 * Dynamically generates the 6 symmetric floating service cards around the hero robot
 * directly from servicesData.ts.
 */
export function getHeroFloatingServiceCards(): HeroFloatingServiceCard[] {
  const preferredSlugs = [
    'ai-machine-learning',
    'custom-software',
    'web-development',
    'cloud-devops',
    'mobile-apps',
    'digital-marketing',
  ];

  const selectedServices: ServiceItem[] = [];
  for (const slug of preferredSlugs) {
    const found = servicesData.find((s) => s.slug === slug || s.id === slug);
    if (found && !selectedServices.some((x) => x.slug === found.slug)) {
      selectedServices.push(found);
    }
  }

  for (const s of servicesData) {
    if (selectedServices.length >= 6) break;
    if (!selectedServices.some((x) => x.slug === s.slug)) {
      selectedServices.push(s);
    }
  }

  return selectedServices.slice(0, 6).map((service, index) => {
    const slot = SYMMETRIC_SLOTS[index % SYMMETRIC_SLOTS.length];
    const slug = service.slug || service.id;

    const badgeText =
      service.technologies && service.technologies.length >= 2
        ? `${service.technologies[0].split(' ')[0]} · ${service.technologies[1].split(' ')[0]}`
        : service.category;

    return {
      id: service.id,
      slug,
      sceneNumber: index + 1,
      sceneLabel: `Scene 0${index + 1} · ${service.category.split('&')[0].trim()}`,
      title: service.title,
      shortTitle: deriveShortTitle(service),
      badgeText,
      category: service.category,
      tagline: service.tagline,
      spokenLine: buildServiceSpokenLine(service),
      hashHref: `/services/${slug}`,
      detailRoute: `/services/${slug}` as PageRoute,
      side: slot.side,
      showOnTablet: slot.showOnTablet,
      beamTarget: slot.beamTarget,
      gestureState: slot.gestureState,
      robotServiceId: slot.robotServiceId,
    };
  });
}

/**
 * Builds the complete ordered tour steps:
 * [0] Welcome line -> [1..6] Each service line -> [7] Closing line
 */
export function getRobotTourSteps(cards?: HeroFloatingServiceCard[]): RobotTourStep[] {
  const floatingCards = cards || getHeroFloatingServiceCards();
  const firstSlug = floatingCards[0]?.slug || 'ai-machine-learning';

  const steps: RobotTourStep[] = [
    {
      index: 0,
      type: 'welcome',
      text: ROBOT_SPEECH_DATA.welcomeIntro,
      serviceSlug: firstSlug,
      card: floatingCards[0],
    },
  ];

  floatingCards.forEach((card, i) => {
    steps.push({
      index: i + 1,
      type: 'service',
      text: card.spokenLine,
      serviceSlug: card.slug,
      card,
    });
  });

  steps.push({
    index: steps.length,
    type: 'closing',
    text: ROBOT_SPEECH_DATA.closingLine,
    serviceSlug: firstSlug,
    card: floatingCards[0],
  });

  return steps;
}

/**
 * Computes readable step duration based on word count (~350ms per word, minimum 3000ms)
 */
export function getStepReadingDurationMs(text: string): number {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(3000, words * 350);
}
