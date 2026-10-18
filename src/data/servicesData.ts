import { ServiceItem } from '../types';

export const servicesData: ServiceItem[] = [
  {
    id: 'web-development',
    slug: 'web-development',
    title: 'Web Development',
    category: 'Experiences',
    tagline: 'High-performance corporate websites and responsive web applications built for business impact.',
    summary: 'We architect and build fast, responsive, and secure web solutions that scale with your organization. From corporate brand flagships to internal business portals, our engineering emphasizes clean code, SEO foundations, and WCAG accessibility.',
    problemStatement: 'Many modern websites struggle with sluggish load times, rigid legacy CMS architectures, poor mobile responsiveness, and fragile integrations that fail to deliver qualified business opportunities.',
    capabilities: [
      {
        title: 'Corporate Flagships & Portals',
        description: 'Bespoke corporate web architectures that reflect enterprise credibility, technical authority, and conversion focus.',
        points: ['Custom Next.js & React architectures', 'Design-system driven component libraries', 'Multilingual and regional content structures']
      },
      {
        title: 'Frontend Engineering & Modernization',
        description: 'Migrating outdated, monolith frontends into decoupled, high-speed modern client applications.',
        points: ['Performance audits & Core Web Vitals optimization', 'Micro-frontend and headless architectures', 'Zero-runtime CSS & responsive layouts']
      },
      {
        title: 'CMS & Content Workflows',
        description: 'Streamlined editorial systems that empower marketing teams without sacrificing engineering standards.',
        points: ['Headless CMS integration (Sanity, Strapi)', 'WordPress & enterprise CMS engineering', 'Custom content models and publishing workflows']
      },
      {
        title: 'System Integration & APIs',
        description: 'Seamlessly connecting web experiences to your CRM, ERP, authentication, and marketing engines.',
        points: ['RESTful & GraphQL API integration', 'Single Sign-On (SSO) & role-based access', 'Webhook orchestration and real-time syncing']
      }
    ],
    useCases: [
      {
        title: 'Enterprise Corporate Presence',
        description: 'Unified multi-region corporate platform for a mid-market technology manufacturer requiring sub-second page loads and localized content.',
        outcome: '98+ Lighthouse performance score and 62% reduction in bounce rate.'
      },
      {
        title: 'Customer Self-Service Portal',
        description: 'Secure client workspace integrating account records, document downloads, and service ticket requests.',
        outcome: 'Streamlined account workflows and eliminated manual email correspondence for routine requests.'
      }
    ],
    deliverySteps: [
      { phase: '01. Architecture Discovery', description: 'Review business goals, user personas, technical requirements, and integrations.' },
      { phase: '02. Information Architecture & Wireframes', description: 'Map sitemaps, page taxonomies, content schemas, and responsive layout blueprints.' },
      { phase: '03. Component Development', description: 'Build reusable, accessible UI components in TypeScript with responsive styling.' },
      { phase: '04. Integration & Validation', description: 'Connect backend APIs, implement analytics, and execute cross-browser/device QA.' },
      { phase: '05. Production Release & Monitoring', description: 'Zero-downtime deployment, DNS provisioning, and continuous Core Web Vitals observation.' }
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'Node.js', 'WordPress', 'REST APIs'],
    faqs: [
      {
        question: 'Do you build custom themes or use off-the-shelf templates?',
        answer: 'We engineer bespoke component architectures tailored to your exact brand and technical requirements. We do not use bloated multi-purpose themes that compromise performance and security.'
      },
      {
        question: 'How do you ensure search engine visibility (SEO)?',
        answer: 'SEO is foundational to our engineering process: semantic HTML5 structures, server-side rendering where beneficial, structured JSON-LD data, automated XML sitemaps, and optimized Core Web Vitals.'
      },
      {
        question: 'Can our internal marketing team update copy and media independently?',
        answer: 'Yes. We pair modern frontend frameworks with headless or structured CMS workflows, providing intuitive visual editing fields without risk of breaking layout geometry.'
      }
    ]
  },
  {
    id: 'ecommerce',
    slug: 'ecommerce',
    title: 'E-commerce Development',
    category: 'Experiences',
    tagline: 'Reliable, transaction-ready storefronts engineered for smooth checkout and high conversion.',
    summary: 'We build resilient online storefronts, catalog systems, and checkout workflows tailored to modern retail and B2B commerce. From payment gateways to inventory synchronization, we create shopping experiences customers trust.',
    problemStatement: 'Off-the-shelf stores often suffer from rigid checkout friction, payment failures, poor mobile navigation, and lack of real-time inventory synchronization with existing enterprise systems.',
    capabilities: [
      {
        title: 'Custom Storefront Architecture',
        description: 'Tailored e-commerce interfaces designed around your unique product catalog and customer buying journey.',
        points: ['Fast, multi-attribute product filters', 'Mobile-first shopping bag and quick-view UX', 'Optimized single-page and multi-step checkout']
      },
      {
        title: 'Payment & Gateway Integration',
        description: 'Secure, compliant payment orchestrations supporting cards, UPI, digital wallets, and Net Banking.',
        points: ['Stripe, Razorpay, and regional gateway integration', 'PCI-DSS compliance best practices', 'Automated currency conversion and invoicing']
      },
      {
        title: 'Inventory & Order Operations',
        description: 'Connecting your storefront directly to backend ERP, warehouse management, and shipping carriers.',
        points: ['Real-time stock reservation workflows', 'Automated shipping calculation and tracking hooks', 'B2B price tiers and volume quoting']
      },
      {
        title: 'WooCommerce & Custom Commerce Engines',
        description: 'Engineered WooCommerce implementations and headless commerce setups built for durability and scale.',
        points: ['Database indexing for large SKU catalogs', 'Custom plugin development & security hardening', 'Automated backup and checkout failover']
      }
    ],
    useCases: [
      {
        title: 'B2B Industrial Catalog & Ordering',
        description: 'Wholesale distributor transition from manual phone orders to a self-service digital catalog with custom tiered price books.',
        outcome: '44% reduction in order processing overhead and 24/7 order capture capability.'
      },
      {
        title: 'Direct-to-Consumer Brand Store',
        description: 'High-speed retail storefront with fast mobile checkout, bundle configurations, and regional payment routing.',
        outcome: 'Sub-2-second mobile load times and 28% improvement in completed checkouts.'
      }
    ],
    deliverySteps: [
      { phase: '01. Catalog & Commerce Audit', description: 'Analyze SKU structures, taxation, payment requirements, and fulfilment workflows.' },
      { phase: '02. UX & Checkout Prototyping', description: 'Design friction-free product browsing, cart review, and checkout funnels.' },
      { phase: '03. Engine & Payment Setup', description: 'Implement database schemas, gateway hooks, tax calculations, and inventory hooks.' },
      { phase: '04. Security & Load Testing', description: 'Conduct end-to-end sandbox transactions, stress-test high traffic bursts, and verify SSL.' },
      { phase: '05. Launch & Optimization', description: 'Execute go-live checklist, configure abandoned checkout recovery, and monitor orders.' }
    ],
    technologies: ['WooCommerce', 'Shopify Liquid', 'Node.js', 'React', 'PostgreSQL', 'Stripe', 'Razorpay', 'Redis'],
    faqs: [
      {
        question: 'Which e-commerce platform do you recommend?',
        answer: 'We evaluate your SKU volume, existing software stack, and customization needs. For content-rich brands, WooCommerce or headless commerce offers complete ownership; for fast retail, headless Shopify or custom APIs may be ideal.'
      },
      {
        question: 'How do you handle payment security?',
        answer: 'We use tokenized payment integrations where sensitive card details never touch your server, maintaining strict compliance with PCI-DSS guidelines.'
      }
    ]
  },
  {
    id: 'custom-software',
    slug: 'custom-software',
    title: 'Custom Software Development',
    category: 'Software',
    tagline: 'Tailored enterprise software, business portals, and workflow engines built for exact operational needs.',
    summary: 'When off-the-shelf software falls short of your operating model, IAMTECHNI engineers bespoke web systems, internal tools, and microservices that adapt to your exact business logic, data rules, and compliance standards.',
    problemStatement: 'Siloed spreadsheets, mismatched SaaS tools, and manual data re-entry create operational bottlenecks, administrative errors, and significant overhead for growing organizations.',
    capabilities: [
      {
        title: 'Internal Operations & Workflows',
        description: 'Centralized operating systems that coordinate approval chains, task allocation, and record tracking.',
        points: ['Multi-role RBAC permission models', 'Audit logging and immutable change tracking', 'Custom status pipelines and notifications']
      },
      {
        title: 'Customer & Partner Portals',
        description: 'Secure, authenticated external workspaces for clients, vendors, and institutional partners.',
        points: ['Document repositories and secure signing flows', 'Live project milestone tracking', 'Self-service account management and billing views']
      },
      {
        title: 'API Engineering & Middleware',
        description: 'Scalable REST and GraphQL backend services orchestrating communication between disparate systems.',
        points: ['Robust API rate limiting and security', 'Structured schema validation and typed endpoints', 'Webhook ingest and queue-based processing']
      },
      {
        title: 'Legacy System Modernization',
        description: 'Refactoring fragile legacy desktop or monolith systems into clean, containerized web applications.',
        points: ['Incremental strangler-fig pattern migration', 'Database normalization and schema modernization', 'Automated unit and integration test coverage']
      }
    ],
    useCases: [
      {
        title: 'Equipment Maintenance Management System',
        description: 'Custom web portal replacing manual paperwork for scheduling preventive maintenance, field technician dispatches, and spare parts tracking.',
        outcome: 'Zero lost maintenance logs and 35% faster job completion reporting.'
      },
      {
        title: 'Supply Chain Vendor Coordination',
        description: 'Unified partner dashboard coordinating purchase orders, shipping manifests, and quality inspection sign-offs.',
        outcome: 'Real-time visibility across 14 suppliers and complete elimination of email spreadsheets.'
      }
    ],
    deliverySteps: [
      { phase: '01. Workflow Mapping', description: 'Map real-world operational workflows, edge cases, role permissions, and data structures.' },
      { phase: '02. Data Modeling & System Design', description: 'Design relational database schemas, state machines, and API contracts.' },
      { phase: '03. Agile Iteration & Sprints', description: 'Develop feature modules iteratively with continuous feedback and review demos.' },
      { phase: '04. Security Hardening & UAT', description: 'Execute role-based security testing, regression tests, and user acceptance trials.' },
      { phase: '05. Deployment & Handover', description: 'Containerized release, data migration assistance, and developer documentation.' }
    ],
    technologies: ['TypeScript', 'Node.js', 'Python', 'React', 'PostgreSQL', 'Docker', 'Redis', 'Tailwind CSS'],
    faqs: [
      {
        question: 'Who owns the intellectual property and code?',
        answer: 'You own 100% of the custom source code, database architectures, and assets developed for your organization upon milestone completion.'
      },
      {
        question: 'How do you ensure maintainability as our team grows?',
        answer: 'We write strongly-typed TypeScript/Python, enforce strict linting and architectural boundaries, write automated test suites, and deliver clear system documentation.'
      }
    ]
  },
  {
    id: 'mobile-apps',
    slug: 'mobile-apps',
    title: 'Mobile App Development',
    category: 'Software',
    tagline: 'Intuitive, responsive mobile experiences for modern iOS and Android ecosystems.',
    summary: 'We plan and engineer high-utility mobile applications and progressive web apps (PWAs) that deliver dependable performance, offline resilience, and clean, thumb-friendly touch ergonomics.',
    problemStatement: 'Many mobile apps suffer from excessive initial build complexity, clunky cross-platform touch feedback, and poor offline handling that leads to low user retention.',
    capabilities: [
      {
        title: 'Cross-Platform Applications',
        description: 'Single codebase architectures that deliver near-native performance across both iOS and Android.',
        points: ['React Native & modern cross-platform stacks', 'Shared business logic and typed API clients', 'Native device API access (Camera, Geolocation, Storage)']
      },
      {
        title: 'Progressive Web Apps (PWA)',
        description: 'Fast, installable web experiences with offline caching and zero app store submission friction.',
        points: ['Service worker caching and background sync', 'Web App Manifest and mobile home-screen installability', 'Optimized bundle size under 200KB initial payload']
      },
      {
        title: 'Mobile UX & Touch Ergonomics',
        description: 'Interfaces crafted specifically for thumb-zone accessibility, natural gestures, and instant feedback.',
        points: ['44px+ minimum touch targets', 'Haptic feedback integration and smooth gesture sheets', 'Adaptive layouts for diverse screen aspect ratios']
      },
      {
        title: 'API & Notification Infrastructure',
        description: 'Resilient backend notification queues and background synchronization services.',
        points: ['Firebase Cloud Messaging & Push Notifications', 'Optimistic UI updates with offline rollback', 'Secure biometric authentication hooks (FaceID/Fingerprint)']
      }
    ],
    useCases: [
      {
        title: 'Field Inspection Mobile Client',
        description: 'Offline-first tablet and smartphone tool enabling field auditors to record equipment checklists and capture photos with automatic cloud sync upon reconnection.',
        outcome: 'Reliable data collection in remote facilities with zero data loss.'
      },
      {
        title: 'Customer Loyalty & Ordering App',
        description: 'Lightweight mobile ordering companion featuring fast repeats, digital punch card, and real-time order status.',
        outcome: '3.2x higher re-order frequency compared to desktop web orders.'
      }
    ],
    deliverySteps: [
      { phase: '01. Ergonomic UX & Device Strategy', description: 'Define core mobile journeys, offline requirements, and screen density targets.' },
      { phase: '02. Interactive Wireframing', description: 'Prototype touch flows, transition gestures, and modal drawer interactions.' },
      { phase: '03. Application Architecture', description: 'Implement typed state management, offline persistence layers, and API endpoints.' },
      { phase: '04. Device Testing & Optimization', description: 'Test battery consumption, memory footprint, and network latency throttles.' },
      { phase: '05. Distribution & Store Preparation', description: 'Prepare build signing, privacy policies, app store assets, or PWA deployment.' }
    ],
    technologies: ['React Native', 'TypeScript', 'Expo', 'PWA', 'Tailwind CSS', 'Node.js', 'Firebase'],
    faqs: [
      {
        question: 'Should we build a Native app or a Progressive Web App (PWA)?',
        answer: 'If your application requires deep background sensor access or store presence, React Native is ideal. If you want instant zero-install access via web link with offline caching, PWAs provide lower development cost and faster rollout.'
      }
    ]
  },
  {
    id: 'ai-machine-learning',
    slug: 'ai-machine-learning',
    title: 'AI & Machine Learning',
    category: 'AI & Data',
    tagline: 'Practical enterprise artificial intelligence, retrieval-augmented generation (RAG), and automation.',
    summary: 'We help organizations move beyond AI novelty to build reliable, domain-grounded intelligence into their operations. From internal document knowledge assistants to workflow automation, we engineer secure, hallucination-resistant systems.',
    problemStatement: 'Enterprises struggle to deploy AI safely due to hallucinations, lack of private document grounding, privacy compliance concerns, and prohibitive infrastructure costs.',
    capabilities: [
      {
        title: 'Retrieval-Augmented Generation (RAG)',
        description: 'Architecting private semantic search and citation-backed question answering over your enterprise documentation.',
        points: ['Chunking and hybrid vector/lexical retrieval', 'Vector database implementation (pgvector, Chroma, Qdrant)', 'Strict source attribution and citation traceability']
      },
      {
        title: 'Enterprise Knowledge Assistants',
        description: 'Domain-specific assistants trained on your SOPs, policies, engineering manuals, and operational logs.',
        points: ['Role-based document access boundaries', 'Audit logging of queries and generated responses', 'Private deployment options to prevent proprietary data leakage']
      },
      {
        title: 'Intelligent Document Processing',
        description: 'Automated extraction, classification, and validation of invoices, contracts, and technical specifications.',
        points: ['Structured JSON extraction from unstructured PDFs', 'Schema validation and human-in-the-loop review queues', 'Automated anomaly and discrepancy flagging']
      },
      {
        title: 'AI API Integration & Orchestration',
        description: 'Connecting leading foundation models into your existing applications, CRMs, and customer service desks.',
        points: ['Cost-aware prompt caching and token budgeting', 'Fallback routing across model tiers', 'Guardrails against prompt injection and toxic output']
      }
    ],
    useCases: [
      {
        title: 'Internal Policy & Engineering RAG Assistant',
        description: 'Knowledge assistant indexing 4,000+ internal engineering SOPs and policy guidelines for an engineering consultancy.',
        outcome: 'Engineers save 45 minutes daily locating verified procedures with exact source page citations.'
      },
      {
        title: 'Customer Inbound Ticket Triage',
        description: 'Intelligent triage agent classifying incoming support tickets, extracting order IDs, and proposing verified responses for team approval.',
        outcome: '58% faster response times with 100% human-in-the-loop oversight.'
      }
    ],
    deliverySteps: [
      { phase: '01. Feasibility & Data Audit', description: 'Assess document quality, proprietary constraints, accuracy benchmarks, and ROI.' },
      { phase: '02. RAG Pipeline & Chunking Design', description: 'Design embedding strategies, metadata filtering, and retrieval ranking.' },
      { phase: '03. Model Orchestration & Guardrails', description: 'Implement prompt engineering, structured validation, and token cost controls.' },
      { phase: '04. Evaluation & Grounding Benchmark', description: 'Run test datasets to measure recall, precision, and hallucination rates.' },
      { phase: '05. Monitored Deployment', description: 'Deploy with observability logging, user feedback loops, and token cost analytics.' }
    ],
    technologies: ['Python', 'LangChain', 'LlamaIndex', 'pgvector', 'OpenAI API', 'Gemini API', 'FastAPI', 'Docker'],
    faqs: [
      {
        question: 'Will our proprietary company data be used to train public AI models?',
        answer: 'No. We configure enterprise-grade zero-retention API endpoints or private vector stores where your data remains strictly confidential and is never used for training third-party public models.'
      },
      {
        question: 'How do you prevent AI hallucinations in critical workflows?',
        answer: 'We employ strict Retrieval-Augmented Generation (RAG) with source attribution: the system is restricted to answering only from verified retrieved context passages, and flags uncertain queries for human review.'
      }
    ]
  },
  {
    id: 'data-analytics',
    slug: 'data-analytics',
    title: 'Data Analytics & Business Intelligence',
    category: 'AI & Data',
    tagline: 'Transform disconnected operational data into clear, interactive decision-support dashboards.',
    summary: 'We design data pipelines, metrics warehouses, and automated dashboards that give leaders real-time visibility into revenue, operational bottlenecks, customer engagement, and team efficiency.',
    problemStatement: 'Organizations lose hours compiling weekly reports across disconnected tools, leading to delayed decisions, contradictory spreadsheets, and blind spots in performance.',
    capabilities: [
      {
        title: 'Executive & Operational Dashboards',
        description: 'Custom web dashboards presenting live KPIs with intuitive time-series filtering and drill-down views.',
        points: ['Tabular precision and responsive charting', 'Role-tailored KPI views for leadership vs managers', 'Automated scheduled email and PDF snapshot reports']
      },
      {
        title: 'Data Pipeline Engineering (ETL/ELT)',
        description: 'Automated data extraction and transformation pipelines connecting disparate SaaS tools and databases.',
        points: ['Automated synchronization schedules', 'Data cleaning, schema transformation, and deduplication', 'Error alerting and schema drift monitoring']
      },
      {
        title: 'Customer & Revenue Analytics',
        description: 'Cohorts, conversion funnel drop-offs, churn prediction, and customer lifetime value reporting.',
        points: ['Multi-touch attribution models', 'Product usage telemetry aggregation', 'Cohort retention tables and visualizations']
      },
      {
        title: 'Self-Service BI Enablement',
        description: 'Structuring clean data warehouses and semantic models so non-technical team members can query data safely.',
        points: ['PostgreSQL & analytics warehouse modeling', 'Power BI / Metabase / Looker integration', 'Data governance, documentation, and query dictionary']
      }
    ],
    useCases: [
      {
        title: 'Multi-Location Operations Dashboard',
        description: 'Consolidated reporting portal pulling daily sales, inventory levels, and labor costs across 8 branch locations.',
        outcome: 'Replaced 4 hours of manual evening spreadsheet collation with real-time continuous visibility.'
      }
    ],
    deliverySteps: [
      { phase: '01. Metrics Discovery', description: 'Define North Star metrics, operational KPIs, data sources, and refresh cadences.' },
      { phase: '02. Data Modeling & Ingestion', description: 'Build automated connectors, clean historical data, and construct star schemas.' },
      { phase: '03. Visualization & Dashboard UX', description: 'Build clear, uncluttered dashboard views with role-based access control.' },
      { phase: '04. Data Validation', description: 'Cross-verify pipeline numbers against source systems to establish 100% data integrity.' },
      { phase: '05. Training & Handover', description: 'Train internal stakeholders on report filters, export capabilities, and alerts.' }
    ],
    technologies: ['PostgreSQL', 'Python', 'Pandas', 'Metabase', 'Power BI', 'Node.js', 'Chart.js', 'SQL'],
    faqs: [
      {
        question: 'Can we connect custom databases and external SaaS tools?',
        answer: 'Yes. We build custom ETL pipelines and API connectors for PostgreSQL, MySQL, Google Sheets, CRMs, e-commerce stores, and accounting software.'
      }
    ]
  },
  {
    id: 'cloud-devops',
    slug: 'cloud-devops',
    title: 'Cloud & DevOps Engineering',
    category: 'Cloud & Security',
    tagline: 'Resilient cloud architecture, automated CI/CD pipelines, and cost-optimized infrastructure.',
    summary: 'We architect and maintain robust cloud environments on AWS and Microsoft Azure. Through containerization, automated testing, and CI/CD pipelines, we ensure your software deploys reliably with zero downtime.',
    problemStatement: 'Unplanned downtime, slow manual deployments, escalating cloud bills, and brittle server configurations compromise operational continuity and strain engineering teams.',
    capabilities: [
      {
        title: 'Cloud Architecture & Migration',
        description: 'Designing scalable, secure cloud environments tailored to your workload profile and budget constraints.',
        points: ['AWS and Microsoft Azure architecture design', 'Zero-downtime database and application migration', 'Multi-AZ high availability and automated disaster recovery']
      },
      {
        title: 'Containerization & Orchestration',
        description: 'Packaging applications into lightweight, predictable Docker containers with scalable orchestration.',
        points: ['Docker container optimization & multi-stage builds', 'Kubernetes and lightweight container runtimes', 'Consistent environment parity across staging and production']
      },
      {
        title: 'Continuous Integration & Deployment (CI/CD)',
        description: 'Automating the path from code commit to production with automated tests and zero-downtime releases.',
        points: ['GitHub Actions, GitLab CI, and Jenkins automation', 'Automated linting, test suites, and vulnerability scans', 'Blue/green and canary deployment strategies']
      },
      {
        title: 'Cloud Cost Optimization (FinOps)',
        description: 'Auditing idle resources, right-sizing compute instances, and eliminating unneeded cloud waste.',
        points: ['Compute and storage right-sizing recommendations', 'Reserved instances and savings plan strategies', 'Budgets, alerting, and telemetry dashboards']
      }
    ],
    useCases: [
      {
        title: 'Automated CI/CD for High-Growth SaaS',
        description: 'Replaced manual SSH server updates with an automated GitHub Actions pipeline executing unit tests and zero-downtime deployment.',
        outcome: 'Deployment time dropped from 45 minutes to 3.5 minutes with zero release incidents.'
      }
    ],
    deliverySteps: [
      { phase: '01. Infrastructure Audit', description: 'Review existing hosting, security configurations, bottlenecks, and monthly costs.' },
      { phase: '02. Target Architecture Blueprint', description: 'Design VPC, subnet isolation, IAM boundaries, and CI/CD pipeline triggers.' },
      { phase: '03. Infrastructure as Code & Pipeline', description: 'Script infrastructure, configure automated container builds, and test runs.' },
      { phase: '04. Migration & Staging Validation', description: 'Replicate production workloads in staging and test failovers and backups.' },
      { phase: '05. Production Cutover & Monitoring', description: 'Execute DNS cutover with monitoring, logging, and error alerting in place.' }
    ],
    technologies: ['AWS', 'Microsoft Azure', 'Docker', 'Kubernetes', 'Linux', 'Nginx', 'GitHub Actions', 'Terraform'],
    faqs: [
      {
        question: 'How do you prevent cloud bill shock?',
        answer: 'We establish proactive budget guardrails, resource auto-scaling caps, automated anomaly notifications, and eliminate orphaned storage volumes or over-provisioned instances.'
      }
    ]
  },
  {
    id: 'cybersecurity',
    slug: 'cybersecurity',
    title: 'Cybersecurity & Hardening',
    category: 'Cloud & Security',
    tagline: 'Defensive engineering, vulnerability management, and infrastructure hardening for digital assets.',
    summary: 'We build defensive security practices into every layer of your application lifecycle. From access control policies and secure headers to dependency auditing and vulnerability remediation, we help safeguard critical systems.',
    problemStatement: 'Application vulnerabilities, misconfigured cloud storage, unpatched dependencies, and weak authentication expose organizations to data breaches, ransomware, and reputational harm.',
    capabilities: [
      {
        title: 'Application Security & Secure Coding',
        description: 'Implementing OWASP top-10 defensive controls directly into application logic and API endpoints.',
        points: ['Strict input sanitization and parameterized queries', 'Cross-Site Scripting (XSS) & CSRF mitigation', 'Secure HTTP response headers (CSP, HSTS, X-Frame-Options)']
      },
      {
        title: 'Authentication & Access Governance',
        description: 'Hardening identity workflows with multi-factor authentication and granular role-based permissions.',
        points: ['MFA enforcement and session security', 'Granular Role-Based Access Control (RBAC)', 'Principle of least privilege across API tokens and service accounts']
      },
      {
        title: 'Vulnerability Audits & Dependency Scanning',
        description: 'Proactively identifying vulnerabilities in codebases, libraries, and container base images.',
        points: ['Automated Software Composition Analysis (SCA)', 'Static code vulnerability auditing', 'Remediation roadmaps with prioritized severity scoring']
      },
      {
        title: 'Infrastructure & Server Hardening',
        description: 'Securing underlying Linux hosts, reverse proxies, and database connections against unauthorized access.',
        points: ['SSH key-only authentication and port isolation', 'Firewall rules and rate-limiting against brute force', 'Automated security patch pipelines and backup encryption']
      }
    ],
    useCases: [
      {
        title: 'Web Application Security Hardening',
        description: 'Pre-launch security audit and vulnerability remediation for a customer portal handling sensitive financial documents.',
        outcome: 'Remediated 14 critical configuration risks, enforced strict Content Security Policy, and implemented encrypted document storage.'
      }
    ],
    deliverySteps: [
      { phase: '01. Threat Modeling & Scope', description: 'Identify critical assets, potential attack vectors, and compliance requirements.' },
      { phase: '02. Vulnerability Assessment', description: 'Run automated and manual audits across code, dependencies, and servers.' },
      { phase: '03. Remediation Planning', description: 'Deliver clear technical action items prioritized by CVSS severity and business impact.' },
      { phase: '04. Engineering Hardening', description: 'Implement code patches, configure headers, lock down IAM, and verify encryption.' },
      { phase: '05. Verification & Monitoring', description: 'Re-test remediated endpoints and configure intrusion alerting.' }
    ],
    technologies: ['Linux', 'Nginx', 'OWASP Standards', 'Docker Security', 'OpenSSL', 'Fail2ban', 'TLS 1.3'],
    faqs: [
      {
        question: 'Do you guarantee 100% protection from cyber attacks?',
        answer: 'No reputable security firm guarantees absolute invulnerability. Our focus is defense-in-depth: eliminating common attack vectors, minimizing blast radius, and implementing monitoring so incidents can be contained rapidly.'
      }
    ]
  },
  {
    id: 'digital-marketing',
    slug: 'digital-marketing',
    title: 'Digital Marketing & SEO',
    category: 'Growth & Advisory',
    tagline: 'Technical search optimization, content strategy, and qualified lead generation engines.',
    summary: 'We connect technical development with digital growth. Through on-page and technical SEO, structured content planning, and conversion rate optimization (CRO), we ensure your digital assets attract, engage, and convert qualified prospects.',
    problemStatement: 'Many businesses invest in attractive websites that fail to rank on search engines, generate stagnant traffic, and lack clear conversion funnels to capture prospective buyers.',
    capabilities: [
      {
        title: 'Technical & On-Page SEO',
        description: 'Engineering the technical foundation that search engine spiders require for indexing and high ranking.',
        points: ['Site speed and Core Web Vitals optimization', 'Structured Schema.org JSON-LD implementation', 'Canonicalization, XML sitemaps, and robots.txt governance']
      },
      {
        title: 'Search Intent & Content Architecture',
        description: 'Developing keyword-mapped content clusters that capture high-intent commercial and informational searches.',
        points: ['Competitor gap analysis and keyword taxonomy', 'Editorial guidelines and technical copywriting', 'Internal linking strategies and topic authority clusters']
      },
      {
        title: 'Conversion Rate Optimization (CRO)',
        description: 'Analyzing user journeys, heatmaps, and form drop-offs to turn existing traffic into qualified inquiries.',
        points: ['Friction-free inquiry form design and micro-copy', 'Strategic CTA placement and objection handling', 'A/B landing page testing methodologies']
      },
      {
        title: 'Analytics & Attribution Setup',
        description: 'Configuring privacy-respecting analytics that track the complete path from initial impression to closed deal.',
        points: ['Google Analytics 4 & Search Console configuration', 'Custom event tracking for button clicks and downloads', 'UTM parameter tracking and lead source attribution']
      }
    ],
    useCases: [
      {
        title: 'B2B Technical Services Organic Growth',
        description: 'Comprehensive technical SEO restructure and topic cluster rollout for a commercial engineering consultancy.',
        outcome: '+185% increase in non-branded organic search traffic and 42% lift in qualified consultation requests.'
      }
    ],
    deliverySteps: [
      { phase: '01. Technical SEO Audit', description: 'Analyze indexation errors, crawl budget, speed bottlenecks, and metadata gaps.' },
      { phase: '02. Competitor & Keyword Research', description: 'Identify high-value keywords aligned with your prospective buyer intent.' },
      { phase: '03. On-Site Technical Fixes', description: 'Fix schema, canonicals, mobile layouts, and Core Web Vitals performance.' },
      { phase: '04. Content Strategy Execution', description: 'Publish optimized service landing pages and authoritative technical articles.' },
      { phase: '05. Monthly Attribution & Reporting', description: 'Track rankings, organic impressions, click-through rates, and inbound leads.' }
    ],
    technologies: ['Google Search Console', 'GA4', 'Schema.org', 'Lighthouse', 'Screaming Frog', 'Next.js SEO'],
    faqs: [
      {
        question: 'How long does it take to see results from technical SEO?',
        answer: 'Technical fixes (such as resolving indexing issues or Core Web Vitals) often reflect in search engine crawls within 3 to 6 weeks. Broad keyword ranking and organic traffic growth typically compound over 3 to 6 months.'
      }
    ]
  },
  {
    id: 'ui-ux-design',
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    category: 'Experiences',
    tagline: 'Purposeful user research, interface design systems, and friction-free digital workflows.',
    summary: 'Great software feels effortless. We combine user research, wireframing, interactive prototyping, and comprehensive design systems to create digital products that are intuitive to navigate, visually disciplined, and built for conversion.',
    problemStatement: 'Confusing user journeys, inconsistent visual elements, and lack of clear hierarchy lead to user frustration, high abandonment rates, and wasted development cycles.',
    capabilities: [
      {
        title: 'User Research & Journey Mapping',
        description: 'Uncovering the real goals, anxieties, and operational contexts of your target end-users.',
        points: ['Stakeholder interviews and user persona definitions', 'Task analysis and friction point identification', 'Information architecture and navigation flowcharts']
      },
      {
        title: 'Wireframing & Interactive Prototyping',
        description: 'Iterating through layout options rapidly before writing a single line of production code.',
        points: ['Low-fidelity wireframes for layout validation', 'High-fidelity clickable Figma prototypes', 'Interactive micro-interaction and motion specs']
      },
      {
        title: 'Design Systems & Component Libraries',
        description: 'Building reusable, tokenized design systems that ensure visual consistency and speed up engineering.',
        points: ['Color, typography, spacing, and radius tokens', 'Accessible component states (hover, focus, disabled)', 'Seamless Figma-to-code handoff documentation']
      },
      {
        title: 'Accessibility & Usability Audits',
        description: 'Reviewing existing interfaces against WCAG 2.2 AA accessibility guidelines and usability heuristics.',
        points: ['Contrast ratio and typography scale verification', 'Keyboard navigation and screen-reader readiness', 'Usability testing with representative task scenarios']
      }
    ],
    useCases: [
      {
        title: 'SaaS Dashboard Redesign',
        description: 'Complete UX overhaul of an analytics platform with 40+ complex screens, streamlining core workflows from 7 clicks down to 2.',
        outcome: 'Reduced onboarding support tickets by 52% and improved daily active user engagement.'
      }
    ],
    deliverySteps: [
      { phase: '01. Discovery & Empathy', description: 'Understand user goals, workflow friction, and competitive benchmarks.' },
      { phase: '02. Information Architecture', description: 'Organize navigation structures, user flows, and content hierarchies.' },
      { phase: '03. Wireframes & Low-Fi Testing', description: 'Test spatial layouts and screen ergonomics with stakeholders.' },
      { phase: '04. High-Fidelity UI & Tokens', description: 'Craft refined visual designs, typography pairings, and micro-interactions.' },
      { phase: '05. Developer Handoff', description: 'Deliver component specs, interactive states, and design tokens for engineering.' }
    ],
    technologies: ['Figma', 'Design Tokens', 'Tailwind CSS', 'WCAG 2.2 AA', 'Component Specs'],
    faqs: [
      {
        question: 'Do you deliver Figma files or working frontend code?',
        answer: 'Both. We create complete Figma UI kits and design systems, and our frontend engineering team can directly translate them into production-ready React/Tailwind code.'
      }
    ]
  },
  {
    id: 'it-consulting',
    slug: 'it-consulting',
    title: 'IT Consulting & Technology Roadmaps',
    category: 'Growth & Advisory',
    tagline: 'Strategic architecture reviews, digital roadmap planning, and technology modernization audits.',
    summary: 'Make informed technology decisions that support long-term business goals. We provide unbiased technical audits, architecture planning, vendor evaluations, and modernization roadmaps so your investments yield lasting return.',
    problemStatement: 'Businesses frequently overspend on disjointed software tools, adopt overly complex architectures, or accumulate technical debt that paralyzes new product launches.',
    capabilities: [
      {
        title: 'Technical Audits & Due Diligence',
        description: 'Comprehensive code, architecture, security, and infrastructure assessments of existing systems.',
        points: ['Codebase health and maintainability analysis', 'Security and technical debt identification', 'Actionable remediation scorecards with cost estimates']
      },
      {
        title: 'Technology Selection & Roadmaps',
        description: 'Objective guidance selecting the right frameworks, cloud providers, and databases for your scale.',
        points: ['Pragmatic Build vs Buy analysis', 'Phased 12-to-36 month technology modernization roadmaps', 'Vendor evaluation and RFP advisory']
      },
      {
        title: 'Architecture & System Integration Planning',
        description: 'Designing sustainable system topologies that scale gracefully as transaction volume grows.',
        points: ['Microservices vs modular monolith trade-off analysis', 'Database partitioning and caching topologies', 'Disaster recovery and business continuity planning']
      },
      {
        title: 'Team Mentoring & Engineering Practices',
        description: 'Helping internal engineering teams adopt modern development, automated testing, and CI/CD practices.',
        points: ['Code review guidelines and Git branching workflows', 'Automated test suite structuring', 'Documentation and architectural decision records (ADRs)']
      }
    ],
    useCases: [
      {
        title: 'Technology Stack Modernization Advisory',
        description: 'Evaluated legacy PHP/MySQL monolith for a mid-market distributor and architected a phased migration to Next.js and containerized APIs.',
        outcome: 'Prevented costly vendor lock-in and reduced projected infrastructure costs by 38%.'
      }
    ],
    deliverySteps: [
      { phase: '01. Strategic Context', description: 'Review business goals, revenue targets, team capabilities, and existing pain points.' },
      { phase: '02. Technical Deep-Dive', description: 'Inspect code repositories, server architectures, databases, and third-party SaaS tools.' },
      { phase: '03. Gap & Risk Analysis', description: 'Identify security vulnerabilities, scalability limits, and redundant operational costs.' },
      { phase: '04. Roadmap Presentation', description: 'Deliver executive summary, technical architecture blueprints, and phased milestones.' },
      { phase: '05. Implementation Oversight', description: 'Provide ongoing technical governance during execution phases.' }
    ],
    technologies: ['Architecture Reviews', 'Technical Audits', 'Cloud Migration', 'Security Best Practices', 'Tech Debt Analysis'],
    faqs: [
      {
        question: 'Are your consulting recommendations tied to specific vendors?',
        answer: 'No. We provide strictly vendor-neutral technical advice focused on what delivers the highest business value, durability, and cost efficiency for your specific team.'
      }
    ]
  },
  {
    id: 'training',
    slug: 'training',
    title: 'Technical Training & Skill Development',
    category: 'Growth & Advisory',
    tagline: 'Practical, syllabus-based engineering training and professional learning programs.',
    summary: 'Bridge the gap between theoretical knowledge and production engineering. We deliver structured, project-driven training for teams and individuals covering modern full-stack web development, AI integration, and cloud fundamentals.',
    problemStatement: 'Generic online tutorials rarely prepare engineers for real-world production environments, Git workflows, debugging production code, and collaborating on enterprise systems.',
    capabilities: [
      {
        title: 'Structured Full-Stack Curriculum',
        description: 'Hands-on training covering TypeScript, React, Node.js, databases, and API development.',
        points: ['Modern JavaScript & TypeScript fundamentals', 'State management, custom hooks, and React paradigms', 'RESTful API engineering with Node.js and PostgreSQL']
      },
      {
        title: 'AI & Practical Engineering Labs',
        description: 'Practical training on integrating LLMs, vector search, embeddings, and prompt engineering.',
        points: ['API integration best practices and token management', 'Building real RAG applications from scratch', 'Evaluation benchmarks and output guardrails']
      },
      {
        title: 'Corporate Team Upskilling',
        description: 'Customized workshops tailored to your organization’s tech stack and modernization goals.',
        points: ['Migrating legacy codebases to TypeScript & React', 'Git workflows, PR reviews, and CI/CD pipelines', 'Clean code, design patterns, and debugging methodologies']
      },
      {
        title: 'Project-Driven Mentorship',
        description: 'Every module culminates in a production-quality milestone project reviewed by senior engineers.',
        points: ['Rigorous line-by-line code reviews', 'Best practice architecture guidance', 'Portfolio-ready case study deliverables']
      }
    ],
    useCases: [
      {
        title: 'Engineering Team Transition to React & TypeScript',
        description: '4-week intensive upskilling program for 12 corporate engineers migrating legacy jQuery/PHP interfaces into modern React.',
        outcome: 'Team successfully transitioned to shipping TypeScript components with 0 production regressions.'
      }
    ],
    deliverySteps: [
      { phase: '01. Skill Gap Assessment', description: 'Evaluate current participant capabilities and target learning outcomes.' },
      { phase: '02. Customized Syllabus Design', description: 'Curate practical modules, lab assignments, and real-world milestones.' },
      { phase: '03. Interactive Sessions & Labs', description: 'Deliver live coding sessions, architectural walkthroughs, and guided pair programming.' },
      { phase: '04. Project Review & Feedback', description: 'Conduct senior engineer code reviews on student project submissions.' },
      { phase: '05. Assessment & Certification', description: 'Verify skill mastery through practical capstone assessments.' }
    ],
    technologies: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Git', 'Docker', 'AI APIs'],
    faqs: [
      {
        question: 'Are classes lecture-based or hands-on?',
        answer: 'Our training is 80% hands-on. Participants write real code, debug edge cases, configure tools, and build working applications under guidance.'
      },
      {
        question: 'Can you customize training for our internal company tech stack?',
        answer: 'Yes. We frequently build customized corporate upskilling programs aligned directly with your team’s frameworks, architecture patterns, and tools.'
      }
    ]
  },
  {
    id: 'robotics',
    slug: 'robotics',
    title: 'Robotics & Emerging Technologies',
    category: 'Software',
    tagline: 'Intelligent automation, edge compute telemetry, and embedded hardware-software integration.',
    summary: 'We architect and develop software layers that connect physical systems with intelligent cloud backends. From autonomous robotic perception pipelines and industrial IoT sensor fleets to real-time embedded telemetry, we bridge physical operations with digital intelligence.',
    problemStatement: 'Organizations deploying robotics and smart industrial hardware frequently encounter severe integration bottlenecks: fragmented communication protocols, latency spikes, unreliable edge-to-cloud telemetry, and lack of unified control dashboards.',
    capabilities: [
      {
        title: 'Robotic Control & Perception Software',
        description: 'Engineering the software layers coordinating robotic navigation, spatial mapping, and sensor telemetry.',
        points: ['ROS/ROS2 integration and middleware bridges', 'Computer vision and camera telemetry pipelines', 'Deterministic state machines for hardware safety']
      },
      {
        title: 'Industrial IoT & Edge Telemetry',
        description: 'Connecting sensor networks and shop floor machines into real-time operational streams.',
        points: ['MQTT, Modbus, and OPC-UA protocol drivers', 'Sub-second WebSocket telemetry streaming', 'Edge data normalization and local fail-safe buffering']
      },
      {
        title: 'Autonomous System Teleoperation',
        description: 'Building secure web control cockpits for monitoring and teleoperating remote autonomous units.',
        points: ['Low-latency WebRTC video and sensor feeds', 'Gamepad and touchscreen teleoperation UX', 'Hardware health alarms and automated failover']
      },
      {
        title: 'Digital Twins & Simulation Bridges',
        description: 'Creating virtual representations of physical lines to simulate throughput and validate robotic routines.',
        points: ['3D spatial visualization and telemetry overlays', 'Predictive cycle time simulation', 'Synthetic benchmark data generation']
      }
    ],
    useCases: [
      {
        title: 'Autonomous Warehouse Rover Telemetry Fleet',
        description: 'Centralized control room web interface tracking status, battery voltage, and obstacle maps for 24 automated transport units.',
        outcome: '99.9% telemetry uptime with sub-100ms status refresh and automated dispatch.'
      }
    ],
    deliverySteps: [
      { phase: '01. Hardware Protocol Audit', description: 'Analyze sensor interfaces, fieldbuses, safety envelopes, and bandwidth limits.' },
      { phase: '02. Edge Gateway Architecture', description: 'Design containerized edge drivers and secure TLS messaging queues.' },
      { phase: '03. Telemetry Stream & Control UI', description: 'Build responsive web dashboards with live charting and command queues.' },
      { phase: '04. Safety & Latency Benchmark', description: 'Execute rigorous hardware-in-the-loop tests under network throttle conditions.' },
      { phase: '05. Deployment & Field Validation', description: 'Deploy to factory floor edge nodes with remote OTA update capability.' }
    ],
    technologies: ['ROS2', 'Python', 'C++', 'MQTT', 'WebSockets', 'WebRTC', 'React', 'Docker Edge'],
    faqs: [
      {
        question: 'Do you design custom mechanical hardware or software systems?',
        answer: 'We specialize in the software, firmware integration, and cloud control layers that interface with standard industrial robots, microcontrollers, and IoT sensor hardware.'
      },
      {
        question: 'How do you handle connectivity dropouts on remote autonomous devices?',
        answer: 'We engineer edge-first architectures with local SQLite/buffer queues that record telemetry during disconnects and automatically synchronize once connection is restored.'
      }
    ]
  },
  {
    id: 'website-development',
    slug: 'website-development',
    title: 'Website Design & Development',
    category: 'Experiences',
    tagline: 'High-performance corporate flagships, responsive interfaces, and custom web applications.',
    summary: 'We design and develop modern, responsive websites and powerful web applications that turn your brand vision into an inspiring digital experience. Engineered for sub-second load times, technical SEO dominance, and accessibility compliance.',
    problemStatement: 'Businesses lose qualified opportunities due to outdated, bloated template websites that load slowly, fail on mobile screens, and cannot scale with complex integration requirements.',
    capabilities: [
      {
        title: 'Corporate Web Flagships',
        description: 'Bespoke web platforms built on modern React and Next.js foundations that project authority and convert high-value buyers.',
        points: ['Clean modular TypeScript architecture', 'Custom component design systems', 'Multilingual and regional content capabilities']
      },
      {
        title: 'Core Web Vitals Optimization',
        description: 'Targeting 98+ Lighthouse scores with sub-800ms Largest Contentful Paint (LCP) and zero layout shift.',
        points: ['Asset compression and edge caching', 'Critical CSS extraction and SSR', 'Strict DOM efficiency audits']
      },
      {
        title: 'Interactive Web Portals',
        description: 'Authenticated customer client workspaces, supplier portals, and interactive product catalogs.',
        points: ['Secure JWT/OAuth session management', 'Responsive multi-device layouts', 'Real-time state and database syncing']
      },
      {
        title: 'CMS & Editorial Tooling',
        description: 'Headless CMS implementations that empower marketing teams to publish campaigns rapidly without engineering bottlenecks.',
        points: ['Sanity, Strapi, and headless WordPress', 'Structured Schema.org JSON-LD data', 'Automated sitemap and metadata pipelines']
      }
    ],
    useCases: [
      {
        title: 'Enterprise Corporate Platform',
        description: 'Full redesign and Next.js re-platforming for a global technology consultancy requiring sub-second performance.',
        outcome: 'Reduced mobile bounce rate by 54% and increased qualified contact form submissions by 82%.'
      }
    ],
    deliverySteps: [
      { phase: '01. Discovery & Sitemap', description: 'Analyze business benchmarks, customer user journeys, and technical dependencies.' },
      { phase: '02. Wireframing & Design', description: 'Develop WCAG AA compliant responsive Figma prototypes and design token systems.' },
      { phase: '03. Frontend Engineering', description: 'Build responsive components in TypeScript and Tailwind CSS with rigorous unit testing.' },
      { phase: '04. API & CMS Integration', description: 'Wire headless CMS schemas, contact endpoints, and third-party tracking scripts.' },
      { phase: '05. Production Launch', description: 'Execute zero-downtime DNS cutover with TLS certificates and Core Web Vitals monitoring.' }
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'GraphQL', 'Sanity', 'Node.js'],
    faqs: [
      {
        question: 'Do you use off-the-shelf WordPress themes or custom code?',
        answer: 'We build 100% custom, bespoke codebases engineered specifically for your business requirements. This guarantees clean code, rapid speeds, and complete intellectual property ownership.'
      },
      {
        question: 'How do you guarantee website performance and speed?',
        answer: 'We enforce strict Core Web Vitals targets (<1s LCP, 0 CLS) through modern build tooling, asset optimization, code-splitting, and edge CDN distribution.'
      }
    ]
  },
  {
    id: 'ecommerce-development',
    slug: 'ecommerce-development',
    title: 'E-commerce Development',
    category: 'Experiences',
    tagline: 'Launch scalable digital storefronts with seamless checkouts and high conversion rates.',
    summary: 'We build high-converting, scalable e-commerce systems with modern product catalog experiences, frictionless multi-currency checkouts, and automated inventory pipelines.',
    problemStatement: 'Legacy monolithic e-commerce platforms suffer from checkout drop-offs, slow mobile pages, and fragile catalog synchronization that bottlenecks revenue growth.',
    capabilities: [
      {
        title: 'Headless Commerce Architecture',
        description: 'Decoupled storefronts delivering instant page transitions and high mobile checkout conversion.',
        points: ['Shopify Plus Storefront API & custom commerce', 'Sub-200ms page transitions', 'Dynamic basket & persistent user carts']
      },
      {
        title: 'Payment Gateway Integration',
        description: 'PCI-DSS compliant multi-currency payment flows supporting Apple Pay, Google Pay, Stripe, and localized providers.',
        points: ['Stripe Elements & 1-click checkout', 'Fraud detection and 3D Secure 2', 'Automated receipt and tax calculation']
      },
      {
        title: 'B2B & Wholesale Portals',
        description: 'Custom B2B wholesale platforms with tiered pricing, volume discounts, and purchase-order workflows.',
        points: ['Custom price books per customer tier', 'Credit limit and invoice payment rules', 'Bulk CSV ordering and catalog search']
      }
    ],
    useCases: [
      {
        title: 'Omnichannel D2C Brand Store',
        description: 'High-speed headless commerce migration for an international apparel brand with 12,000 SKUs.',
        outcome: '+38% increase in mobile checkout completions and 1.8s faster average page load speed.'
      }
    ],
    deliverySteps: [
      { phase: '01. Catalog & Checkout Audit', description: 'Map SKU taxonomy, shipping rules, tax engines, and gateway requirements.' },
      { phase: '02. Storefront UX Engineering', description: 'Design frictionless shopping cart journeys and mobile-optimized product pages.' },
      { phase: '03. Headless Core Build', description: 'Implement cart state management, product filtering, and payment gateways.' },
      { phase: '04. End-to-End Test Orders', description: 'Validate authorization, capture, refunds, and webhook reconciliation in sandbox.' },
      { phase: '05. Go-Live & Scaling', description: 'Transition production DNS with real-time conversion monitoring.' }
    ],
    technologies: ['Shopify Storefront API', 'Stripe', 'React', 'Next.js', 'Tailwind CSS', 'Redis', 'PostgreSQL'],
    faqs: [
      {
        question: 'Can you migrate our existing store data without losing orders or customer history?',
        answer: 'Yes. We execute automated zero-loss migration scripts that preserve customer accounts, historical order histories, SKU variants, and SEO redirect URLs.'
      }
    ]
  },
  {
    id: 'custom-software-development',
    slug: 'custom-software-development',
    title: 'Custom Software Development',
    category: 'Software',
    tagline: 'Bespoke enterprise applications, operational portals, and secure workflow automation.',
    summary: 'We build tailored software applications designed specifically around your operational logic, eliminating manual spreadsheets and connecting disparate enterprise systems.',
    problemStatement: 'Off-the-shelf software forces businesses to adapt to rigid workflows, incurs ballooning per-seat subscription costs, and leaves critical business data trapped in silos.',
    capabilities: [
      {
        title: 'Enterprise Workflow Systems',
        description: 'Centralized web platforms consolidating internal operations, multi-stage approvals, and reporting.',
        points: ['Strict TypeScript type safety', 'Multi-role permission governance (RBAC)', 'Audit logging and tamper-evident history']
      },
      {
        title: 'System Integration & Middleware',
        description: 'Connecting legacy databases, ERP systems, and modern third-party cloud APIs into unified pipelines.',
        points: ['Event-driven messaging and webhooks', 'Automated data validation and ETL', 'Resilient retry queues and error monitoring']
      }
    ],
    useCases: [
      {
        title: 'Operations & Maintenance Portal',
        description: 'Custom portal managing 1,400+ physical assets with automated preventive maintenance work-orders.',
        outcome: 'Eliminated 18 hours/week of manual spreadsheet reconciliation and prevented scheduling collisions.'
      }
    ],
    deliverySteps: [
      { phase: '01. Workflow Mapping', description: 'Interview operations leaders and document exact data lifecycle requirements.' },
      { phase: '02. Database & API Architecture', description: 'Design normalized SQL schemas and strongly-typed API endpoints.' },
      { phase: '03. Full-Stack Implementation', description: 'Build responsive interface portals and resilient backend microservices.' },
      { phase: '04. Security & Role Audits', description: 'Verify authorization barriers, OWASP security, and data encryption.' },
      { phase: '05. Deployment & Handover', description: 'Deliver complete codebase, documentation, and operational team training.' }
    ],
    technologies: ['Node.js', 'TypeScript', 'React', 'PostgreSQL', 'Express', 'Docker', 'Prisma', 'Tailwind CSS'],
    faqs: [
      {
        question: 'Who owns the custom software codebase once development is complete?',
        answer: 'You retain 100% intellectual property ownership of the codebase, documentation, and deployment infrastructure. We do not charge ongoing proprietary licensing fees.'
      }
    ]
  },
  {
    id: 'mobile-app-development',
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    category: 'Experiences',
    tagline: 'Intuitive iOS & Android applications built for native speed, ergonomics, and business scale.',
    summary: 'We architect and build high-performance native and cross-platform mobile apps using React Native, Flutter, Swift, and Kotlin. Featuring offline synchronization, biometric security, and push notification infrastructure.',
    problemStatement: 'Unreliable mobile applications with high crash rates, clunky touch interactions, and sluggish loading damage customer loyalty and app store rankings.',
    capabilities: [
      {
        title: 'Cross-Platform App Engineering',
        description: 'Single, clean codebase powering both iOS and Android apps with 60 FPS native interaction performance.',
        points: ['React Native & Flutter architectures', 'Native module bridging for hardware access', 'Fluid gesture animations and haptics']
      },
      {
        title: 'Offline-First Synchronization',
        description: 'Local caching and background sync ensuring field teams and customers can work smoothly without active internet connectivity.',
        points: ['SQLite & WatermelonDB integration', 'Background sync conflict resolution', 'Instant optimistic UI updates']
      }
    ],
    useCases: [
      {
        title: 'On-Demand Field Inspection Client',
        description: 'Mobile client for 120+ field inspectors logging photographic evidence and asset reports offline.',
        outcome: '99.98% crash-free session rate across 40,000+ inspection logs.'
      }
    ],
    deliverySteps: [
      { phase: '01. Mobile UX Prototyping', description: 'Design tactile mobile wireframes adhering to Apple HIG and Google Material 3 standards.' },
      { phase: '02. Core Native Engineering', description: 'Build screens, state architecture, and offline data storage.' },
      { phase: '03. Hardware & API Integration', description: 'Configure camera, geolocation, biometric auth, and push tokens.' },
      { phase: '04. App Store Submission', description: 'Manage TestFlight beta distributions and final App Store / Play Store compliance approvals.' }
    ],
    technologies: ['React Native', 'TypeScript', 'iOS Swift', 'Android Kotlin', 'Expo', 'SQLite', 'Firebase Cloud Messaging'],
    faqs: [
      {
        question: 'Do you assist with publishing to Apple App Store and Google Play?',
        answer: 'Yes. We manage the entire store submission process, including metadata, screenshots, privacy declarations, and review communications until approved.'
      }
    ]
  },
  {
    id: 'generative-ai',
    slug: 'generative-ai',
    title: 'Generative AI Solutions',
    category: 'AI & Data',
    tagline: 'Private LLM applications, autonomous agents, and contextual enterprise copilots.',
    summary: 'We build production-grade Generative AI applications tailored to your proprietary knowledge base. From internal research assistants to automated customer service agents, engineered with strict hallucination guardrails and zero public data leakage.',
    problemStatement: 'Enterprises struggle to deploy Generative AI due to fears of proprietary data leaking into public foundation models, unpredictable hallucinations, and lack of citation traceability.',
    capabilities: [
      {
        title: 'Private Retrieval-Augmented Generation (RAG)',
        description: 'Grounding large language models in your private company PDFs, databases, and SOPs with 100% verifiable citations.',
        points: ['Hybrid vector embeddings + BM25 keyword search', 'Cross-encoder semantic reranking', 'Deterministic document source attribution']
      },
      {
        title: 'Autonomous Workflow Agents',
        description: 'Tool-calling agents capable of querying internal databases, generating reports, and triggering transactional workflows.',
        points: ['Function-calling and structured JSON output', 'Multi-step planning and evaluation loops', 'Human-in-the-loop review approvals']
      },
      {
        title: 'Security & PII Masking Guardrails',
        description: 'Automated input sanitation preventing prompt injections and anonymizing sensitive customer data before inference.',
        points: ['Automated PII scrubbing and tokenization', 'Content moderation and safety thresholds', 'Enterprise SOC-2 compliance alignment']
      }
    ],
    useCases: [
      {
        title: 'Internal Engineering & Legal Copilot',
        description: 'RAG copilot indexing 14,000+ pages of technical architecture specifications and client master agreements.',
        outcome: 'Saved 6.5 hours/week per senior engineer with 99.4% citation accuracy.'
      }
    ],
    deliverySteps: [
      { phase: '01. Knowledge Corpus Audit', description: 'Inspect document schemas, data quality, chunking strategies, and security barriers.' },
      { phase: '02. Vector Pipeline & Embeddings', description: 'Configure embedding models, vector database indexing, and metadata tags.' },
      { phase: '03. Reranker & Guardrail Build', description: 'Implement cross-encoder reranking, prompt templates, and PII masking.' },
      { phase: '04. Grounding & Evaluation', description: 'Benchmark factual recall and latency against gold-standard evaluation datasets.' },
      { phase: '05. Production Rollout', description: 'Deploy private inference APIs with telemetry monitoring and rate limiting.' }
    ],
    technologies: ['Gemini 2.5/3', 'Python', 'TypeScript', 'LangChain', 'ChromaDB', 'Pinecone', 'PostgreSQL pgvector'],
    faqs: [
      {
        question: 'Does our company data train public AI models?',
        answer: 'Never. We deploy enterprise-grade zero-retention API contracts and private VPC endpoints ensuring your data is never used for foundation model training.'
      }
    ]
  },
  {
    id: 'robotics-emerging-tech',
    slug: 'robotics-emerging-tech',
    title: 'Robotics & Emerging Technologies',
    category: 'Software',
    tagline: 'Autonomous software systems, edge IoT telemetry, and digital twin simulation.',
    summary: 'We build the software, perception pipelines, and cloud telemetry platforms that power autonomous robotics, edge industrial devices, and spatial simulation environments.',
    problemStatement: 'Hardware teams often lack web-native software expertise to build responsive cloud teleoperation dashboards, manage fleet over-the-air updates, and visualize real-time robot telemetry.',
    capabilities: [
      {
        title: 'Robotic Fleet Management Portals',
        description: 'Web-based control rooms tracking fleet health, obstacle alerts, battery levels, and mission dispatch in real time.',
        points: ['WebSockets & WebRTC low-latency streaming', 'Interactive spatial 2D/3D map visualization', 'Mission queuing and emergency stop controls']
      },
      {
        title: 'Edge Gateway Telemetry Software',
        description: 'Lightweight containerized drivers communicating across industrial protocols to stream metrics securely.',
        points: ['MQTT, Modbus, and ROS2 bridging', 'Local buffer caching during connectivity losses', 'Automated over-the-air (OTA) updates']
      }
    ],
    useCases: [
      {
        title: 'Autonomous Rover Teleoperation Suite',
        description: 'Sub-100ms web control interface monitoring autonomous transport vehicles across industrial fulfillment centers.',
        outcome: '99.9% telemetry uptime and real-time obstacle avoidance telemetry visualization.'
      }
    ],
    deliverySteps: [
      { phase: '01. Protocol Review', description: 'Audit sensor interfaces, messaging frequencies, and network constraints.' },
      { phase: '02. Edge Broker Setup', description: 'Deploy secure MQTT and WebRTC brokers with encrypted data streaming.' },
      { phase: '03. Web Control Room', description: 'Build responsive 3D visualization canvases and command dispatch boards.' },
      { phase: '04. Hardware Testing', description: 'Simulate high packet loss and verify automated recovery routines.' }
    ],
    technologies: ['ROS2', 'Python', 'C++', 'MQTT', 'WebSockets', 'WebRTC', 'React', 'Three.js'],
    faqs: [
      {
        question: 'Can you integrate with existing industrial robots?',
        answer: 'Yes. We bridge to standard ROS2 nodes, Modbus PLCs, and standard HTTP/MQTT industrial gateways.'
      }
    ]
  },
  {
    id: 'seo',
    slug: 'seo',
    title: 'Search Engine Optimization (SEO)',
    category: 'Growth & Advisory',
    tagline: 'Technical SEO architectures, structured data, and high-authority search visibility.',
    summary: 'We engineer high-performance technical SEO foundations that elevate your search rankings. From Core Web Vitals optimization and crawl efficiency to semantic Schema.org structured data and content architecture.',
    problemStatement: 'High-quality websites fail to rank because of hidden JavaScript rendering bottlenecks, missing Schema.org structured data, crawl errors, and poorly structured site taxonomies.',
    capabilities: [
      {
        title: 'Technical & Crawlability Audits',
        description: 'Eliminating indexation barriers, canonical errors, duplicate content, and redirect chains.',
        points: ['Server-side rendering (SSR) verification', 'XML sitemap and robots.txt governance', 'Crawl budget and index status audits']
      },
      {
        title: 'Schema.org Structured Data',
        description: 'Implementing rich JSON-LD data graphs enabling Google rich snippets, FAQs, and product previews.',
        points: ['Organization, LocalBusiness, and WebSite schemas', 'Product, Article, and FAQ rich snippet markup', 'BreadcrumbList and sitelink search box markup']
      },
      {
        title: 'Core Web Vitals Engineering',
        description: 'Optimizing speed metrics that directly influence Google search rank algorithms.',
        points: ['Sub-800ms LCP and 0 Cumulative Layout Shift', 'First Input Delay and Interaction to Next Paint (INP)', 'Mobile usability and viewport audits']
      }
    ],
    useCases: [
      {
        title: 'B2B SaaS Technical SEO Architecture',
        description: 'Complete technical SEO restructuring for a mid-market enterprise SaaS company.',
        outcome: '+210% increase in organic non-brand search impressions and 14 first-page commercial keyword rankings within 90 days.'
      }
    ],
    deliverySteps: [
      { phase: '01. Comprehensive Technical Audit', description: 'Inspect site indexation, crawl logs, DOM render speeds, and structured data.' },
      { phase: '02. Architecture & Taxonomy Mapping', description: 'Re-align URL paths, breadcrumbs, internal linking hubs, and canonical tags.' },
      { phase: '03. Code-Level Implementation', description: 'Inject clean Schema.org JSON-LD scripts and optimize asset delivery.' },
      { phase: '04. Search Console & Telemetry Tracking', description: 'Submit updated sitemaps and monitor Google Search Console indexing rates.' }
    ],
    technologies: ['Schema.org JSON-LD', 'Google Search Console', 'Ahrefs', 'Next.js SSR', 'Lighthouse', 'Screaming Frog'],
    faqs: [
      {
        question: 'How long does it take to see organic search ranking improvements?',
        answer: 'Technical fixes (such as fixing indexation errors, Schema.org additions, and Core Web Vitals) are typically detected by Google crawlers within 2 to 4 weeks, with ranking momentum compounding over 2 to 6 months.'
      }
    ]
  },
  {
    id: 'social-media-marketing',
    slug: 'social-media-marketing',
    title: 'Social Media Marketing',
    category: 'Growth & Advisory',
    tagline: 'Strategic B2B brand storytelling, organic engagement engines, and paid audience growth.',
    summary: 'We build data-driven social media growth strategies for technology companies and ambitious brands. Combining creative storytelling, executive thought leadership, and targeted paid acquisition campaigns.',
    problemStatement: 'Brands waste advertising spend and organic effort on vanity metrics that generate noise without delivering qualified business leads or talent engagement.',
    capabilities: [
      {
        title: 'B2B LinkedIn & Thought Leadership',
        description: 'Positioning founders and engineering leaders as authoritative voices in their vertical.',
        points: ['Technical case study storytelling', 'Editorial calendar and engagement strategies', 'Executive ghostwriting and insights amplification']
      },
      {
        title: 'Paid Acquisition & Retargeting',
        description: 'High-conversion paid campaigns targeting verified decision-makers across LinkedIn, Meta, and Google.',
        points: ['Custom audience pixel retargeting', 'High-CTR visual creative testing', 'Conversion attribution modeling']
      }
    ],
    useCases: [
      {
        title: 'Technology Brand Audience Expansion',
        description: 'Strategic LinkedIn thought leadership campaign for an engineering services practice.',
        outcome: '+340% increase in verified organic page views and 48 enterprise inquiry conversations initiated.'
      }
    ],
    deliverySteps: [
      { phase: '01. Audience Personas', description: 'Define target ICPs, industry segments, and competitor positioning.' },
      { phase: '02. Content Pillar Strategy', description: 'Establish editorial themes, technical case breakdowns, and publishing cadences.' },
      { phase: '03. Campaign Production', description: 'Produce branded graphics, carousel decks, and video teasers.' },
      { phase: '04. Optimization & Attribution', description: 'Review weekly engagement telemetry and optimize budget allocation.' }
    ],
    technologies: ['LinkedIn Campaign Manager', 'Meta Business Suite', 'Google Analytics 4', 'Canva', 'Figma'],
    faqs: [
      {
        question: 'Do you create the creative visual assets and copy?',
        answer: 'Yes. Our creative team writes technical copy, designs branded carousel slides, and produces short-form video assets aligned with your brand guidelines.'
      }
    ]
  },
  {
    id: 'cloud-computing',
    slug: 'cloud-computing',
    title: 'Cloud Computing',
    category: 'Cloud & Security',
    tagline: 'Scalable cloud architectures on AWS, Azure, and Google Cloud with guaranteed reliability.',
    summary: 'We architect, configure, and maintain scalable cloud environments tailored to your performance and budget needs. Engineered for high availability, zero single points of failure, and strict cost governance.',
    problemStatement: 'Fragile on-premise servers and poorly configured cloud instances lead to unplanned downtime, security vulnerabilities, and runaway monthly hosting bills.',
    capabilities: [
      {
        title: 'Multi-Cloud Architecture (AWS, Azure, GCP)',
        description: 'Design of fault-tolerant cloud environments that scale automatically with demand surges.',
        points: ['Multi-Availability-Zone high availability', 'Serverless microservices and container orchestration', 'VPC network isolation and secure bastion subnets']
      },
      {
        title: 'Cloud FinOps & Cost Governance',
        description: 'Auditing and eliminating redundant cloud spend to reduce monthly hosting invoices by 30-50%.',
        points: ['Right-sizing compute instances', 'Reserved instance and savings plan planning', 'Automated idle resource teardown scripts']
      }
    ],
    useCases: [
      {
        title: 'High-Traffic Cloud Modernization',
        description: 'Migration from single-server hosting to multi-AZ auto-scaling AWS infrastructure.',
        outcome: 'Achieved 99.99% uptime during peak holiday traffic while reducing monthly cloud spend by 38%.'
      }
    ],
    deliverySteps: [
      { phase: '01. Workload Audit', description: 'Analyze compute, database, network throughput, and redundancy requirements.' },
      { phase: '02. Cloud Architecture Blueprint', description: 'Design VPC topologies, security groups, and automated scaling policies.' },
      { phase: '03. Infrastructure as Code (IaC)', description: 'Write reproducible Terraform or CloudFormation scripts.' },
      { phase: '04. Migration & Validation', description: 'Execute zero-downtime database replication and DNS transition.' }
    ],
    technologies: ['AWS', 'Google Cloud (GCP)', 'Microsoft Azure', 'Terraform', 'Docker', 'Kubernetes', 'Cloudflare'],
    faqs: [
      {
        question: 'Which cloud provider do you recommend?',
        answer: 'We remain vendor-agnostic and recommend AWS, GCP, or Azure based on your existing stack, team skills, compliance requirements, and budget.'
      }
    ]
  },
  {
    id: 'devops',
    slug: 'devops',
    title: 'DevOps & CI/CD Automation',
    category: 'Cloud & Security',
    tagline: 'Automated software delivery pipelines, containerization, and infrastructure reliability.',
    summary: 'We build automated CI/CD deployment pipelines that turn code commits into production releases with zero downtime. Incorporating automated security scanning, container orchestration, and continuous telemetry.',
    problemStatement: 'Manual deployment processes cause release anxiety, frequent production outages, delayed feature releases, and environment configuration drift.',
    capabilities: [
      {
        title: 'Automated CI/CD Pipelines',
        description: 'GitHub Actions and GitLab CI workflows that automate unit tests, vulnerability scans, and deployments.',
        points: ['Zero-downtime blue/green and canary deployments', 'Automated regression and linting gates', 'Rollback triggers upon health check failure']
      },
      {
        title: 'Kubernetes & Docker Containerization',
        description: 'Packaging applications into lightweight, reproducible containers orchestrated via Kubernetes.',
        points: ['Helm chart management and GitOps workflows', 'Ingress controller and SSL termination', 'Automated horizontal pod autoscaling (HPA)']
      }
    ],
    useCases: [
      {
        title: 'Automated SaaS Deployment Pipeline',
        description: 'Modernizing release workflows for a B2B SaaS platform from monthly manual releases to multiple daily zero-downtime releases.',
        outcome: 'Deployment duration reduced from 4 hours to 3.2 minutes with zero customer-facing downtime.'
      }
    ],
    deliverySteps: [
      { phase: '01. Pipeline Audit', description: 'Analyze build dependencies, test suites, and environment variables.' },
      { phase: '02. Containerization', description: 'Craft multi-stage Dockerfiles optimized for tiny footprint and rapid build caching.' },
      { phase: '03. CI/CD Orchestration', description: 'Configure automated GitHub Actions workflows with encrypted secret management.' },
      { phase: '04. Health Checks & Alerting', description: 'Configure Slack/email alerting on pipeline failures or pod crashes.' }
    ],
    technologies: ['GitHub Actions', 'Docker', 'Kubernetes', 'Terraform', 'ArgoCD', 'Prometheus', 'Grafana'],
    faqs: [
      {
        question: 'Can you set up CI/CD without interrupting our live development team?',
        answer: 'Yes. We build and test the automated pipeline in parallel staging environments and only cut over once verified end-to-end.'
      }
    ]
  },
  {
    id: 'cloud-migration',
    slug: 'cloud-migration',
    title: 'Cloud Architecture & Migration',
    category: 'Cloud & Security',
    tagline: 'Zero-downtime legacy migrations, database replication, and modern cloud re-platforming.',
    summary: 'We guide organizations through seamless cloud migrations from legacy on-premise hardware or outdated VPS providers to modern, secure hyperscale cloud platforms.',
    problemStatement: 'Migrating legacy mission-critical applications is fraught with risks of data corruption, unexpected downtime, and broken database relationships.',
    capabilities: [
      {
        title: 'Zero-Downtime Data Migration',
        description: 'Continuous database replication and incremental data sync ensuring zero business disruption.',
        points: ['Point-in-time database replication', 'Dual-write validation and checksum auditing', 'Immediate rollback safety gates']
      },
      {
        title: 'Monolith to Cloud-Native Re-platforming',
        description: 'Refactoring monolithic legacy apps into resilient, containerized services.',
        points: ['Decoupling shared databases and session state', 'Stateless app server configurations', 'Managed cloud database integration (RDS/Cloud SQL)']
      }
    ],
    useCases: [
      {
        title: 'Hospitality Management Cloud Migration',
        description: 'Migrating 800GB of historical transactional records from an aging physical server to AWS RDS.',
        outcome: 'Completed migration over a 45-minute scheduled off-peak window with 100% data integrity.'
      }
    ],
    deliverySteps: [
      { phase: '01. Discovery & Dependency Mapping', description: 'Map application dependencies, network ports, databases, and cron jobs.' },
      { phase: '02. Target Architecture Build', description: 'Provision target cloud VPC, databases, and container registries via IaC.' },
      { phase: '03. Rehearsal & Dry Run', description: 'Execute full data migration rehearsal in staging to measure timing and verify checksums.' },
      { phase: '04. Production Cutover', description: 'Execute final delta sync, DNS transition, and post-cutover validation.' }
    ],
    technologies: ['AWS DMS', 'PostgreSQL', 'Terraform', 'Docker', 'Linux', 'Cloudflare', 'Rsync'],
    faqs: [
      {
        question: 'Will our business experience downtime during the migration?',
        answer: 'We design our migrations using continuous background delta replication, allowing cutover to occur in minutes or during off-peak windows with zero loss of customer data.'
      }
    ]
  }
];
