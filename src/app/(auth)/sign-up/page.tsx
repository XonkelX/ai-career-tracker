import type { Metadata } from "next";
import Link from "next/link";

import { RegistrationForm } from "@/features/auth/components/registration-form";

export const metadata: Metadata = {
  title: "Create an account",
};

export default function SignUpPage() {
  return (
    <section
      className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950/30 sm:p-8"
      aria-labelledby="sign-up-title"
    >
      <h1 className="text-2xl font-semibold" id="sign-up-title">
        Create an account
      </h1>
      <p className="mt-3 leading-7 text-slate-300">
        Start organizing your job search in a private, user-owned workspace. You
        will sign in separately after registration.
      </p>
      <RegistrationForm />
      <p className="mt-7 text-center text-sm text-slate-400">
        Already registered?{" "}
        <Link
          className="rounded-sm text-cyan-300 underline underline-offset-4 hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
          href="/sign-in"
        >
          Sign in
        </Link>
      </p>
    </section>
  );
}
