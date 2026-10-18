import { SolutionItem } from '../types';

export const solutionsData: SolutionItem[] = [
  {
    id: 'business-process-automation',
    title: 'Business Process Automation',
    category: 'Operational',
    summary: 'Replace repetitive manual workflows, spreadsheet handoffs, and email approval chains with automated web pipelines.',
    problem: 'Staff spend hundreds of hours re-entering invoice data, chasing manager email sign-offs, and reconciling status reports across disparate tools, introducing costly errors and operational drag.',
    proposedApproach: 'We analyze your current manual sequence, model the workflow as a deterministic state machine, and engineer custom web portals with automated validation, webhook notifications, and role-based sign-offs.',
    potentialBenefits: [
      'Eliminates manual re-entry errors and data discrepancies',
      'Provides real-time visibility into process bottlenecks and cycle times',
      'Frees skilled personnel to focus on higher-value customer and operational tasks'
    ],
    implementationConsiderations: [
      'Requires mapping all edge cases and exception handling paths before coding',
      'Integration compatibility with legacy database schemas and third-party SaaS APIs',
      'Change management and role-based training for operational teams'
    ],
    relatedServiceRoute: '/services/custom-software',
    relatedServiceName: 'Custom Software Development'
  },
  {
    id: 'ai-document-search',
    title: 'AI-Powered Knowledge & Document Search',
    category: 'Intelligence',
    summary: 'Private, retrieval-augmented intelligence enabling employees to query complex technical manuals, SOPs, and contracts with verified citations.',
    problem: 'Knowledge workers spend an estimated 20% of their working hours searching for internal documents, frequently acting on outdated revisions or contradictory specifications.',
    proposedApproach: 'We build an enterprise RAG architecture utilizing hybrid BM25 lexical and dense vector search over your secure document store, enforcing zero-hallucination guardrails and strict document citations.',
    potentialBenefits: [
      'Reduces technical procedure research from 20 minutes to under 15 seconds',
      'Verifiable source citations ensure operational safety and compliance',
      'Zero proprietary data leakage into public third-party model training datasets'
    ],
    implementationConsiderations: [
      'Document sanitization, optical character recognition (OCR) quality, and table formatting',
      'Role-based access boundaries to prevent unprivileged users seeing confidential files',
      'Token budget governance and response latency monitoring'
    ],
    relatedServiceRoute: '/services/ai-machine-learning',
    relatedServiceName: 'AI & Machine Learning'
  },
  {
    id: 'custom-business-dashboards',
    title: 'Custom Business & Operational Dashboards',
    category: 'Operational',
    summary: 'Unified KPI telemetry systems presenting real-time revenue, production, and customer engagement metrics with sub-second drilldowns.',
    problem: 'Executive leaders receive outdated weekly or monthly summaries that prevent proactive intervention when operational metrics degrade.',
    proposedApproach: 'We engineer automated data extraction pipelines that consolidate disparate database tables and SaaS metrics into a normalized warehouse, displayed on an uncluttered, high-contrast dashboard.',
    potentialBenefits: [
      'Immediate real-time visibility into daily revenue, pipeline, and unit metrics',
      'Automated daily and weekly PDF digests delivered directly to executive inboxes',
      'Eliminates contradictory reports produced by different department spreadsheets'
    ],
    implementationConsiderations: [
      'Data source connector reliability and handling API rate limits',
      'Establishing shared definitions for business metrics (e.g. active user vs churn)',
      'Configuring strict access control for sensitive compensation or margin figures'
    ],
    relatedServiceRoute: '/services/data-analytics',
    relatedServiceName: 'Data Analytics & BI'
  },
  {
    id: 'digital-commerce-engines',
    title: 'E-commerce & Digital Commerce Modernization',
    category: 'Commerce',
    summary: 'Resilient, transaction-ready storefronts engineered for fast mobile checkout, real-time stock sync, and multi-tier pricing.',
    problem: 'Legacy storefronts encounter slow mobile load speeds, abandoned checkouts due to payment friction, and stock allocation errors during high-volume sales bursts.',
    proposedApproach: 'We architect decoupled headless or engineered WooCommerce stores with optimized single-step checkouts, automated tax and shipping hooks, and synchronized warehouse stock reservations.',
    potentialBenefits: [
      'Sub-2-second mobile load times that maximize search engine and ad conversion',
      'Seamless support for modern UPI, card, and digital wallet payment options',
      'Flexible price books supporting both direct consumer retail and wholesale B2B tiers'
    ],
    implementationConsiderations: [
      'Payment gateway sandbox testing across edge-case card and banking failures',
      'Data migration of historical customer orders and catalog metadata',
      'Automated transactional email and SMS notification configuration'
    ],
    relatedServiceRoute: '/services/ecommerce',
    relatedServiceName: 'E-commerce Development'
  },
  {
    id: 'cloud-infrastructure-modernization',
    title: 'Cloud Modernization & Migration',
    category: 'Infrastructure',
    summary: 'Transition fragile on-premise servers and unmanaged VMs into resilient, auto-scaling cloud architectures on AWS and Azure.',
    problem: 'On-premise hardware and monolithic servers suffer from single points of failure, lack automated disaster recovery, and prevent modern CI/CD deployment workflows.',
    proposedApproach: 'We design containerized cloud topologies with VPC network isolation, automated daily snapshots, multi-AZ failovers, and GitHub Actions CI/CD pipelines for zero-downtime releases.',
    potentialBenefits: [
      'High availability with automated healing and multi-region backup resilience',
      'Predictable deployments that execute in minutes with automated rollbacks',
      'FinOps governance eliminating orphaned cloud storage and idle compute waste'
    ],
    implementationConsiderations: [
      'Database migration strategies with minimal maintenance windows',
      'Bandwidth and latency testing between legacy and cloud resources',
      'Security group hardening and IAM principle of least privilege enforcement'
    ],
    relatedServiceRoute: '/services/cloud-devops',
    relatedServiceName: 'Cloud & DevOps Engineering'
  },
  {
    id: 'application-modernization',
    title: 'Application Modernization & Monolith Refactoring',
    category: 'Operational',
    summary: 'Incrementally decompose brittle legacy systems into modern, strongly-typed TypeScript and React applications without stopping business operations.',
    problem: 'Organizations get trapped with legacy web applications that are expensive to maintain, lack test coverage, and break whenever new features are introduced.',
    proposedApproach: 'We apply the proven Strangler Fig pattern to decouple critical workflows one by one, replacing legacy screens with modern, accessible React components backed by clean typed APIs.',
    potentialBenefits: [
      'Maintains uninterrupted business operations throughout the modernization cycle',
      'Drastically accelerates future feature delivery and developer onboarding',
      'Eliminates legacy security vulnerabilities and unmaintained framework dependencies'
    ],
    implementationConsiderations: [
      'Maintaining bi-directional data synchronization between legacy and new systems',
      'Writing regression test suites to guarantee functional equivalence',
      'Phased rollout to small user cohorts to validate stability before full cutover'
    ],
    relatedServiceRoute: '/services/custom-software',
    relatedServiceName: 'Custom Software Development'
  },
  {
    id: 'lead-generation-growth',
    title: 'Lead Generation & Digital Growth Engines',
    category: 'Commerce',
    summary: 'Technical SEO foundations, conversion rate optimization, and high-intent content funnels that generate qualified commercial inquiries.',
    problem: 'Attractive websites often suffer from negligible organic search traffic, poor ranking for non-branded commercial terms, and forms that prospects abandon.',
    proposedApproach: 'We audit and resolve technical SEO bottlenecks, structure semantic JSON-LD data, optimize Core Web Vitals, and build topic authority clusters that rank for high-intent search queries.',
    potentialBenefits: [
      'Sustainable compounding inbound organic traffic without endless ad spend',
      'Higher form completion rates through frictionless, validated inquiry UX',
      'Complete attribution tracking from search keyword to customer conversion'
    ],
    implementationConsiderations: [
      'Requires consistent editorial cadence and keyword discipline',
      'Search engine crawl budget and indexation verification cycles (3–12 weeks)',
      'Regular analysis of Google Search Console query impressions and click-through rates'
    ],
    relatedServiceRoute: '/services/digital-marketing',
    relatedServiceName: 'Digital Marketing & SEO'
  },
  {
    id: 'system-integration-middleware',
    title: 'System Integration & Enterprise Middleware',
    category: 'Infrastructure',
    summary: 'Unify isolated ERPs, CRMs, payment gateways, and custom databases into a synchronized, event-driven ecosystem.',
    problem: 'Departments operate in software silos where customer records, purchase orders, and inventory counts must be manually exported and reconciled via spreadsheets.',
    proposedApproach: 'We design secure REST/GraphQL middleware and webhook event buses that translate schemas, manage rate limits, and push transactional updates across systems in real time.',
    potentialBenefits: [
      'Single source of truth for customer, order, and inventory records across tools',
      'Automatic retry logic and dead-letter queues prevent lost transaction updates',
      'Reduces administrative overhead and customer communication lag'
    ],
    implementationConsiderations: [
      'Managing API token rotations, rate limits, and third-party downtime gracefully',
      'Schema transformation and conflict resolution rules when two systems update concurrently',
      'Comprehensive error logging and alerting for engineering observability'
    ],
    relatedServiceRoute: '/services/it-consulting',
    relatedServiceName: 'IT Consulting'
  },
  {
    id: 'learning-training-platforms',
    title: 'Learning & Technical Training Platforms',
    category: 'Operational',
    summary: 'Structured digital platforms for syllabus delivery, student lab submissions, and standardized mentor code reviews.',
    problem: 'Technical education programs struggle to coordinate syllabi, verify student coding exercises, and provide structured mentor feedback across remote student cohorts.',
    proposedApproach: 'We engineer tailored educational portals featuring modular week-by-week syllabi, Git repository submission verification, and standardized rubric scoring for instructors.',
    potentialBenefits: [
      'Higher student course completion rates through structured milestone tracking',
      'Standardized mentor code review scoring eliminates subjective grading discrepancies',
      'Verifiable digital certificate generation with public URL authenticity verification'
    ],
    implementationConsiderations: [
      'Role-based permissions for students, teaching assistants, and lead instructors',
      'Handling video streaming or embedding without slowing page performance',
      'Automated repository link validation and submission deadlines'
    ],
    relatedServiceRoute: '/services/training',
    relatedServiceName: 'Technical Training & Skill Development'
  }
];
