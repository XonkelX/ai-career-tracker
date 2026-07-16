import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const registrationSucceeded = (await searchParams).registered === "1";

  return (
    <section
      className="rounded-xl border border-slate-800 bg-slate-900 p-8"
      aria-labelledby="sign-in-title"
    >
      <h1 className="text-2xl font-semibold" id="sign-in-title">
        Sign in
      </h1>
      {registrationSucceeded ? (
        <p
          className="mt-4 rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100"
          role="status"
        >
          Your account was created successfully. Sign-in functionality is not
          available yet.
        </p>
      ) : null}
      <p className="mt-3 text-slate-300">
        Sign-in functionality is intentionally deferred to the next
        authentication milestone.
      </p>
      <p className="mt-6 text-sm text-slate-400">
        Need an account?{" "}
        <Link className="text-cyan-300 underline" href="/sign-up">
          Sign up
        </Link>
      </p>
    </section>
  );
}
