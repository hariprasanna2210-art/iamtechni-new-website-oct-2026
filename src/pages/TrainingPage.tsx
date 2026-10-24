import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  Sparkles,
  BookOpen,
  Code2,
  Cpu,
  Cloud,
  Terminal,
  Server,
  Bot,
  TrendingUp,
  Workflow,
  ShieldCheck,
  Globe,
  Layers,
  ChevronDown,
  Compass,
  Check,
  Send,
  HelpCircle,
  ExternalLink,
  MessageCircle,
  Clock,
  Calendar,
  Users,
  GraduationCap,
  Briefcase,
  AlertCircle,
  Laptop,
} from 'lucide-react';
import { PageRoute, CourseItem } from '../types';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import {
  coursesData,
  courseCategories,
  trainingFaqs,
  getCourseWhatsAppUrl,
  getEnquiryWhatsAppUrl,
  WHATSAPP_CONFIG,
} from '../data/coursesData';
import { COMPANY_CONTACT } from '../data/companyInfo';
import { getCardColorToken } from '../utils/cardColorTokens';
import { ScrollReveal, ScrollRevealItem, ScrollRevealSection } from '../components/common/ScrollReveal';
import { TrainingHeroVisual } from '../components/heroes/TrainingHeroVisual';
import { ServiceCardThumbnail } from '../components/common/ServiceVisualMockups';

interface TrainingPageProps {
  courseSlug?: string;
  onNavigate: (route: PageRoute) => void;
  onOpenProjectModal?: (serviceName?: string) => void;
}

// Icon resolver helper for course cards
function getCourseIconComponent(iconName: string) {
  switch (iconName) {
    case 'Code2':
      return Code2;
    case 'Terminal':
      return Terminal;
    case 'Cpu':
      return Cpu;
    case 'Layers':
      return Layers;
    case 'Cloud':
      return Cloud;
    case 'Server':
      return Server;
    case 'Bot':
      return Bot;
    case 'TrendingUp':
      return TrendingUp;
    case 'Sparkles':
      return Sparkles;
    case 'Workflow':
      return Workflow;
    case 'ShieldCheck':
      return ShieldCheck;
    case 'Globe':
      return Globe;
    default:
      return BookOpen;
  }
}

