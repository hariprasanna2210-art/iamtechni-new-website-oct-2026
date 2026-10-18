import React from 'react';
import { PageRoute } from '../types';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'cookie';
  onNavigate: (route: PageRoute) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onNavigate }) => {
  const getPageInfo = () => {
    switch (type) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          tagline: 'How we collect, protect, and respect your personal information.',
          updated: 'October 2026',
        };
      case 'terms':
        return {
          title: 'Terms and Conditions',
          tagline: 'The rules, terms, and agreements governing the use of IAMTECHNI services and website.',
          updated: 'October 2026',
        };
      case 'cookie':
        return {
          title: 'Cookie Policy',
          tagline: 'Information about how we use cookies and browser storage technologies.',
          updated: 'October 2026',
        };
    }
  };

  const info = getPageInfo();

  return (
    <div className="w-full">
      <Breadcrumbs items={[{ label: info.title }]} onNavigate={onNavigate} />

      <section className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-mono font-semibold text-slate-700">
            <span>LEGAL & GOVERNANCE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {info.title}
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">{info.tagline}</p>
          <p className="text-xs text-slate-500 font-mono">
            Last Updated: {info.updated} · Official IAMTECHNI Governance
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#F5F7FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-2xs space-y-8 text-sm text-slate-700 leading-relaxed">
          {type === 'privacy' && (
            <>
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Overview & Commitment</h2>
                <p>
                  IAMTECHNI (“we,” “our,” or “us”) operates the website at{' '}
                  <a href="https://iamtechni.in" className="text-[#1266E8] underline">
                    https://iamtechni.in
                  </a>
                  . We respect the privacy of every client, partner, and visitor. This Privacy Policy details the limited data we collect, how we protect it, and your rights regarding your personal information.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Information We Collect</h2>
                <p className="mb-2">We collect only information voluntarily submitted through our project inquiry and candidate application workflows:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Full name, business email address, company name, and phone number.</li>
                  <li>Project scope descriptions, budget tiers, and technical requirements.</li>
                  <li>Candidate application links, resumes, and portfolio URLs.</li>
                  <li>Technical telemetry (browser type, anonymized IP addresses for security rate-limiting).</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. How Information Is Used</h2>
                <p className="mb-2">We process your information solely for legitimate business operations:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>To evaluate project feasibility and prepare architectural proposals.</li>
                  <li>To respond directly to consultation requests.</li>
                  <li>To evaluate candidate qualifications for open positions.</li>
                  <li>To safeguard our digital infrastructure against brute-force attacks and abuse.</li>
                </ul>
                <p className="mt-2 font-medium text-slate-900">
                  We never sell, rent, or lease your contact information or project specifications to third-party advertisers or data brokers.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. Client Confidentiality & IP</h2>
                <p>
                  All project briefs, proprietary workflows, and business data shared with IAMTECHNI during discovery consultations are treated as strictly confidential under standard non-disclosure terms. Upon milestone completion, clients retain full ownership of custom code, database structures, and assets created for them.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">5. Data Retention & Contact</h2>
                <p>
                  We retain inquiry records only as long as necessary to fulfill project communication or regulatory obligations. To request data deletion or review, contact our privacy officer at{' '}
                  <span className="font-mono text-slate-900">privacy@iamtechni.in</span> or via our official website at{' '}
                  <a href="https://iamtechni.in" className="text-[#1266E8] underline">
                    https://iamtechni.in
                  </a>.
                </p>
              </div>
            </>
          )}

          {type === 'terms' && (
            <>
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Acceptance of Terms</h2>
                <p>
                  By accessing or browsing{' '}
                  <a href="https://iamtechni.in" className="text-[#1266E8] underline">
                    https://iamtechni.in
                  </a>{' '}
                  (“Site”), you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree, you are prohibited from using or accessing this site.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Intellectual Property Rights</h2>
                <p>
                  The IAMTECHNI name, authoritative “it” logo symbol, website code, diagrams, and written articles are the proprietary property of IAMTECHNI and are protected by applicable copyright, trademark, and intellectual property laws. You may not reproduce, redistribute, or reverse-engineer our proprietary brand assets without explicit written authorization.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. Service Proposals & Contracts</h2>
                <p>
                  Content on this website is provided for informational and exploratory purposes. Formal software development, consulting, or cloud management engagements are governed by mutually executed Master Services Agreements (MSAs) and Statements of Work (SOWs) specifying exact deliverables, warranties, and payment terms.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. Disclaimers & Limitation of Liability</h2>
                <p>
                  All architectural concepts, articles, and code snippets are provided on an “as is” basis without warranties of any kind. While we uphold rigorous engineering standards, IAMTECHNI shall not be held liable for any damages arising out of the use or inability to use the informational materials on this site.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">5. Governing Law</h2>
                <p>
                  These Terms are governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. Inquiries regarding these terms may be directed through{' '}
                  <a href="https://iamtechni.in" className="text-[#1266E8] underline">
                    https://iamtechni.in
                  </a>.
                </p>
              </div>
            </>
          )}

          {type === 'cookie' && (
            <>
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. What Are Cookies</h2>
                <p>
                  Cookies are small text files stored on your browser or device when you visit websites. They help websites remember your device preferences, maintain secure sessions, and collect anonymous aggregate performance data.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. How IAMTECHNI Uses Cookies</h2>
                <p className="mb-2">We prioritize user privacy and use a minimal cookie footprint:</p>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block text-xs font-bold uppercase">Strictly Necessary Cookies</strong>
                    <span className="text-xs text-slate-600">Essential for core platform functionality, preventing CSRF attacks, and securing project consultation forms.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block text-xs font-bold uppercase">Performance & Core Web Vitals Telemetry</strong>
                    <span className="text-xs text-slate-600">Anonymized latency metrics that help our engineering team maintain sub-second page performance.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block text-xs font-bold uppercase">Preference Cookies</strong>
                    <span className="text-xs text-slate-600">Temporary localStorage keys to preserve carousel preferences or modal state across browser refreshes.</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. No Third-Party Advertising Trackers</h2>
                <p>
                  IAMTECHNI does not deploy third-party advertising cookies, cross-site pixel trackers, or intrusive data-mining scripts. Your browsing history is never sold or commodified.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. Managing Your Cookie Preferences</h2>
                <p>
                  Most web browsers allow you to control cookie settings through their preferences menu. You can block or delete cookies in Chrome, Safari, Firefox, or Edge. Note that disabling necessary session cookies may impact form submission behavior.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">5. Inquiries</h2>
                <p>
                  If you have questions about our use of cookies or privacy practices, reach us at{' '}
                  <span className="font-mono text-slate-900">privacy@iamtechni.in</span>.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
