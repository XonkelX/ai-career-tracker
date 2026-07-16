import { BellIcon } from "./shell-icons";

export function NotificationsButton({
  onActivate,
}: {
  onActivate: () => void;
}) {
  return (
    <button
      aria-label="Notifications"
      className="text-secondary hover:bg-surface-muted hover:text-primary relative grid size-11 place-items-center rounded-lg transition-colors duration-150"
      onClick={onActivate}
      type="button"
    >
      <BellIcon className="size-[19px]" />
      <span
        aria-hidden="true"
        className="bg-brand ring-surface absolute top-2.5 right-2.5 size-1.5 rounded-full ring-2"
      />
    </button>
  );
}
