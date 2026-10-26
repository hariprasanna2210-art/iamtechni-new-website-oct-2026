import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSitemapXml } from './src/utils/sitemapGenerator';
import { SERVICE_SLUG_REDIRECTS } from './src/data/servicesData';
import {
  DEFAULT_TIMEOUT_MS,
  ERROR_FALLBACK_TEXT,
  generateChatResponse,
  isGeminiConfigured,
} from './netlify/functions/_lib/gemini';
import {
  validateAndFormatChatMessages,
  validateCourseEnquiryPayload,
} from './netlify/functions/_lib/validation';
import { checkRateLimit, getClientIp } from './netlify/functions/_lib/rateLimit';
import { formatFriendlyChatError } from './netlify/functions/_lib/http';
import {
  getCourseEnquiriesCount,
  recordCourseEnquiry,
} from './netlify/functions/_lib/courseEnquiryStore';

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

// Redirect duplicate/alias service slugs (e.g. website-development -> web-development) to canonical slugs
app.get('/services/:slug', (req, res, next) => {
  const rawSlug = (req.params.slug || '').trim().replace(/\/+$/, '');
  const canonicalSlug = SERVICE_SLUG_REDIRECTS[rawSlug];
  if (canonicalSlug && canonicalSlug !== rawSlug) {
    return res.redirect(301, `/services/${canonicalSlug}`);
  }
  return next();
});

// Gemini Multi-Turn Chat & Advisor API Endpoint
const handleChatRequest: express.RequestHandler = async (req, res) => {
  try {
    const clientIp = getClientIp(req.headers as Record<string, string | string[] | undefined>) || req.ip || 'unknown';
    const rate = checkRateLimit(clientIp, 'chat', 20, 60_000);
    if (!rate.allowed) {
      res.setHeader('Retry-After', String(rate.retryAfterSeconds));
      return res.status(429).json({
        error: `Too many chat requests. Please wait ${rate.retryAfterSeconds} seconds before trying again.`,
        fallbackText: ERROR_FALLBACK_TEXT,
        text: ERROR_FALLBACK_TEXT,
      });
    }

    const validation = validateAndFormatChatMessages(req.body);
    if (!validation.ok) {
      return res.status(400).json({
        error: validation.error,
        fallbackText: ERROR_FALLBACK_TEXT,
      });
    }

    const result = await generateChatResponse(validation.contents, DEFAULT_TIMEOUT_MS);
    return res.json({ text: result.text, reply: result.reply });
  } catch (error: any) {
    console.error('Error generating Gemini chat response:', error);
    const friendly = formatFriendlyChatError(error);
    return res.status(friendly.statusCode).json({
      error: friendly.error,
      fallbackText: friendly.fallbackText,
      text: friendly.fallbackText,
    });
  }
};

app.post('/api/chat', handleChatRequest);
app.post('/api/advisor', handleChatRequest);

// Course Enquiry Submission Endpoint
app.post('/api/course-enquiry', (req, res) => {
  try {
    const clientIp = getClientIp(req.headers as Record<string, string | string[] | undefined>) || req.ip || 'unknown';
    const rate = checkRateLimit(clientIp, 'course-enquiry', 10, 60_000);
    if (!rate.allowed) {
      res.setHeader('Retry-After', String(rate.retryAfterSeconds));
      return res.status(429).json({
        error: `Too many enquiry submissions. Please wait ${rate.retryAfterSeconds} seconds before trying again.`,
      });
    }

    const validation = validateCourseEnquiryPayload(req.body);
    if (!validation.ok) {
      return res.status(400).json({ error: validation.error });
    }

    const newEnquiry = validation.enquiry;
    recordCourseEnquiry(newEnquiry);

    return res.status(201).json({
      success: true,
      referenceId: newEnquiry.id,
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
    geminiConfigured: isGeminiConfigured(),
    enquiriesCount: getCourseEnquiriesCount(),
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
