import { CourseItem } from '../types';
import { COMPANY_CONTACT } from './companyInfo';
import { PRIMARY_PHONE, PRIMARY_PHONE_LINK, WHATSAPP_LINK } from '../constants/contact';

export const WHATSAPP_CONFIG = {
  number: PRIMARY_PHONE_LINK.replace('+', ''),
  displayNumber: PRIMARY_PHONE,
  baseUrl: WHATSAPP_LINK,
  isVerified: true,
};

/**
 * Helper to generate prefilled WhatsApp click-to-chat link for any course
 */
export function getCourseWhatsAppUrl(courseTitle?: string): string {
  if (!courseTitle) {
    const defaultMsg =
      'Hello IAMTECHNI, I would like to know more about your technology training programs and upcoming batches.';
    return `${WHATSAPP_CONFIG.baseUrl}?text=${encodeURIComponent(defaultMsg)}`;
  }

  const courseMsg = `Hello IAMTECHNI, I am interested in the ${courseTitle} training program. Please share the course syllabus, duration, fees, upcoming batch details, and learning mode.`;
  return `${WHATSAPP_CONFIG.baseUrl}?text=${encodeURIComponent(courseMsg)}`;
}

/**
 * Helper to format complete enquiry form data into a WhatsApp message link
 */
export function getEnquiryWhatsAppUrl(data: {
  fullName: string;
  mobileNumber: string;
  email?: string;
  course: string;
  currentStatus: string;
  learningMode: string;
  preferredBatch?: string;
  questions?: string;
}): string {
  const parts = [
    `Hello IAMTECHNI, I am submitting a Course Enquiry:`,
    `• Name: ${data.fullName}`,
    `• Mobile: ${data.mobileNumber}`,
    data.email ? `• Email: ${data.email}` : '',
    `• Course Interested In: ${data.course}`,
    `• Current Status: ${data.currentStatus}`,
    `• Learning Mode: ${data.learningMode}`,
    data.preferredBatch ? `• Preferred Batch: ${data.preferredBatch}` : '',
    data.questions ? `• Question: ${data.questions}` : '',
    `Please share syllabus, batch schedules, and fee details.`,
  ].filter(Boolean);

  return `${WHATSAPP_CONFIG.baseUrl}?text=${encodeURIComponent(parts.join('\n'))}`;
}

