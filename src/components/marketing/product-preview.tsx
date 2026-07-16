"use client";

import { useState, type KeyboardEvent } from "react";

import { CheckIcon, ClockIcon, SparkIcon } from "./icons";
import { SectionHeading } from "./section-heading";

type Preview = "pipeline" | "resume" | "interview";

const tabs: { id: Preview; label: string }[] = [
  { id: "pipeline", label: "Pipeline" },
  { id: "resume", label: "Resume match" },
  { id: "interview", label: "Interview prep" },
];

const columns = [
  {
    title: "Saved",
    count: 2,
    cards: [
      { company: "Northstar Labs", role: "Product Designer", meta: "Remote" },
      { company: "Acme Systems", role: "UX Engineer", meta: "La Paz · Hybrid" },
    ],
  },
  {
    title: "Applied",
    count: 2,
    cards: [
      {
        company: "Orbit",
        role: "Senior Product Designer",
        meta: "Applied Jul 12",
      },
      {
        company: "Halcyon",
        role: "Design Systems Lead",
        meta: "Applied Jul 09",
      },
    ],
  },
  {
    title: "Interview",
    count: 1,
    cards: [
      {
        company: "Vela",
        role: "Staff Product Designer",
        meta: "Tomorrow · 10:30",
      },
    ],
  },
];

