import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/applications", label: "Applications" },
  { href: "/resumes", label: "Resumes" },
  { href: "/ai-tools", label: "AI tools" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
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
          <nav aria-label="Dashboard navigation">
            <ul className="flex gap-2 overflow-x-auto md:flex-col">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    className="block rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="min-w-0 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
