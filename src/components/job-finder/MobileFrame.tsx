import React, { useState, useEffect } from 'react';
import { Smartphone, Moon, Sun, Monitor, RotateCcw, Shield, FileCode2 } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  themeMode: 'SYSTEM' | 'LIGHT' | 'DARK';
  onThemeModeChange: (mode: 'SYSTEM' | 'LIGHT' | 'DARK') => void;
  isDark: boolean;
  onResetApp: () => void;
  onOpenAdmin: () => void;
  onOpenBuildHub: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  themeMode,
  onThemeModeChange,
  isDark,
  onResetApp,
  onOpenAdmin,
  onOpenBuildHub,
}) => {
  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4">
      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 max-w-md w-full mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
            Job Finder Pro <span className="text-blue-600 font-extrabold">• IAMTECHNI</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => onThemeModeChange('SYSTEM')}
            title="Auto-detect System Theme"
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              themeMode === 'SYSTEM'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">System</span>
          </button>
          <button
            onClick={() => onThemeModeChange('LIGHT')}
            title="Force Light Theme"
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              themeMode === 'LIGHT'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Light</span>
          </button>
          <button
            onClick={() => onThemeModeChange('DARK')}
            title="Force Dark Theme"
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              themeMode === 'DARK'
                ? 'bg-slate-700 text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dark</span>
          </button>
        </div>
      </div>

      {/* Android Device Shell */}
      <div className="relative w-full max-w-[390px] h-[810px] rounded-[48px] p-3 bg-slate-900 shadow-2xl shadow-blue-900/20 ring-1 ring-slate-800 flex flex-col transition-all">
        {/* Device Perimeter Accent / Antennas */}
        <div className="absolute top-24 -left-1 w-1 h-8 bg-slate-700 rounded-l-xs" />
        <div className="absolute top-36 -left-1 w-1 h-12 bg-slate-700 rounded-l-xs" />
        <div className="absolute top-32 -right-1 w-1 h-14 bg-slate-700 rounded-r-xs" />

        {/* Screen Display Container */}
        <div
          className={`relative flex-1 w-full h-full rounded-[38px] overflow-hidden flex flex-col select-none transition-colors duration-200 ${
            isDark ? 'bg-[#090d16] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
          }`}
        >
          {/* Android Status Bar */}
          <div
            className={`h-9 px-6 flex items-center justify-between text-[11px] font-semibold shrink-0 z-30 transition-colors ${
              isDark ? 'text-slate-200' : 'text-slate-700'
            }`}
          >
            <span>{currentTime}</span>

            {/* Camera Punch-Hole */}
            <div className="w-4 h-4 rounded-full bg-black ring-1 ring-slate-800/60 shrink-0" />

            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span>📶</span>
              <span>🔋 98%</span>
            </div>
          </div>

          {/* Mobile Screen Body */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
            {children}
          </div>

          {/* Android Gesture Bar */}
          <div className="h-4.5 w-full flex items-center justify-center shrink-0 z-30 pointer-events-none">
            <div
              className={`w-32 h-1 rounded-full transition-colors ${
                isDark ? 'bg-slate-700' : 'bg-slate-300'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Quick Action Dock Under Phone */}
      <div className="flex items-center justify-center gap-3 mt-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
        <button
          onClick={onResetApp}
          className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Demo
        </button>
        <span>•</span>
        <button
          onClick={onOpenAdmin}
          className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <Shield className="w-3.5 h-3.5 text-blue-600" /> Admin Console
        </button>
        <span>•</span>
        <button
          onClick={onOpenBuildHub}
          className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <FileCode2 className="w-3.5 h-3.5 text-emerald-600" /> APK Build Hub
        </button>
      </div>
    </div>
  );
};
