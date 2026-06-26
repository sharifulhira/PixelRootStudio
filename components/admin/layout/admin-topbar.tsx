"use client";

import { getPageTitle, getPageGroup } from "./nav-config";

type Props = {
  pathname: string;
  onLogout: () => void;
  onMenuToggle: () => void;
};

export function AdminTopbar({ pathname, onLogout, onMenuToggle }: Props) {
  const pageTitle = getPageTitle(pathname);
  const pageGroup = getPageGroup(pathname);

  return (
    <header className="sticky top-0 z-20 shrink-0 bg-slate-950/95 backdrop-blur-sm border-b border-white/5 print:hidden">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 text-white/70 hover:text-white rounded-lg"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Page title / breadcrumb */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="hidden sm:inline text-xs text-white/35">CMS</span>
          {pageGroup && (
            <>
              <span className="hidden sm:inline text-white/20">/</span>
              <span className="hidden sm:inline text-xs text-white/45">{pageGroup}</span>
            </>
          )}
          <span className="hidden sm:inline text-white/20">/</span>
          <h1 className="text-sm font-semibold text-white truncate">{pageTitle}</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Site
          </a>
          <button
            type="button"
            onClick={onLogout}
            className="p-2 text-white/50 hover:text-red-400 rounded-lg transition-colors"
            title="Sign out"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
