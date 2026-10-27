import { ServicePageData } from './types';

export const aiMachineLearningSeoPage: ServicePageData = {
  slug: 'ai-machine-learning',
  seoTitle: 'AI & Machine Learning Services | Enterprise RAG & AI Automation | IAMTECHNI',
  metaDescription:
    'Deploy practical enterprise AI & Machine Learning solutions with IAMTECHNI. Private RAG knowledge assistants, document intelligence, and LLM workflow automation.',
  h1: 'AI & Machine Learning',
  sections: [
    {
      h2: 'Private Retrieval-Augmented Generation (RAG) & Knowledge Assistants',
      paragraphs: [
        'IAMTECHNI helps organizations move beyond generic AI demos to deploy domain-grounded, hallucination-resistant intelligence over proprietary enterprise data.',
        'Using hybrid vector and lexical search (pgvector, Qdrant) paired with strict citation guardrails, our knowledge assistants answer complex operational and engineering queries with verifiable source attribution.',
      ],
    },
    {
      h2: 'Intelligent Document Processing & Agentic Workflow Automation',
      paragraphs: [
        'We automate high-volume document extraction, classification, and validation across invoices, contracts, and technical specifications using structured schema enforcement and human-in-the-loop review queues.',
        'All AI pipelines are architected with enterprise zero-retention API policies and token cost controls to keep your proprietary data private and operational budgets predictable.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Will our proprietary company data be used to train public AI models?',
      answer:
        'No. We configure enterprise-grade zero-retention API endpoints or private vector stores where your data remains strictly confidential and is never used for training third-party public models.',
    },
    {
      question: 'How do you prevent AI hallucinations in critical workflows?',
      answer:
        'We employ strict Retrieval-Augmented Generation (RAG) with source attribution: the system is restricted to answering only from verified retrieved context passages, and flags uncertain queries for human review.',
    },
  ],
};

export default aiMachineLearningSeoPage;
