import React, { useState } from 'react';
import { Phone, Mail, Sparkles, ArrowRight } from 'lucide-react';
import { COMPANY_CONTACT } from '../../data/companyInfo';
import { PRIMARY_PHONE, PRIMARY_PHONE_LINK } from '../../constants/contact';
import { RotatingFrame } from '../common/RotatingFrame';

interface DirectInquiriesCardProps {
  onStartProject: () => void;
}

export const DirectInquiriesCard: React.FC<DirectInquiriesCardProps> = ({
  onStartProject,
}) => {
  const [activeScene, setActiveScene] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const handleButtonHover = (index: number) => {
    setIsPaused(true);
    setActiveScene(index);
  };

  const handleButtonLeave = () => {
    setIsPaused(false);
  };

  return (
    <div className="mb-14 p-5 sm:p-7 lg:p-8 rounded-2xl bg-white border border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.08)] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* LEFT TOP: Label row, Heading, Paragraph */}
        <div className="order-1 md:order-1 md:col-span-6 space-y-2.5 text-left">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-[#04C8E8] font-bold uppercase tracking-wider">
              DIRECT INQUIRIES &amp; PROJECT DISCOVERY
            </span>
            <span className="text-slate-400 hidden sm:inline">·</span>
            <span className="text-slate-500 block sm:inline">
              Response within 24 hours
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#0F1B3D] leading-snug">
            Have a project or technology requirement in mind?
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            Reach out to our engineering and consulting team directly by phone or email.
          </p>
        </div>

        {/* RIGHT: Compact Rotating Product Frame (300px height) */}
        <div className="order-2 md:order-2 md:col-span-6 md:row-span-2 w-full">
          <RotatingFrame
            variant="compact"
            activeIndex={activeScene}
            onSceneChange={setActiveScene}
            externalPaused={isPaused}
          />
        </div>

        {/* LEFT BOTTOM: 4 Real Action Buttons in 2x2 Grid */}
        <div className="order-3 md:order-3 md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {/* 1. Direct Phone */}
          <a
            href={`tel:${PRIMARY_PHONE_LINK}`}
            onMouseEnter={() => handleButtonHover(0)}
            onMouseLeave={handleButtonLeave}
            onFocus={() => handleButtonHover(0)}
            onBlur={handleButtonLeave}
            className={`min-h-[44px] min-w-[44px] inline-flex items-center gap-2.5 px-4 py-2.5 bg-teal-950 border text-teal-200 hover:text-white rounded-xl text-xs font-semibold transition-all duration-300 group ${
              activeScene === 0
                ? 'border-teal-400 ring-4 ring-teal-500/30 shadow-[0_8px_24px_rgba(20,184,166,0.28)] text-white'
                : 'border-teal-500/40 hover:border-teal-400 shadow-sm'
            }`}
            title={`Call ${PRIMARY_PHONE}`}
          >
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-300 group-hover:scale-110 transition-transform shrink-0">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 text-left">
              <div className="text-[10px] uppercase font-mono tracking-wider text-teal-400 font-bold">
                CALL DIRECTLY
              </div>
              <div className="font-mono text-xs font-bold text-white truncate">
                {PRIMARY_PHONE}
              </div>
            </div>
          </a>

          {/* 2. Direct Email */}
          <a
            href={COMPANY_CONTACT.emailMailto}
            onMouseEnter={() => handleButtonHover(1)}
            onMouseLeave={handleButtonLeave}
            onFocus={() => handleButtonHover(1)}
            onBlur={handleButtonLeave}
            className={`min-h-[44px] min-w-[44px] inline-flex items-center gap-2.5 px-4 py-2.5 bg-blue-950 border text-blue-200 hover:text-white rounded-xl text-xs font-semibold transition-all duration-300 group ${
              activeScene === 1
                ? 'border-blue-400 ring-4 ring-blue-500/30 shadow-[0_8px_24px_rgba(59,130,246,0.28)] text-white'
                : 'border-blue-500/40 hover:border-blue-400 shadow-sm'
            }`}
            title={`Email ${COMPANY_CONTACT.email}`}
          >
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300 group-hover:scale-110 transition-transform shrink-0">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 text-left">
              <div className="text-[10px] uppercase font-mono tracking-wider text-blue-400 font-bold">
                EMAIL INQUIRIES
              </div>
              <div className="font-mono text-xs font-bold text-white truncate">
                {COMPANY_CONTACT.email}
              </div>
            </div>
          </a>

          {/* 3. Ask AI Advisor CTA */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('iamtechni:open-chat'))}
            onMouseEnter={() => handleButtonHover(2)}
            onMouseLeave={handleButtonLeave}
            onFocus={() => handleButtonHover(2)}
            onBlur={handleButtonLeave}
            className={`min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-100 hover:text-white border rounded-xl text-xs font-semibold transition-all duration-300 active:scale-98 cursor-pointer ${
              activeScene === 2
                ? 'border-indigo-400 ring-4 ring-indigo-500/30 shadow-[0_8px_24px_rgba(99,102,241,0.3)] text-white'
                : 'border-indigo-500/40 shadow-sm'
            }`}
            title="Open IAMTECHNI AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
            <span>Ask AI Advisor</span>
          </button>

          {/* 4. Start a Project CTA */}
          <button
            type="button"
            onClick={onStartProject}
            onMouseEnter={() => handleButtonHover(3)}
            onMouseLeave={handleButtonLeave}
            onFocus={() => handleButtonHover(3)}
            onBlur={handleButtonLeave}
            className={`min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#0F1B3D] hover:bg-slate-50 border rounded-xl text-xs font-bold transition-all duration-300 active:scale-98 cursor-pointer ${
              activeScene === 3
                ? 'border-[#1266E8] ring-4 ring-[#1266E8]/25 shadow-[0_8px_24px_rgba(18,102,232,0.22)]'
                : 'border-slate-300 shadow-sm'
            }`}
          >
            <span>Start a Project</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