function PipelinePreview() {
  return (
    <div className="animate-preview grid min-w-[760px] grid-cols-3 gap-3 p-4 sm:p-5">
      {columns.map((column) => (
        <section
          className="rounded-xl bg-slate-950/35 p-3"
          key={column.title}
          aria-label={`${column.title} applications`}
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <h3 className="text-xs font-medium text-slate-300">
              {column.title}
            </h3>
            <span className="rounded-md bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
              {column.count}
            </span>
          </div>
          <div className="space-y-2">
            {column.cards.map((card) => (
              <article
                className="rounded-lg border border-[var(--preview-border)] bg-[var(--preview-panel)] p-3.5"
                key={card.company}
              >
                <div className="flex items-center gap-2.5">
                  <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-800 text-xs font-semibold text-slate-300">
                    {card.company.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-white">
                      {card.company}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-400">
                      {card.role}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500">
                  <ClockIcon className="size-3" />
                  {card.meta}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ResumePreview() {
  const keywords = ["Design systems", "User research", "Prototyping", "Figma"];

  return (
    <div className="animate-preview grid gap-4 p-4 sm:p-5 lg:grid-cols-[0.8fr_1.2fr]">
      <section
        className="rounded-xl border border-[var(--preview-border)] bg-slate-950/35 p-5"
        aria-label="Example resume score"
      >
        <p className="font-mono text-[10px] tracking-[0.14em] text-cyan-300 uppercase">
          Example match
        </p>
        <div className="mt-5 flex items-end gap-2">
          <span className="text-5xl font-semibold tracking-[-0.06em] text-white">
            82
          </span>
          <span className="pb-1 text-sm text-slate-400">/ 100</span>
        </div>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-[82%] rounded-full bg-cyan-300" />
        </div>
        <p className="mt-5 text-xs leading-5 text-slate-400">
          Strong foundation. Make your systems work more explicit and add one
          measurable collaboration outcome.
        </p>
      </section>

      <section
        className="rounded-xl border border-[var(--preview-border)] bg-[var(--preview-panel)] p-5"
        aria-label="Example resume suggestions"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-white">
          <SparkIcon className="size-4 text-violet-300" />
          Evidence found in your resume
        </div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {keywords.map((keyword) => (
            <li
              className="flex items-center gap-2 rounded-lg border border-[var(--preview-border)] bg-slate-950/30 px-3 py-2.5 text-[11px] text-slate-300"
              key={keyword}
            >
              <CheckIcon className="size-3.5 text-cyan-300" />
              {keyword}
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-lg border border-violet-400/20 bg-violet-400/5 p-3">
          <p className="text-[11px] leading-5 text-violet-200">
            AI draft · Review every suggestion. Skills and outcomes are never
            added unless they appear in your source material.
          </p>
        </div>
      </section>
    </div>
  );
}

function InterviewPreview() {
  const questions = [
    "How have you helped a design system earn adoption across teams?",
    "Tell me about a time research changed your product direction.",
    "How do you balance craft quality with a fixed delivery date?",
  ];

  return (
    <div className="animate-preview grid gap-4 p-4 sm:p-5 lg:grid-cols-[1.2fr_0.8fr]">
      <section
        className="rounded-xl border border-[var(--preview-border)] bg-[var(--preview-panel)] p-5"
        aria-label="Example interview questions"
      >
        <p className="text-xs font-medium text-white">
          Questions shaped by the role
        </p>
        <ol className="mt-4 space-y-2.5">
          {questions.map((question, index) => (
            <li
              className="flex gap-3 rounded-lg border border-[var(--preview-border)] bg-slate-950/30 p-3"
              key={question}
            >
              <span className="font-mono text-[10px] text-cyan-300">
                0{index + 1}
              </span>
              <span className="text-[11px] leading-5 text-slate-300">
                {question}
              </span>
            </li>
          ))}
        </ol>
      </section>
      <aside className="rounded-xl border border-[var(--preview-border)] bg-slate-950/35 p-5">
        <p className="font-mono text-[10px] tracking-[0.14em] text-violet-300 uppercase">
          Practice focus
        </p>
        <p className="mt-4 text-lg font-semibold tracking-tight text-white">
          Design systems leadership
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          Drawn from the responsibilities and qualifications in this demo role.
        </p>
        <div className="mt-5 space-y-2 text-[11px] text-slate-300">
          {[
            "Choose a specific example",
            "Explain your decisions",
            "Close with the outcome",
          ].map((item) => (
            <div className="flex items-center gap-2" key={item}>
              <CheckIcon className="size-3.5 text-violet-300" />
              {item}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

export function ProductPreview() {
  const [activePreview, setActivePreview] = useState<Preview>("pipeline");

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    tabId: Preview,
  ) {
    const currentIndex = tabs.findIndex((tab) => tab.id === tabId);
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight")
      nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;

    if (nextIndex === null) return;

    event.preventDefault();
    const nextTab = tabs[nextIndex];
    setActivePreview(nextTab.id);
    document.getElementById(`preview-tab-${nextTab.id}`)?.focus();
  }

  return (
    <section
      className="border-border bg-surface-muted/50 border-y py-24 sm:py-28 lg:py-36"
      id="product"
      aria-labelledby="product-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="product-title">
          <SectionHeading
            description="Switch between three parts of the product. Everything below is static demo data designed to show how the workspace stays clear and connected."
            eyebrow="A connected workspace"
            title="See the opportunity. Understand the next move."
          />
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-700/80 bg-[var(--preview-shell)] shadow-[0_28px_80px_rgb(2_6_23_/_0.2)] lg:mt-16">
          <div className="flex flex-col gap-4 border-b border-[var(--preview-border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <p className="text-sm font-medium text-white">Demo workspace</p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Static product preview
              </p>
            </div>
            <div
              className="flex overflow-x-auto rounded-lg border border-[var(--preview-border)] bg-slate-950/45 p-1"
              role="tablist"
              aria-label="Product preview views"
            >
              {tabs.map((tab) => {
                const isActive = activePreview === tab.id;
                return (
                  <button
                    aria-controls={`preview-panel-${tab.id}`}
                    aria-selected={isActive}
                    className={`min-h-9 shrink-0 rounded-md px-3 text-xs font-medium transition-colors duration-150 ${isActive ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
                    id={`preview-tab-${tab.id}`}
                    key={tab.id}
                    onClick={() => setActivePreview(tab.id)}
                    onKeyDown={(event) => handleTabKeyDown(event, tab.id)}
                    role="tab"
                    tabIndex={isActive ? 0 : -1}
                    type="button"
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            aria-labelledby="preview-tab-pipeline"
            className="overflow-x-auto"
            hidden={activePreview !== "pipeline"}
            id="preview-panel-pipeline"
            role="tabpanel"
            tabIndex={activePreview === "pipeline" ? 0 : -1}
          >
            <PipelinePreview />
          </div>
          <div
            aria-labelledby="preview-tab-resume"
            hidden={activePreview !== "resume"}
            id="preview-panel-resume"
            role="tabpanel"
            tabIndex={activePreview === "resume" ? 0 : -1}
          >
            <ResumePreview />
          </div>
          <div
            aria-labelledby="preview-tab-interview"
            hidden={activePreview !== "interview"}
            id="preview-panel-interview"
            role="tabpanel"
            tabIndex={activePreview === "interview" ? 0 : -1}
          >
            <InterviewPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
