import { ServicePageData } from './types';

export const cloudDevopsSeoPage: ServicePageData = {
  slug: 'cloud-devops',
  seoTitle: 'Cloud & DevOps Engineering Services | AWS, Azure & CI/CD | IAMTECHNI',
  metaDescription:
    'Resilient cloud architecture and DevOps automation by IAMTECHNI. AWS and Azure infrastructure, Docker/Kubernetes containerization, zero-downtime CI/CD, and FinOps.',
  h1: 'Cloud & DevOps Engineering',
  sections: [
    {
      h2: 'Multi-Cloud Topologies & Containerized Infrastructure',
      paragraphs: [
        'IAMTECHNI architects and manages high-availability cloud environments across AWS and Microsoft Azure. By packaging workloads into standardized Docker containers and orchestrating them cleanly, we ensure complete parity between staging and production.',
        'Our cloud topologies enforce private VPC networking, automated multi-AZ failover, and encrypted backup schedules to safeguard business continuity.',
      ],
    },
    {
      h2: 'Zero-Downtime CI/CD Pipelines & Cloud FinOps Optimization',
      paragraphs: [
        'We replace risky manual server updates with automated GitHub Actions and GitLab CI pipelines that execute linting, regression tests, and vulnerability scans on every commit.',
        'Through proactive FinOps audits, compute right-sizing, and budget alerting, we also eliminate idle cloud waste and prevent unexpected monthly bill spikes.',
      ],
    },
  ],
  faqs: [
    {
      question: 'How do you prevent cloud bill shock?',
      answer:
        'We establish proactive budget guardrails, resource auto-scaling caps, automated anomaly notifications, and eliminate orphaned storage volumes or over-provisioned instances.',
    },
    {
      question: 'Can you migrate our legacy servers to AWS or Azure without downtime?',
      answer:
        'Yes. We stage parallel containerized environments, replicate database state incrementally, and execute verified blue/green DNS cutovers with zero service interruption.',
    },
  ],
};

export default cloudDevopsSeoPage;
