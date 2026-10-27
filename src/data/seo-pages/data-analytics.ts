import { ServicePageData } from './types';

export const dataAnalyticsSeoPage: ServicePageData = {
  slug: 'data-analytics',
  seoTitle: 'Data Analytics & Business Intelligence Services | KPI Dashboards | IAMTECHNI',
  metaDescription:
    'Transform operational data into real-time executive dashboards with IAMTECHNI Data Analytics & Business Intelligence services. Automated ETL pipelines and BI reporting.',
  h1: 'Data Analytics & Business Intelligence',
  sections: [
    {
      h2: 'Real-Time Executive KPI Dashboards & Decision Support',
      paragraphs: [
        'IAMTECHNI designs and engineers unified analytics warehouses and interactive web dashboards that give leadership real-time visibility into revenue, unit economics, inventory health, and operational throughput.',
        'Instead of spending hours reconciling conflicting spreadsheets every week, your team gains role-based drill-down views, cohort retention tracking, and automated scheduled reports.',
      ],
    },
    {
      h2: 'Automated ETL/ELT Data Pipelines & Warehouse Modeling',
      paragraphs: [
        'We build resilient data ingestion pipelines in Python and SQL that extract, clean, deduplicate, and normalize records across your CRM, ERP, e-commerce store, and accounting platforms.',
        'Whether deploying custom React telemetry dashboards or integrating Power BI, Metabase, and PostgreSQL analytics schemas, we ensure 100% data integrity and governance.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Can we connect custom databases and external SaaS tools?',
      answer:
        'Yes. We build custom ETL pipelines and API connectors for PostgreSQL, MySQL, Google Sheets, CRMs, e-commerce stores, and accounting software.',
    },
    {
      question: 'How frequently do your analytics dashboards update?',
      answer:
        'Depending on your operational requirements, we configure real-time streaming telemetry or scheduled incremental syncs (every 5, 15, or 60 minutes) with automated schema drift alerts.',
    },
  ],
};

export default dataAnalyticsSeoPage;
