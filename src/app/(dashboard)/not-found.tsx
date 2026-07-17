import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <section
      aria-labelledby="workspace-not-found-title"
      className="border-border bg-surface mx-auto max-w-xl rounded-xl border px-6 py-12 text-center"
    >
      <p className="text-brand text-sm font-semibold">Not found</p>
      <h1
        className="text-primary mt-2 text-3xl font-semibold"
        id="workspace-not-found-title"
      >
        This record is unavailable
      </h1>
      <p className="text-secondary mt-3">
        It may have been deleted, or it may not belong to your account.
      </p>
      <Link
        className="bg-primary text-on-inverse mt-6 inline-flex min-h-11 items-center rounded-lg px-5 font-semibold"
        href="/dashboard"
      >
        Return to dashboard
      </Link>
    </section>
  );
}
