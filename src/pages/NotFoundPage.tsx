import React from 'react';
import { ArrowRight, Compass, Home, Search, HelpCircle, Layers } from 'lucide-react';
import { PageRoute } from '../types';

interface NotFoundPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F0F5FF] via-[#F8FAFF] to-[#FFFFFF]">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#1266E8]">
          <Compass className="w-3.5 h-3.5" />
          <span>Error 404 // Route Not Found</span>
        </div>

        <div className="space-y-3">
          <div className="text-7xl sm:text-8xl font-black text-slate-900 tracking-tight font-mono">
            404
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            This page does not exist in the IAMTECHNI directory.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            The link you followed may be outdated, moved, or mistyped. Explore our primary technology practices and company resources below.
          </p>
        </div>

        {/* Quick Sitelink Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto">
          <button
            onClick={() => onNavigate('/')}
            className="p-3.5 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 transition-all text-xs font-semibold text-slate-800 flex items-center justify-between group shadow-2xs"
          >
            <span>Home</span>
            <Home className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1266E8]" />
          </button>
          <button
            onClick={() => onNavigate('/services')}
            className="p-3.5 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 transition-all text-xs font-semibold text-slate-800 flex items-center justify-between group shadow-2xs"
          >
            <span>Services (17)</span>
            <Layers className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1266E8]" />
          </button>
          <button
            onClick={() => onNavigate('/industries')}
            className="p-3.5 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 transition-all text-xs font-semibold text-slate-800 flex items-center justify-between group shadow-2xs"
          >
            <span>Industries</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1266E8]" />
          </button>
          <button
            onClick={() => onNavigate('/portfolio')}
            className="p-3.5 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 transition-all text-xs font-semibold text-slate-800 flex items-center justify-between group shadow-2xs"
          >
            <span>Portfolio</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1266E8]" />
          </button>
          <button
            onClick={() => onNavigate('/insights')}
            className="p-3.5 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 transition-all text-xs font-semibold text-slate-800 flex items-center justify-between group shadow-2xs"
          >
            <span>Insights</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1266E8]" />
          </button>
          <button
            onClick={() => onNavigate('/contact')}
            className="p-3.5 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 transition-all text-xs font-semibold text-slate-800 flex items-center justify-between group shadow-2xs"
          >
            <span>Contact</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1266E8]" />
          </button>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
