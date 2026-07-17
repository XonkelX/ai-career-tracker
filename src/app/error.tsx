"use client";

import Link from "next/link";

export default function ApplicationError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-center text-slate-100">
      <section aria-labelledby="application-error-title" className="max-w-lg">
        <p className="text-sm font-semibold text-cyan-300">CareerFlow</p>
        <h1
          className="mt-2 text-3xl font-semibold"
          id="application-error-title"
        >
          Something went wrong
        </h1>
        <p className="mt-3 text-slate-300">
          We could not load this page. Your saved data has not been changed.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            className="min-h-11 rounded-lg bg-cyan-300 px-5 font-semibold text-slate-950"
            onClick={() => unstable_retry()}
            type="button"
          >
            Try again
          </button>
          <Link
            className="inline-flex min-h-11 items-center rounded-lg border border-slate-700 px-5 font-semibold"
            href="/"
          >
            Return home
          </Link>
        </div>
      </section>
    </main>
  );
}
