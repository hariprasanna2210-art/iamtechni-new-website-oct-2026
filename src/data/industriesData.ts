import { IndustryItem } from '../types';

export const industriesData: IndustryItem[] = [
  {
    id: 'education-training',
    name: 'Education & Training',
    iconName: 'GraduationCap',
    summary: 'Helping institutions and training providers deliver interactive digital curricula, student project tracking, and modern learning management.',
    coreChallenges: [
      'Managing remote student engagement and cohort progress across disparate communication channels.',
      'Providing verifiable skill evaluation and project feedback at scale without overwhelming instructors.',
      'Legacy institutional LMS software with poor mobile responsiveness and high licensing overhead.'
    ],
    digitalOpportunities: [
      'Interactive, project-driven learning portals tailored to specific vocational and technical curricula.',
      'Automated assignment validation, code repository review queues, and milestone grading rubrics.',
      'Tamper-resistant digital certificate generation with public URL verification.'
    ],
    iamtechniSolutions: [
      'Custom LMS and training platform engineering with role-based student/instructor workspaces.',
      'Hands-on technical syllabus development and corporate team upskilling workshops.',
      'Mobile-first responsive web apps for self-paced video and laboratory access.'
    ],
    suggestedServices: [
      { name: 'Training & Skill Development', route: '/services/training' },
      { name: 'Web Development', route: '/services/web-development' }
    ]
  },
  {
    id: 'retail-ecommerce',
    name: 'Retail & E-commerce',
    iconName: 'ShoppingBag',
    summary: 'Enabling brands and wholesalers to modernize storefronts, streamline order fulfillment, and unify catalog inventory.',
    coreChallenges: [
      'Slow mobile shopping experiences resulting in high cart drop-off during checkout.',
      'Inventory reconciliation errors between physical shop inventory and digital stores.',
      'Inflexible legacy platforms unable to accommodate wholesale tiered pricing or unique bundle promotions.'
    ],
    digitalOpportunities: [
      'Sub-second headless storefronts optimized for mobile conversion and zero checkout friction.',
      'Automated inventory synchronization across point-of-sale, warehouse, and online sales channels.',
      'Tailored B2B self-service portals with tiered credit limits and volume price books.'
    ],
    iamtechniSolutions: [
      'Bespoke WooCommerce and headless e-commerce engineering with payment gateway integration.',
      'Technical SEO and product structured data optimization to maximize Google Shopping visibility.',
      'Automated abandoned checkout notification and re-engagement workflows.'
    ],
    suggestedServices: [
      { name: 'E-commerce Development', route: '/services/ecommerce' },
      { name: 'Digital Marketing & SEO', route: '/services/digital-marketing' }
    ]
  },
  {
    id: 'healthcare-administration',
    name: 'Healthcare Administration',
    iconName: 'Activity',
    summary: 'Building clear, privacy-conscious administrative software for clinics, diagnostic centers, and medical practitioners.',
    coreChallenges: [
      'High patient appointment no-show rates straining clinic scheduling and practitioner time.',
      'Fragmented communication between front-desk reception, doctors, and diagnostic labs.',
      'Ensuring strict confidentiality and secure access control without making software frustrating for staff.'
    ],
    digitalOpportunities: [
      'Self-service mobile-friendly booking portals with instant automated SMS/WhatsApp confirmations.',
      'Centralized room and medical equipment scheduling boards eliminating double-bookings.',
      'Accessible, high-contrast digital intake forms that eliminate illegible handwritten paper records.'
    ],
    iamtechniSolutions: [
      'Custom patient scheduling and clinic administration portals with role-based permissions.',
      'WCAG 2.2 AA accessible web application design tested for high contrast and keyboard ease.',
      'Defensive security hardening and encrypted storage for administrative operational logs.'
    ],
    suggestedServices: [
      { name: 'Custom Software Development', route: '/services/custom-software' },
      { name: 'UI/UX Design', route: '/services/ui-ux-design' }
    ]
  },
  {
    id: 'professional-services',
    name: 'Professional Services',
    iconName: 'Briefcase',
    summary: 'Empowering legal, accounting, consulting, and architecture firms with secure client portals and knowledge management.',
    coreChallenges: [
      'Disorganized document exchanges over email attachments leading to version confusion.',
      'Engineers and consultants spending hours searching through past work proposals and SOP documents.',
      'Client perception hindered by outdated, template-based company websites that fail to reflect expertise.'
    ],
    digitalOpportunities: [
      'Secure, branded client portals for document sharing, milestone sign-offs, and invoicing.',
      'Private Retrieval-Augmented Generation (RAG) assistants to query internal past proposals and policies.',
      'High-authority corporate web flagships communicating technical depth and enterprise credibility.'
    ],
    iamtechniSolutions: [
      'Custom client workspaces and authenticated document delivery systems.',
      'Enterprise RAG systems providing grounded answers with verifiable source document citations.',
      'Corporate flagship web engineering with responsive typography and technical branding.'
    ],
    suggestedServices: [
      { name: 'AI & Machine Learning', route: '/services/ai-machine-learning' },
      { name: 'Web Development', route: '/services/web-development' }
    ]
  },
  {
    id: 'manufacturing-operations',
    name: 'Manufacturing & Operations',
    iconName: 'Factory',
    summary: 'Connecting factory floors, maintenance technicians, and operations leaders through real-time dashboards and workflow tools.',
    coreChallenges: [
      'Reliance on end-of-shift paper logs that delay notification of machine degradation or high defect rates.',
      'Unplanned equipment downtime due to reactive rather than preventive maintenance tracking.',
      'Disjointed coordination between procurement, inventory, and production schedule lines.'
    ],
    digitalOpportunities: [
      'Live shop floor production boards calculating Overall Equipment Effectiveness (OEE) in real time.',
      'Touch-friendly mobile inspection tools enabling field operators to log halts with two taps.',
      'Centralized preventive maintenance calendars with automated spare part threshold alerts.'
    ],
    iamtechniSolutions: [
      'Industrial-grade dashboard engineering with high-contrast displays for factory lighting.',
      'Custom workflow systems for work-order approvals and preventive maintenance tracking.',
      'Data pipeline engineering consolidating production metrics into executive daily digests.'
    ],
    suggestedServices: [
      { name: 'Custom Software Development', route: '/services/custom-software' },
      { name: 'Data Analytics', route: '/services/data-analytics' }
    ]
  },
  {
    id: 'startups-emerging',
    name: 'Startups & Emerging Businesses',
    iconName: 'Rocket',
    summary: 'Guiding early-stage and high-growth ventures to architect, validate, and launch scalable digital products rapidly.',
    coreChallenges: [
      'Over-engineering initial versions with unnecessary complexity that drains startup runway.',
      'Accumulating severe technical debt by cutting foundational corners that prevent future scale.',
      'Balancing rapid speed-to-market with maintainable, testable code and security best practices.'
    ],
    digitalOpportunities: [
      'Rapid prototype development and functional MVP validation in weeks, not quarters.',
      'Clean TypeScript and cloud foundations that scale smoothly from initial users to enterprise pilots.',
      'Direct technical architecture advisory to prevent costly third-party vendor lock-in.'
    ],
    iamtechniSolutions: [
      'Full-stack MVP development using React, Node.js, and containerized architectures.',
      'Pragmatic technical consulting and Build vs Buy architecture recommendations.',
      'Search-optimized launch pages with validated lead-capture forms and analytics setup.'
    ],
    suggestedServices: [
      { name: 'Custom Software Development', route: '/services/custom-software' },
      { name: 'IT Consulting', route: '/services/it-consulting' }
    ]
  },
  {
    id: 'smes',
    name: 'Small & Medium Enterprises (SMEs)',
    iconName: 'Building2',
    summary: 'Delivering modern digital infrastructure, business automation, and growth engineering to established mid-market businesses.',
    coreChallenges: [
      'Operating across disconnected spreadsheets and manual phone processes that limit growth.',
      'Outgrowing entry-level software without the internal IT staff to build custom systems.',
      'Losing local and commercial search market share to tech-enabled regional competitors.'
    ],
    digitalOpportunities: [
      'Centralizing core business workflows into a unified internal operations dashboard.',
      'Modernizing customer touchpoints with online ordering, digital quotes, and self-service status.',
      'Establishing comprehensive local and organic SEO authority to capture qualified inbound demand.'
    ],
    iamtechniSolutions: [
      'Business process automation and custom internal tool development.',
      'Corporate website redesign with Core Web Vitals optimization and conversion funnels.',
      'Cloud modernization migrating fragile on-premise servers to secure, managed cloud environments.'
    ],
    suggestedServices: [
      { name: 'Web Development', route: '/services/web-development' },
      { name: 'Digital Marketing & SEO', route: '/services/digital-marketing' }
    ]
  }
];
