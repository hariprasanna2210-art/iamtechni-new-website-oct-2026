import { CareerItem } from '../types';

export const careersData: CareerItem[] = [
  {
    id: 'senior-fullstack-engineer',
    title: 'Senior Full-Stack Engineer (React & Node.js)',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Hybrid / Remote Friendly',
    experience: '4+ Years',
    overview: 'Lead the architecture and implementation of scalable web applications, client portals, and bespoke API services for enterprise clients.',
    responsibilities: [
      'Architect modular, accessible frontend components in React, Next.js, and TypeScript.',
      'Design robust backend RESTful microservices and database schemas in Node.js and PostgreSQL.',
      'Conduct rigorous code reviews and uphold engineering standards, security practices, and documentation.',
      'Collaborate directly with solution architects and client stakeholders to translate business requirements into working software.'
    ],
    requirements: [
      'Strong production experience with TypeScript, React, Next.js, Node.js, and relational databases (PostgreSQL/MySQL).',
      'Solid understanding of browser performance, Core Web Vitals, and WCAG accessibility standards.',
      'Experience with containerization (Docker) and CI/CD pipelines (GitHub Actions).',
      'Excellent written communication and ability to articulate architectural trade-offs.'
    ],
    skills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'REST APIs']
  },
  {
    id: 'ai-solutions-engineer',
    title: 'AI Solutions Engineer (Python & RAG)',
    department: 'AI & Data Practice',
    type: 'Full-time',
    location: 'Hybrid / Remote Friendly',
    experience: '3+ Years',
    overview: 'Engineer production-grade Retrieval-Augmented Generation (RAG) pipelines, enterprise document processors, and private AI integrations.',
    responsibilities: [
      'Design hybrid retrieval architectures combining BM25 keyword search with dense vector indexing in pgvector.',
      'Implement prompt guardrails, structured JSON validation, and token cost budgeting strategies.',
      'Build evaluation benchmarks to measure grounding precision, recall, and hallucination rates.',
      'Integrate LLM APIs and private inference endpoints securely into client backend workflows.'
    ],
    requirements: [
      'Demonstrated experience building end-to-end RAG systems or document processing pipelines in Python.',
      'Proficiency with FastAPI, LangChain/LlamaIndex, PostgreSQL/pgvector, and modern LLM APIs.',
      'Knowledge of embedding models, chunking strategies, and token economics.',
      'Commitment to enterprise security and zero-retention data privacy practices.'
    ],
    skills: ['Python', 'FastAPI', 'pgvector', 'RAG', 'LangChain', 'PostgreSQL', 'Docker']
  },
  {
    id: 'frontend-ui-developer',
    title: 'Frontend Engineer & UI Specialist',
    department: 'Digital Experiences',
    type: 'Full-time',
    location: 'Hybrid / Remote Friendly',
    experience: '2+ Years',
    overview: 'Craft polished, responsive, and accessible user interfaces that balance brand elegance with high technical performance.',
    responsibilities: [
      'Translate design systems and Figma prototypes into responsive, performant React components.',
      'Ensure strict WCAG 2.2 AA accessibility compliance (keyboard navigation, screen readers, contrast).',
      'Optimize web pages for sub-second load times and 95+ Lighthouse performance scores.',
      'Collaborate with backend engineers to integrate typed API contracts.'
    ],
    requirements: [
      'Proficiency in React, TypeScript, Tailwind CSS, and modern CSS layout techniques.',
      'Deep appreciation for typographic hierarchy, whitespace discipline, and responsive design.',
      'Familiarity with animation libraries (CSS animations, lightweight SVG interactions).',
      'Portfolio demonstrating production web interfaces with clean code.'
    ],
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Figma to Code', 'WCAG AA', 'Vite']
  },
  {
    id: 'cloud-devops-engineer',
    title: 'Cloud & DevOps Engineer (AWS & Azure)',
    department: 'Infrastructure',
    type: 'Full-time',
    location: 'Hybrid / Remote Friendly',
    experience: '3+ Years',
    overview: 'Design, provision, and maintain reliable cloud infrastructure, automated CI/CD pipelines, and defensive security hardening.',
    responsibilities: [
      'Manage multi-environment cloud deployments on AWS and Azure using infrastructure best practices.',
      'Build and optimize automated CI/CD pipelines using GitHub Actions and Docker.',
      'Implement proactive monitoring, logging, and automated budget anomaly alerts.',
      'Perform regular server hardening, dependency security auditing, and backup verification.'
    ],
    requirements: [
      'Hands-on experience managing Linux environments, Nginx reverse proxies, and Docker containers.',
      'Proficiency with AWS or Azure cloud services (VPCs, IAM, RDS, S3/Blob, CloudWatch).',
      'Experience scripting CI/CD automation and writing infrastructure code.',
      'Understanding of networking fundamentals, DNS, SSL/TLS, and security best practices.'
    ],
    skills: ['AWS', 'Azure', 'Docker', 'Linux', 'GitHub Actions', 'Nginx', 'CI/CD']
  }
];
