import Link from "next/link";

import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/constants/application-status";
import type { DashboardOverview as DashboardOverviewData } from "@/server/dashboard/get-dashboard-overview";

import {
  formatDashboardDate,
  formatDashboardUpdateTime,
  getDeadlineTiming,
} from "../dashboard-formatters";

const statusStyles: Record<ApplicationStatus, string> = {
  SAVED: "bg-slate-500",
  APPLIED: "bg-blue-600",
  INTERVIEW: "bg-violet-600",
  OFFER: "bg-emerald-600",
  REJECTED: "bg-red-600",
};

const metricDefinitions: Array<{
  key: ApplicationStatus | "total";
  label: string;
}> = [
  { key: "total", label: "Total applications" },
  { key: "SAVED", label: "Saved applications" },
  { key: "APPLIED", label: "Applied applications" },
  { key: "INTERVIEW", label: "Interviews" },
  { key: "OFFER", label: "Offers" },
  { key: "REJECTED", label: "Rejections" },
];

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className="border-border bg-surface-muted text-secondary inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold">
      {APPLICATION_STATUS_LABELS[status]}
    </span>
  );
}

function EmptyDashboard() {
  return (
    <section
      aria-labelledby="empty-dashboard-title"
      className="border-border bg-surface mt-8 rounded-xl border border-dashed px-6 py-14 text-center"
    >
      <h2
        className="text-primary text-xl font-semibold"
        id="empty-dashboard-title"
      >
        Start tracking your job search
      </h2>
      <p className="text-secondary mx-auto mt-3 max-w-lg text-sm leading-6">
        Add your first application to see status totals, conversion progress,
        deadlines, and recent updates here.
      </p>
      <Link
        className="bg-primary text-on-inverse mt-6 inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
        href="/applications/new"
      >
        Add your first application
      </Link>
    </section>
  );
}

