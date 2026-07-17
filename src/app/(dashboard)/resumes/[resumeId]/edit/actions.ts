"use server";

import { redirect } from "next/navigation";

import { getResumeVersionFormValues } from "@/features/resumes/resume-version-form-data";
import type { ResumeVersionActionState } from "@/features/resumes/resume-version-state";
import { resumeVersionSchema } from "@/schemas/resumes/resume-version";
import { requireAuthenticatedUser } from "@/server/auth/session";
import { updateResumeVersion } from "@/server/resumes/resume-versions";

export async function updateResumeVersionAction(
  resumeVersionId: string,
  _previousState: ResumeVersionActionState,
  formData: FormData,
): Promise<ResumeVersionActionState> {
  const values = getResumeVersionFormValues(formData);
  const validation = resumeVersionSchema.safeParse(values);
  if (!validation.success) {
    return {
      status: "error",
      message: "Correct the highlighted fields and try again.",
      fieldErrors: validation.error.flatten().fieldErrors,
      values,
    };
  }

  const user = await requireAuthenticatedUser();
  const result = await updateResumeVersion(
    user.id,
    resumeVersionId,
    validation.data,
  );
  if (!result.success) {
    return { status: "error", message: result.message, values };
  }
  redirect("/resumes?updated=1");
}
