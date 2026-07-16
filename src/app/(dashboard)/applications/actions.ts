"use server";

import { revalidatePath } from "next/cache";

import type { DeleteApplicationActionState } from "@/features/applications/delete-application-state";
import {
  deleteJobApplication,
  GENERIC_APPLICATION_DELETE_ERROR,
} from "@/server/applications/delete-job-application";
import { requireAuthenticatedUser } from "@/server/auth/session";

export async function deleteJobApplicationAction(
  applicationId: string,
  _previousState: DeleteApplicationActionState,
  _formData: FormData,
): Promise<DeleteApplicationActionState> {
  void _previousState;
  void _formData;
  const user = await requireAuthenticatedUser();
  const result = await deleteJobApplication(user.id, applicationId);

  if (result.status !== "success") {
    return {
      status: "error",
      message: GENERIC_APPLICATION_DELETE_ERROR,
    };
  }

  revalidatePath("/applications");
  return {
    status: "success",
    applicationId,
    message: "Application deleted.",
  };
}
