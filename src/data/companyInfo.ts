import {
  PRIMARY_PHONE,
  PRIMARY_PHONE_LINK,
  SECONDARY_PHONE,
  SECONDARY_PHONE_LINK,
  WHATSAPP_LINK,
  SCHEMA_TELEPHONE,
} from '../constants/contact';

/**
 * Single source of truth for IAMTECHNI company contact details and SEO Organization metadata.
 */
export const COMPANY_CONTACT = {
  name: 'IAMTECHNI',
  phone: PRIMARY_PHONE,
  phoneRaw: PRIMARY_PHONE_LINK,
  phoneTel: `tel:${PRIMARY_PHONE_LINK}`,
  secondaryPhone: SECONDARY_PHONE,
  secondaryPhoneRaw: SECONDARY_PHONE_LINK,
  secondaryPhoneTel: `tel:${SECONDARY_PHONE_LINK}`,
  whatsappLink: WHATSAPP_LINK,
  schemaTelephone: SCHEMA_TELEPHONE,
  email: 'info@iamtechni.in',
  emailMailto: 'mailto:info@iamtechni.in',
  website: 'https://www.iamtechni.in',
  logoUrl: 'https://www.iamtechni.in/logo.png',
  ogImageUrl: 'https://www.iamtechni.in/og-image.png',
  businessDescription:
    'IAMTECHNI is an enterprise software engineering, web development, and AI company in Puducherry serving businesses across Pondicherry, Chennai, Coimbatore, Madurai, and Tamil Nadu. We build high-speed custom websites, e-commerce platforms, iOS & Android mobile apps, RAG & generative AI assistants, business process automation, and AWS/Azure cloud DevOps architectures with 100% source code and IP ownership. We also offer hands-on corporate and career technical training programs in Full Stack Development, .NET, Python, AI & Machine Learning, AWS, Azure, and DevOps. Contact us at +91 93859 48951 or visit www.iamtechni.in to start your project.',
  headquarters: 'Puducherry & Tamil Nadu, India',
  deliveryZones: 'Global Delivery (India, US, EMEA, APAC)',
  workingHours: 'Mon – Sat: 9:00 AM – 7:00 PM IST',
  responseTime: 'Within 1 business day for all technical inquiries',
  address: {
    addressLocality: 'Puducherry',
    addressRegion: 'Puducherry & Tamil Nadu',
    addressCountry: 'IN',
  },
  areaServed: ['Pondicherry', 'Tamil Nadu', 'Chennai', 'Coimbatore', 'India'],
  socialProfiles: [
    'https://www.linkedin.com/company/iamtechni/',
  ],
};
