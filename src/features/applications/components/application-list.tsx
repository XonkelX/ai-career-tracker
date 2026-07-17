"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/constants/application-status";
import type { ApplicationListItem } from "@/server/applications/list-job-applications";

import {
  formatApplicationDate,
  formatSalaryRange,
} from "../application-formatters";
import {
  DeleteApplicationControl,
  type DeleteApplicationAction,
} from "./delete-application-control";

const statusStyles: Record<ApplicationStatus, string> = {
  SAVED:
    "border-slate-400/40 bg-slate-400/10 text-slate-700 dark:text-slate-200",
  APPLIED: "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-200",
  INTERVIEW:
    "border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-200",
  OFFER:
    "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
  REJECTED: "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-200",
};

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {APPLICATION_STATUS_LABELS[status]}
    </span>
  );
}

function ApplicationDates({
  application,
}: {
  application: ApplicationListItem;
}) {
  const deadline = formatApplicationDate(application.deadline);
  const dateApplied = formatApplicationDate(application.dateApplied);
  const createdAt = formatApplicationDate(application.createdAt);

  return (
    <dl className="space-y-1.5 text-sm">
      {deadline ? (
        <div className="flex gap-2">
          <dt className="text-muted shrink-0">Deadline</dt>
          <dd className="text-primary font-medium">{deadline}</dd>
        </div>
      ) : null}
      {dateApplied ? (
        <div className="flex gap-2">
          <dt className="text-muted shrink-0">Applied</dt>
          <dd className="text-primary">{dateApplied}</dd>
        </div>
      ) : null}
      <div className="flex gap-2">
        <dt className="text-muted shrink-0">Created</dt>
        <dd className="text-primary">{createdAt}</dd>
      </div>
    </dl>
  );
}

