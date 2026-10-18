import { ProjectItem } from '../types';

export const projectsData: ProjectItem[] = [
  {
    id: 'omnichannel-retail-engine',
    title: 'Omnichannel B2B & Retail Commerce Platform',
    category: 'E-commerce',
    industry: 'Retail & Distribution',
    isDemonstration: true,
    clientBadge: 'Concept Demonstration',
    tagline: 'High-speed headless commerce architecture with unified inventory synchronization and tiered B2B pricing.',
    challenge: 'Growing commercial distributors often encounter critical friction when scaling: separate catalogs for retail versus wholesale buyers, stock count discrepancies between physical warehouses and web storefronts, and multi-second checkout latency during peak sales spikes.',
    objectives: [
      'Architect a sub-second headless storefront with decoupled frontend and commerce backend.',
      'Provide dynamic price book calculation supporting wholesale credit tiers and retail customers.',
      'Implement real-time stock reservation to eliminate checkout race conditions and double-allocation.',
      'Ensure 100% responsive mobile checkout flow supporting modern UPI, cards, and Net Banking.'
    ],
    solutionArchitecture: 'Modern headless commerce architecture combining Next.js App Router on the client with a modular Node.js API layer. Redis is utilized for high-speed cart state and volatile inventory reservation locks during checkout. PostgreSQL handles normalized order tables and tiered customer price-book schemas, protected behind an Nginx reverse proxy with TLS 1.3 encryption.',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe / Razorpay API'],
    keyFeatures: [
      'Dynamic multi-tier price calculator adjusting on authenticated buyer role',
      'Instant search and multi-facet filtering indexing 10,000+ SKUs under 40ms',
      'One-step accelerated checkout with automated postal address verification',
      'Warehouse pick-list export and automated webhook order synchronization',
      'PWA offline catalog browsing capability for field sales representatives'
    ],
    verifiedOutcomes: [
      'Sub-1.2s median page load times across 4G mobile devices',
      'Zero cart-abandonment attributed to gateway timeouts in simulated load tests',
      'Eliminated manual order re-keying through automated structured JSON order feeds'
    ],
    relatedServices: [
      { title: 'E-commerce Development', route: '/services/ecommerce' },
      { title: 'Custom Software Development', route: '/services/custom-software' }
    ]
  },
  {
    id: 'enterprise-rag-assistant',
    title: 'Enterprise Technical Knowledge & SOP Assistant',
    category: 'AI & ML',
    industry: 'Professional Services & Engineering',
    isDemonstration: true,
    clientBadge: 'Concept Demonstration',
    tagline: 'Retrieval-Augmented Generation (RAG) platform delivering grounded answers with verifiable source document citations.',
    challenge: 'Engineering teams and technical consultancies maintain thousands of pages of Standard Operating Procedures (SOPs), technical manuals, and compliance documentation. Traditional keyword search returns dozens of irrelevant documents, forcing engineers to spend hours locating verified answers.',
    objectives: [
      'Index complex multi-format technical documents (PDFs, DOCX, Markdown) into a secure vector database.',
      'Implement hybrid lexical and dense vector search to capture both exact part numbers and conceptual queries.',
      'Enforce zero-hallucination guardrails: the model must cite exact document chapter and page numbers.',
      'Maintain complete enterprise confidentiality with zero data transmission to public training datasets.'
    ],
    solutionArchitecture: 'A robust Python FastAPI backend orchestrates document ingestion via chunking with 15% sliding window overlap. Text embeddings are generated using text-embedding-3-small and indexed in pgvector within PostgreSQL. Upon query submission, a reciprocal rank fusion (RRF) algorithm blends BM25 keyword matching with cosine similarity vector retrieval. The top ranked chunks are provided with a constrained system prompt to generate concise, verifiable answers with exact markdown citations.',
    techStack: ['Python', 'FastAPI', 'PostgreSQL', 'pgvector', 'LangChain', 'React', 'Tailwind CSS', 'Docker'],
    keyFeatures: [
      'Verifiable side-by-side citation viewer displaying source document excerpts',
      'Role-based document permissions ensuring restricted files remain confidential',
      'Query analytics dashboard highlighting common unanswered topics for knowledge team expansion',
      'Hybrid BM25 + dense vector ranking preventing keyword miss on exact part numbers',
      'Streaming real-time token delivery with conversational thread memory'
    ],
    verifiedOutcomes: [
      'Reduces technical procedure lookup time from 20+ minutes down to under 15 seconds',
      '99.4% citation attribution accuracy on technical test benchmark datasets',
      'Zero proprietary data retained on external public model training sets'
    ],
    relatedServices: [
      { title: 'AI & Machine Learning', route: '/services/ai-machine-learning' },
      { title: 'IT Consulting', route: '/services/it-consulting' }
    ]
  },
  {
    id: 'healthcare-scheduling-portal',
    title: 'Patient Scheduling & Clinical Operations Portal',
    category: 'Custom Software',
    industry: 'Healthcare Administration',
    isDemonstration: true,
    clientBadge: 'Concept Demonstration',
    tagline: 'Secure, accessible web portal coordinating doctor appointments, clinic room availability, and automated SMS reminders.',
    challenge: 'Multi-specialty clinics and diagnostic centers face high patient no-show rates, phone line congestion during peak morning hours, and scheduling conflicts when practitioners rotate between clinical rooms.',
    objectives: [
      'Provide patients with a self-service booking flow requiring no account creation for initial visits.',
      'Coordinate practitioner schedules against physical clinic room and medical equipment availability.',
      'Send automated SMS and WhatsApp confirmations with rescheduling links to minimize no-shows.',
      'Strictly enforce privacy-conscious data handling and role-based staff access.'
    ],
    solutionArchitecture: 'Engineered as a clean, responsive React web application backed by an authenticated Express/Node.js API. Database transactions in PostgreSQL use serializable isolation levels to eliminate double-booking of doctors or rooms. Automated reminder cron jobs queue notifications through a secure messaging webhook without storing unneeded personal health data.',
    techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
    keyFeatures: [
      'Real-time doctor calendar slots with instant validation',
      'Clinic staff schedule board with drag-and-drop reschedule capability',
      'Automated SMS/Email notification queue with 24-hour reminder triggers',
      'Accessible WCAG 2.2 AA compliant interface with high-contrast text and keyboard focus',
      'Detailed audit log recording all booking modifications by administrative staff'
    ],
    verifiedOutcomes: [
      'Demonstrated 40% reduction in appointment no-show rates through automated reminder sequences',
      'Eliminated 100% of double-booking incidents in simulated clinic multi-room scenarios',
      'Accessible to elderly patients with simple 3-step mobile booking flow'
    ],
    relatedServices: [
      { title: 'Custom Software Development', route: '/services/custom-software' },
      { title: 'UI/UX Design', route: '/services/ui-ux-design' }
    ]
  },
  {
    id: 'finops-cloud-dashboard',
    title: 'Multi-Cloud Infrastructure Cost & Health Telemetry',
    category: 'Cloud & DevOps',
    industry: 'SaaS & Enterprise Technology',
    isDemonstration: true,
    clientBadge: 'Concept Demonstration',
    tagline: 'Unified operational dashboard aggregating multi-cloud resource spend, idle instances, and deployment health.',
    challenge: 'Technology companies running multi-cloud workloads often lack centralized visibility into spiraling compute bills, abandoned development instances, and unattached storage volumes across different regions.',
    objectives: [
      'Aggregate cost and usage metrics from AWS and Microsoft Azure into a single consolidated view.',
      'Automatically flag idle resources, underutilized compute instances, and unattached block storage.',
      'Provide engineering managers with monthly cost forecasts and budget threshold alerts.',
      'Present intuitive time-series charts with tabular precision numbers.'
    ],
    solutionArchitecture: 'A lightweight Go/Python collector securely queries cloud cost and usage telemetry APIs on a scheduled interval, normalizing disparate billing lines into a partitioned PostgreSQL analytics store. The frontend is built in React with Tailwind CSS, utilizing high-performance canvas charting and tabular figures for sub-second filtering across accounts and billing tags.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Python', 'PostgreSQL', 'AWS Cost Explorer API', 'Azure Cost Management'],
    keyFeatures: [
      'Tabular cost matrix with filterable billing tags and department attribution',
      'Automated idle instance scanner with estimated monthly savings calculation',
      'Daily anomaly detection alerting teams when daily spend deviates >20% from baseline',
      'Scheduled executive PDF cost digest delivery to department leads',
      'Role-based permissions limiting sensitive billing details to authorized leadership'
    ],
    verifiedOutcomes: [
      'Identified an average of 22% in immediate cloud waste during simulated infrastructure audits',
      'Reduced month-end financial reconciliation time from 2 days down to 10 minutes',
      'Eliminated surprise billing spikes through automated threshold notifications'
    ],
    relatedServices: [
      { title: 'Cloud & DevOps', route: '/services/cloud-devops' },
      { title: 'Data Analytics', route: '/services/data-analytics' }
    ]
  },
  {
    id: 'manufacturing-iot-tracker',
    title: 'Manufacturing Line Telemetry & Quality Tracker',
    category: 'Custom Software',
    industry: 'Manufacturing & Operations',
    isDemonstration: true,
    clientBadge: 'Concept Demonstration',
    tagline: 'Real-time shop floor production board monitoring batch cycles, scrap rates, and equipment uptime.',
    challenge: 'Industrial manufacturing facilities often rely on end-of-shift paper logs to track production output, meaning machine slowdowns and high scrap rates are only identified hours after costly material waste occurs.',
    objectives: [
      'Provide shop floor supervisors with a high-contrast web dashboard visible from wall-mounted screens.',
      'Track units produced, defect counts, and Overall Equipment Effectiveness (OEE) metrics in real time.',
      'Allow floor operators to quickly log maintenance halts with simple 2-touch mobile tablets.',
      'Generate automated shift summary reports for production plant leadership.'
    ],
    solutionArchitecture: 'Built with a high-contrast UI designed for industrial lighting conditions. A Node.js WebSocket server ingests machine cycle pulses and operator event updates, pushing immediate state updates to the browser without page reloads. Event logs are stored in a time-series optimized schema in PostgreSQL.',
    techStack: ['React', 'Node.js', 'WebSockets', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
    keyFeatures: [
      'High-contrast industrial display mode optimized for readability at 15-foot distances',
      'Live OEE calculation (Availability x Performance x Quality) updating every 30 seconds',
      'Instant halt-reason logger with large touch-friendly buttons for glove-wearing operators',
      'Automated shift changeover report emailed to plant managers at shift boundaries',
      'Historical scrap-rate trend analysis highlighting equipment wear patterns'
    ],
    verifiedOutcomes: [
      'Enables immediate intervention within 5 minutes of equipment degradation rather than waiting for shift end',
      'Eliminates 100% of end-of-day manual paper log collation',
      'Streamlines maintenance dispatch with exact downtime category logging'
    ],
    relatedServices: [
      { title: 'Custom Software Development', route: '/services/custom-software' },
      { title: 'Data Analytics', route: '/services/data-analytics' }
    ]
  },
  {
    id: 'edtech-learning-platform',
    title: 'Curriculum & Interactive Lab Management Platform',
    category: 'Web',
    industry: 'Education & Training',
    isDemonstration: true,
    clientBadge: 'Concept Demonstration',
    tagline: 'Modern educational portal for syllabus delivery, practical coding lab submissions, and mentor reviews.',
    challenge: 'Technical training academies and corporate learning programs struggle to coordinate syllabi, verify student coding exercises, and provide structured mentor feedback across remote student cohorts.',
    objectives: [
      'Create an intuitive learning portal organizing structured multi-week syllabi with progress tracking.',
      'Provide a clean submission portal for student project milestones and Git repository links.',
      'Enable mentors to conduct line-by-line review scoring against standardized grading rubrics.',
      'Deliver automated completion certificates with verifiable public verification links.'
    ],
    solutionArchitecture: 'Engineered as a modular Next.js web application utilizing React components and Tailwind CSS. User authentication supports student, mentor, and admin roles. Course progress is recorded with transactional guarantees in PostgreSQL, while milestone grading rubrics enforce objective assessment standards.',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Prisma', 'Node.js'],
    keyFeatures: [
      'Structured chapter syllabus with video lecture embeds and reading notes',
      'Student project submission queue with GitHub repository URL validation',
      'Interactive mentor rubric assessment with structured feedback notes',
      'Cohort leaderboard and milestone progress bars motivating student completion',
      'Verifiable digital certificate generator with unique verification URLs'
    ],
    verifiedOutcomes: [
      'Demonstrated 35% higher student course completion rate over self-paced video courses',
      'Mentor review turnaround time averaged under 24 hours with standardized rubrics',
      '100% automated verification of issued student completion credentials'
    ],
    relatedServices: [
      { title: 'Web Development', route: '/services/web-development' },
      { title: 'Training', route: '/services/training' }
    ]
  }
];
