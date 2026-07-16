import Link from "next/link";

import {
  hasActiveApplicationCriteria,
  type ApplicationListUrlState,
} from "@/features/applications/application-list-filters";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
} from "@/lib/constants/application-status";

const selectClassName =
  "border-border bg-canvas text-primary min-h-11 w-full rounded-lg border px-3 py-2.5 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500";

export function ApplicationFilterForm({
  state,
}: {
  state: ApplicationListUrlState;
}) {
  const hasActiveCriteria = hasActiveApplicationCriteria(state);

  return (
    <form
      aria-labelledby="application-filters-title"
      action="/applications"
      className="border-border bg-surface mt-8 rounded-xl border p-4 sm:p-5"
      method="get"
      role="search"
    >
      <h2
        className="text-primary text-base font-semibold"
        id="application-filters-title"
      >
        Search and filter applications
      </h2>
      <p className="text-muted mt-1 text-sm" id="filters-description">
        Search by company or job title.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="sm:col-span-2 xl:col-span-1">
          <label
            className="text-primary text-sm font-semibold"
            htmlFor="search"
          >
            Search
          </label>
          <input
            aria-describedby="filters-description"
            autoComplete="off"
            className="border-border bg-canvas text-primary placeholder:text-muted mt-1.5 min-h-11 w-full min-w-0 rounded-lg border px-3.5 py-2.5 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
            defaultValue={state.search}
            enterKeyHint="search"
            id="search"
            name="search"
            placeholder="Company or job title"
            type="search"
          />
        </div>

        <div>
          <label
            className="text-primary text-sm font-semibold"
            htmlFor="status"
          >
            Status
          </label>
          <select
            className={`${selectClassName} mt-1.5`}
            defaultValue={state.status ?? ""}
            id="status"
            name="status"
          >
            <option value="">All statuses</option>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {APPLICATION_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="text-primary text-sm font-semibold"
            htmlFor="salary"
          >
            Salary availability
          </label>
          <select
            className={`${selectClassName} mt-1.5`}
            defaultValue={state.salary}
            id="salary"
            name="salary"
          >
            <option value="any">Any salary</option>
            <option value="with-salary">With salary</option>
            <option value="without-salary">Without salary</option>
          </select>
        </div>

        <div>
          <label
            className="text-primary text-sm font-semibold"
            htmlFor="deadline"
          >
            Deadline timing
          </label>
          <select
            className={`${selectClassName} mt-1.5`}
            defaultValue={state.deadline}
            id="deadline"
            name="deadline"
          >
            <option value="any">Any deadline</option>
            <option value="upcoming">Upcoming</option>
            <option value="overdue">Overdue</option>
            <option value="no-deadline">No deadline</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          className="bg-primary text-on-inverse inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
          type="submit"
        >
          Apply filters
        </button>
        {hasActiveCriteria ? (
          <Link
            aria-label="Clear all search and filters"
            className="text-brand inline-flex min-h-11 items-center text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
            href="/applications"
          >
            Clear all
          </Link>
        ) : null}
      </div>
    </form>
  );
}
