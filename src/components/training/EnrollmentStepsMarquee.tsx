import React, { useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface EnrollmentStep {
  step: string;
  title: string;
  description: string;
  cardClass: string;
  badgeClass: string;
}

const ENROLLMENT_STEPS: EnrollmentStep[] = [
  {
    step: 'STEP 01',
    title: 'Select a Course',
    description:
      'Browse our 13 technology programs across software engineering, cloud, AI, and DevOps.',
    cardClass: 'bg-[#F4F8FF] border border-blue-200/80',
    badgeClass:
      'text-xs font-mono font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200',
  },
  {
    step: 'STEP 02',
    title: 'Submit Details',
    description:
      'Fill the enquiry form or message us on WhatsApp with your preferred schedule and learning mode.',
    cardClass: 'bg-[#F2FAFD] border border-cyan-200/80',
    badgeClass:
      'text-xs font-mono font-bold text-[#0284C7] bg-cyan-50 px-2.5 py-0.5 rounded border border-cyan-200',
  },
  {
    step: 'STEP 03',
    title: 'Receive Syllabus & Fee',
    description:
      'Our academic advisor shares the complete syllabus breakdown, upcoming batch timings, and fee structure.',
    cardClass: 'bg-[#F6F4FF] border border-violet-200/80',
    badgeClass:
      'text-xs font-mono font-bold text-[#7C3AED] bg-violet-50 px-2.5 py-0.5 rounded border border-violet-200',
  },
  {
    step: 'STEP 04',
    title: 'Confirm & Start Labs',
    description:
      'Join your batch cohort, access our code repos, and begin hands-on practical lab sessions.',
    cardClass: 'bg-[#F1FBF8] border border-teal-200/80',
    badgeClass:
      'text-xs font-mono font-bold text-[#0D9488] bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200',
  },
];

const StepCard: React.FC<{ item: EnrollmentStep; isDuplicate?: boolean }> = ({
  item,
  isDuplicate = false,
}) => (
  <div
    className={`w-[296px] shrink-0 p-6 rounded-2xl space-y-2.5 ${item.cardClass} ${
      isDuplicate ? '' : 'snap-start'
    }`}
  >
    <span className={`inline-block ${item.badgeClass}`}>{item.step}</span>
    <h3 className="text-base font-bold text-[#1E3A8A]">{item.title}</h3>
    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
  </div>
);

export const EnrollmentStepsMarquee: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const isTouchRef = useRef(false);

  if (prefersReducedMotion) {
    return (
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-10 bg-gradient-to-r from-white to-transparent z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-10 bg-gradient-to-l from-white to-transparent z-10"
        />
        <div className="flex items-stretch gap-6 overflow-x-auto pb-2 snap-x snap-mandatory touch-pan-x no-scrollbar">
          {ENROLLMENT_STEPS.map((item) => (
            <StepCard key={item.step} item={item} />
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
        className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10"
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
          {ENROLLMENT_STEPS.map((item) => (
            <StepCard key={item.step} item={item} />
          ))}
        </div>

        {/* Seamless visual duplicate hidden from screen readers */}
        <div className="flex items-stretch gap-6 pr-6 shrink-0" aria-hidden="true">
          {ENROLLMENT_STEPS.map((item) => (
            <StepCard key={`dup-${item.step}`} item={item} isDuplicate />
          ))}
        </div>
      </div>
    </div>
  );
};
