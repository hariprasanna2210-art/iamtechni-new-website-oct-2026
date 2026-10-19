import { PageRoute } from '../../types';

export type RobotAnimationState =
  | 'idle'
  | 'greeting'
  | 'explaining'
  | 'presenting'
  | 'pointing'
  | 'returnToIdle'
  | 'speaking';

export interface RobotJointTargets {
  waistYaw: number;
  waistPitch: number;
  torsoYaw: number;
  torsoPitch: number;
  torsoRoll: number;
  headYaw: number;
  headPitch: number;
  headRoll: number;

  // Viewer-Right Arm
  rightShoulderPitch: number;
  rightShoulderYaw: number;
  rightShoulderRoll: number;
  rightElbowPitch: number;      // Z-plane lift (-0.22 = tucked inward at waist, 1.82 = raised in open presenter window)
  rightElbowForward: number;    // X-plane forward hinge flexion (-0.68 = relaxed forward bend, -0.25 = raised presenter)
  rightWristRoll: number;       // Radial/ulnar wrist deviation
  rightWristPitch: number;      // Wrist flexion/extension
  rightWristSupination: number; // Forearm/palm pronation-supination
  rightFingerCurl: number;      // 0 = open palm, 0.42 = relaxed idle, 0.85 = curled
  rightPointing: number;        // 0 = normal cascade, 1 = index finger extended & others curled into palm

  // Viewer-Left Arm
  leftShoulderPitch: number;
  leftShoulderYaw: number;
  leftShoulderRoll: number;
  leftElbowPitch: number;
  leftElbowForward: number;
  leftWristRoll: number;
  leftWristPitch: number;
  leftWristSupination: number;
  leftFingerCurl: number;
  leftPointing: number;
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
  primaryGestureState: RobotAnimationState;
  activeHand: 'left' | 'right' | 'both';
  pose: Partial<RobotJointTargets>;
  followUpPose?: Partial<RobotJointTargets>;
}

/**
 * Natural relaxed human presenter idle stance:
 * Both arms rest comfortably alongside the torso with elbows softly bent forward (-0.68 rad)
 * and wrists angled slightly inward (-0.20 rad) so the hands rest naturally near the waist,
 * completely clear of the floating service cards.
 */
export const DEFAULT_IDLE_POSE: RobotJointTargets = {
  waistYaw: -0.02,
  waistPitch: 0.0,
  torsoYaw: -0.04,
  torsoPitch: 0.015,
  torsoRoll: 0.0,
  headYaw: -0.04,
  headPitch: 0.0,
  headRoll: 0.0,

  // Viewer-right arm in comfortable relaxed presenter rest alongside torso
  rightShoulderPitch: -0.22,
  rightShoulderYaw: -0.22,
  rightShoulderRoll: 0.15,
  rightElbowPitch: -0.2,
  rightElbowForward: -0.68,
  rightWristRoll: -0.05,
  rightWristPitch: 0.08,
  rightWristSupination: -0.45,
  rightFingerCurl: 0.42,
  rightPointing: 0,

  // Viewer-left arm in comfortable relaxed presenter rest (subtle human asymmetry)
  leftShoulderPitch: -0.24,
  leftShoulderYaw: 0.22,
  leftShoulderRoll: 0.16,
  leftElbowPitch: -0.22,
  leftElbowForward: -0.72,
  leftWristRoll: 0.05,
  leftWristPitch: 0.08,
  leftWristSupination: 0.45,
  leftFingerCurl: 0.4,
  leftPointing: 0,
};

