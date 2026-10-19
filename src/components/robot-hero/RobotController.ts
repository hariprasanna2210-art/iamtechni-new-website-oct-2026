import { PageRoute } from '../../types';

export type RobotAnimationState = 'idle' | 'greeting' | 'explaining' | 'speaking';

export interface RobotJointTargets {
  waistYaw: number;
  waistPitch: number;
  torsoYaw: number;
  torsoPitch: number;
  torsoRoll: number;
  headYaw: number;
  headPitch: number;
  headRoll: number;
  // Right arm (viewer's right side / robot's left or right anatomical)
  rightShoulderPitch: number;
  rightShoulderYaw: number;
  rightShoulderRoll: number;
  rightElbowPitch: number;
  rightWristRoll: number;
  rightWristPitch: number;
  rightFingerCurl: number;
  rightPointing: boolean;
  // Left arm (viewer's left side — closest to Left-Side Headline & CTAs)
  leftShoulderPitch: number;
  leftShoulderYaw: number;
  leftShoulderRoll: number;
  leftElbowPitch: number;
  leftWristRoll: number;
  leftWristPitch: number;
  leftFingerCurl: number;
  leftPointing: boolean;
}

export interface RobotServiceCardItem {
  id: string;
  sceneNumber: number;
  sceneLabel: string;
  title: string;
  shortTitle: string;
  category: string;
  route: PageRoute;
  positionSide:
    | 'left-top'
    | 'left-mid'
    | 'left-bottom'
    | 'right-top'
    | 'right-mid'
    | 'right-bottom';
  accentColor: string;
  borderColor: string;
  badgeText: string;
  explanation: string;
  speechText: string;
  pose: Partial<RobotJointTargets>;
}

/**
 * The 8 synchronized services & continuous 7-scene choreography
 * requested for the IAMTECHNI AI Ambassador Hero.
 */
