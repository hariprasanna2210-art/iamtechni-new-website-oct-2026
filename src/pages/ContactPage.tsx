import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle,
  Mail,
  Building,
  Phone,
  PhoneCall,
  User,
  FileText,
  ShieldCheck,
  Globe,
  Clock,
  Sparkles,
  Compass,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { PageRoute } from '../types';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { COMPANY_CONTACT } from '../data/companyInfo';
import { PageHero } from '../components/common/PageHero';

interface ContactPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: 'Web Development',
    preferredContact: 'Phone Call',
    description: '',
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Business email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid business email address.';
    }
    if (!formData.description.trim() || formData.description.length < 20) {
      newErrors.description = 'Please detail your project goals and scope (minimum 20 characters).';
    }
    if (!formData.consent) {
      newErrors.consent = 'You must accept the terms of the privacy policy to submit.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulating realistic backend processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  return (
    <div className="w-full">
      {/* Page Hero */}
      <PageHero
        breadcrumbItems={[{ label: 'Contact & Inquiries' }]}
        onNavigate={onNavigate}
        kicker="DIRECT INQUIRIES & DISCOVERY"
        category="Connect"
        title="Let’s Engineer Your Next Digital Solution"
        tagline="Direct access to our senior engineering and technical architecture team."
        description="Tell us what you want to build, modernize or automate. Reach us directly via phone, official email, or submit your project questionnaire below for an architecture discovery session within one business day."
        primaryCtaText="Call Now: +91-7418120053"
        onPrimaryCta={() => {
          window.location.href = COMPANY_CONTACT.phoneTel;
        }}
        secondaryCtaText="Email info@iamtechni.in"
        onSecondaryCta={() => {
          window.location.href = COMPANY_CONTACT.emailMailto;
        }}
        slug="contact"
        customVisual={
          <div className="relative w-full max-w-md mx-auto min-h-[280px] sm:aspect-square bg-white rounded-2xl border border-slate-200 shadow-xl p-4 sm:p-6 flex flex-col justify-between text-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-bold text-slate-900">COMMUNICATION_DESK</span>
              </div>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 my-auto py-3">
              <div className="p-3 sm:p-3.5 bg-[#E1F8F2] rounded-xl border border-teal-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0D9488] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase text-[#0D9488] font-bold">Direct Phone Line</div>
                  <div className="text-sm font-extrabold text-slate-900 truncate">{COMPANY_CONTACT.phone}</div>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 bg-[#EAF3FF] rounded-xl border border-blue-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1266E8] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase text-[#1266E8] font-bold">Official Email</div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 break-all">{COMPANY_CONTACT.email}</div>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 bg-[#FFF5D9] rounded-xl border border-amber-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#D97706] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase text-amber-800 font-bold">SLA Response</div>
                  <div className="text-xs font-bold text-slate-900">&lt; 24 hours guaranteed</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono text-slate-500">
              <span>ZERO UNSOLICITED SALES</span>
              <span className="text-emerald-700 font-bold">CONFIDENTIAL BRIEF</span>
            </div>
          </div>
        }
      />

      {/* ========================================================================= */}
      {/* 2 PROMINENT VISIBLE CONTACT INFORMATION CARDS (PHONE & EMAIL)             */}
      {/* ========================================================================= */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold">
              Direct Contact Channels
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Connect With IAMTECHNI Immediately
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Both channels are monitored directly by our senior technical architects and business management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Card 1: Direct Phone Contact */}
            <div className="bg-[#E1F8F2] border border-teal-200/90 rounded-2xl p-7 shadow-sm hover:shadow-md hover:border-teal-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0D9488] text-white flex items-center justify-center shadow-xs">
                    <Phone className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-100 text-teal-900 border border-teal-300">
                    DIRECT CALL
                  </span>
                </div>

                <div className="text-xs font-mono text-[#0D9488] uppercase tracking-wider font-bold mb-1">
                  Immediate Phone Line
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                  Call Our Technology Desk
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Speak directly with an engineering specialist about project scoping, team allocation, and turnaround times.
                </p>

                <div className="p-3.5 bg-white rounded-xl border border-teal-200/80 mb-5 shadow-2xs">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Phone Number</div>
                  <div className="text-xl font-mono font-black text-slate-900 tracking-tight">
                    {COMPANY_CONTACT.phone}
                  </div>
                  <div className="text-[11px] text-teal-700 font-medium mt-1">
                    {COMPANY_CONTACT.workingHours}
                  </div>
                </div>
              </div>

              {/* Call Now Action Button */}
              <a
                href={COMPANY_CONTACT.phoneTel}
                className="w-full py-3.5 px-4 sm:px-5 bg-[#0D9488] hover:bg-[#0f766e] text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span className="truncate">Call Now ({COMPANY_CONTACT.phone})</span>
              </a>
            </div>

            {/* Card 2: Official Email Contact */}
            <div className="bg-[#EAF3FF] border border-blue-200/90 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1266E8] text-white flex items-center justify-center shadow-xs">
                    <Mail className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-100 text-blue-900 border border-blue-300">
                    OFFICIAL INBOX
                  </span>
                </div>

                <div className="text-xs font-mono text-[#1266E8] uppercase tracking-wider font-bold mb-1">
                  Project &amp; HR Desk
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                  Email IAMTECHNI
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Send project briefs, RFP documentation, software architecture inquiries, or career applications.
                </p>

                <div className="p-3.5 bg-white rounded-xl border border-blue-200/80 mb-5 shadow-2xs">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Email Address</div>
                  <div className="text-lg sm:text-xl font-mono font-black text-slate-900 tracking-tight break-all">
                    {COMPANY_CONTACT.email}
                  </div>
                  <div className="text-[11px] text-[#1266E8] font-medium mt-1">
                    {COMPANY_CONTACT.responseTime}
                  </div>
                </div>
              </div>

              {/* Email Us Action Button */}
              <a
                href={COMPANY_CONTACT.emailMailto}
                className="w-full py-3.5 px-4 sm:px-5 bg-[#1266E8] hover:bg-[#0f53be] text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span className="truncate">Email Us ({COMPANY_CONTACT.email})</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Layout: Form & Verification */}
      <section className="py-20 bg-[#F4F7FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-2xs">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-5">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Project Brief Received</h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-slate-900">{formData.name}</strong>. Your project brief has been routed to our technical architecture lead. We will review your goals for <strong className="text-slate-900">{formData.service}</strong> and respond to <strong className="text-slate-900">{formData.email}</strong> shortly.
                  </p>

                  <div className="bg-[#FAFBFD] border border-slate-200 rounded-xl p-4 text-xs text-left max-w-md mx-auto text-slate-600 space-y-1.5">
                    <div className="font-semibold text-slate-800 border-b border-slate-200 pb-1">
                      Inquiry Snapshot
                    </div>
                    <div><span className="text-slate-400">Target Service:</span> {formData.service}</div>
                    <div><span className="text-slate-400">Preferred Channel:</span> {formData.preferredContact}</div>
                    <div><span className="text-slate-400">Reference:</span> IAM-{Date.now().toString().slice(-6)}</div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          company: '',
                          phone: '',
                          service: 'Web Development',
                          preferredContact: 'Phone Call',
                          description: '',
                          consent: false,
                        });
                      }}
                      className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">Project Discovery Questionnaire</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      All submissions are bound by our standard technical confidentiality agreement.
                    </p>
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
                        placeholder="Rachel Chen"
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
                        placeholder="rachel@company.com"
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
                        <Building className="w-3.5 h-3.5 text-slate-400" /> Organization / Company
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Apex Technologies"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#1266E8] focus:outline-hidden"
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
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#1266E8] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Service Required
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:border-[#1266E8] focus:outline-hidden"
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
                        Preferred Contact
                      </label>
                      <select
                        value={formData.preferredContact}
                        onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:border-[#1266E8] focus:outline-hidden"
                      >
                        <option value="Phone Call">Phone Call</option>
                        <option value="Email">Email</option>
                        <option value="Video Conference">Video Conference</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" /> Project Description &amp; Architecture Goals *
                    </label>
                    <textarea
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Outline what you are trying to build, key software integrations, current bottlenecks, and target milestones..."
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                        errors.description ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#1266E8]'
                      } focus:outline-hidden focus:ring-2 focus:ring-[#1266E8]/20 transition-all`}
                    />
                    {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        className="mt-0.5 rounded-sm border-slate-300 text-[#1266E8] focus:ring-[#1266E8]"
                      />
                      <span className="text-xs text-slate-500 leading-normal">
                        I confirm that the information provided is accurate and consent to IAMTECHNI storing this submission solely to evaluate and respond to this project inquiry in accordance with the{' '}
                        <button
                          type="button"
                          onClick={() => onNavigate('/privacy-policy')}
                          className="text-[#1266E8] underline"
                        >
                          Privacy Policy
                        </button>.
                      </span>
                    </label>
                    {errors.consent && <p className="text-xs text-rose-500 mt-1">{errors.consent}</p>}
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Enterprise Confidentiality</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1266E8] to-[#5427D9] text-white rounded-xl text-xs font-semibold hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        'Validating...'
                      ) : (
                        <>
                          <span>Submit Project Inquiry</span>
                          <ArrowRight className="w-4 h-4 shrink-0" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Sidebar Details Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Direct Details Card */}
              <div className="bg-white rounded-2xl p-7 border border-slate-200 space-y-5 shadow-2xs">
                <div className="text-xs font-mono text-[#1266E8] uppercase tracking-wider font-bold">
                  Verified Engineering Practice
                </div>
                <h3 className="text-xl font-bold text-slate-900">Direct Communication</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  IAMTECHNI maintains transparent digital engineering communication channels. We provide honest estimates, architectural feasibility reviews, and predictable timelines.
                </p>

                <div className="space-y-4 pt-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Direct Phone Line</div>
                    <a
                      href={COMPANY_CONTACT.phoneTel}
                      className="text-sm font-mono font-bold text-slate-900 hover:text-[#1266E8] transition-colors flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#0D9488]" />
                      <span>{COMPANY_CONTACT.phone}</span>
                    </a>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Official Business Email</div>
                    <a
                      href={COMPANY_CONTACT.emailMailto}
                      className="text-sm font-mono font-bold text-slate-900 hover:text-[#1266E8] transition-colors flex items-center gap-1.5 break-all"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#1266E8]" />
                      <span>{COMPANY_CONTACT.email}</span>
                    </a>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Web Presence</div>
                    <a
                      href={COMPANY_CONTACT.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono font-bold text-[#1266E8] hover:underline flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#04C8E8]" />
                      <span>{COMPANY_CONTACT.website}</span>
                    </a>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                  DISCOVERY DISCIPLINE // ZERO SPAM ASSURANCE
                </div>
              </div>

              {/* What to Expect Next Card */}
              <div className="bg-white rounded-2xl p-7 border border-slate-200 space-y-4 shadow-2xs">
                <h3 className="text-base font-bold text-slate-900">What Happens Next?</h3>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1266E8] font-bold flex items-center justify-center shrink-0 text-[11px]">
                      1
                    </span>
                    <span>
                      <strong className="text-slate-900">Technical Triage:</strong> A senior software architect reviews your project requirements within 24 hours.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-violet-100 text-[#7C3AED] font-bold flex items-center justify-center shrink-0 text-[11px]">
                      2
                    </span>
                    <span>
                      <strong className="text-slate-900">Discovery Discussion:</strong> A 30-minute scoping call to clarify system integrations, deliverables, and architecture milestones.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-[#0D9488] font-bold flex items-center justify-center shrink-0 text-[11px]">
                      3
                    </span>
                    <span>
                      <strong className="text-slate-900">Transparent Proposal:</strong> Concrete architectural blueprints, timeline estimates, milestone checkpoints, and transparent costs.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
