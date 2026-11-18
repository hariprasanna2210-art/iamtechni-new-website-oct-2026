import React, { useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  Briefcase,
  Compass,
  GraduationCap,
  Laptop,
  Terminal,
  Users,
  Workflow,
} from 'lucide-react';

interface TrainingMarqueeCardData {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  cardClass: string;
  iconBoxClass: string;
  descriptionClass: string;
}

const PRACTICAL_APPROACH_CARDS: TrainingMarqueeCardData[] = [
  {
    id: 'hands-on-labs',
    title: 'Hands-on Code Labs',
    description:
      'Every session includes guided code-along labs and exercises pushed directly to your personal GitHub repository.',
    icon: Terminal,
    cardClass: 'bg-white border border-slate-200 shadow-2xs',
    iconBoxClass:
      'w-10 h-10 rounded-xl bg-blue-50 text-[#1266E8] flex items-center justify-center border border-blue-200',
    descriptionClass: 'text-xs text-slate-600 leading-relaxed',
  },
  {
    id: 'production-capstone',
    title: 'Production Capstone',
    description:
      'Build a real-world end-to-end project that mirrors industry standards, ready to showcase to hiring engineering managers.',
    icon: Laptop,
    cardClass: 'bg-white border border-slate-200 shadow-2xs',
    iconBoxClass:
      'w-10 h-10 rounded-xl bg-cyan-50 text-[#0284C7] flex items-center justify-center border border-cyan-200',
    descriptionClass: 'text-xs text-slate-600 leading-relaxed',
  },
  {
    id: 'code-reviews',
    title: 'Code Reviews & Mentoring',
    description:
      'Receive direct constructive code reviews from senior developers on code structure, readability, and performance.',
    icon: Users,
    cardClass: 'bg-white border border-slate-200 shadow-2xs',
    iconBoxClass:
      'w-10 h-10 rounded-xl bg-violet-50 text-[#7C3AED] flex items-center justify-center border border-violet-200',
    descriptionClass: 'text-xs text-slate-600 leading-relaxed',
  },
  {
    id: 'interview-prep',
    title: 'Interview & Skill Prep',
    description:
      'Learn how software companies evaluate engineers, structure technical portfolios, and conduct coding reviews.',
    icon: Briefcase,
    cardClass: 'bg-white border border-slate-200 shadow-2xs',
    iconBoxClass:
      'w-10 h-10 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center border border-teal-200',
    descriptionClass: 'text-xs text-slate-600 leading-relaxed',
  },
];

const WHO_CAN_JOIN_CARDS: TrainingMarqueeCardData[] = [
  {
    id: 'college-students',
    title: 'College Students',
    description:
      'Gain practical programming, database, and cloud skills ahead of campus interviews and academic capstone projects.',
    icon: GraduationCap,
    cardClass: 'bg-[#EAF3FF] border border-blue-200/90 shadow-2xs',
    iconBoxClass:
      'w-10 h-10 rounded-xl bg-[#1266E8] text-white flex items-center justify-center shadow-xs',
    descriptionClass: 'text-xs text-slate-700 leading-relaxed',
  },
  {
    id: 'fresh-graduates',
    title: 'Fresh Graduates',
    description:
      'Bridge the gap between college curricula and real industry expectations with production-ready code repositories.',
    icon: Briefcase,
    cardClass: 'bg-[#E4FAFF] border border-cyan-200/90 shadow-2xs',
    iconBoxClass:
      'w-10 h-10 rounded-xl bg-[#0284C7] text-white flex items-center justify-center shadow-xs',
    descriptionClass: 'text-xs text-slate-700 leading-relaxed',
  },
  {
    id: 'working-professionals',
    title: 'Working Professionals',
    description:
      'Upskill into high-growth disciplines like Cloud (AWS/Azure), Generative AI, or DevOps containerization via weekend batches.',
    icon: Workflow,
    cardClass: 'bg-[#F0EAFF] border border-violet-200/90 shadow-2xs',
    iconBoxClass:
      'w-10 h-10 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center shadow-xs',
    descriptionClass: 'text-xs text-slate-700 leading-relaxed',
  },
  {
    id: 'career-changers',
    title: 'Career Changers',
    description:
      'Transition smoothly from non-technical fields into software development through structured step-by-step guidance.',
    icon: Compass,
    cardClass: 'bg-[#E1F8F2] border border-teal-200/90 shadow-2xs',
    iconBoxClass:
      'w-10 h-10 rounded-xl bg-[#0D9488] text-white flex items-center justify-center shadow-xs',
    descriptionClass: 'text-xs text-slate-700 leading-relaxed',
  },
];

