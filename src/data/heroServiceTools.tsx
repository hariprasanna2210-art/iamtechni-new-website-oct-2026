import React from 'react';
import {
  SiPython,
  SiTensorflow,
  SiPytorch,
  SiLangchain,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiShopify,
  SiFlutter,
  SiSwift,
  SiKotlin,
  SiFirebase,
  SiDocker,
  SiKubernetes,
  SiGithubactions,
  SiGoogleanalytics,
  SiGoogleads,
  SiMeta,
  SiHubspot,
  SiSemrush,
  SiNodedotjs,
  SiDotnet,
  SiPostgresql,
  SiMongodb,
  SiRos,
  SiArduino,
  SiRaspberrypi,
  SiNodered,
  SiFigma,
} from 'react-icons/si';
import { FaAws, FaJava } from 'react-icons/fa';
import { TbBrandAzure, TbBrandOpenai } from 'react-icons/tb';

export interface HeroToolItem {
  name: string;
  category?: string;
  brandColor: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

// Custom SVGs for Adobe XD, Power BI, Tableau with official brand geometry
const AdobeXdIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <rect width="24" height="24" rx="4" fill="#470137" />
    <text x="5" y="17" fill="#FF61F6" fontSize="13" fontWeight="bold" fontFamily="sans-serif">Xd</text>
  </svg>
);

const PowerBiIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <rect x="2" y="11" width="4.5" height="10" rx="1" fill="#F2C811" />
    <rect x="9.5" y="6" width="4.5" height="15" rx="1" fill="#F2C811" />
    <rect x="17" y="2" width="4.5" height="19" rx="1" fill="#F2C811" />
  </svg>
);

const TableauIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M11 2h2v4h-2zm-6 5h2v4H5zm12 0h2v4h-2zm-6 4h2v6h-2zm-7 3h2v4H4zm14 0h2v4h-2zm-7 4h2v4h-2z" fill="#E97627" />
  </svg>
);

