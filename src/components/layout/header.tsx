import type { RefObject } from "react";

import { BrandMark } from "@/components/ui/brand-mark";

import { CommandPaletteButton } from "./command-palette-button";
import { NotificationsButton } from "./notifications-button";
import { SearchButton } from "./search-button";
import { MenuIcon } from "./shell-icons";
import { UserMenu } from "./user-menu";

type HeaderProps = {
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  pageTitle: string;
  onOpenMobileNavigation: () => void;
  onPlaceholderAction: (message: string) => void;
};

export function Header({
  menuButtonRef,
  pageTitle,
  onOpenMobileNavigation,
  onPlaceholderAction,
}: HeaderProps) {
  return (
    <header className="border-border sticky top-0 z-30 h-16 border-b bg-[var(--header)] backdrop-blur-xl">
      <div className="flex h-full items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          aria-label="Open navigation menu"
          className="text-secondary hover:bg-surface-muted hover:text-primary grid size-11 shrink-0 place-items-center rounded-lg transition-colors md:hidden"
          onClick={onOpenMobileNavigation}
          ref={menuButtonRef}
          type="button"
        >
          <MenuIcon className="size-5" />
        </button>

        <BrandMark className="text-brand size-8 shrink-0 md:hidden" />

        <div className="min-w-0 flex-1">
          <p className="text-muted font-mono text-[9px] font-medium tracking-[0.14em] uppercase">
            Workspace
          </p>
          <p className="text-primary truncate text-sm font-semibold tracking-[-0.015em]">
            {pageTitle}
          </p>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <SearchButton
            onActivate={() =>
              onPlaceholderAction("Search is not available in this milestone.")
            }
          />
          <CommandPaletteButton
            onActivate={() =>
              onPlaceholderAction(
                "The command palette is not available in this milestone.",
              )
            }
          />
          <NotificationsButton
            onActivate={() =>
              onPlaceholderAction(
                "Notifications are not available in this milestone.",
              )
            }
          />
          <div className="bg-border mx-1 hidden h-6 w-px sm:block" />
          <UserMenu
            onActivate={() =>
              onPlaceholderAction(
                "The user menu is not available in this milestone.",
              )
            }
          />
        </div>
      </div>
    </header>
  );
}
