import emailjs from '@emailjs/browser';

const readEnvOrFallback = (envValue: unknown, fallback: string): string =>
  typeof envValue === 'string' && envValue.trim() !== '' ? envValue.trim() : fallback;

const EMAILJS_PUBLIC_KEY = readEnvOrFallback(
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  'PASTE_PUBLIC_KEY'
);
const EMAILJS_SERVICE_ID = readEnvOrFallback(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  'PASTE_SERVICE_ID'
);
const EMAILJS_ADMIN_TEMPLATE_ID = readEnvOrFallback(
  import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID,
  'PASTE_ADMIN_TEMPLATE_ID'
);
const EMAILJS_STUDENT_TEMPLATE_ID = readEnvOrFallback(
  import.meta.env.VITE_EMAILJS_STUDENT_TEMPLATE_ID,
  'PASTE_STUDENT_TEMPLATE_ID'
);

export interface InternshipEmailParams {
  full_name: string;
  email: string;
  phone: string;
  type_label: 'Student Internship' | 'Professional Internship';
  application_id: string;
  course: string;
  duration: string;
  start_date: string;
  end_date: string;
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  college: string;
  degree: string;
  department: string;
  semester: string;
  qualification: string;
  currently_working: string;
  company: string;
  designation: string;
  submitted_at: string;
}

export function formatIndiaSubmittedAt(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const dayPeriod = get('dayPeriod').toUpperCase();
  return `${get('day')} ${get('month')} ${get('year')}, ${get('hour')}:${get('minute')} ${dayPeriod}`;
}

export function sendInternshipEmails(params: InternshipEmailParams): void {
  const templateParams: Record<string, string> = {
    full_name: params.full_name || '-',
    email: params.email || '-',
    phone: params.phone || '-',
    type_label: params.type_label || '-',
    application_id: params.application_id || '-',
    course: params.course || '-',
    duration: params.duration || '-',
    start_date: params.start_date || '-',
    end_date: params.end_date || '-',
    address: params.address || '-',
    area: params.area || '-',
    city: params.city || '-',
    state: params.state || '-',
    pincode: params.pincode || '-',
    college: params.college || '-',
    degree: params.degree || '-',
    department: params.department || '-',
    semester: params.semester || '-',
    qualification: params.qualification || '-',
    currently_working: params.currently_working || '-',
    company: params.company || '-',
    designation: params.designation || '-',
    submitted_at: params.submitted_at || '-',
  };

  void Promise.all([
    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_ADMIN_TEMPLATE_ID, templateParams, {
        publicKey: EMAILJS_PUBLIC_KEY,
      })
      .catch((err) => {
        console.error('EmailJS admin notification error:', err);
      }),
    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_STUDENT_TEMPLATE_ID, templateParams, {
        publicKey: EMAILJS_PUBLIC_KEY,
      })
      .catch((err) => {
        console.error('EmailJS student confirmation error:', err);
      }),
  ]);
}
