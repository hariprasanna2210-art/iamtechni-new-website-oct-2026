export interface RawChatMessage {
  id?: string;
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

const MAX_CHAT_MESSAGES = 6;
const MAX_MESSAGE_CHARS = 4_000;

export function validateAndFormatChatMessages(
  body: unknown
): { ok: true; contents: FormattedChatContent[] } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Request body must be a valid JSON object.' };
  }

  const record = body as {
    messages?: unknown;
    message?: unknown;
    prompt?: unknown;
  };

  let rawMessages: RawChatMessage[] = [];

  if (Array.isArray(record.messages) && record.messages.length > 0) {
    rawMessages = record.messages as RawChatMessage[];
  } else if (typeof record.message === 'string' && record.message.trim()) {
    rawMessages = [{ role: 'user', content: record.message.trim() }];
  } else if (typeof record.prompt === 'string' && record.prompt.trim()) {
    rawMessages = [{ role: 'user', content: record.prompt.trim() }];
  } else {
    return { ok: false, error: 'Messages array is required' };
  }

  // Filter out the initial static greeting and any fallback/error messages first
  const mapped: FormattedChatContent[] = [];
  for (const m of rawMessages) {
    if (m?.id === 'welcome-1') continue;

    let textContent = '';
    if (typeof m?.content === 'string') {
      textContent = m.content;
    } else if (typeof m?.text === 'string') {
      textContent = m.text;
    } else if (Array.isArray(m?.parts) && typeof m.parts[0]?.text === 'string') {
      textContent = m.parts[0].text;
    }

    const sanitizedText = textContent.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!sanitizedText) continue;

    const role: 'user' | 'model' =
      m?.role === 'assistant' || m?.role === 'model' ? 'model' : 'user';

    // Skip initial static greeting or prior error/fallback messages
    if (
      role === 'model' &&
      (m?.id?.startsWith('bot-fallback-') ||
        m?.id?.startsWith('bot-err-') ||
        sanitizedText.startsWith('Hello! I am the **IAMTECHNI AI Solutions Architect**') ||
        /temporary (network )?delay|temporary connection issue|took longer than 20 seconds/i.test(
          sanitizedText
        ))
    ) {
      continue;
    }

    mapped.push({
      role,
      parts: [{ text: sanitizedText }],
    });
  }

  // Keep only the last 6 messages
  const recentMessages = mapped.slice(-MAX_CHAT_MESSAGES);

  // Ensure the history sent to Gemini starts with a 'user' message
  const firstUserIdx = recentMessages.findIndex((item) => item.role === 'user');
  const normalizedContents = firstUserIdx >= 0 ? recentMessages.slice(firstUserIdx) : [];

  if (normalizedContents.length === 0) {
    return { ok: false, error: 'At least one non-empty user message is required.' };
  }

  return { ok: true, contents: normalizedContents };
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
