import React, { useState, useEffect } from 'react';
import { SeoHead } from '../../components/common/SeoHead';
import { MobileFrame } from '../../components/job-finder/MobileFrame';
import { WebMobileApp } from '../../components/job-finder/WebMobileApp';
import { AdminDashboardView } from '../../components/job-finder/AdminDashboardView';
import { BuildAndExportHub } from '../../components/job-finder/BuildAndExportHub';
import { Smartphone, Monitor, Shield, FileCode2, Sparkles, Check } from 'lucide-react';

export const JobFinderProPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'PHONE' | 'FULL_SCREEN' | 'ADMIN' | 'BUILD_HUB'>('PHONE');
  const [themeMode, setThemeMode] = useState<'SYSTEM' | 'LIGHT' | 'DARK'>('SYSTEM');
  const [systemIsDark, setSystemIsDark] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Android System Theme Auto-Detection (Section 4)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setSystemIsDark(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => {
        setSystemIsDark(e.matches);
      };

      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  const isDark =
    themeMode === 'DARK' || (themeMode === 'SYSTEM' && systemIsDark);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-100/70 text-slate-900'}`}>
      <SeoHead currentRoute="/job-finder-pro" />

      {/* Top Application Switcher Bar */}
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-base font-black shadow-xs">
              💼
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white">
                  Job Finder Pro
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase">
                  Powered by IAMTECHNI
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                in.iamtechni.jobfinderpro • Android 15 Ready
              </span>
            </div>
          </div>

          {/* View Mode Navigation Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('PHONE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'PHONE'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android Phone</span>
            </button>
            <button
              onClick={() => setViewMode('FULL_SCREEN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'FULL_SCREEN'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </button>
            <button
              onClick={() => setViewMode('ADMIN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'ADMIN'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Admin Portal</span>
            </button>
            <button
              onClick={() => setViewMode('BUILD_HUB')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'BUILD_HUB'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>APK Build Hub</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <div className="pb-16">
        {viewMode === 'PHONE' && (
          <MobileFrame
            key={resetKey}
            themeMode={themeMode}
            onThemeModeChange={setThemeMode}
            isDark={isDark}
            onResetApp={() => setResetKey((k) => k + 1)}
            onOpenAdmin={() => setViewMode('ADMIN')}
            onOpenBuildHub={() => setViewMode('BUILD_HUB')}
          >
            <WebMobileApp
              isDark={isDark}
              themeMode={themeMode}
              onThemeModeChange={setThemeMode}
              onOpenAdminPortal={() => setViewMode('ADMIN')}
            />
          </MobileFrame>
        )}

        {viewMode === 'FULL_SCREEN' && (
          <div className="max-w-md mx-auto min-h-[820px] my-6 shadow-2xl rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <WebMobileApp
              key={resetKey}
              isDark={isDark}
              themeMode={themeMode}
              onThemeModeChange={setThemeMode}
              onOpenAdminPortal={() => setViewMode('ADMIN')}
            />
          </div>
        )}

        {viewMode === 'ADMIN' && (
          <AdminDashboardView onSwitchToApp={() => setViewMode('PHONE')} />
        )}

        {viewMode === 'BUILD_HUB' && (
          <BuildAndExportHub onSwitchToApp={() => setViewMode('PHONE')} />
        )}
      </div>
    </div>
  );
};
