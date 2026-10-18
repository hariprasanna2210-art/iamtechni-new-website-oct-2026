import React from 'react';
import {
  Code2,
  Palette,
  ShoppingBag,
  Layers,
  Smartphone,
  Cpu,
  Bot,
  TrendingUp,
  Search,
  Share2,
  Cloud,
  Workflow,
  Server,
  BarChart3,
  ShieldCheck,
  Compass,
  GraduationCap,
  Sparkles,
  Terminal,
  Activity,
  Database,
  Globe,
  Radio,
  Building,
  Briefcase,
  Factory,
  Landmark,
  Stethoscope,
  BookOpen,
  Zap,
  CheckCircle2,
  LucideIcon
} from 'lucide-react';

/**
 * Returns the definitive Lucide icon for any service slug or category
 */
export const getServiceIcon = (slugOrName: string): LucideIcon => {
  const key = slugOrName.toLowerCase().trim();

  if (key.includes('web') || key.includes('website')) return Code2;
  if (key.includes('ui') || key.includes('ux') || key.includes('design')) return Palette;
  if (key.includes('ecom') || key.includes('commerce') || key.includes('store')) return ShoppingBag;
  if (key.includes('custom') || key.includes('software')) return Layers;
  if (key.includes('mobile') || key.includes('app') || key.includes('android') || key.includes('ios')) return Smartphone;
  if (key.includes('generative') || key.includes('genai') || key.includes('gpt')) return Bot;
  if (key.includes('ai') || key.includes('machine') || key.includes('intelligence')) return Cpu;
  if (key.includes('robot') || key.includes('hardware') || key.includes('iot')) return Activity;
  if (key.includes('seo')) return Search;
  if (key.includes('social') || key.includes('media')) return Share2;
  if (key.includes('marketing') || key.includes('growth')) return TrendingUp;
  if (key.includes('devops') || key.includes('pipeline')) return Workflow;
  if (key.includes('migration')) return Server;
  if (key.includes('cloud')) return Cloud;
  if (key.includes('data') || key.includes('analytics') || key.includes('bi')) return BarChart3;
  if (key.includes('security') || key.includes('cyber') || key.includes('audit')) return ShieldCheck;
  if (key.includes('consult') || key.includes('advisory') || key.includes('strategy')) return Compass;
  if (key.includes('train') || key.includes('education') || key.includes('learning')) return GraduationCap;

  return Sparkles;
};

/**
 * Returns the definitive Lucide icon for industry sectors
 */
export const getIndustryIcon = (industryNameOrId: string): LucideIcon => {
  const key = industryNameOrId.toLowerCase().trim();

  if (key.includes('health') || key.includes('medical') || key.includes('life')) return Stethoscope;
  if (key.includes('retail') || key.includes('e-commerce') || key.includes('consumer')) return ShoppingBag;
  if (key.includes('fin') || key.includes('bank') || key.includes('wealth')) return Landmark;
  if (key.includes('manufactur') || key.includes('industrial') || key.includes('iot')) return Factory;
  if (key.includes('edu') || key.includes('learn') || key.includes('school')) return GraduationCap;
  if (key.includes('prof') || key.includes('consult') || key.includes('legal') || key.includes('b2b')) return Briefcase;

  return Building;
};

/**
 * Returns icons for workflow/process steps
 */
export const getProcessStepIcon = (stepNum: number | string): LucideIcon => {
  const n = String(stepNum).replace(/[^0-9]/g, '');
  switch (n) {
    case '1':
      return Search;
    case '2':
      return Compass;
    case '3':
      return Palette;
    case '4':
      return Terminal;
    case '5':
      return ShieldCheck;
    case '6':
      return Cloud;
    case '7':
      return TrendingUp;
    default:
      return Sparkles;
  }
};

/**
 * Returns technology stack icons
 */