const MarqueeCard: React.FC<{
  item: TrainingMarqueeCardData;
  isDuplicate?: boolean;
}> = ({ item, isDuplicate = false }) => {
  const Icon = item.icon;
  return (
    <div
      className={`w-[min(296px,calc(100vw-3.5rem))] sm:w-[296px] shrink-0 p-5 sm:p-6 rounded-2xl space-y-3 ${item.cardClass} ${
        isDuplicate ? '' : 'snap-start'
      }`}
    >
      <div className={item.iconBoxClass}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
      <p className={item.descriptionClass}>{item.description}</p>
    </div>
  );
};

interface MarqueeStripProps {
  cards: TrainingMarqueeCardData[];
  fadeFromClass: string;
  fadeViaClass: string;
}

const MarqueeStrip: React.FC<MarqueeStripProps> = ({
  cards,
  fadeFromClass,
  fadeViaClass,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const isTouchRef = useRef(false);

  if (prefersReducedMotion) {
    return (
      <div className="relative">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-10 bg-gradient-to-r ${fadeFromClass} to-transparent z-10`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-10 bg-gradient-to-l ${fadeFromClass} to-transparent z-10`}
        />
        <div className="flex items-stretch gap-6 overflow-x-auto pb-2 snap-x snap-mandatory touch-pan-x no-scrollbar">
          {cards.map((item) => (
            <MarqueeCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden select-none"
      onMouseEnter={() => {
        if (!isTouchRef.current) {
          setIsPaused(true);
        }
      }}
      onMouseLeave={() => {
        isTouchRef.current = false;
        setIsPaused(false);
      }}
      onTouchStart={() => {
        isTouchRef.current = true;
        setIsPaused(true);
      }}
      onTouchEnd={() => {
        setIsPaused(false);
      }}
      onTouchCancel={() => {
        setIsPaused(false);
      }}
    >
      {/* Soft Left & Right Edge Fades */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-16 bg-gradient-to-r ${fadeFromClass} ${fadeViaClass} to-transparent z-10`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-16 bg-gradient-to-l ${fadeFromClass} ${fadeViaClass} to-transparent z-10`}
      />

      {/* Continuous Right-to-Left Marquee Track */}
      <div
        className="animate-enrollment-marquee items-stretch"
        style={{
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      >
        {/* Primary accessible set */}
        <div className="flex items-stretch gap-6 pr-6 shrink-0">
          {cards.map((item) => (
            <MarqueeCard key={item.id} item={item} />
          ))}
        </div>

        {/* Seamless visual duplicate hidden from screen readers */}
        <div className="flex items-stretch gap-6 pr-6 shrink-0" aria-hidden="true">
          {cards.map((item) => (
            <MarqueeCard key={`dup-${item.id}`} item={item} isDuplicate />
          ))}
        </div>
      </div>
    </div>
  );
};

export const PracticalApproachMarquee: React.FC = () => (
  <MarqueeStrip
    cards={PRACTICAL_APPROACH_CARDS}
    fadeFromClass="from-[#F5F8FC]"
    fadeViaClass="via-[#F5F8FC]/80"
  />
);

export const WhoCanJoinMarquee: React.FC = () => (
  <MarqueeStrip
    cards={WHO_CAN_JOIN_CARDS}
    fadeFromClass="from-white"
    fadeViaClass="via-white/80"
  />
);
