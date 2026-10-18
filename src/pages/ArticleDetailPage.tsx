import React, { useState } from 'react';
import { ArrowLeft, Clock, Share2, Check, BookOpen, ArrowRight, User } from 'lucide-react';
import { PageRoute, ArticleItem } from '../types';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { insightsData } from '../data/insightsData';

interface ArticleDetailPageProps {
  article: ArticleItem;
  onNavigate: (route: PageRoute) => void;
  onStartProject: () => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  article,
  onNavigate,
  onStartProject,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relatedArticles = insightsData.filter((a) =>
    article.relatedArticles.includes(a.slug)
  );

  return (
    <div className="w-full">
      <Breadcrumbs
        items={[
          { label: 'Insights', route: '/insights' },
          { label: article.title },
        ]}
        onNavigate={onNavigate}
      />

      {/* Article Header */}
      <section className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="text-[#1266E8] font-bold uppercase">{article.category}</span>
              <span>·</span>
              <span>{article.readTime}</span>
              <span>·</span>
              <span>{article.publishedDate}</span>
            </div>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs text-slate-700 transition-colors"
              aria-label="Copy article link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share Article'}</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            {article.title}
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed font-normal">
            {article.excerpt}
          </p>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              IT
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{article.author.name}</div>
              <div className="text-[11px] text-slate-500">{article.author.role}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body & Table of Contents Layout */}
      <section className="py-16 bg-[#F5F7FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Article Prose (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-8 shadow-2xs space-y-8">
            {article.sections.map((sec) => (
              <div key={sec.id} id={sec.id} className="space-y-4 scroll-mt-24">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 pt-2 border-t border-slate-100 first:border-0 first:pt-0">
                  {sec.heading}
                </h2>

                {sec.body.map((paragraph, pIdx) => (
                  <p key={pIdx} className="text-sm text-slate-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}

                {sec.codeSnippet && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-slate-800 bg-[#0A0D14] text-slate-200">
                    <div className="bg-[#101622] px-4 py-2 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                      <span>{sec.codeSnippet.language.toUpperCase()}</span>
                      <span className="text-[#04C8E8]">IAMTECHNI_SPEC</span>
                    </div>
                    <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                      <code>{sec.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar: Table of Contents & Sticky Consultation (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Table of Contents */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-3">
                Table of Contents
              </h3>
              <nav className="space-y-2">
                {article.tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-xs text-slate-600 hover:text-[#1266E8] transition-colors leading-snug py-0.5"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Consultation Callout */}
            <div className="bg-[#080B11] text-white border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="text-[11px] font-mono text-[#04C8E8] uppercase tracking-wider">
                ENGINEERING PRACTICE
              </div>
              <h4 className="text-base font-bold text-white">
                Need to implement this architecture?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our senior engineering team can audit your existing system and build custom implementations with verified benchmarks.
              </p>
              <button
                onClick={onStartProject}
                className="w-full py-2.5 bg-gradient-to-r from-[#1266E8] to-[#5427D9] text-white text-xs font-semibold rounded-xl hover:opacity-95 transition-opacity"
              >
                Discuss Technical Scope
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles Strip */}
      {relatedArticles.length > 0 && (
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Related Engineering Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <article
                  key={rel.slug}
                  onClick={() => onNavigate(`/insights/${rel.slug}` as PageRoute)}
                  className="bg-[#FAFBFD] border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="text-xs font-mono text-[#1266E8] font-semibold mb-2">
                      {rel.category}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1266E8] transition-colors mb-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{rel.excerpt}</p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                    <span>{rel.readTime}</span>
                    <span className="text-[#1266E8] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
