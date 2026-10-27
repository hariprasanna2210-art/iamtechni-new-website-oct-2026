export interface LocationSeoSection {
  h2: string;
  paragraphs: string[];
}

export interface LocationSeoFaq {
  question: string;
  answer: string;
}

export interface LocationSeoHighlight {
  title: string;
  description: string;
}

export interface LocationSeoProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface LocationTargetInfo {
  city: string;
  region: string;
  state: string;
  distanceFromHub?: string;
}

export interface LocationSeoPageData {
  slug: string;
  path: string; // trailing slash e.g. "/web-development-company-pondicherry/"
  canonicalUrl: string; // "https://www.iamtechni.in/.../"
  seoTitle: string;
  metaDescription: string;
  h1: string;
  category: 'Service' | 'Training';
  schemaType: 'Service' | 'Course';
  targetLocation: LocationTargetInfo;
  primaryKeyword: string;
  secondaryKeywords: string[];
  intro: string;
  sections: LocationSeoSection[];
  highlights: LocationSeoHighlight[];
  processSteps: LocationSeoProcessStep[];
  localContext: string;
  faqs: LocationSeoFaq[];
  courseDetails?: {
    duration: string;
    mode: string;
    prerequisites: string;
    certification: string;
  };
  matchingCourseId?: string;
  matchingCoursePath?: string;
}

export interface UnimplementedRoute {
  routeNumber: number;
  slug: string;
  path: string;
  targetLocation: string;
  topic: string;
  status: 'not yet implemented';
}
