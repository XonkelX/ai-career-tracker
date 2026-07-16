import Link from "next/link";

type PlaceholderPageProps = {
  title: string;
  description: string;
  action?: { href: string; label: string };
  children?: React.ReactNode;
};

export function PlaceholderPage({
  title,
  description,
  action,
  children,
}: PlaceholderPageProps) {
  return (
    <section aria-labelledby="page-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
            Placeholder route
          </p>
          <h1
            className="mt-1 text-3xl font-semibold tracking-tight"
            id="page-title"
          >
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            {description}
          </p>
        </div>
        {action ? (
          <Link
            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white dark:bg-cyan-300 dark:text-slate-950"
            href={action.href}
          >
            {action.label}
          </Link>
        ) : null}
      </div>
      <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 dark:border-slate-700 dark:bg-slate-900">
        {children ?? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Feature implementation is intentionally deferred to a later
            milestone.
          </p>
        )}
      </div>
    </section>
  );
}
