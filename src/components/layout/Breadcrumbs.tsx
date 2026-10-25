import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { PageRoute } from '../../types';

interface BreadcrumbsProps {
  items: {
    label: string;
    route?: PageRoute;
  }[];
  onNavigate: (route: PageRoute) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs sm:text-[13px] text-slate-500 font-medium">
        <li>
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1 py-1 hover:text-[#1266E8] transition-colors focus:outline-hidden cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 shrink-0" />
            <span>Home</span>
          </button>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <li aria-hidden="true" className="text-slate-300">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li className="min-w-0">
                {isLast || !item.route ? (
                  <span className="text-slate-900 font-semibold break-words" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <button
                    onClick={() => item.route && onNavigate(item.route)}
                    className="py-1 hover:text-[#1266E8] transition-colors focus:outline-hidden cursor-pointer text-left"
                  >
                    {item.label}
                  </button>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
