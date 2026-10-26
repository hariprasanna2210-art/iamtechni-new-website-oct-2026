import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import type { FormattedChatContent } from './validation';

export const DEFAULT_TIMEOUT_MS = 20_000;
const PRIMARY_MODEL_TIMEOUT_MS = 10_000;
const FALLBACK_MODEL_TIMEOUT_MS = 8_000;
export const MAX_CHAT_OUTPUT_TOKENS = 500;
export const FAST_CHAT_MODEL = 'gemini-3.1-flash-lite';
export const FALLBACK_CHAT_MODEL = 'gemini-3.8-flash';

export const SYSTEM_INSTRUCTION = `You are the IAMTECHNI AI Solutions Architect and Virtual Technology Advisor for IAMTECHNI (https://iamtechni.in).
IAMTECHNI is a premier enterprise digital engineering, artificial intelligence, cloud modernization, and custom software development company.

Key Company Facts:
- Phone: +91-7418120053 (direct telephone line)
- Email: info@iamtechni.in
- Headquarters: Tamil Nadu, India
- Delivery Coverage: Global Delivery (India, United States, EMEA, APAC)
- Operating Hours: Monday to Saturday, 9:00 AM – 7:00 PM IST
- Response SLA: Within 1 business day for all technical inquiries

Core Engineering Disciplines & Solutions:
1. Website Design & Development: Bespoke React, Next.js, TypeScript corporate flagships, headless CMS (Sanity, Strapi), sub-second load times, Core Web Vitals optimization.
2. UI/UX Design: Enterprise design systems, Figma prototypes, user research, WCAG 2.1 AA accessibility, product design.
3. E-commerce Development: Scalable Shopify Plus, headless Commerce Layer, custom marketplace architectures, secure checkout.
4. Custom Software Development: High-concurrency microservices, event-driven backends, RESTful and GraphQL APIs, distributed database clustering.
5. Mobile App Development: Native iOS (Swift), Android (Kotlin), and cross-platform Flutter/React Native solutions.
6. AI and Machine Learning: Custom predictive models, computer vision, intelligent document processing, deep learning pipelines.
7. Generative AI Solutions: Enterprise LLM integration, Retrieval-Augmented Generation (RAG), private model fine-tuning, autonomous agents.
8. Robotics & Emerging Tech: Industrial IoT telemetry, ROS 2 robotics prototypes, edge computing, sensor integration.
9. Digital Marketing & SEO: Technical SEO audits, organic growth strategies, B2B performance marketing.
10. Social Media Marketing: B2B authority building, content syndication, multi-channel executive branding.
11. Cloud Computing, Architecture & Migration: Multi-cloud (AWS, Azure, GCP), Kubernetes container orchestration, zero-downtime database migration.
12. DevOps & CI/CD: Automated delivery pipelines, Terraform Infrastructure as Code (IaC), GitOps, automated testing.
13. Data Analytics & Business Intelligence: Real-time telemetry, Snowflake/BigQuery data warehouses, interactive executive dashboards.
14. Cybersecurity: Zero-trust architecture, threat modeling, penetration testing, compliance (SOC 2, ISO 27001, GDPR).
15. IT Consulting & Tech Strategy: Technology roadmaps, legacy stack modernizations, fractional CTO guidance.

Your Persona & Behavior:
- Professional, knowledgeable, articulate, and welcoming.
- Start replies naturally and warmly (for example, "Hello! Welcome to IAMTECHNI..." when greeted).
- NEVER mention delays, system readiness, connection status, or previous errors.
- Keep answers short and scannable (under 120 words) unless the user explicitly asks for in-depth detail.
- Provide actionable architectural guidance, technology recommendations, and scope estimations when asked.
- Encourage users to schedule an exploratory technical consultation or contact the team directly via phone (+91-7418120053) or email (info@iamtechni.in).
- Format responses clearly using markdown: clear headings, concise bullet points, bold key terms, and code snippets when requested.
- If asked about pricing or exact timelines, offer typical engineering ranges and suggest an exploratory discovery session.`;

export const UNCONFIGURED_FALLBACK_TEXT = `Hello! Welcome to **IAMTECHNI**. I am your AI Solutions Architect.\n\nWe help businesses design, build, and scale enterprise web platforms, mobile apps, cloud infrastructure, and custom AI solutions.\n\n**Connect with IAMTECHNI:**\n- 📞 **Direct Phone:** [+91-7418120053](tel:+917418120053)\n- ✉️ **Direct Email:** [info@iamtechni.in](mailto:info@iamtechni.in)\n- 🌐 **Global Delivery:** India, US, EMEA, APAC\n\nHow can we help advance your technology roadmap today?`;

export const ERROR_FALLBACK_TEXT =
  'I apologize, but I encountered a temporary connection issue. You can reach our engineering team directly at +91-7418120053 or info@iamtechni.in for immediate support.';

let cachedClient: GoogleGenAI | null = null;
let cachedKey: string | undefined;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }

  if (!cachedClient || cachedKey !== apiKey) {
    cachedClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    cachedKey = apiKey;
  }

  return cachedClient;
}

export function isGeminiConfigured(): boolean {
  return getGeminiClient() !== null;
}

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
  timeoutMessage = 'The AI service took too long to respond (20s timeout).'
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      const timeoutError = new Error(timeoutMessage);
      timeoutError.name = 'TimeoutError';
      reject(timeoutError);
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function generateChatResponse(
  formattedContents: FormattedChatContent[],
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<{ text: string; reply: string }> {
  const ai = getGeminiClient();

  if (!ai) {
    return { text: UNCONFIGURED_FALLBACK_TEXT, reply: UNCONFIGURED_FALLBACK_TEXT };
  }

  const runGeneration = async (): Promise<string> => {
    try {
      // Use fastest Flash Lite model (gemini-3.1-flash-lite) with thinking disabled (ThinkingLevel.MINIMAL) and maxOutputTokens: 500
      const response = await withTimeout(
        ai.models.generateContent({
          model: FAST_CHAT_MODEL,
          contents: formattedContents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
            maxOutputTokens: MAX_CHAT_OUTPUT_TOKENS,
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.MINIMAL,
            },
          },
        }),
        Math.min(PRIMARY_MODEL_TIMEOUT_MS, timeoutMs),
        'Primary Flash Lite model timed out'
      );
      if (response.text) {
        return response.text;
      }
      throw new Error('Empty response from primary Flash Lite model');
    } catch (primaryErr: any) {
      console.warn(
        `Primary model ${FAST_CHAT_MODEL} busy/errored, attempting ${FALLBACK_CHAT_MODEL}...`,
        primaryErr?.message
      );
      const fallbackResponse = await withTimeout(
        ai.models.generateContent({
          model: FALLBACK_CHAT_MODEL,
          contents: formattedContents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
            maxOutputTokens: MAX_CHAT_OUTPUT_TOKENS,
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.LOW,
            },
          },
        }),
        Math.min(FALLBACK_MODEL_TIMEOUT_MS, timeoutMs),
        'Fallback Gemini model timed out'
      );
      return fallbackResponse.text || UNCONFIGURED_FALLBACK_TEXT;
    }
  };

  const responseText = await withTimeout(runGeneration(), timeoutMs);
  return { text: responseText, reply: responseText };
}
