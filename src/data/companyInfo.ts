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
  headquarters: 'Puducherry & Tamil Nadu, India',
  deliveryZones: 'Global Delivery (India, US, EMEA, APAC)',
  workingHours: 'Mon – Sat: 9:00 AM – 7:00 PM IST',
  responseTime: 'Within 1 business day for all technical inquiries',
  address: {
    // TODO: Replace with exact physical street address in Puducherry / Tamil Nadu when finalized
    streetAddress: 'Puducherry & Tamil Nadu',
    addressLocality: 'Puducherry & Tamil Nadu',
    addressRegion: 'PY / TN',
    // TODO: Verify exact postal code for primary registered office
    postalCode: '605001',
    addressCountry: 'IN',
  },
  socialProfiles: [
    'https://www.linkedin.com/company/iamtechni/',
    // TODO: Add additional official social profile URLs (e.g., GitHub, X/Twitter, YouTube) when available
  ],
};
