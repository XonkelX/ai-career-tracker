"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";

import { createJobApplicationAction } from "@/app/(dashboard)/applications/new/actions";
import { INITIAL_APPLICATION_STATE } from "@/features/applications/application-state";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
} from "@/lib/constants/application-status";
import { SALARY_PERIODS } from "@/schemas/applications/application";

const inputStyles =
  "border-border bg-canvas text-primary mt-2 min-h-11 w-full rounded-lg border px-3.5 py-2.5 text-base shadow-sm outline-none transition placeholder:text-muted hover:border-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-60";
const labelStyles = "text-primary text-sm font-medium";

function FieldError({ errors, id }: { errors?: string[]; id: string }) {
  if (!errors?.length) return null;

  return (
    <div
      className="mt-2 space-y-1 text-sm text-red-600 dark:text-red-300"
      id={id}
    >
      {errors.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </div>
  );
}

const salaryPeriodLabels = {
  HOURLY: "Hourly",
  MONTHLY: "Monthly",
  ANNUAL: "Annual",
} as const;

export function ApplicationForm({ today }: { today: string }) {
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const [state, formAction, isPending] = useActionState(
    createJobApplicationAction,
    INITIAL_APPLICATION_STATE,
  );

  useEffect(() => {
    if (state.status === "error") errorSummaryRef.current?.focus();
  }, [state]);

  const describedBy = (field: keyof NonNullable<typeof state.fieldErrors>) =>
    state.fieldErrors?.[field] ? `${field}-error` : undefined;

  return (
    <form action={formAction} className="mt-8 space-y-8" noValidate>
      {state.status === "error" && state.message ? (
        <div
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200"
          ref={errorSummaryRef}
          role="alert"
          tabIndex={-1}
        >
          {state.message}
        </div>
      ) : null}

      <fieldset className="space-y-5">
        <legend className="text-primary text-lg font-semibold">
          Opportunity
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelStyles} htmlFor="companyName">
              Company
            </label>
            <input
              aria-describedby={describedBy("companyName")}
              aria-invalid={Boolean(state.fieldErrors?.companyName)}
              autoComplete="organization"
              className={inputStyles}
              defaultValue={state.values?.companyName}
              disabled={isPending}
              id="companyName"
              maxLength={200}
              name="companyName"
              required
              type="text"
            />
            <FieldError
              errors={state.fieldErrors?.companyName}
              id="companyName-error"
            />
          </div>

          <div>
            <label className={labelStyles} htmlFor="jobTitle">
              Job title
            </label>
            <input
              aria-describedby={describedBy("jobTitle")}
              aria-invalid={Boolean(state.fieldErrors?.jobTitle)}
              autoComplete="organization-title"
              className={inputStyles}
              defaultValue={state.values?.jobTitle}
              disabled={isPending}
              id="jobTitle"
              maxLength={200}
              name="jobTitle"
              required
              type="text"
            />
            <FieldError
              errors={state.fieldErrors?.jobTitle}
              id="jobTitle-error"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelStyles} htmlFor="location">
              Location <span className="text-muted">(optional)</span>
            </label>
            <input
              aria-describedby={describedBy("location")}
              aria-invalid={Boolean(state.fieldErrors?.location)}
              autoComplete="off"
              className={inputStyles}
              defaultValue={state.values?.location}
              disabled={isPending}
              id="location"
              maxLength={200}
              name="location"
              type="text"
            />
            <FieldError
              errors={state.fieldErrors?.location}
              id="location-error"
            />
          </div>

          <div>
            <label className={labelStyles} htmlFor="jobUrl">
              Job URL <span className="text-muted">(optional)</span>
            </label>
            <input
              aria-describedby={describedBy("jobUrl")}
              aria-invalid={Boolean(state.fieldErrors?.jobUrl)}
              autoCapitalize="none"
              autoComplete="url"
              className={inputStyles}
              defaultValue={state.values?.jobUrl}
              disabled={isPending}
              id="jobUrl"
              inputMode="url"
              maxLength={2048}
              name="jobUrl"
              placeholder="jobs.example.com/role"
              spellCheck={false}
              type="url"
            />
            <FieldError errors={state.fieldErrors?.jobUrl} id="jobUrl-error" />
          </div>
        </div>
      </fieldset>

      <fieldset className="border-border space-y-5 border-t pt-8">
        <legend className="text-primary pr-3 text-lg font-semibold">
          Compensation
        </legend>
        <p className="text-secondary text-sm">
          Salary is optional. Add a currency and period when entering a range.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelStyles} htmlFor="salaryMin">
              Minimum salary
            </label>
            <input
              aria-describedby={describedBy("salaryMin")}
              aria-invalid={Boolean(state.fieldErrors?.salaryMin)}
              className={inputStyles}
              defaultValue={state.values?.salaryMin}
              disabled={isPending}
              id="salaryMin"
              inputMode="decimal"
              maxLength={30}
              min="0"
              name="salaryMin"
              placeholder="85000"
              step="any"
              type="number"
            />
            <FieldError
              errors={state.fieldErrors?.salaryMin}
              id="salaryMin-error"
            />
          </div>

          <div>
            <label className={labelStyles} htmlFor="salaryMax">
              Maximum salary
            </label>
            <input
              aria-describedby={describedBy("salaryMax")}
              aria-invalid={Boolean(state.fieldErrors?.salaryMax)}
              className={inputStyles}
              defaultValue={state.values?.salaryMax}
              disabled={isPending}
              id="salaryMax"
              inputMode="decimal"
              maxLength={30}
              min="0"
              name="salaryMax"
              placeholder="105000"
              step="any"
              type="number"
            />
            <FieldError
              errors={state.fieldErrors?.salaryMax}
              id="salaryMax-error"
            />
          </div>

          <div>
            <label className={labelStyles} htmlFor="salaryCurrency">
              Currency
            </label>
            <input
              aria-describedby={describedBy("salaryCurrency")}
              aria-invalid={Boolean(state.fieldErrors?.salaryCurrency)}
              autoCapitalize="characters"
              className={`${inputStyles} uppercase`}
              defaultValue={state.values?.salaryCurrency}
              disabled={isPending}
              id="salaryCurrency"
              maxLength={3}
              name="salaryCurrency"
              pattern="[A-Za-z]{3}"
              placeholder="USD"
              spellCheck={false}
              type="text"
            />
            <FieldError
              errors={state.fieldErrors?.salaryCurrency}
              id="salaryCurrency-error"
            />
          </div>

          <div>
            <label className={labelStyles} htmlFor="salaryPeriod">
              Salary period
            </label>
            <select
              aria-describedby={describedBy("salaryPeriod")}
              aria-invalid={Boolean(state.fieldErrors?.salaryPeriod)}
              className={inputStyles}
              defaultValue={state.values?.salaryPeriod ?? ""}
              disabled={isPending}
              id="salaryPeriod"
              name="salaryPeriod"
            >
              <option value="">Select a period</option>
              {SALARY_PERIODS.map((period) => (
                <option key={period} value={period}>
                  {salaryPeriodLabels[period]}
                </option>
              ))}
            </select>
            <FieldError
              errors={state.fieldErrors?.salaryPeriod}
              id="salaryPeriod-error"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="border-border space-y-5 border-t pt-8">
        <legend className="text-primary pr-3 text-lg font-semibold">
          Tracking details
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelStyles} htmlFor="status">
              Status
            </label>
            <select
              aria-describedby={describedBy("status")}
              aria-invalid={Boolean(state.fieldErrors?.status)}
              className={inputStyles}
              defaultValue={state.values?.status ?? "SAVED"}
              disabled={isPending}
              id="status"
              name="status"
            >
              {APPLICATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {APPLICATION_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
            <FieldError errors={state.fieldErrors?.status} id="status-error" />
          </div>

          <div>
            <label className={labelStyles} htmlFor="deadline">
              Deadline <span className="text-muted">(optional)</span>
            </label>
            <input
              aria-describedby={describedBy("deadline")}
              aria-invalid={Boolean(state.fieldErrors?.deadline)}
              className={inputStyles}
              defaultValue={state.values?.deadline}
              disabled={isPending}
              id="deadline"
              min={today}
              name="deadline"
              type="date"
            />
            <FieldError
              errors={state.fieldErrors?.deadline}
              id="deadline-error"
            />
          </div>
        </div>

        <div>
          <label className={labelStyles} htmlFor="notes">
            Notes <span className="text-muted">(optional)</span>
          </label>
          <textarea
            aria-describedby={describedBy("notes")}
            aria-invalid={Boolean(state.fieldErrors?.notes)}
            className={`${inputStyles} min-h-32 resize-y`}
            defaultValue={state.values?.notes}
            disabled={isPending}
            id="notes"
            maxLength={10_000}
            name="notes"
            rows={5}
          />
          <FieldError errors={state.fieldErrors?.notes} id="notes-error" />
        </div>
      </fieldset>

      <div className="border-border flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Link
          className="border-border text-primary inline-flex min-h-11 items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-semibold hover:bg-slate-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
          href="/applications"
        >
          Cancel
        </Link>
        <button
          className="bg-primary text-on-inverse min-h-11 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving application…" : "Save application"}
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {isPending ? "Saving your job application." : ""}
      </p>
    </form>
  );
}
