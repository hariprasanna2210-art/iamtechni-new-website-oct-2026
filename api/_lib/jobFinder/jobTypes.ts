export type WorkLocationType = 'REMOTE' | 'HYBRID' | 'ONSITE';

export type EmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'INTERNSHIP'
  | 'CONTRACT'
  | 'FREELANCE'
  | 'TEMPORARY';

export type ExperienceLevel =
  | 'FRESHER'
  | 'INTERNSHIP'
  | 'ENTRY_LEVEL'
  | 'ONE_TO_TWO_YEARS'
  | 'THREE_TO_FIVE_YEARS'
  | 'FIVE_TO_TEN_YEARS'
  | 'TEN_PLUS_YEARS';

export type EducationLevel =
  | 'NO_DEGREE'
  | 'DIPLOMA'
  | 'BACHELORS'
  | 'MASTERS'
  | 'DOCTORATE'
  | 'OTHER';

export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'EXPIRED' | 'ARCHIVED';

export type JobSourceType = 'ADMIN_MANUAL' | 'AUTOMATED_FEED' | 'LICENSED_PARTNER';

export type RequestStatus = 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';

export interface JobItem {
  id: string;
  title: string;
  slug: string;
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  companyEmail?: string;
  companyDescription?: string;
  categoryId?: string;
  categoryName?: string;
  sourceType: JobSourceType;
  sourceName: string;
  externalSourceRef?: string;
  
  description: string;
  responsibilities: string[];
  qualifications: string[];
  requiredSkills: string[];
  experienceRequirement: string;
  experienceLevel: ExperienceLevel;
  educationRequirement: string;
  educationLevel: EducationLevel;

  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryPeriod: 'yearly' | 'monthly' | 'hourly';
  isSalaryDisclosed: boolean;

  employmentType: EmploymentType;
  workLocationType: WorkLocationType;
  
  country: string;
  state?: string;
  city: string;
  locationString: string;
  isRemoteEligible: boolean;
  
  visaSponsorship: boolean;
  relocationAssistance: boolean;
  internationalApplicantsAccepted: boolean;
  immediateJoining: boolean;
  
  applicationUrl: string;
  applicationEmail?: string;
  isExternalApplication: boolean;
  
  status: JobStatus;
  isFeatured: boolean;
  adminPosted: boolean;
  postedByAdminName?: string;
  clickCount: number;
  viewsCount: number;
  postedAt: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobFilterParams {
  q?: string;
  title?: string;
  company?: string;
  skill?: string;
  category?: string;
  country?: string;
  state?: string;
  city?: string;
  locationType?: WorkLocationType | 'ALL';
  employmentType?: EmploymentType | 'ALL';
  experienceLevel?: ExperienceLevel | 'ALL';
  educationLevel?: EducationLevel | 'ALL';
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  visaSponsorship?: boolean;
  relocationAssistance?: boolean;
  internationalApplicants?: boolean;
  immediateJoining?: boolean;
  postedWithinDays?: number;
  isRemoteOnly?: boolean;
  sortBy?: 'latest' | 'relevance' | 'salary_high';
  page?: number;
  limit?: number;
}

export interface EmployerRequestPayload {
  employerName: string;
  companyName: string;
  companyEmail: string;
  contactPerson: string;
  mobileNumber?: string;
  jobTitle: string;
  vacanciesCount: number;
  jobLocation: string;
  employmentType: string;
  shortJobDescription: string;
  companyWebsite?: string;
  additionalMessage?: string;
}

export interface EmployerRequestItem extends EmployerRequestPayload {
  id: string;
  referenceId: string;
  status: RequestStatus;
  adminReviewNotes?: string;
  reviewedByAdminId?: string;
  convertedToJobId?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface JobAlertItem {
  id: string;
  userId: string;
  name: string;
  keywords?: string;
  skills: string[];
  country?: string;
  city?: string;
  categoryName?: string;
  employmentType?: EmploymentType;
  workLocationType?: WorkLocationType;
  minSalary?: number;
  maxSalary?: number;
  isRemoteOnly: boolean;
  pushNotificationEnabled: boolean;
  emailNotificationEnabled: boolean;
  isActive: boolean;
  matchCount: number;
  createdAt: string;
}

export interface UserProfileData {
  id: string;
  email: string;
  fullName: string;
  mobileNumber?: string;
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  country: string;
  state?: string;
  city?: string;
  preferredSalaryMin?: number;
  preferredSalaryMax?: number;
  salaryCurrency: string;
  experienceLevel?: ExperienceLevel;
  educationLevel?: EducationLevel;
  preferredSkills: string[];
  preferredCategories: string[];
  resumeFileName?: string;
  resumeUrl?: string;
  theme: 'SYSTEM' | 'LIGHT' | 'DARK';
  enablePushNotifications: boolean;
  enableEmailAlerts: boolean;
}
