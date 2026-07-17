export type ShellUser = {
  email?: string | null;
  name?: string | null;
};

export type SignOutAction = () => Promise<void>;

function getInitials(user: ShellUser) {
  const source = user.name?.trim() || user.email?.trim() || "Account";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function UserMenu({
  action,
  user,
}: {
  action: SignOutAction;
  user: ShellUser;
}) {
  const displayName = user.name?.trim() || "Your account";

  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="hidden min-w-0 items-center gap-2 lg:flex">
        <span
          aria-hidden="true"
          className="bg-primary text-on-inverse grid size-8 shrink-0 place-items-center rounded-lg text-[11px] font-semibold"
        >
          {getInitials(user)}
        </span>
        <span className="min-w-0">
          <span className="text-primary block max-w-28 truncate text-xs font-semibold">
            {displayName}
          </span>
          <span className="text-muted mt-0.5 block max-w-28 truncate text-[10px]">
            {user.email ?? "Private workspace"}
          </span>
        </span>
      </div>
      <form action={action}>
        <button
          aria-label={`Sign out ${displayName}`}
          className="border-border bg-surface text-secondary hover:border-border-strong hover:text-primary inline-flex min-h-11 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors"
          type="submit"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