export const coursesData: CourseItem[] = [
  /* ========================================================================== */
  /* 1. SOFTWARE DEVELOPMENT                                                    */
  /* ========================================================================== */
  {
    id: 'full-stack-development',
    title: 'Full Stack Development',
    category: 'Software Development',
    subtitle: 'Frontend, backend, databases, APIs, and complete web application development.',
    description:
      'Master modern end-to-end web engineering. Learn responsive UI design with React and Next.js, backend service development with Node.js and Express, relational and NoSQL database modeling, and automated cloud deployments.',
    highlights: [
      'Frontend: HTML5, CSS3, Tailwind CSS, JavaScript (ES6+), React & Next.js',
      'Backend: Node.js, Express.js REST APIs & Middleware Architecture',
      'Databases: PostgreSQL, MongoDB, Prisma ORM & Query Optimization',
      'Architecture: Git version control, authentication, JWT & cloud deployment',
    ],
    prerequisites: 'Basic computer literacy. Prior knowledge of HTML/CSS is helpful but not mandatory.',
    learningOutcomes: [
      'Architect and build production-grade web applications from scratch',
      'Design clean RESTful APIs and integrate external third-party services',
      'Manage databases with schema migrations and indexing best practices',
      'Deploy applications to cloud platforms with continuous integration',
    ],
    iconName: 'Code2',
    colorIndex: 0,
  },
  {
    id: 'advanced-python',
    title: 'Advanced Python',
    category: 'Software Development',
    subtitle: 'Python programming, automation, application development, and practical projects.',
    description:
      'Take your Python skills from syntax basics to professional software development. Dive deep into object-oriented patterns, functional paradigms, automated scripting, web scraping, and building high-performance web APIs with FastAPI.',
    highlights: [
      'Core & Advanced Syntax: Generators, decorators, context managers & typing',
      'Object-Oriented Programming (OOP): Inheritance, abstract classes & design patterns',
      'Backend Development: Building asynchronous microservices with FastAPI',
      'Automation & Data: File I/O, regex, web scraping, and automated workflow scripts',
    ],
    prerequisites: 'Foundational understanding of programming basics (variables, loops, and functions).',
    learningOutcomes: [
      'Write idiomatic, modular, and strongly-typed Python code',
      'Construct scalable backend APIs with validation and auto-documentation',
      'Automate daily repetitive tasks and data extraction workflows',
      'Implement automated unit tests with pytest',
    ],
    iconName: 'Terminal',
    colorIndex: 1,
  },
  {
    id: 'dotnet-development',
    title: '.NET Development',
    category: 'Software Development',
    subtitle: 'C#, ASP.NET Core, APIs, databases, and enterprise application development.',
    description:
      'Engineer robust enterprise software using the Microsoft .NET ecosystem. Learn C# language mastery, ASP.NET Core Web APIs, Entity Framework Core ORM, dependency injection, and clean architecture standards.',
    highlights: [
      'C# Language Fundamentals: Modern language features, LINQ & asynchronous programming',
      'ASP.NET Core: Web APIs, controllers, middleware pipeline & dependency injection',
      'Data Access: Entity Framework Core, migrations, and Microsoft SQL Server',
      'Enterprise Architecture: Repository pattern, Clean Architecture & unit testing',
    ],
    prerequisites: 'Familiarity with object-oriented programming concepts in any language (Java, C++, or C#).',
    learningOutcomes: [
      'Develop secure, enterprise-grade REST APIs in .NET',
      'Perform complex database queries and transactional data operations with EF Core',
      'Implement JWT token authentication and role-based authorization',
      'Structure code according to enterprise software design principles',
    ],
    iconName: 'Cpu',
    colorIndex: 2,
  },
  {
    id: 'programming-languages',
    title: 'Programming Languages',
    category: 'Software Development',
    subtitle: 'Comprehensive core programming language foundations for problem solving and software careers.',
    description:
      'Master the foundational and modern languages that power software engineering. Choose focused tracks in C, C++, Core Java, modern JavaScript, or TypeScript, with extensive problem-solving exercises and data structure labs.',
    highlights: [
      'Language Tracks Offered: C, C++, Core Java, Modern JavaScript (ES6+) & TypeScript',
      'Foundational Logic: Data types, control structures, pointers/references & memory models',
      'Data Structures & Algorithms: Arrays, linked lists, stacks, queues, trees & sorting algorithms',
      'Modular Code: Object-oriented programming, exception handling & file handling',
    ],
    prerequisites: 'None. Suitable for beginners, college students, and anyone starting their programming journey.',
    learningOutcomes: [
      'Develop strong algorithmic problem-solving and coding interview aptitude',
      'Understand how programs manage memory and CPU execution',
      'Transition smoothly into specialized frontend, backend, or cloud tracks',
      'Write structured, well-commented, and bug-free code',
    ],
    iconName: 'Layers',
    colorIndex: 3,
  },

  /* ========================================================================== */
  /* 2. CLOUD COMPUTING                                                         */
  /* ========================================================================== */
  {
    id: 'aws',
    title: 'Amazon Web Services (AWS)',
    category: 'Cloud Computing',
    subtitle: 'Cloud fundamentals, core AWS services, architecture, deployment, and practical labs.',
    description:
      'Gain practical expertise on the world’s leading cloud platform. Learn to provision compute with EC2, store scalable data in S3, configure relational databases in RDS, secure infrastructure with IAM, and deploy serverless functions.',
    highlights: [
      'Compute & Storage: EC2 instances, Auto Scaling, Elastic Load Balancing & S3 storage',
      'Networking & Security: VPC subnets, route tables, security groups, NACLs & IAM policies',
      'Databases & Serverless: Amazon RDS (PostgreSQL/MySQL), DynamoDB & AWS Lambda',
      'Monitoring & Ops: Amazon CloudWatch metrics, alarms & CloudFormation templates',
    ],
    prerequisites: 'Basic knowledge of operating systems (Linux/Windows) and networking concepts.',
    learningOutcomes: [
      'Design fault-tolerant, highly available cloud architectures on AWS',
      'Provision secure virtual private clouds (VPC) with public/private subnets',
      'Deploy applications with automated load balancing and auto-scaling groups',
      'Apply AWS Well-Architected Framework principles for security and cost efficiency',
    ],
    iconName: 'Cloud',
    colorIndex: 4,
  },
  {
    id: 'azure',
    title: 'Microsoft Azure',
    category: 'Cloud Computing',
    subtitle: 'Azure infrastructure, cloud services, identity, deployment, and administration.',
    description:
      'Master enterprise cloud infrastructure with Microsoft Azure. Learn virtual machine deployment, Azure App Service, Azure SQL databases, Microsoft Entra ID (formerly Azure AD), virtual network peering, and Azure Resource Manager (ARM).',
    highlights: [
      'Infrastructure: Azure Virtual Machines, Virtual Networks & Storage Accounts',
      'Platform Services: Azure App Services, Azure Functions (Serverless) & Azure SQL',
      'Security & Identity: Microsoft Entra ID, role-based access control (RBAC) & Key Vault',
      'Governance & Monitoring: Azure Monitor, Cost Management & ARM/Bicep templates',
    ],
    prerequisites: 'Basic familiarity with computer networking, operating systems, and IT fundamentals.',
    learningOutcomes: [
      'Deploy and administer enterprise workloads in Azure cloud environments',
      'Implement enterprise identity management and zero-trust access controls',
      'Configure hybrid connectivity and secure virtual networking topologies',
      'Optimize cloud computing expenditure using Azure Cost Management',
    ],
    iconName: 'Server',
    colorIndex: 5,
  },
  {
    id: 'cloud-computing',
    title: 'Cloud Computing',
    category: 'Cloud Computing',
    subtitle: 'Cloud concepts, architecture, infrastructure, security, and deployment fundamentals.',
    description:
      'Understand the foundational concepts, paradigms, and architectural principles underpinning modern cloud computing across providers (AWS, Azure, and Google Cloud).',
    highlights: [
      'Service Models: IaaS (Infrastructure), PaaS (Platform), SaaS (Software) & FaaS (Serverless)',
      'Deployment Models: Public Cloud, Private Cloud, Hybrid Cloud & Multi-Cloud strategies',
      'Core Capabilities: Virtualization, distributed storage, container basics & APIs',
      'Security & Governance: Shared responsibility model, compliance & cloud disaster recovery',
    ],
    prerequisites: 'General interest in information technology. No specific coding experience required.',
    learningOutcomes: [
      'Evaluate and select appropriate cloud deployment models for organizational needs',
      'Understand shared responsibility security frameworks across cloud vendors',
      'Grasp scalability, elasticity, high availability, and disaster recovery concepts',
      'Prepare for specialized AWS or Azure cloud certification learning paths',
    ],
    iconName: 'Cloud',
    colorIndex: 6,
  },

  /* ========================================================================== */
  /* 3. AI AND DATA                                                             */
  /* ========================================================================== */
  {
    id: 'artificial-intelligence',
    title: 'Artificial Intelligence (AI)',
    category: 'AI & Data',
    subtitle: 'AI fundamentals, practical applications, and intelligent solutions.',
    description:
      'Explore the principles and practical tools powering modern artificial intelligence. Understand state-space search, heuristics, knowledge representation, expert systems, natural language processing concepts, and neural network foundations.',
    highlights: [
      'Core AI Fundamentals: Search algorithms, logic engines & decision systems',
      'Natural Language Processing (NLP): Text tokenization, sentiment analysis & semantic parsing',
      'Computer Vision Basics: Image classification concepts & feature extraction',
      'AI Applications: Real-world use cases, workflow integration & ethical considerations',
    ],
    prerequisites: 'Basic high school mathematics and introductory Python programming knowledge.',
    learningOutcomes: [
      'Understand the mathematical and algorithmic foundations of artificial intelligence',
      'Implement search and optimization algorithms for problem-solving',
      'Build fundamental text processing and classification pipelines',
      'Identify viable business use cases for intelligent automation',
    ],
    iconName: 'Bot',
    colorIndex: 7,
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    category: 'AI & Data',
    subtitle: 'Data preparation, model training, evaluation, and applied machine learning.',
    description:
      'Turn raw data into predictive intelligence. Master supervised and unsupervised machine learning algorithms using Python, NumPy, Pandas, Scikit-Learn, and Matplotlib, including real-world dataset modeling and validation.',
    highlights: [
      'Data Preparation: Data cleaning, feature scaling, encoding & train-test splitting',
      'Supervised Learning: Linear regression, logistic regression, decision trees & random forests',
      'Unsupervised Learning: K-means clustering, hierarchical clustering & PCA dimensionality reduction',
      'Model Evaluation: Confusion matrices, precision, recall, F1-score & ROC-AUC curves',
    ],
    prerequisites: 'Python programming basics and familiarity with basic linear algebra and statistics.',
    learningOutcomes: [
      'Clean, preprocess, and visualize complex real-world tabular datasets',
      'Train and tune regression and classification models with Scikit-Learn',
      'Evaluate model performance objectively to avoid overfitting and data leakage',
      'Package trained models for integration into web applications',
    ],
    iconName: 'TrendingUp',
    colorIndex: 0,
  },
  {
    id: 'generative-ai',
    title: 'Generative AI',
    category: 'AI & Data',
    subtitle: 'LLM fundamentals, prompt engineering, and practical AI application development.',
    description:
      'Master the transformative technology of Large Language Models (LLMs) and Generative AI. Learn transformer architectures, prompt engineering techniques, Retrieval-Augmented Generation (RAG), vector databases, and building AI-powered apps with LangChain.',
    highlights: [
      'LLM Architectures: Transformer attention mechanisms, tokens & generative parameters',
      'Advanced Prompt Engineering: Few-shot prompting, chain-of-thought & system instructions',
      'Retrieval-Augmented Generation (RAG): Document chunking, vector embeddings & semantic search',
      'AI Application Stacks: Vector databases (pgvector/Pinecone), LangChain & API integration',
    ],
    prerequisites: 'Intermediate Python programming and familiarity with REST API integration.',
    learningOutcomes: [
      'Build custom Retrieval-Augmented Generation (RAG) knowledge assistants',
      'Design reliable prompt workflows with guardrails and structured outputs',
      'Store and query semantic embeddings using modern vector databases',
      'Deploy production-ready Generative AI features into web applications',
    ],
    iconName: 'Sparkles',
    colorIndex: 1,
  },

  /* ========================================================================== */
  /* 4. DEVOPS AND SECURITY                                                     */
  /* ========================================================================== */
  {
    id: 'devops-engineering',
    title: 'DevOps Engineering',
    category: 'DevOps & Security',
    subtitle: 'Git, CI/CD, Docker, Kubernetes, automation, and deployment workflows.',
    description:
      'Bridge the gap between software development and operational reliability. Learn modern containerization with Docker, container orchestration with Kubernetes, automated CI/CD pipelines with GitHub Actions, and Infrastructure as Code concepts.',
    highlights: [
      'Version Control & Collaboration: Advanced Git, trunk-based development & pull request workflows',
      'Containerization: Dockerfile optimization, multi-stage builds & Docker Compose',
      'CI/CD Automation: GitHub Actions workflows, automated testing & artifact publishing',
      'Orchestration & Infrastructure: Kubernetes pods, deployments, services & ingress controllers',
    ],
    prerequisites: 'Basic command-line familiarity (Linux bash) and understanding of web applications.',
    learningOutcomes: [
      'Containerize multi-tier web applications into lightweight Docker images',
      'Build automated CI/CD delivery pipelines that test and deploy code on every commit',
      'Deploy and scale applications on Kubernetes clusters with zero downtime',
      'Monitor application logs, metrics, and health endpoints effectively',
    ],
    iconName: 'Workflow',
    colorIndex: 2,
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    category: 'DevOps & Security',
    subtitle: 'Security fundamentals, defensive practices, network security, and authorized security labs.',
    description:
      'Learn the defensive security principles required to protect corporate data and digital infrastructure. Master threat modeling, network security protocols, OWASP Top 10 web vulnerabilities, cryptography fundamentals, and security incident response.',
    highlights: [
      'Security Foundations: CIA triad, defense-in-depth, threat actors & attack vectors',
      'Network Security: Firewalls, VPNs, TLS/SSL encryption, Wireshark packet analysis & port scanning',
      'Application Security: OWASP Top 10 (SQL injection, XSS, CSRF) & secure coding practices',
      'Defensive Operations: Log analysis, vulnerability assessments & security policies',
    ],
    prerequisites: 'Basic knowledge of computer networks, operating systems, and web technologies.',
    learningOutcomes: [
      'Identify and remediate common application and network security vulnerabilities',
      'Implement cryptographic encryption and secure key management practices',
      'Configure network defense layers, firewalls, and access control policies',
      'Understand regulatory compliance frameworks (ISO 27001, SOC 2, GDPR)',
    ],
    iconName: 'ShieldCheck',
    colorIndex: 3,
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    category: 'DevOps & Security',
    subtitle: 'SEO, social media marketing, content strategy, campaign analytics, and digital growth.',
    description:
      'Harness digital channels to drive real measurable business growth. Master technical search engine optimization (SEO), on-page and off-page SEO, paid advertising fundamentals, social media marketing strategies, and web analytics with Google Analytics 4.',
    highlights: [
      'Search Engine Optimization (SEO): Keyword research, technical audits, on-page SEO & link building',
      'Content Strategy: Editorial planning, copywriting, storytelling & audience persona mapping',
      'Performance Advertising: Search ads, social media campaigns & audience targeting',
      'Analytics & Conversion: Google Analytics 4 (GA4), Google Tag Manager & conversion rate optimization',
    ],
    prerequisites: 'No technical prerequisites. Suitable for beginners, entrepreneurs, and marketing aspirants.',
    learningOutcomes: [
      'Perform end-to-end technical SEO audits and rank websites on search engines',
      'Plan and execute multi-channel digital campaigns with measurable ROI',
      'Track visitor behavior and setup conversion events using Google Analytics 4',
      'Craft compelling ad copy and landing pages engineered for conversion',
    ],
    iconName: 'Globe',
    colorIndex: 4,
  },
];

