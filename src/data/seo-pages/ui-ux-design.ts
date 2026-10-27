import { ServicePageData } from './types';

export const uiUxDesignSeoPage: ServicePageData = {
  slug: 'ui-ux-design',
  seoTitle: 'UI/UX Design Services | Design Systems & Product Prototyping | IAMTECHNI',
  metaDescription:
    'Human-centered UI/UX design services by IAMTECHNI. User research, interactive Figma prototypes, WCAG 2.2 AA accessible interfaces, and scalable design systems.',
  h1: 'UI/UX Design',
  sections: [
    {
      h2: 'User Research, Information Architecture & Interactive Prototyping',
      paragraphs: [
        'IAMTECHNI crafts digital interfaces that feel intuitive from the first interaction. We begin by mapping real user journeys, eliminating redundant steps, and validating spatial layouts through clickable Figma prototypes before engineering begins.',
        'Every screen is designed for clarity, visual discipline, and effortless conversion across mobile, tablet, and desktop viewports.',
      ],
    },
    {
      h2: 'Tokenized Design Systems & WCAG 2.2 AA Accessibility',
      paragraphs: [
        'We build comprehensive component libraries with standardized typography scales, color tokens, and interactive states (hover, focus, loading, error) that accelerate frontend development.',
        'All interfaces are audited against WCAG 2.2 AA contrast, keyboard navigation, and touch-target standards.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Do you deliver Figma files or working frontend code?',
      answer:
        'Both. We create complete Figma UI kits and design systems, and our frontend engineering team can directly translate them into production-ready React/Tailwind code.',
    },
    {
      question: 'Can you redesign an existing legacy software interface?',
      answer:
        'Yes. We conduct usability audits on existing applications and deliver modernized UX flows that reduce user onboarding friction and support tickets.',
    },
  ],
};

export default uiUxDesignSeoPage;
