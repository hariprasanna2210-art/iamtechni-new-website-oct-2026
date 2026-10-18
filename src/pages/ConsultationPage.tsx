import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Sparkles,
  Building,
  Mail,
  User,
  Phone,
  FileText,
  Calendar,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { PageRoute } from '../types';

interface ConsultationPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ConsultationPage: React.FC<ConsultationPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    serviceInterest: 'Website Design & Development',
    budgetRange: '$10,000 – $25,000',
    timeline: 'Within 2–3 Months',
    projectOverview: '',
    preferredTime: 'Morning (9am - 12pm)',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const servicesList = [
    'Website Design & Development',
    'Custom Software Development',
    'AI & Machine Learning Solutions',
    'E-commerce Development',
    'Mobile App Development',
    'Cloud Computing & DevOps',
    'Cybersecurity & Hardening',
    'Digital Marketing & SEO',
    'IT Consulting & Roadmaps',
  ];

  const budgetOptions = [
    'Under $10,000',
    '$10,000 – $25,000',
    '$25,000 – $50,000',
    '$50,000+',
    'Discovery / Advisory Only',
  ];

  const timelineOptions = [
    'Immediate (Within 30 Days)',
    'Within 2–3 Months',
    'Within 3–6 Months',
    'Planning & Feasibility Phase',
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@'))
      errs.email = 'Valid corporate or business email is required';
    if (!formData.company.trim()) errs.company = 'Company or organization name is required';
    if (!formData.projectOverview.trim() || formData.projectOverview.length < 20)
      errs.projectOverview = 'Please provide at least 20 characters describing your project goals';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitted(true);
  };

  return (
    <div className="w-full">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Contact', route: '/contact' },
            { label: 'Request a Consultation' },
          ]}
          onNavigate={onNavigate}
        />
      </div>

      {/* Consultation Hero */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-20 bg-gradient-to-b from-[#F0F5FF] via-[#F8FAFF] to-[#FFFFFF] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#1266E8]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Technical Discovery</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Request a Technical Architecture Consultation
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Meet directly with an IAMTECHNI solutions architect to review your technical requirements, architectural dependencies, realistic timelines, and budget scope.
            </p>
          </div>
        </div>
      </section>

      {/* Main Consultation Form & Trust Sidebar */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 7 Columns: Interactive Questionnaire Form */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-5 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Consultation Request Confirmed
                  </h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-slate-900">{formData.name}</strong>. Our senior solutions engineering team has received your project brief for <strong className="text-slate-900">{formData.company}</strong>. We will review your requirements and follow up via email within 1 business day with proposed times for a technical briefing.
                  </p>
                  <div className="pt-4 flex justify-center gap-4">
                    <button
                      onClick={() => onNavigate('/')}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold"
                    >
                      Return to Homepage
                    </button>
                    <button
                      onClick={() => onNavigate('/services')}
                      className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold"
                    >
                      Browse Service Disciplines
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Step 1: Service Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-900">
                      1. Which technology discipline are you seeking advisory on? *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {servicesList.map((service) => (
                        <button
                          type="button"
                          key={service}
                          onClick={() => setFormData({ ...formData, serviceInterest: service })}
                          className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                            formData.serviceInterest === service
                              ? 'bg-[#1266E8] text-white border-[#1266E8] shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Scope, Budget & Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-900">
                        Estimated Budget Scope *
                      </label>
                      <select
                        value={formData.budgetRange}
                        onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-[#1266E8]"
                      >
                        {budgetOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-900">
                        Target Launch Timeline *
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-[#1266E8]"
                      >
                        {timelineOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Step 3: Project Overview */}
                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-900">
                      Project Goals & Technical Requirements *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Briefly describe your current technical setup, challenges you are addressing, integrations needed, or what you want to build..."
                      value={formData.projectOverview}
                      onChange={(e) =>
                        setFormData({ ...formData, projectOverview: e.target.value })
                      }
                      className={`w-full p-3.5 rounded-xl border text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1266E8] ${
                        errors.projectOverview ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
                      }`}
                    />
                    {errors.projectOverview && (
                      <p className="text-xs text-rose-600 font-medium">{errors.projectOverview}</p>
                    )}
                  </div>

                  {/* Step 4: Contact Information */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Your Details
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-slate-700">Full Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Rachel Miller"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full p-2.5 rounded-xl border text-xs text-slate-800 focus:ring-2 focus:ring-[#1266E8] ${
                            errors.name ? 'border-rose-400' : 'border-slate-200'
                          }`}
                        />
                        {errors.name && <p className="text-xs text-rose-600">{errors.name}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-slate-700">Work Email *</label>
                        <input
                          type="email"
                          placeholder="rachel@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full p-2.5 rounded-xl border text-xs text-slate-800 focus:ring-2 focus:ring-[#1266E8] ${
                            errors.email ? 'border-rose-400' : 'border-slate-200'
                          }`}
                        />
                        {errors.email && <p className="text-xs text-rose-600">{errors.email}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-slate-700">Company Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Apex Health Systems"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className={`w-full p-2.5 rounded-xl border text-xs text-slate-800 focus:ring-2 focus:ring-[#1266E8] ${
                            errors.company ? 'border-rose-400' : 'border-slate-200'
                          }`}
                        />
                        {errors.company && <p className="text-xs text-rose-600">{errors.company}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-slate-700">Phone Number (Optional)</label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 019-2834"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-[#1266E8]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-[#1266E8] via-[#0B5CD5] to-[#5427D9] text-white font-bold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Submit Architecture Brief & Schedule Session</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[11px] text-slate-400 text-center mt-2.5">
                      Protected under standard mutual non-disclosure (NDA). We never sell or share contact details.
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* Right 4 Columns: Trust & Consultation Benefits */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">What to expect on your call</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-600">
                      <strong>Senior Engineer Led:</strong> Direct discussion with an engineering lead, not a high-pressure sales rep.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-600">
                      <strong>Architecture Assessment:</strong> Candid analysis of your stack and Build vs. Buy options.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-600">
                      <strong>Actionable Roadmap:</strong> High-level phased delivery plan with realistic cost and timing expectations.
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl text-white space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confidentiality Guaranteed</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  All architecture reviews and technical documentation shared with IAMTECHNI are treated as strictly confidential.
                </p>
                <div className="pt-2 text-xs font-mono text-slate-400">
                  Standard mutual NDA executed upon request.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
