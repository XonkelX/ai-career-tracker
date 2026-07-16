"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { deleteJobApplicationAction } from "@/app/(dashboard)/applications/actions";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  INITIAL_DELETE_APPLICATION_STATE,
  type DeleteApplicationActionState,
} from "@/features/applications/delete-application-state";

export type DeleteApplicationAction = (
  applicationId: string,
  previousState: DeleteApplicationActionState,
  formData: FormData,
) => Promise<DeleteApplicationActionState>;

interface DeleteApplicationControlProps {
  action?: DeleteApplicationAction;
  applicationId: string;
  companyName: string;
  jobTitle: string;
  onDeleted: (applicationId: string, accessibleName: string) => void;
}

export function DeleteApplicationControl({
  action = deleteJobApplicationAction,
  applicationId,
  companyName,
  jobTitle,
  onDeleted,
}: DeleteApplicationControlProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const boundAction = action.bind(null, applicationId);
  const [state, formAction, isPending] = useActionState(
    boundAction,
    INITIAL_DELETE_APPLICATION_STATE,
  );
  const accessibleName = `${jobTitle} at ${companyName}`;

  useEffect(() => {
    if (state.status === "error") errorRef.current?.focus();
    if (state.status === "success" && state.applicationId) {
      onDeleted(state.applicationId, accessibleName);
    }
  }, [accessibleName, onDeleted, state]);

  function closeAndRestoreFocus() {
    setOpen(false);
    queueMicrotask(() => triggerRef.current?.focus());
  }

  return (
    <>
      <button
        aria-label={`Delete ${accessibleName}`}
        className="inline-flex min-h-11 items-center text-sm font-semibold text-red-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:text-red-300"
        onClick={() => setOpen(true)}
        ref={triggerRef}
        type="button"
      >
        Delete
      </button>

      <ConfirmationDialog
        busy={isPending}
        description={
          <>
            Delete <strong>{jobTitle}</strong> at <strong>{companyName}</strong>
            ? This action cannot be undone.
          </>
        }
        initialFocusRef={cancelRef}
        onCancel={closeAndRestoreFocus}
        open={open}
        title="Delete application?"
      >
        {state.status === "error" && state.message ? (
          <div
            className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200"
            ref={errorRef}
            role="alert"
            tabIndex={-1}
          >
            {state.message}
          </div>
        ) : null}

        <form
          action={formAction}
          className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"
        >
          <button
            className="border-border text-primary min-h-11 rounded-lg border px-5 py-2.5 text-sm font-semibold hover:bg-slate-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            onClick={closeAndRestoreFocus}
            ref={cancelRef}
            type="button"
          >
            Cancel
          </button>
          <button
            className="min-h-11 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-600"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Deleting application…" : "Delete application"}
          </button>
        </form>
        <p aria-live="polite" className="sr-only">
          {isPending ? `Deleting ${accessibleName}.` : ""}
        </p>
      </ConfirmationDialog>
    </>
  );
}
