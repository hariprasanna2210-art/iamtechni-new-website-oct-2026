import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Mail, Globe, Phone, Sparkles } from 'lucide-react';
import { IamtechniLogo } from '../common/IamtechniLogo';
import { PageRoute } from '../../types';
import { COMPANY_CONTACT } from '../../data/companyInfo';

export const GOOGLE_REVIEWS_URL = "https://share.google/rJ0Tl7uoJfXLnIPi7";

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
  onStartProject?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onStartProject }) => {
  const prefersReducedMotion = useReducedMotion();

  const columnVariants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 16 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.4,
        delay: prefersReducedMotion ? 0 : index * 0.06,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  return (
    <footer className="bg-[#13243D] text-white">
      {/* Main Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[56px] pb-[40px]">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[1.3fr_1fr_0.9fr_1.3fr] gap-10 md:gap-10 lg:gap-[44px] items-start">
          {/* COLUMN 1 – Brand */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={columnVariants}
            className="md:col-span-3 lg:col-span-1 space-y-4"
          >
            <div className="flex items-start">
              <IamtechniLogo size="md" variant="dark" />
            </div>

            {/* Google Reviews Badge */}
            <div>
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IAMTECHNI Google Reviews"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1B3152] border border-white/15 hover:border-[#5CE1E6]/60 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(92,225,230,0.18)] transition-all duration-200 whitespace-nowrap"
              >
                {/* Multicolour Google "G" Icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.49 12.275c0-.85-.075-1.665-.215-2.45H12v4.635h6.445c-.28 1.495-1.12 2.76-2.385 3.61v3.005h3.86c2.26-2.08 3.57-5.145 3.57-8.8z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.955-1.075 7.94-2.925l-3.86-3.005c-1.075.72-2.45 1.145-4.08 1.145-3.135 0-5.79-2.115-6.74-4.96H1.27v3.1C3.245 21.28 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.26 14.255A7.21 7.21 0 0 1 4.88 12c0-.785.135-1.545.38-2.255v-3.1H1.27A11.985 11.985 0 0 0 0 12c0 1.935.465 3.765 1.27 5.355l3.99-3.1z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.785c1.76 0 3.34.605 4.585 1.795l3.435-3.435C17.95 1.19 15.235 0 12 0 7.31 0 3.245 2.72 1.27 6.645l3.99 3.1c.95-2.845 3.605-4.96 6.74-4.96z"
                  />
                </svg>

                <span className="text-white font-bold text-sm tracking-tight">Google</span>

                {/* 5 Gold Stars */}
                <span className="inline-flex items-center gap-0.5" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((starIndex) => (
                    <motion.svg
                      key={starIndex}
                      initial={{ scale: prefersReducedMotion ? 1 : 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: 'spring',
                        stiffness: 320,
                        damping: 18,
                        delay: prefersReducedMotion ? 0 : starIndex * 0.08,
                      }}
                      className="w-3.5 h-3.5 text-[#FBBC04] fill-[#FBBC04]"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </span>
              </a>
            </div>

            <p className="text-[14px] text-white/70 font-sans font-normal leading-normal">
              Technology that moves your business forward.
            </p>
          </motion.div>

          {/* COLUMN 2 – SERVICES */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={columnVariants}
          >
            <h4 className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#5CE1E6] mb-[20px] leading-none whitespace-nowrap">
              SERVICES
            </h4>
            <ul className="space-y-[12px] text-[14px] text-white/85">
              <li>
                <button
                  onClick={() => onNavigate('/services/web-development')}
                  className="inline-block whitespace-nowrap hover:text-[#5CE1E6] hover:translate-x-[2px] transition-all duration-200 text-left cursor-pointer"
                >
                  Web Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services/custom-software')}
                  className="inline-block whitespace-nowrap hover:text-[#5CE1E6] hover:translate-x-[2px] transition-all duration-200 text-left cursor-pointer"
                >
                  Custom Software
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services/mobile-apps')}
                  className="inline-block whitespace-nowrap hover:text-[#5CE1E6] hover:translate-x-[2px] transition-all duration-200 text-left cursor-pointer"
                >
                  Mobile Applications
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services/ai-machine-learning')}
                  className="inline-block whitespace-nowrap hover:text-[#5CE1E6] hover:translate-x-[2px] transition-all duration-200 text-left cursor-pointer"
                >
                  AI &amp; Machine Learning
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services/cloud-devops')}
                  className="inline-block whitespace-nowrap hover:text-[#5CE1E6] hover:translate-x-[2px] transition-all duration-200 text-left cursor-pointer"
                >
                  Cloud &amp; DevOps
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services/ecommerce')}
                  className="inline-block whitespace-nowrap hover:text-[#5CE1E6] hover:translate-x-[2px] transition-all duration-200 text-left cursor-pointer"
                >
                  E-commerce Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services')}
                  className="inline-block whitespace-nowrap text-[#5CE1E6] font-semibold hover:translate-x-[2px] transition-all duration-200 text-left cursor-pointer"
                >
                  All 13 Practices →
                </button>
              </li>
            </ul>
          </motion.div>

          {/* COLUMN 3 – COMPANY */}
          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={columnVariants}
          >
            <h4 className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#5CE1E6] mb-[20px] leading-none whitespace-nowrap">
              COMPANY
            </h4>
            <ul className="space-y-[12px] text-[14px] text-white/85">
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="inline-block whitespace-nowrap hover:text-[#5CE1E6] hover:translate-x-[2px] transition-all duration-200 text-left cursor-pointer"
                >
                  About IAMTECHNI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/portfolio')}
                  className="inline-block whitespace-nowrap hover:text-[#5CE1E6] hover:translate-x-[2px] transition-all duration-200 text-left cursor-pointer"
                >
                  Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/insights')}
                  className="inline-block whitespace-nowrap hover:text-[#5CE1E6] hover:translate-x-[2px] transition-all duration-200 text-left cursor-pointer"
                >
                  Insights
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/training')}
                  className="inline-flex items-center gap-2 whitespace-nowrap hover:text-[#5CE1E6] hover:translate-x-[2px] transition-all duration-200 text-left cursor-pointer"
                >
                  <span>Training</span>
                  <span className="inline-flex items-center text-[9px] font-mono px-1.5 py-0.5 rounded-sm bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold leading-none">
                    NEW
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/careers')}
                  className="inline-block whitespace-nowrap hover:text-[#5CE1E6] hover:translate-x-[2px] transition-all duration-200 text-left cursor-pointer"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="inline-block whitespace-nowrap hover:text-[#5CE1E6] hover:translate-x-[2px] transition-all duration-200 text-left cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </motion.div>

          {/* COLUMN 4 – GET IN TOUCH */}
          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={columnVariants}
          >
            <h4 className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#5CE1E6] mb-[20px] leading-none whitespace-nowrap">
              GET IN TOUCH
            </h4>

            <div className="space-y-[12px] text-[14px]">
              <div>
                <a
                  href={COMPANY_CONTACT.phoneTel}
                  className="inline-block whitespace-nowrap text-[#5CE1E6] font-medium hover:underline hover:translate-x-[2px] transition-all duration-200"
                >
                  {COMPANY_CONTACT.phone}
                </a>
              </div>

              <div>
                <a
                  href={COMPANY_CONTACT.emailMailto}
                  className="inline-block whitespace-nowrap text-[#5CE1E6] font-medium hover:underline hover:translate-x-[2px] transition-all duration-200"
                >
                  {COMPANY_CONTACT.email}
                </a>
              </div>

              <div>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="inline-flex items-center gap-1 whitespace-nowrap text-white/85 font-semibold hover:text-[#5CE1E6] hover:translate-x-[2px] transition-all duration-200 cursor-pointer"
                >
                  <span>Let&apos;s talk</span>
                  <span aria-hidden="true">↗</span>
                </button>
              </div>

              {/* 4 Round Icon Buttons in ONE row */}
              <div className="pt-2 flex items-center gap-2.5 flex-nowrap">
                <a
                  href="https://iamtechni.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="IAMTECHNI Website"
                  title="IAMTECHNI Website"
                  className="w-9 h-9 shrink-0 rounded-full bg-[#1B3152] border border-white/15 text-white hover:border-[#5CE1E6] hover:text-[#5CE1E6] hover:-translate-y-0.5 flex items-center justify-center transition-all duration-200"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a
                  href={COMPANY_CONTACT.emailMailto}
                  aria-label="Email Inquiries"
                  title="Email Inquiries"
                  className="w-9 h-9 shrink-0 rounded-full bg-[#1B3152] border border-white/15 text-white hover:border-[#5CE1E6] hover:text-[#5CE1E6] hover:-translate-y-0.5 flex items-center justify-center transition-all duration-200"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href={COMPANY_CONTACT.phoneTel}
                  aria-label="Call IAMTECHNI"
                  title="Phone Line"
                  className="w-9 h-9 shrink-0 rounded-full bg-[#1B3152] border border-white/15 text-white hover:border-[#5CE1E6] hover:text-[#5CE1E6] hover:-translate-y-0.5 flex items-center justify-center transition-all duration-200"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('iamtechni:open-chat'))}
                  aria-label="AI Architecture Advisor"
                  title="AI Architecture Advisor"
                  className="w-9 h-9 shrink-0 rounded-full bg-[#1B3152] border border-white/15 text-white hover:border-[#5CE1E6] hover:text-[#5CE1E6] hover:-translate-y-0.5 flex items-center justify-center transition-all duration-200 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>

              {/* 2 Action Buttons under Social Icons (Matched to Google Review Badge Style) */}
              <div className="pt-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => (onStartProject ? onStartProject() : onNavigate('/consultation'))}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-4 py-2 rounded-full bg-[#1B3152] border border-white/15 hover:border-[#5CE1E6]/60 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(92,225,230,0.18)] text-white font-bold text-sm tracking-tight transition-all duration-200 whitespace-nowrap cursor-pointer"
                >
                  <span className="text-white font-bold text-sm tracking-tight">Start a Project</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0 text-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-4 py-2 rounded-full bg-[#1B3152] border border-white/15 hover:border-[#5CE1E6]/60 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(92,225,230,0.18)] text-white font-bold text-sm tracking-tight transition-all duration-200 whitespace-nowrap cursor-pointer"
                >
                  <span className="text-white font-bold text-sm tracking-tight">Contact IAMTECHNI</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar – Full Width Softer Navy #101F36 */}
      <div className="bg-[#101F36] w-full border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 lg:pb-4 lg:pr-56 flex flex-col lg:flex-row items-center justify-between gap-3 text-[13px] text-white/85 text-center lg:text-left">
          {/* Left: Phone & Email */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2">
            <a
              href={COMPANY_CONTACT.phoneTel}
              className="inline-flex items-center gap-1.5 hover:text-[#5CE1E6] transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-[#5CE1E6]" />
              <span>{COMPANY_CONTACT.phone}</span>
            </a>
            <a
              href={COMPANY_CONTACT.emailMailto}
              className="inline-flex items-center gap-1.5 hover:text-[#5CE1E6] transition-colors whitespace-nowrap"
            >
              <Mail className="w-3.5 h-3.5 text-[#5CE1E6]" />
              <span>{COMPANY_CONTACT.email}</span>
            </a>
          </div>

          {/* Centre: Copyright */}
          <div className="text-white/85">
            © 2026 IAMTECHNI. All rights reserved.
          </div>

          {/* Right: Legal Links */}
          <div className="flex items-center justify-center lg:justify-end gap-x-2.5 whitespace-nowrap">
            <button
              onClick={() => onNavigate('/privacy-policy')}
              className="hover:text-[#5CE1E6] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-white/30" aria-hidden="true">|</span>
            <button
              onClick={() => onNavigate('/terms')}
              className="hover:text-[#5CE1E6] transition-colors cursor-pointer"
            >
              Terms of Use
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

