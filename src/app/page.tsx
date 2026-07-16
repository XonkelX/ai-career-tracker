import Link from "next/link";

const features = [
  "Track every application from saved role to final decision",
  "Tailor resumes and cover letters without inventing credentials",
  "Prepare for interviews with job-specific questions",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
        <p className="mb-4 text-sm font-semibold tracking-[0.24em] text-cyan-300 uppercase">
          AI Career Tracker
        </p>
        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
          Run a more focused, informed job search.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Organize applications, improve career documents with grounded AI
          assistance, and understand your progress from one private workspace.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            className="rounded-lg bg-cyan-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
            href="/sign-up"
          >
            Create an account
          </Link>
          <Link
            className="rounded-lg border border-slate-700 px-5 py-3 font-semibold transition hover:border-slate-500 hover:bg-slate-900"
            href="/dashboard"
          >
            Preview dashboard
          </Link>
        </div>

        <ul className="mt-16 grid gap-4 text-slate-300 md:grid-cols-3">
          {features.map((feature) => (
            <li
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"
              key={feature}
            >
              {feature}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
