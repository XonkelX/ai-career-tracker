import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import {
  ApplicationList,
  ApplicationListError,
  ApplicationListLoading,
} from "@/features/applications/components/application-list";
import { listJobApplications } from "@/server/applications/list-job-applications";
import { requireAuthenticatedUser } from "@/server/auth/session";

export const metadata: Metadata = {
  title: "Job applications",
};

async function ApplicationsContent() {
  const user = await requireAuthenticatedUser();
  const result = await listJobApplications(user.id);

  if (!result.success) {
    return <ApplicationListError message={result.message} />;
  }

  return <ApplicationList applications={result.applications} />;
}

export default function ApplicationsPage() {
  return (
    <section aria-labelledby="page-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-brand text-sm font-semibold">Opportunities</p>
          <h1
            className="text-primary mt-1 text-3xl font-semibold tracking-tight"
            id="page-title"
          >
            Job applications
          </h1>
          <p className="text-secondary mt-3 max-w-2xl">
            Review your current opportunities, key dates, and application
            progress.
          </p>
        </div>
        <Link
          className="bg-primary text-on-inverse inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
          href="/applications/new"
        >
          Add application
        </Link>
      </div>

      <Suspense fallback={<ApplicationListLoading />}>
        <ApplicationsContent />
      </Suspense>
    </section>
  );
}
