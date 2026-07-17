import Link from "next/link";

import { BrandLockup, BrandMark } from "@/components/ui/brand-mark";

import { Navigation } from "./navigation";
import { ChevronLeftIcon } from "./shell-icons";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      aria-label="Workspace sidebar"
      className={`border-border bg-surface sticky top-0 hidden h-screen shrink-0 flex-col border-r transition-[width] duration-200 md:flex md:w-20 ${collapsed ? "lg:w-20" : "lg:w-64"}`}
    >
      <div className="border-border flex h-16 shrink-0 items-center border-b px-4">
        <Link
          aria-label="CareerFlow dashboard"
          className="text-primary min-w-0 rounded-md"
          href="/dashboard"
        >
          <span className="lg:hidden">
            <BrandMark className="text-brand size-8" />
          </span>
          <span className={collapsed ? "lg:hidden" : "hidden lg:inline-flex"}>
            <BrandLockup />
          </span>
          {collapsed ? (
            <span className="hidden lg:block">
              <BrandMark className="text-brand size-8" />
            </span>
          ) : null}
        </Link>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 py-5">
        <p
          className={`text-muted mb-3 px-3 font-mono text-[10px] font-medium tracking-[0.14em] uppercase ${collapsed ? "sr-only" : "hidden lg:block"}`}
        >
          Workspace
        </p>
        <Navigation collapsed={collapsed} />

        <div className="border-border mt-auto border-t pt-4">
          <div
            className={`bg-surface-muted rounded-lg ${collapsed ? "p-2" : "p-3 md:p-2 lg:p-3"}`}
          >
            <div className="flex items-center gap-2.5">
              <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
              <div
                className={collapsed ? "sr-only" : "hidden min-w-0 lg:block"}
              >
                <p className="text-primary truncate text-[11px] font-medium">
                  Workspace ready
                </p>
                <p className="text-muted mt-0.5 text-[10px]">Shell preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="border-border bg-surface text-secondary hover:text-primary absolute right-0 bottom-20 hidden size-7 translate-x-1/2 place-items-center rounded-full border shadow-sm transition-colors lg:grid"
        onClick={onToggle}
        type="button"
      >
        <ChevronLeftIcon
          className={`size-3.5 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
        />
      </button>
    </aside>
  );
}
