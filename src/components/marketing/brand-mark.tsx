import type { SVGProps } from "react";

export function BrandMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 32 32"
      {...props}
    >
      <rect fill="currentColor" height="28" rx="9" width="28" x="2" y="2" />
      <path
        d="M10 18.5 14.25 13l3.15 3.65L22 10.5"
        stroke="var(--canvas)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.25"
      />
      <path
        d="M21.9 10.5v4.2"
        stroke="var(--canvas)"
        strokeLinecap="round"
        strokeWidth="2.25"
      />
    </svg>
  );
}

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 font-semibold tracking-[-0.02em]">
      <BrandMark className="text-brand size-7" />
      <span className={compact ? "sr-only sm:not-sr-only" : undefined}>
        AI Career Tracker
      </span>
    </span>
  );
}