export const HERO_SERVICE_TOOLS: Record<string, HeroToolItem[]> = {
  // 1. AI & Machine Learning
  'ai-machine-learning': [
    { name: 'Python', brandColor: '#3776AB', icon: SiPython },
    { name: 'TensorFlow', brandColor: '#FF6F00', icon: SiTensorflow },
    { name: 'PyTorch', brandColor: '#EE4C2C', icon: SiPytorch },
    { name: 'OpenAI', brandColor: '#10A37F', icon: TbBrandOpenai },
    { name: 'LangChain', brandColor: '#1C3C3C', icon: SiLangchain },
  ],
  'ai-ml': [
    { name: 'Python', brandColor: '#3776AB', icon: SiPython },
    { name: 'TensorFlow', brandColor: '#FF6F00', icon: SiTensorflow },
    { name: 'PyTorch', brandColor: '#EE4C2C', icon: SiPytorch },
    { name: 'OpenAI', brandColor: '#10A37F', icon: TbBrandOpenai },
    { name: 'LangChain', brandColor: '#1C3C3C', icon: SiLangchain },
  ],

  // 2. Web & E-commerce
  'web-development': [
    { name: 'React', brandColor: '#61DAFB', icon: SiReact },
    { name: 'Next.js', brandColor: '#000000', icon: SiNextdotjs },
    { name: 'TypeScript', brandColor: '#3178C6', icon: SiTypescript },
    { name: 'Tailwind CSS', brandColor: '#06B6D4', icon: SiTailwindcss },
    { name: 'Shopify', brandColor: '#96BF48', icon: SiShopify },
  ],
  'web-dev': [
    { name: 'React', brandColor: '#61DAFB', icon: SiReact },
    { name: 'Next.js', brandColor: '#000000', icon: SiNextdotjs },
    { name: 'TypeScript', brandColor: '#3178C6', icon: SiTypescript },
    { name: 'Tailwind CSS', brandColor: '#06B6D4', icon: SiTailwindcss },
    { name: 'Shopify', brandColor: '#96BF48', icon: SiShopify },
  ],
  'ecommerce-solutions': [
    { name: 'Shopify', brandColor: '#96BF48', icon: SiShopify },
    { name: 'Next.js', brandColor: '#000000', icon: SiNextdotjs },
    { name: 'React', brandColor: '#61DAFB', icon: SiReact },
    { name: 'TypeScript', brandColor: '#3178C6', icon: SiTypescript },
    { name: 'Tailwind CSS', brandColor: '#06B6D4', icon: SiTailwindcss },
  ],

  // 3. Mobile App Development
  'mobile-app-development': [
    { name: 'Flutter', brandColor: '#02569B', icon: SiFlutter },
    { name: 'React Native', brandColor: '#61DAFB', icon: SiReact },
    { name: 'Swift', brandColor: '#F05138', icon: SiSwift },
    { name: 'Kotlin', brandColor: '#7F52FF', icon: SiKotlin },
    { name: 'Firebase', brandColor: '#FFCA28', icon: SiFirebase },
  ],
  'mobile-apps': [
    { name: 'Flutter', brandColor: '#02569B', icon: SiFlutter },
    { name: 'React Native', brandColor: '#61DAFB', icon: SiReact },
    { name: 'Swift', brandColor: '#F05138', icon: SiSwift },
    { name: 'Kotlin', brandColor: '#7F52FF', icon: SiKotlin },
    { name: 'Firebase', brandColor: '#FFCA28', icon: SiFirebase },
  ],

  // 4. Cloud & DevOps
  'cloud-devops': [
    { name: 'AWS', brandColor: '#FF9900', icon: FaAws },
    { name: 'Azure', brandColor: '#0078D4', icon: TbBrandAzure },
    { name: 'Docker', brandColor: '#2496ED', icon: SiDocker },
    { name: 'Kubernetes', brandColor: '#326CE5', icon: SiKubernetes },
    { name: 'GitHub Actions', brandColor: '#2088FF', icon: SiGithubactions },
  ],
  'cloud-computing': [
    { name: 'AWS', brandColor: '#FF9900', icon: FaAws },
    { name: 'Azure', brandColor: '#0078D4', icon: TbBrandAzure },
    { name: 'Docker', brandColor: '#2496ED', icon: SiDocker },
    { name: 'Kubernetes', brandColor: '#326CE5', icon: SiKubernetes },
    { name: 'GitHub Actions', brandColor: '#2088FF', icon: SiGithubactions },
  ],

  // 5. Digital Marketing & SEO
  'digital-marketing': [
    { name: 'Google Analytics', brandColor: '#E37400', icon: SiGoogleanalytics },
    { name: 'Google Ads', brandColor: '#4285F4', icon: SiGoogleads },
    { name: 'Meta', brandColor: '#0668E1', icon: SiMeta },
    { name: 'HubSpot', brandColor: '#FF7A59', icon: SiHubspot },
    { name: 'Semrush', brandColor: '#FF642D', icon: SiSemrush },
  ],
  'seo-services': [
    { name: 'Google Analytics', brandColor: '#E37400', icon: SiGoogleanalytics },
    { name: 'Google Ads', brandColor: '#4285F4', icon: SiGoogleads },
    { name: 'Meta', brandColor: '#0668E1', icon: SiMeta },
    { name: 'HubSpot', brandColor: '#FF7A59', icon: SiHubspot },
    { name: 'Semrush', brandColor: '#FF642D', icon: SiSemrush },
  ],

  // 6. Custom Software
  'custom-software-development': [
    { name: 'Node.js', brandColor: '#339933', icon: SiNodedotjs },
    { name: 'Java', brandColor: '#5382A1', icon: FaJava },
    { name: '.NET', brandColor: '#512BD4', icon: SiDotnet },
    { name: 'PostgreSQL', brandColor: '#4169E1', icon: SiPostgresql },
    { name: 'MongoDB', brandColor: '#47A248', icon: SiMongodb },
  ],
  'custom-software': [
    { name: 'Node.js', brandColor: '#339933', icon: SiNodedotjs },
    { name: 'Java', brandColor: '#5382A1', icon: FaJava },
    { name: '.NET', brandColor: '#512BD4', icon: SiDotnet },
    { name: 'PostgreSQL', brandColor: '#4169E1', icon: SiPostgresql },
    { name: 'MongoDB', brandColor: '#47A248', icon: SiMongodb },
  ],

  // 7. Robotics & Automation
  'robotics-automation': [
    { name: 'Python', brandColor: '#3776AB', icon: SiPython },
    { name: 'ROS', brandColor: '#22314E', icon: SiRos },
    { name: 'Arduino', brandColor: '#00979D', icon: SiArduino },
    { name: 'Raspberry Pi', brandColor: '#C51A4A', icon: SiRaspberrypi },
    { name: 'Node-RED', brandColor: '#8F0000', icon: SiNodered },
  ],

  // 8. UI/UX & Data Analytics
  'ui-ux-design': [
    { name: 'Figma', brandColor: '#F24E1E', icon: SiFigma },
    { name: 'Adobe XD', brandColor: '#FF61F6', icon: AdobeXdIcon },
    { name: 'Power BI', brandColor: '#F2C811', icon: PowerBiIcon },
    { name: 'Tableau', brandColor: '#E97627', icon: TableauIcon },
    { name: 'Python', brandColor: '#3776AB', icon: SiPython },
  ],
  'data-analytics': [
    { name: 'Power BI', brandColor: '#F2C811', icon: PowerBiIcon },
    { name: 'Tableau', brandColor: '#E97627', icon: TableauIcon },
    { name: 'Python', brandColor: '#3776AB', icon: SiPython },
    { name: 'Figma', brandColor: '#F24E1E', icon: SiFigma },
    { name: 'PostgreSQL', brandColor: '#4169E1', icon: SiPostgresql },
  ],
};

/**
 * Returns the matching tools array for any service slug or ID,
 * falling back gracefully to AI & ML tools.
 */
export const getToolsForService = (idOrSlug: string): HeroToolItem[] => {
  const key = (idOrSlug || '').toLowerCase().trim();

  if (HERO_SERVICE_TOOLS[key]) {
    return HERO_SERVICE_TOOLS[key];
  }

  // Partial match fallback
  if (key.includes('ai') || key.includes('machine-learning') || key.includes('generative')) {
    return HERO_SERVICE_TOOLS['ai-machine-learning'];
  }
  if (key.includes('robot')) {
    return HERO_SERVICE_TOOLS['robotics-automation'];
  }
  if (key.includes('mobile') || key.includes('app')) {
    return HERO_SERVICE_TOOLS['mobile-app-development'];
  }
  if (key.includes('cloud') || key.includes('devops')) {
    return HERO_SERVICE_TOOLS['cloud-devops'];
  }
  if (key.includes('seo') || key.includes('marketing')) {
    return HERO_SERVICE_TOOLS['digital-marketing'];
  }
  if (key.includes('software')) {
    return HERO_SERVICE_TOOLS['custom-software-development'];
  }
  if (key.includes('ui') || key.includes('ux') || key.includes('analytics') || key.includes('data')) {
    return HERO_SERVICE_TOOLS['ui-ux-design'];
  }
  if (key.includes('web') || key.includes('e-commerce') || key.includes('ecommerce') || key.includes('store')) {
    return HERO_SERVICE_TOOLS['web-development'];
  }

  return HERO_SERVICE_TOOLS['ai-machine-learning'];
};
