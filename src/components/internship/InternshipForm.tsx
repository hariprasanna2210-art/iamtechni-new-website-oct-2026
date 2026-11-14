import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import { PageRoute } from '../../types';
import { db, isFirebaseConfigured } from '../../lib/firebase';
import {
  INTERNSHIP_COURSES,
  INTERNSHIP_DURATIONS,
  STUDENT_SEMESTERS,
} from '../../data/internship';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { AnimatedHeading } from '../common/AnimatedHeading';

export interface InternshipFormProps {
  type: 'student' | 'professional';
  onNavigate?: (route: PageRoute) => void;
}

function addMonthsToDateString(dateStr: string, months: number): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return '';
  const [yStr, mStr, dStr] = dateStr.split('-');
  const year = Number(yStr);
  const monthIndex = Number(mStr) - 1;
  const day = Number(dStr);

  const targetMonthTotal = monthIndex + months;
  const targetYear = year + Math.floor(targetMonthTotal / 12);
  const targetMonth = targetMonthTotal % 12;

  const daysInTargetMonth = new Date(
    Date.UTC(targetYear, targetMonth + 1, 0)
  ).getUTCDate();
  const clampedDay = Math.min(day, daysInTargetMonth);

  const yyyy = String(targetYear).padStart(4, '0');
  const mm = String(targetMonth + 1).padStart(2, '0');
  const dd = String(clampedDay).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function generateApplicationId(type: 'student' | 'professional'): string {
  const prefix = type === 'student' ? 'STU-' : 'PRO-';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < 6; i++) {
      suffix += chars[bytes[i] % chars.length];
    }
  } else {
    for (let i = 0; i < 6; i++) {
      suffix += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return `${prefix}${suffix}`;
}

export const InternshipForm: React.FC<InternshipFormProps> = ({
  type,
  onNavigate,
}) => {
  const routerNavigate = useNavigate();
  const handleNavigate =
    onNavigate ??
    ((route: PageRoute) => {
      routerNavigate(String(route));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

  const isStudent = type === 'student';

  // Personal details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');

  // Internship details
  const [course, setCourse] = useState('');
  const [durationMonths, setDurationMonths] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Student-only details
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState<string>('');

  // Professional-only details
  const [qualification, setQualification] = useState('');
  const [currentlyWorking, setCurrentlyWorking] = useState<'Yes' | 'No' | ''>('');
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');

  // Confirmation & honeypot
  const [confirmed, setConfirmed] = useState(false);
  const [website, setWebsite] = useState('');

  // Submission & validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedApplicationId, setSubmittedApplicationId] = useState<string | null>(null);

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleStartDateChange = (nextStartDate: string) => {
    setStartDate(nextStartDate);
    clearFieldError('startDate');
    if (nextStartDate && durationMonths) {
      const computedEnd = addMonthsToDateString(nextStartDate, Number(durationMonths));
      if (computedEnd) {
        setEndDate(computedEnd);
        clearFieldError('endDate');
      }
    }
  };

  const handleDurationChange = (nextDuration: string) => {
    setDurationMonths(nextDuration);
    clearFieldError('durationMonths');
    if (startDate && nextDuration) {
      const computedEnd = addMonthsToDateString(startDate, Number(nextDuration));
      if (computedEnd) {
        setEndDate(computedEnd);
        clearFieldError('endDate');
      }
    }
  };

  const handleWorkingChange = (value: 'Yes' | 'No') => {
    setCurrentlyWorking(value);
    clearFieldError('currentlyWorking');
    if (value === 'No') {
      clearFieldError('company');
      clearFieldError('designation');
    }
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    const cleanPincode = pincode.trim();

    if (!fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    }
    if (!email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!cleanPhone) {
      nextErrors.phone = 'Phone number is required.';
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      nextErrors.phone = 'Enter a valid 10-digit Indian mobile number.';
    }

    if (!address.trim()) {
      nextErrors.address = 'Address is required.';
    }
    if (!city.trim()) {
      nextErrors.city = 'City is required.';
    }
    if (!stateName.trim()) {
      nextErrors.state = 'State is required.';
    }
    if (!cleanPincode) {
      nextErrors.pincode = 'PIN code is required.';
    } else if (!/^\d{6}$/.test(cleanPincode)) {
      nextErrors.pincode = 'Enter a valid 6-digit PIN code.';
    }

    if (!course) {
      nextErrors.course = 'Please select a course or domain.';
    }
    if (!durationMonths || ![1, 2, 3, 6].includes(Number(durationMonths))) {
      nextErrors.durationMonths = 'Please select an internship duration.';
    }
    if (!startDate) {
      nextErrors.startDate = 'Start date is required.';
    }
    if (!endDate) {
      nextErrors.endDate = 'End date is required.';
    } else if (startDate && endDate <= startDate) {
      nextErrors.endDate = 'End date must be after the start date.';
    }

    if (isStudent) {
      if (!college.trim()) {
        nextErrors.college = 'College name is required.';
      }
      if (!department.trim()) {
        nextErrors.department = 'Department is required.';
      }
      const semNum = Number(semester);
      if (!semester || !Number.isInteger(semNum) || semNum < 1 || semNum > 8) {
        nextErrors.semester = 'Please select your semester (1 to 8).';
      }
    } else {
      if (!qualification.trim()) {
        nextErrors.qualification = 'Highest qualification is required.';
      }
      if (currentlyWorking !== 'Yes' && currentlyWorking !== 'No') {
        nextErrors.currentlyWorking = 'Please select whether you are currently working.';
      }
      if (currentlyWorking === 'Yes') {
        if (!company.trim()) {
          nextErrors.company = 'Current company is required.';
        }
        if (!designation.trim()) {
          nextErrors.designation = 'Designation is required.';
        }
      }
    }

    if (!confirmed) {
      nextErrors.confirmed = 'Please confirm that these details are correct.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Honeypot check: silently do not submit if filled
    if (website.trim() !== '') {
      return;
    }

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (!isFirebaseConfigured || !db) {
        throw new Error('Firebase is not configured.');
      }

      const generatedId = generateApplicationId(type);
      const cleanPhone = phone.replace(/[\s\-()]/g, '');

      const commonPayload = {
        type,
        applicationId: generatedId,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: cleanPhone,
        address: address.trim(),
        city: city.trim(),
        state: stateName.trim(),
        pincode: pincode.trim(),
        course,
        durationMonths: Number(durationMonths),
        startDate,
        endDate,
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      const payload = isStudent
        ? {
            ...commonPayload,
            college: college.trim(),
            department: department.trim(),
            semester: Number(semester),
          }
        : {
            ...commonPayload,
            qualification: qualification.trim(),
            currentlyWorking: currentlyWorking === 'Yes',
            company: currentlyWorking === 'Yes' ? company.trim() : '',
            designation: currentlyWorking === 'Yes' ? designation.trim() : '',
          };

      await addDoc(collection(db, 'internshipApplications'), payload);
      setSubmittedApplicationId(generatedId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSubmitError('Something went wrong. Please try again or contact us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBaseClass = (hasError: boolean) =>
    `w-full px-4 py-2.5 min-h-[44px] text-base rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-colors ${
      hasError
        ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
        : 'border-slate-200 focus:border-[#1266E8]'
    }`;

  const pageTitle = isStudent
    ? 'Student Internship Application'
    : 'Professional Internship Application';

  return (
    <div className="w-full min-w-0">
      <Breadcrumbs
        items={[
          { label: 'Training & Courses', route: '/training' },
          { label: isStudent ? 'Student Internship' : 'Professional Internship' },
        ]}
        onNavigate={handleNavigate}
      />

      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-slate-200 py-8 sm:py-12 lg:py-14 bg-gradient-to-b from-[#F0F5FF] via-[#F8FAFF] to-white">
        <div className="absolute top-0 right-1/4 w-[420px] h-[280px] bg-gradient-to-tr from-[#04C8E8]/15 via-[#1266E8]/12 to-[#5427D9]/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 min-h-[32px] px-3.5 py-1 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08)] text-xs font-mono font-bold text-[#2563EB]">
              {isStudent ? (
                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <Briefcase className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>{isStudent ? 'STUDENT INTERNSHIP' : 'PROFESSIONAL INTERNSHIP'}</span>
            </div>

            <Link
              to="/training"
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 text-xs sm:text-sm font-semibold text-[#1E3A8A] hover:text-[#2563EB] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Back to Training</span>
            </Link>
          </div>

          <AnimatedHeading
            as="h1"
            className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.015em] text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)]"
          >
            {pageTitle}
          </AnimatedHeading>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Fill in your details. Your name will appear on the certificate exactly as you enter it.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 sm:py-14 lg:py-16 bg-[#F4F7FC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 lg:p-10 shadow-2xs">
            {submittedApplicationId ? (
              <div className="py-8 sm:py-12 text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-bold text-[#1E3A8A]">
                    Application submitted!
                  </h2>
                </div>

                <div className="max-w-md mx-auto rounded-2xl bg-[#F5F8FC] border border-[#DBEAFE] px-6 py-6 space-y-2">
                  <div className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-bold">
                    Application ID
                  </div>
                  <div className="text-3xl sm:text-4xl font-mono font-extrabold tracking-wider text-[#1E3A8A] break-all">
                    {submittedApplicationId}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                  Please save this ID. We will contact you by email.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/training"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white font-semibold text-sm shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-all duration-200 active:scale-[0.98]"
                  >
                    <span>Explore Training Programs</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                {/* Hidden honeypot field */}
                <div
                  aria-hidden="true"
                  className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden"
                >
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Section 1: Personal details */}
                <div className="space-y-5">
                  <div className="border-b border-slate-200 pb-2.5">
                    <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-lg sm:text-xl font-bold text-[#1E3A8A]">
                      Personal details
                    </h2>
                  </div>

                  <div>
                    <label
                      htmlFor="internship-fullName"
                      className="block text-sm font-semibold text-slate-800 mb-1.5"
                    >
                      Full name (as it should appear on the certificate){' '}
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="internship-fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        clearFieldError('fullName');
                      }}
                      placeholder="Enter your full name"
                      className={inputBaseClass(Boolean(errors.fullName))}
                      aria-invalid={Boolean(errors.fullName)}
                      required
                    />
                    {errors.fullName && (
                      <p role="alert" className="text-xs text-rose-600 mt-1.5">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label
                        htmlFor="internship-email"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="internship-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          clearFieldError('email');
                        }}
                        placeholder="you@example.com"
                        className={inputBaseClass(Boolean(errors.email))}
                        aria-invalid={Boolean(errors.email)}
                        required
                      />
                      {errors.email && (
                        <p role="alert" className="text-xs text-rose-600 mt-1.5">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="internship-phone"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        Phone (10-digit Indian mobile number){' '}
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="internship-phone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={14}
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          clearFieldError('phone');
                        }}
                        placeholder="e.g. 9876543210"
                        className={inputBaseClass(Boolean(errors.phone))}
                        aria-invalid={Boolean(errors.phone)}
                        required
                      />
                      {errors.phone && (
                        <p role="alert" className="text-xs text-rose-600 mt-1.5">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="internship-address"
                      className="block text-sm font-semibold text-slate-800 mb-1.5"
                    >
                      Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="internship-address"
                      type="text"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        clearFieldError('address');
                      }}
                      placeholder="House/Flat No., Street, Area"
                      className={inputBaseClass(Boolean(errors.address))}
                      aria-invalid={Boolean(errors.address)}
                      required
                    />
                    {errors.address && (
                      <p role="alert" className="text-xs text-rose-600 mt-1.5">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                    <div>
                      <label
                        htmlFor="internship-city"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        City <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="internship-city"
                        type="text"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          clearFieldError('city');
                        }}
                        placeholder="e.g. Puducherry"
                        className={inputBaseClass(Boolean(errors.city))}
                        aria-invalid={Boolean(errors.city)}
                        required
                      />
                      {errors.city && (
                        <p role="alert" className="text-xs text-rose-600 mt-1.5">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="internship-state"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        State <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="internship-state"
                        type="text"
                        value={stateName}
                        onChange={(e) => {
                          setStateName(e.target.value);
                          clearFieldError('state');
                        }}
                        placeholder="e.g. Tamil Nadu"
                        className={inputBaseClass(Boolean(errors.state))}
                        aria-invalid={Boolean(errors.state)}
                        required
                      />
                      {errors.state && (
                        <p role="alert" className="text-xs text-rose-600 mt-1.5">
                          {errors.state}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="internship-pincode"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        PIN code <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="internship-pincode"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => {
                          setPincode(e.target.value);
                          clearFieldError('pincode');
                        }}
                        placeholder="e.g. 605001"
                        className={inputBaseClass(Boolean(errors.pincode))}
                        aria-invalid={Boolean(errors.pincode)}
                        required
                      />
                      {errors.pincode && (
                        <p role="alert" className="text-xs text-rose-600 mt-1.5">
                          {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Internship details */}
                <div className="space-y-5">
                  <div className="border-b border-slate-200 pb-2.5">
                    <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-lg sm:text-xl font-bold text-[#1E3A8A]">
                      Internship details
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label
                        htmlFor="internship-course"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        Course / Domain <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="internship-course"
                        value={course}
                        onChange={(e) => {
                          setCourse(e.target.value);
                          clearFieldError('course');
                        }}
                        className={`${inputBaseClass(Boolean(errors.course))} cursor-pointer`}
                        aria-invalid={Boolean(errors.course)}
                        required
                      >
                        <option value="">Select a course / domain</option>
                        {INTERNSHIP_COURSES.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                      {errors.course && (
                        <p role="alert" className="text-xs text-rose-600 mt-1.5">
                          {errors.course}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="internship-duration"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        Duration in months <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="internship-duration"
                        value={durationMonths}
                        onChange={(e) => handleDurationChange(e.target.value)}
                        className={`${inputBaseClass(Boolean(errors.durationMonths))} cursor-pointer`}
                        aria-invalid={Boolean(errors.durationMonths)}
                        required
                      >
                        <option value="">Select duration</option>
                        {INTERNSHIP_DURATIONS.map((m) => (
                          <option key={m} value={String(m)}>
                            {m} {m === 1 ? 'Month' : 'Months'}
                          </option>
                        ))}
                      </select>
                      {errors.durationMonths && (
                        <p role="alert" className="text-xs text-rose-600 mt-1.5">
                          {errors.durationMonths}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label
                        htmlFor="internship-startDate"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        Start date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="internship-startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className={inputBaseClass(Boolean(errors.startDate))}
                        aria-invalid={Boolean(errors.startDate)}
                        required
                      />
                      {errors.startDate && (
                        <p role="alert" className="text-xs text-rose-600 mt-1.5">
                          {errors.startDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="internship-endDate"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        End date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="internship-endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          clearFieldError('endDate');
                        }}
                        className={inputBaseClass(Boolean(errors.endDate))}
                        aria-invalid={Boolean(errors.endDate)}
                        required
                      />
                      {errors.endDate && (
                        <p role="alert" className="text-xs text-rose-600 mt-1.5">
                          {errors.endDate}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 3: Academic (Student) OR Experience (Professional) */}
                {isStudent ? (
                  <div className="space-y-5">
                    <div className="border-b border-slate-200 pb-2.5">
                      <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-lg sm:text-xl font-bold text-[#1E3A8A]">
                        Academic details
                      </h2>
                    </div>

                    <div>
                      <label
                        htmlFor="internship-college"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        College name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="internship-college"
                        type="text"
                        value={college}
                        onChange={(e) => {
                          setCollege(e.target.value);
                          clearFieldError('college');
                        }}
                        placeholder="Enter your college or university name"
                        className={inputBaseClass(Boolean(errors.college))}
                        aria-invalid={Boolean(errors.college)}
                        required
                      />
                      {errors.college && (
                        <p role="alert" className="text-xs text-rose-600 mt-1.5">
                          {errors.college}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label
                          htmlFor="internship-department"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          Department <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="internship-department"
                          type="text"
                          value={department}
                          onChange={(e) => {
                            setDepartment(e.target.value);
                            clearFieldError('department');
                          }}
                          placeholder="e.g. B.Tech CSE / MCA"
                          className={inputBaseClass(Boolean(errors.department))}
                          aria-invalid={Boolean(errors.department)}
                          required
                        />
                        {errors.department && (
                          <p role="alert" className="text-xs text-rose-600 mt-1.5">
                            {errors.department}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="internship-semester"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          Semester <span className="text-rose-500">*</span>
                        </label>
                        <select
                          id="internship-semester"
                          value={semester}
                          onChange={(e) => {
                            setSemester(e.target.value);
                            clearFieldError('semester');
                          }}
                          className={`${inputBaseClass(Boolean(errors.semester))} cursor-pointer`}
                          aria-invalid={Boolean(errors.semester)}
                          required
                        >
                          <option value="">Select semester</option>
                          {STUDENT_SEMESTERS.map((sem) => (
                            <option key={sem} value={String(sem)}>
                              Semester {sem}
                            </option>
                          ))}
                        </select>
                        {errors.semester && (
                          <p role="alert" className="text-xs text-rose-600 mt-1.5">
                            {errors.semester}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="border-b border-slate-200 pb-2.5">
                      <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-lg sm:text-xl font-bold text-[#1E3A8A]">
                        Education &amp; work details
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label
                          htmlFor="internship-qualification"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          Highest qualification <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="internship-qualification"
                          type="text"
                          value={qualification}
                          onChange={(e) => {
                            setQualification(e.target.value);
                            clearFieldError('qualification');
                          }}
                          placeholder="e.g. B.E. / B.Tech / MCA / MBA"
                          className={inputBaseClass(Boolean(errors.qualification))}
                          aria-invalid={Boolean(errors.qualification)}
                          required
                        />
                        {errors.qualification && (
                          <p role="alert" className="text-xs text-rose-600 mt-1.5">
                            {errors.qualification}
                          </p>
                        )}
                      </div>

                      <div>
                        <span className="block text-sm font-semibold text-slate-800 mb-1.5">
                          Currently working? <span className="text-rose-500">*</span>
                        </span>
                        <div className="grid grid-cols-2 gap-3">
                          {(['Yes', 'No'] as const).map((opt) => {
                            const selected = currentlyWorking === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleWorkingChange(opt)}
                                className={`min-h-[44px] px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                                  selected
                                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#2563EB]'
                                }`}
                                aria-pressed={selected}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {errors.currentlyWorking && (
                          <p role="alert" className="text-xs text-rose-600 mt-1.5">
                            {errors.currentlyWorking}
                          </p>
                        )}
                      </div>
                    </div>

                    {currentlyWorking === 'Yes' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        <div>
                          <label
                            htmlFor="internship-company"
                            className="block text-sm font-semibold text-slate-800 mb-1.5"
                          >
                            Current company <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id="internship-company"
                            type="text"
                            value={company}
                            onChange={(e) => {
                              setCompany(e.target.value);
                              clearFieldError('company');
                            }}
                            placeholder="Enter company name"
                            className={inputBaseClass(Boolean(errors.company))}
                            aria-invalid={Boolean(errors.company)}
                            required
                          />
                          {errors.company && (
                            <p role="alert" className="text-xs text-rose-600 mt-1.5">
                              {errors.company}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="internship-designation"
                            className="block text-sm font-semibold text-slate-800 mb-1.5"
                          >
                            Designation <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id="internship-designation"
                            type="text"
                            value={designation}
                            onChange={(e) => {
                              setDesignation(e.target.value);
                              clearFieldError('designation');
                            }}
                            placeholder="e.g. Junior Software Engineer"
                            className={inputBaseClass(Boolean(errors.designation))}
                            aria-invalid={Boolean(errors.designation)}
                            required
                          />
                          {errors.designation && (
                            <p role="alert" className="text-xs text-rose-600 mt-1.5">
                              {errors.designation}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Confirmation checkbox */}
                <div className="pt-2 border-t border-slate-200">
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={(e) => {
                        setConfirmed(e.target.checked);
                        clearFieldError('confirmed');
                      }}
                      className="w-5 h-5 rounded border-slate-300 text-[#1E3A8A] focus:ring-[#2563EB] shrink-0 cursor-pointer"
                      aria-invalid={Boolean(errors.confirmed)}
                      required
                    />
                    <span className="text-sm text-slate-700 leading-snug">
                      I confirm these details are correct. <span className="text-rose-500">*</span>
                    </span>
                  </label>
                  {errors.confirmed && (
                    <p role="alert" className="text-xs text-rose-600 mt-1">
                      {errors.confirmed}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto sm:min-w-[240px] py-3 px-6 min-h-[48px] bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white rounded-xl text-sm font-semibold transition-all shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.24)] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default InternshipForm;
