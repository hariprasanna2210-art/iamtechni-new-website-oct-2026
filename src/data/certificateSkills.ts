import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Award,
  BarChart3,
  Binary,
  Blocks,
  Bot,
  Boxes,
  Brain,
  BrainCircuit,
  Brush,
  Cloud,
  Code2,
  Container,
  Cpu,
  Database,
  FileCode2,
  Flame,
  FlaskConical,
  FolderGit2,
  GitBranch,
  Globe,
  Kanban,
  Layers,
  LayoutGrid,
  LayoutTemplate,
  LineChart,
  Lock,
  Megaphone,
  Network,
  Palette,
  PieChart,
  Send,
  Server,
  ShieldCheck,
  Sigma,
  Smartphone,
  Sparkles,
  Table2,
  Terminal,
  TestTube2,
  TrendingUp,
  Webhook,
  Wind,
} from 'lucide-react';

export const SIGNATURE_URL = '/hari-signature.png';

export interface CertificateSkillConfig {
  name: string;
  bgColor: string;
  iconColor: string;
  icon: LucideIcon;
  useBrandGradient?: boolean;
}

export const CERTIFICATE_SKILLS: CertificateSkillConfig[] = [
  // Core 16 tools
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

  // Additional 40 tools
  {
    name: 'TypeScript',
    bgColor: '#3178C6',
    iconColor: '#FFFFFF',
    icon: FileCode2,
  },
  {
    name: 'Next.js',
    bgColor: '#111827',
    iconColor: '#FFFFFF',
    icon: Layers,
  },
  {
    name: 'Angular',
    bgColor: '#DD0031',
    iconColor: '#FFFFFF',
    icon: ShieldCheck,
  },
  {
    name: 'Vue',
    bgColor: '#4FC08D',
    iconColor: '#14205A',
    icon: LayoutTemplate,
  },
  {
    name: 'Tailwind CSS',
    bgColor: '#06B6D4',
    iconColor: '#FFFFFF',
    icon: Wind,
  },
  {
    name: 'Bootstrap',
    bgColor: '#7952B3',
    iconColor: '#FFFFFF',
    icon: LayoutGrid,
  },
  {
    name: 'MongoDB',
    bgColor: '#47A248',
    iconColor: '#FFFFFF',
    icon: Database,
  },
  {
    name: 'MySQL',
    bgColor: '#4479A1',
    iconColor: '#FFFFFF',
    icon: Database,
  },
  {
    name: 'PostgreSQL',
    bgColor: '#336791',
    iconColor: '#FFFFFF',
    icon: Database,
  },
  {
    name: 'Firebase',
    bgColor: '#FFCA28',
    iconColor: '#14205A',
    icon: Flame,
  },
  {
    name: 'Flutter',
    bgColor: '#02569B',
    iconColor: '#54C5F8',
    icon: Smartphone,
  },
  {
    name: 'Kotlin',
    bgColor: '#7F52FF',
    iconColor: '#FFFFFF',
    icon: Smartphone,
  },
  {
    name: 'Swift',
    bgColor: '#F05138',
    iconColor: '#FFFFFF',
    icon: Smartphone,
  },
  {
    name: 'C',
    bgColor: '#555555',
    iconColor: '#A8B9CC',
    icon: Cpu,
  },
  {
    name: 'C++',
    bgColor: '#00599C',
    iconColor: '#FFFFFF',
    icon: Cpu,
  },
  {
    name: 'C#',
    bgColor: '#512BD4',
    iconColor: '#FFFFFF',
    icon: Code2,
  },
  {
    name: 'PHP',
    bgColor: '#777BB4',
    iconColor: '#FFFFFF',
    icon: Server,
  },
  {
    name: 'Django',
    bgColor: '#092E20',
    iconColor: '#FFFFFF',
    icon: Server,
  },
  {
    name: 'Flask',
    bgColor: '#1E293B',
    iconColor: '#FFFFFF',
    icon: FlaskConical,
  },
  {
    name: 'Spring Boot',
    bgColor: '#6DB33F',
    iconColor: '#FFFFFF',
    icon: Server,
  },
  {
    name: 'Azure',
    bgColor: '#0078D4',
    iconColor: '#FFFFFF',
    icon: Cloud,
  },
  {
    name: 'Google Cloud',
    bgColor: '#4285F4',
    iconColor: '#FFFFFF',
    icon: Cloud,
  },
  {
    name: 'Kubernetes',
    bgColor: '#326CE5',
    iconColor: '#FFFFFF',
    icon: Network,
  },
  {
    name: 'Linux',
    bgColor: '#FCC624',
    iconColor: '#14205A',
    icon: Terminal,
  },
  {
    name: 'Tableau',
    bgColor: '#E97627',
    iconColor: '#FFFFFF',
    icon: PieChart,
  },
  {
    name: 'Machine Learning',
    bgColor: '#4D19EA',
    iconColor: '#FFFFFF',
    icon: Brain,
  },
  {
    name: 'Deep Learning',
    bgColor: '#312E81',
    iconColor: '#38BDF8',
    icon: BrainCircuit,
  },
  {
    name: 'TensorFlow',
    bgColor: '#FF6F00',
    iconColor: '#FFFFFF',
    icon: Bot,
  },
  {
    name: 'Data Visualization',
    bgColor: '#0284C7',
    iconColor: '#FFFFFF',
    icon: LineChart,
  },
  {
    name: 'Statistics',
    bgColor: '#0D9488',
    iconColor: '#FFFFFF',
    icon: Sigma,
  },
  {
    name: 'Selenium',
    bgColor: '#43B02A',
    iconColor: '#FFFFFF',
    icon: TestTube2,
  },
  {
    name: 'Postman',
    bgColor: '#FF6C37',
    iconColor: '#FFFFFF',
    icon: Send,
  },
  {
    name: 'REST APIs',
    bgColor: '#0369A1',
    iconColor: '#FFFFFF',
    icon: Webhook,
  },
  {
    name: 'GitHub',
    bgColor: '#24292F',
    iconColor: '#FFFFFF',
    icon: FolderGit2,
  },
  {
    name: 'Jira',
    bgColor: '#0052CC',
    iconColor: '#FFFFFF',
    icon: Kanban,
  },
  {
    name: 'Photoshop',
    bgColor: '#001E36',
    iconColor: '#31A8FF',
    icon: Brush,
  },
  {
    name: 'Canva',
    bgColor: '#00C4CC',
    iconColor: '#FFFFFF',
    icon: Sparkles,
  },
  {
    name: 'SEO',
    bgColor: '#16A34A',
    iconColor: '#FFFFFF',
    icon: TrendingUp,
  },
  {
    name: 'Digital Marketing',
    bgColor: '#DB2777',
    iconColor: '#FFFFFF',
    icon: Megaphone,
  },
  {
    name: 'Cybersecurity',
    bgColor: '#0F172A',
    iconColor: '#22D3EE',
    icon: Lock,
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
    icon: Blocks || Activity || Award,
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
