"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

import {
  INITIAL_RESUME_ASSOCIATION_STATE,
  type ResumeAssociationActionState,
} from "@/features/resumes/resume-version-state";
import type { ResumeVersionOption } from "@/server/resumes/resume-versions";

type AssociationAction = (
  previousState: ResumeAssociationActionState,
  formData: FormData,
) => Promise<ResumeAssociationActionState>;

export function ApplicationResumeAssociation({
  action,
  currentResumeVersionId,
  options,
  optionsError = false,
  successMessage,
}: {
  action: AssociationAction;
  currentResumeVersionId: string | null;
  options: ResumeVersionOption[];
  optionsError?: boolean;
  successMessage?: string;
}) {
  const [state, formAction, isPending] = useActionState(
    action,
    INITIAL_RESUME_ASSOCIATION_STATE,
  );
  const messageRef = useRef<HTMLParagraphElement>(null);
  const [selectedResumeVersionId, setSelectedResumeVersionId] = useState(
    currentResumeVersionId ?? "",
  );

  useEffect(() => {
    if (state.status === "error" || successMessage) {
      messageRef.current?.focus();
    }
  }, [state.status, successMessage]);

  return (
    <section
      aria-labelledby="resume-association-title"
      className="border-border bg-surface mt-8 rounded-xl border p-5 sm:p-8"
    >
      <h2
        className="text-primary text-xl font-semibold"
        id="resume-association-title"
      >
        Associated resume
      </h2>
      <p className="text-secondary mt-2 text-sm">
        Record which resume version you used for this opportunity.
      </p>
      <form
        action={formAction}
        className="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-end"
      >
        <div className="w-full flex-1">
          <label
            className="text-primary text-sm font-semibold"
            htmlFor="resumeVersionId"
          >
            Resume version
          </label>
          <select
            className="border-border bg-canvas text-primary mt-2 min-h-11 w-full rounded-lg border px-3 py-2"
            id="resumeVersionId"
            name="resumeVersionId"
            disabled={optionsError || isPending}
            onChange={(event) => setSelectedResumeVersionId(event.target.value)}
            value={selectedResumeVersionId}
          >
            <option value="">No resume associated</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name} — {option.versionLabel} (Version {option.version})
              </option>
            ))}
          </select>
        </div>
        <button
          className="min-h-11 rounded-lg bg-cyan-600 px-5 text-sm font-semibold text-white disabled:opacity-60"
          disabled={optionsError || isPending}
          type="submit"
        >
          {isPending ? "Saving association…" : "Save association"}
        </button>
      </form>
      {optionsError ? (
        <p className="mt-4 text-sm text-red-700 dark:text-red-300" role="alert">
          We could not load your resume versions. Please try again.
        </p>
      ) : options.length === 0 ? (
        <p className="text-secondary mt-4 text-sm">
          You have no saved resume versions.{" "}
          <Link
            className="font-semibold text-cyan-700 underline dark:text-cyan-300"
            href="/resumes/new"
          >
            Add one
          </Link>
          .
        </p>
      ) : null}
      {state.status === "error" ? (
        <p
          className={
            state.status === "error"
              ? "mt-4 text-sm text-red-700 dark:text-red-300"
              : "mt-4 text-sm text-emerald-700 dark:text-emerald-300"
          }
          ref={messageRef}
          role={state.status === "error" ? "alert" : "status"}
          tabIndex={-1}
        >
          {state.message}
        </p>
      ) : null}
      {successMessage ? (
        <p
          className="mt-4 text-sm text-emerald-700 dark:text-emerald-300"
          ref={messageRef}
          role="status"
          tabIndex={-1}
        >
          {successMessage}
        </p>
      ) : null}
      <p aria-live="polite" className="sr-only">
        {isPending ? "Saving resume association." : ""}
      </p>
    </section>
  );
}
