export interface MobileJob {
  id: string;
  title: string;
  slug: string;
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  companyDescription?: string;
  categoryName?: string;
  sourceType: string;
  sourceName: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  requiredSkills: string[];
  experienceRequirement: string;
  experienceLevel: string;
  educationRequirement: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryPeriod: string;
  isSalaryDisclosed: boolean;
  employmentType: string;
  workLocationType: 'REMOTE' | 'HYBRID' | 'ONSITE';
  country: string;
  city: string;
  locationString: string;
  isRemoteEligible: boolean;
  visaSponsorship: boolean;
  relocationAssistance: boolean;
  immediateJoining: boolean;
  applicationUrl: string;
  isExternalApplication: boolean;
  status: string;
  isFeatured: boolean;
  adminPosted: boolean;
  clickCount: number;
  viewsCount: number;
  postedAt: string;
}

export interface JobFilters {
  q?: string;
  country?: string;
  city?: string;
  category?: string;
  employmentType?: string;
  workLocationType?: string;
  experienceLevel?: string;
  minSalary?: number;
  maxSalary?: number;
  isRemoteOnly?: boolean;
  visaSponsorship?: boolean;
  immediateJoining?: boolean;
  sortBy?: 'latest' | 'relevance' | 'salary_high';
}

export interface MobileJobAlert {
  id: string;
  name: string;
  keywords?: string;
  skills: string[];
  country?: string;
  city?: string;
  minSalary?: number;
  maxSalary?: number;
  isRemoteOnly: boolean;
  pushNotificationEnabled: boolean;
  emailNotificationEnabled: boolean;
  isActive: boolean;
  matchCount: number;
  createdAt: string;
}
