import { ServicePageData } from './types';

export const itConsultingSeoPage: ServicePageData = {
  slug: 'it-consulting',
  seoTitle: 'IT Consulting & Technology Roadmaps | Architecture Audits | IAMTECHNI',
  metaDescription:
    'Strategic IT consulting and architecture advisory by IAMTECHNI. Vendor-neutral codebase audits, modernization roadmaps, build-vs-buy analysis, and tech governance.',
  h1: 'IT Consulting & Technology Roadmaps',
  sections: [
    {
      h2: 'Vendor-Neutral Architecture Audits & Technical Due Diligence',
      paragraphs: [
        'IAMTECHNI provides objective, senior-level engineering advisory to help leadership make confident technology investments. We inspect existing codebases, database schemas, cloud bills, and security postures to uncover bottlenecks and technical debt.',
        'Our recommendations are 100% vendor-neutral and focused on long-term reliability, maintainability, and total cost of ownership.',
      ],
    },
    {
      h2: 'Phased Modernization Roadmaps & Engineering Governance',
      paragraphs: [
        'Whether evaluating build-versus-buy decisions, planning a monolith-to-microservices transition, or establishing Git and CI/CD standards for an internal team, we deliver clear 12-to-36 month architectural roadmaps.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Are your consulting recommendations tied to specific vendors?',
      answer:
        'No. We provide strictly vendor-neutral technical advice focused on what delivers the highest business value, durability, and cost efficiency for your specific team.',
    },
    {
      question: 'What deliverables do we receive after a technical audit?',
      answer:
        'You receive a comprehensive architecture scorecard, prioritized risk register, cost-optimization recommendations, and a phased implementation blueprint.',
    },
  ],
};

export default itConsultingSeoPage;
