import { IconType } from 'react-icons';
import {
  SiPython,
  SiLangchain,
  SiTensorflow,
  SiPytorch,
  SiScikitlearn,
  SiApacheairflow,
  SiRos,
  SiCplusplus,
  SiNvidia,
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiShopify,
  SiFlutter,
  SiSwift,
  SiKotlin,
  SiNodedotjs,
  SiPostgresql,
  SiGraphql,
  SiDocker,
  SiKubernetes,
  SiTerraform,
  SiGoogleanalytics,
  SiGooglesearchconsole,
  SiHubspot,
  SiStripe,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { TbBrandAzure, TbBrandOpenai } from 'react-icons/tb';
import { PageRoute } from '../../types';
import { RobotAnimationState } from './RobotController';

export interface HeroTechIconItem {
  name: string;
  icon: IconType;
  color: string;
}

export interface HeroSupportingCardSpec {
  label: string;
  value: string;
  subtext: string;
  accent: 'cyan' | 'blue' | 'purple';
}

export interface HeroServiceSlide {
  index: number;
  counterLabel: string;
  id: string;
  slug: string;
  robotServiceId: string;
  route: PageRoute;
  shortTitle: string;
  categoryLabel: string;
  headline: string;
  highlightPhrase: string;
  description: string;
  spokenLine: string;
  gestureDirection: 'left' | 'right';
  gestureState: RobotAnimationState;
  accentHex: string;
  secondaryHex: string;
  techStack: HeroTechIconItem[];
  visualHeader: {
    badge: string;
    title: string;
    statusText: string;
  };
  supportingCards: [HeroSupportingCardSpec, HeroSupportingCardSpec];
}

export const HERO_SERVICE_SLIDES: HeroServiceSlide[] = [
  {
    index: 1,
    counterLabel: '01 / 08',
    id: 'ai-generative',
    slug: 'ai-machine-learning',
    robotServiceId: 'ai-ml',
    route: '/services/ai-machine-learning',
    shortTitle: 'Generative AI',
    categoryLabel: 'Artificial Intelligence & Generative AI',
    headline: 'Next-Gen Artificial Intelligence & Generative AI Solutions',
    highlightPhrase: 'Generative AI Solutions',
    description:
      'Deploy custom large language models, private RAG knowledge assistants, and multi-agent AI copilots engineered around your enterprise data and security standards.',
    spokenLine:
      'At IAMTECHNI, we engineer Artificial Intelligence and Generative AI solutions, from private knowledge assistants to autonomous multi-agent copilots.',
    gestureDirection: 'right',
    gestureState: 'presenting',
    accentHex: '#00D2FF',
    secondaryHex: '#7C3AED',
    techStack: [
      { name: 'OpenAI', icon: TbBrandOpenai, color: '#00D2FF' },
      { name: 'LangChain', icon: SiLangchain, color: '#38BDF8' },
      { name: 'Python', icon: SiPython, color: '#60A5FA' },
      { name: 'PyTorch', icon: SiPytorch, color: '#A78BFA' },
    ],
    visualHeader: {
      badge: 'NEURAL_CORE // RAG v4.2',
      title: 'Enterprise Neural Knowledge & Multi-Agent Synthesis',
      statusText: '99.4% Grounded Accuracy',
    },
    supportingCards: [
      {
        label: 'Semantic Retrieval Latency',
        value: '38 ms',
        subtext: 'Hybrid vector + graph context indexing',
        accent: 'cyan',
      },
      {
        label: 'Enterprise AI Automation',
        value: '4.8x Faster',
        subtext: 'Private LLM reasoning & workflow execution',
        accent: 'purple',
      },
    ],
  },
  {
    index: 2,
    counterLabel: '02 / 08',
    id: 'ml-automation',
    slug: 'data-analytics',
    robotServiceId: 'uiux-analytics',
    route: '/services/data-analytics',
    shortTitle: 'ML & Automation',
    categoryLabel: 'Machine Learning & Automation',
    headline: 'Predictive Machine Learning & Intelligent Automation',
    highlightPhrase: 'Intelligent Automation',
    description:
      'Transform raw operational streams into real-time forecasting models, automated decision pipelines, and self-optimizing business workflows that eliminate manual bottlenecks.',
    spokenLine:
      'Our Machine Learning and Automation systems turn operational data into accurate predictive models and self-optimizing workflows.',
    gestureDirection: 'left',
    gestureState: 'pointing',
    accentHex: '#38BDF8',
    secondaryHex: '#2563EB',
    techStack: [
      { name: 'TensorFlow', icon: SiTensorflow, color: '#38BDF8' },
      { name: 'Scikit-Learn', icon: SiScikitlearn, color: '#60A5FA' },
      { name: 'Airflow', icon: SiApacheairflow, color: '#00D2FF' },
      { name: 'Python', icon: SiPython, color: '#818CF8' },
    ],
    visualHeader: {
      badge: 'ML_PIPELINE // AUTO-OPS',
      title: 'Predictive Demand Forecasting & Autonomous Workflows',
      statusText: 'Live Model Inference',
    },
    supportingCards: [
      {
        label: 'Forecasting Precision',
        value: '96.8%',
        subtext: 'Multi-variate time-series & anomaly detection',
        accent: 'cyan',
      },
      {
        label: 'Process Cycle Reduction',
        value: '-72% Time',
        subtext: 'End-to-end zero-touch pipeline orchestration',
        accent: 'blue',
      },
    ],
  },
  {
    index: 3,
    counterLabel: '03 / 08',
    id: 'robotics-systems',
    slug: 'robotics',
    robotServiceId: 'robotics-automation',
    route: '/services/robotics',
    shortTitle: 'Robotics & Edge',
    categoryLabel: 'Robotics & Intelligent Systems',
    headline: 'Autonomous Robotics & Intelligent Physical Systems',
    highlightPhrase: 'Intelligent Physical Systems',
    description:
      'Bridge physical hardware and cognitive software with computer vision, ROS 2 motion control, edge AI telemetry, and industrial IoT command interfaces.',
    spokenLine:
      'With Robotics and Intelligent Systems, IAMTECHNI connects edge AI vision, autonomous motion control, and real-time hardware telemetry.',
    gestureDirection: 'right',
    gestureState: 'explaining',
    accentHex: '#00E5FF',
    secondaryHex: '#6366F1',
    techStack: [
      { name: 'ROS 2', icon: SiRos, color: '#00E5FF' },
      { name: 'Embedded C++', icon: SiCplusplus, color: '#60A5FA' },
      { name: 'NVIDIA Edge', icon: SiNvidia, color: '#34D399' },
      { name: 'Python', icon: SiPython, color: '#A78BFA' },
    ],
    visualHeader: {
      badge: 'ROBOTICS_OS // KINEMATICS',
      title: '6-Axis Autonomous Actuator & Spatial Vision Telemetry',
      statusText: 'Sub-Millimeter Precision',
    },
    supportingCards: [
      {
        label: 'Edge Vision Loop',
        value: '120 FPS',
        subtext: 'Real-time LiDAR + stereo depth perception',
        accent: 'cyan',
      },
      {
        label: 'Fleet Uptime Telemetry',
        value: '99.95%',
        subtext: 'Predictive actuator diagnostics & digital twin',
        accent: 'purple',
      },
    ],
  },
  {
    index: 4,
    counterLabel: '04 / 08',
    id: 'web-ecommerce',
    slug: 'web-development',
    robotServiceId: 'web-dev',
    route: '/services/web-development',
    shortTitle: 'Web & Commerce',
    categoryLabel: 'Website & E-commerce Development',
    headline: 'High-Velocity Websites & Scalable E-Commerce Platforms',
    highlightPhrase: 'Scalable E-Commerce',
    description:
      'We architect ultra-fast corporate web platforms, headless e-commerce storefronts, and interactive digital experiences engineered for instant load times and conversion.',
    spokenLine:
      'We design and build high-speed Websites and E-commerce platforms engineered for responsive clarity, seamless checkout, and measurable conversion.',
    gestureDirection: 'left',
    gestureState: 'presenting',
    accentHex: '#2563EB',
    secondaryHex: '#00D2FF',
    techStack: [
      { name: 'Next.js', icon: SiNextdotjs, color: '#F8FAFC' },
      { name: 'React', icon: SiReact, color: '#00D2FF' },
      { name: 'TypeScript', icon: SiTypescript, color: '#60A5FA' },
      { name: 'Shopify / Stripe', icon: SiShopify, color: '#34D399' },
    ],
    visualHeader: {
      badge: 'WEB_ENGINE // CORE VITALS',
      title: 'Headless Commerce Storefront & Edge Web Architecture',
      statusText: '99/100 Performance Score',
    },
    supportingCards: [
      {
        label: 'First Contentful Paint',
        value: '0.4s Load',
        subtext: 'SSR edge rendering & global CDN caching',
        accent: 'cyan',
      },
      {
        label: 'Checkout Conversion Lift',
        value: '+42% CRO',
        subtext: 'Frictionless omnichannel payment flows',
        accent: 'blue',
      },
    ],
  },
  {
    index: 5,
    counterLabel: '05 / 08',
    id: 'mobile-apps',
    slug: 'mobile-apps',
    robotServiceId: 'mobile-apps',
    route: '/services/mobile-apps',
    shortTitle: 'Mobile Apps',
    categoryLabel: 'Mobile App Development',
    headline: 'Native-Grade iOS, Android & Cross-Platform Mobile Apps',
    highlightPhrase: 'Cross-Platform Mobile Apps',
    description:
      'Deliver sleek, 60fps mobile ecosystems with biometric security, offline-first synchronization, real-time push telemetry, and intuitive human-centered interfaces.',
    spokenLine:
      'Our Mobile App Development practice builds sleek iOS and Android applications with native performance, biometric security, and offline reliability.',
    gestureDirection: 'right',
    gestureState: 'pointing',
    accentHex: '#00D2FF',
    secondaryHex: '#8B5CF6',
    techStack: [
      { name: 'Flutter', icon: SiFlutter, color: '#38BDF8' },
      { name: 'React Native', icon: SiReact, color: '#00D2FF' },
      { name: 'Swift iOS', icon: SiSwift, color: '#FB923C' },
      { name: 'Kotlin', icon: SiKotlin, color: '#A78BFA' },
    ],
    visualHeader: {
      badge: 'MOBILE_SDK // iOS & ANDROID',
      title: 'Cross-Device Native UI & Real-Time Sync Architecture',
      statusText: '60 FPS Fluid Motion',
    },
    supportingCards: [
      {
        label: 'Crash-Free Sessions',
        value: '99.94%',
        subtext: 'Automated device-farm QA & telemetry',
        accent: 'cyan',
      },
      {
        label: 'Shared Codebase Velocity',
        value: '2.4x Ship',
        subtext: 'Unified iOS & Android release pipelines',
        accent: 'purple',
      },
    ],
  },
  {
    index: 6,
    counterLabel: '06 / 08',
    id: 'custom-software',
    slug: 'custom-software',
    robotServiceId: 'software-solutions',
    route: '/services/custom-software',
    shortTitle: 'Custom Software',
    categoryLabel: 'Custom Software Solutions',
    headline: 'Tailored Enterprise Software & Scalable SaaS Platforms',
    highlightPhrase: 'Enterprise Software',
    description:
      'Replace fragmented legacy tools with custom-engineered enterprise platforms, multi-tenant SaaS products, secure API ecosystems, and mission-critical workflows.',
    spokenLine:
      'We architect Custom Software and enterprise SaaS platforms that unify complex operations into secure, high-throughput digital ecosystems.',
    gestureDirection: 'left',
    gestureState: 'explaining',
    accentHex: '#3B82F6',
    secondaryHex: '#00D2FF',
    techStack: [
      { name: 'Node.js', icon: SiNodedotjs, color: '#4ADE80' },
      { name: 'PostgreSQL', icon: SiPostgresql, color: '#60A5FA' },
      { name: 'GraphQL', icon: SiGraphql, color: '#F472B6' },
      { name: 'Stripe API', icon: SiStripe, color: '#818CF8' },
    ],
    visualHeader: {
      badge: 'ENTERPRISE_CORE // SAAS',
      title: 'Multi-Tenant Command Center & API Microservices Mesh',
      statusText: 'SOC2-Ready Architecture',
    },
    supportingCards: [
      {
        label: 'API Throughput Capacity',
        value: '50k req/s',
        subtext: 'Event-driven microservices & distributed cache',
        accent: 'blue',
      },
      {
        label: 'Operational Efficiency',
        value: '+64% ROI',
        subtext: 'Custom ERP, CRM & automated billing engines',
        accent: 'cyan',
      },
    ],
  },
  {
    index: 7,
    counterLabel: '07 / 08',
    id: 'cloud-devops',
    slug: 'cloud-devops',
    robotServiceId: 'cloud-devops',
    route: '/services/cloud-devops',
    shortTitle: 'Cloud & DevOps',
    categoryLabel: 'Cloud Computing & DevOps',
    headline: 'Resilient Cloud Infrastructure & Automated DevOps',
    highlightPhrase: 'Cloud Infrastructure',
    description:
      'Scale effortlessly on AWS and Azure with Kubernetes container orchestration, Infrastructure-as-Code, zero-downtime CI/CD pipelines, and Zero-Trust security.',
    spokenLine:
      'Through Cloud Computing and DevOps, IAMTECHNI builds auto-scaling AWS and Azure infrastructure with zero-downtime deployment pipelines.',
    gestureDirection: 'right',
    gestureState: 'pointing',
    accentHex: '#00D2FF',
    secondaryHex: '#2563EB',
    techStack: [
      { name: 'AWS Cloud', icon: FaAws, color: '#FBBF24' },
      { name: 'Microsoft Azure', icon: TbBrandAzure, color: '#38BDF8' },
      { name: 'Kubernetes', icon: SiKubernetes, color: '#60A5FA' },
      { name: 'Terraform / Docker', icon: SiTerraform, color: '#A78BFA' },
    ],
    visualHeader: {
      badge: 'CLOUD_MESH // KUBERNETES',
      title: 'Multi-Region Auto-Scaling Cluster & CI/CD Pipeline',
      statusText: '99.99% SLA Availability',
    },
    supportingCards: [
      {
        label: 'Deployment Frequency',
        value: 'Zero-Downtime',
        subtext: 'Automated GitOps blue/green release gates',
        accent: 'cyan',
      },
      {
        label: 'Cloud Cost Optimization',
        value: '-38% Spend',
        subtext: 'FinOps right-sizing & elastic spot compute',
        accent: 'blue',
      },
    ],
  },
  {
    index: 8,
    counterLabel: '08 / 08',
    id: 'digital-marketing',
    slug: 'digital-marketing',
    robotServiceId: 'digital-marketing',
    route: '/services/digital-marketing',
    shortTitle: 'Digital Growth',
    categoryLabel: 'Digital Marketing & Business Growth',
    headline: 'Data-Driven Digital Marketing, SEO & Revenue Growth',
    highlightPhrase: 'Revenue Growth',
    description:
      'Accelerate qualified inbound pipeline through technical SEO architecture, high-intent search dominance, conversion rate optimization, and full-funnel analytics.',
    spokenLine:
      'Our Digital Marketing and Growth engineering team combines technical SEO, conversion optimization, and data analytics to scale your revenue.',
    gestureDirection: 'left',
    gestureState: 'presenting',
    accentHex: '#8B5CF6',
    secondaryHex: '#00D2FF',
    techStack: [
      { name: 'Search Console', icon: SiGooglesearchconsole, color: '#38BDF8' },
      { name: 'GA4 Analytics', icon: SiGoogleanalytics, color: '#FBBF24' },
      { name: 'HubSpot CRM', icon: SiHubspot, color: '#FB923C' },
      { name: 'Docker / Edge SEO', icon: SiDocker, color: '#00D2FF' },
    ],
    visualHeader: {
      badge: 'GROWTH_ENGINE // SEO & CRO',
      title: 'Organic Search Dominance & Revenue Attribution Funnel',
      statusText: '+210% Qualified Pipeline',
    },
    supportingCards: [
      {
        label: 'Organic Traffic Velocity',
        value: '+185% YoY',
        subtext: 'Technical schema, core vitals & authority',
        accent: 'purple',
      },
      {
        label: 'Lead-to-Deal Attribution',
        value: '3.6x ROAS',
        subtext: 'Multi-touch funnel tracking & CRO testing',
        accent: 'cyan',
      },
    ],
  },
];
