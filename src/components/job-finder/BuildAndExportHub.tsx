import React, { useState } from 'react';
import {
  FileCode2,
  Terminal,
  Download,
  Copy,
  Check,
  Smartphone,
  Database,
  Key,
  Mail,
  Server,
  Layers,
} from 'lucide-react';

export const BuildAndExportHub: React.FC<{ onSwitchToApp: () => void }> = ({ onSwitchToApp }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-emerald-500/30">
            📦
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight">Android APK & Production Deployment Hub</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase">
                Ready for EAS & Play Store
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Job Finder Pro – Powered by IAMTECHNI • Package: <code className="text-emerald-400">in.iamtechni.jobfinderpro</code>
            </p>
          </div>
        </div>

        <button
          onClick={onSwitchToApp}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <span>📱 Open Mobile Simulator</span>
        </button>
      </div>

      {/* Grid of Deliverables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* 1. Android APK Build (Expo EAS) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                1. Build Android Standalone APK (For Direct Phone Install)
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 font-bold text-[10px]">
              EAS Preview
            </span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Run EAS Build with the <code>preview</code> profile to generate a direct <code>.apk</code> installer file for Android devices.
          </p>

          <div className="relative group">
            <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto">
{`# 1. Install EAS CLI globally if not already installed
npm install -g eas-cli

# 2. Navigate to mobile directory
cd mobile

# 3. Log in to Expo account
eas login

# 4. Trigger Android APK build
eas build -p android --profile preview`}
            </pre>
            <button
              onClick={() => handleCopy('apk', `npm install -g eas-cli\ncd mobile\neas login\neas build -p android --profile preview`)}
              className="absolute right-2 top-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              {copiedKey === 'apk' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 2. Android AAB Bundle (Google Play Store) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                2. Build Android Production AAB (Google Play Store)
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-600 font-bold text-[10px]">
              EAS Production
            </span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Generates an optimized Android App Bundle (<code>.aab</code>) signed for distribution via Google Play Console under <code>in.iamtechni.jobfinderpro</code>.
          </p>

          <div className="relative group">
            <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto">
{`# Trigger optimized Android App Bundle (AAB) build
cd mobile
eas build -p android --profile production`}
            </pre>
            <button
              onClick={() => handleCopy('aab', `cd mobile\neas build -p android --profile production`)}
              className="absolute right-2 top-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              {copiedKey === 'aab' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 3. PostgreSQL Database & Prisma ORM */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                3. PostgreSQL & Prisma Database Migration
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 font-bold text-[10px]">
              13 Models
            </span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Schema located at <code>/prisma/schema.prisma</code> containing all 13 models: User, UserProfile, Job, Company, JobSource, SavedJob, JobAlert, Notification, EmployerRequest, AdminUser, Category, UserPreference, AuditLog.
          </p>

          <div className="relative group">
            <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto">
{`# 1. Set PostgreSQL connection in .env
DATABASE_URL="postgresql://user:password@localhost:5432/jobfinderpro"

# 2. Run Prisma migration
npx prisma migrate dev --name init_job_finder_pro

# 3. Generate Prisma Client
npx prisma generate`}
            </pre>
            <button
              onClick={() => handleCopy('db', `DATABASE_URL="postgresql://user:password@localhost:5432/jobfinderpro"\nnpx prisma migrate dev --name init_job_finder_pro\nnpx prisma generate`)}
              className="absolute right-2 top-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              {copiedKey === 'db' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 4. Google OAuth Configuration Guide */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                4. Google OAuth & Firebase Push Setup
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-600 font-bold text-[10px]">
              Auth & FCM
            </span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Google Cloud Console OAuth 2.0 Client credentials:
          </p>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 space-y-1.5">
            <div><strong>Android Client Package:</strong> <code>in.iamtechni.jobfinderpro</code></div>
            <div><strong>SHA-1 Fingerprint:</strong> Obtain from <code>eas credentials</code> or debug keystore</div>
            <div><strong>Web Client ID:</strong> Configured for backend token verification</div>
            <div><strong>FCM Service Account:</strong> Place <code>google-services.json</code> in <code>/mobile/</code></div>
          </div>
        </div>

        {/* 5. Email Configuration Guide */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                5. Email Workflow Configuration
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 font-bold text-[10px]">
              SMTP / Resend
            </span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Employer job posting requests route through configurable administrator email:
          </p>

          <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto">
{`ADMIN_EMAIL=admin@iamtechni.com
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key`}
          </pre>
        </div>

        {/* 6. Production Backend Deployment */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                6. Production Server & Worker Run
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
              Docker / VPS
            </span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Run full-stack server on port 3000 with Express, automated feed worker, and Redis caching.
          </p>

          <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto">
{`npm run build
npm start # runs on 0.0.0.0:3000`}
          </pre>
        </div>
      </div>
    </div>
  );
};
