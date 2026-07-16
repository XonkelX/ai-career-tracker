import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  action?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className="text-brand font-mono text-xs font-medium tracking-[0.16em] uppercase">
        {eyebrow}
      </p>
      <h2 className="text-primary mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </h2>
      <p className="text-secondary mt-5 text-base leading-7 text-pretty sm:text-lg">
        {description}
      </p>
      {action}
    </div>
  );
}
