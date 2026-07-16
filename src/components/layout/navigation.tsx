"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ApplicationsIcon,
  DashboardIcon,
  ResumeIcon,
  SettingsIcon,
  SparkIcon,
  type ShellIcon,
} from "./shell-icons";

type NavigationItem = {
  href: string;
  label: string;
  icon: ShellIcon;
};

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/applications", label: "Applications", icon: ApplicationsIcon },
  { href: "/resumes", label: "Resumes", icon: ResumeIcon },
  { href: "/ai-tools", label: "AI tools", icon: SparkIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function getNavigationLabel(pathname: string) {
  return (
    NAVIGATION_ITEMS.find(
      (item) =>
        pathname === item.href ||
        (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`)),
    )?.label ?? "Workspace"
  );
}

function isNavigationItemActive(pathname: string, href: string) {
  return (
    pathname === href ||
    (href !== "/dashboard" && pathname.startsWith(`${href}/`))
  );
}

type NavigationProps = {
  variant?: "sidebar" | "drawer";
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function Navigation({
  variant = "sidebar",
  collapsed = false,
  onNavigate,
}: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Application navigation">
      <ul className="space-y-1">
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = isNavigationItemActive(pathname, item.href);
          const visuallyCollapsed = collapsed || variant === "sidebar";

          return (
            <li key={item.href}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex min-h-11 items-center rounded-lg text-sm font-medium transition-colors duration-150 ${collapsed ? "justify-center px-2" : "gap-3 px-3"} ${isActive ? "bg-brand-soft text-brand" : "text-secondary hover:bg-surface-muted hover:text-primary"}`}
                href={item.href}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="size-[19px] shrink-0" />
                <span
                  className={
                    collapsed
                      ? "sr-only"
                      : visuallyCollapsed
                        ? "md:sr-only lg:not-sr-only"
                        : undefined
                  }
                >
                  {item.label}
                </span>
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className="bg-brand absolute inset-y-2 left-0 w-0.5 rounded-full"
                  />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
