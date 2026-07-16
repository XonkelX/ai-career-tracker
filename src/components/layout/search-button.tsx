import { SearchIcon } from "./shell-icons";

export function SearchButton({ onActivate }: { onActivate: () => void }) {
  return (
    <button
      aria-label="Search — shortcut slash"
      className="border-border bg-surface text-secondary hover:border-border-strong hover:text-primary hidden min-h-11 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors duration-150 sm:flex"
      onClick={onActivate}
      type="button"
    >
      <SearchIcon className="size-[18px]" />
      <span className="hidden xl:inline">Search</span>
      <kbd className="border-border bg-surface-muted text-muted ml-2 hidden min-w-5 rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium xl:inline">
        /
      </kbd>
    </button>
  );
}
