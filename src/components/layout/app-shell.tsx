"use client";

import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { BrandLockup } from "@/components/ui/brand-mark";

import { Header } from "./header";
import { getNavigationLabel, Navigation } from "./navigation";
import { CloseIcon } from "./shell-icons";
import { Sidebar } from "./sidebar";

const FOCUSABLE_ELEMENTS =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
  const [announcement, setAnnouncement] = useState({ id: 0, message: "" });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasMobileNavigationOpen = useRef(false);

  const announce = useCallback((message: string) => {
    setAnnouncement((current) => ({ id: current.id + 1, message }));
  }, []);

  const closeMobileNavigation = useCallback(() => {
    setIsMobileNavigationOpen(false);
  }, []);

  useEffect(() => {
    if (isMobileNavigationOpen) {
      wasMobileNavigationOpen.current = true;
      closeButtonRef.current?.focus();
      return;
    }

    if (wasMobileNavigationOpen.current) {
      wasMobileNavigationOpen.current = false;
      menuButtonRef.current?.focus();
    }
  }, [isMobileNavigationOpen]);

  useEffect(() => {
    if (!isMobileNavigationOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileNavigation();
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusableElements = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS),
      );
      const firstElement = focusableElements.at(0);
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMobileNavigation, isMobileNavigationOpen]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const isCommandShortcut =
        (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";

      if (isCommandShortcut) {
        event.preventDefault();
        announce("The command palette is not available in this milestone.");
        return;
      }

      if (isEditableTarget(event.target)) return;

      if (event.key === "/") {
        event.preventDefault();
        announce("Search is not available in this milestone.");
      } else if (event.key === "?") {
        event.preventDefault();
        announce(
          "Available shortcuts: Control or Command K for commands, slash for search, and question mark for this help.",
        );
      }
    }

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, [announce]);

  const pageTitle = getNavigationLabel(pathname);

  return (
    <div className="bg-canvas text-primary min-h-screen">
      <a
        className="bg-surface text-primary sr-only z-[70] rounded-lg px-4 py-3 text-sm font-semibold shadow-md focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        href="#main-content"
      >
        Skip to main content
      </a>

      <div className="flex min-h-screen">
        <Sidebar
          collapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed((current) => !current)}
        />

        <div
          aria-hidden={isMobileNavigationOpen || undefined}
          className="min-w-0 flex-1"
          inert={isMobileNavigationOpen ? true : undefined}
        >
          <Header
            menuButtonRef={menuButtonRef}
            onOpenMobileNavigation={() => setIsMobileNavigationOpen(true)}
            onPlaceholderAction={announce}
            pageTitle={pageTitle}
          />
          <main
            className="mx-auto min-h-[calc(100vh-4rem)] max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
            id="main-content"
            tabIndex={-1}
          >
            {children}
          </main>
        </div>
      </div>

      {isMobileNavigationOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-hidden="true"
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"
            onClick={closeMobileNavigation}
            tabIndex={-1}
            type="button"
          />
          <div
            aria-labelledby="mobile-navigation-title"
            aria-modal="true"
            className="border-border bg-surface relative flex h-full w-[min(20rem,86vw)] flex-col border-r shadow-2xl"
            ref={drawerRef}
            role="dialog"
          >
            <div className="border-border flex h-16 shrink-0 items-center justify-between border-b px-4">
              <div id="mobile-navigation-title">
                <BrandLockup />
              </div>
              <button
                aria-label="Close navigation menu"
                className="text-secondary hover:bg-surface-muted hover:text-primary grid size-11 place-items-center rounded-lg transition-colors"
                onClick={closeMobileNavigation}
                ref={closeButtonRef}
                type="button"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
              <p className="text-muted mb-3 px-3 font-mono text-[10px] font-medium tracking-[0.14em] uppercase">
                Workspace
              </p>
              <Navigation onNavigate={closeMobileNavigation} variant="drawer" />
            </div>
            <div className="border-border border-t p-4">
              <p className="text-primary text-xs font-medium">Demo workspace</p>
              <p className="text-muted mt-1 text-[11px] leading-5">
                Authentication and account data arrive in a later milestone.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div
        aria-atomic="true"
        aria-live="polite"
        className="pointer-events-none fixed right-4 bottom-4 z-[60] max-w-sm"
        role="status"
      >
        {announcement.message ? (
          <div
            className="animate-preview border-border bg-surface-elevated text-secondary rounded-xl border px-4 py-3 text-sm shadow-lg"
            key={announcement.id}
          >
            {announcement.message}
          </div>
        ) : null}
      </div>
    </div>
  );
}
