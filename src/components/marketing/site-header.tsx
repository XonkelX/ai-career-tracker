import Link from "next/link";
import { cookies } from "next/headers";

import { isTheme } from "@/lib/theme";
import { BrandLockup } from "@/components/ui/brand-mark";

import { ThemeToggle } from "./theme-toggle";

const navigation = [
  { label: "Features", href: "#features" },
  { label: "Product", href: "#product" },
  { label: "Why it works", href: "#benefits" },
];

export async function SiteHeader() {
  const themeCookie = (await cookies()).get("theme")?.value;
  const initialTheme = isTheme(themeCookie) ? themeCookie : undefined;

  return (
    <header className="border-border/80 sticky top-0 z-50 border-b bg-[var(--header)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">
        <Link
          aria-label="CareerFlow home"
          className="text-primary rounded-md"
          href="/"
        >
          <BrandLockup compact />
        </Link>

        <nav aria-label="Primary navigation" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  className="text-secondary hover:bg-surface-muted hover:text-primary block rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-150"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle initialTheme={initialTheme} />
          <Link
            className="text-secondary hover:text-primary hidden rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors sm:block"
            href="/sign-in"
          >
            Sign in
          </Link>
          <Link
            className="text-on-inverse bg-primary inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold transition-transform duration-150 hover:-translate-y-px"
            href="/sign-up"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