/**
 * The 8 synchronized services & human-biomechanical presenter choreography
 * for the IAMTECHNI AI Ambassador Hero.
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
    primaryGestureState: 'explaining',
    activeHand: 'right',
    pose: {
      // Open-palm explanatory gesture with right hand raised comfortably in the clear upper-mid window,
      // while the left arm rests naturally at the side.
      waistYaw: -0.06,
      torsoYaw: -0.12,
      torsoPitch: 0.02,
      torsoRoll: 0.015,
      headYaw: -0.16,
      headPitch: -0.04,
      headRoll: -0.02,
      rightShoulderPitch: -0.32,
      rightShoulderRoll: 0.46,
      rightShoulderYaw: 0.14,
      rightElbowPitch: 1.82,
      rightElbowForward: -0.28,
      rightWristRoll: -0.14,
      rightWristPitch: 0.12,
      rightWristSupination: 0.38, // Palm rotated slightly upward/forward
      rightFingerCurl: 0.06,      // Open expressive palm
      rightPointing: 0,
      // Left arm remains relaxed at side with a natural forward bend
      leftShoulderPitch: -0.24,
      leftShoulderRoll: 0.16,
      leftShoulderYaw: 0.22,
      leftElbowPitch: -0.22,
      leftElbowForward: -0.72,
      leftWristRoll: 0.05,
      leftWristPitch: 0.08,
      leftWristSupination: 0.45,
      leftFingerCurl: 0.4,
      leftPointing: 0,
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
    primaryGestureState: 'presenting',
    activeHand: 'left',
    pose: {
      // One-hand open-palm presentation gesture with the left hand in the clear mid-upper left window
      // (above the Web & E-commerce card), while the right arm rests naturally at the side!
      waistYaw: -0.1,
      torsoYaw: -0.2,
      torsoPitch: 0.025,
      torsoRoll: -0.02,
      headYaw: -0.26,
      headPitch: 0.03,
      headRoll: 0.03,
      leftShoulderPitch: -0.34,
      leftShoulderRoll: 0.48,
      leftShoulderYaw: -0.16,
      leftElbowPitch: 1.84,
      leftElbowForward: -0.28,
      leftWristRoll: 0.16,
      leftWristPitch: 0.1,
      leftWristSupination: -0.38,
      leftFingerCurl: 0.05,
      leftPointing: 0,
      // Right arm relaxed at side
      rightShoulderPitch: -0.22,
      rightShoulderRoll: 0.15,
      rightShoulderYaw: -0.22,
      rightElbowPitch: -0.2,
      rightElbowForward: -0.68,
      rightWristRoll: -0.05,
      rightWristSupination: -0.45,
      rightFingerCurl: 0.42,
      rightPointing: 0,
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
    primaryGestureState: 'explaining',
    activeHand: 'both',
    pose: {
      // Two-hand asymmetric explanatory gesture in the clear upper-mid window
      waistYaw: -0.05,
      torsoYaw: -0.12,
      torsoPitch: 0.03,
      torsoRoll: 0.015,
      headYaw: -0.16,
      headPitch: 0.04,
      headRoll: -0.02,
      leftShoulderPitch: -0.34,
      leftShoulderRoll: 0.44,
      leftShoulderYaw: -0.14,
      leftElbowPitch: 1.84,
      leftElbowForward: -0.3,
      leftWristRoll: 0.14,
      leftWristPitch: 0.08,
      leftWristSupination: -0.36,
      leftFingerCurl: 0.08,
      leftPointing: 0,
      rightShoulderPitch: -0.28,
      rightShoulderRoll: 0.38,
      rightShoulderYaw: 0.12,
      rightElbowPitch: 1.72,
      rightElbowForward: -0.26,
      rightWristRoll: -0.12,
      rightWristPitch: 0.06,
      rightWristSupination: 0.32,
      rightFingerCurl: 0.12,
      rightPointing: 0,
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
    primaryGestureState: 'pointing',
    activeHand: 'right',
    pose: {
      // Gentle index-finger point toward the upper-right Cloud & DevOps card, while left arm stays relaxed at side
      waistYaw: 0.09,
      torsoYaw: 0.18,
      torsoPitch: -0.02,
      torsoRoll: 0.02,
      headYaw: 0.24,
      headPitch: -0.07,
      headRoll: 0.03,
      rightShoulderPitch: -0.36,
      rightShoulderRoll: 0.54,
      rightShoulderYaw: 0.18,
      rightElbowPitch: 1.94,
      rightElbowForward: -0.22,
      rightWristRoll: -0.22,
      rightWristPitch: -0.06,
      rightWristSupination: 0.24,
      rightFingerCurl: 0.06,
      rightPointing: 1, // Distinct index-finger point with middle/ring/pinky tucked into palm
      // Left arm relaxed at side
      leftShoulderPitch: -0.24,
      leftShoulderRoll: 0.16,
      leftShoulderYaw: 0.22,
      leftElbowPitch: -0.22,
      leftElbowForward: -0.72,
      leftWristSupination: 0.45,
      leftFingerCurl: 0.4,
      leftPointing: 0,
    },
    followUpPose: {
      // After pointing for ~1.3s, smoothly opens palm into an upward open-palm gesture
      rightElbowPitch: 1.84,
      rightWristRoll: -0.12,
      rightWristSupination: 0.42,
      rightFingerCurl: 0.05,
      rightPointing: 0,
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
    primaryGestureState: 'presenting',
    activeHand: 'right',
    pose: {
      // Welcoming, outward-facing open-palm gesture with right hand in the clear window
      waistYaw: 0.08,
      torsoYaw: 0.16,
      torsoPitch: 0.02,
      torsoRoll: -0.02,
      headYaw: 0.22,
      headPitch: 0.02,
      headRoll: -0.03,
      rightShoulderPitch: -0.34,
      rightShoulderRoll: 0.48,
      rightShoulderYaw: 0.16,
      rightElbowPitch: 1.82,
      rightElbowForward: -0.28,
      rightWristRoll: -0.18,
      rightWristPitch: 0.08,
      rightWristSupination: 0.44,
      rightFingerCurl: 0.05,
      rightPointing: 0,
      leftShoulderPitch: -0.24,
      leftShoulderRoll: 0.16,
      leftShoulderYaw: 0.22,
      leftElbowPitch: -0.22,
      leftElbowForward: -0.72,
      leftWristSupination: 0.45,
      leftFingerCurl: 0.4,
      leftPointing: 0,
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
    primaryGestureState: 'explaining',
    activeHand: 'both',
    pose: {
      // Measured explanatory gestures with both hands (asymmetric heights & wrist angles)
      waistYaw: 0.05,
      torsoYaw: 0.1,
      torsoPitch: 0.03,
      torsoRoll: 0.015,
      headYaw: 0.14,
      headPitch: 0.05,
      headRoll: 0.02,
      rightShoulderPitch: -0.34,
      rightShoulderRoll: 0.44,
      rightShoulderYaw: 0.14,
      rightElbowPitch: 1.86,
      rightElbowForward: -0.28,
      rightWristRoll: -0.14,
      rightWristPitch: 0.08,
      rightWristSupination: 0.38,
      rightFingerCurl: 0.08,
      rightPointing: 0,
      leftShoulderPitch: -0.28,
      leftShoulderRoll: 0.38,
      leftShoulderYaw: -0.12,
      leftElbowPitch: 1.72,
      leftElbowForward: -0.26,
      leftWristRoll: 0.1,
      leftWristPitch: 0.06,
      leftWristSupination: -0.32,
      leftFingerCurl: 0.14,
      leftPointing: 0,
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
    primaryGestureState: 'greeting',
    activeHand: 'right',
    pose: {
      // Welcoming gesture: raises right hand naturally to wave, while left arm stays relaxed at side
      waistYaw: -0.03,
      torsoYaw: -0.06,
      torsoPitch: -0.01,
      torsoRoll: 0.02,
      headYaw: -0.06,
      headPitch: -0.03,
      headRoll: 0.04,
      rightShoulderPitch: -0.34,
      rightShoulderRoll: 0.54,
      rightShoulderYaw: 0.14,
      rightElbowPitch: 1.94,
      rightElbowForward: -0.2,
      rightWristRoll: -0.1,
      rightWristPitch: 0.04,
      rightWristSupination: 0.1,
      rightFingerCurl: 0.05,
      rightPointing: 0,
      leftShoulderPitch: -0.24,
      leftShoulderRoll: 0.16,
      leftShoulderYaw: 0.22,
      leftElbowPitch: -0.22,
      leftElbowForward: -0.72,
      leftWristSupination: 0.45,
      leftFingerCurl: 0.4,
      leftPointing: 0,
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
    primaryGestureState: 'presenting',
    activeHand: 'left',
    pose: {
      // Calm one-hand open-palm gesture with left hand in the clear window, right arm relaxed at side
      waistYaw: -0.05,
      torsoYaw: -0.1,
      torsoPitch: 0.02,
      torsoRoll: -0.015,
      headYaw: -0.12,
      headPitch: 0.02,
      headRoll: 0.025,
      leftShoulderPitch: -0.34,
      leftShoulderRoll: 0.46,
      leftShoulderYaw: -0.16,
      leftElbowPitch: 1.84,
      leftElbowForward: -0.28,
      leftWristRoll: 0.14,
      leftWristPitch: 0.08,
      leftWristSupination: -0.38,
      leftFingerCurl: 0.06,
      leftPointing: 0,
      rightShoulderPitch: -0.22,
      rightShoulderRoll: 0.15,
      rightShoulderYaw: -0.22,
      rightElbowPitch: -0.2,
      rightElbowForward: -0.68,
      rightWristSupination: -0.45,
      rightFingerCurl: 0.42,
      rightPointing: 0,
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

export const WELCOME_SPEECH_SCRIPT =
  'Welcome to IAMTECHNI. We transform ideas into intelligent digital solutions through AI, software engineering, modern web experiences, cloud technologies, and digital growth. Explore our services and discover what is possible with IAMTECHNI.';
