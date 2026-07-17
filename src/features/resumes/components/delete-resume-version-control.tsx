"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { deleteResumeVersionAction } from "@/app/(dashboard)/resumes/actions";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  INITIAL_DELETE_RESUME_VERSION_STATE,
  type DeleteResumeVersionActionState,
} from "@/features/resumes/resume-version-state";

type DeleteAction = (
  resumeVersionId: string,
  previousState: DeleteResumeVersionActionState,
  formData: FormData,
) => Promise<DeleteResumeVersionActionState>;

export function DeleteResumeVersionControl({
  action = deleteResumeVersionAction,
  versionLabel,
  name,
  onDeleted,
  resumeVersionId,
}: {
  action?: DeleteAction;
  versionLabel: string;
  name: string;
  onDeleted: (id: string, accessibleName: string) => void;
  resumeVersionId: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [state, formAction, isPending] = useActionState(
    action.bind(null, resumeVersionId),
    INITIAL_DELETE_RESUME_VERSION_STATE,
  );
  const accessibleName = `${name}, ${versionLabel}`;

  useEffect(() => {
    if (state.status === "error") errorRef.current?.focus();
    if (state.status === "success" && state.resumeVersionId) {
      onDeleted(state.resumeVersionId, accessibleName);
    }
  }, [accessibleName, onDeleted, state]);

  function cancel() {
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
            Delete <strong>{name}</strong>, <strong>{versionLabel}</strong>?
            Applications using this version will keep their data but will no
            longer have a resume attached. This action cannot be undone.
          </>
        }
        initialFocusRef={cancelRef}
        onCancel={cancel}
        open={open}
        title="Delete resume version?"
      >
        {state.status === "error" ? (
          <div
            className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200"
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
            className="border-border text-primary min-h-11 rounded-lg border px-5 py-2.5 text-sm font-semibold"
            disabled={isPending}
            onClick={cancel}
            ref={cancelRef}
            type="button"
          >
            Cancel
          </button>
          <button
            className="min-h-11 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Deleting resume version…" : "Delete resume version"}
          </button>
        </form>
        <p aria-live="polite" className="sr-only">
          {isPending ? `Deleting ${accessibleName}.` : ""}
        </p>
      </ConfirmationDialog>
    </>
  );
}
