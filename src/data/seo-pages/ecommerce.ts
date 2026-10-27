import { ServicePageData } from './types';

export const ecommerceSeoPage: ServicePageData = {
  slug: 'ecommerce',
  seoTitle: 'E-commerce Development Services | Custom Online Storefronts | IAMTECHNI',
  metaDescription:
    'Build high-converting online stores with IAMTECHNI e-commerce development services. Custom B2B and D2C storefronts, secure payment gateways, and live inventory sync.',
  h1: 'E-commerce Development',
  sections: [
    {
      h2: 'High-Conversion Storefronts & Friction-Free Checkout Engines',
      paragraphs: [
        'IAMTECHNI engineers resilient online storefronts, multi-attribute product catalogs, and streamlined checkout funnels tailored for modern D2C brands and B2B distributors.',
        'We optimize every step of the buyer journey—from mobile-first product discovery and instant search filtering to tokenized payment gateway orchestration with Stripe, Razorpay, and UPI.',
      ],
    },
    {
      h2: 'Real-Time Inventory, ERP & Fulfillment Synchronization',
      paragraphs: [
        'Your storefront should never operate in a silo. We connect your commerce engine directly to warehouse management systems, accounting software, and shipping carriers for automated stock reservation and order tracking.',
        'Whether deploying headless commerce or hardened WooCommerce/Shopify architectures, we ensure durability under peak traffic bursts.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Which e-commerce platform do you recommend?',
      answer:
        'We evaluate your SKU volume, existing software stack, and customization needs. For content-rich brands, WooCommerce or headless commerce offers complete ownership; for fast retail, headless Shopify or custom APIs may be ideal.',
    },
    {
      question: 'How do you handle payment security?',
      answer:
        'We use tokenized payment integrations where sensitive card details never touch your server, maintaining strict compliance with PCI-DSS guidelines.',
    },
    {
      question: 'Can you integrate our online store with existing ERP or billing software?',
      answer:
        'Yes. We engineer real-time webhook and REST API bridges to synchronize inventory counts, pricing tiers, invoices, and shipping statuses automatically.',
    },
  ],
};

export default ecommerceSeoPage;
