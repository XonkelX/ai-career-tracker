import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateResumeVersionAction } from "@/app/(dashboard)/resumes/[resumeId]/edit/actions";
import { ResumeVersionForm } from "@/features/resumes/components/resume-version-form";
import { requireAuthenticatedUser } from "@/server/auth/session";
import { getResumeVersionForEdit } from "@/server/resumes/resume-versions";

export const metadata: Metadata = { title: "Edit resume version" };

export default async function EditResumeVersionPage({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = await params;
  const user = await requireAuthenticatedUser();
  const result = await getResumeVersionForEdit(user.id, resumeId);
  if (result.status === "not_found") notFound();

  if (result.status === "error") {
    return (
      <section aria-labelledby="page-title">
        <h1 className="text-primary text-3xl font-semibold" id="page-title">
          Edit resume version
        </h1>
        <div
          className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 p-5"
          role="alert"
        >
          <p className="text-red-700 dark:text-red-200">{result.message}</p>
        </div>
      </section>
    );
  }

  const action = updateResumeVersionAction.bind(null, resumeId);
  return (
    <section aria-labelledby="page-title">
      <Link
        className="text-secondary hover:text-primary text-sm font-medium"
        href="/resumes"
      >
        ← Resumes
      </Link>
      <div className="mt-5">
        <p className="text-brand text-sm font-semibold">Resume version</p>
        <h1
          className="text-primary mt-1 text-3xl font-semibold tracking-tight"
          id="page-title"
        >
          Edit resume version
        </h1>
      </div>
      <div className="border-border bg-surface mt-8 rounded-xl border p-5 sm:p-8">
        <ResumeVersionForm
          action={action}
          initialValues={result.values}
          submitLabel="Update resume version"
        />
      </div>
    </section>
  );
}