export const ROBOT_SERVICE_CARDS: RobotServiceCardItem[] = [
  {
    id: 'ai-ml',
    sceneNumber: 3,
    sceneLabel: 'Scene 03 · Intelligence',
    title: 'AI & Machine Learning',
    shortTitle: 'AI & ML',
    category: 'Intelligent Systems',
    route: '/services/ai-machine-learning',
    positionSide: 'left-top',
    accentColor: '#087BFA',
    borderColor: 'border-[#087BFA]/30',
    badgeText: 'Neural & RAG',
    explanation:
      'Custom AI assistants, Retrieval-Augmented Generation (RAG), predictive models, and intelligent workflow automation tailored to your business.',
    speechText:
      'We engineer custom AI and Machine Learning systems, from private RAG assistants to predictive models that automate complex workflows.',
    pose: {
      waistYaw: -0.1,
      torsoYaw: -0.18,
      torsoPitch: -0.02,
      torsoRoll: 0.02,
      headYaw: -0.22,
      headPitch: -0.08,
      headRoll: -0.04,
      // Raises right hand and open palm to introduce AI & Machine Learning
      rightShoulderPitch: -1.08,
      rightShoulderRoll: -0.44,
      rightShoulderYaw: -0.22,
      rightElbowPitch: -0.92,
      rightWristRoll: 0.65,
      rightWristPitch: -0.12,
      rightFingerCurl: 0.04,
      rightPointing: false,
      // Left arm poised gently toward headline
      leftShoulderPitch: -0.36,
      leftShoulderRoll: 0.24,
      leftShoulderYaw: 0.12,
      leftElbowPitch: -0.62,
      leftWristRoll: -0.25,
      leftFingerCurl: 0.26,
      leftPointing: false,
    },
  },
  {
    id: 'web-dev',
    sceneNumber: 2,
    sceneLabel: 'Scene 02 · Web Experiences',
    title: 'Web & E-commerce',
    shortTitle: 'Web & E-commerce',
    category: 'Modern Web Platforms',
    route: '/services/website-development',
    positionSide: 'left-mid',
    accentColor: '#174DEB',
    borderColor: 'border-[#174DEB]/30',
    badgeText: 'Next.js & React',
    explanation:
      'High-speed corporate websites, web applications, and conversion-focused e-commerce platforms engineered for performance and clarity.',
    speechText:
      'We design and build modern Web and E-commerce platforms with fast load times, responsive interfaces, and seamless checkout experiences.',
    pose: {
      // Scene 2: Gestures directly toward the left-side headline and CTA buttons
      waistYaw: -0.14,
      torsoYaw: -0.26,
      torsoPitch: 0.03,
      torsoRoll: -0.03,
      headYaw: -0.34,
      headPitch: 0.04,
      headRoll: 0.04,
      leftShoulderPitch: -0.88,
      leftShoulderRoll: 0.56,
      leftShoulderYaw: 0.28,
      leftElbowPitch: -0.78,
      leftWristRoll: -0.72,
      leftWristPitch: 0.1,
      leftFingerCurl: 0.02,
      leftPointing: false,
      rightShoulderPitch: -0.24,
      rightShoulderRoll: -0.18,
      rightElbowPitch: -0.52,
      rightFingerCurl: 0.32,
      rightPointing: false,
    },
  },
  {
    id: 'mobile-apps',
    sceneNumber: 4,
    sceneLabel: 'Scene 04 · Mobile Ecosystems',
    title: 'Mobile App Development',
    shortTitle: 'Mobile Apps',
    category: 'iOS & Android',
    route: '/services/mobile-app-development',
    positionSide: 'left-bottom',
    accentColor: '#00C7F2',
    borderColor: 'border-[#00C7F2]/40',
    badgeText: 'Native & Flutter',
    explanation:
      'Sleek iOS and Android mobile applications with native 60fps responsiveness, secure authentication, and offline-ready synchronization.',
    speechText:
      'Our Mobile App Development team delivers native-grade iOS and Android applications built for speed, reliability, and intuitive user engagement.',
    pose: {
      // Scene 4: Coordinated dual-hand framing pose introducing mobile & web ecosystems
      waistYaw: -0.08,
      torsoYaw: -0.16,
      torsoPitch: 0.04,
      torsoRoll: 0.02,
      headYaw: -0.2,
      headPitch: 0.08,
      headRoll: -0.03,
      leftShoulderPitch: -0.72,
      leftShoulderRoll: 0.36,
      leftShoulderYaw: 0.22,
      leftElbowPitch: -0.96,
      leftWristRoll: -0.58,
      leftFingerCurl: 0.06,
      leftPointing: false,
      rightShoulderPitch: -0.68,
      rightShoulderRoll: -0.32,
      rightShoulderYaw: -0.18,
      rightElbowPitch: -0.92,
      rightWristRoll: 0.54,
      rightFingerCurl: 0.08,
      rightPointing: false,
    },
  },
  {
    id: 'cloud-devops',
    sceneNumber: 5,
    sceneLabel: 'Scene 05 · Cloud & Scale',
    title: 'Cloud & DevOps',
    shortTitle: 'Cloud & DevOps',
    category: 'Cloud Infrastructure',
    route: '/services/cloud-computing',
    positionSide: 'right-top',
    accentColor: '#087BFA',
    borderColor: 'border-[#087BFA]/30',
    badgeText: 'AWS & Azure',
    explanation:
      'Resilient AWS and Azure cloud architectures, Kubernetes container orchestration, automated CI/CD pipelines, and Zero-Trust security.',
    speechText:
      'With Cloud and DevOps, we modernize infrastructure on AWS and Azure using automated CI/CD pipelines and scalable container architectures.',
    pose: {
      // Scene 5: Gestures upward and outward toward Cloud, DevOps & Enterprise scale
      waistYaw: 0.12,
      torsoYaw: 0.22,
      torsoPitch: -0.02,
      torsoRoll: 0.03,
      headYaw: 0.28,
      headPitch: -0.1,
      headRoll: 0.04,
      rightShoulderPitch: -1.12,
      rightShoulderRoll: -0.52,
      rightShoulderYaw: -0.24,
      rightElbowPitch: -0.76,
      rightWristRoll: 0.62,
      rightWristPitch: -0.08,
      rightFingerCurl: 0.0,
      rightPointing: true,
      leftShoulderPitch: -0.26,
      leftShoulderRoll: 0.2,
      leftElbowPitch: -0.54,
      leftFingerCurl: 0.3,
      leftPointing: false,
    },
  },
  {
    id: 'digital-marketing',
    sceneNumber: 6,
    sceneLabel: 'Scene 06 · Digital Growth',
    title: 'Digital Marketing & SEO',
    shortTitle: 'Marketing & SEO',
    category: 'Growth Engineering',
    route: '/services/digital-marketing',
    positionSide: 'right-mid',
    accentColor: '#7200F5',
    borderColor: 'border-[#7200F5]/30',
    badgeText: 'SEO & Funnels',
    explanation:
      'Technical SEO, search-intent architecture, performance campaigns, and conversion optimization that drive measurable business growth.',
    speechText:
      'Through Digital Marketing and Technical SEO, we amplify your search visibility and convert high-intent visitors into lasting customers.',
    pose: {
      // Scene 6: Expressive open presentation gesture introducing digital growth & analytics
      waistYaw: 0.1,
      torsoYaw: 0.18,
      torsoPitch: 0.02,
      torsoRoll: -0.02,
      headYaw: 0.24,
      headPitch: 0.02,
      headRoll: -0.04,
      rightShoulderPitch: -0.82,
      rightShoulderRoll: -0.48,
      rightShoulderYaw: -0.18,
      rightElbowPitch: -0.88,
      rightWristRoll: 0.7,
      rightFingerCurl: 0.02,
      rightPointing: false,
      leftShoulderPitch: -0.54,
      leftShoulderRoll: 0.34,
      leftElbowPitch: -0.76,
      leftWristRoll: -0.45,
      leftFingerCurl: 0.12,
      leftPointing: false,
    },
  },
  {
    id: 'software-solutions',
    sceneNumber: 5,
    sceneLabel: 'Scene 05 · Enterprise Systems',
    title: 'Custom Software',
    shortTitle: 'Custom Software',
    category: 'Enterprise Engineering',
    route: '/services/custom-software-development',
    positionSide: 'right-bottom',
    accentColor: '#174DEB',
    borderColor: 'border-[#174DEB]/30',
    badgeText: 'SaaS & ERP',
    explanation:
      'Scalable custom enterprise software, multi-tenant SaaS platforms, API integrations, and operational systems engineered around your workflows.',
    speechText:
      'We build Custom Software and enterprise platforms that replace manual bottlenecks with secure, scalable digital operations.',
    pose: {
      waistYaw: 0.08,
      torsoYaw: 0.16,
      torsoPitch: 0.05,
      torsoRoll: 0.02,
      headYaw: 0.22,
      headPitch: 0.08,
      headRoll: 0.03,
      rightShoulderPitch: -0.64,
      rightShoulderRoll: -0.42,
      rightShoulderYaw: -0.15,
      rightElbowPitch: -0.78,
      rightWristRoll: 0.56,
      rightFingerCurl: 0.04,
      rightPointing: false,
      leftShoulderPitch: -0.32,
      leftShoulderRoll: 0.22,
      leftElbowPitch: -0.58,
      leftFingerCurl: 0.28,
      leftPointing: false,
    },
  },
  {
    id: 'robotics-automation',
    sceneNumber: 1,
    sceneLabel: 'Scene 01 · Autonomous Systems',
    title: 'Robotics & Automation',
    shortTitle: 'Robotics & AI',
    category: 'Intelligent Automation',
    route: '/services/robotics-emerging-tech',
    positionSide: 'left-top',
    accentColor: '#00C7F2',
    borderColor: 'border-[#00C7F2]/35',
    badgeText: 'Autonomous Tech',
    explanation:
      'Intelligent robotics control interfaces, edge telemetry, IoT integration, and end-to-end business process automation.',
    speechText:
      'Our Robotics and Automation practice connects intelligent software with physical systems, edge telemetry, and autonomous workflows.',
    pose: {
      // Scene 1 / 7: Welcoming forward-facing ambassador pose with raised right hand
      waistYaw: -0.04,
      torsoYaw: -0.08,
      torsoPitch: -0.02,
      torsoRoll: 0.02,
      headYaw: -0.08,
      headPitch: -0.04,
      headRoll: 0.05,
      rightShoulderPitch: -1.16,
      rightShoulderRoll: -0.46,
      rightShoulderYaw: -0.12,
      rightElbowPitch: -1.04,
      rightWristRoll: 0.42,
      rightFingerCurl: 0.02,
      rightPointing: false,
      leftShoulderPitch: -0.48,
      leftShoulderRoll: 0.28,
      leftElbowPitch: -0.72,
      leftFingerCurl: 0.18,
      leftPointing: false,
    },
  },
  {
    id: 'uiux-analytics',
    sceneNumber: 7,
    sceneLabel: 'Scene 07 · Design & Data',
    title: 'UI/UX & Data Analytics',
    shortTitle: 'UI/UX & Analytics',
    category: 'Design & Intelligence',
    route: '/services/data-analytics',
    positionSide: 'right-mid',
    accentColor: '#087BFA',
    borderColor: 'border-[#087BFA]/30',
    badgeText: 'Design & BI',
    explanation:
      'Human-centered UI/UX design systems paired with real-time business intelligence dashboards and actionable executive telemetry.',
    speechText:
      'We combine human-centered UI and UX design systems with real-time Data Analytics dashboards so every decision is clear and measurable.',
    pose: {
      // Scene 7: Friendly poised ambassador stance with open welcoming gesture toward viewer & left content
      waistYaw: -0.06,
      torsoYaw: -0.12,
      torsoPitch: 0.02,
      torsoRoll: -0.02,
      headYaw: -0.14,
      headPitch: 0.02,
      headRoll: 0.03,
      leftShoulderPitch: -0.76,
      leftShoulderRoll: 0.44,
      leftShoulderYaw: 0.2,
      leftElbowPitch: -0.84,
      leftWristRoll: -0.62,
      leftFingerCurl: 0.04,
      leftPointing: false,
      rightShoulderPitch: -0.44,
      rightShoulderRoll: -0.26,
      rightElbowPitch: -0.68,
      rightWristRoll: 0.35,
      rightFingerCurl: 0.2,
      rightPointing: false,
    },
  },
];

