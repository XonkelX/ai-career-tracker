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
          <p className="text-brand text-sm font-semibold">Placeholder route</p>
          <h1
            className="mt-1 text-3xl font-semibold tracking-tight"
            id="page-title"
          >
            {title}
          </h1>
          <p className="text-secondary mt-3 max-w-2xl">{description}</p>
        </div>
        {action ? (
          <Link
            className="bg-primary text-on-inverse min-h-11 rounded-lg px-4 py-3 text-sm font-semibold"
            href={action.href}
          >
            {action.label}
          </Link>
        ) : null}
      </div>
      <div className="border-border bg-surface mt-8 rounded-xl border border-dashed p-8">
        {children ?? (
          <p className="text-muted text-sm">
            Feature implementation is intentionally deferred to a later
            milestone.
          </p>
        )}
      </div>
    </section>
  );
}
