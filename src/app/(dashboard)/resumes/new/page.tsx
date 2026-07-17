import type { Metadata } from "next";
import Link from "next/link";

import { createResumeVersionAction } from "@/app/(dashboard)/resumes/new/actions";
import { ResumeVersionForm } from "@/features/resumes/components/resume-version-form";

export const metadata: Metadata = { title: "New resume version" };

export default function NewResumeVersionPage() {
  return (
    <section aria-labelledby="page-title">
      <Link
        className="text-secondary hover:text-primary text-sm font-medium"
        href="/resumes"
      >
        ← Resumes
      </Link>
      <div className="mt-5">
        <p className="text-brand text-sm font-semibold">New version</p>
        <h1
          className="text-primary mt-1 text-3xl font-semibold tracking-tight"
          id="page-title"
        >
          Add a resume version
        </h1>
        <p className="text-secondary mt-3 max-w-2xl">
          Save identifying details for the resume you use. Actual file uploads
          are not part of this version.
        </p>
      </div>
      <div className="border-border bg-surface mt-8 rounded-xl border p-5 sm:p-8">
        <ResumeVersionForm action={createResumeVersionAction} />
      </div>
    </section>
  );
}
