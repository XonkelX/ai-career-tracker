import Link from "next/link";

export default function SignUpPage() {
  return (
    <section
      className="rounded-xl border border-slate-800 bg-slate-900 p-8"
      aria-labelledby="sign-up-title"
    >
      <h1 className="text-2xl font-semibold" id="sign-up-title">
        Create an account
      </h1>
      <p className="mt-3 text-slate-300">
        Secure registration will be implemented after the architecture and data
        boundaries are reviewed.
      </p>
      <p className="mt-6 text-sm text-slate-400">
        Already registered?{" "}
        <Link className="text-cyan-300 underline" href="/sign-in">
          Sign in
        </Link>
      </p>
    </section>
  );
}
