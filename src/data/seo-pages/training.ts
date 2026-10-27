import { ServicePageData } from './types';

export const trainingSeoPage: ServicePageData = {
  slug: 'training',
  seoTitle: 'Technical Training & Skill Development | Full Stack, AI & Cloud | IAMTECHNI',
  metaDescription:
    'Hands-on technical training and corporate developer upskilling by IAMTECHNI. Project-driven programs in Full Stack React/TypeScript, Python, AI/RAG, and Cloud DevOps.',
  h1: 'Technical Training & Skill Development',
  sections: [
    {
      h2: 'Production-Focused Engineering Curricula & Live Coding Labs',
      paragraphs: [
        'IAMTECHNI bridges the gap between classroom theory and production software engineering. Our training programs immerse participants in real-world TypeScript, React, Node.js, Python, AI RAG pipelines, and AWS/Azure cloud workflows.',
        'Every module is built around practical lab assignments, Git pull-request reviews, and debugging exercises led by practicing architects.',
      ],
    },
    {
      h2: 'Corporate Team Upskilling & Capstone Mentorship',
      paragraphs: [
        'We customize workshops for corporate engineering teams transitioning from legacy stacks to modern full-stack and AI-assisted architectures, ensuring zero regressions and rapid adoption of engineering best practices.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Are classes lecture-based or hands-on?',
      answer:
        'Our training is 80% hands-on. Participants write real code, debug edge cases, configure tools, and build working applications under guidance.',
    },
    {
      question: 'Can you customize training for our internal company tech stack?',
      answer:
        'Yes. We frequently build customized corporate upskilling programs aligned directly with your team’s frameworks, architecture patterns, and tools.',
    },
  ],
};

export default trainingSeoPage;