export const HERO_SERVICE_LABELS: {
  label: string;
  mappedCardId: string;
  route: PageRoute;
}[] = ROBOT_SERVICE_CARDS.map((card) => ({
  label: card.title,
  mappedCardId: card.id,
  route: card.route,
}));

export const DEFAULT_IDLE_POSE: RobotJointTargets = {
  waistYaw: -0.04,
  waistPitch: 0.0,
  torsoYaw: -0.08,
  torsoPitch: 0.02,
  torsoRoll: 0.0,
  headYaw: -0.06,
  headPitch: 0.0,
  headRoll: 0.0,
  rightShoulderPitch: -0.26,
  rightShoulderYaw: -0.06,
  rightShoulderRoll: -0.18,
  rightElbowPitch: -0.56,
  rightWristRoll: 0.18,
  rightWristPitch: 0.0,
  rightFingerCurl: 0.28,
  rightPointing: false,
  leftShoulderPitch: -0.24,
  leftShoulderYaw: 0.06,
  leftShoulderRoll: 0.18,
  leftElbowPitch: -0.52,
  leftWristRoll: -0.18,
  leftWristPitch: 0.0,
  leftFingerCurl: 0.28,
  leftPointing: false,
};

export const WELCOME_SPEECH_SCRIPT =
  "Welcome to IAMTECHNI. We transform ideas into intelligent digital solutions through AI, software engineering, modern web experiences, cloud technologies, and digital growth. Explore our services and discover what is possible with IAMTECHNI.";
