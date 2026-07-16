"use client";

import {
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  type SyntheticEvent,
  useEffect,
  useId,
  useRef,
} from "react";

const focusableSelector = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export interface ConfirmationDialogProps {
  busy?: boolean;
  children: ReactNode;
  description: ReactNode;
  initialFocusRef: RefObject<HTMLElement | null>;
  onCancel: () => void;
  open: boolean;
  title: string;
}

export function ConfirmationDialog({
  busy = false,
  children,
  description,
  initialFocusRef,
  onCancel,
  open,
  title,
}: ConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
      initialFocusRef.current?.focus();
    } else if (!open && dialog.open) {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    }
  }, [initialFocusRef, open]);

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    if (!busy) onCancel();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;

    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(focusableSelector),
    );
    const first = focusable.at(0);
    const last = focusable.at(-1);
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <dialog
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className="border-border bg-surface text-primary m-auto w-[min(32rem,calc(100%-2rem))] rounded-xl border p-0 shadow-2xl backdrop:bg-slate-950/70"
      onCancel={handleCancel}
      onKeyDown={handleKeyDown}
      ref={dialogRef}
    >
      <div className="p-6 sm:p-7">
        <h2 className="text-xl font-semibold tracking-tight" id={titleId}>
          {title}
        </h2>
        <div
          className="text-secondary mt-3 text-sm leading-6"
          id={descriptionId}
        >
          {description}
        </div>
        {children}
      </div>
    </dialog>
  );
}
