import { JobItem, JobFilterParams } from './jobTypes.js';

// Initial production-ready seed catalog for Job Finder Pro – Powered by IAMTECHNI
const INITIAL_JOBS: JobItem[] = [
  {
    id: 'job-iamt-001',
    title: 'Senior React Native & Mobile Systems Engineer',
    slug: 'senior-react-native-mobile-systems-engineer',
    companyName: 'IAMTECHNI Solutions',
    companyLogo: '/iamtechni-symbol.svg',
    companyWebsite: 'https://iamtechni.com',
    companyEmail: 'careers@iamtechni.com',
    companyDescription: 'IAMTECHNI is a global enterprise technology company delivering scalable cloud architectures, AI systems, and mobile engineering solutions.',
    categoryId: 'cat-mobile',
    categoryName: 'Mobile Development',
    sourceType: 'ADMIN_MANUAL',
    sourceName: 'IAMTECHNI Direct Verified',
    description: 'We are seeking an experienced Senior React Native Engineer to architect high-performance cross-platform Android and iOS applications with offline-first caching, push notification infrastructure, and smooth 60fps animations.',
    responsibilities: [
      'Architect, develop, and maintain production React Native mobile apps using TypeScript and Expo.',
      'Integrate native Android Java/Kotlin modules and optimize bridge communication.',
      'Implement real-time background sync, offline persistence, and Firebase Cloud Messaging.',
      'Collaborate with UI/UX designers to implement high-fidelity design systems.'
    ],
    qualifications: [
      '4+ years of production experience in React Native and TypeScript.',
      'Deep understanding of Android build tools (Gradle, EAS, ProGuard).',
      'Solid grasp of state management, REST/GraphQL APIs, and secure token storage.'
    ],
    requiredSkills: ['React Native', 'TypeScript', 'Expo', 'Android', 'Redux / Zustand', 'REST APIs'],
    experienceRequirement: '3–5 years',
    experienceLevel: 'THREE_TO_FIVE_YEARS',
    educationRequirement: "Bachelor's Degree in Computer Science or equivalent",
    educationLevel: 'BACHELORS',
    salaryMin: 1800000,
    salaryMax: 2800000,
    salaryCurrency: 'INR',
    salaryPeriod: 'yearly',
    isSalaryDisclosed: true,
    employmentType: 'FULL_TIME',
    workLocationType: 'HYBRID',
    country: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    locationString: 'Bengaluru, Karnataka, India',
    isRemoteEligible: true,
    visaSponsorship: false,
    relocationAssistance: true,
    internationalApplicantsAccepted: false,
    immediateJoining: true,
    applicationUrl: 'https://iamtechni.com/careers',
    applicationEmail: 'careers@iamtechni.com',
    isExternalApplication: true,
    status: 'PUBLISHED',
    isFeatured: true,
    adminPosted: true,
    postedByAdminName: 'IAMTECHNI HR Lead',
    clickCount: 142,
    viewsCount: 890,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'job-iamt-002',
    title: 'Cloud DevOps & Kubernetes Architect',
    slug: 'cloud-devops-kubernetes-architect',
    companyName: 'IAMTECHNI Solutions',
    companyLogo: '/iamtechni-symbol.svg',
    companyWebsite: 'https://iamtechni.com',
    companyEmail: 'careers@iamtechni.com',
    companyDescription: 'IAMTECHNI empowers global enterprises with resilient cloud architectures and high-velocity continuous delivery pipelines.',
    categoryId: 'cat-cloud',
    categoryName: 'Cloud & DevOps',
    sourceType: 'ADMIN_MANUAL',
    sourceName: 'IAMTECHNI Direct Verified',
    description: 'Looking for a seasoned Cloud DevOps Architect to lead AWS/GCP infrastructure as code, Terraform automation, zero-downtime blue/green deployments, and multi-region Kubernetes clusters.',
    responsibilities: [
      'Design resilient multi-cloud infrastructure on AWS and Google Cloud Platform using Terraform.',
      'Administer production Kubernetes (EKS/GKE) clusters with Istio service mesh.',
      'Establish automated CI/CD pipelines, security scanning, and Prometheus/Grafana observability.',
      'Optimize cloud computing costs and scale-to-zero architectures.'
    ],
    qualifications: [
      '5+ years in DevOps, SRE, or Cloud Infrastructure.',
      'Certified Kubernetes Administrator (CKA) or AWS/GCP Professional Architect.',
      'Hands-on expertise in Terraform, Docker, Helm, and GitHub Actions.'
    ],
    requiredSkills: ['Kubernetes', 'AWS', 'Google Cloud', 'Terraform', 'Docker', 'CI/CD', 'Prometheus'],
    experienceRequirement: '5–10 years',
    experienceLevel: 'FIVE_TO_TEN_YEARS',
    educationRequirement: "Bachelor's or Master's in Engineering",
    educationLevel: 'BACHELORS',
    salaryMin: 2400000,
    salaryMax: 3800000,
    salaryCurrency: 'INR',
    salaryPeriod: 'yearly',
    isSalaryDisclosed: true,
    employmentType: 'FULL_TIME',
    workLocationType: 'REMOTE',
    country: 'India',
    state: 'Telangana',
    city: 'Hyderabad',
    locationString: 'Hyderabad, Telangana, India (Remote Available)',
    isRemoteEligible: true,
    visaSponsorship: false,
    relocationAssistance: false,
    internationalApplicantsAccepted: true,
    immediateJoining: false,
    applicationUrl: 'https://iamtechni.com/careers',
    applicationEmail: 'careers@iamtechni.com',
    isExternalApplication: true,
    status: 'PUBLISHED',
    isFeatured: true,
    adminPosted: true,
    postedByAdminName: 'IAMTECHNI Staffing',
    clickCount: 95,
    viewsCount: 620,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'job-ext-003',
    title: 'Software Development Engineer - Fresher / Early Career',
    slug: 'software-development-engineer-fresher-early-career',
    companyName: 'Infosys Technologies',
    companyLogo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=128&q=80',
    companyWebsite: 'https://www.infosys.com/careers',
    companyDescription: 'Infosys is a global leader in next-generation digital services and consulting.',
    categoryId: 'cat-software',
    categoryName: 'Software Engineering',
    sourceType: 'AUTOMATED_FEED',
    sourceName: 'National IT Portal Feed',
    description: 'Infosys is hiring passionate graduate engineers and freshers for foundational software engineering roles across Java, Spring Boot, Python, and SQL. Comprehensive 3-month foundation training included.',
    responsibilities: [
      'Write clean, modular code following standard object-oriented design principles.',
      'Participate in agile sprints, bug fixing, and unit testing.',
      'Collaborate with global clients in financial services, retail, and healthcare.'
    ],
    qualifications: [
      'B.Tech / B.E. / MCA in Computer Science, IT, or related fields (2025/2026 Batch).',
      'Strong problem solving, data structures, and algorithms skills.',
      'Basic knowledge of Java, Python, or C++ and relational databases.'
    ],
    requiredSkills: ['Java', 'Python', 'SQL', 'Data Structures', 'OOP', 'Git'],
    experienceRequirement: 'Fresher (0–1 year)',
    experienceLevel: 'FRESHER',
    educationRequirement: 'B.E. / B.Tech / MCA / B.Sc Computer Science',
    educationLevel: 'BACHELORS',
    salaryMin: 450000,
    salaryMax: 700000,
    salaryCurrency: 'INR',
    salaryPeriod: 'yearly',
    isSalaryDisclosed: true,
    employmentType: 'FULL_TIME',
    workLocationType: 'ONSITE',
    country: 'India',
    state: 'Maharashtra',
    city: 'Pune',
    locationString: 'Pune, Maharashtra, India',
    isRemoteEligible: false,
    visaSponsorship: false,
    relocationAssistance: true,
    internationalApplicantsAccepted: false,
    immediateJoining: true,
    applicationUrl: 'https://career.infosys.com/joblist',
    isExternalApplication: true,
    status: 'PUBLISHED',
    isFeatured: false,
    adminPosted: false,
    clickCount: 420,
    viewsCount: 2450,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'job-ext-004',
    title: 'Senior Full Stack Engineer (TypeScript & Next.js)',
    slug: 'senior-full-stack-engineer-typescript-nextjs',
    companyName: 'Stripe',
    companyLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=128&q=80',
    companyWebsite: 'https://stripe.com/jobs',
    companyDescription: 'Stripe builds economic infrastructure for the internet, powering businesses of all sizes worldwide.',
    categoryId: 'cat-software',
    categoryName: 'Software Engineering',
    sourceType: 'AUTOMATED_FEED',
    sourceName: 'RemoteOK Permitted API',
    description: 'Join Stripes developer platform team to craft delightful developer experiences, intuitive dashboard interfaces, and robust payment integrations used by millions of developers globally.',
    responsibilities: [
      'Build performant, accessible web user interfaces with React, Next.js, and TypeScript.',
      'Develop resilient backend APIs handling thousands of financial transactions per second.',
      'Ensure high security standards, PCI compliance, and rigorous automated testing.'
    ],
    qualifications: [
      '4+ years writing robust web applications at scale.',
      'Deep fluency in modern TypeScript, React, Node.js, and distributed systems.',
      'Strong communication skills and customer-centric engineering mindset.'
    ],
    requiredSkills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'APIs'],
    experienceRequirement: '3–5 years',
    experienceLevel: 'THREE_TO_FIVE_YEARS',
    educationRequirement: "Bachelor's Degree or equivalent practical experience",
    educationLevel: 'BACHELORS',
    salaryMin: 140000,
    salaryMax: 185000,
    salaryCurrency: 'USD',
    salaryPeriod: 'yearly',
    isSalaryDisclosed: true,
    employmentType: 'FULL_TIME',
    workLocationType: 'REMOTE',
    country: 'United States',
    state: 'California',
    city: 'San Francisco',
    locationString: 'San Francisco, CA, USA (Worldwide Remote)',
    isRemoteEligible: true,
    visaSponsorship: true,
    relocationAssistance: true,
    internationalApplicantsAccepted: true,
    immediateJoining: false,
    applicationUrl: 'https://stripe.com/jobs',
    isExternalApplication: true,
    status: 'PUBLISHED',
    isFeatured: true,
    adminPosted: false,
    clickCount: 310,
    viewsCount: 1890,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'job-ext-005',
    title: 'AI / Machine Learning Engineer (LLMs & Vision)',
    slug: 'ai-machine-learning-engineer-llms-vision',
    companyName: 'Siemens Technology',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=128&q=80',
    companyWebsite: 'https://jobs.siemens.com',
    companyDescription: 'Siemens is a technology company focused on industry, infrastructure, transport, and healthcare.',
    categoryId: 'cat-ai',
    categoryName: 'AI & Data Science',
    sourceType: 'AUTOMATED_FEED',
    sourceName: 'Arbeitnow European Feed',
    description: 'We are seeking an applied Machine Learning Engineer in Munich or Berlin to build state-of-the-art vision models and generative AI systems for industrial robotics and smart manufacturing facilities.',
    responsibilities: [
      'Design and deploy deep learning and computer vision pipelines for industrial quality inspection.',
      'Fine-tune foundation models and build retrieval-augmented generation (RAG) agents.',
      'Optimize ONNX/TensorRT inference for edge computing devices and IoT gateways.'
    ],
    qualifications: [
      'Masters or PhD in Computer Science, Machine Learning, or Robotics.',
      'Proficiency in PyTorch, Python, OpenCV, and Hugging Face.',
      'Experience deploying models in production Linux environments.'
    ],
    requiredSkills: ['Python', 'PyTorch', 'Computer Vision', 'LLMs', 'Docker', 'TensorRT'],
    experienceRequirement: '3–5 years',
    experienceLevel: 'THREE_TO_FIVE_YEARS',
    educationRequirement: "Master's Degree or Doctorate",
    educationLevel: 'MASTERS',
    salaryMin: 75000,
    salaryMax: 105000,
    salaryCurrency: 'EUR',
    salaryPeriod: 'yearly',
    isSalaryDisclosed: true,
    employmentType: 'FULL_TIME',
    workLocationType: 'HYBRID',
    country: 'Germany',
    state: 'Bavaria',
    city: 'Munich',
    locationString: 'Munich, Bavaria, Germany',
    isRemoteEligible: true,
    visaSponsorship: true,
    relocationAssistance: true,
    internationalApplicantsAccepted: true,
    immediateJoining: false,
    applicationUrl: 'https://jobs.siemens.com',
    isExternalApplication: true,
    status: 'PUBLISHED',
    isFeatured: true,
    adminPosted: false,
    clickCount: 220,
    viewsCount: 1400,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'job-ext-006',
    title: 'Lead Product Designer (Mobile & Design Systems)',
    slug: 'lead-product-designer-mobile-design-systems',
    companyName: 'Canva',
    companyLogo: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=128&q=80',
    companyWebsite: 'https://www.canva.com/careers',
    companyDescription: 'Canva empowers the world to design, with over 170 million monthly active users.',
    categoryId: 'cat-design',
    categoryName: 'UI / UX Design',
    sourceType: 'AUTOMATED_FEED',
    sourceName: 'Global Tech Careers Feed',
    description: 'Looking for a Lead Product Designer to shape the next generation of mobile visual creation tools on Android and iOS. Focus on micro-interactions, responsive design, and intuitive user workflows.',
    responsibilities: [
      'Lead mobile UI/UX vision across end-to-end user journeys.',
      'Establish tokens, accessible typography, and component patterns for global scale.',
      'Conduct usability testing with diverse international user cohorts.'
    ],
    qualifications: [
      '6+ years designing consumer mobile applications.',
      'Mastery of Figma, design tokens, and Android Material 3 guidelines.',
      'Strong portfolio demonstrating high-craft mobile interfaces.'
    ],
    requiredSkills: ['Figma', 'Mobile UI/UX', 'Design Systems', 'User Research', 'Prototyping'],
    experienceRequirement: '5–10 years',
    experienceLevel: 'FIVE_TO_TEN_YEARS',
    educationRequirement: "Bachelor's Degree in Design, HCI, or equivalent portfolio",
    educationLevel: 'BACHELORS',
    salaryMin: 160000,
    salaryMax: 210000,
    salaryCurrency: 'AUD',
    salaryPeriod: 'yearly',
    isSalaryDisclosed: true,
    employmentType: 'FULL_TIME',
    workLocationType: 'HYBRID',
    country: 'Australia',
    state: 'New South Wales',
    city: 'Sydney',
    locationString: 'Sydney, NSW, Australia',
    isRemoteEligible: true,
    visaSponsorship: true,
    relocationAssistance: true,
    internationalApplicantsAccepted: true,
    immediateJoining: false,
    applicationUrl: 'https://www.canva.com/careers',
    isExternalApplication: true,
    status: 'PUBLISHED',
    isFeatured: false,
    adminPosted: false,
    clickCount: 165,
    viewsCount: 940,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'job-ext-007',
    title: 'Senior Fintech Backend Engineer (Go & PostgreSQL)',
    slug: 'senior-fintech-backend-engineer-go-postgresql',
    companyName: 'Careem / Grab',
    companyLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=128&q=80',
    companyWebsite: 'https://www.careem.com/careers',
    companyDescription: 'The Super App of the greater Middle East, serving tens of millions of customers.',
    categoryId: 'cat-software',
    categoryName: 'Software Engineering',
    sourceType: 'AUTOMATED_FEED',
    sourceName: 'MENA Tech Job Portal',
    description: 'Join the Digital Payments engineering team in Dubai Internet City building high-throughput payment settlement engines, wallet services, and fraud detection algorithms.',
    responsibilities: [
      'Develop microservices in Golang with high concurrency and sub-millisecond response times.',
      'Manage high-volume PostgreSQL databases with partitioning and replication.',
      'Design fault-tolerant event streams with Apache Kafka.'
    ],
    qualifications: [
      '4+ years backend development experience with Golang, Java, or C++.',
      'Solid experience in relational database tuning (PostgreSQL/MySQL) and Redis caching.',
      'Familiarity with financial ledger systems is a plus.'
    ],
    requiredSkills: ['Go (Golang)', 'PostgreSQL', 'Redis', 'Kafka', 'Microservices', 'Docker'],
    experienceRequirement: '3–5 years',
    experienceLevel: 'THREE_TO_FIVE_YEARS',
    educationRequirement: "Bachelor's Degree in Computer Science or Software Engineering",
    educationLevel: 'BACHELORS',
    salaryMin: 28000,
    salaryMax: 42000,
    salaryCurrency: 'AED',
    salaryPeriod: 'monthly',
    isSalaryDisclosed: true,
    employmentType: 'FULL_TIME',
    workLocationType: 'ONSITE',
    country: 'United Arab Emirates',
    state: 'Dubai',
    city: 'Dubai',
    locationString: 'Dubai Internet City, Dubai, UAE',
    isRemoteEligible: false,
    visaSponsorship: true,
    relocationAssistance: true,
    internationalApplicantsAccepted: true,
    immediateJoining: true,
    applicationUrl: 'https://www.careem.com/careers',
    isExternalApplication: true,
    status: 'PUBLISHED',
    isFeatured: true,
    adminPosted: false,
    clickCount: 290,
    viewsCount: 1680,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'job-ext-008',
    title: 'Cybersecurity Threat Intelligence Analyst',
    slug: 'cybersecurity-threat-intelligence-analyst',
    companyName: 'Barclays Global Service Centre',
    companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=128&q=80',
    companyWebsite: 'https://home.barclays/careers',
    companyDescription: 'Barclays is a British universal bank supporting millions of individuals and businesses worldwide.',
    categoryId: 'cat-security',
    categoryName: 'Cybersecurity',
    sourceType: 'AUTOMATED_FEED',
    sourceName: 'UK Financial Careers Feed',
    description: 'Looking for a Threat Intelligence Analyst in London / Northampton to monitor global cyber threats, conduct malware reverse-engineering, and protect international banking rails.',
    responsibilities: [
      'Analyze proactive threat actor indicators and APT tactics, techniques, and procedures (TTPs).',
      'Operate SIEM, SOAR, and EDR platforms to investigate incidents.',
      'Author threat intelligence bulletins for senior technology leadership.'
    ],
    qualifications: [
      '3+ years in SOC, Incident Response, or Cyber Threat Intelligence.',
      'Industry certifications such as CISSP, CEH, or GCTI.',
      'Knowledge of MITRE ATT&CK framework and Python scripting.'
    ],
    requiredSkills: ['Cybersecurity', 'Threat Intelligence', 'SIEM', 'Splunk', 'Incident Response', 'Python'],
    experienceRequirement: '3–5 years',
    experienceLevel: 'THREE_TO_FIVE_YEARS',
    educationRequirement: "Bachelor's Degree in Cybersecurity or Information Systems",
    educationLevel: 'BACHELORS',
    salaryMin: 65000,
    salaryMax: 88000,
    salaryCurrency: 'GBP',
    salaryPeriod: 'yearly',
    isSalaryDisclosed: true,
    employmentType: 'FULL_TIME',
    workLocationType: 'HYBRID',
    country: 'United Kingdom',
    state: 'England',
    city: 'London',
    locationString: 'Canary Wharf, London, United Kingdom',
    isRemoteEligible: true,
    visaSponsorship: true,
    relocationAssistance: true,
    internationalApplicantsAccepted: true,
    immediateJoining: false,
    applicationUrl: 'https://home.barclays/careers',
    isExternalApplication: true,
    status: 'PUBLISHED',
    isFeatured: false,
    adminPosted: false,
    clickCount: 175,
    viewsCount: 1120,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'job-ext-009',
    title: 'Mobile App Developer Internship (Android & Flutter)',
    slug: 'mobile-app-developer-internship-android-flutter',
    companyName: 'Flipkart Internet',
    companyLogo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=128&q=80',
    companyWebsite: 'https://www.flipkartcareers.com',
    companyDescription: 'Flipkart is one of Indias leading e-commerce marketplaces serving over 400 million registered users.',
    categoryId: 'cat-mobile',
    categoryName: 'Mobile Development',
    sourceType: 'AUTOMATED_FEED',
    sourceName: 'India Campus Hiring Feed',
    description: 'Exciting 6-month paid internship opportunity for pre-final and final year students to build cutting-edge e-commerce mobile features, AR product previews, and conversational shopping on Android.',
    responsibilities: [
      'Develop experimental shopping features using Kotlin and Flutter.',
      'Measure app startup latency, memory footprint, and network payload reduction.',
      'Work alongside principal mobile architects.'
    ],
    qualifications: [
      'Pre-final or Final year B.Tech / MCA student graduating in 2025/2026.',
      'Demonstrated interest with personal Android or Flutter side projects.',
      'Good understanding of OOP, data structures, and Git.'
    ],
    requiredSkills: ['Kotlin', 'Flutter', 'Android SDK', 'Java', 'Data Structures', 'Git'],
    experienceRequirement: 'Internship / Student',
    experienceLevel: 'INTERNSHIP',
    educationRequirement: 'Pursuing B.Tech / B.E. in Computer Science or IT',
    educationLevel: 'BACHELORS',
    salaryMin: 45000,
    salaryMax: 65000,
    salaryCurrency: 'INR',
    salaryPeriod: 'monthly',
    isSalaryDisclosed: true,
    employmentType: 'INTERNSHIP',
    workLocationType: 'ONSITE',
    country: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    locationString: 'Bellandur, Bengaluru, Karnataka, India',
    isRemoteEligible: false,
    visaSponsorship: false,
    relocationAssistance: true,
    internationalApplicantsAccepted: false,
    immediateJoining: true,
    applicationUrl: 'https://www.flipkartcareers.com',
    isExternalApplication: true,
    status: 'PUBLISHED',
    isFeatured: true,
    adminPosted: false,
    clickCount: 680,
    viewsCount: 3900,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'job-ext-010',
    title: 'Data Platform Engineer (Snowflake & Apache Spark)',
    slug: 'data-platform-engineer-snowflake-apache-spark',
    companyName: 'Shopee / Sea Group',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=128&q=80',
    companyWebsite: 'https://careers.shopee.sg',
    companyDescription: 'Sea is a leading global consumer internet company founded in Singapore.',
    categoryId: 'cat-data',
    categoryName: 'Data Analytics',
    sourceType: 'AUTOMATED_FEED',
    sourceName: 'Singapore Tech Gateway',
    description: 'Shopee is looking for a Data Platform Engineer in Singapore to build petabyte-scale data lakes, streaming ETL pipelines with Kafka and Flink, and low-latency analytics engines.',
    responsibilities: [
      'Scale real-time data pipelines processing 100+ billion events daily.',
      'Build robust data models in Snowflake and dbt.',
      'Optimize distributed compute workloads in Apache Spark.'
    ],
    qualifications: [
      '3+ years in Data Engineering or distributed backend systems.',
      'Expertise in Python, Scala, SQL, and Spark.',
      'Solid experience with cloud data warehouses (Snowflake, BigQuery).'
    ],
    requiredSkills: ['Apache Spark', 'Python', 'SQL', 'Snowflake', 'Kafka', 'dbt'],
    experienceRequirement: '3–5 years',
    experienceLevel: 'THREE_TO_FIVE_YEARS',
    educationRequirement: "Bachelor's Degree in Computer Science or Statistics",
    educationLevel: 'BACHELORS',
    salaryMin: 7500,
    salaryMax: 11500,
    salaryCurrency: 'SGD',
    salaryPeriod: 'monthly',
    isSalaryDisclosed: true,
    employmentType: 'FULL_TIME',
    workLocationType: 'HYBRID',
    country: 'Singapore',
    city: 'Singapore',
    locationString: 'Science Park, Singapore',
    isRemoteEligible: false,
    visaSponsorship: true,
    relocationAssistance: true,
    internationalApplicantsAccepted: true,
    immediateJoining: false,
    applicationUrl: 'https://careers.shopee.sg',
    isExternalApplication: true,
    status: 'PUBLISHED',
    isFeatured: false,
    adminPosted: false,
    clickCount: 195,
    viewsCount: 1040,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

class JobStore {
  private jobs: JobItem[] = [...INITIAL_JOBS];

  public getAllJobs(): JobItem[] {
    return [...this.jobs];
  }

  public getJobById(id: string): JobItem | undefined {
    const job = this.jobs.find((j) => j.id === id);
    if (job) {
      job.viewsCount += 1;
    }
    return job;
  }

  public trackJobClick(id: string): boolean {
    const job = this.jobs.find((j) => j.id === id);
    if (job) {
      job.clickCount += 1;
      return true;
    }
    return false;
  }

  public queryJobs(filters: JobFilterParams): { jobs: JobItem[]; total: number; page: number; limit: number } {
    let result = this.jobs.filter((j) => j.status === 'PUBLISHED');

    // Text search (Title, skills, company, description)
    if (filters.q && filters.q.trim()) {
      const q = filters.q.toLowerCase().trim();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.requiredSkills.some((s) => s.toLowerCase().includes(q)) ||
          j.locationString.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q)
      );
    }

    if (filters.title && filters.title.trim()) {
      const t = filters.title.toLowerCase().trim();
      result = result.filter((j) => j.title.toLowerCase().includes(t));
    }

    if (filters.company && filters.company.trim()) {
      const c = filters.company.toLowerCase().trim();
      result = result.filter((j) => j.companyName.toLowerCase().includes(c));
    }

    if (filters.skill && filters.skill.trim()) {
      const s = filters.skill.toLowerCase().trim();
      result = result.filter((j) => j.requiredSkills.some((sk) => sk.toLowerCase().includes(s)));
    }

    if (filters.category && filters.category !== 'ALL') {
      const cat = filters.category.toLowerCase().trim();
      result = result.filter(
        (j) =>
          (j.categoryId && j.categoryId.toLowerCase().includes(cat)) ||
          (j.categoryName && j.categoryName.toLowerCase().includes(cat))
      );
    }

    // Country & Location
    if (filters.country && filters.country !== 'ALL' && filters.country !== 'Worldwide') {
      const c = filters.country.toLowerCase().trim();
      result = result.filter((j) => j.country.toLowerCase() === c || (j.isRemoteEligible && c === 'remote'));
    }

    if (filters.city && filters.city.trim()) {
      const city = filters.city.toLowerCase().trim();
      result = result.filter((j) => j.city.toLowerCase().includes(city) || j.locationString.toLowerCase().includes(city));
    }

    // Work location type
    if (filters.locationType && filters.locationType !== 'ALL') {
      result = result.filter((j) => j.workLocationType === filters.locationType);
    }

    if (filters.isRemoteOnly) {
      result = result.filter((j) => j.workLocationType === 'REMOTE' || j.isRemoteEligible);
    }

    // Employment type
    if (filters.employmentType && filters.employmentType !== 'ALL') {
      result = result.filter((j) => j.employmentType === filters.employmentType);
    }

    // Experience level
    if (filters.experienceLevel && filters.experienceLevel !== 'ALL') {
      result = result.filter((j) => j.experienceLevel === filters.experienceLevel);
    }

    // Education level
    if (filters.educationLevel && filters.educationLevel !== 'ALL') {
      result = result.filter((j) => j.educationLevel === filters.educationLevel);
    }

    // Visa & Relocation
    if (filters.visaSponsorship) {
      result = result.filter((j) => j.visaSponsorship);
    }
    if (filters.relocationAssistance) {
      result = result.filter((j) => j.relocationAssistance);
    }
    if (filters.immediateJoining) {
      result = result.filter((j) => j.immediateJoining);
    }

    // Posted within days
    if (filters.postedWithinDays && filters.postedWithinDays > 0) {
      const cutoff = Date.now() - filters.postedWithinDays * 24 * 60 * 60 * 1000;
      result = result.filter((j) => new Date(j.postedAt).getTime() >= cutoff);
    }

    // Sorting
    if (filters.sortBy === 'salary_high') {
      result.sort((a, b) => (b.salaryMax || b.salaryMin || 0) - (a.salaryMax || a.salaryMin || 0));
    } else {
      // Default: latest
      result.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    }

    const total = result.length;
    const page = Math.max(1, filters.page || 1);
    const limit = Math.max(1, filters.limit || 20);
    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + limit);

    return {
      jobs: paginated,
      total,
      page,
      limit,
    };
  }

  public addJob(newJob: JobItem): JobItem {
    // Check duplicate by externalSourceRef if present
    if (newJob.externalSourceRef) {
      const existing = this.jobs.find((j) => j.externalSourceRef === newJob.externalSourceRef);
      if (existing) {
        return existing;
      }
    }
    this.jobs.unshift(newJob);
    return newJob;
  }

  public updateJob(id: string, updates: Partial<JobItem>): JobItem | null {
    const index = this.jobs.findIndex((j) => j.id === id);
    if (index === -1) return null;
    this.jobs[index] = {
      ...this.jobs[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.jobs[index];
  }

  public deleteJob(id: string): boolean {
    const initialLen = this.jobs.length;
    this.jobs = this.jobs.filter((j) => j.id !== id);
    return this.jobs.length < initialLen;
  }

  public getStats() {
    const total = this.jobs.length;
    const active = this.jobs.filter((j) => j.status === 'PUBLISHED').length;
    const expired = this.jobs.filter((j) => j.status === 'EXPIRED').length;
    const draft = this.jobs.filter((j) => j.status === 'DRAFT').length;
    const manual = this.jobs.filter((j) => j.adminPosted).length;
    const aggregated = this.jobs.filter((j) => !j.adminPosted).length;

    return {
      totalJobs: total,
      activeJobs: active,
      expiredJobs: expired,
      draftJobs: draft,
      manuallyPostedJobs: manual,
      aggregatedJobs: aggregated,
      totalViews: this.jobs.reduce((acc, j) => acc + (j.viewsCount || 0), 0),
      totalClicks: this.jobs.reduce((acc, j) => acc + (j.clickCount || 0), 0),
    };
  }
}

export const jobStore = new JobStore();
