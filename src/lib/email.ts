import emailjs from '@emailjs/browser';

const readEnvOrFallback = (envValue: unknown, fallback: string): string =>
  typeof envValue === 'string' && envValue.trim() !== '' ? envValue.trim() : fallback;

const EMAILJS_PUBLIC_KEY = readEnvOrFallback(
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  'gM0rPsN-3hzgsp6z9'
);
const EMAILJS_SERVICE_ID = readEnvOrFallback(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  'service_qoho2mj'
);
const EMAILJS_TEMPLATE_ID = readEnvOrFallback(
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  'template_08tyxyy'
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
  submitted_at: string;
  info1_label: string;
  info1_value: string;
  info2_label: string;
  info2_value: string;
  info3_label: string;
  info3_value: string;
  info4_label: string;
  info4_value: string;
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

export function sendInternshipEmail(params: InternshipEmailParams): void {
  const orDash = (val: string) => (val && val.trim() ? val.trim() : '-');

  const templateParams: Record<string, string> = {
    full_name: orDash(params.full_name),
    email: orDash(params.email),
    phone: orDash(params.phone),
    type_label: orDash(params.type_label),
    application_id: orDash(params.application_id),
    course: orDash(params.course),
    duration: orDash(params.duration),
    start_date: orDash(params.start_date),
    end_date: orDash(params.end_date),
    address: orDash(params.address),
    area: orDash(params.area),
    city: orDash(params.city),
    state: orDash(params.state),
    pincode: orDash(params.pincode),
    submitted_at: orDash(params.submitted_at),
    info1_label: orDash(params.info1_label),
    info1_value: orDash(params.info1_value),
    info2_label: orDash(params.info2_label),
    info2_value: orDash(params.info2_value),
    info3_label: orDash(params.info3_label),
    info3_value: orDash(params.info3_value),
    info4_label: orDash(params.info4_label),
    info4_value: orDash(params.info4_value),
  };

  void emailjs
    .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, {
      publicKey: EMAILJS_PUBLIC_KEY,
    })
    .catch((err: unknown) => {
      const emailErr = err as { status?: number; text?: string };
      console.error('EmailJS error:', emailErr?.status ?? 'unknown', emailErr?.text ?? err);
    });
}