export function DashboardOverview({
  overview,
}: {
  overview: DashboardOverviewData;
}) {
  if (overview.counts.total === 0) return <EmptyDashboard />;

  return (
    <div className="mt-8 space-y-8">
      <section aria-labelledby="summary-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2
              className="text-primary text-xl font-semibold"
              id="summary-heading"
            >
              Application summary
            </h2>
            <p className="text-secondary mt-1 text-sm">
              Current totals across your tracked opportunities.
            </p>
          </div>
        </div>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metricDefinitions.map(({ key, label }) => (
            <div
              className="border-border bg-surface rounded-xl border p-5 shadow-sm"
              key={key}
            >
              <dt className="text-secondary text-sm font-medium">{label}</dt>
              <dd className="text-primary mt-3 text-3xl font-semibold tracking-tight">
                {overview.counts[key]}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.55fr)]">
        <section
          aria-labelledby="status-breakdown-heading"
          className="border-border bg-surface rounded-xl border p-5 sm:p-6"
        >
          <h2
            className="text-primary text-lg font-semibold"
            id="status-breakdown-heading"
          >
            Applications by status
          </h2>
          <ul className="mt-5 space-y-4">
            {APPLICATION_STATUSES.map((status) => {
              const count = overview.counts[status];
              const percentage =
                overview.counts.total === 0
                  ? 0
                  : Math.round((count / overview.counts.total) * 100);

              return (
                <li key={status}>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-primary font-medium">
                      {APPLICATION_STATUS_LABELS[status]}
                    </span>
                    <span className="text-secondary">
                      {count} {count === 1 ? "application" : "applications"}
                    </span>
                  </div>
                  <div
                    aria-hidden="true"
                    className="bg-surface-muted mt-2 h-2 overflow-hidden rounded-full"
                  >
                    <div
                      className={`h-full rounded-full ${statusStyles[status]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section
          aria-labelledby="conversion-heading"
          className="border-border bg-surface rounded-xl border p-5 sm:p-6"
        >
          <h2
            className="text-primary text-lg font-semibold"
            id="conversion-heading"
          >
            Interview conversion
          </h2>
          <p
            aria-label={`Interview conversion rate: ${overview.interviewConversionRate} percent`}
            className="text-primary mt-5 text-4xl font-semibold tracking-tight"
          >
            {overview.interviewConversionRate}%
          </p>
          <p className="text-secondary mt-3 text-sm leading-6">
            Submitted applications that reached interview or a later outcome.
            Submitted includes Applied, Interview, Offer, and Rejected.
          </p>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section
          aria-labelledby="deadlines-heading"
          className="border-border bg-surface min-w-0 rounded-xl border p-5 sm:p-6"
        >
          <h2
            className="text-primary text-lg font-semibold"
            id="deadlines-heading"
          >
            Upcoming deadlines
          </h2>
          {overview.upcomingDeadlines.length ? (
            <ul className="divide-border mt-4 divide-y">
              {overview.upcomingDeadlines.map((application) => {
                const deadline = application.deadline;
                if (!deadline) return null;

                return (
                  <li
                    className="py-4 first:pt-1 last:pb-0"
                    key={application.id}
                  >
                    <Link
                      aria-label={`Edit ${application.jobTitle} at ${application.companyName}, deadline ${formatDashboardDate(deadline)}`}
                      className="group block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-500"
                      href={`/applications/${application.id}/edit`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-primary font-semibold break-words group-hover:underline">
                            {application.jobTitle}
                          </p>
                          <p className="text-secondary mt-1 text-sm break-words">
                            {application.companyName}
                          </p>
                        </div>
                        <span className="border-border bg-surface-muted text-primary rounded-full border px-2.5 py-1 text-xs font-semibold">
                          {getDeadlineTiming(deadline, overview.asOfDate)}
                        </span>
                      </div>
                      <p className="text-secondary mt-2 text-sm">
                        Deadline {formatDashboardDate(deadline)}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-secondary mt-4 text-sm">
              No upcoming deadlines. Add deadlines when an opportunity needs
              your attention.
            </p>
          )}
        </section>

        <section
          aria-labelledby="recent-heading"
          className="border-border bg-surface min-w-0 rounded-xl border p-5 sm:p-6"
        >
          <h2
            className="text-primary text-lg font-semibold"
            id="recent-heading"
          >
            Recently updated
          </h2>
          <ul className="divide-border mt-4 divide-y">
            {overview.recentApplications.map((application) => (
              <li className="py-4 first:pt-1 last:pb-0" key={application.id}>
                <Link
                  aria-label={`Edit ${application.jobTitle} at ${application.companyName}, updated ${formatDashboardUpdateTime(application.updatedAt)}`}
                  className="group block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-500"
                  href={`/applications/${application.id}/edit`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-primary font-semibold break-words group-hover:underline">
                        {application.jobTitle}
                      </p>
                      <p className="text-secondary mt-1 text-sm break-words">
                        {application.companyName}
                      </p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                  <p className="text-muted mt-2 text-sm">
                    Updated {formatDashboardUpdateTime(application.updatedAt)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export function DashboardError({ message }: { message: string }) {
  return (
    <section
      aria-labelledby="dashboard-error-title"
      className="mt-8 rounded-xl border border-red-500/40 bg-red-500/10 px-6 py-8"
      role="alert"
    >
      <h2
        className="text-primary text-lg font-semibold"
        id="dashboard-error-title"
      >
        Dashboard unavailable
      </h2>
      <p className="text-secondary mt-2 text-sm">{message}</p>
      <Link
        className="text-brand mt-4 inline-flex min-h-11 items-center text-sm font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
        href="/dashboard"
      >
        Try again
      </Link>
    </section>
  );
}

export function DashboardLoading() {
  return (
    <div
      aria-busy="true"
      className="border-border bg-surface mt-8 rounded-xl border p-6"
      role="status"
    >
      <p className="text-primary font-medium">Loading dashboard…</p>
      <p className="text-secondary mt-1 text-sm">
        Your application overview will appear here shortly.
      </p>
    </div>
  );
}
