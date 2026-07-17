export default function EditResumeVersionLoading() {
  return (
    <section aria-busy="true" aria-labelledby="loading-title">
      <h1 className="text-primary text-3xl font-semibold" id="loading-title">
        Loading resume version
      </h1>
      <p className="text-secondary mt-3">Preparing the edit form…</p>
    </section>
  );
}
