import type { Metadata } from "next";
import Link from "next/link";

import { ResumeVersionList } from "@/features/resumes/components/resume-version-list";
import { requireAuthenticatedUser } from "@/server/auth/session";
import { listResumeVersions } from "@/server/resumes/resume-versions";

export const metadata: Metadata = { title: "Resumes" };

export default async function ResumesPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const user = await requireAuthenticatedUser();
  const [result, query] = await Promise.all([
    listResumeVersions(user.id),
    searchParams,
  ]);
  const success =
    query.created === "1"
      ? "Resume version created."
      : query.updated === "1"
        ? "Resume version updated."
        : null;

  return (
    <section aria-labelledby="page-title">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-brand text-sm font-semibold">Resume library</p>
          <h1
            className="text-primary mt-1 text-3xl font-semibold tracking-tight"
            id="page-title"
          >
            Resume versions
          </h1>
          <p className="text-secondary mt-3 max-w-2xl">
            Track resume families, version labels, source filenames, and the
            opportunities where each version is used.
          </p>
        </div>
        <Link
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-cyan-600 px-5 text-sm font-semibold text-white hover:bg-cyan-700"
          href="/resumes/new"
        >
          Add resume version
        </Link>
      </div>

      {success ? (
        <p
          className="mt-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-800 dark:text-emerald-200"
          role="status"
        >
          {success}
        </p>
      ) : null}

      <div className="mt-8">
        {result.status === "error" ? (
          <div
            className="rounded-xl border border-red-500/40 bg-red-500/10 p-5"
            role="alert"
          >
            <p className="text-red-700 dark:text-red-200">{result.message}</p>
          </div>
        ) : (
          <>
            <p className="text-secondary mb-4 text-sm" aria-live="polite">
              {result.items.length}{" "}
              {result.items.length === 1 ? "resume version" : "resume versions"}
            </p>
            <ResumeVersionList items={result.items} />
          </>
        )}
      </div>
    </section>
  );
}
