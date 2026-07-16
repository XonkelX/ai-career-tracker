import Link from "next/link";
import type { ReactNode } from "react";

import { AppNav } from "./app-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <a
        className="sr-only z-50 rounded-md bg-white px-4 py-2 text-slate-950 focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:outline-2 focus:outline-offset-2 focus:outline-cyan-600"
        href="#main-content"
      >
        Skip to main content
      </a>
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link className="font-semibold tracking-tight" href="/dashboard">
            AI Career Tracker
          </Link>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
            Foundation preview
          </span>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl md:grid-cols-[220px_1fr]">
        <aside className="border-b border-slate-200 p-4 md:min-h-[calc(100vh-65px)] md:border-r md:border-b-0 dark:border-slate-800">
          <AppNav />
        </aside>
        <main className="min-w-0 p-6 md:p-10" id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