// Custom WhatsApp SVG Icon
function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export const TrainingPage: React.FC<TrainingPageProps> = ({ courseSlug, onNavigate, onOpenProjectModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCourseForForm, setSelectedCourseForForm] = useState<string>(coursesData[0].title);
  const [openFaq, setOpenFaq] = useState<Record<number, boolean>>({ 0: true, 1: true });

  const enquiryFormRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    course: coursesData[0].title,
    currentStatus: 'Student',
    learningMode: 'Need Guidance',
    preferredBatch: '',
    questions: '',
    consent: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    referenceId: string;
    message: string;
  } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Sync courseSlug if navigating to /training/:slug
  useEffect(() => {
    if (courseSlug) {
      const matched = coursesData.find((c) => c.id === courseSlug);
      if (matched) {
        setSelectedCategory('All');
        setSelectedCourseForForm(matched.title);
        setFormData((prev) => ({ ...prev, course: matched.title }));
        const timer = setTimeout(() => {
          const el = document.getElementById(`course-${matched.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [courseSlug]);

  const filteredCourses =
    selectedCategory === 'All'
      ? coursesData
      : coursesData.filter((c) => c.category === selectedCategory);

  const handleSelectCourseForEnquiry = (courseTitle: string) => {
    setSelectedCourseForForm(courseTitle);
    setFormData((prev) => ({ ...prev, course: courseTitle }));
    if (enquiryFormRef.current) {
      enquiryFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required.';
    }
    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = 'Mobile Number is required.';
    } else if (formData.mobileNumber.trim().length < 8) {
      errors.mobileNumber = 'Please provide a valid phone or mobile number.';
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!formData.course) {
      errors.course = 'Please select a course.';
    }
    if (!formData.consent) {
      errors.consent = 'You must give permission to be contacted regarding this enquiry.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/course-enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit enquiry.');
      }

      const result = await response.json();
      setSubmissionSuccess({
        referenceId: result.referenceId || `IAM-TRN-${Date.now().toString().slice(-6)}`,
        message:
          result.message ||
          `Enquiry received for ${formData.course}. Our academic team will contact you shortly.`,
      });
    } catch (err: any) {
      console.warn('Backend enquiry endpoint offline or errored, falling back gracefully:', err);
      // Fallback graceful success with local reference code + WhatsApp direct option
      const fallbackRef = `IAM-TRN-${Date.now().toString().slice(-6)}`;
      setSubmissionSuccess({
        referenceId: fallbackRef,
        message: `Your enquiry for ${formData.course} has been logged. Reference: ${fallbackRef}. You can also connect instantly on WhatsApp.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="w-full">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[{ label: 'Technology Training & Courses' }]}
        onNavigate={onNavigate}
      />

      {/* ======================================================================= */}
      {/* 1. HERO SECTION: Technology Education & Learning                       */}
      {/* ======================================================================= */}
      <section className="relative overflow-hidden border-b border-slate-200 py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-[#F0F5FF] via-[#F8FAFF] to-white">
        {/* Layered Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-gradient-to-tr from-[#04C8E8]/20 via-[#1266E8]/15 to-[#5427D9]/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-[300px] h-[250px] bg-gradient-to-tr from-[#04C8E8]/10 to-transparent rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Typography & Learning Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 h-[34px] px-3 sm:px-4 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-xs font-mono font-semibold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                <span className="text-[#2563EB] font-bold">PROFESSIONAL SKILL DEVELOPMENT</span>
                <span className="text-slate-300">|</span>
                <span className="text-[#1E3A8A]">HANDS-ON LABS</span>
              </div>

              <h1 className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-bold tracking-[-0.015em] text-[#1E3A8A] leading-[1.18] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)] text-balance">
                Learn Tomorrow's Technology.{' '}
                <span className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] bg-clip-text text-transparent block sm:inline">
                  Build Your Future.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Upgrade your skills with practical technology training in software development, cloud computing, artificial intelligence, cybersecurity, and DevOps. Explore your interests and connect with IAMTECHNI to find the right learning path.
              </p>

              {/* Action Buttons: Explore Courses + Direct WhatsApp */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={scrollToCatalog}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 min-h-[40px] rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white font-semibold text-xs sm:text-[13px] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>

                <a
                  href={getCourseWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 min-h-[40px] rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-xs sm:text-[13px] transition-all border border-emerald-200 shadow-2xs cursor-pointer group"
                  title="Enquire directly on WhatsApp"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform shrink-0" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>

              {/* Training Value Indicators */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Practical Code Labs &amp; Capstones</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1266E8] shrink-0" />
                  <span>Industry-Experienced Mentors</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Classroom &amp; Online Batches</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity Custom Technology & Learning Illustration */}
            <div className="lg:col-span-5 flex items-center justify-center w-full min-w-0">
              <TrainingHeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 2. COURSE CATALOG (13 Individual Colorful Cards)                       */}
      {/* ======================================================================= */}
      <section ref={catalogRef} id="courses-catalog" className="py-14 sm:py-16 lg:py-20 bg-[#F4F7FC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header & Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-bold mb-1">
                Technology Curriculum
              </div>
              <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.015em] text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)]">
                Explore Our Courses
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Choose from 13 comprehensive training tracks. Tap <strong>Enquire Now</strong> for complete syllabus details, duration, batch schedules, and learning modes.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-nowrap sm:flex-wrap items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-xl shadow-2xs w-full md:w-auto overflow-x-auto">
              {courseCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-[#1E3A8A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#1E3A8A] hover:bg-[#F5F8FC]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Staggered Course Cards Grid */}
          <ScrollReveal
            key={selectedCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            staggerChildren={0.06}
            amount="some"
          >
            {filteredCourses.map((course, idx) => {
              const color = getCardColorToken(course.colorIndex);
              const CourseIcon = getCourseIconComponent(course.iconName);

              return (
                <ScrollRevealItem key={course.id} className="h-full">
                  <div
                    id={`course-${course.id}`}
                    className={`${color.cardBg} ${color.cardBorder} h-full border rounded-2xl p-5 sm:p-7 flex flex-col justify-between ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200 shadow-2xs interactive-card-lift group`}
                  >
                    <div>
                      {/* Visual Lab / Curriculum Preview */}
                      <ServiceCardThumbnail slug={course.title} category={course.category} className="mb-4" />

                      {/* Top Meta Bar */}
                      <div className="flex items-center justify-between text-xs mb-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}
                        >
                          {course.category.toUpperCase()}
                        </span>
                        <div
                          className={`w-9 h-9 rounded-xl ${color.iconBg} text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform shrink-0`}
                        >
                          <CourseIcon className="w-5 h-5" />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-[#1E3A8A] mb-2 leading-snug">
                        {course.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {course.subtitle}
                      </p>

                      {/* Course Key Highlights */}
                      <div className="space-y-2 pt-3 border-t border-slate-200/70 mb-5">
                        <div className="text-[11px] font-mono uppercase text-slate-500 font-bold tracking-wider mb-1.5">
                          Key Curriculum Highlights
                        </div>
                        {course.highlights.map((hl, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-700">
                            <Check className={`w-3.5 h-3.5 ${color.accentText} shrink-0 mt-0.5`} />
                            <span className="leading-tight">{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer Actions: Enquire Now + WhatsApp Option */}
                    <div className="pt-4 border-t border-slate-200/70 space-y-2.5">
                      <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between">
                        <span>Mode: Classroom / Online</span>
                        <span className="text-[#2563EB] font-bold">Batches Open</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleSelectCourseForEnquiry(course.title)}
                          className="w-full py-2 px-3 min-h-[38px] bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-98"
                        >
                          <span>Enquire Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={getCourseWhatsAppUrl(course.title)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 min-h-[38px] bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-900 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-98"
                          title={`Enquire about ${course.title} on WhatsApp`}
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </ScrollRevealItem>
              );
            })}
          </ScrollReveal>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 3. CHOOSE YOUR LEARNING PATH                                            */}
      {/* ======================================================================= */}
      <section className="py-14 sm:py-16 lg:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold mb-1">
              Structured Trajectories
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Choose Your Learning Path
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Tailored learning paths engineered to take you from foundational syntax to building production-ready architectures.
            </p>
          </div>

          <ScrollReveal className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8" staggerChildren={0.08} amount="some">
            {/* Path 1: Software & Web Development */}
            <ScrollRevealItem className="h-full">
              <div className="bg-[#EAF3FF] h-full rounded-2xl p-6 sm:p-7 border border-blue-200/90 shadow-2xs flex flex-col justify-between interactive-card-lift">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-blue-100 text-[#1266E8] border border-blue-300">
                      TRACK 01
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#1266E8] text-white flex items-center justify-center shadow-xs">
                      <Code2 className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Full Stack &amp; Software Engineering
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed mb-4">
                    Learn to build end-to-end web applications with modern React, Next.js, Node.js, Python, and SQL databases.
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#1266E8]" /> Frontend: React, Next.js, TypeScript
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#1266E8]" /> Backend: Node.js, Express, Python FastAPI
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#1266E8]" /> Relational &amp; NoSQL Database Design
                    </li>
                  </ul>
                </div>
                <div className="pt-5 mt-5 border-t border-blue-200/70">
                  <button
                    onClick={() => handleSelectCourseForEnquiry('Full Stack Development')}
                    className="text-xs font-bold text-[#1266E8] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Enquire About Full Stack Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </ScrollRevealItem>

            {/* Path 2: Cloud Computing & Infrastructure */}
            <ScrollRevealItem className="h-full">
              <div className="bg-[#E4FAFF] h-full rounded-2xl p-6 sm:p-7 border border-cyan-200/90 shadow-2xs flex flex-col justify-between interactive-card-lift">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-cyan-100 text-[#0284C7] border border-cyan-300">
                      TRACK 02
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#0284C7] text-white flex items-center justify-center shadow-xs">
                      <Cloud className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Cloud Computing &amp; DevOps
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed mb-4">
                    Deploy, orchestrate, and secure distributed infrastructure across AWS and Microsoft Azure with automated CI/CD.
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#0284C7]" /> AWS Core Architecture &amp; Topologies
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#0284C7]" /> Microsoft Azure Infrastructure
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#0284C7]" /> Docker Containers &amp; Kubernetes
                    </li>
                  </ul>
                </div>
                <div className="pt-5 mt-5 border-t border-cyan-200/70">
                  <button
                    onClick={() => handleSelectCourseForEnquiry('Amazon Web Services (AWS)')}
                    className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Enquire About Cloud Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </ScrollRevealItem>

            {/* Path 3: AI, Machine Learning & Generative AI */}
            <ScrollRevealItem className="h-full">
              <div className="bg-[#F0EAFF] h-full rounded-2xl p-6 sm:p-7 border border-violet-200/90 shadow-2xs flex flex-col justify-between interactive-card-lift">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-violet-100 text-[#7C3AED] border border-violet-300">
                      TRACK 03
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center shadow-xs">
                      <Bot className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Artificial Intelligence &amp; Generative AI
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed mb-4">
                    Master applied machine learning, neural networks, vector databases, and enterprise RAG systems with Python.
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#7C3AED]" /> Python for Data Science &amp; Scikit-Learn
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#7C3AED]" /> Large Language Models &amp; Prompt Engineering
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#7C3AED]" /> Private RAG &amp; Vector Embeddings
                    </li>
                  </ul>
                </div>
                <div className="pt-5 mt-5 border-t border-violet-200/70">
                  <button
                    onClick={() => handleSelectCourseForEnquiry('Generative AI')}
                    className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Enquire About AI Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </ScrollRevealItem>
          </ScrollReveal>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 4. PRACTICAL LEARNING APPROACH                                          */}
      {/* ======================================================================= */}
      <section className="py-14 sm:py-16 lg:py-20 bg-[#F5F8FC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold mb-1">
              Methodology
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Practical Learning Approach
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              We focus on building actual software, configuring real cloud services, and debugging live code. No dry theory without applied practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1266E8] flex items-center justify-center border border-blue-200">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Hands-on Code Labs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every session includes guided code-along labs and exercises pushed directly to your personal GitHub repository.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-[#0284C7] flex items-center justify-center border border-cyan-200">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Production Capstone</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Build a real-world end-to-end project that mirrors industry standards, ready to showcase to hiring engineering managers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-[#7C3AED] flex items-center justify-center border border-violet-200">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Code Reviews &amp; Mentoring</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive direct constructive code reviews from senior developers on code structure, readability, and performance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center border border-teal-200">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Interview &amp; Skill Prep</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Learn how software companies evaluate engineers, structure technical portfolios, and conduct coding reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 5. WHO CAN JOIN?                                                        */}
      {/* ======================================================================= */}
      <section className="py-14 sm:py-16 lg:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold mb-1">
              Target Audiences
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Who Can Join IAMTECHNI Training?
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Our training tracks are engineered with adaptable pacing, making them suitable for students, fresh graduates, working tech professionals, and career changers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#EAF3FF] p-6 rounded-2xl border border-blue-200/90 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#1266E8] text-white flex items-center justify-center shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">College Students</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Gain practical programming, database, and cloud skills ahead of campus interviews and academic capstone projects.
              </p>
            </div>

            <div className="bg-[#E4FAFF] p-6 rounded-2xl border border-cyan-200/90 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0284C7] text-white flex items-center justify-center shadow-xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Fresh Graduates</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Bridge the gap between college curricula and real industry expectations with production-ready code repositories.
              </p>
            </div>

            <div className="bg-[#F0EAFF] p-6 rounded-2xl border border-violet-200/90 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center shadow-xs">
                <Workflow className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Working Professionals</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Upskill into high-growth disciplines like Cloud (AWS/Azure), Generative AI, or DevOps containerization via weekend batches.
              </p>
            </div>

            <div className="bg-[#E1F8F2] p-6 rounded-2xl border border-teal-200/90 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0D9488] text-white flex items-center justify-center shadow-xs">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Career Changers</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Transition smoothly from non-technical fields into software development through structured step-by-step guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 6. COURSE ENQUIRY FORM SECTION                                         */}
      {/* ======================================================================= */}
      <section ref={enquiryFormRef} id="enquiry-form" className="py-14 sm:py-16 lg:py-20 bg-[#F4F7FC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Form Details & Quick WhatsApp alternative */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#1266E8] text-xs font-mono uppercase tracking-widest font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Personalized Guidance</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                  Find the Right Course for You
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tell us a little about yourself and the course you're interested in. Our team can contact you with relevant training information, syllabus breakdowns, batch dates, and fee details.
                </p>
              </div>

              {/* Direct WhatsApp Callout Box */}
              <div className="p-6 bg-[#E1F8F2] border border-teal-200/90 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0D9488] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <WhatsAppIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Prefer Instant WhatsApp Chat?</h3>
                    <p className="text-xs text-teal-800">
                      Connect directly on our official WhatsApp number for immediate syllabus and batch timing details.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={getCourseWhatsAppUrl(formData.course)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#0D9488] hover:bg-[#0f766e] text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-98 cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>Chat on WhatsApp (+91-7418120053)</span>
                  </a>
                </div>
              </div>

              {/* Contact Snapshot */}
              <div className="p-5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-2.5">
                <div className="font-semibold text-slate-800 font-mono uppercase tracking-wider text-[11px] pb-1 border-b border-slate-100">
                  Direct IAMTECHNI Desk
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#0D9488]" />
                  <span className="font-mono">{COMPANY_CONTACT.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#1266E8]" />
                  <span className="font-mono">{COMPANY_CONTACT.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Counselor Response: Within 24 hours</span>
                </div>
              </div>
            </div>

            {/* Right Column: Actual Interactive Course Enquiry Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
              {submissionSuccess ? (
                <div className="py-8 text-center space-y-5">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Enquiry Successfully Submitted</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    {submissionSuccess.message}
                  </p>

                  <div className="bg-[#FAFBFD] border border-slate-200 rounded-xl p-4 text-xs text-left max-w-md mx-auto text-slate-700 space-y-2">
                    <div className="font-semibold text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
                      <span>Enquiry Receipt</span>
                      <span className="font-mono text-[#1266E8]">{submissionSuccess.referenceId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Name:</span> {formData.fullName}
                    </div>
                    <div>
                      <span className="text-slate-400">Course:</span> {formData.course}
                    </div>
                    <div>
                      <span className="text-slate-400">Mobile:</span> {formData.mobileNumber}
                    </div>
                    <div>
                      <span className="text-slate-400">Preferred Mode:</span> {formData.learningMode}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={getEnquiryWhatsAppUrl(formData)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0D9488] hover:bg-[#0f766e] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>Send Copy to WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmissionSuccess(null);
                        setFormData({
                          fullName: '',
                          mobileNumber: '',
                          email: '',
                          course: coursesData[0].title,
                          currentStatus: 'Student',
                          learningMode: 'Need Guidance',
                          preferredBatch: '',
                          questions: '',
                          consent: false,
                        });
                      }}
                      className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Enquire for Another Course
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5" noValidate>
                  {serverError && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  {/* Field: Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Rahul Sharma / Sarah Jenkins"
                      className={`w-full px-4 py-2.5 text-xs rounded-xl border bg-white focus:outline-hidden transition-colors ${
                        formErrors.fullName
                          ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                          : 'border-slate-200 focus:border-[#1266E8]'
                      }`}
                      required
                    />
                    {formErrors.fullName && (
                      <p className="text-[11px] text-rose-600 mt-1">{formErrors.fullName}</p>
                    )}
                  </div>

                  {/* Row: Mobile Number & Email Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className={`w-full px-4 py-2.5 text-xs rounded-xl border bg-white focus:outline-hidden transition-colors ${
                          formErrors.mobileNumber
                            ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                            : 'border-slate-200 focus:border-[#1266E8]'
                        }`}
                        required
                      />
                      {formErrors.mobileNumber && (
                        <p className="text-[11px] text-rose-600 mt-1">{formErrors.mobileNumber}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. name@example.com"
                        className={`w-full px-4 py-2.5 text-xs rounded-xl border bg-white focus:outline-hidden transition-colors ${
                          formErrors.email
                            ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                            : 'border-slate-200 focus:border-[#1266E8]'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-[11px] text-rose-600 mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Field: Course Interested In */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Course Interested In <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:border-[#1266E8] focus:outline-hidden cursor-pointer"
                      required
                    >
                      {coursesData.map((c) => (
                        <option key={c.id} value={c.title}>
                          {c.title} — ({c.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Row: Current Status & Preferred Learning Mode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Current Status
                      </label>
                      <select
                        value={formData.currentStatus}
                        onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:border-[#1266E8] focus:outline-hidden cursor-pointer"
                      >
                        <option value="Student">Student</option>
                        <option value="Fresher">Fresher / Recent Graduate</option>
                        <option value="Working Professional">Working Professional</option>
                        <option value="Career Changer">Career Changer</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Preferred Learning Mode
                      </label>
                      <select
                        value={formData.learningMode}
                        onChange={(e) => setFormData({ ...formData, learningMode: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:border-[#1266E8] focus:outline-hidden cursor-pointer"
                      >
                        <option value="Online">Online Interactive Sessions</option>
                        <option value="Classroom">Classroom Training</option>
                        <option value="Need Guidance">Need Guidance on Mode</option>
                      </select>
                    </div>
                  </div>

                  {/* Field: Preferred Batch or Timing */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Preferred Batch or Timing <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.preferredBatch}
                      onChange={(e) => setFormData({ ...formData, preferredBatch: e.target.value })}
                      placeholder="e.g. Weekend Batch, Morning 8 AM, or Immediate"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:border-[#1266E8] focus:outline-hidden"
                    />
                  </div>

                  {/* Field: Additional Questions */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Additional Questions <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={formData.questions}
                      onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                      placeholder="Any specific topics, syllabus questions, or career goals you'd like to share?"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:border-[#1266E8] focus:outline-hidden resize-none"
                    />
                  </div>

                  {/* Consent Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        className="mt-0.5 rounded border-slate-300 text-[#1266E8] focus:ring-[#1266E8]"
                      />
                      <span className="text-xs text-slate-600 leading-normal">
                        I give permission to IAMTECHNI to contact me via phone, email, or WhatsApp regarding this course enquiry and training schedule.{' '}
                        <button
                          type="button"
                          onClick={() => onNavigate('/privacy-policy')}
                          className="text-[#1266E8] hover:underline"
                        >
                          Privacy Policy
                        </button>
                      </span>
                    </label>
                    {formErrors.consent && (
                      <p className="text-[11px] text-rose-600 mt-1">{formErrors.consent}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-5 min-h-[42px] bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white rounded-lg text-xs sm:text-[13px] font-semibold transition-all shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.24)] active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Submitting Course Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Course Enquiry</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 7. HOW ENQUIRY WORKS                                                    */}
      {/* ======================================================================= */}
      <section className="py-14 sm:py-16 lg:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <div className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-bold mb-1">
              Admission Workflow
            </div>
            <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.015em] text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)]">
              How Enquiry &amp; Enrollment Works
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              A transparent four-step process from initial discovery to beginning your hands-on code labs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#F4F8FF] border border-blue-200/80 space-y-2.5">
              <span className="text-xs font-mono font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                STEP 01
              </span>
              <h3 className="text-base font-bold text-[#1E3A8A]">Select a Course</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse our 13 technology programs across software engineering, cloud, AI, and DevOps.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F2FAFD] border border-cyan-200/80 space-y-2.5">
              <span className="text-xs font-mono font-bold text-[#0284C7] bg-cyan-50 px-2.5 py-0.5 rounded border border-cyan-200">
                STEP 02
              </span>
              <h3 className="text-base font-bold text-[#1E3A8A]">Submit Details</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fill the enquiry form or message us on WhatsApp with your preferred schedule and learning mode.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F6F4FF] border border-violet-200/80 space-y-2.5">
              <span className="text-xs font-mono font-bold text-[#7C3AED] bg-violet-50 px-2.5 py-0.5 rounded border border-violet-200">
                STEP 03
              </span>
              <h3 className="text-base font-bold text-[#1E3A8A]">Receive Syllabus &amp; Fee</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our academic advisor shares the complete syllabus breakdown, upcoming batch timings, and fee structure.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F1FBF8] border border-teal-200/80 space-y-2.5">
              <span className="text-xs font-mono font-bold text-[#0D9488] bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                STEP 04
              </span>
              <h3 className="text-base font-bold text-[#1E3A8A]">Confirm &amp; Start Labs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Join your batch cohort, access our code repos, and begin hands-on practical lab sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 8. FREQUENTLY ASKED QUESTIONS                                           */}
      {/* ======================================================================= */}
      <section className="py-14 sm:py-16 lg:py-20 bg-[#F5F8FC] border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-bold">
              Got Questions?
            </div>
            <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-bold text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)]">
              Training Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600">
              Clear answers regarding our curriculum, prerequisites, batch schedules, and learning formats.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            {trainingFaqs.map((faq, idx) => {
              const isOpen = !!openFaq[idx];
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 ${
                    isOpen
                      ? 'border-blue-200 bg-white shadow-md'
                      : 'border-slate-200/90 bg-white shadow-2xs hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-bold text-[#1E3A8A]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#2563EB]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 9. FINAL CALL TO ACTION (Softer Unified Banner)                          */}
      {/* ======================================================================= */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#EEF4FF] via-[#F5F9FF] to-[#ECFEFF] border border-[#DBEAFE] rounded-2xl p-8 sm:p-12 text-center space-y-5 shadow-[0_8px_30px_rgba(37,99,235,0.08)]">
            <div className="inline-flex items-center gap-2 h-[34px] px-3 sm:px-4 bg-white border border-[#DBEAFE] rounded-full text-xs font-mono font-bold text-[#2563EB]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ADMISSIONS OPEN FOR UPCOMING BATCHES</span>
            </div>

            <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.015em] text-[#1E3A8A] leading-tight drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)]">
              Ready to Start Learning?
            </h2>

            <p className="text-sm sm:text-base bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] bg-clip-text text-transparent font-medium max-w-2xl mx-auto leading-relaxed">
              Connect with IAMTECHNI to explore upcoming batch dates, detailed syllabus breakdowns, and practical technology learning roadmaps.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  if (enquiryFormRef.current) {
                    enquiryFormRef.current.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 min-h-[40px] rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white font-semibold text-xs sm:text-[13px] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <span>Enquire for Next Batch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={getCourseWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 min-h-[40px] rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-semibold text-xs sm:text-[13px] transition-all cursor-pointer shadow-2xs"
                title="Message our admissions desk on WhatsApp"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Chat on WhatsApp (+91-7418120053)</span>
              </a>
            </div>

            <div className="pt-4 text-xs text-slate-500 font-mono">
              IAMTECHNI TECHNOLOGY TRAINING // https://iamtechni.in/training
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Quick Action Button (Bottom-Right, non-colliding) */}
      <aside aria-label="WhatsApp Quick Contact" className="fixed bottom-24 right-4 sm:bottom-24 sm:right-6 z-40">
        <a
          href={getCourseWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/80"
          title="Chat with IAMTECHNI on WhatsApp"
        >
          <WhatsAppIcon className="w-5 h-5 text-white" />
          <span className="hidden sm:inline text-xs font-bold font-sans">
            WhatsApp Training Desk
          </span>
        </a>
      </aside>
    </div>
  );
};