export const courseCategories = [
  'All',
  'Software Development',
  'Cloud Computing',
  'AI & Data',
  'DevOps & Security',
] as const;

export const trainingFaqs = [
  {
    question: 'How do I enquire about a course and get syllabus details?',
    answer:
      'You can enquire directly through the course enquiry form on this page or tap the "Enquire on WhatsApp" button on any course card. Our academic counseling team will share the complete syllabus breakdown, duration, upcoming batch dates, and fee structure.',
  },
  {
    question: 'What are the available learning modes for IAMTECHNI training?',
    answer:
      'We offer interactive Online live training sessions as well as Classroom learning batches, along with flexible weekend sessions tailored for college students and working professionals.',
  },
  {
    question: 'Are there any prerequisites before joining a course?',
    answer:
      'Prerequisites vary by course. Foundational tracks like Programming Languages and Cloud Computing require no prior coding experience. Advanced tracks like Generative AI or DevOps benefit from basic programming or command-line familiarity. When you enquire, our team reviews your current background and recommends the optimal entry track.',
  },
  {
    question: 'How do practical exercises and project work?',
    answer:
      'IAMTECHNI training emphasizes practical hands-on application. Every program includes code-along exercises, mini-labs, and a comprehensive capstone project that mirrors production engineering challenges.',
  },
  {
    question: 'Can college students or fresh graduates join these programs?',
    answer:
      'Yes, absolutely. Our curriculum is tailored for college students, fresh engineering graduates seeking job-ready technical skills, working professionals looking to upskill, and career changers transitioning into software engineering.',
  },
  {
    question: 'How do batch schedules and fees work?',
    answer:
      'Batches run on regular weekday schedules as well as weekend cohorts. Because batch capacity is intentionally limited to maintain student-mentor interaction, please submit an enquiry or connect with us on WhatsApp to check currently open batches and available timings.',
  },
];
