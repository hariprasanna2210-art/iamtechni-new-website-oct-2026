import { ServicePageData } from './types';

export const dataAnalyticsSeoPage: ServicePageData = {
  slug: 'data-analytics',
  seoTitle: 'Data Analytics & Business Intelligence Services | IAMTECHNI',
  metaDescription:
    'IAMTECHNI offers data analytics and business intelligence services in India: Power BI dashboards, data warehousing, ETL pipelines and predictive analytics.',
  h1: 'Data Analytics & Business Intelligence Services',
  intro:
    "Your business already creates valuable data in sales, operations, finance and marketing. But when it is scattered across spreadsheets, apps and databases, it is hard to use. IAMTECHNI's data analytics services bring that data together, clean it, and turn it into clear dashboards and reports so your team can make faster, better decisions.",
  sections: [
    {
      h2: 'What Our Data Analytics Services Include',
      paragraphs: [
        'Business Intelligence Dashboards: Interactive Power BI, Tableau and Looker Studio dashboards that show your KPIs in real time, from revenue and inventory to customer behaviour.',
        'Data Integration & ETL Pipelines: We connect your ERP, CRM, billing, e-commerce and Excel sources into one reliable pipeline, with automated data cleaning and validation.',
        'Data Warehousing: Centralized, secure storage using PostgreSQL, Google BigQuery, Snowflake or Amazon Redshift so your team has a single source of truth.',
        'Predictive Analytics: Statistical modeling and machine learning algorithms that forecast demand, identify customer churn risks, and spot revenue opportunities before they happen.',
        'Custom Reports & Automation: Automated daily, weekly and monthly executive reports delivered directly to your email or Slack, eliminating manual spreadsheet collating.',
      ],
    },
    {
      h2: 'Why Businesses Choose IAMTECHNI for Data Analytics',
      paragraphs: [
        "Business-First Approach: We don't just build technical charts; we focus on the metrics and KPIs that directly impact your bottom line, cash flow, and operational efficiency.",
        'End-to-End Delivery: From auditing your messy source data and engineering ETL pipelines to designing intuitive dashboards and training your staff, we handle every stage.',
        'Secure and Scalable: Role-based access control, strict data governance, and cloud-native architecture ensuring your proprietary commercial numbers stay completely private and protected.',
        'Easy to Use: Clean, mobile-friendly interfaces designed for business owners and non-technical managers, so anyone on your team can filter, drill down, and extract insights in seconds.',
        'Ongoing Support: Proactive monitoring, schema drift protection, dashboard enhancements, and dedicated technical support as your business metrics and reporting needs evolve.',
      ],
    },
    {
      h2: 'Our Data Analytics Process',
      paragraphs: [
        '1. Discovery: We meet with your leadership and department heads to identify key questions, pain points, target KPIs, and reporting cadences.',
        '2. Data Audit & Integration: We analyze your data sources—spreadsheets, ERPs, CRMs, POS systems—and construct resilient pipelines to ingest clean, accurate records.',
        '3. Modelling & Warehousing: We organize and normalize your data into high-performance analytical models, star schemas, and single-source-of-truth warehouses.',
        '4. Dashboard Development: We craft interactive, responsive dashboards in Power BI, Tableau, or custom web interfaces tailored to your specific decision-making workflows.',
        '5. Training & Handover: We conduct hands-on training sessions with your team, provide comprehensive documentation, and ensure everyone feels confident using the new reports.',
        '6. Support & Optimisation: We continuously monitor pipeline health, optimize query speeds, and adapt dashboards as your company launches new services or metrics.',
      ],
    },
    {
      h2: 'Industries We Serve',
      paragraphs: [
        'Retail & Supermarkets: Store-level sales tracking, inventory turn rates, basket size analysis, stock-out prevention, and cashier efficiency metrics.',
        'E-Commerce: Cart abandonment tracking, customer acquisition cost (CAC), lifetime value (LTV), cohort retention curves, and multi-channel attribution.',
        'Manufacturing: Production batch throughput, scrap and defect rates, machine downtime analysis, overall equipment effectiveness (OEE), and supply chain visibility.',
        'Healthcare & Clinics: Patient volume tracking, appointment scheduling bottlenecks, doctor utilization, and billing cycle transparency.',
        'Education & Training: Student enrollment funnels, course completion rates, attendance tracking, and fee collection dashboards.',
        'Logistics & Fleet: Delivery route efficiency, fuel consumption, driver performance metrics, on-time delivery rates, and maintenance schedules.',
        'Finance & Professional Services: Billable hours utilization, project profitability, aged accounts receivable, and cash burn forecasting.',
      ],
    },
    {
      h2: 'Technologies We Use',
      paragraphs: [
        'Business Intelligence & Visualization: Microsoft Power BI, Tableau, Google Looker Studio, Metabase, and custom React charting libraries.',
        'Data Engineering & Processing: Python (Pandas, Polars, PySpark), SQL, dbt, Apache Airflow, and automated serverless ETL scripts.',
        'Warehouses & Cloud Platforms: Google BigQuery, PostgreSQL, Snowflake, Amazon Redshift, Microsoft Azure Synapse, and AWS S3 data lakes.',
        'Spreadsheets & Productivity: Advanced Excel, Google Sheets automation, CSV/JSON APIs, and webhook ingest connectors.',
      ],
    },
    {
      h2: 'Turn Your Data Into Decisions',
      paragraphs: [
        'Stop guessing and start growing with clarity. When you know exactly which products drive profit, which marketing channels convert, and where operations stall, you can act with absolute confidence.',
        "Whether you need to fix broken spreadsheets, build an executive Power BI dashboard, or engineer an enterprise data warehouse, IAMTECHNI's data team is ready to help.",
        'Ready to unlock the power of your business data? Contact our analytics engineers today for an exploratory consultation and project roadmap.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Which BI tool is best for our business: Power BI, Tableau, or Looker Studio?',
      answer:
        'It depends on your current software stack and team size. Microsoft Power BI is ideal for businesses already using Microsoft 365 and Windows. Looker Studio is excellent for marketing teams and Google Workspace users wanting fast, free dashboards. Tableau is powerful for deep exploratory data science. We evaluate your workflows and recommend the most cost-effective solution.',
    },
    {
      question: 'How long does a data analytics and dashboard project take?',
      answer:
        'A standard business dashboard with existing clean data typically takes 1 to 2 weeks. More complex projects involving messy historical data, multiple software integrations (ERP + CRM + Accounting), and custom ETL warehousing generally take 3 to 6 weeks.',
    },
    {
      question: 'Can you connect our existing ERP, CRM, and accounting software (Tally, Zoho, SAP)?',
      answer:
        'Yes. We build custom API connectors and automated export pipelines for popular platforms including Zoho Books/CRM, Tally ERP/Prime, SAP, Shopify, WooCommerce, Salesforce, and custom SQL databases.',
    },
    {
      question: 'How do you ensure our sensitive financial and customer data stays secure?',
      answer:
        'Data security is paramount. We implement strict role-based access control (RBAC), end-to-end encryption in transit and at rest, and zero-trust credentials. Your data is stored within your own private cloud or on-premise infrastructure, and IAMTECHNI never retains or shares proprietary business data.',
    },
    {
      question: 'Do we need an in-house data engineer to maintain the dashboards?',
      answer:
        'No. We build automated, self-healing pipelines with schema validation and error alerting. Dashboards refresh on schedule without manual intervention. We also train your team to make basic adjustments and offer ongoing maintenance plans if you need regular updates.',
    },
    {
      question: 'How much do data analytics and BI services cost?',
      answer:
        'Costs depend on the number of data sources, historical volume, pipeline complexity, and visualization requirements. We provide transparent, fixed-scope milestone pricing or flexible retainer packages tailored to growing Indian businesses and global enterprises.',
    },
  ],
};

export default dataAnalyticsSeoPage;