function ApplicationActions({
  action,
  application,
  onDeleted,
}: {
  action?: DeleteApplicationAction;
  application: ApplicationListItem;
  onDeleted: (applicationId: string, accessibleName: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <Link
        aria-label={`Edit ${application.jobTitle} at ${application.companyName}`}
        className="text-brand inline-flex min-h-11 items-center text-sm font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
        href={`/applications/${application.id}/edit`}
      >
        Edit
      </Link>
      <DeleteApplicationControl
        action={action}
        applicationId={application.id}
        companyName={application.companyName}
        jobTitle={application.jobTitle}
        onDeleted={onDeleted}
      />
    </div>
  );
}

function DesktopApplicationTable({
  action,
  applications,
  onDeleted,
}: {
  action?: DeleteApplicationAction;
  applications: ApplicationListItem[];
  onDeleted: (applicationId: string, accessibleName: string) => void;
}) {
  return (
    <div className="border-border bg-surface hidden rounded-xl border lg:block">
      <table className="w-full table-fixed border-collapse text-left">
        <caption className="sr-only">Your saved job applications</caption>
        <thead>
          <tr className="border-border text-muted border-b text-xs tracking-wide uppercase">
            <th className="w-[26%] px-5 py-3 font-semibold" scope="col">
              Opportunity
            </th>
            <th className="w-[14%] px-4 py-3 font-semibold" scope="col">
              Status
            </th>
            <th className="w-[22%] px-4 py-3 font-semibold" scope="col">
              Salary
            </th>
            <th className="w-[23%] px-4 py-3 font-semibold" scope="col">
              Dates
            </th>
            <th className="w-[15%] px-4 py-3 font-semibold" scope="col">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
          {applications.map((application) => {
            const salary = formatSalaryRange(application);

            return (
              <tr className="align-top" key={application.id}>
                <th className="px-5 py-5 font-normal" scope="row">
                  <p className="text-primary font-semibold break-words">
                    {application.jobTitle}
                  </p>
                  <p className="text-secondary mt-1 text-sm break-words">
                    {application.companyName}
                  </p>
                  {application.location ? (
                    <p className="text-muted mt-1 text-sm break-words">
                      {application.location}
                    </p>
                  ) : null}
                </th>
                <td className="px-4 py-5">
                  <StatusBadge status={application.status} />
                </td>
                <td className="text-secondary px-4 py-5 text-sm break-words">
                  {salary ?? "Not provided"}
                </td>
                <td className="px-4 py-5">
                  <ApplicationDates application={application} />
                </td>
                <td className="px-4 py-3">
                  <ApplicationActions
                    action={action}
                    application={application}
                    onDeleted={onDeleted}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MobileApplicationCards({
  action,
  applications,
  onDeleted,
}: {
  action?: DeleteApplicationAction;
  applications: ApplicationListItem[];
  onDeleted: (applicationId: string, accessibleName: string) => void;
}) {
  return (
    <ul
      className="space-y-4 lg:hidden"
      aria-label="Your saved job applications"
    >
      {applications.map((application) => {
        const salary = formatSalaryRange(application);

        return (
          <li
            className="border-border bg-surface rounded-xl border p-5"
            key={application.id}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-primary font-semibold break-words">
                  {application.jobTitle}
                </p>
                <p className="text-secondary mt-1 text-sm break-words">
                  {application.companyName}
                </p>
                {application.location ? (
                  <p className="text-muted mt-1 text-sm break-words">
                    {application.location}
                  </p>
                ) : null}
              </div>
              <StatusBadge status={application.status} />
            </div>

            <dl className="border-border mt-5 space-y-3 border-t pt-4 text-sm">
              <div>
                <dt className="text-muted">Salary</dt>
                <dd className="text-primary mt-1 break-words">
                  {salary ?? "Not provided"}
                </dd>
              </div>
            </dl>
            <div className="border-border mt-4 border-t pt-4">
              <ApplicationDates application={application} />
            </div>
            <div className="mt-3">
              <ApplicationActions
                action={action}
                application={application}
                onDeleted={onDeleted}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function ApplicationList({
  deleteAction,
  applications,
  hasActiveFilters = false,
  searchTerm = "",
}: {
  deleteAction?: DeleteApplicationAction;
  applications: ApplicationListItem[];
  hasActiveFilters?: boolean;
  searchTerm?: string;
}) {
  const [visibleApplications, setVisibleApplications] = useState(applications);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (announcement) announcementRef.current?.focus();
  }, [announcement]);

  const handleDeleted = useCallback(
    (applicationId: string, accessibleName: string) => {
      setVisibleApplications((current) =>
        current.filter((application) => application.id !== applicationId),
      );
      setAnnouncement(`${accessibleName} was deleted.`);
    },
    [],
  );

  const deletionAnnouncement = announcement ? (
    <div
      className="mt-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:text-emerald-200"
      ref={announcementRef}
      role="status"
      tabIndex={-1}
    >
      {announcement}
    </div>
  ) : null;

  if (visibleApplications.length === 0) {
    const hasActiveCriteria = searchTerm.length > 0 || hasActiveFilters;

    return (
      <>
        {deletionAnnouncement}
        <section
          className="border-border bg-surface mt-8 rounded-xl border border-dashed px-6 py-12 text-center"
          aria-labelledby="empty-applications-title"
        >
          <h2
            className="text-primary text-lg font-semibold"
            id="empty-applications-title"
          >
            {hasActiveCriteria
              ? "No applications found"
              : "No applications yet"}
          </h2>
          <p className="text-secondary mx-auto mt-2 max-w-md text-sm">
            {searchTerm && hasActiveFilters
              ? `No applications match “${searchTerm}” and the active filters.`
              : searchTerm
                ? `No applications match “${searchTerm}”. Try another company or job title.`
                : hasActiveFilters
                  ? "No applications match the active filters."
                  : "Add your first opportunity to start tracking deadlines, progress, and outcomes."}
          </p>
          <Link
            className="bg-primary text-on-inverse mt-6 inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
            href={hasActiveCriteria ? "/applications" : "/applications/new"}
          >
            {hasActiveCriteria ? "Clear all" : "Add your first application"}
          </Link>
        </section>
      </>
    );
  }

  return (
    <div className="mt-8">
      {deletionAnnouncement}
      <p className="text-secondary mb-4 text-sm" role="status">
        {visibleApplications.length}{" "}
        {visibleApplications.length === 1 ? "application" : "applications"}
        {searchTerm || hasActiveFilters ? " matching active criteria" : ""}
      </p>
      <DesktopApplicationTable
        action={deleteAction}
        applications={visibleApplications}
        onDeleted={handleDeleted}
      />
      <MobileApplicationCards
        action={deleteAction}
        applications={visibleApplications}
        onDeleted={handleDeleted}
      />
    </div>
  );
}

export function ApplicationListError({ message }: { message: string }) {
  return (
    <section
      className="mt-8 rounded-xl border border-red-500/40 bg-red-500/10 px-6 py-8"
      aria-labelledby="applications-error-title"
      role="alert"
    >
      <h2
        className="text-primary text-lg font-semibold"
        id="applications-error-title"
      >
        Applications unavailable
      </h2>
      <p className="text-secondary mt-2 text-sm">{message}</p>
      <Link
        className="text-brand mt-4 inline-flex min-h-11 items-center text-sm font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
        href="/applications"
      >
        Try again
      </Link>
    </section>
  );
}

export function ApplicationListLoading() {
  return (
    <div
      className="border-border bg-surface mt-8 rounded-xl border p-6"
      role="status"
    >
      <p className="text-primary font-medium">Loading applications…</p>
      <p className="text-secondary mt-1 text-sm">
        Your saved opportunities will appear here shortly.
      </p>
    </div>
  );
}
