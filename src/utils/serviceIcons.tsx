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
