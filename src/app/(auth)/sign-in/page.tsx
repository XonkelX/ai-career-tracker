import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <section
      className="rounded-xl border border-slate-800 bg-slate-900 p-8"
      aria-labelledby="sign-in-title"
    >
      <h1 className="text-2xl font-semibold" id="sign-in-title">
        Sign in
      </h1>
      <p className="mt-3 text-slate-300">
        Authentication is planned but intentionally not implemented in this
        foundation milestone.
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
