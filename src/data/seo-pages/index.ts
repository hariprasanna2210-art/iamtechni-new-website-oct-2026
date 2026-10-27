import { ServicePageData, ServicePageSection, ServicePageFaq } from './types';
import { getCanonicalServiceSlug } from '../servicesData';
import pagesJson from './pages.json';

import { webDevelopmentSeoPage } from './web-development';
import { ecommerceSeoPage } from './ecommerce';
import { customSoftwareSeoPage } from './custom-software';
import { mobileAppsSeoPage } from './mobile-apps';
import { aiMachineLearningSeoPage } from './ai-machine-learning';
import { dataAnalyticsSeoPage } from './data-analytics';
import { cloudDevopsSeoPage } from './cloud-devops';
import { cybersecuritySeoPage } from './cybersecurity';
import { digitalMarketingSeoPage } from './digital-marketing';
import { uiUxDesignSeoPage } from './ui-ux-design';
import { itConsultingSeoPage } from './it-consulting';
import { trainingSeoPage } from './training';
import { roboticsSeoPage } from './robotics';

export type { ServicePageData, ServicePageSection, ServicePageFaq };

export {
  webDevelopmentSeoPage,
  ecommerceSeoPage,
  customSoftwareSeoPage,
  mobileAppsSeoPage,
  aiMachineLearningSeoPage,
  dataAnalyticsSeoPage,
  cloudDevopsSeoPage,
  cybersecuritySeoPage,
  digitalMarketingSeoPage,
  uiUxDesignSeoPage,
  itConsultingSeoPage,
  trainingSeoPage,
  roboticsSeoPage,
};

export const seoServicePages: ServicePageData[] = pagesJson as ServicePageData[];

export const seoServicePagesMap: Record<string, ServicePageData> = Object.fromEntries(
  seoServicePages.map((page) => [page.slug, page])
);

export function getSeoServicePageBySlug(slug: string): ServicePageData | undefined {
  const canonicalSlug = getCanonicalServiceSlug(slug);
  return seoServicePagesMap[canonicalSlug];
}

