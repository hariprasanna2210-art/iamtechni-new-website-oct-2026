import { ServicePageData } from './types';

export const customSoftwareSeoPage: ServicePageData = {
  slug: 'custom-software',
  seoTitle: 'Custom Software Development Services | Enterprise Portals & APIs | IAMTECHNI',
  metaDescription:
    'Tailored custom software development by IAMTECHNI. We engineer enterprise web portals, workflow automation engines, and scalable APIs with 100% IP ownership.',
  h1: 'Custom Software Development',
  sections: [
    {
      h2: 'Bespoke Software Systems Built Around Your Operational Logic',
      paragraphs: [
        'When off-the-shelf SaaS tools force compromises in your workflow, IAMTECHNI engineers custom web applications, internal operations portals, and multi-tenant platforms designed around your exact business rules.',
        'Our systems replace fragmented spreadsheets and manual data re-entry with role-based access control (RBAC), immutable audit logs, and automated approval pipelines.',
      ],
    },
    {
      h2: 'Scalable APIs, Microservices & Legacy Modernization',
      paragraphs: [
        'Written in strongly-typed TypeScript, Node.js, and Python backed by PostgreSQL and Redis, our software architectures prioritize long-term maintainability, security hardening, and clean documentation.',
        'We also modernize brittle legacy desktop or monolith applications into containerized cloud-ready systems using phased, zero-disruption migration patterns.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Who owns the intellectual property and code?',
      answer:
        'You own 100% of the custom source code, database architectures, and assets developed for your organization upon milestone completion.',
    },
    {
      question: 'How do you ensure maintainability as our team grows?',
      answer:
        'We write strongly-typed TypeScript/Python, enforce strict linting and architectural boundaries, write automated test suites, and deliver clear system documentation.',
    },
    {
      question: 'Can you integrate custom software with our existing CRM or ERP?',
      answer:
        'Yes. We design secure REST and GraphQL middleware layers that unify your existing databases, third-party SaaS platforms, and internal tools.',
    },
  ],
};

export default customSoftwareSeoPage;
