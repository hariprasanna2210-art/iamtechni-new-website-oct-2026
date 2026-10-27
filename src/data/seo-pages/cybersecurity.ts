import { ServicePageData } from './types';

export const cybersecuritySeoPage: ServicePageData = {
  slug: 'cybersecurity',
  seoTitle: 'Cybersecurity & Hardening Services | OWASP Audits & Security | IAMTECHNI',
  metaDescription:
    'Protect your applications and cloud infrastructure with IAMTECHNI Cybersecurity & Hardening services. OWASP security audits, RBAC governance, and server hardening.',
  h1: 'Cybersecurity & Hardening',
  sections: [
    {
      h2: 'Application Security & OWASP Top-10 Defensive Engineering',
      paragraphs: [
        'IAMTECHNI embeds defensive security controls directly into your application codebase, APIs, and authentication flows. We remediate XSS, CSRF, injection vectors, and broken access controls before they can be exploited.',
        'Every web platform we harden is configured with strict HTTP security headers (CSP, HSTS, X-Frame-Options), rate limiting, and parameterized database queries.',
      ],
    },
    {
      h2: 'Vulnerability Audits, Identity Governance & Server Hardening',
      paragraphs: [
        'We perform thorough dependency scanning, static code analysis, and Linux/container infrastructure hardening—enforcing SSH key-only access, firewall isolation, and least-privilege IAM roles.',
        'Following each assessment, your team receives a prioritized remediation roadmap scored by severity and operational impact.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Do you guarantee 100% protection from cyber attacks?',
      answer:
        'No reputable security firm guarantees absolute invulnerability. Our focus is defense-in-depth: eliminating common attack vectors, minimizing blast radius, and implementing monitoring so incidents can be contained rapidly.',
    },
    {
      question: 'Can you audit an existing application built by another team?',
      answer:
        'Yes. We conduct independent security and code quality audits on existing repositories and cloud accounts, delivering actionable remediation patches.',
    },
  ],
};

export default cybersecuritySeoPage;
