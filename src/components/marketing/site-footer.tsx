import Link from "next/link";

import { BrandLockup } from "@/components/ui/brand-mark";

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "Product preview", href: "#product" },
  { label: "Benefits", href: "#benefits" },
  { label: "Sign in", href: "/sign-in" },
];

export function SiteFooter() {
  return (
    <footer
      className="border-border bg-surface border-t"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Link
              aria-label="AI Career Tracker home"
              className="inline-flex rounded-md"
              href="/"
            >
              <BrandLockup />
            </Link>
            <p className="text-secondary mt-4 text-sm leading-6">
              A focused workspace for applications, career materials, and
              interview preparation.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:flex sm:gap-6">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-secondary hover:text-primary rounded transition-colors"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-border text-muted mt-12 flex flex-col gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AI Career Tracker.</p>
          <p>Built for thoughtful, factual career progress.</p>
        </div>
      </div>
    </footer>
  );
}
