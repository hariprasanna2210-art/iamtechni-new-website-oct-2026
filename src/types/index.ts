export type PageRoute = 
  | '/'
  | '/about'
  | '/services'
  | '/services/website-development'
  | '/services/ui-ux-design'
  | '/services/ecommerce-development'
  | '/services/custom-software-development'
  | '/services/mobile-app-development'
  | '/services/ai-machine-learning'
  | '/services/generative-ai'
  | '/services/robotics-emerging-tech'
  | '/services/digital-marketing'
  | '/services/seo'
  | '/services/social-media-marketing'
  | '/services/cloud-computing'
  | '/services/devops'
  | '/services/cloud-migration'
  | '/services/data-analytics'
  | '/services/cybersecurity'
  | '/services/it-consulting'
  // Aliases for compatibility
  | '/services/web-development'
  | '/services/ecommerce'
  | '/services/custom-software'
  | '/services/mobile-apps'
  | '/services/cloud-devops'
  | '/services/training'
  | '/training'
  | '/services/robotics'
  | '/industries'
  | '/industries/healthcare'
  | '/industries/education'
  | '/industries/retail-ecommerce'
  | '/industries/manufacturing'
  | '/industries/startups-smbs'
  | '/industries/professional-services'
  | '/solutions'
  | '/portfolio'
  | '/case-studies'
  | '/technology'
  | '/insights'
  | '/insights/modern-rag-architecture'
  | '/insights/cloud-cost-optimization'
  | '/insights/web-performance-core-vitals'
  | '/careers'
  | '/contact'
  | '/contact/consultation'
  | '/faq'
  | '/locations'
  | '/privacy-policy'
  | '/terms'
  | '/terms-and-conditions'
  | '/cookie-policy'
  | (string & {});

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: 'Experiences' | 'Software' | 'AI & Data' | 'Cloud & Security' | 'Growth & Advisory';
  tagline: string;
  summary: string;
  problemStatement: string;
  capabilities: {
    title: string;
    description: string;
    points: string[];
  }[];
  useCases: {
    title: string;
    description: string;
    outcome: string;
  }[];
  deliverySteps: {
    phase: string;
    description: string;
  }[];
  technologies: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'Web' | 'E-commerce' | 'AI & ML' | 'Custom Software' | 'Cloud & DevOps' | 'Growth';
  industry: string;
  isDemonstration: boolean;
  clientBadge: string;
  tagline: string;
  challenge: string;
  objectives: string[];
  solutionArchitecture: string;
  techStack: string[];
  keyFeatures: string[];
  verifiedOutcomes: string[];
  relatedServices: {
    title: string;
    route: PageRoute;
  }[];
}

export interface ArticleItem {
  slug: string;
  title: string;
  category: 'AI & Data' | 'Cloud & DevOps' | 'Web Engineering';
  publishedDate: string;
  readTime: string;
  excerpt: string;
  author: {
    name: string;
    role: string;
  };
  tableOfContents: {
    id: string;
    title: string;
  }[];
  sections: {
    id: string;
    heading: string;
    body: string[];
    codeSnippet?: {
      language: string;
      code: string;
    };
  }[];
  relatedArticles: string[];
}

export interface IndustryItem {
  id: string;
  name: string;
  iconName: string;
  summary: string;
  coreChallenges: string[];
  digitalOpportunities: string[];
  iamtechniSolutions: string[];
  suggestedServices: {
    name: string;
    route: PageRoute;
  }[];
}

export interface SolutionItem {
  id: string;
  title: string;
  category: 'Operational' | 'Intelligence' | 'Infrastructure' | 'Commerce';
  summary: string;
  problem: string;
  proposedApproach: string;
  potentialBenefits: string[];
  implementationConsiderations: string[];
  relatedServiceRoute: PageRoute;
  relatedServiceName: string;
}

export interface CareerItem {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  experience: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
}

export interface CourseItem {
  id: string;
  title: string;
  category: 'Software Development' | 'Cloud Computing' | 'AI & Data' | 'DevOps & Security';
  subtitle: string;
  description: string;
  highlights: string[];
  prerequisites: string;
  learningOutcomes: string[];
  iconName: string;
  colorIndex: number;
}
