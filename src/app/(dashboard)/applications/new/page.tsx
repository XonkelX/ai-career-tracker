import type { Metadata } from "next";
import Link from "next/link";

import { createJobApplicationAction } from "@/app/(dashboard)/applications/new/actions";
import { ApplicationForm } from "@/features/applications/components/application-form";

export const metadata: Metadata = {
  title: "Add a job application",
};

export default function NewApplicationPage() {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <section aria-labelledby="page-title">
      <Link
        className="text-secondary hover:text-primary text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
        href="/applications"
      >
        ← Applications
      </Link>
      <div className="mt-5">
        <p className="text-brand text-sm font-semibold">New application</p>
        <h1
          className="text-primary mt-1 text-3xl font-semibold tracking-tight"
          id="page-title"
        >
          Add a job application
        </h1>
        <p className="text-secondary mt-3 max-w-2xl">
          Record the opportunity now. You can add only the company and role, or
          include the details you already know.
        </p>
      </div>

      <div className="border-border bg-surface mt-8 rounded-xl border p-5 sm:p-8">
        <ApplicationForm action={createJobApplicationAction} today={today} />
      </div>
    </section>
  );
}
