import Link from "next/link";

export function ApplicationSearchForm({ searchTerm }: { searchTerm: string }) {
  return (
    <form
      action="/applications"
      className="border-border bg-surface mt-8 rounded-xl border p-4 sm:p-5"
      method="get"
      role="search"
    >
      <label className="text-primary text-sm font-semibold" htmlFor="search">
        Search applications
      </label>
      <p className="text-muted mt-1 text-sm" id="search-description">
        Search by company or job title.
      </p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          aria-describedby="search-description"
          autoComplete="off"
          className="border-border bg-canvas text-primary placeholder:text-muted min-h-11 min-w-0 flex-1 rounded-lg border px-3.5 py-2.5 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
          defaultValue={searchTerm}
          enterKeyHint="search"
          id="search"
          name="search"
          placeholder="Company or job title"
          type="search"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="bg-primary text-on-inverse inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
            type="submit"
          >
            Search
          </button>
          {searchTerm ? (
            <Link
              className="text-brand inline-flex min-h-11 items-center text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
              href="/applications"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </div>
    </form>
  );
}
