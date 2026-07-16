import { CommandIcon } from "./shell-icons";

export function CommandPaletteButton({
  onActivate,
}: {
  onActivate: () => void;
}) {
  return (
    <button
      aria-label="Open command palette — shortcut Control or Command K"
      className="border-border bg-surface text-secondary hover:border-border-strong hover:text-primary hidden min-h-11 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors duration-150 sm:flex"
      onClick={onActivate}
      type="button"
    >
      <CommandIcon className="size-[18px]" />
      <span className="hidden 2xl:inline">Commands</span>
      <kbd className="border-border bg-surface-muted text-muted ml-2 hidden rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium lg:inline">
        Ctrl K
      </kbd>
    </button>
  );
}
