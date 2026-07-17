import Link from "next/link";

import { ArrowRightIcon, CheckIcon } from "./icons";

const highlights = [
  "One focused workspace",
  "Private, user-owned records",
  "Clear deadlines and progress",
];

export function HeroSection() {
  return (
    <section
      className="border-border relative border-b"
      aria-labelledby="hero-title"
    >
      <div aria-hidden="true" className="page-grid absolute inset-0" />
      <div
        aria-hidden="true"
        className="absolute top-8 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-20 lg:px-8 lg:pt-36 lg:pb-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="animate-enter border-border bg-surface/80 text-secondary inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
            <span
              className="bg-brand size-1.5 rounded-full"
              aria-hidden="true"
            />
            A calmer way to manage your job search
          </div>

          <h1
            className="animate-enter animate-enter-delay-1 text-primary mt-7 text-[2.55rem] leading-[1.04] font-semibold tracking-[-0.055em] text-balance sm:text-6xl sm:leading-[1.02] lg:text-[4.75rem]"
            id="hero-title"
          >
            Run a more focused job search, from first save to final decision.
          </h1>

          <p className="animate-enter animate-enter-delay-2 text-secondary mx-auto mt-7 max-w-2xl text-lg leading-8 text-pretty sm:text-xl">
            Organize every opportunity, keep deadlines visible, manage resume
            versions, and understand your progress without scattering sensitive
            career data across disconnected tools.
          </p>

          <div className="animate-enter animate-enter-delay-2 mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              className="text-on-brand group bg-brand hover:bg-brand-strong inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold shadow-[0_8px_28px_rgb(8_145_178_/_0.2)] transition-all duration-150 hover:-translate-y-px sm:w-auto"
              href="/sign-up"
            >
              Create an account
              <ArrowRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
            <Link
              className="border-border bg-surface text-primary hover:border-border-strong hover:bg-surface-muted inline-flex min-h-12 w-full items-center justify-center rounded-lg border px-5 text-sm font-semibold transition-colors duration-150 sm:w-auto"
              href="#product"
            >
              Explore the product
            </Link>
          </div>

          <ul className="text-muted mt-8 flex flex-col items-center justify-center gap-x-6 gap-y-2 text-sm sm:flex-row">
            {highlights.map((highlight) => (
              <li className="flex items-center gap-2" key={highlight}>
                <CheckIcon className="text-brand size-4" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-enter animate-enter-delay-2 relative mx-auto mt-16 max-w-5xl sm:mt-20">
          <div
            aria-hidden="true"
            className="absolute -inset-5 rounded-[2rem] bg-gradient-to-b from-cyan-400/10 to-transparent blur-2xl"
          />
          <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-[var(--preview-shell)] p-2 shadow-[0_28px_80px_rgb(2_6_23_/_0.28)] sm:p-3">
            <div className="flex items-center justify-between border-b border-[var(--preview-border)] px-3 py-2.5 sm:px-4">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-slate-600" />
                <span className="size-2.5 rounded-full bg-slate-600" />
                <span className="size-2.5 rounded-full bg-slate-600" />
              </div>
              <span className="font-mono text-[10px] tracking-[0.14em] text-slate-400 uppercase">
                Demo workspace
              </span>
            </div>
            <div className="grid gap-3 p-3 sm:p-4 md:grid-cols-[1fr_1.45fr]">
              <div className="rounded-xl border border-[var(--preview-border)] bg-[var(--preview-panel)] p-5">
                <p className="text-xs font-medium text-slate-400">This week</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  Stay close to the work that matters.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-2">
                  {[
                    ["12", "Active"],
                    ["3", "Interviews"],
                    ["2", "Deadlines"],
                  ].map(([value, label]) => (
                    <div
                      className="rounded-lg border border-[var(--preview-border)] bg-slate-950/35 px-3 py-3"
                      key={label}
                    >
                      <p className="text-lg font-semibold text-white">
                        {value}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] text-slate-400">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-[var(--preview-border)] bg-[var(--preview-panel)] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-300">
                    Application momentum
                  </p>
                  <p className="text-[10px] text-slate-500">Last 6 weeks</p>
                </div>
                <div
                  className="mt-8 flex h-28 items-end gap-2 sm:gap-3"
                  aria-hidden="true"
                >
                  {[32, 46, 39, 62, 71, 88].map((height, index) => (
                    <div className="flex h-full flex-1 items-end" key={height}>
                      <div
                        className="w-full rounded-t-sm bg-gradient-to-t from-cyan-800 to-cyan-300"
                        style={{
                          height: `${height}%`,
                          opacity: 0.64 + index * 0.06,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[10px] text-slate-500">
                  Demo data shown for product illustration
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
