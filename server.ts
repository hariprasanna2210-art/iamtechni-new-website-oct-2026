import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { generateSitemapXml } from './src/utils/sitemapGenerator';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

const app = express();
app.use(express.json());

// Auto-sync /public/sitemap.xml on startup from data files
try {
  const sitemapPath = path.resolve(__dirname, 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, generateSitemapXml(), 'utf-8');
} catch (err) {
  console.warn('Could not write public/sitemap.xml on startup:', err);
}

// Serve /robots.txt as real text/plain file (never index.html)
app.get('/robots.txt', (_req, res) => {
  const robotsPath = path.resolve(__dirname, isProduction ? 'dist' : 'public', 'robots.txt');
  const fallbackPublicPath = path.resolve(__dirname, 'public', 'robots.txt');
  const targetPath = fs.existsSync(robotsPath) ? robotsPath : fallbackPublicPath;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  return res.sendFile(targetPath);
});

// Serve /sitemap.xml dynamically from data files as real application/xml (never index.html)
app.get('/sitemap.xml', (_req, res) => {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  return res.send(generateSitemapXml());
});

// Initialize GoogleGenAI client according to @google/genai guidelines
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `You are the IAMTECHNI AI Solutions Architect and Virtual Technology Advisor for IAMTECHNI (https://iamtechni.in).
IAMTECHNI is a premier enterprise digital engineering, artificial intelligence, cloud modernization, and custom software development company.

Key Company Facts:
- Phone: +91-7418120053 (direct telephone line)
- Email: iamtechni.hr@outlook.com
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
- Provide actionable architectural guidance, technology recommendations, and scope estimations when asked.
- Encourage users to schedule an exploratory technical consultation or contact the team directly via phone (+91-7418120053) or email (iamtechni.hr@outlook.com).
- Format responses clearly using markdown: clear headings, concise bullet points, bold key terms, and code snippets when requested.
- If asked about pricing or exact timelines, offer typical engineering ranges and suggest an exploratory discovery session.`;

// Gemini Multi-Turn Chat API Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!ai) {
      return res.json({
        text: `### Welcome to IAMTECHNI!\n\nI am your AI Solutions Architect. While our live Gemini backend is connecting, our technical consulting team is actively available for project consultations and technical feasibility reviews.\n\n**Connect with IAMTECHNI:**\n- 📞 **Direct Phone:** [+91-7418120053](tel:+917418120053)\n- ✉️ **Direct Email:** [iamtechni.hr@outlook.com](mailto:iamtechni.hr@outlook.com)\n- 🌐 **Global Delivery:** India, US, EMEA, APAC\n\nHow can we help advance your technology roadmap today?`,
      });
    }

    // Format conversation history for @google/genai
    const formattedContents = messages.map((m: { role: string; content?: string; text?: string; parts?: { text: string }[] }) => {
      let textContent = '';
      if (typeof m.content === 'string') {
        textContent = m.content;
      } else if (typeof m.text === 'string') {
        textContent = m.text;
      } else if (Array.isArray(m.parts) && m.parts[0]?.text) {
        textContent = m.parts[0].text;
      }
      return {
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: textContent || '' }],
      };
    });

    let responseText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
      responseText = response.text || '';
    } catch (primaryErr: any) {
      console.warn('Primary model gemini-3.8-flash busy/errored, attempting gemini-3.1-flash-lite...', primaryErr?.message);
      // Fallback model for rapid tasks and resilience
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
      responseText = fallbackResponse.text || '';
    }

    return res.json({ text: responseText });
  } catch (error: any) {
    console.error('Error generating Gemini chat response:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate response',
      fallbackText: 'I apologize, but I encountered a temporary connection issue. You can reach our engineering team directly at +91-7418120053 or iamtechni.hr@outlook.com for immediate support.',
    });
  }
});

// In-memory store for training course enquiries
interface CourseEnquiry {
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

const courseEnquiries: CourseEnquiry[] = [];

// Course Enquiry Submission Endpoint
app.post('/api/course-enquiry', (req, res) => {
  try {
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
    } = req.body;

    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    if (!mobileNumber || typeof mobileNumber !== 'string' || !mobileNumber.trim()) {
      return res.status(400).json({ error: 'Mobile number is required.' });
    }

    if (!course || typeof course !== 'string' || !course.trim()) {
      return res.status(400).json({ error: 'Please select a course.' });
    }

    if (!consent) {
      return res.status(400).json({ error: 'Consent to contact is required.' });
    }

    const referenceId = `IAM-TRN-${Date.now().toString().slice(-6)}`;
    const newEnquiry: CourseEnquiry = {
      id: referenceId,
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      email: email ? email.trim() : undefined,
      course: course.trim(),
      currentStatus: currentStatus || 'Student',
      learningMode: learningMode || 'Need Guidance',
      preferredBatch: preferredBatch ? preferredBatch.trim() : undefined,
      questions: questions ? questions.trim() : undefined,
      consent: !!consent,
      createdAt: new Date().toISOString(),
    };

    courseEnquiries.push(newEnquiry);
    console.log(`[IAMTECHNI Training] New enquiry logged:`, {
      referenceId,
      fullName: newEnquiry.fullName,
      course: newEnquiry.course,
      mobileNumber: newEnquiry.mobileNumber,
    });

    return res.status(201).json({
      success: true,
      referenceId,
      message: `Enquiry received for ${newEnquiry.course}. Our academic counselor will contact you within 24 hours.`,
      enquiry: {
        id: newEnquiry.id,
        course: newEnquiry.course,
        fullName: newEnquiry.fullName,
        createdAt: newEnquiry.createdAt,
      },
    });
  } catch (err: any) {
    console.error('Error handling course enquiry:', err);
    return res.status(500).json({ error: 'Internal server error processing enquiry' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'IAMTECHNI Enterprise Backend',
    geminiConfigured: !!ai,
    enquiriesCount: courseEnquiries.length,
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (!isProduction) {
    app.use(express.static(path.resolve(__dirname, 'public')));
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IAMTECHNI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
