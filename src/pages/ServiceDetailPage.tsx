import React from 'react';
import { PageRoute, ServiceItem } from '../types';
import { ServicePage } from './ServicePage';
import { getSeoServicePageBySlug } from '../data/seo-pages';

export { ServicePage };

interface ServiceDetailPageProps {
  service: ServiceItem;
  onNavigate: (route: PageRoute) => void;
  onStartProject: (serviceName?: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  service,
  onNavigate,
  onStartProject,
}) => {
  const seoData = getSeoServicePageBySlug(service.slug || service.id);

  return (
    <ServicePage
      slug={seoData?.slug || service.slug || service.id}
      seoTitle={seoData?.seoTitle || `${service.title} Services | IAMTECHNI`}
      metaDescription={seoData?.metaDescription || service.summary}
      h1={seoData?.h1 || service.title}
      sections={seoData?.sections || []}
      faqs={seoData?.faqs || service.faqs}
      service={service}
      onNavigate={onNavigate}
      onStartProject={onStartProject}
    />
  );
};