export const getTechCategoryIcon = (categoryId: string): LucideIcon => {
  const key = categoryId.toLowerCase();
  if (key.includes('front')) return Code2;
  if (key.includes('back')) return Server;
  if (key.includes('cms') || key.includes('commerce')) return ShoppingBag;
  if (key.includes('cloud') || key.includes('infra')) return Cloud;
  if (key.includes('db') || key.includes('data')) return Database;
  if (key.includes('ai') || key.includes('ml')) return Cpu;
  if (key.includes('security')) return ShieldCheck;
  return Layers;
};

/**
 * Authentic vector logos for key technologies
 */
export const TechLogo: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-10 h-10' }) => {
  const k = name.toLowerCase().trim();

  // 1. React
  if (k.includes('react')) {
    return (
      <svg className={className} viewBox="-11.5 -10.23174 23 20.46348" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  // 2. Next.js
  if (k.includes('next')) {
    return (
      <svg className={className} viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="next-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
          <circle cx="90" cy="90" r="90" fill="#000" />
        </mask>
        <g mask="url(#next-mask)">
          <circle cx="90" cy="90" r="90" fill="#000" />
          <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="#FFF" />
          <rect x="115" y="54" width="12" height="72" fill="#FFF" />
        </g>
      </svg>
    );
  }

  // 3. TypeScript
  if (k.includes('typescript')) {
    return (
      <svg className={className} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <rect width="128" height="128" rx="20" fill="#3178C6" />
        <path d="M72.9 83.2c1.7 2.8 4 4.8 7.3 6.1 3.2 1.2 6.9 1.9 10.9 1.9 4.1 0 7.5-.7 10.1-2.1 2.6-1.4 4.5-3.3 5.7-5.8 1.2-2.5 1.7-5.4 1.7-8.6 0-3.3-.6-6-1.9-8.2-1.3-2.2-3.2-4.1-5.8-5.7-2.6-1.6-6-3.2-10.2-4.8-4.2-1.6-7.3-3.1-9.3-4.5-2-1.4-3.4-3-4.3-4.9-.9-1.9-1.3-4.1-1.3-6.6 0-2.8.7-5.2 2-7.3 1.3-2.1 3.2-3.8 5.7-5 2.5-1.2 5.5-1.8 9-1.8 3.5 0 6.6.6 9.3 1.8 2.7 1.2 4.8 2.9 6.4 5.2 1.6 2.3 2.5 5 2.8 8.1l-11.8 1.4c-.4-2.2-1.5-3.9-3.3-5.1-1.8-1.2-4-1.8-6.6-1.8-2.6 0-4.8.6-6.4 1.7-1.6 1.1-2.4 2.8-2.4 4.9 0 1.9.6 3.5 1.9 4.7 1.3 1.2 3.6 2.5 7.1 3.9 3.5 1.4 6.3 2.7 8.5 4 2.2 1.2 4 2.6 5.4 4.2 1.4 1.6 2.4 3.4 3.1 5.5.7 2.1 1 4.5 1 7.2 0 3.7-.8 7-2.5 9.8-1.7 2.8-4.1 5-7.3 6.6-3.2 1.6-7.1 2.4-11.7 2.4-5 0-9.4-.9-13.1-2.7-3.7-1.8-6.5-4.4-8.4-7.8l10.4-4.8zm-41-35.3H56v49H43.9V47.9H19.8V37.2h41.1v10.7H31.9z" fill="#FFF" />
      </svg>
    );
  }

  // 4. Tailwind CSS
  if (k.includes('tailwind')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" fill="#06B6D4" />
      </svg>
    );
  }

  // 5. Python
  if (k.includes('python')) {
    return (
      <svg className={className} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <path d="M63.5 8c-28.7 0-26.9 12.4-26.9 12.4l.1 12.8h27.4v3.9H26.3S8 35.1 8 63.8c0 28.7 16 27.7 16 27.7h9.5v-13.4s-.5-16 15.8-16h27.2s15.2.2 15.2-14.7V23.3S93.8 8 63.5 8zm-14.9 8.2c2.6 0 4.7 2.1 4.7 4.7s-2.1 4.7-4.7 4.7-4.7-2.1-4.7-4.7c0-2.6 2.1-4.7 4.7-4.7z" fill="#3776AB" />
        <path d="M64.5 120c28.7 0 26.9-12.4 26.9-12.4l-.1-12.8H63.9v-3.9h37.8s18.3 1.9 18.3-26.8c0-28.7-16-27.7-16-27.7h-9.5v13.4s.5 16-15.8 16H41.5s-15.2-.2-15.2 14.7v24.1s-2.1 15.4 28.2 15.4zm14.9-8.2c-2.6 0-4.7-2.1-4.7-4.7s2.1-4.7 4.7-4.7 4.7 2.1 4.7 4.7c0 2.6-2.1 4.7-4.7 4.7z" fill="#FFD43B" />
      </svg>
    );
  }

  // 6. Node.js
  if (k.includes('node')) {
    return (
      <svg className={className} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <path d="M64 8l54 31.2v62.4L64 122.8 10 99.2V36.8L64 8z" fill="#339933" />
        <path d="M64 16.5l46.7 27v53.9L64 114.4 17.3 97.4V43.5L64 16.5z" fill="#FFF" />
        <path d="M48 48v32h8V64h8v16h8V48h-8v10h-8V48h-8z" fill="#339933" />
      </svg>
    );
  }

  // 7. AWS (Amazon Web Services)
  if (k.includes('aws') || k.includes('amazon')) {
    return (
      <svg className={className} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <path d="M64 16C37.5 16 16 37.5 16 64s21.5 48 48 48 48-21.5 48-48S90.5 16 64 16z" fill="#232F3E" />
        <path d="M36 68c0-6 4-10 10-10 4 0 7 2 8 5l-4 2c-1-2-2-3-4-3-3 0-5 2-5 6s2 6 5 6c2 0 3-1 4-3l4 2c-1 3-4 5-8 5-6 0-10-4-10-10zm25-9h5v20h-5V59zm22 1c3 0 5 1 6 3l-3 2c-1-1-2-2-3-2-2 0-3 1-3 2 0 2 6 2 6 7 0 4-3 7-7 7-4 0-6-2-7-4l3-2c1 1 2 2 4 2 2 0 3-1 3-2 0-2-6-2-6-7 0-4 3-6 7-6zm-48 24c20 9 44 8 60-2 2-1 4 1 3 3-17 12-45 13-66 2-2-1-1-4 3-3z" fill="#FF9900" />
      </svg>
    );
  }

  // 8. Azure (Microsoft Azure)
  if (k.includes('azure') || k.includes('microsoft')) {
    return (
      <svg className={className} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 16L78 68l-36 44H18l24-34-10-62zm24 96l18-24 38-72h18L76 112H56z" fill="#0089D6" />
      </svg>
    );
  }

  // 9. Docker
  if (k.includes('docker')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186H8.1a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.12a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186h-2.12a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185M23.77 9.892c-.443-.8-1.504-1.233-2.585-1.077-.187.027-.37.078-.544.152-.404.17-.677.564-.813.978-.62-1.082-1.748-1.744-2.987-1.79-1.238-.046-2.428.536-3.13 1.53-.16-.01-.322-.016-.483-.016h-.988v1.986h.988c.174 0 .346.01.517.03.35.04.69.13 1.012.268.455.195.845.503 1.127.896.79 1.1 2.203 1.624 3.518 1.306 1.315-.318 2.25-1.408 2.327-2.71.01-.177.01-.355-.002-.533" fill="#2496ED" />
        <path d="M23.96 11.234c-.11-.79-.537-1.464-1.184-1.9-.387-.26-.838-.4-1.303-.4-.14 0-.28.012-.418.038-.806.147-1.464.71-1.728 1.482-.69-.99-1.815-1.58-3.033-1.58-.152 0-.304.01-.456.03V6.89h-1.986v2.103c-.237.065-.466.155-.684.268H0c.18 2.582 1.378 4.983 3.315 6.643 2.115 1.812 4.904 2.812 7.785 2.796 5.586-.03 10.575-3.69 12.35-8.995.178-.528.274-1.076.284-1.63-.004-.28-.094-.57-.274-.836" fill="#2496ED" />
      </svg>
    );
  }

  // 10. Kubernetes
  if (k.includes('kubernetes') || k.includes('k8s')) {
    return (
      <svg className={className} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <path d="M64 8l48.5 28v56L64 120l-48.5-28V36L64 8z" fill="#326CE5" />
        <circle cx="64" cy="64" r="16" fill="#FFF" />
        <circle cx="64" cy="38" r="6" fill="#FFF" />
        <circle cx="86" cy="51" r="6" fill="#FFF" />
        <circle cx="86" cy="77" r="6" fill="#FFF" />
        <circle cx="64" cy="90" r="6" fill="#FFF" />
        <circle cx="42" cy="77" r="6" fill="#FFF" />
        <circle cx="42" cy="51" r="6" fill="#FFF" />
      </svg>
    );
  }

  // 11. WooCommerce
  if (k.includes('woo')) {
    return (
      <svg className={className} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <rect width="128" height="128" rx="28" fill="#96588A" />
        <path d="M28 44h18l12 36 12-36h18l12 36 12-36h18l-18 52h-20l-12-34-12 34H46L28 44z" fill="#FFF" />
      </svg>
    );
  }

  // 12. WordPress
  if (k.includes('wordpress')) {
    return (
      <svg className={className} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <circle cx="64" cy="64" r="56" fill="#21759B" />
        <path d="M64 14C36.4 14 14 36.4 14 64c0 20.4 12.2 38 29.8 45.8L21.4 47.6c5.7-.3 11-.9 11-.9 4.9-.3 5.4-7.5.5-7.5 0 0-14.8 1.2-24.4 1.2C7.3 40.4 6.7 40.7 6.7 40.7L64 14zm34.2 36.4c1.8-3 3-6.5 3-10.4 0-11.8-8.5-17.6-17.6-17.6-14.7 0-23.7 14.5-23.7 29.5 0 8.6 5 16.5 10.9 16.5 3.3 0 6.2-2.3 6.2-5.7 0-3.3-2.5-6.1-2.5-9.3 0-3.9 3.2-7.5 7.6-7.5 4.3 0 7.7 3.4 7.7 8.3 0 9.8-8.7 18.2-18.7 18.2-13.4 0-23.5-10.5-23.5-24.3 0-16.7 13.5-30.8 32.2-30.8 17.5 0 28.6 11.8 28.6 27.5 0 6.3-2 12.5-4.8 17.6l-8.4 24.3z" fill="#FFF" />
      </svg>
    );
  }

  // 13. Vite
  if (k.includes('vite')) {
    return (
      <svg className={className} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <path d="M120 18L64 122 8 18h112z" fill="#41D1FF" />
        <path d="M120 18L64 122 88 18h32z" fill="#BD34FE" />
        <path d="M62 30l-28 34h20l-6 32 34-40H62l10-26H62z" fill="#FFD427" />
      </svg>
    );
  }

  // 14. Stripe
  if (k.includes('stripe')) {
    return (
      <svg className={className} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <rect width="128" height="128" rx="28" fill="#635BFF" />
        <path d="M57.4 51.5c0-4.6 3.8-6.3 9.9-6.3 8.7 0 19.8 3.5 19.8 3.5l3.8-17.7s-9.3-3.8-21.7-3.8c-18.8 0-31.2 9.9-31.2 26.5 0 25.8 35.5 21.6 35.5 32.7 0 5.4-4.8 7.2-11.5 7.2-10.1 0-23.1-4.7-23.1-4.7l-4.1 18.2s11.5 4.9 24.9 4.9c19.6 0 33.3-9.7 33.3-26.7 0-27.9-35.6-23.1-35.6-33.8z" fill="#FFF" />
      </svg>
    );
  }

  // 15. GitHub Actions
  if (k.includes('github')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fill="#24292F" />
      </svg>
    );
  }

  // Default fallback to Code or Server
  if (k.includes('fastapi') || k.includes('express')) {
    return <Terminal className={className} />;
  }
  if (k.includes('sql') || k.includes('db') || k.includes('data')) {
    return <Database className={className} />;
  }
  return <Code2 className={className} />;
};
