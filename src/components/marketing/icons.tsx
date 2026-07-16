import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </IconBase>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m5 12 4 4L19 6" />
    </IconBase>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8a8.5 8.5 0 1 0 11.3 11.3Z" />
    </IconBase>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </IconBase>
  );
}

export function PipelineIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect height="15" rx="2" width="18" x="3" y="5" />
      <path d="M9 5v15M15 5v15M5.5 9h1M11.5 13h1M17.5 9h1" />
    </IconBase>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3 1.2 4.2A5 5 0 0 0 16.8 11L21 12l-4.2 1.2a5 5 0 0 0-3.6 3.6L12 21l-1.2-4.2a5 5 0 0 0-3.6-3.6L3 12l4.2-1.2a5 5 0 0 0 3.6-3.6L12 3Z" />
    </IconBase>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="m15 9 5-5M16 4h4v4" />
    </IconBase>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </IconBase>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3 5 6v5c0 4.6 2.8 8.1 7 10 4.2-1.9 7-5.4 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </IconBase>
  );
}

export function TrendIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m4 17 5-5 4 3 7-8" />
      <path d="M15 7h5v5" />
    </IconBase>
  );
}
