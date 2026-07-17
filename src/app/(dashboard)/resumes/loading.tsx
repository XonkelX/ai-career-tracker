export default function ResumesLoading() {
  return (
    <section aria-busy="true" aria-labelledby="loading-title">
      <h1 className="text-primary text-3xl font-semibold" id="loading-title">
        Resume versions
      </h1>
      <p className="text-secondary mt-3">Loading your resume versions…</p>
      <div className="border-border bg-surface mt-8 h-40 animate-pulse rounded-xl border motion-reduce:animate-none" />
    </section>
  );
}
