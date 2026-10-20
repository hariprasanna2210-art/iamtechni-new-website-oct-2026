import { PageRoute } from '../types';
import { projectsData } from './projectsData';
import { coursesData } from './coursesData';
import { servicesData } from './servicesData';
import { industriesData } from './industriesData';
import { insightsData } from './insightsData';
import { careersData } from './careersData';

export interface HeroBrandCardConfig {
  id: string;
  sceneNumber: number;
  sceneLabel: string;
  title: string;
  countBadge: string;
  rotatingSubtitles: string[];
  route: PageRoute;
  side: 'left-top' | 'left-mid' | 'left-bottom' | 'right-top' | 'right-mid' | 'right-bottom';
  iconType: 'projects' | 'training' | 'marketing' | 'industries' | 'insights' | 'careers';
  floatDuration: number;
  floatDelay: number;
  speechText: string;
  // Beam target coordinates in 500x460 stage SVG space
  beamTarget: { x: number; y: number };
  // Subtle robot head/torso turn target
  robotTargetServiceId: string;
  isHidden?: boolean;
}

/**
 * Generates the 6 IAMTECHNI brand cards dynamically from the real data files.
 * If any data file array is empty, its card is marked isHidden = true.
 */
export function getHeroBrandCards(): HeroBrandCardConfig[] {
  const digitalMarketingService = servicesData.find(
    (s) => s.slug === 'digital-marketing' || s.id === 'digital-marketing'
  );

  const cards: HeroBrandCardConfig[] = [
    // LEFT TOP: IAMTECHNI Projects
    {
      id: 'brand-projects',
      sceneNumber: 1,
      sceneLabel: 'Scene 01 · Portfolio',
      title: 'IAMTECHNI Projects',
      countBadge: `${projectsData.length} Projects Delivered`,
      rotatingSubtitles:
        projectsData.length > 0
          ? projectsData.map((p) => p.title)
          : ['Enterprise Engineering Portfolio'],
      route: '/portfolio',
      side: 'left-top',
      iconType: 'projects',
      floatDuration: 5.2,
      floatDelay: 0,
      speechText: `Explore our portfolio of ${projectsData.length} engineered case studies, including ${projectsData[0]?.title || 'scalable web and AI platforms'}.`,
      beamTarget: { x: 75, y: 75 },
      robotTargetServiceId: 'ai-ml',
      isHidden: projectsData.length === 0,
    },

    // LEFT MID: IAMTECHNI Training
    {
      id: 'brand-training',
      sceneNumber: 2,
      sceneLabel: 'Scene 02 · Academy',
      title: 'IAMTECHNI Training',
      countBadge: `${coursesData.length} Courses`,
      rotatingSubtitles:
        coursesData.length > 0
          ? coursesData.map((c) => c.title)
          : ['Hands-On Technical Programs'],
      route: '/training',
      side: 'left-mid',
      iconType: 'training',
      floatDuration: 5.6,
      floatDelay: 0.7,
      speechText: `We offer ${coursesData.length} industry-aligned technical training programs, featuring ${coursesData[0]?.title || 'Full Stack and AI Engineering'}.`,
      beamTarget: { x: 60, y: 220 },
      robotTargetServiceId: 'web-dev',
      isHidden: coursesData.length === 0,
    },

    // LEFT BOTTOM: Digital Marketing
    {
      id: 'brand-marketing',
      sceneNumber: 3,
      sceneLabel: 'Scene 03 · Growth',
      title: digitalMarketingService?.title || 'Digital Marketing',
      countBadge: 'SEO · Ads · Growth Funnels',
      rotatingSubtitles: [
        'SEO · Ads · Growth Funnels',
        digitalMarketingService?.tagline || 'Search visibility & conversion',
        'Technical SEO & Performance Campaigns',
      ],
      route: `/services/${digitalMarketingService?.slug || 'digital-marketing'}` as PageRoute,
      side: 'left-bottom',
      iconType: 'marketing',
      floatDuration: 5.0,
      floatDelay: 1.4,
      speechText:
        'Our Digital Marketing and Technical SEO practice builds high-converting growth funnels, search visibility, and measurable ROI.',
      beamTarget: { x: 75, y: 360 },
      robotTargetServiceId: 'mobile-apps',
      isHidden: !digitalMarketingService && servicesData.length === 0,
    },

    // RIGHT TOP: Industries
    {
      id: 'brand-industries',
      sceneNumber: 4,
      sceneLabel: 'Scene 04 · Sectors',
      title: 'Industries',
      countBadge: `${industriesData.length} Industries Served`,
      rotatingSubtitles:
        industriesData.length > 0
          ? industriesData.map((ind) => ind.name)
          : ['Cross-Sector Solutions'],
      route: '/industries',
      side: 'right-top',
      iconType: 'industries',
      floatDuration: 5.4,
      floatDelay: 0.4,
      speechText: `We deliver tailored digital infrastructure across ${industriesData.length} core industries, including ${industriesData[0]?.name || 'Education, Retail, and Healthcare'}.`,
      beamTarget: { x: 425, y: 75 },
      robotTargetServiceId: 'cloud-devops',
      isHidden: industriesData.length === 0,
    },

    // RIGHT MID: Insights
    {
      id: 'brand-insights',
      sceneNumber: 5,
      sceneLabel: 'Scene 05 · Research',
      title: 'Insights',
      countBadge: `${insightsData.length} Articles Published`,
      rotatingSubtitles:
        insightsData.length > 0
          ? insightsData.map((art) => art.title)
          : ['Engineering Architecture & AI Briefs'],
      route: '/insights',
      side: 'right-mid',
      iconType: 'insights',
      floatDuration: 5.8,
      floatDelay: 1.1,
      speechText: `Read our latest technical research and architecture briefs, including ${insightsData[0]?.title || 'Modern Enterprise RAG Systems'}.`,
      beamTarget: { x: 440, y: 220 },
      robotTargetServiceId: 'digital-marketing',
      isHidden: insightsData.length === 0,
    },

    // RIGHT BOTTOM: Careers
    {
      id: 'brand-careers',
      sceneNumber: 6,
      sceneLabel: 'Scene 06 · Careers',
      title: 'Careers',
      countBadge: `We're Hiring · ${careersData.length} Openings`,
      rotatingSubtitles:
        careersData.length > 0
          ? careersData.map((job) => `${job.title} (${job.location})`)
          : [`We're Hiring · ${careersData.length} Openings`],
      route: '/careers',
      side: 'right-bottom',
      iconType: 'careers',
      floatDuration: 5.3,
      floatDelay: 1.8,
      speechText: `Join our engineering team! We are currently hiring across ${careersData.length} open roles including ${careersData[0]?.title || 'Full-Stack and AI Engineering'}.`,
      beamTarget: { x: 425, y: 360 },
      robotTargetServiceId: 'custom-software',
      isHidden: careersData.length === 0,
    },
  ];

  return cards.filter((c) => !c.isHidden);
}
