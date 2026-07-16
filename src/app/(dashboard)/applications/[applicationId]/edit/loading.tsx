export default function EditApplicationLoading() {
  return (
    <section aria-busy="true" aria-labelledby="edit-loading-title">
      <h1
        className="text-primary text-3xl font-semibold tracking-tight"
        id="edit-loading-title"
      >
        Edit job application
      </h1>
      <div
        className="border-border bg-surface mt-8 space-y-5 rounded-xl border p-5 sm:p-8"
        role="status"
      >
        <p className="text-secondary">Loading application…</p>
        <div className="bg-muted/20 h-11 animate-pulse rounded-lg" />
        <div className="bg-muted/20 h-11 animate-pulse rounded-lg" />
        <div className="bg-muted/20 h-32 animate-pulse rounded-lg" />
      </div>
    </section>
  );
}
