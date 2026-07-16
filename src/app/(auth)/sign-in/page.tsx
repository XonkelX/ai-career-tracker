import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LoginForm } from "@/features/auth/components/login-form";
import { getSafeCallbackUrl } from "@/server/auth/callback-url";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; callbackUrl?: string }>;
}) {
  const [session, params] = await Promise.all([auth(), searchParams]);
  if (session?.user) redirect("/dashboard");

  const registrationSucceeded = params.registered === "1";
  const callbackUrl = getSafeCallbackUrl(
    params.callbackUrl,
    process.env.AUTH_URL,
  );

  return (
    <section
      className="rounded-xl border border-slate-800 bg-slate-900 p-8"
      aria-labelledby="sign-in-title"
    >
      <h1 className="text-2xl font-semibold" id="sign-in-title">
        Sign in
      </h1>
      <p className="mt-3 text-slate-300">
        Continue organizing your search and preparing stronger applications.
      </p>
      {registrationSucceeded ? (
        <p
          className="mt-4 rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100"
          role="status"
        >
          Your account was created successfully. You can sign in now.
        </p>
      ) : null}
      <LoginForm callbackUrl={callbackUrl} />
      <p className="mt-6 text-sm text-slate-400">
        Need an account?{" "}
        <Link
          className="text-cyan-300 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          href="/sign-up"
        >
          Sign up
        </Link>
      </p>
    </section>
  );
}
