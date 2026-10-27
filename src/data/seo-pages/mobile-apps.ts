import { ServicePageData } from './types';

export const mobileAppsSeoPage: ServicePageData = {
  slug: 'mobile-apps',
  seoTitle: 'Mobile App Development Services | iOS, Android & PWA Engineering | IAMTECHNI',
  metaDescription:
    'Custom iOS, Android, and cross-platform mobile app development by IAMTECHNI. High-performance React Native apps and offline-capable Progressive Web Apps.',
  h1: 'Mobile App Development',
  sections: [
    {
      h2: 'Cross-Platform iOS & Android Applications with Native Ergonomics',
      paragraphs: [
        'IAMTECHNI designs and engineers responsive mobile applications using React Native and modern cross-platform stacks, delivering 60fps animations, native gesture handling, and shared TypeScript business logic across iOS and Android.',
        'From customer loyalty and ordering apps to field inspection tools, we focus on intuitive thumb-zone ergonomics, fast startup times, and reliable biometric authentication.',
      ],
    },
    {
      h2: 'Offline-First Architecture & Progressive Web Apps (PWAs)',
      paragraphs: [
        'Field operations and mobile users need software that works even when connectivity drops. We implement local persistence, optimistic UI updates, and automatic background synchronization.',
        'Where instant web distribution is preferred over app store friction, we also build installable Progressive Web Apps (PWAs) with service worker caching and push notifications.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Should we build a Native app or a Progressive Web App (PWA)?',
      answer:
        'If your application requires deep background sensor access or store presence, React Native is ideal. If you want instant zero-install access via web link with offline caching, PWAs provide lower development cost and faster rollout.',
    },
    {
      question: 'Do you handle Apple App Store and Google Play Store submissions?',
      answer:
        'Yes. We manage the complete build signing, provisioning profile setup, privacy policy compliance, and store listing deployment process for both iOS and Android.',
    },
  ],
};

export default mobileAppsSeoPage;
