import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, ShieldCheck, Mail, Building, Phone, User, FileText } from 'lucide-react';

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
    budget: '$5,000 - $15,000',
    timeline: 'Within 1-3 months',
    description: '',
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

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
      budget: '$5,000 - $15,000',
      timeline: 'Within 1-3 months',
      description: '',
      consent: false,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header Bar */}
        <div className="bg-[#0A0D14] px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#04C8E8]" />
              <span className="text-xs font-mono text-slate-400">IAMTECHNI // PROJECT_DISCOVERY</span>
            </div>
            <h3 id="modal-title" className="text-xl font-bold tracking-tight text-white mt-1">
              Start a Project with IAMTECHNI
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900">Project Brief Received</h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-slate-800">{formData.name}</strong>. Our engineering leads will review your technical requirements for <strong className="text-slate-800">{formData.service}</strong> and respond to <strong className="text-slate-800">{formData.email}</strong> within 1 business day.
              </p>

              <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 text-xs text-left max-w-md mx-auto text-slate-600 space-y-1.5">
                <div className="font-semibold text-slate-800 border-b border-slate-200 pb-1">Submission Summary</div>
                <div><span className="text-slate-400">Service:</span> {formData.service}</div>
                <div><span className="text-slate-400">Scope Budget:</span> {formData.budget}</div>
                <div><span className="text-slate-400">Target Timeline:</span> {formData.timeline}</div>
                <div><span className="text-slate-400">Reference:</span> IAM-{Date.now().toString().slice(-6)}</div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  Close & Return
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="p-3 bg-[#F4F7FC] border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-600 font-medium">Prefer direct contact?</span>
                <div className="flex items-center gap-3 font-mono font-semibold">
                  <a href="tel:+917418120053" className="text-[#0D9488] hover:underline flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> +91-7418120053
                  </a>
                  <span className="text-slate-300">·</span>
                  <a href="mailto:iamtechni.hr@outlook.com" className="text-[#1266E8] hover:underline flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> iamtechni.hr@outlook.com
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Data Analytics">Data Analytics</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="IT Consulting">IT Consulting</option>
                    <option value="Technical Training">Technical Training</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated Budget
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:border-[#1266E8] focus:outline-hidden"
                  >
                    <option value="Under $5,000">Under $5,000</option>
                    <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                    <option value="$15,000 - $35,000">$15,000 - $35,000</option>
                    <option value="$35,000+">$35,000+</option>
                    <option value="To Be Determined">To Be Determined</option>
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
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> Project Description & Objectives *
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

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Confidential & Non-Disclosure Bound</span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#1266E8] to-[#5427D9] text-white rounded-xl text-sm font-semibold shadow-sm hover:opacity-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Transmitting Brief...'
                  ) : (
                    <>
                      Submit Project Brief <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
