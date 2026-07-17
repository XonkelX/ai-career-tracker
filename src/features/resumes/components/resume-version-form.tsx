"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  INITIAL_RESUME_VERSION_STATE,
  type ResumeVersionActionState,
} from "@/features/resumes/resume-version-state";

export type ResumeVersionAction = (
  previousState: ResumeVersionActionState,
  formData: FormData,
) => Promise<ResumeVersionActionState>;

interface ResumeVersionFormProps {
  action: ResumeVersionAction;
  initialValues?: Partial<
    Record<
      "name" | "versionLabel" | "description" | "sourceFileName" | "notes",
      string
    >
  >;
  submitLabel?: string;
}

const inputClass =
  "border-border bg-canvas text-primary mt-2 min-h-11 w-full rounded-lg border px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 aria-[invalid=true]:border-red-600";

export function ResumeVersionForm({
  action,
  initialValues,
  submitLabel = "Save resume version",
}: ResumeVersionFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    INITIAL_RESUME_VERSION_STATE,
  );
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "error") errorSummaryRef.current?.focus();
  }, [state]);

  const value = (field: keyof NonNullable<typeof initialValues>) =>
    state.values?.[field] ?? initialValues?.[field] ?? "";
  const error = (field: keyof NonNullable<typeof initialValues>) =>
    state.fieldErrors?.[field]?.[0];

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.status === "error" ? (
        <div
          className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200"
          ref={errorSummaryRef}
          role="alert"
          tabIndex={-1}
        >
          <p className="font-semibold">Unable to save resume version</p>
          <p className="mt-1">{state.message}</p>
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field error={error("name")} label="Name" name="name" required>
          <input
            aria-invalid={Boolean(error("name"))}
            aria-describedby={error("name") ? "name-error" : undefined}
            className={inputClass}
            defaultValue={value("name")}
            id="name"
            maxLength={120}
            name="name"
            required
          />
        </Field>
        <Field
          error={error("versionLabel")}
          label="Version label"
          name="versionLabel"
          required
        >
          <input
            aria-invalid={Boolean(error("versionLabel"))}
            aria-describedby={
              error("versionLabel") ? "versionLabel-error" : undefined
            }
            className={inputClass}
            defaultValue={value("versionLabel")}
            id="versionLabel"
            maxLength={80}
            name="versionLabel"
            required
          />
        </Field>
      </div>

      <Field
        error={error("description")}
        label="Description"
        name="description"
      >
        <textarea
          aria-invalid={Boolean(error("description"))}
          aria-describedby={
            error("description") ? "description-error" : undefined
          }
          className={inputClass}
          defaultValue={value("description")}
          id="description"
          maxLength={500}
          name="description"
          rows={3}
        />
      </Field>

      <Field
        error={error("sourceFileName")}
        hint="Metadata only. No file will be uploaded."
        label="Source filename"
        name="sourceFileName"
      >
        <input
          aria-invalid={Boolean(error("sourceFileName"))}
          aria-describedby={
            error("sourceFileName") ? "sourceFileName-error" : undefined
          }
          className={inputClass}
          defaultValue={value("sourceFileName")}
          id="sourceFileName"
          maxLength={255}
          name="sourceFileName"
          placeholder="oniel-frontend-resume.pdf"
        />
      </Field>

      <Field error={error("notes")} label="Notes" name="notes">
        <textarea
          aria-invalid={Boolean(error("notes"))}
          aria-describedby={error("notes") ? "notes-error" : undefined}
          className={inputClass}
          defaultValue={value("notes")}
          id="notes"
          maxLength={5000}
          name="notes"
          rows={5}
        />
      </Field>

      <button
        className="min-h-11 rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Saving resume version…" : submitLabel}
      </button>
      <p aria-live="polite" className="sr-only">
        {isPending ? "Saving resume version." : ""}
      </p>
    </form>
  );
}

function Field({
  children,
  error,
  hint,
  label,
  name,
  required = false,
}: {
  children: React.ReactNode;
  error?: string;
  hint?: string;
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-primary text-sm font-semibold" htmlFor={name}>
        {label} {required ? <span aria-hidden="true">*</span> : null}
      </label>
      {hint ? <p className="text-secondary mt-1 text-sm">{hint}</p> : null}
      {children}
      {error ? (
        <p
          className="mt-2 text-sm text-red-700 dark:text-red-300"
          id={`${name}-error`}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
