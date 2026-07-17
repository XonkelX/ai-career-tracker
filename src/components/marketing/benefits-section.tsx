import Link from "next/link";

import {
  ArrowRightIcon,
  ClockIcon,
  ShieldIcon,
  SparkIcon,
  TrendIcon,
} from "./icons";
import { SectionHeading } from "./section-heading";

const benefits = [
  {
    title: "Keep your attention on the next step",
    description:
      "Deadlines, recent activity, and follow-ups stay visible without turning your workspace into noise.",
    icon: ClockIcon,
  },
  {
    title: "Keep career data under your ownership",
    description:
      "Every application and resume version is scoped to your authenticated account with privacy-conscious defaults.",
    icon: ShieldIcon,
  },
  {
    title: "Learn from your own progress",
    description:
      "Understand movement across your pipeline and spot where your search deserves more attention.",
    icon: TrendIcon,
  },
  {
    title: "Find the right opportunity quickly",
    description:
      "Search by company or role and combine status, salary, and deadline filters without moving data into the browser.",
    icon: SparkIcon,
  },
];

export function BenefitsSection() {
  return (
    <section
      className="py-24 sm:py-28 lg:py-36"
      id="benefits"
      aria-labelledby="benefits-title"
    >
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
        <div className="lg:sticky lg:top-32 lg:self-start" id="benefits-title">
          <SectionHeading
            description="CareerFlow is designed around one principle: the product should help you understand and manage your search without making the process feel heavier."
            eyebrow="Quietly useful by design"
            title="More clarity, without more process."
            action={
              <Link
                className="group text-brand mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold"
                href="/sign-up"
              >
                Start organizing your search
                <ArrowRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            }
          />
        </div>

        <div className="border-border bg-border grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <article
                className="bg-surface p-6 sm:min-h-64 sm:p-8"
                key={benefit.title}
              >
                <div className="border-border bg-surface-muted text-brand grid size-10 place-items-center rounded-lg border">
                  <Icon className="size-[18px]" />
                </div>
                <h3 className="text-primary mt-8 text-lg font-semibold tracking-[-0.025em]">
                  {benefit.title}
                </h3>
                <p className="text-secondary mt-3 text-sm leading-6 text-pretty">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
