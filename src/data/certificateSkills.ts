import type { LucideIcon } from 'lucide-react';
import {
  Award,
  BarChart3,
  Binary,
  Boxes,
  Cloud,
  Code2,
  Container,
  Cpu,
  Database,
  FileCode2,
  GitBranch,
  Globe,
  Layers,
  Palette,
  Server,
  Table2,
  Terminal,
} from 'lucide-react';

export const SIGNATURE_URL = '';

export interface CertificateSkillConfig {
  name: string;
  bgColor: string;
  iconColor: string;
  icon: LucideIcon;
  useBrandGradient?: boolean;
}

export const CERTIFICATE_SKILLS: CertificateSkillConfig[] = [
  {
    name: 'Python',
    bgColor: '#3776AB',
    iconColor: '#FFD43B',
    icon: Terminal,
  },
  {
    name: 'SQL',
    bgColor: '#E38C00',
    iconColor: '#FFFFFF',
    icon: Database,
  },
  {
    name: 'Excel',
    bgColor: '#1D7044',
    iconColor: '#FFFFFF',
    icon: Table2,
  },
  {
    name: 'Power BI',
    bgColor: '#F2C811',
    iconColor: '#14205A',
    icon: BarChart3,
  },
  {
    name: 'Pandas',
    bgColor: '#150458',
    iconColor: '#FF66C4',
    icon: Layers,
  },
  {
    name: 'NumPy',
    bgColor: '#4DABCF',
    iconColor: '#FFFFFF',
    icon: Binary,
  },
  {
    name: 'JavaScript',
    bgColor: '#F7DF1E',
    iconColor: '#14205A',
    icon: FileCode2,
  },
  {
    name: 'React',
    bgColor: '#20232A',
    iconColor: '#61DAFB',
    icon: Boxes,
  },
  {
    name: 'HTML',
    bgColor: '#E34F26',
    iconColor: '#FFFFFF',
    icon: Globe,
  },
  {
    name: 'CSS',
    bgColor: '#1572B6',
    iconColor: '#FFFFFF',
    icon: Palette,
  },
  {
    name: 'Node.js',
    bgColor: '#339933',
    iconColor: '#FFFFFF',
    icon: Server,
  },
  {
    name: 'Java',
    bgColor: '#007396',
    iconColor: '#FFFFFF',
    icon: Cpu,
  },
  {
    name: 'AWS',
    bgColor: '#232F3E',
    iconColor: '#FF9900',
    icon: Cloud,
  },
  {
    name: 'Docker',
    bgColor: '#2496ED',
    iconColor: '#FFFFFF',
    icon: Container,
  },
  {
    name: 'Figma',
    bgColor: '#F24E1E',
    iconColor: '#FFFFFF',
    icon: Palette,
  },
  {
    name: 'Git',
    bgColor: '#F05032',
    iconColor: '#FFFFFF',
    icon: GitBranch,
  },
];

const SKILL_LOOKUP = new Map<string, CertificateSkillConfig>(
  CERTIFICATE_SKILLS.map((skill) => [skill.name.toLowerCase(), skill])
);

export function getCertificateSkillConfig(toolName: string): CertificateSkillConfig {
  const normalized = toolName.trim().toLowerCase();
  const matched = SKILL_LOOKUP.get(normalized);
  if (matched) {
    return matched;
  }
  return {
    name: toolName.trim() || 'Skill',
    bgColor: '#1C35EA',
    iconColor: '#FFFFFF',
    icon: Code2 || Award,
    useBrandGradient: true,
  };
}

export const COURSE_DEFAULT_SKILLS: Record<string, string[]> = {
  'Data Analytics': ['Python', 'SQL', 'Excel', 'Power BI', 'Pandas', 'NumPy'],
  'Data Science': ['Python', 'SQL', 'Pandas', 'NumPy', 'Power BI', 'Git'],
  'Web Development': ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Git'],
  'Full Stack Development': ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'SQL'],
  'AI & Machine Learning': ['Python', 'Pandas', 'NumPy', 'SQL', 'Docker', 'Git'],
  Python: ['Python', 'SQL', 'Pandas', 'NumPy', 'Git', 'Docker'],
  Java: ['Java', 'SQL', 'HTML', 'CSS', 'JavaScript', 'Git'],
  'Mobile App Development': ['React', 'JavaScript', 'Node.js', 'Figma', 'Git', 'AWS'],
  'Cloud & DevOps': ['AWS', 'Docker', 'Git', 'Python', 'Node.js', 'SQL'],
  Cybersecurity: ['Python', 'AWS', 'Docker', 'SQL', 'Git', 'Node.js'],
  'UI/UX Design': ['Figma', 'HTML', 'CSS', 'JavaScript', 'React', 'Git'],
  'Digital Marketing': ['Excel', 'Power BI', 'HTML', 'CSS', 'Figma', 'SQL'],
  Other: ['Python', 'SQL', 'JavaScript', 'React', 'Git', 'AWS'],
};

export function getDefaultSkillsForCourse(courseName: string): string[] {
  const trimmed = courseName.trim();
  if (COURSE_DEFAULT_SKILLS[trimmed]) {
    return [...COURSE_DEFAULT_SKILLS[trimmed]];
  }
  const lower = trimmed.toLowerCase();
  for (const [key, skills] of Object.entries(COURSE_DEFAULT_SKILLS)) {
    if (key.toLowerCase() === lower) {
      return [...skills];
    }
  }
  return [...COURSE_DEFAULT_SKILLS['Data Analytics']];
}
