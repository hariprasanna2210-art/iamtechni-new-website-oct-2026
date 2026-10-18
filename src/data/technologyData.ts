export interface TechCategory {
  id: string;
  category: string;
  description: string;
  items: {
    name: string;
    description: string;
    role: string;
    level: string;
  }[];
}

export const technologyData: TechCategory[] = [
  {
    id: 'frontend',
    category: 'Frontend Engineering',
    description: 'Component-driven client architectures prioritizing sub-second hydration, Core Web Vitals, and WCAG 2.2 AA accessibility.',
    items: [
      { name: 'React', description: 'Declarative component ecosystem for stateful applications and interactive enterprise interfaces.', role: 'Core Client Framework', level: 'Production Standard' },
      { name: 'Next.js', description: 'Server-side rendering, static site generation, and optimized image routing for commercial flagships.', role: 'Enterprise Web Framework', level: 'Production Standard' },
      { name: 'TypeScript', description: 'Strict static type safety ensuring maintainability and robust API client contracts.', role: 'Language Standard', level: 'Universal' },
      { name: 'Tailwind CSS', description: 'Utility-first styling with zero runtime overhead, responsive ergonomics, and token systems.', role: 'Styling Architecture', level: 'Universal' },
      { name: 'Vite', description: 'Lightning-fast ES-module bundling and instant hot module replacement for development workflows.', role: 'Build Tooling', level: 'Universal' }
    ]
  },
  {
    id: 'backend',
    category: 'Backend & APIs',
    description: 'Resilient application servers, typed microservices, and asynchronous event pipelines.',
    items: [
      { name: 'Node.js', description: 'Non-blocking I/O event runtime for high-throughput API endpoints and real-time middleware.', role: 'Runtime Environment', level: 'Production Standard' },
      { name: 'Python', description: 'Primary language for data manipulation, scientific pipelines, machine learning, and AI services.', role: 'AI & Data Services', level: 'Production Standard' },
      { name: 'FastAPI', description: 'High-performance Python web framework with automatic OpenAPI documentation and async support.', role: 'AI API Service Layer', level: 'Production Standard' },
      { name: 'Express', description: 'Minimalist web server framework for routing, authentication middleware, and proxying.', role: 'API Server', level: 'Standard' },
      { name: 'REST & GraphQL', description: 'Standardized architectural styles for predictable data querying and client integration.', role: 'API Protocols', level: 'Universal' }
    ]
  },
  {
    id: 'cms-commerce',
    category: 'CMS & Digital Commerce',
    description: 'Flexible content management systems and transaction engines designed for editorial autonomy and operational durability.',
    items: [
      { name: 'WooCommerce', description: 'Extensible open-source commerce engine customized for B2B pricing and wholesale catalogs.', role: 'Commerce Engine', level: 'Production Standard' },
      { name: 'WordPress', description: 'Enterprise headless or decoupled content platform empowering marketing teams.', role: 'Content Architecture', level: 'Standard' },
      { name: 'Sanity', description: 'Structured headless content platform with real-time editorial collaboration.', role: 'Headless CMS', level: 'Modern Standard' },
      { name: 'Stripe & Regional Gateways', description: 'Tokenized payment integration supporting multi-currency, UPI, and recurring billing.', role: 'Payment Orchestration', level: 'Production Standard' }
    ]
  },
  {
    id: 'cloud-infrastructure',
    category: 'Cloud & Infrastructure',
    description: 'Scalable cloud providers, container orchestration, and automated CI/CD pipelines.',
    items: [
      { name: 'Amazon Web Services (AWS)', description: 'Cloud infrastructure spanning EC2, S3, RDS, CloudFront, Lambda, and VPC networking.', role: 'Primary Cloud Platform', level: 'Enterprise' },
      { name: 'Microsoft Azure', description: 'Enterprise cloud services, App Services, Blob Storage, and identity integration.', role: 'Enterprise Cloud Platform', level: 'Enterprise' },
      { name: 'Docker', description: 'Standardized application containerization ensuring consistent environment parity.', role: 'Container Runtime', level: 'Universal' },
      { name: 'Kubernetes', description: 'Automated container deployment, scaling, and operational management for complex workloads.', role: 'Orchestration', level: 'Advanced' },
      { name: 'GitHub Actions', description: 'Automated CI/CD workflows for linting, automated testing, and zero-downtime releases.', role: 'CI/CD Automation', level: 'Universal' },
      { name: 'Linux & Nginx', description: 'Defensively hardened operating environments, reverse proxying, SSL termination, and rate-limiting.', role: 'Server Infrastructure', level: 'Universal' }
    ]
  },
  {
    id: 'databases',
    category: 'Databases & Storage',
    description: 'ACID-compliant relational databases, high-speed in-memory caches, and specialized vector stores.',
    items: [
      { name: 'PostgreSQL', description: 'Industry-standard relational database with support for JSONB, complex indexing, and pgvector.', role: 'Primary Relational Database', level: 'Production Standard' },
      { name: 'MySQL', description: 'Dependable relational database engine for structured web applications and CMS data stores.', role: 'Relational Database', level: 'Standard' },
      { name: 'Redis', description: 'In-memory data structure store used for caching, cart state management, and pub/sub queues.', role: 'Caching & Session Store', level: 'Production Standard' },
      { name: 'pgvector', description: 'Open-source vector similarity search extension for PostgreSQL powering private RAG embeddings.', role: 'Vector Search Engine', level: 'AI Standard' }
    ]
  },
  {
    id: 'ai-data',
    category: 'AI & Data Ecosystem',
    description: 'Enterprise language model APIs, semantic embedding pipelines, and business intelligence analytics.',
    items: [
      { name: 'LLM APIs (OpenAI / Gemini)', description: 'State-of-the-art foundation models orchestrated with strict token budgets and system guardrails.', role: 'Inference Layer', level: 'Production Standard' },
      { name: 'LangChain & LlamaIndex', description: 'Orchestration frameworks for document parsing, contextual chunking, and retrieval pipelines.', role: 'RAG Frameworks', level: 'Specialized' },
      { name: 'Text Embeddings', description: 'High-dimensional vector representations mapping semantic document relationships.', role: 'Semantic Retrieval', level: 'Specialized' },
      { name: 'Pandas & Data Pipelines', description: 'Python data transformation libraries powering custom business telemetry and ETL workflows.', role: 'Data Transformation', level: 'Standard' }
    ]
  }
];
