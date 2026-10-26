export interface RawChatMessage {
  role?: string;
  content?: string;
  text?: string;
  parts?: { text?: string }[];
}

export interface FormattedChatContent {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface CourseEnquiry {
  id: string;
  fullName: string;
  mobileNumber: string;
  email?: string;
  course: string;
  currentStatus: string;
  learningMode: string;
  preferredBatch?: string;
  questions?: string;
  consent: boolean;
  createdAt: string;
}

const MAX_CHAT_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 4_000;

export function validateAndFormatChatMessages(
  body: unknown
): { ok: true; contents: FormattedChatContent[] } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Request body must be a valid JSON object.' };
  }

  const { messages } = body as { messages?: unknown };
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return { ok: false, error: 'Messages array is required' };
  }

  const trimmedMessages = messages.slice(-MAX_CHAT_MESSAGES) as RawChatMessage[];

  const formattedContents: FormattedChatContent[] = trimmedMessages.map((m) => {
    let textContent = '';
    if (typeof m?.content === 'string') {
      textContent = m.content;
    } else if (typeof m?.text === 'string') {
      textContent = m.text;
    } else if (Array.isArray(m?.parts) && typeof m.parts[0]?.text === 'string') {
      textContent = m.parts[0].text;
    }

    const sanitizedText = textContent.trim().slice(0, MAX_MESSAGE_CHARS);

    return {
      role: m?.role === 'assistant' || m?.role === 'model' ? 'model' : 'user',
      parts: [{ text: sanitizedText }],
    };
  });

  const hasNonEmptyMessage = formattedContents.some((item) => item.parts[0].text.length > 0);
  if (!hasNonEmptyMessage) {
    return { ok: false, error: 'At least one non-empty message is required.' };
  }

  return { ok: true, contents: formattedContents };
}

export function validateCourseEnquiryPayload(
  body: unknown
): { ok: true; enquiry: CourseEnquiry } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Request body must be a valid JSON object.' };
  }

  const {
    fullName,
    mobileNumber,
    email,
    course,
    currentStatus,
    learningMode,
    preferredBatch,
    questions,
    consent,
  } = body as Record<string, unknown>;

  if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
    return { ok: false, error: 'Full name is required.' };
  }

  if (!mobileNumber || typeof mobileNumber !== 'string' || !mobileNumber.trim()) {
    return { ok: false, error: 'Mobile number is required.' };
  }

  if (!course || typeof course !== 'string' || !course.trim()) {
    return { ok: false, error: 'Please select a course.' };
  }

  if (!consent) {
    return { ok: false, error: 'Consent to contact is required.' };
  }

  const referenceId = `IAM-TRN-${Date.now().toString().slice(-6)}`;
  const newEnquiry: CourseEnquiry = {
    id: referenceId,
    fullName: fullName.trim().slice(0, 120),
    mobileNumber: mobileNumber.trim().slice(0, 30),
    email: typeof email === 'string' && email.trim() ? email.trim().slice(0, 160) : undefined,
    course: course.trim().slice(0, 160),
    currentStatus:
      typeof currentStatus === 'string' && currentStatus.trim()
        ? currentStatus.trim().slice(0, 80)
        : 'Student',
    learningMode:
      typeof learningMode === 'string' && learningMode.trim()
        ? learningMode.trim().slice(0, 80)
        : 'Need Guidance',
    preferredBatch:
      typeof preferredBatch === 'string' && preferredBatch.trim()
        ? preferredBatch.trim().slice(0, 120)
        : undefined,
    questions:
      typeof questions === 'string' && questions.trim()
        ? questions.trim().slice(0, 1500)
        : undefined,
    consent: Boolean(consent),
    createdAt: new Date().toISOString(),
  };

  return { ok: true, enquiry: newEnquiry };
}
