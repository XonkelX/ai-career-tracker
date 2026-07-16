import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import {
  DashboardError,
  DashboardLoading,
  DashboardOverview,
} from "@/features/dashboard/components/dashboard-overview";
import { getDashboardOverview } from "@/server/dashboard/get-dashboard-overview";
import { requireAuthenticatedUser } from "@/server/auth/session";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function DashboardContent() {
  const user = await requireAuthenticatedUser();
  const result = await getDashboardOverview(user.id);

  if (!result.success) return <DashboardError message={result.message} />;

  return <DashboardOverview overview={result.overview} />;
}

export default function DashboardPage() {
  return (
    <section aria-labelledby="page-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-brand text-sm font-semibold">Overview</p>
          <h1
            className="text-primary mt-1 text-3xl font-semibold tracking-tight"
            id="page-title"
          >
            Dashboard
          </h1>
          <p className="text-secondary mt-3 max-w-2xl">
            Understand your application progress and see what needs attention
            next.
          </p>
        </div>
        <Link
          className="bg-primary text-on-inverse inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
          href="/applications/new"
        >
          Add application
        </Link>
      </div>

      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent />
      </Suspense>
    </section>
  );
}
