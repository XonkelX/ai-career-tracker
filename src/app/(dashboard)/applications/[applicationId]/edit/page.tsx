import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateJobApplicationAction } from "@/app/(dashboard)/applications/[applicationId]/edit/actions";
import { ApplicationForm } from "@/features/applications/components/application-form";
import { getJobApplicationForEdit } from "@/server/applications/get-job-application-for-edit";
import { requireAuthenticatedUser } from "@/server/auth/session";

export const metadata: Metadata = {
  title: "Edit job application",
};

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const user = await requireAuthenticatedUser();
  const result = await getJobApplicationForEdit(user.id, applicationId);

  if (result.status === "not_found") notFound();

  if (result.status === "error") {
    return (
      <section aria-labelledby="page-title">
        <h1
          className="text-primary text-3xl font-semibold tracking-tight"
          id="page-title"
        >
          Edit job application
        </h1>
        <div
          className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-4 text-red-700 dark:text-red-200"
          role="alert"
        >
          <p>{result.message}</p>
          <Link
            className="mt-3 inline-flex font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
            href="/applications"
          >
            Return to applications
          </Link>
        </div>
      </section>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const action = updateJobApplicationAction.bind(null, applicationId);

  return (
    <section aria-labelledby="page-title">
      <Link
        className="text-secondary hover:text-primary text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
        href="/applications"
      >
        ← Applications
      </Link>
      <div className="mt-5">
        <p className="text-brand text-sm font-semibold">Application details</p>
        <h1
          className="text-primary mt-1 text-3xl font-semibold tracking-tight"
          id="page-title"
        >
          Edit job application
        </h1>
        <p className="text-secondary mt-3 max-w-2xl">
          Keep the opportunity details accurate as your application progresses.
        </p>
      </div>

      <div className="border-border bg-surface mt-8 rounded-xl border p-5 sm:p-8">
        <ApplicationForm
          action={action}
          initialValues={result.values}
          pendingLabel="Updating application…"
          statusReadOnly
          submitLabel="Update application"
          today={today}
        />
      </div>
    </section>
  );
}
