import { ChevronDownIcon } from "./shell-icons";

export function UserMenu({ onActivate }: { onActivate: () => void }) {
  return (
    <button
      aria-label="Open user menu"
      className="hover:bg-surface-muted flex min-h-11 items-center gap-2 rounded-lg px-1.5 text-left transition-colors duration-150"
      onClick={onActivate}
      type="button"
    >
      <span className="bg-primary text-on-inverse grid size-8 place-items-center rounded-lg text-[11px] font-semibold">
        DU
      </span>
      <span className="hidden min-w-0 lg:block">
        <span className="text-primary block max-w-24 truncate text-xs font-semibold">
          Demo user
        </span>
        <span className="text-muted mt-0.5 block text-[10px]">Personal</span>
      </span>
      <ChevronDownIcon className="text-muted hidden size-3.5 lg:block" />
    </button>
  );
}
