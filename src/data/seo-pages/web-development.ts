import { ServicePageData } from './types';

export const webDevelopmentSeoPage: ServicePageData = {
  slug: 'web-development',
  seoTitle: 'Web Development Services | Custom Next.js & React Websites | IAMTECHNI',
  metaDescription:
    'Enterprise web development services by IAMTECHNI. We architect fast, responsive, SEO-ready corporate websites and React/Next.js web applications built to convert.',
  h1: 'Web Development Services',
  sections: [
    {
      h2: 'Modern Web Architecture Engineered for Performance & Conversion',
      paragraphs: [
        'IAMTECHNI designs and builds custom corporate websites, customer portals, and progressive web applications using React, Next.js, and TypeScript. Every architecture is engineered from the ground up for sub-second load times, clean semantic HTML, and strict Core Web Vitals compliance.',
        'Unlike bloated off-the-shelf templates, our modular component systems scale effortlessly alongside your business, integrating cleanly with headless CMS platforms, CRM pipelines, and enterprise authentication.',
      ],
    },
    {
      h2: 'Full-Lifecycle Frontend & Backend Web Engineering',
      paragraphs: [
        'From initial information architecture and interactive wireframing to API integration and automated deployment, our engineering team delivers resilient web platforms tailored to your exact operational and branding requirements.',
        'Each release undergoes comprehensive cross-device QA, WCAG 2.2 AA accessibility verification, and technical SEO validation before launch.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Do you build custom themes or use off-the-shelf templates?',
      answer:
        'We engineer bespoke component architectures tailored to your exact brand and technical requirements. We do not use bloated multi-purpose themes that compromise performance and security.',
    },
    {
      question: 'How do you ensure search engine visibility (SEO)?',
      answer:
        'SEO is foundational to our engineering process: semantic HTML5 structures, server-side rendering where beneficial, structured JSON-LD data, automated XML sitemaps, and optimized Core Web Vitals.',
    },
    {
      question: 'Can our internal marketing team update copy and media independently?',
      answer:
        'Yes. We pair modern frontend frameworks with headless or structured CMS workflows, providing intuitive visual editing fields without risk of breaking layout geometry.',
    },
  ],
};

export default webDevelopmentSeoPage;
