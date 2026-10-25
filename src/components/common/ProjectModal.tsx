import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ShieldCheck, Mail, Building, Phone, User, FileText, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  defaultService = 'Web Development',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: defaultService,
    timeline: 'Within 1-3 months',
    description: '',
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('IAM-849201');

  useEffect(() => {
    if (defaultService) {
      setFormData((prev) => ({ ...prev, service: defaultService }));
    }
  }, [defaultService]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Business email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.description.trim() || formData.description.length < 15) {
      newErrors.description = 'Please provide a brief project description (min 15 characters).';
    }
    if (!formData.consent) {
      newErrors.consent = 'You must acknowledge the privacy notice to proceed.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate realistic asynchronous validation and enterprise dispatch
    setTimeout(() => {
      setReferenceId(`IAM-${Date.now().toString().slice(-6)}`);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 850);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      service: defaultService,
      timeline: 'Within 1-3 months',
      description: '',
      consent: false,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
          >
            {/* Header Bar */}
            <div className="bg-[#0A0D14] px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      isSubmitted ? 'bg-emerald-400 animate-pulse' : 'bg-[#04C8E8]'
                    }`}
                  />
                  <span className="text-xs font-mono text-slate-400">
                    {isSubmitted ? 'IAMTECHNI // BRIEF_CONFIRMED' : 'IAMTECHNI // PROJECT_DISCOVERY'}
                  </span>
                </div>
                <h3 id="modal-title" className="text-xl font-bold tracking-tight text-white mt-1">
                  {isSubmitted ? 'Architecture Review Scheduled' : 'Start a Project with IAMTECHNI'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 p-2 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Animated Form -> Success State Transition */}
            <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto overflow-x-hidden">
              <AnimatePresence mode="wait" initial={false}>
                {isSubmitted ? (
                  <motion.div
                    key="project-success"
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -14, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="py-6 sm:py-8 text-center space-y-5"
                  >
                    {/* High-Fidelity Animated Checkmark Emblem */}
                    <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                      {/* Outer Ambient Pulse Ring */}
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: [0.85, 1.35, 1.45], opacity: [0.5, 0.2, 0] }}
                        transition={{ duration: 1.4, ease: 'easeOut', repeat: Infinity, repeatDelay: 0.8 }}
                        className="absolute inset-0 rounded-full bg-emerald-400/30"
                      />
                      {/* Secondary Halo Ring */}
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.12, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 240, damping: 18, delay: 0.05 }}
                        className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-400/15 to-cyan-400/15 border border-emerald-200/80"
                      />

                      {/* Core Medallion */}
                      <motion.div
                        initial={{ scale: 0, rotate: -12 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 16, delay: 0.08 }}
                        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 shadow-lg shadow-emerald-600/25 flex items-center justify-center border-2 border-white"
                      >
                        <motion.svg
                          viewBox="0 0 52 52"
                          className="w-9 h-9 text-white overflow-visible"
                          fill="none"
                          aria-hidden="true"
                        >
                          <motion.circle
                            cx="26"
                            cy="26"
                            r="22"
                            stroke="rgba(255,255,255,0.28)"
                            strokeWidth="2.5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.15 }}
                          />
                          <motion.path
                            d="M15.5 26.5L22.8 33.8L37 19"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{
                              pathLength: { duration: 0.45, ease: [0.33, 1, 0.68, 1], delay: 0.25 },
                              opacity: { duration: 0.1, delay: 0.25 },
                            }}
                          />
                        </motion.svg>
                      </motion.div>
                    </div>

                    {/* Staggered Text & Summary Reveal */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.25 }}
                      className="space-y-2"
                    >
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-mono font-bold text-emerald-700">
                        <Sparkles className="w-3 h-3" />
                        <span>DISPATCHED TO SENIOR ARCHITECTURE DESK</span>
                      </div>
                      <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        Project Brief Received
                      </h4>
                      <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                        Thank you, <strong className="text-slate-900">{formData.name}</strong>. Our engineering leads will review your technical requirements for{' '}
                        <strong className="text-slate-900">{formData.service}</strong> and respond to{' '}
                        <strong className="text-[#1266E8]">{formData.email}</strong> within 1 business day.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.35 }}
                      className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-4 sm:p-5 text-xs text-left max-w-md mx-auto text-slate-600 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-800 border-b border-slate-200 pb-2">
                        <span>Submission Telemetry</span>
                        <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {referenceId}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                        <div>
                          <span className="text-slate-400 block text-[10px] font-mono uppercase">Service Pillar</span>
                          <span className="font-semibold text-slate-800">{formData.service}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-mono uppercase">Target Timeline</span>
                          <span className="font-semibold text-slate-800">{formData.timeline}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-mono uppercase">SLA Target</span>
                          <span className="font-semibold text-emerald-700">&lt; 24 Hours</span>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.45 }}
                      className="pt-2"
                    >
                      <button
                        type="button"
                        onClick={handleReset}
                        className="min-h-[44px] min-w-[44px] px-7 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                      >
                        Close &amp; Return
                      </button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="project-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    noValidate
                  >
                    <div className="p-3 bg-[#F4F7FC] border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-slate-600 font-medium">Prefer direct contact?</span>
                      <div className="flex flex-wrap items-center gap-3 font-mono font-semibold">
                        <a href="tel:+917418120053" className="min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 inline-flex items-center gap-1 text-[#0D9488] hover:underline">
                          <Phone className="w-3.5 h-3.5" /> +91-7418120053
                        </a>
                        <span className="text-slate-300">·</span>
                        <a href="mailto:info@iamtechni.in" className="min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 inline-flex items-center gap-1 text-[#1266E8] hover:underline">
                          <Mail className="w-3.5 h-3.5" /> info@iamtechni.in
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" /> Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Rachel Chen"
                          className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                            errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#1266E8]'
                          } focus:outline-hidden focus:ring-2 focus:ring-[#1266E8]/20 transition-all`}
                        />
                        {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> Business Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@company.com"
                          className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                            errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#1266E8]'
                          } focus:outline-hidden focus:ring-2 focus:ring-[#1266E8]/20 transition-all`}
                        />
                        {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" /> Company / Organization
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g. Apex Dynamics Ltd"
                          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#1266E8] focus:outline-hidden focus:ring-2 focus:ring-[#1266E8]/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 / +1 (555) 000-0000"
                          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#1266E8] focus:outline-hidden focus:ring-2 focus:ring-[#1266E8]/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Primary Service
                        </label>
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:border-[#1266E8] focus:outline-hidden"
                        >
                          <option value="Web Development">Web Development</option>
                          <option value="E-commerce Development">E-commerce</option>
                          <option value="Custom Software Development">Custom Software</option>
                          <option value="Mobile App Development">Mobile Apps</option>
                          <option value="AI & Machine Learning">AI &amp; Machine Learning</option>
                          <option value="Data Analytics">Data Analytics</option>
                          <option value="Cloud & DevOps">Cloud &amp; DevOps</option>
                          <option value="Cybersecurity">Cybersecurity</option>
                          <option value="Digital Marketing">Digital Marketing</option>
                          <option value="UI/UX Design">UI/UX Design</option>
                          <option value="IT Consulting">IT Consulting</option>
                          <option value="Technical Training">Technical Training</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Target Timeline
                        </label>
                        <select
                          value={formData.timeline}
                          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                          className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:border-[#1266E8] focus:outline-hidden"
                        >
                          <option value="Immediately (Under 1 month)">Under 1 month</option>
                          <option value="Within 1-3 months">Within 1-3 months</option>
                          <option value="3-6 months">3-6 months</option>
                          <option value="Flexible / Planning Stage">Flexible / Planning</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400" /> Project Description &amp; Objectives *
                      </label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Outline what you want to build or improve, key integrations, and target business outcomes..."
                        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                          errors.description ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#1266E8]'
                        } focus:outline-hidden focus:ring-2 focus:ring-[#1266E8]/20 transition-all`}
                      />
                      {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
                    </div>

                    <div className="pt-1">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.consent}
                          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                          className="mt-0.5 rounded-sm border-slate-300 text-[#1266E8] focus:ring-[#1266E8]"
                        />
                        <span className="text-xs text-slate-500 leading-normal">
                          I acknowledge that IAMTECHNI will process my contact information solely for responding to this project discovery inquiry in accordance with the{' '}
                          <span className="text-[#1266E8] underline">Privacy Policy</span>.
                        </span>
                      </label>
                      {errors.consent && <p className="text-xs text-rose-500 mt-1">{errors.consent}</p>}
                    </div>

                    <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Confidential &amp; Non-Disclosure Bound</span>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#1266E8] to-[#5427D9] text-white rounded-xl text-sm font-semibold shadow-sm hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Transmitting Brief...
                          </span>
                        ) : (
                          <>
                            Submit Project Brief <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

