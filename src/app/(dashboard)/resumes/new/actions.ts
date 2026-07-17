"use server";

import { redirect } from "next/navigation";

import type { ResumeVersionActionState } from "@/features/resumes/resume-version-state";
import { getResumeVersionFormValues } from "@/features/resumes/resume-version-form-data";
import { resumeVersionSchema } from "@/schemas/resumes/resume-version";
import { requireAuthenticatedUser } from "@/server/auth/session";
import { createResumeVersion } from "@/server/resumes/resume-versions";

export async function createResumeVersionAction(
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
  const result = await createResumeVersion(user.id, validation.data);
  if (!result.success) {
    return { status: "error", message: result.message, values };
  }
  redirect("/resumes?created=1");
}
