"use server";

import { revalidatePath } from "next/cache";

import type { DeleteResumeVersionActionState } from "@/features/resumes/resume-version-state";
import { requireAuthenticatedUser } from "@/server/auth/session";
import { deleteResumeVersion } from "@/server/resumes/resume-versions";

export async function deleteResumeVersionAction(
  resumeVersionId: string,
  _previousState: DeleteResumeVersionActionState,
  _formData: FormData,
): Promise<DeleteResumeVersionActionState> {
  void _previousState;
  void _formData;
  const user = await requireAuthenticatedUser();
  const result = await deleteResumeVersion(user.id, resumeVersionId);
  if (!result.success) return { status: "error", message: result.message };

  revalidatePath("/resumes");
  return { status: "success", resumeVersionId };
}
