export interface ServicePageSection {
  h2: string;
  paragraphs: string[];
}

export interface ServicePageFaq {
  question: string;
  answer: string;
}

export interface ServicePageData {
  slug: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  sections: ServicePageSection[];
  faqs: ServicePageFaq[];
}
