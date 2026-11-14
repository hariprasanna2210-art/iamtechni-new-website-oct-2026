import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  GraduationCap,
  Pencil,
  Search,
  User,
} from 'lucide-react';
import type { IndiaPincode } from 'india-pincode/browser';
import { PageRoute } from '../../types';
import { db, isFirebaseConfigured } from '../../lib/firebase';
import { formatIndiaSubmittedAt, sendInternshipEmail } from '../../lib/email';
import {
  COURSES,
  DEGREES,
  DEPARTMENTS,
  DURATIONS,
  QUALIFICATIONS,
  SEMESTERS,
  STATES,
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

function formatDisplayDate(dateStr: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const [y, m, d] = dateStr.split('-').map(Number);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${d} ${months[m - 1]} ${y}`;
}

function toTitleCaseWords(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function normalizeIndianPhone(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.length > 10) {
    if (digits.startsWith('91')) {
      digits = digits.slice(2);
    } else if (digits.startsWith('0')) {
      digits = digits.slice(1);
    }
  }
  if (digits.length > 10) {
    digits = digits.slice(-10);
  }
  return digits;
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

const STATE_ALIASES: Record<string, string> = {
  'the dadra and nagar haveli and daman and diu': 'Dadra and Nagar Haveli and Daman and Diu',
  'dadra & nagar haveli and daman & diu': 'Dadra and Nagar Haveli and Daman and Diu',
  'dadra and nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
  'daman and diu': 'Dadra and Nagar Haveli and Daman and Diu',
  pondicherry: 'Puducherry',
  orissa: 'Odisha',
  uttaranchal: 'Uttarakhand',
  'nct of delhi': 'Delhi',
  'jammu & kashmir': 'Jammu and Kashmir',
  'andaman & nicobar islands': 'Andaman and Nicobar Islands',
};

function findMatchingStateName(raw: string): string {
  const normalized = raw.trim().replace(/\s+/g, ' ').toLowerCase();
  if (!normalized) return '';
  if (STATE_ALIASES[normalized]) return STATE_ALIASES[normalized];
  const exact = STATES.find((st) => st.toLowerCase() === normalized);
  return exact ?? '';
}

function toApiStateName(uiState: string): string {
  if (uiState === 'Dadra and Nagar Haveli and Daman and Diu') {
    return 'THE DADRA AND NAGAR HAVELI AND DAMAN AND DIU';
  }
  return uiState;
}

function formatDistrictDisplayName(rawDistrict: string): string {
  const withoutBrackets = rawDistrict.replace(/\s*\([^)]*\)/g, '').trim();
  const base = withoutBrackets || rawDistrict.trim();
  return toTitleCaseWords(base);
}

interface DistrictOption {
  label: string;
  rawNames: string[];
}

interface PinOption {
  pincode: string;
  areas: string[];
  summary: string;
}

interface SearchableOption {
  value: string;
  label: string;
  sublabel?: string;
  searchText?: string;
}

interface SearchableSelectProps {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  options: SearchableOption[];
  otherOptionLabel: string;
  placeholder: string;
  searchPlaceholder: string;
  emptySearchMessage?: string;
  disabled?: boolean;
  hasError?: boolean;
  isValid?: boolean;
  onFocusTrigger?: () => void;
  onSelect: (value: string) => void;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  id,
  label,
  required,
  value,
  options,
  otherOptionLabel,
  placeholder,
  searchPlaceholder,
  emptySearchMessage = 'No matching results found.',
  disabled = false,
  hasError = false,
  isValid = false,
  onFocusTrigger,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => {
      const target = opt.searchText ?? `${opt.label} ${opt.sublabel ?? ''}`;
      return target.toLowerCase().includes(q);
    });
  }, [options, query]);

  const allDisplayedItems: SearchableOption[] = useMemo(
    () => [
      ...filteredOptions,
      { value: '__OTHER__', label: otherOptionLabel },
    ],
    [filteredOptions, otherOptionLabel]
  );

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const activeEl = optionRefs.current[highlightedIndex];
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  useEffect(() => {
    if (disabled && isOpen) {
      setIsOpen(false);
    }
  }, [disabled, isOpen]);

  const openDropdown = () => {
    if (disabled) return;
    setQuery('');
    const currentIdx = allDisplayedItems.findIndex((item) => item.value === value);
    setHighlightedIndex(currentIdx >= 0 ? currentIdx : 0);
    setIsOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  const handleToggle = () => {
    if (disabled) return;
    if (isOpen) {
      setIsOpen(false);
    } else {
      openDropdown();
    }
  };

  const handlePick = (nextValue: string) => {
    onSelect(nextValue);
    setIsOpen(false);
    setQuery('');
    triggerRef.current?.focus();
  };

  const handleKeyDownInMenu = (e: React.KeyboardEvent) => {
    if (allDisplayedItems.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % allDisplayedItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev <= 0 ? allDisplayedItems.length - 1 : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = allDisplayedItems[highlightedIndex];
      if (chosen) {
        handlePick(chosen.value);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value),
    [options, value]
  );

  const displayValue =
    value === '__OTHER__'
      ? otherOptionLabel
      : selectedOption
      ? selectedOption.label
      : placeholder;

  const isPlaceholderShown = !value || (value !== '__OTHER__' && !selectedOption);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <button
          ref={triggerRef}
          id={id}
          type="button"
          disabled={disabled}
          onFocus={onFocusTrigger}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
              e.preventDefault();
              openDropdown();
            }
          }}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={hasError}
          className={`w-full h-12 min-h-[48px] pl-4 pr-11 py-2.5 text-base rounded-xl border text-left transition-all flex items-center justify-between focus:outline-hidden focus:ring-4 ${
            disabled
              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
              : hasError
              ? 'bg-rose-50/30 border-rose-500 focus:border-rose-500 focus:ring-rose-500/15 cursor-pointer'
              : 'bg-[#F4F7FC] border-slate-200 focus:bg-white focus:border-[#1C35EA] focus:ring-[#1C35EA]/15 cursor-pointer'
          }`}
        >
          <span
            className={`truncate ${
              disabled || isPlaceholderShown ? 'text-slate-400' : 'text-slate-900'
            }`}
          >
            {displayValue}
          </span>
        </button>

        {isValid && !hasError && (
          <Check
            className="w-4 h-4 text-emerald-600 absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
        )}
        <ChevronDown
          className={`w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-transform ${
            disabled ? 'text-slate-400' : 'text-[#1C35EA]'
          } ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </div>

      {isOpen && !disabled && (
        <div
          onKeyDown={handleKeyDownInMenu}
          className="absolute left-0 right-0 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl z-30 overflow-hidden"
        >
          <div className="p-2 border-b border-slate-100 bg-[#F8FAFF]">
            <div className="relative">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                placeholder={searchPlaceholder}
                aria-label={`${label}${required ? ' search' : ''}`}
                className="w-full h-11 pl-9 pr-3 text-base rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1C35EA] focus:ring-2 focus:ring-[#1C35EA]/15"
              />
            </div>
          </div>

          <ul
            role="listbox"
            aria-label={`${label} options`}
            className="max-h-[352px] overflow-y-auto py-1"
          >
            {filteredOptions.length === 0 && query.trim() !== '' && (
              <li className="px-4 py-2.5 text-sm text-slate-500">
                {emptySearchMessage}
              </li>
            )}

            {allDisplayedItems.map((item, idx) => {
              const isOther = item.value === '__OTHER__';
              const selected = value === item.value;
              const active = idx === highlightedIndex;
              return (
                <li
                  key={item.value}
                  role="option"
                  aria-selected={selected}
                  className={isOther ? 'border-t border-slate-100 mt-1 pt-1' : undefined}
                >
                  <button
                    ref={(el) => {
                      optionRefs.current[idx] = el;
                    }}
                    type="button"
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => handlePick(item.value)}
                    className={`w-full min-h-[44px] px-4 py-2.5 text-left text-base flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#1C35EA] text-white'
                        : active
                        ? 'bg-[#EEF4FF] text-[#1C35EA]'
                        : 'text-slate-800 hover:bg-[#EEF4FF] hover:text-[#1C35EA]'
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate ${
                          item.sublabel
                            ? 'font-bold'
                            : selected
                            ? 'font-semibold'
                            : 'font-normal'
                        }`}
                      >
                        {item.label}
                      </span>
                      {item.sublabel && (
                        <span
                          className={`block text-xs truncate mt-0.5 ${
                            selected ? 'text-white/80' : 'text-slate-500'
                          }`}
                        >
                          {item.sublabel}
                        </span>
                      )}
                    </span>
                    {selected && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

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

  // DOM Refs for autofill re-reading and section scrolling
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const stateRef = useRef<HTMLSelectElement>(null);
  const cityAutofillRef = useRef<HTMLInputElement>(null);
  const cityOtherRef = useRef<HTMLInputElement>(null);
  const pincodeAutofillRef = useRef<HTMLInputElement>(null);
  const pincodeOtherRef = useRef<HTMLInputElement>(null);
  const areaAutofillRef = useRef<HTMLInputElement>(null);
  const areaOtherRef = useRef<HTMLInputElement>(null);

  const personalSectionRef = useRef<HTMLDivElement>(null);
  const internshipSectionRef = useRef<HTMLDivElement>(null);
  const specificSectionRef = useRef<HTMLDivElement>(null);

  // Lazy-loaded India Pincode browser engine (only loaded on internship form pages)
  const [indiaPincode, setIndiaPincode] = useState<IndiaPincode | null>(null);
  const [isLocationsLoading, setIsLocationsLoading] = useState(true);
  const [locationsLoadFailed, setLocationsLoadFailed] = useState(false);

  // Personal details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [stateName, setStateName] = useState('');
  const [city, setCity] = useState('');
  const [cityOther, setCityOther] = useState('');
  const [pincode, setPincode] = useState('');
  const [pincodeOther, setPincodeOther] = useState('');
  const [area, setArea] = useState('');
  const [areaOther, setAreaOther] = useState('');

  // Internship details
  const [course, setCourse] = useState('');
  const [courseOther, setCourseOther] = useState('');
  const [durationMonths, setDurationMonths] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // College details (Student)
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('');
  const [degreeOther, setDegreeOther] = useState('');
  const [department, setDepartment] = useState('');
  const [departmentOther, setDepartmentOther] = useState('');
  const [semester, setSemester] = useState<string>('');

  // Work details (Professional)
  const [qualification, setQualification] = useState('');
  const [qualificationOther, setQualificationOther] = useState('');
  const [currentlyWorking, setCurrentlyWorking] = useState<'Yes' | 'No' | ''>('');
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');

  // Confirmation & honeypot
  const [confirmed, setConfirmed] = useState(false);
  const [website, setWebsite] = useState('');

  // Step, validation & submission state
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedApplicationId, setSubmittedApplicationId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  // Dynamically load india-pincode/browser and /data/pincodes.json.gz only on internship form pages
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { getIndiaPincode } = await import('india-pincode/browser');
        const instance = await getIndiaPincode('/data/pincodes.json.gz');
        if (!active) return;
        setIndiaPincode(instance);
        setLocationsLoadFailed(false);
      } catch {
        if (!active) return;
        setIndiaPincode(null);
        setLocationsLoadFailed(true);
      } finally {
        if (active) {
          setIsLocationsLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // Track active step while scrolling through form sections
  useEffect(() => {
    if (submittedApplicationId) return;
    if (isReviewing) {
      setActiveStep(4);
      return;
    }

    const sections: Array<{ step: 1 | 2 | 3; el: HTMLDivElement | null }> = [
      { step: 1, el: personalSectionRef.current },
      { step: 2, el: internshipSectionRef.current },
      { step: 3, el: specificSectionRef.current },
    ];

    const validSections = sections.filter((s) => s.el !== null);
    if (validSections.length === 0 || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const matched = validSections.find((s) => s.el === visible[0].target);
          if (matched) setActiveStep(matched.step);
        }
      },
      { rootMargin: '-120px 0px -45% 0px', threshold: 0.1 }
    );

    validSections.forEach((s) => {
      if (s.el) observer.observe(s.el);
    });

    return () => observer.disconnect();
  }, [isReviewing, submittedApplicationId]);

  // Districts / cities for selected state
  const getDistrictsForState = (engine: IndiaPincode | null, uiState: string): DistrictOption[] => {
    if (!engine || !uiState) return [];
    const res = engine.getDistrictsByState(toApiStateName(uiState));
    if (!res.success || !res.data) return [];

    const byLabel = new Map<string, string[]>();
    for (const raw of res.data) {
      const label = formatDistrictDisplayName(raw);
      if (!label) continue;
      const existing = byLabel.get(label);
      if (existing) {
        if (!existing.includes(raw)) existing.push(raw);
      } else {
        byLabel.set(label, [raw]);
      }
    }

    return Array.from(byLabel.entries())
      .map(([label, rawNames]) => ({ label, rawNames }))
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  const districtOptions = useMemo(
    () => getDistrictsForState(indiaPincode, stateName),
    [indiaPincode, stateName]
  );

  // PIN options for selected State + City / District
  const getPinsForDistrict = (
    engine: IndiaPincode | null,
    uiState: string,
    selectedCityLabel: string,
    districts: DistrictOption[]
  ): PinOption[] => {
    if (!engine || !uiState || !selectedCityLabel || selectedCityLabel === '__OTHER__') {
      return [];
    }
    const matchedDistrict = districts.find((d) => d.label === selectedCityLabel);
    if (!matchedDistrict) return [];

    const apiStateLower = toApiStateName(uiState).toLowerCase();
    const areasByPin = new Map<string, string[]>();

    for (const rawDistrict of matchedDistrict.rawNames) {
      let page = 1;
      let totalPages = 1;
      do {
        const res = engine.getByDistrict(rawDistrict, { page, limit: 500 });
        if (!res.success || !res.data) break;
        totalPages = res.data.totalPages || 1;
        for (const po of res.data.data) {
          if (po.state.trim().toLowerCase() !== apiStateLower) continue;
          const pin = po.pincode.trim();
          const areaName = po.area.trim();
          if (!pin) continue;
          const list = areasByPin.get(pin);
          if (list) {
            if (areaName && !list.includes(areaName)) list.push(areaName);
          } else {
            areasByPin.set(pin, areaName ? [areaName] : []);
          }
        }
        page += 1;
      } while (page <= totalPages);
    }

    return Array.from(areasByPin.entries())
      .map(([pin, areas]) => {
        const preview = areas.slice(0, 4).join(', ');
        const summary = areas.length > 4 ? `${preview}, …` : preview;
        return { pincode: pin, areas, summary };
      })
      .sort((a, b) => a.pincode.localeCompare(b.pincode));
  };

  const pinOptions = useMemo(
    () => getPinsForDistrict(indiaPincode, stateName, city, districtOptions),
    [indiaPincode, stateName, city, districtOptions]
  );

  // Areas for selected PIN code
  const areaListForSelectedPin = useMemo(() => {
    if (!indiaPincode || locationsLoadFailed || !pincode || pincode === '__OTHER__') {
      return [] as string[];
    }
    const fromDistrict = pinOptions.find((p) => p.pincode === pincode);
    if (fromDistrict && fromDistrict.areas.length > 0) {
      return fromDistrict.areas;
    }
    if (/^\d{6}$/.test(pincode)) {
      const summary = indiaPincode.getPincodeSummary(pincode);
      if (summary.success && summary.data) {
        const unique: string[] = [];
        for (const item of summary.data.areas) {
          const name = item.area.trim();
          if (name && !unique.includes(name)) unique.push(name);
        }
        return unique;
      }
    }
    return [] as string[];
  }, [indiaPincode, locationsLoadFailed, pincode, pinOptions]);

  const isManualCityMode = locationsLoadFailed;
  const isManualPinMode = locationsLoadFailed || city === '__OTHER__';
  const isManualAreaMode =
    locationsLoadFailed || city === '__OTHER__' || pincode === '__OTHER__';

  const cityDropdownOptions: SearchableOption[] = useMemo(
    () => districtOptions.map((d) => ({ value: d.label, label: d.label })),
    [districtOptions]
  );

  const pinDropdownOptions: SearchableOption[] = useMemo(
    () =>
      pinOptions.map((p) => ({
        value: p.pincode,
        label: p.pincode,
        sublabel: p.summary,
        searchText: `${p.pincode} ${p.areas.join(' ')}`,
      })),
    [pinOptions]
  );

  const areaDropdownOptions: SearchableOption[] = useMemo(
    () => areaListForSelectedPin.map((a) => ({ value: a, label: a })),
    [areaListForSelectedPin]
  );

  const findDistrictLabelMatch = (districts: DistrictOption[], rawCity: string): string => {
    const formatted = formatDistrictDisplayName(rawCity).toLowerCase();
    if (!formatted) return '';
    const found = districts.find(
      (d) =>
        d.label.toLowerCase() === formatted ||
        d.rawNames.some((r) => r.trim().toLowerCase() === rawCity.trim().toLowerCase())
    );
    return found ? found.label : '';
  };

  // Apply raw city value (from autofill or API) against current state districts
  const applyRawCityForState = (targetState: string, rawCity: string) => {
    const cleaned = formatDistrictDisplayName(rawCity);
    if (!cleaned) return;
    if (locationsLoadFailed) {
      setCityOther(cleaned);
      clearFieldError('city');
      return;
    }
    if (targetState && indiaPincode) {
      const districts = getDistrictsForState(indiaPincode, targetState);
      const matched = findDistrictLabelMatch(districts, rawCity);
      if (matched) {
        setCity(matched);
        setCityOther('');
        clearFieldError('city');
        clearFieldError('cityOther');
        return;
      }
    }
    setCity('__OTHER__');
    setCityOther(cleaned);
    clearFieldError('city');
    clearFieldError('cityOther');
  };

  // Reconcile pending autofill city/PIN/area once indiaPincode finishes loading
  useEffect(() => {
    if (!indiaPincode || !stateName) return;

    const currentRawCity =
      city === '__OTHER__' ? cityOther : (cityAutofillRef.current?.value ?? '').trim();
    if (currentRawCity && !districtOptions.some((d) => d.label === city)) {
      const matchedCity = findDistrictLabelMatch(districtOptions, currentRawCity);
      if (matchedCity) {
        setCity(matchedCity);
        setCityOther('');
        clearFieldError('city');
        clearFieldError('cityOther');
      } else if (city !== '__OTHER__') {
        setCity('__OTHER__');
        setCityOther(formatDistrictDisplayName(currentRawCity));
      }
    }
  }, [indiaPincode, stateName, districtOptions]);

  // State change clears City, PIN, and Area when changing from an already-selected state
  const handleStateChange = (rawValue: string) => {
    const matched = findMatchingStateName(rawValue) || rawValue;
    const hadPreviousState = Boolean(stateName);
    setStateName(matched);
    clearFieldError('state');

    if (hadPreviousState) {
      setCity('');
      setCityOther('');
      setPincode('');
      setPincodeOther('');
      setArea('');
      setAreaOther('');
      clearFieldError('city');
      clearFieldError('cityOther');
      clearFieldError('pincode');
      clearFieldError('pincodeOther');
      clearFieldError('area');
      clearFieldError('areaOther');
    } else if (matched) {
      const pendingCity =
        (city === '__OTHER__' ? cityOther : city) ||
        (cityAutofillRef.current?.value ?? '').trim();
      if (pendingCity) {
        applyRawCityForState(matched, pendingCity);
      }
    }
  };

  const handleSelectCityOption = (nextCity: string) => {
    const changed = nextCity !== city;
    setCity(nextCity);
    if (nextCity !== '__OTHER__') {
      setCityOther('');
    }
    clearFieldError('city');
    clearFieldError('cityOther');

    if (changed) {
      setPincode('');
      setPincodeOther('');
      setArea('');
      setAreaOther('');
      clearFieldError('pincode');
      clearFieldError('pincodeOther');
      clearFieldError('area');
      clearFieldError('areaOther');
    }
  };

  const handleSelectPinOption = (nextPin: string) => {
    const changed = nextPin !== pincode;
    setPincode(nextPin);
    if (nextPin !== '__OTHER__') {
      setPincodeOther('');
    }
    clearFieldError('pincode');
    clearFieldError('pincodeOther');

    if (changed) {
      setArea('');
      setAreaOther('');
      clearFieldError('area');
      clearFieldError('areaOther');
    }

    if (nextPin && nextPin !== '__OTHER__') {
      const matchedPin = pinOptions.find((p) => p.pincode === nextPin);
      if (matchedPin && matchedPin.areas.length === 1) {
        setArea(matchedPin.areas[0]);
        setAreaOther('');
        clearFieldError('area');
      }
    }
  };

  const handleSelectAreaOption = (nextArea: string) => {
    setArea(nextArea);
    if (nextArea !== '__OTHER__') {
      setAreaOther('');
    }
    clearFieldError('area');
    clearFieldError('areaOther');
  };

  const applyAutofillPin = (rawPin: string) => {
    const digitsOnly = rawPin.replace(/\D/g, '').slice(0, 6);
    if (!digitsOnly) return;

    if (isManualPinMode) {
      setPincodeOther(digitsOnly);
      clearFieldError('pincode');
      return;
    }

    if (pinOptions.some((p) => p.pincode === digitsOnly)) {
      handleSelectPinOption(digitsOnly);
    } else {
      setPincode('__OTHER__');
      setPincodeOther(digitsOnly);
      setArea('');
      clearFieldError('pincode');
      clearFieldError('pincodeOther');
    }
  };

  const applyAutofillArea = (rawArea: string) => {
    const trimmed = rawArea.trim();
    if (!trimmed) return;

    if (isManualAreaMode) {
      setAreaOther(trimmed);
      clearFieldError('area');
      return;
    }

    const matched = areaListForSelectedPin.find(
      (a) => a.toLowerCase() === trimmed.toLowerCase()
    );
    if (matched) {
      setArea(matched);
      setAreaOther('');
      clearFieldError('area');
      clearFieldError('areaOther');
    } else {
      setArea('__OTHER__');
      setAreaOther(trimmed);
      clearFieldError('area');
      clearFieldError('areaOther');
    }
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

  // Re-read actual DOM input values before validation / review so browser autofill is never lost
  const syncAndReadAutofillValues = () => {
    const domFullName = toTitleCaseWords(fullNameRef.current?.value ?? fullName);
    const domEmail = (emailRef.current?.value ?? email).trim();
    const domPhone = normalizeIndianPhone(phoneRef.current?.value ?? phone);
    const domAddress = addressRef.current?.value ?? address;
    const rawDomState = stateRef.current?.value ?? stateName;
    const domState =
      findMatchingStateName(rawDomState) || (STATES.includes(rawDomState) ? rawDomState : '');

    const domAutofillCity = (cityAutofillRef.current?.value ?? '').trim();
    const domCityOther = toTitleCaseWords(cityOtherRef.current?.value ?? cityOther);
    const domPincodeOther = (pincodeOtherRef.current?.value ?? pincodeOther)
      .replace(/\D/g, '')
      .slice(0, 6);
    const domAutofillPin = (pincodeAutofillRef.current?.value ?? '')
      .replace(/\D/g, '')
      .slice(0, 6);
    const domAreaOther = (areaOtherRef.current?.value ?? areaOther).trim();
    const domAutofillArea = (areaAutofillRef.current?.value ?? '').trim();

    setFullName(domFullName);
    setEmail(domEmail);
    setPhone(domPhone);
    setAddress(domAddress);
    if (domState !== stateName) {
      setStateName(domState);
    }

    const activeDistricts = getDistrictsForState(indiaPincode, domState);

    let resolvedCitySelect = city;
    let resolvedCityOtherVal = domCityOther;

    if (locationsLoadFailed) {
      resolvedCitySelect = '__OTHER__';
      setCityOther(domCityOther);
    } else if (!resolvedCitySelect && domAutofillCity) {
      const matched = domState ? findDistrictLabelMatch(activeDistricts, domAutofillCity) : '';
      if (matched) {
        resolvedCitySelect = matched;
        resolvedCityOtherVal = '';
        setCity(matched);
        setCityOther('');
      } else {
        const formatted = formatDistrictDisplayName(domAutofillCity);
        resolvedCitySelect = '__OTHER__';
        resolvedCityOtherVal = formatted;
        setCity('__OTHER__');
        setCityOther(formatted);
      }
    } else if (resolvedCitySelect === '__OTHER__') {
      setCityOther(domCityOther);
    }

    const nextManualPinMode = locationsLoadFailed || resolvedCitySelect === '__OTHER__';
    const nextPinOptions = !nextManualPinMode
      ? getPinsForDistrict(indiaPincode, domState, resolvedCitySelect, activeDistricts)
      : [];

    let resolvedPinSelect = pincode;
    let resolvedPinOtherVal = domPincodeOther;

    if (nextManualPinMode) {
      setPincodeOther(domPincodeOther);
    } else if (!resolvedPinSelect && domAutofillPin) {
      if (nextPinOptions.some((p) => p.pincode === domAutofillPin)) {
        resolvedPinSelect = domAutofillPin;
        resolvedPinOtherVal = '';
        setPincode(domAutofillPin);
        setPincodeOther('');
      } else {
        resolvedPinSelect = '__OTHER__';
        resolvedPinOtherVal = domAutofillPin;
        setPincode('__OTHER__');
        setPincodeOther(domAutofillPin);
      }
    } else if (resolvedPinSelect === '__OTHER__') {
      setPincodeOther(domPincodeOther);
    }

    const nextManualAreaMode =
      locationsLoadFailed ||
      resolvedCitySelect === '__OTHER__' ||
      resolvedPinSelect === '__OTHER__';

    let nextAreasForPin: string[] = [];
    if (!nextManualAreaMode && resolvedPinSelect) {
      const foundPinOpt = nextPinOptions.find((p) => p.pincode === resolvedPinSelect);
      if (foundPinOpt) {
        nextAreasForPin = foundPinOpt.areas;
      } else if (indiaPincode && /^\d{6}$/.test(resolvedPinSelect)) {
        const sum = indiaPincode.getPincodeSummary(resolvedPinSelect);
        if (sum.success && sum.data) {
          nextAreasForPin = Array.from(
            new Set(sum.data.areas.map((a) => a.area.trim()).filter(Boolean))
          );
        }
      }
    }

    let resolvedAreaSelect = area;
    let resolvedAreaOtherVal = domAreaOther;

    if (nextManualAreaMode) {
      setAreaOther(domAreaOther);
    } else if (!resolvedAreaSelect && nextAreasForPin.length === 1) {
      resolvedAreaSelect = nextAreasForPin[0];
      resolvedAreaOtherVal = '';
      setArea(resolvedAreaSelect);
      setAreaOther('');
    } else if (!resolvedAreaSelect && domAutofillArea) {
      const matchedArea = nextAreasForPin.find(
        (a) => a.toLowerCase() === domAutofillArea.toLowerCase()
      );
      if (matchedArea) {
        resolvedAreaSelect = matchedArea;
        resolvedAreaOtherVal = '';
        setArea(matchedArea);
        setAreaOther('');
      } else {
        resolvedAreaSelect = '__OTHER__';
        resolvedAreaOtherVal = domAutofillArea;
        setArea('__OTHER__');
        setAreaOther(domAutofillArea);
      }
    } else if (resolvedAreaSelect === '__OTHER__') {
      setAreaOther(domAreaOther);
    }

    return {
      fullName: domFullName,
      email: domEmail,
      phone: domPhone,
      address: domAddress,
      state: domState,
      city: resolvedCitySelect,
      cityOther: resolvedCityOtherVal,
      pincode: resolvedPinSelect,
      pincodeOther: resolvedPinOtherVal,
      area: resolvedAreaSelect,
      areaOther: resolvedAreaOtherVal,
    };
  };

  const scrollToFirstError = (nextErrors: Record<string, string>) => {
    const fieldOrder: Array<{ key: string; id: string }> = [
      { key: 'fullName', id: 'internship-fullName' },
      { key: 'email', id: 'internship-email' },
      { key: 'phone', id: 'internship-phone' },
      { key: 'address', id: 'internship-address' },
      { key: 'state', id: 'internship-state' },
      { key: 'city', id: 'internship-city' },
      { key: 'cityOther', id: 'internship-cityOther' },
      { key: 'pincode', id: 'internship-pincode' },
      { key: 'pincodeOther', id: 'internship-pincodeOther' },
      { key: 'area', id: 'internship-area' },
      { key: 'areaOther', id: 'internship-areaOther' },
      { key: 'course', id: 'internship-course' },
      { key: 'courseOther', id: 'internship-courseOther' },
      { key: 'durationMonths', id: 'internship-duration' },
      { key: 'startDate', id: 'internship-startDate' },
      { key: 'endDate', id: 'internship-endDate' },
      ...(isStudent
        ? [
            { key: 'college', id: 'internship-college' },
            { key: 'degree', id: 'internship-degree' },
            { key: 'degreeOther', id: 'internship-degreeOther' },
            { key: 'department', id: 'internship-department' },
            { key: 'departmentOther', id: 'internship-departmentOther' },
            { key: 'semester', id: 'internship-semester' },
          ]
        : [
            { key: 'qualification', id: 'internship-qualification' },
            { key: 'qualificationOther', id: 'internship-qualificationOther' },
            { key: 'currentlyWorking', id: 'internship-currentlyWorking' },
            { key: 'company', id: 'internship-company' },
            { key: 'designation', id: 'internship-designation' },
          ]),
      { key: 'confirmed', id: 'internship-confirmed' },
    ];

    const first = fieldOrder.find((item) => Boolean(nextErrors[item.key]));
    if (!first) return;

    const el = document.getElementById(first.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (typeof (el as HTMLElement).focus === 'function') {
        (el as HTMLElement).focus({ preventScroll: true });
      }
    }
  };

  const validate = (snapshot = {
    fullName,
    email,
    phone,
    address,
    state: stateName,
    city,
    cityOther,
    pincode,
    pincodeOther,
    area,
    areaOther,
  }): Record<string, string> => {
    const nextErrors: Record<string, string> = {};

    if (!snapshot.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    }
    if (!snapshot.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(snapshot.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!snapshot.phone) {
      nextErrors.phone = 'Phone number is required.';
    } else if (!/^[6-9]\d{9}$/.test(snapshot.phone)) {
      nextErrors.phone = 'Enter a valid 10-digit Indian mobile number.';
    }

    if (!snapshot.address.trim()) {
      nextErrors.address = 'Address is required.';
    }
    if (!snapshot.state) {
      nextErrors.state = 'Please select a state.';
    }

    if (locationsLoadFailed) {
      if (!snapshot.cityOther.trim()) {
        nextErrors.city = 'Please enter your city or district.';
      }
    } else {
      if (!snapshot.city) {
        nextErrors.city = 'Please select a city or district.';
      } else if (snapshot.city === '__OTHER__' && !snapshot.cityOther.trim()) {
        nextErrors.cityOther = 'Please enter your city.';
      }
    }

    const manualPin = locationsLoadFailed || snapshot.city === '__OTHER__';
    if (manualPin) {
      if (!snapshot.pincodeOther) {
        nextErrors.pincode = 'PIN code is required.';
      } else if (!/^\d{6}$/.test(snapshot.pincodeOther)) {
        nextErrors.pincode = 'Enter a valid 6-digit PIN code.';
      }
    } else {
      if (!snapshot.pincode) {
        nextErrors.pincode = 'Please select a PIN code.';
      } else if (snapshot.pincode === '__OTHER__') {
        if (!snapshot.pincodeOther) {
          nextErrors.pincodeOther = 'Please enter your 6-digit PIN code.';
        } else if (!/^\d{6}$/.test(snapshot.pincodeOther)) {
          nextErrors.pincodeOther = 'Enter a valid 6-digit PIN code.';
        }
      }
    }

    const manualArea = manualPin || snapshot.pincode === '__OTHER__';
    if (manualArea) {
      if (!snapshot.areaOther.trim()) {
        nextErrors.area = 'Area / Locality is required.';
      }
    } else {
      if (!snapshot.area) {
        nextErrors.area = 'Please select an area or locality.';
      } else if (snapshot.area === '__OTHER__' && !snapshot.areaOther.trim()) {
        nextErrors.areaOther = 'Please enter your area or locality.';
      }
    }

    if (!course) {
      nextErrors.course = 'Please select a course or domain.';
    } else if (course === 'Other' && !courseOther.trim()) {
      nextErrors.courseOther = 'Please specify your course or domain.';
    }

    if (!durationMonths || !DURATIONS.includes(Number(durationMonths) as (typeof DURATIONS)[number])) {
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
      if (!degree) {
        nextErrors.degree = 'Please select a degree.';
      } else if (degree === 'Other' && !degreeOther.trim()) {
        nextErrors.degreeOther = 'Please specify your degree.';
      }
      if (!department) {
        nextErrors.department = 'Please select a department.';
      } else if (department === 'Other' && !departmentOther.trim()) {
        nextErrors.departmentOther = 'Please specify your department.';
      }
      if (!semester) {
        nextErrors.semester = 'Please select your semester.';
      }
    } else {
      if (!qualification) {
        nextErrors.qualification = 'Please select your highest qualification.';
      } else if (qualification === 'Other' && !qualificationOther.trim()) {
        nextErrors.qualificationOther = 'Please specify your qualification.';
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

    return nextErrors;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (website.trim() !== '') {
      return;
    }

    const snapshot = syncAndReadAutofillValues();
    const nextErrors = validate(snapshot);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      scrollToFirstError(nextErrors);
      return;
    }

    setIsReviewing(true);
    setActiveStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resolvedCity =
    locationsLoadFailed || city === '__OTHER__' ? toTitleCaseWords(cityOther) : city;
  const resolvedPincode = isManualPinMode || pincode === '__OTHER__' ? pincodeOther : pincode;
  const resolvedArea =
    isManualAreaMode || area === '__OTHER__' ? areaOther.trim() : area.trim();
  const resolvedCourse = course === 'Other' ? courseOther.trim() : course;
  const resolvedDegree = degree === 'Other' ? degreeOther.trim() : degree;
  const resolvedDepartment = department === 'Other' ? departmentOther.trim() : department;
  const resolvedQualification =
    qualification === 'Other' ? qualificationOther.trim() : qualification;

  const handleFinalSubmit = async () => {
    setSubmitError(null);

    if (website.trim() !== '') {
      return;
    }

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setIsReviewing(false);
      setTimeout(() => scrollToFirstError(nextErrors), 50);
      return;
    }

    setIsSubmitting(true);

    try {
      if (!isFirebaseConfigured || !db) {
        throw new Error('Firebase is not configured.');
      }

      const generatedId = generateApplicationId(type);
      const formattedPhone = `+91${phone.replace(/\D/g, '').slice(-10)}`;

      const commonPayload = {
        type,
        applicationId: generatedId,
        fullName: fullName.trim().slice(0, 100),
        email: email.trim(),
        phone: formattedPhone,
        address: address.trim(),
        area: resolvedArea || '',
        city: resolvedCity || '',
        state: stateName || '',
        pincode: String(resolvedPincode || '').replace(/\D/g, '').slice(0, 6),
        course: resolvedCourse.slice(0, 100),
        durationMonths: Number(durationMonths),
        startDate: startDate || '',
        endDate: endDate || '',
        status: 'pending' as const,
        createdAt: serverTimestamp(),
      };

      const payload = isStudent
        ? {
            ...commonPayload,
            college: college.trim(),
            degree: resolvedDegree || '',
            department: resolvedDepartment || '',
            semester: String(semester || ''),
          }
        : {
            ...commonPayload,
            qualification: resolvedQualification || '',
            currentlyWorking: Boolean(currentlyWorking === 'Yes'),
            company: currentlyWorking === 'Yes' ? company.trim() : '',
            designation: currentlyWorking === 'Yes' ? designation.trim() : '',
          };

      await addDoc(collection(db, 'internshipApplications'), payload);

      const orDash = (v: string) => (v.trim() ? v.trim() : '-');
      const monthsNum = Number(durationMonths);
      const tenDigits = phone.replace(/\D/g, '').slice(-10);
      const emailFormattedPhone =
        tenDigits.length === 10
          ? `+91 ${tenDigits.slice(0, 5)} ${tenDigits.slice(5)}`
          : formattedPhone;

      sendInternshipEmail({
        full_name: orDash(fullName),
        email: orDash(email),
        phone: emailFormattedPhone,
        type_label: isStudent ? 'Student Internship' : 'Professional Internship',
        application_id: generatedId,
        course: orDash(resolvedCourse),
        duration: `${monthsNum} ${monthsNum === 1 ? 'month' : 'months'}`,
        start_date: orDash(formatDisplayDate(startDate)),
        end_date: orDash(formatDisplayDate(endDate)),
        address: orDash(address),
        area: orDash(resolvedArea),
        city: orDash(resolvedCity),
        state: orDash(stateName),
        pincode: orDash(String(resolvedPincode || '').replace(/\D/g, '').slice(0, 6)),
        submitted_at: formatIndiaSubmittedAt(),
        ...(isStudent
          ? {
              info1_label: 'College',
              info1_value: orDash(college),
              info2_label: 'Degree',
              info2_value: orDash(resolvedDegree),
              info3_label: 'Department',
              info3_value: orDash(resolvedDepartment),
              info4_label: 'Semester',
              info4_value: orDash(String(semester || '')),
            }
          : {
              info1_label: 'Qualification',
              info1_value: orDash(resolvedQualification),
              info2_label: 'Currently working',
              info2_value: orDash(currentlyWorking),
              info3_label: 'Company',
              info3_value: currentlyWorking === 'Yes' ? orDash(company) : '-',
              info4_label: 'Designation',
              info4_value: currentlyWorking === 'Yes' ? orDash(designation) : '-',
            }),
      });

      setSubmittedApplicationId(generatedId);
      setIsReviewing(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      const fbError = err as { code?: string; message?: string };
      console.error(
        'Firebase internship submit error:',
        fbError?.code ?? 'unknown',
        fbError?.message ?? err
      );
      setSubmitError('Something went wrong. Please try again or contact us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const jumpToFormSection = (section: 'personal' | 'internship' | 'specific') => {
    setSubmitError(null);
    setIsReviewing(false);
    setTimeout(() => {
      const target =
        section === 'personal'
          ? personalSectionRef.current
          : section === 'internship'
          ? internshipSectionRef.current
          : specificSectionRef.current;
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const handleCopyApplicationId = async () => {
    if (!submittedApplicationId) return;
    try {
      await navigator.clipboard.writeText(submittedApplicationId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      setCopiedId(false);
    }
  };

  // Validity checks for green tick indicator
  const isPersonalValid = useMemo(() => {
    const cityOk = locationsLoadFailed
      ? Boolean(cityOther.trim())
      : city === '__OTHER__'
      ? Boolean(cityOther.trim())
      : Boolean(city);
    const pinOk =
      isManualPinMode || pincode === '__OTHER__'
        ? /^\d{6}$/.test(pincodeOther)
        : /^\d{6}$/.test(pincode);
    const areaOk =
      isManualAreaMode || area === '__OTHER__' ? Boolean(areaOther.trim()) : Boolean(area);
    return (
      Boolean(fullName.trim()) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
      /^[6-9]\d{9}$/.test(phone) &&
      Boolean(address.trim()) &&
      Boolean(stateName) &&
      cityOk &&
      pinOk &&
      areaOk
    );
  }, [
    fullName,
    email,
    phone,
    address,
    stateName,
    locationsLoadFailed,
    isManualPinMode,
    isManualAreaMode,
    city,
    cityOther,
    pincode,
    pincodeOther,
    area,
    areaOther,
  ]);

  const isInternshipValid = useMemo(() => {
    const courseOk = course === 'Other' ? Boolean(courseOther.trim()) : Boolean(course);
    return (
      courseOk &&
      Boolean(durationMonths) &&
      Boolean(startDate) &&
      Boolean(endDate) &&
      endDate > startDate
    );
  }, [course, courseOther, durationMonths, startDate, endDate]);

  const isSpecificValid = useMemo(() => {
    if (isStudent) {
      const degreeOk = degree === 'Other' ? Boolean(degreeOther.trim()) : Boolean(degree);
      const deptOk =
        department === 'Other' ? Boolean(departmentOther.trim()) : Boolean(department);
      return Boolean(college.trim()) && degreeOk && deptOk && Boolean(semester);
    }
    const qualOk =
      qualification === 'Other' ? Boolean(qualificationOther.trim()) : Boolean(qualification);
    const workOk =
      currentlyWorking === 'No' ||
      (currentlyWorking === 'Yes' && Boolean(company.trim()) && Boolean(designation.trim()));
    return qualOk && workOk;
  }, [
    isStudent,
    college,
    degree,
    degreeOther,
    department,
    departmentOther,
    semester,
    qualification,
    qualificationOther,
    currentlyWorking,
    company,
    designation,
  ]);

  const stepCompleteMap: Record<1 | 2 | 3 | 4, boolean> = {
    1: isPersonalValid,
    2: isInternshipValid,
    3: isSpecificValid,
    4: Boolean(submittedApplicationId),
  };

  const steps: Array<{ num: 1 | 2 | 3 | 4; label: string }> = [
    { num: 1, label: 'Personal' },
    { num: 2, label: 'Internship' },
    { num: 3, label: isStudent ? 'College' : 'Work' },
    { num: 4, label: 'Review' },
  ];

  const inputBaseClass = (hasError: boolean, showTick = false) =>
    `w-full h-12 min-h-[48px] ${
      showTick ? 'pl-4 pr-10' : 'px-4'
    } py-2.5 text-base rounded-xl border bg-[#F4F7FC] text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:outline-hidden focus:ring-4 ${
      hasError
        ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/15 bg-rose-50/30'
        : 'border-slate-200 focus:border-[#1C35EA] focus:ring-[#1C35EA]/15'
    }`;

  const textareaBaseClass = (hasError: boolean) =>
    `w-full min-h-[72px] pl-4 pr-10 py-2.5 text-base rounded-xl border bg-[#F4F7FC] text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:outline-hidden focus:ring-4 resize-y ${
      hasError
        ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/15 bg-rose-50/30'
        : 'border-slate-200 focus:border-[#1C35EA] focus:ring-[#1C35EA]/15'
    }`;

  const selectBaseClass = (hasError: boolean, isEmpty: boolean) =>
    `w-full h-12 min-h-[48px] pl-4 pr-11 py-2.5 text-base rounded-xl border bg-[#F4F7FC] appearance-none cursor-pointer transition-all focus:bg-white focus:outline-hidden focus:ring-4 ${
      isEmpty ? 'text-slate-400' : 'text-slate-900'
    } ${
      hasError
        ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/15 bg-rose-50/30'
        : 'border-slate-200 focus:border-[#1C35EA] focus:ring-[#1C35EA]/15'
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
        <div className="absolute top-0 right-1/4 w-[420px] h-[280px] bg-gradient-to-tr from-[#00B0F0]/15 via-[#1C35EA]/12 to-[#4D19EA]/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 min-h-[32px] px-3.5 py-1 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(28,53,234,0.08)] text-xs font-mono font-bold text-[#1C35EA]">
              {isStudent ? (
                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <Briefcase className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>{isStudent ? 'STUDENT INTERNSHIP' : 'PROFESSIONAL INTERNSHIP'}</span>
            </div>

            <Link
              to="/training"
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 text-xs sm:text-sm font-semibold text-[#1C35EA] hover:text-[#4D19EA] transition-colors"
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
      <section className="py-8 sm:py-12 lg:py-16 bg-[#F4F7FC]">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
          {/* Step Progress Bar */}
          {!submittedApplicationId && (
            <nav aria-label="Application progress" className="w-full">
              <ol className="grid grid-cols-4 gap-1.5 sm:gap-3">
                {steps.map((step) => {
                  const isCurrent = activeStep === step.num;
                  const isFinished =
                    stepCompleteMap[step.num] && activeStep > step.num;
                  const canClick =
                    !isReviewing && step.num <= 3;

                  return (
                    <li key={step.num} className="min-w-0">
                      <button
                        type="button"
                        disabled={!canClick}
                        onClick={() => {
                          if (!canClick) return;
                          if (step.num === 1) jumpToFormSection('personal');
                          else if (step.num === 2) jumpToFormSection('internship');
                          else if (step.num === 3) jumpToFormSection('specific');
                        }}
                        className={`w-full min-h-[44px] px-2 sm:px-3 py-2 rounded-xl border text-left transition-all flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2.5 ${
                          isCurrent
                            ? 'text-white border-transparent shadow-md'
                            : isFinished
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-white border-slate-200 text-slate-600'
                        } ${canClick ? 'cursor-pointer hover:border-[#1C35EA]/40' : 'cursor-default'}`}
                        style={
                          isCurrent
                            ? {
                                background:
                                  'linear-gradient(135deg, #00B0F0 0%, #1C35EA 40%, #4D19EA 100%)',
                              }
                            : undefined
                        }
                        aria-current={isCurrent ? 'step' : undefined}
                      >
                        <span
                          className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                            isCurrent
                              ? 'bg-white/20 text-white'
                              : isFinished
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {isFinished ? <Check className="w-3.5 h-3.5" /> : step.num}
                        </span>
                        <span className="text-[11px] sm:text-sm font-semibold truncate">
                          {step.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}

          {/* Form Card */}
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-[0_12px_36px_-10px_rgba(28,53,234,0.12)]">
            {/* Thin brand-gradient line along top edge */}
            <div
              className="h-1.5 w-full rounded-t-2xl"
              style={{
                background: 'linear-gradient(90deg, #00B0F0 0%, #1C35EA 50%, #4D19EA 100%)',
              }}
            />

            <div className="p-4 sm:p-8 lg:p-10">
              {submittedApplicationId ? (
                /* Success Screen */
                <div className="py-8 sm:py-12 text-center space-y-6">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border-2 border-emerald-200 shadow-sm motion-safe:animate-[pulse_2.2s_ease-in-out_infinite]">
                    <CheckCircle2 className="w-11 h-11" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-bold text-[#1E3A8A]">
                      Application submitted!
                    </h2>
                  </div>

                  <div className="max-w-md mx-auto rounded-2xl bg-gradient-to-r from-[#00B0F0]/10 via-[#1C35EA]/10 to-[#4D19EA]/10 border border-[#1C35EA]/25 px-5 py-6 space-y-3">
                    <div className="text-xs font-mono uppercase tracking-widest text-[#1C35EA] font-bold">
                      Application ID
                    </div>
                    <div className="text-3xl sm:text-4xl font-mono font-extrabold tracking-wider text-[#1E3A8A] break-all">
                      {submittedApplicationId}
                    </div>
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleCopyApplicationId}
                        className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg bg-white border border-[#1C35EA]/30 text-[#1C35EA] hover:bg-[#EEF4FF] text-sm font-semibold transition-colors cursor-pointer"
                      >
                        {copiedId ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 shrink-0" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                    Please save this ID. A confirmation email has been sent to {email.trim()}. If you don&apos;t see it, please check your Spam folder.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <Link
                      to="/training"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-xl text-white font-semibold text-sm shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-4px_rgba(28,53,234,0.38)] motion-reduce:hover:translate-y-0 active:scale-[0.98]"
                      style={{
                        background:
                          'linear-gradient(135deg, #00B0F0 0%, #1C35EA 35%, #4D19EA 100%)',
                      }}
                    >
                      <ArrowLeft className="w-4 h-4 shrink-0" />
                      <span>Back to Training</span>
                    </Link>
                  </div>
                </div>
              ) : isReviewing ? (
                /* Review Before Submit Screen */
                <div className="space-y-8">
                  <div className="space-y-1.5 border-b border-slate-200 pb-4">
                    <div className="text-xs font-mono uppercase tracking-widest text-[#1C35EA] font-bold">
                      REVIEW DETAILS
                    </div>
                    <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-2xl font-bold text-[#1E3A8A]">
                      Review your application
                    </h2>
                  </div>

                  {/* Certificate Name Card */}
                  <div className="rounded-2xl bg-gradient-to-r from-[#00B0F0]/10 via-[#1C35EA]/10 to-[#4D19EA]/10 border border-[#1C35EA]/20 p-5 sm:p-6 space-y-1.5">
                    <div className="text-xs font-mono uppercase tracking-wider text-[#1C35EA] font-bold">
                      Full name
                    </div>
                    <div className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-bold text-[#1E3A8A] break-words">
                      {fullName.trim()}
                    </div>
                    <p className="text-sm font-medium text-slate-700 pt-1">
                      Your name will appear on the certificate exactly like this.
                    </p>
                  </div>

                  {/* Review Section 1: Personal details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h3 className="!font-['Outfit','Space_Grotesk',sans-serif] text-base sm:text-lg font-bold text-[#1E3A8A] flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-full bg-[#1C35EA]/10 text-[#1C35EA] flex items-center justify-center shrink-0">
                          <User className="w-4 h-4" />
                        </span>
                        <span>Personal details</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => jumpToFormSection('personal')}
                        className="min-h-[44px] px-2.5 inline-flex items-center gap-1 text-sm font-semibold text-[#1C35EA] hover:text-[#4D19EA] transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-[#F4F7FC] rounded-xl p-3.5 border border-slate-200/80">
                        <dt className="text-xs font-semibold text-slate-500">Email</dt>
                        <dd className="text-slate-900 font-medium mt-0.5 break-all">
                          {email.trim()}
                        </dd>
                      </div>
                      <div className="bg-[#F4F7FC] rounded-xl p-3.5 border border-slate-200/80">
                        <dt className="text-xs font-semibold text-slate-500">Phone</dt>
                        <dd className="text-slate-900 font-medium mt-0.5">+91 {phone}</dd>
                      </div>
                      <div className="bg-[#F4F7FC] rounded-xl p-3.5 border border-slate-200/80 md:col-span-2">
                        <dt className="text-xs font-semibold text-slate-500">Address</dt>
                        <dd className="text-slate-900 font-medium mt-0.5 whitespace-pre-line break-words">
                          {address.trim()}
                        </dd>
                      </div>
                      <div className="bg-[#F4F7FC] rounded-xl p-3.5 border border-slate-200/80">
                        <dt className="text-xs font-semibold text-slate-500">State</dt>
                        <dd className="text-slate-900 font-medium mt-0.5">{stateName}</dd>
                      </div>
                      <div className="bg-[#F4F7FC] rounded-xl p-3.5 border border-slate-200/80">
                        <dt className="text-xs font-semibold text-slate-500">City / District</dt>
                        <dd className="text-slate-900 font-medium mt-0.5">{resolvedCity}</dd>
                      </div>
                      <div className="bg-[#F4F7FC] rounded-xl p-3.5 border border-slate-200/80">
                        <dt className="text-xs font-semibold text-slate-500">PIN code</dt>
                        <dd className="text-slate-900 font-medium mt-0.5">{resolvedPincode}</dd>
                      </div>
                      <div className="bg-[#F4F7FC] rounded-xl p-3.5 border border-slate-200/80">
                        <dt className="text-xs font-semibold text-slate-500">Area / Locality</dt>
                        <dd className="text-slate-900 font-medium mt-0.5">{resolvedArea}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Review Section 2: Internship details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h3 className="!font-['Outfit','Space_Grotesk',sans-serif] text-base sm:text-lg font-bold text-[#1E3A8A] flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-full bg-[#1C35EA]/10 text-[#1C35EA] flex items-center justify-center shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </span>
                        <span>Internship details</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => jumpToFormSection('internship')}
                        className="min-h-[44px] px-2.5 inline-flex items-center gap-1 text-sm font-semibold text-[#1C35EA] hover:text-[#4D19EA] transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-[#F4F7FC] rounded-xl p-3.5 border border-slate-200/80">
                        <dt className="text-xs font-semibold text-slate-500">Course</dt>
                        <dd className="text-slate-900 font-medium mt-0.5">{resolvedCourse}</dd>
                      </div>
                      <div className="bg-[#F4F7FC] rounded-xl p-3.5 border border-slate-200/80">
                        <dt className="text-xs font-semibold text-slate-500">Duration</dt>
                        <dd className="text-slate-900 font-medium mt-0.5">
                          {durationMonths} {Number(durationMonths) === 1 ? 'Month' : 'Months'}
                        </dd>
                      </div>
                      <div className="bg-[#F4F7FC] rounded-xl p-3.5 border border-slate-200/80">
                        <dt className="text-xs font-semibold text-slate-500">Start date</dt>
                        <dd className="text-slate-900 font-medium mt-0.5">
                          {formatDisplayDate(startDate)}
                        </dd>
                      </div>
                      <div className="bg-[#F4F7FC] rounded-xl p-3.5 border border-slate-200/80">
                        <dt className="text-xs font-semibold text-slate-500">End date</dt>
                        <dd className="text-slate-900 font-medium mt-0.5">
                          {formatDisplayDate(endDate)}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Review Section 3: College details OR Work details */}
                  {isStudent ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h3 className="!font-['Outfit','Space_Grotesk',sans-serif] text-base sm:text-lg font-bold text-[#1E3A8A] flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-full bg-[#1C35EA]/10 text-[#1C35EA] flex items-center justify-center shrink-0">
                            <GraduationCap className="w-4 h-4" />
                          </span>
                          <span>College details</span>
                        </h3>
                        <button
                          type="button"
                          onClick={() => jumpToFormSection('specific')}
                          className="min-h-[44px] px-2.5 inline-flex items-center gap-1 text-sm font-semibold text-[#1C35EA] hover:text-[#4D19EA] transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-[#F4F7FC] rounded-xl p-3.5 border border-slate-200/80">
                          <dt className="text-xs font-semibold text-slate-500">College name</dt>
                          <dd className="text-slate-900 font-medium mt-0.5">{college.trim()}</dd>
                        </div>
                        <div className="bg-[#F4F7FC] rounded-xl p-3.5 border border-slate-200/80">
                          <dt className="text-xs font-semibold text-slate-500">Degree</dt>
                          <dd className="text-slate-900 font-medium mt-0.5">{resolvedDegree}</dd>
                        </div>
                        <div className="bg-[#F4F7FC] rounded-xl p-3.5 border border-slate-200/80">
                          <dt className="text-xs font-semibold text-slate-500">Department</dt>
                          <dd className="text-slate-900 font-medium mt-0.5">
                            {resolvedDepartment}
                          </dd>
                        </div>
                        <div className="bg-[#F4F7FC] rounded-xl p-3.5 border border-slate-200/80">
                          <dt className="text-xs font-semibold text-slate-500">Semester</dt>
                          <dd className="text-slate-900 font-medium mt-0.5">
                            {semester === 'Completed' ? 'Completed' : `Semester ${semester}`}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h3 className="!font-['Outfit','Space_Grotesk',sans-serif] text-base sm:text-lg font-bold text-[#1E3A8A] flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-full bg-[#1C35EA]/10 text-[#1C35EA] flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4" />
                          </span>
                          <span>Work details</span>
                        </h3>
                        <button
                          type="button"
                          onClick={() => jumpToFormSection('specific')}
                          className="min-h-[44px] px-2.5 inline-flex items-center gap-1 text-sm font-semibold text-[#1C35EA] hover:text-[#4D19EA] transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-[#F4F7FC] rounded-xl p-3.5 border border-slate-200/80">
                          <dt className="text-xs font-semibold text-slate-500">
                            Highest qualification
                          </dt>
                          <dd className="text-slate-900 font-medium mt-0.5">
                            {resolvedQualification}
                          </dd>
                        </div>
                        <div className="bg-[#F4F7FC] rounded-xl p-3.5 border border-slate-200/80">
                          <dt className="text-xs font-semibold text-slate-500">
                            Currently working?
                          </dt>
                          <dd className="text-slate-900 font-medium mt-0.5">{currentlyWorking}</dd>
                        </div>
                        {currentlyWorking === 'Yes' && (
                          <>
                            <div className="bg-[#F4F7FC] rounded-xl p-3.5 border border-slate-200/80">
                              <dt className="text-xs font-semibold text-slate-500">
                                Current company
                              </dt>
                              <dd className="text-slate-900 font-medium mt-0.5">
                                {company.trim()}
                              </dd>
                            </div>
                            <div className="bg-[#F4F7FC] rounded-xl p-3.5 border border-slate-200/80">
                              <dt className="text-xs font-semibold text-slate-500">Designation</dt>
                              <dd className="text-slate-900 font-medium mt-0.5">
                                {designation.trim()}
                              </dd>
                            </div>
                          </>
                        )}
                      </dl>
                    </div>
                  )}

                  {submitError && (
                    <div
                      role="alert"
                      className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => {
                        setSubmitError(null);
                        setIsReviewing(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="min-h-[48px] px-6 py-3 rounded-xl border-2 border-[#1C35EA] bg-white hover:bg-[#EEF4FF] text-[#1C35EA] font-semibold text-sm transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="w-4 h-4 shrink-0" />
                      <span>Edit details</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleFinalSubmit}
                      className="min-h-[48px] px-6 py-3 sm:min-w-[220px] rounded-xl text-white font-semibold text-sm shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-4px_rgba(28,53,234,0.38)] motion-reduce:hover:translate-y-0 active:scale-[0.98] inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                      style={{
                        background:
                          'linear-gradient(135deg, #00B0F0 0%, #1C35EA 35%, #4D19EA 100%)',
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit application</span>
                          <ArrowRight className="w-4 h-4 shrink-0" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Application Form */
                <form onSubmit={handleContinue} className="space-y-8" noValidate>
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

                  {/* Section 1: Personal details */}
                  <div ref={personalSectionRef} className="space-y-5 scroll-mt-24">
                    <div className="border-b border-slate-200 pb-3 flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-[#1C35EA]/10 text-[#1C35EA] flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </span>
                      <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-lg sm:text-xl font-bold text-[#1E3A8A]">
                        Personal details
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                      {/* Full Name */}
                      <div className="md:col-span-2">
                        <label
                          htmlFor="internship-fullName"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          Full name (as it should appear on the certificate){' '}
                          <span className="text-rose-600" aria-hidden="true">*</span>
                        </label>
                        <div className="relative">
                          <input
                            ref={fullNameRef}
                            id="internship-fullName"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={fullName}
                            onFocus={() => setActiveStep(1)}
                            onChange={(e) => {
                              setFullName(e.target.value);
                              clearFieldError('fullName');
                            }}
                            onBlur={(e) => {
                              const formatted = toTitleCaseWords(e.target.value);
                              if (formatted !== fullName) setFullName(formatted);
                            }}
                            placeholder="Enter your full name"
                            className={inputBaseClass(
                              Boolean(errors.fullName),
                              Boolean(fullName.trim()) && !errors.fullName
                            )}
                            aria-invalid={Boolean(errors.fullName)}
                            required
                          />
                          {Boolean(fullName.trim()) && !errors.fullName && (
                            <Check
                              className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        {errors.fullName && (
                          <p role="alert" className="text-xs text-rose-600 mt-1.5">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="internship-email"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          Email <span className="text-rose-600" aria-hidden="true">*</span>
                        </label>
                        <div className="relative">
                          <input
                            ref={emailRef}
                            id="internship-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onFocus={() => setActiveStep(1)}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              clearFieldError('email');
                            }}
                            placeholder="you@example.com"
                            className={inputBaseClass(
                              Boolean(errors.email),
                              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && !errors.email
                            )}
                            aria-invalid={Boolean(errors.email)}
                            required
                          />
                          {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && !errors.email && (
                            <Check
                              className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        {errors.email && (
                          <p role="alert" className="text-xs text-rose-600 mt-1.5">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="internship-phone"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          Phone <span className="text-rose-600" aria-hidden="true">*</span>
                        </label>
                        <div
                          className={`relative flex items-stretch h-12 min-h-[48px] rounded-xl border bg-[#F4F7FC] overflow-hidden transition-all focus-within:bg-white focus-within:ring-4 ${
                            errors.phone
                              ? 'border-rose-500 focus-within:border-rose-500 focus-within:ring-rose-500/15 bg-rose-50/30'
                              : 'border-slate-200 focus-within:border-[#1C35EA] focus-within:ring-[#1C35EA]/15'
                          }`}
                        >
                          <span className="inline-flex items-center px-3.5 bg-[#E9EFFA] border-r border-slate-200 text-base font-semibold text-[#1E3A8A] select-none shrink-0">
                            +91
                          </span>
                          <input
                            ref={phoneRef}
                            id="internship-phone"
                            name="tel"
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel-national"
                            maxLength={20}
                            value={phone}
                            onFocus={() => setActiveStep(1)}
                            onChange={(e) => {
                              const cleaned = normalizeIndianPhone(e.target.value);
                              setPhone(cleaned);
                              clearFieldError('phone');
                            }}
                            placeholder="10-digit mobile number"
                            className="w-full h-full pl-3.5 pr-10 text-base bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                            aria-invalid={Boolean(errors.phone)}
                            required
                          />
                          {/^[6-9]\d{9}$/.test(phone) && !errors.phone && (
                            <Check
                              className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        {errors.phone && (
                          <p role="alert" className="text-xs text-rose-600 mt-1.5">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* Address */}
                      <div className="md:col-span-2">
                        <label
                          htmlFor="internship-address"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          Address <span className="text-rose-600" aria-hidden="true">*</span>
                        </label>
                        <div className="relative">
                          <textarea
                            ref={addressRef}
                            id="internship-address"
                            name="street-address"
                            autoComplete="street-address"
                            rows={2}
                            value={address}
                            onFocus={() => setActiveStep(1)}
                            onChange={(e) => {
                              setAddress(e.target.value);
                              clearFieldError('address');
                            }}
                            placeholder="House/Flat No., Street, Landmark"
                            className={textareaBaseClass(Boolean(errors.address))}
                            aria-invalid={Boolean(errors.address)}
                            required
                          />
                          {Boolean(address.trim()) && !errors.address && (
                            <Check
                              className="w-4 h-4 text-emerald-600 absolute right-3.5 top-3.5 pointer-events-none"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        {errors.address && (
                          <p role="alert" className="text-xs text-rose-600 mt-1.5">
                            {errors.address}
                          </p>
                        )}
                      </div>

                      {/* Fallback message if india-pincode fails to load */}
                      {locationsLoadFailed && (
                        <div className="md:col-span-2">
                          <p
                            role="status"
                            className="text-xs sm:text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5"
                          >
                            Couldn&apos;t load locations. Please type your city, PIN and area.
                          </p>
                        </div>
                      )}

                      {/* State */}
                      <div>
                        <label
                          htmlFor="internship-state"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          State <span className="text-rose-600" aria-hidden="true">*</span>
                        </label>
                        <div className="relative">
                          <select
                            ref={stateRef}
                            id="internship-state"
                            name="address-level1"
                            autoComplete="address-level1"
                            value={stateName}
                            onFocus={() => setActiveStep(1)}
                            onChange={(e) => handleStateChange(e.target.value)}
                            className={selectBaseClass(Boolean(errors.state), stateName === '')}
                            aria-invalid={Boolean(errors.state)}
                            required
                          >
                            <option value="" className="text-slate-400">
                              Select state
                            </option>
                            {STATES.map((st) => (
                              <option key={st} value={st} className="text-slate-900">
                                {st}
                              </option>
                            ))}
                          </select>
                          {Boolean(stateName) && !errors.state && (
                            <Check
                              className="w-4 h-4 text-emerald-600 absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none"
                              aria-hidden="true"
                            />
                          )}
                          <ChevronDown
                            className="w-5 h-5 text-[#1C35EA] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                            aria-hidden="true"
                          />
                        </div>
                        {errors.state && (
                          <p role="alert" className="text-xs text-rose-600 mt-1.5">
                            {errors.state}
                          </p>
                        )}
                      </div>

                      {/* City / District */}
                      <div className="relative">
                        {!isManualCityMode && (
                          <input
                            ref={cityAutofillRef}
                            type="text"
                            name="address-level2"
                            autoComplete="address-level2"
                            tabIndex={-1}
                            aria-hidden="true"
                            value={city === '__OTHER__' ? cityOther : city}
                            onChange={(e) => {
                              const targetState =
                                findMatchingStateName(stateRef.current?.value || stateName) ||
                                stateName;
                              applyRawCityForState(targetState, e.target.value);
                            }}
                            className="opacity-0 pointer-events-none absolute w-px h-px overflow-hidden"
                          />
                        )}

                        <label
                          htmlFor="internship-city"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          City / District <span className="text-rose-600" aria-hidden="true">*</span>
                        </label>

                        {isManualCityMode ? (
                          <div className="relative">
                            <input
                              ref={cityOtherRef}
                              id="internship-city"
                              name="address-level2"
                              type="text"
                              autoComplete="address-level2"
                              value={cityOther}
                              onFocus={() => setActiveStep(1)}
                              onChange={(e) => {
                                setCityOther(e.target.value);
                                clearFieldError('city');
                              }}
                              onBlur={(e) => {
                                const formatted = toTitleCaseWords(e.target.value);
                                if (formatted !== cityOther) setCityOther(formatted);
                              }}
                              placeholder="Enter your city or district"
                              className={inputBaseClass(
                                Boolean(errors.city),
                                Boolean(cityOther.trim()) && !errors.city
                              )}
                              aria-invalid={Boolean(errors.city)}
                              required
                            />
                            {Boolean(cityOther.trim()) && !errors.city && (
                              <Check
                                className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                        ) : (
                          <SearchableSelect
                            id="internship-city"
                            label="City / District"
                            required
                            value={city}
                            options={cityDropdownOptions}
                            otherOptionLabel="Other – type my city"
                            placeholder={
                              isLocationsLoading
                                ? 'Loading locations…'
                                : !stateName
                                ? 'Select state first'
                                : 'Select city / district'
                            }
                            searchPlaceholder="Search city / district..."
                            disabled={!stateName || isLocationsLoading}
                            hasError={Boolean(errors.city)}
                            isValid={Boolean(city) && city !== '__OTHER__'}
                            onFocusTrigger={() => setActiveStep(1)}
                            onSelect={handleSelectCityOption}
                          />
                        )}

                        {errors.city && (
                          <p role="alert" className="text-xs text-rose-600 mt-1.5">
                            {errors.city}
                          </p>
                        )}

                        {!isManualCityMode && city === '__OTHER__' && (
                          <div className="mt-3">
                            <label
                              htmlFor="internship-cityOther"
                              className="block text-sm font-semibold text-slate-800 mb-1.5"
                            >
                              Enter your city <span className="text-rose-600" aria-hidden="true">*</span>
                            </label>
                            <div className="relative">
                              <input
                                ref={cityOtherRef}
                                id="internship-cityOther"
                                name="city-other"
                                type="text"
                                value={cityOther}
                                onChange={(e) => {
                                  setCityOther(e.target.value);
                                  clearFieldError('cityOther');
                                }}
                                onBlur={(e) => {
                                  const formatted = toTitleCaseWords(e.target.value);
                                  if (formatted !== cityOther) setCityOther(formatted);
                                }}
                                placeholder="Enter your city"
                                className={inputBaseClass(
                                  Boolean(errors.cityOther),
                                  Boolean(cityOther.trim()) && !errors.cityOther
                                )}
                                aria-invalid={Boolean(errors.cityOther)}
                                required
                              />
                              {Boolean(cityOther.trim()) && !errors.cityOther && (
                                <Check
                                  className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                            {errors.cityOther && (
                              <p role="alert" className="text-xs text-rose-600 mt-1.5">
                                {errors.cityOther}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* PIN code */}
                      <div className="relative">
                        {!isManualPinMode && (
                          <input
                            ref={pincodeAutofillRef}
                            type="text"
                            name="postal-code"
                            autoComplete="postal-code"
                            tabIndex={-1}
                            aria-hidden="true"
                            value={pincode === '__OTHER__' ? pincodeOther : pincode}
                            onChange={(e) => applyAutofillPin(e.target.value)}
                            className="opacity-0 pointer-events-none absolute w-px h-px overflow-hidden"
                          />
                        )}

                        <label
                          htmlFor="internship-pincode"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          PIN code <span className="text-rose-600" aria-hidden="true">*</span>
                        </label>

                        {isManualPinMode ? (
                          <div className="relative">
                            <input
                              ref={pincodeOtherRef}
                              id="internship-pincode"
                              name="postal-code"
                              type="text"
                              inputMode="numeric"
                              autoComplete="postal-code"
                              maxLength={6}
                              value={pincodeOther}
                              onFocus={() => setActiveStep(1)}
                              onChange={(e) => {
                                const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setPincodeOther(digitsOnly);
                                clearFieldError('pincode');
                              }}
                              placeholder="6-digit PIN code"
                              className={inputBaseClass(
                                Boolean(errors.pincode),
                                /^\d{6}$/.test(pincodeOther) && !errors.pincode
                              )}
                              aria-invalid={Boolean(errors.pincode)}
                              required
                            />
                            {/^\d{6}$/.test(pincodeOther) && !errors.pincode && (
                              <Check
                                className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                        ) : (
                          <SearchableSelect
                            id="internship-pincode"
                            label="PIN code"
                            required
                            value={pincode}
                            options={pinDropdownOptions}
                            otherOptionLabel="My PIN is not listed – type it"
                            placeholder={
                              isLocationsLoading
                                ? 'Loading locations…'
                                : !city
                                ? 'Select city first'
                                : 'Select PIN code'
                            }
                            searchPlaceholder="Search PIN code or area..."
                            disabled={!city || isLocationsLoading}
                            hasError={Boolean(errors.pincode)}
                            isValid={/^\d{6}$/.test(pincode)}
                            onFocusTrigger={() => setActiveStep(1)}
                            onSelect={handleSelectPinOption}
                          />
                        )}

                        {errors.pincode && (
                          <p role="alert" className="text-xs text-rose-600 mt-1.5">
                            {errors.pincode}
                          </p>
                        )}

                        {!isManualPinMode && pincode === '__OTHER__' && (
                          <div className="mt-3">
                            <label
                              htmlFor="internship-pincodeOther"
                              className="block text-sm font-semibold text-slate-800 mb-1.5"
                            >
                              Enter your PIN code{' '}
                              <span className="text-rose-600" aria-hidden="true">*</span>
                            </label>
                            <div className="relative">
                              <input
                                ref={pincodeOtherRef}
                                id="internship-pincodeOther"
                                name="pincode-other"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={pincodeOther}
                                onChange={(e) => {
                                  const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6);
                                  setPincodeOther(digitsOnly);
                                  clearFieldError('pincodeOther');
                                }}
                                placeholder="6-digit PIN code"
                                className={inputBaseClass(
                                  Boolean(errors.pincodeOther),
                                  /^\d{6}$/.test(pincodeOther) && !errors.pincodeOther
                                )}
                                aria-invalid={Boolean(errors.pincodeOther)}
                                required
                              />
                              {/^\d{6}$/.test(pincodeOther) && !errors.pincodeOther && (
                                <Check
                                  className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                            {errors.pincodeOther && (
                              <p role="alert" className="text-xs text-rose-600 mt-1.5">
                                {errors.pincodeOther}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Area / Locality */}
                      <div className="relative">
                        {!isManualAreaMode && (
                          <input
                            ref={areaAutofillRef}
                            type="text"
                            name="address-level3"
                            autoComplete="address-level3"
                            tabIndex={-1}
                            aria-hidden="true"
                            value={area === '__OTHER__' ? areaOther : area}
                            onChange={(e) => applyAutofillArea(e.target.value)}
                            className="opacity-0 pointer-events-none absolute w-px h-px overflow-hidden"
                          />
                        )}

                        <label
                          htmlFor="internship-area"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          Area / Locality <span className="text-rose-600" aria-hidden="true">*</span>
                        </label>

                        {isManualAreaMode ? (
                          <div className="relative">
                            <input
                              ref={areaOtherRef}
                              id="internship-area"
                              name="address-level3"
                              type="text"
                              autoComplete="address-level3"
                              value={areaOther}
                              onFocus={() => setActiveStep(1)}
                              onChange={(e) => {
                                setAreaOther(e.target.value);
                                clearFieldError('area');
                              }}
                              placeholder="Enter your area or locality"
                              className={inputBaseClass(
                                Boolean(errors.area),
                                Boolean(areaOther.trim()) && !errors.area
                              )}
                              aria-invalid={Boolean(errors.area)}
                              required
                            />
                            {Boolean(areaOther.trim()) && !errors.area && (
                              <Check
                                className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                        ) : (
                          <SearchableSelect
                            id="internship-area"
                            label="Area / Locality"
                            required
                            value={area}
                            options={areaDropdownOptions}
                            otherOptionLabel="Other – type my area"
                            placeholder={
                              isLocationsLoading
                                ? 'Loading locations…'
                                : !pincode
                                ? 'Select PIN code first'
                                : 'Select area / locality'
                            }
                            searchPlaceholder="Search area / locality..."
                            disabled={!pincode || isLocationsLoading}
                            hasError={Boolean(errors.area)}
                            isValid={Boolean(area) && area !== '__OTHER__'}
                            onFocusTrigger={() => setActiveStep(1)}
                            onSelect={handleSelectAreaOption}
                          />
                        )}

                        {errors.area && (
                          <p role="alert" className="text-xs text-rose-600 mt-1.5">
                            {errors.area}
                          </p>
                        )}

                        {!isManualAreaMode && area === '__OTHER__' && (
                          <div className="mt-3">
                            <label
                              htmlFor="internship-areaOther"
                              className="block text-sm font-semibold text-slate-800 mb-1.5"
                            >
                              Enter your area <span className="text-rose-600" aria-hidden="true">*</span>
                            </label>
                            <div className="relative">
                              <input
                                ref={areaOtherRef}
                                id="internship-areaOther"
                                name="area-other"
                                type="text"
                                value={areaOther}
                                onChange={(e) => {
                                  setAreaOther(e.target.value);
                                  clearFieldError('areaOther');
                                }}
                                placeholder="Enter your area or locality"
                                className={inputBaseClass(
                                  Boolean(errors.areaOther),
                                  Boolean(areaOther.trim()) && !errors.areaOther
                                )}
                                aria-invalid={Boolean(errors.areaOther)}
                                required
                              />
                              {Boolean(areaOther.trim()) && !errors.areaOther && (
                                <Check
                                  className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                            {errors.areaOther && (
                              <p role="alert" className="text-xs text-rose-600 mt-1.5">
                                {errors.areaOther}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Internship details */}
                  <div ref={internshipSectionRef} className="space-y-5 scroll-mt-24">
                    <div className="border-b border-slate-200 pb-3 flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-[#1C35EA]/10 text-[#1C35EA] flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </span>
                      <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-lg sm:text-xl font-bold text-[#1E3A8A]">
                        Internship details
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label
                          htmlFor="internship-course"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          Course <span className="text-rose-600" aria-hidden="true">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="internship-course"
                            name="course"
                            value={course}
                            onFocus={() => setActiveStep(2)}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCourse(val);
                              clearFieldError('course');
                              if (val !== 'Other') {
                                clearFieldError('courseOther');
                              }
                            }}
                            className={selectBaseClass(Boolean(errors.course), course === '')}
                            aria-invalid={Boolean(errors.course)}
                            required
                          >
                            <option value="" className="text-slate-400">
                              Select course
                            </option>
                            {COURSES.map((item) => (
                              <option key={item} value={item} className="text-slate-900">
                                {item}
                              </option>
                            ))}
                          </select>
                          {Boolean(course) &&
                            (course !== 'Other' || Boolean(courseOther.trim())) &&
                            !errors.course && (
                              <Check
                                className="w-4 h-4 text-emerald-600 absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none"
                                aria-hidden="true"
                              />
                            )}
                          <ChevronDown
                            className="w-5 h-5 text-[#1C35EA] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                            aria-hidden="true"
                          />
                        </div>
                        {errors.course && (
                          <p role="alert" className="text-xs text-rose-600 mt-1.5">
                            {errors.course}
                          </p>
                        )}

                        {course === 'Other' && (
                          <div className="mt-3">
                            <label
                              htmlFor="internship-courseOther"
                              className="block text-sm font-semibold text-slate-800 mb-1.5"
                            >
                              Please specify course{' '}
                              <span className="text-rose-600" aria-hidden="true">*</span>
                            </label>
                            <div className="relative">
                              <input
                                id="internship-courseOther"
                                name="course-other"
                                type="text"
                                value={courseOther}
                                onChange={(e) => {
                                  setCourseOther(e.target.value);
                                  clearFieldError('courseOther');
                                }}
                                placeholder="Please specify"
                                className={inputBaseClass(
                                  Boolean(errors.courseOther),
                                  Boolean(courseOther.trim()) && !errors.courseOther
                                )}
                                aria-invalid={Boolean(errors.courseOther)}
                                required
                              />
                              {Boolean(courseOther.trim()) && !errors.courseOther && (
                                <Check
                                  className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                            {errors.courseOther && (
                              <p role="alert" className="text-xs text-rose-600 mt-1.5">
                                {errors.courseOther}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="internship-duration"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          Duration <span className="text-rose-600" aria-hidden="true">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="internship-duration"
                            name="duration"
                            value={durationMonths}
                            onFocus={() => setActiveStep(2)}
                            onChange={(e) => handleDurationChange(e.target.value)}
                            className={selectBaseClass(
                              Boolean(errors.durationMonths),
                              durationMonths === ''
                            )}
                            aria-invalid={Boolean(errors.durationMonths)}
                            required
                          >
                            <option value="" className="text-slate-400">
                              Select duration
                            </option>
                            {DURATIONS.map((m) => (
                              <option key={m} value={String(m)} className="text-slate-900">
                                {m} {m === 1 ? 'Month' : 'Months'}
                              </option>
                            ))}
                          </select>
                          {Boolean(durationMonths) && !errors.durationMonths && (
                            <Check
                              className="w-4 h-4 text-emerald-600 absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none"
                              aria-hidden="true"
                            />
                          )}
                          <ChevronDown
                            className="w-5 h-5 text-[#1C35EA] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                            aria-hidden="true"
                          />
                        </div>
                        {errors.durationMonths && (
                          <p role="alert" className="text-xs text-rose-600 mt-1.5">
                            {errors.durationMonths}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="internship-startDate"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          Start date <span className="text-rose-600" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="internship-startDate"
                          name="start-date"
                          type="date"
                          value={startDate}
                          onFocus={() => setActiveStep(2)}
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
                          End date <span className="text-rose-600" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="internship-endDate"
                          name="end-date"
                          type="date"
                          value={endDate}
                          onFocus={() => setActiveStep(2)}
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

                  {/* Section 3: College details (Student) OR Work details (Professional) */}
                  {isStudent ? (
                    <div ref={specificSectionRef} className="space-y-5 scroll-mt-24">
                      <div className="border-b border-slate-200 pb-3 flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full bg-[#1C35EA]/10 text-[#1C35EA] flex items-center justify-center shrink-0">
                          <GraduationCap className="w-4 h-4" />
                        </span>
                        <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-lg sm:text-xl font-bold text-[#1E3A8A]">
                          College details
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        <div>
                          <label
                            htmlFor="internship-college"
                            className="block text-sm font-semibold text-slate-800 mb-1.5"
                          >
                            College name <span className="text-rose-600" aria-hidden="true">*</span>
                          </label>
                          <div className="relative">
                            <input
                              id="internship-college"
                              name="organization"
                              type="text"
                              value={college}
                              onFocus={() => setActiveStep(3)}
                              onChange={(e) => {
                                setCollege(e.target.value);
                                clearFieldError('college');
                              }}
                              placeholder="Enter your college or university name"
                              className={inputBaseClass(
                                Boolean(errors.college),
                                Boolean(college.trim()) && !errors.college
                              )}
                              aria-invalid={Boolean(errors.college)}
                              required
                            />
                            {Boolean(college.trim()) && !errors.college && (
                              <Check
                                className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                          {errors.college && (
                            <p role="alert" className="text-xs text-rose-600 mt-1.5">
                              {errors.college}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="internship-degree"
                            className="block text-sm font-semibold text-slate-800 mb-1.5"
                          >
                            Degree <span className="text-rose-600" aria-hidden="true">*</span>
                          </label>
                          <div className="relative">
                            <select
                              id="internship-degree"
                              name="degree"
                              value={degree}
                              onFocus={() => setActiveStep(3)}
                              onChange={(e) => {
                                const val = e.target.value;
                                setDegree(val);
                                clearFieldError('degree');
                                if (val !== 'Other') {
                                  clearFieldError('degreeOther');
                                }
                              }}
                              className={selectBaseClass(Boolean(errors.degree), degree === '')}
                              aria-invalid={Boolean(errors.degree)}
                              required
                            >
                              <option value="" className="text-slate-400">
                                Select degree
                              </option>
                              {DEGREES.map((deg) => (
                                <option key={deg} value={deg} className="text-slate-900">
                                  {deg}
                                </option>
                              ))}
                            </select>
                            {Boolean(degree) &&
                              (degree !== 'Other' || Boolean(degreeOther.trim())) &&
                              !errors.degree && (
                                <Check
                                  className="w-4 h-4 text-emerald-600 absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none"
                                  aria-hidden="true"
                                />
                              )}
                            <ChevronDown
                              className="w-5 h-5 text-[#1C35EA] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                              aria-hidden="true"
                            />
                          </div>
                          {errors.degree && (
                            <p role="alert" className="text-xs text-rose-600 mt-1.5">
                              {errors.degree}
                            </p>
                          )}

                          {degree === 'Other' && (
                            <div className="mt-3">
                              <label
                                htmlFor="internship-degreeOther"
                                className="block text-sm font-semibold text-slate-800 mb-1.5"
                              >
                                Please specify degree{' '}
                                <span className="text-rose-600" aria-hidden="true">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  id="internship-degreeOther"
                                  name="degree-other"
                                  type="text"
                                  value={degreeOther}
                                  onChange={(e) => {
                                    setDegreeOther(e.target.value);
                                    clearFieldError('degreeOther');
                                  }}
                                  placeholder="Please specify"
                                  className={inputBaseClass(
                                    Boolean(errors.degreeOther),
                                    Boolean(degreeOther.trim()) && !errors.degreeOther
                                  )}
                                  aria-invalid={Boolean(errors.degreeOther)}
                                  required
                                />
                                {Boolean(degreeOther.trim()) && !errors.degreeOther && (
                                  <Check
                                    className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                    aria-hidden="true"
                                  />
                                )}
                              </div>
                              {errors.degreeOther && (
                                <p role="alert" className="text-xs text-rose-600 mt-1.5">
                                  {errors.degreeOther}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="internship-department"
                            className="block text-sm font-semibold text-slate-800 mb-1.5"
                          >
                            Department <span className="text-rose-600" aria-hidden="true">*</span>
                          </label>
                          <div className="relative">
                            <select
                              id="internship-department"
                              name="department"
                              value={department}
                              onFocus={() => setActiveStep(3)}
                              onChange={(e) => {
                                const val = e.target.value;
                                setDepartment(val);
                                clearFieldError('department');
                                if (val !== 'Other') {
                                  clearFieldError('departmentOther');
                                }
                              }}
                              className={selectBaseClass(
                                Boolean(errors.department),
                                department === ''
                              )}
                              aria-invalid={Boolean(errors.department)}
                              required
                            >
                              <option value="" className="text-slate-400">
                                Select department
                              </option>
                              {DEPARTMENTS.map((dept) => (
                                <option key={dept} value={dept} className="text-slate-900">
                                  {dept}
                                </option>
                              ))}
                            </select>
                            {Boolean(department) &&
                              (department !== 'Other' || Boolean(departmentOther.trim())) &&
                              !errors.department && (
                                <Check
                                  className="w-4 h-4 text-emerald-600 absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none"
                                  aria-hidden="true"
                                />
                              )}
                            <ChevronDown
                              className="w-5 h-5 text-[#1C35EA] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                              aria-hidden="true"
                            />
                          </div>
                          {errors.department && (
                            <p role="alert" className="text-xs text-rose-600 mt-1.5">
                              {errors.department}
                            </p>
                          )}

                          {department === 'Other' && (
                            <div className="mt-3">
                              <label
                                htmlFor="internship-departmentOther"
                                className="block text-sm font-semibold text-slate-800 mb-1.5"
                              >
                                Please specify department{' '}
                                <span className="text-rose-600" aria-hidden="true">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  id="internship-departmentOther"
                                  name="department-other"
                                  type="text"
                                  value={departmentOther}
                                  onChange={(e) => {
                                    setDepartmentOther(e.target.value);
                                    clearFieldError('departmentOther');
                                  }}
                                  placeholder="Please specify"
                                  className={inputBaseClass(
                                    Boolean(errors.departmentOther),
                                    Boolean(departmentOther.trim()) && !errors.departmentOther
                                  )}
                                  aria-invalid={Boolean(errors.departmentOther)}
                                  required
                                />
                                {Boolean(departmentOther.trim()) && !errors.departmentOther && (
                                  <Check
                                    className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                    aria-hidden="true"
                                  />
                                )}
                              </div>
                              {errors.departmentOther && (
                                <p role="alert" className="text-xs text-rose-600 mt-1.5">
                                  {errors.departmentOther}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="internship-semester"
                            className="block text-sm font-semibold text-slate-800 mb-1.5"
                          >
                            Semester <span className="text-rose-600" aria-hidden="true">*</span>
                          </label>
                          <div className="relative">
                            <select
                              id="internship-semester"
                              name="semester"
                              value={semester}
                              onFocus={() => setActiveStep(3)}
                              onChange={(e) => {
                                setSemester(e.target.value);
                                clearFieldError('semester');
                              }}
                              className={selectBaseClass(Boolean(errors.semester), semester === '')}
                              aria-invalid={Boolean(errors.semester)}
                              required
                            >
                              <option value="" className="text-slate-400">
                                Select semester
                              </option>
                              {SEMESTERS.map((sem) => (
                                <option
                                  key={String(sem)}
                                  value={String(sem)}
                                  className="text-slate-900"
                                >
                                  {sem === 'Completed' ? 'Completed' : `Semester ${sem}`}
                                </option>
                              ))}
                            </select>
                            {Boolean(semester) && !errors.semester && (
                              <Check
                                className="w-4 h-4 text-emerald-600 absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none"
                                aria-hidden="true"
                              />
                            )}
                            <ChevronDown
                              className="w-5 h-5 text-[#1C35EA] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                              aria-hidden="true"
                            />
                          </div>
                          {errors.semester && (
                            <p role="alert" className="text-xs text-rose-600 mt-1.5">
                              {errors.semester}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div ref={specificSectionRef} className="space-y-5 scroll-mt-24">
                      <div className="border-b border-slate-200 pb-3 flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full bg-[#1C35EA]/10 text-[#1C35EA] flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4" />
                        </span>
                        <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-lg sm:text-xl font-bold text-[#1E3A8A]">
                          Work details
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        <div>
                          <label
                            htmlFor="internship-qualification"
                            className="block text-sm font-semibold text-slate-800 mb-1.5"
                          >
                            Highest qualification{' '}
                            <span className="text-rose-600" aria-hidden="true">*</span>
                          </label>
                          <div className="relative">
                            <select
                              id="internship-qualification"
                              name="qualification"
                              value={qualification}
                              onFocus={() => setActiveStep(3)}
                              onChange={(e) => {
                                const val = e.target.value;
                                setQualification(val);
                                clearFieldError('qualification');
                                if (val !== 'Other') {
                                  clearFieldError('qualificationOther');
                                }
                              }}
                              className={selectBaseClass(
                                Boolean(errors.qualification),
                                qualification === ''
                              )}
                              aria-invalid={Boolean(errors.qualification)}
                              required
                            >
                              <option value="" className="text-slate-400">
                                Select qualification
                              </option>
                              {QUALIFICATIONS.map((qual) => (
                                <option key={qual} value={qual} className="text-slate-900">
                                  {qual}
                                </option>
                              ))}
                            </select>
                            {Boolean(qualification) &&
                              (qualification !== 'Other' || Boolean(qualificationOther.trim())) &&
                              !errors.qualification && (
                                <Check
                                  className="w-4 h-4 text-emerald-600 absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none"
                                  aria-hidden="true"
                                />
                              )}
                            <ChevronDown
                              className="w-5 h-5 text-[#1C35EA] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                              aria-hidden="true"
                            />
                          </div>
                          {errors.qualification && (
                            <p role="alert" className="text-xs text-rose-600 mt-1.5">
                              {errors.qualification}
                            </p>
                          )}

                          {qualification === 'Other' && (
                            <div className="mt-3">
                              <label
                                htmlFor="internship-qualificationOther"
                                className="block text-sm font-semibold text-slate-800 mb-1.5"
                              >
                                Please specify qualification{' '}
                                <span className="text-rose-600" aria-hidden="true">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  id="internship-qualificationOther"
                                  name="qualification-other"
                                  type="text"
                                  value={qualificationOther}
                                  onChange={(e) => {
                                    setQualificationOther(e.target.value);
                                    clearFieldError('qualificationOther');
                                  }}
                                  placeholder="Please specify"
                                  className={inputBaseClass(
                                    Boolean(errors.qualificationOther),
                                    Boolean(qualificationOther.trim()) &&
                                      !errors.qualificationOther
                                  )}
                                  aria-invalid={Boolean(errors.qualificationOther)}
                                  required
                                />
                                {Boolean(qualificationOther.trim()) &&
                                  !errors.qualificationOther && (
                                    <Check
                                      className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                      aria-hidden="true"
                                    />
                                  )}
                              </div>
                              {errors.qualificationOther && (
                                <p role="alert" className="text-xs text-rose-600 mt-1.5">
                                  {errors.qualificationOther}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div>
                          <span
                            id="internship-currentlyWorking-label"
                            className="block text-sm font-semibold text-slate-800 mb-1.5"
                          >
                            Currently working?{' '}
                            <span className="text-rose-600" aria-hidden="true">*</span>
                          </span>
                          <div
                            id="internship-currentlyWorking"
                            tabIndex={-1}
                            role="group"
                            aria-labelledby="internship-currentlyWorking-label"
                            className="grid grid-cols-2 gap-3"
                          >
                            {(['Yes', 'No'] as const).map((opt) => {
                              const selected = currentlyWorking === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onFocus={() => setActiveStep(3)}
                                  onClick={() => handleWorkingChange(opt)}
                                  className={`h-12 min-h-[48px] px-4 py-2.5 rounded-xl border text-base font-semibold transition-all cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-[#1C35EA]/15 ${
                                    selected
                                      ? 'bg-[#1C35EA] text-white border-[#1C35EA] shadow-xs'
                                      : 'bg-[#F4F7FC] text-slate-700 border-slate-200 hover:border-[#1C35EA] hover:bg-white'
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

                        {currentlyWorking === 'Yes' && (
                          <>
                            <div>
                              <label
                                htmlFor="internship-company"
                                className="block text-sm font-semibold text-slate-800 mb-1.5"
                              >
                                Current company{' '}
                                <span className="text-rose-600" aria-hidden="true">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  id="internship-company"
                                  name="organization"
                                  type="text"
                                  autoComplete="organization"
                                  value={company}
                                  onChange={(e) => {
                                    setCompany(e.target.value);
                                    clearFieldError('company');
                                  }}
                                  placeholder="Enter company name"
                                  className={inputBaseClass(
                                    Boolean(errors.company),
                                    Boolean(company.trim()) && !errors.company
                                  )}
                                  aria-invalid={Boolean(errors.company)}
                                  required
                                />
                                {Boolean(company.trim()) && !errors.company && (
                                  <Check
                                    className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                    aria-hidden="true"
                                  />
                                )}
                              </div>
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
                                Designation{' '}
                                <span className="text-rose-600" aria-hidden="true">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  id="internship-designation"
                                  name="organization-title"
                                  type="text"
                                  autoComplete="organization-title"
                                  value={designation}
                                  onChange={(e) => {
                                    setDesignation(e.target.value);
                                    clearFieldError('designation');
                                  }}
                                  placeholder="e.g. Junior Software Engineer"
                                  className={inputBaseClass(
                                    Boolean(errors.designation),
                                    Boolean(designation.trim()) && !errors.designation
                                  )}
                                  aria-invalid={Boolean(errors.designation)}
                                  required
                                />
                                {Boolean(designation.trim()) && !errors.designation && (
                                  <Check
                                    className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                    aria-hidden="true"
                                  />
                                )}
                              </div>
                              {errors.designation && (
                                <p role="alert" className="text-xs text-rose-600 mt-1.5">
                                  {errors.designation}
                                </p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Confirmation checkbox */}
                  <div className="pt-2 border-t border-slate-200">
                    <label
                      htmlFor="internship-confirmed"
                      className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none"
                    >
                      <input
                        id="internship-confirmed"
                        name="confirmed"
                        type="checkbox"
                        checked={confirmed}
                        onChange={(e) => {
                          setConfirmed(e.target.checked);
                          clearFieldError('confirmed');
                        }}
                        className="w-5 h-5 rounded border-slate-300 text-[#1C35EA] focus:ring-[#1C35EA] shrink-0 cursor-pointer"
                        aria-invalid={Boolean(errors.confirmed)}
                        required
                      />
                      <span className="text-sm text-slate-700 leading-snug">
                        I confirm these details are correct.{' '}
                        <span className="text-rose-600" aria-hidden="true">*</span>
                      </span>
                    </label>
                    {errors.confirmed && (
                      <p role="alert" className="text-xs text-rose-600 mt-1">
                        {errors.confirmed}
                      </p>
                    )}
                  </div>

                  {/* Continue button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto sm:min-w-[220px] py-3 px-6 min-h-[48px] rounded-xl text-white text-sm font-semibold transition-all duration-200 shadow-md hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-4px_rgba(28,53,234,0.38)] motion-reduce:hover:translate-y-0 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                      style={{
                        background:
                          'linear-gradient(135deg, #00B0F0 0%, #1C35EA 35%, #4D19EA 100%)',
                      }}
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InternshipForm;
