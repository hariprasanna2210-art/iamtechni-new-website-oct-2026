import React from 'react';
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiPython,
  SiDocker,
  SiKubernetes,
  SiFigma,
  SiPostgresql,
  SiGithub,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { TbBrandAzure, TbBrandOpenai } from 'react-icons/tb';

export interface OrbitBadgeItem {
  id: string;
  name: string;
  shortName?: string;
  ring: 'inner' | 'middle' | 'outer';
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  isBrandIcon?: boolean;
  brandText?: string;
  brandColor?: string;
  services: string[]; // Related service IDs/slugs for dynamic highlight
}

/**
 * Single source of truth for the 3 orbiting rings around the hero robot.
 * Easily extensible by adding new items to any ring.
 */
export const HERO_ORBIT_ITEMS: OrbitBadgeItem[] = [
  // =========================================================================
  // LAYER 1: INNER RING (IAMTECHNI Brand Items)
  // Small glass badges with the IAMTECHNI symbol & short brand words
  // =========================================================================
  {
    id: 'brand-ai',
    name: 'IAMTECHNI AI',
    brandText: 'IAMTECHNI AI',
    ring: 'inner',
    isBrandIcon: true,
    brandColor: '#2563EB',
    services: ['ai-ml', 'ai-machine-learning'],
  },
  {
    id: 'brand-engineering',
    name: 'Engineering',
    brandText: 'Engineering',
    ring: 'inner',
    isBrandIcon: true,
    brandColor: '#06B6D4',
    services: ['web-dev', 'custom-software', 'web-development'],
  },
  {
    id: 'brand-innovation',
    name: 'Innovation',
    brandText: 'Innovation',
    ring: 'inner',
    isBrandIcon: true,
    brandColor: '#2563EB',
    services: ['robotics', 'robotics-automation', 'ai-ml'],
  },
  {
    id: 'brand-delivery',
    name: 'Global Delivery',
    brandText: 'Delivery',
    ring: 'inner',
    isBrandIcon: true,
    brandColor: '#06B6D4',
    services: ['cloud-devops', 'cloud-computing', 'digital-marketing'],
  },

  // =========================================================================
  // LAYER 2: MIDDLE RING (Web & Core Technologies - Logo + Name)
  // Small white pill badges
  // =========================================================================
  {
    id: 'tech-react',
    name: 'React',
    ring: 'middle',
    icon: SiReact,
    brandColor: '#61DAFB',
    services: ['web-dev', 'web-development', 'mobile-apps'],
  },
  {
    id: 'tech-nextjs',
    name: 'Next.js',
    ring: 'middle',
    icon: SiNextdotjs,
    brandColor: '#000000',
    services: ['web-dev', 'web-development'],
  },
  {
    id: 'tech-typescript',
    name: 'TypeScript',
    ring: 'middle',
    icon: SiTypescript,
    brandColor: '#3178C6',
    services: ['web-dev', 'custom-software', 'custom-software-development'],
  },
  {
    id: 'tech-tailwind',
    name: 'Tailwind CSS',
    ring: 'middle',
    icon: SiTailwindcss,
    brandColor: '#06B6D4',
    services: ['web-dev', 'ui-ux', 'ui-ux-design'],
  },
  {
    id: 'tech-nodejs',
    name: 'Node.js',
    ring: 'middle',
    icon: SiNodedotjs,
    brandColor: '#339933',
    services: ['custom-software', 'custom-software-development', 'web-dev'],
  },
  {
    id: 'tech-python',
    name: 'Python',
    ring: 'middle',
    icon: SiPython,
    brandColor: '#3776AB',
    services: ['ai-ml', 'ai-machine-learning', 'robotics', 'data-analytics'],
  },

  // =========================================================================
  // LAYER 3: OUTER RING (Tools & Platforms - Logo Only)
  // Small round badges
  // =========================================================================
  {
    id: 'platform-aws',
    name: 'AWS',
    ring: 'outer',
    icon: FaAws,
    brandColor: '#FF9900',
    services: ['cloud-devops', 'cloud-computing'],
  },
  {
    id: 'platform-azure',
    name: 'Microsoft Azure',
    shortName: 'Azure',
    ring: 'outer',
    icon: TbBrandAzure,
    brandColor: '#0078D4',
    services: ['cloud-devops', 'cloud-computing'],
  },
  {
    id: 'platform-docker',
    name: 'Docker',
    ring: 'outer',
    icon: SiDocker,
    brandColor: '#2496ED',
    services: ['cloud-devops', 'custom-software'],
  },
  {
    id: 'platform-kubernetes',
    name: 'Kubernetes',
    ring: 'outer',
    icon: SiKubernetes,
    brandColor: '#326CE5',
    services: ['cloud-devops', 'cloud-computing'],
  },
  {
    id: 'platform-figma',
    name: 'Figma',
    ring: 'outer',
    icon: SiFigma,
    brandColor: '#F24E1E',
    services: ['ui-ux', 'ui-ux-design', 'web-dev'],
  },
  {
    id: 'platform-postgres',
    name: 'PostgreSQL',
    ring: 'outer',
    icon: SiPostgresql,
    brandColor: '#4169E1',
    services: ['custom-software', 'cloud-devops', 'data-analytics'],
  },
  {
    id: 'platform-openai',
    name: 'OpenAI',
    ring: 'outer',
    icon: TbBrandOpenai,
    brandColor: '#10A37F',
    services: ['ai-ml', 'ai-machine-learning'],
  },
  {
    id: 'platform-github',
    name: 'GitHub',
    ring: 'outer',
    icon: SiGithub,
    brandColor: '#181717',
    services: ['cloud-devops', 'custom-software'],
  },
];

/**
 * Filter items by ring layer
 */
export const getOrbitItemsByRing = (ring: 'inner' | 'middle' | 'outer'): OrbitBadgeItem[] => {
  return HERO_ORBIT_ITEMS.filter((item) => item.ring === ring);
};

/**
 * Check if a badge relates to the currently active service
 */
export const isBadgeRelatedToService = (item: OrbitBadgeItem, activeServiceId: string): boolean => {
  if (!activeServiceId) return false;
  const target = activeServiceId.toLowerCase().trim();
  return item.services.some((s) => s.toLowerCase() === target || target.includes(s.toLowerCase()));
};
