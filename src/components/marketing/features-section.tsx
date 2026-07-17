import type { ComponentType, SVGProps } from "react";

import { PipelineIcon, SparkIcon, TargetIcon } from "./icons";
import { SectionHeading } from "./section-heading";

type Feature = {
  title: string;
  description: string;
  detail: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  tone: "brand" | "accent" | "neutral";
};

const features: Feature[] = [
  {
    title: "A pipeline you can trust",
    description:
      "Move applications from saved to offer with clear ownership of every detail, deadline, and next step.",
    detail: "Kanban and table views",
    icon: PipelineIcon,
    tone: "brand",
  },
  {
    title: "Deadlines that stay visible",
    description:
      "See upcoming deadlines and recently updated opportunities before important next steps slip through the cracks.",
    detail: "Upcoming and overdue dates",
    icon: SparkIcon,
    tone: "accent",
  },
  {
    title: "Resume versions with context",
    description:
      "Keep named resume versions organized and record exactly which version was used for each application.",
    detail: "Owned version history",
    icon: TargetIcon,
    tone: "neutral",
  },
];

const toneClasses = {
  brand: "bg-brand-soft text-brand",
  accent:
    "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-200",
  neutral: "bg-surface-muted text-secondary",
};

export function FeaturesSection() {
  return (
    <section
      className="py-24 sm:py-28 lg:py-36"
      id="features"
      aria-labelledby="features-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="features-title">
          <SectionHeading
            align="center"
            description="Bring applications, deadlines, resume versions, and progress into one thoughtful system that remains clear as your search grows."
            eyebrow="Built for the whole search"
            title="Less tab switching. More deliberate progress."
          />
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3 lg:mt-16 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                className="group border-border bg-surface hover:border-border-strong relative overflow-hidden rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgb(15_23_42_/_0.08)] sm:p-7"
                key={feature.title}
              >
                <span
                  aria-hidden="true"
                  className="text-surface-muted absolute top-0 right-5 font-mono text-[5rem] leading-none font-semibold tracking-tighter select-none"
                >
                  0{index + 1}
                </span>
                <div
                  className={`relative grid size-11 place-items-center rounded-xl ${toneClasses[feature.tone]}`}
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="text-primary relative mt-10 text-xl font-semibold tracking-[-0.025em]">
                  {feature.title}
                </h3>
                <p className="text-secondary relative mt-3 leading-7 text-pretty">
                  {feature.description}
                </p>
                <div className="border-border text-muted relative mt-8 border-t pt-4 font-mono text-[11px] tracking-[0.1em] uppercase">
                  {feature.detail}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
