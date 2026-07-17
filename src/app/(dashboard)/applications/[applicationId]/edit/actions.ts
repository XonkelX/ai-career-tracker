"use server";

import { notFound, redirect } from "next/navigation";

import { getApplicationFormValues } from "@/features/applications/application-form-data";
import type { ApplicationActionState } from "@/features/applications/application-state";
import { createApplicationSchema } from "@/schemas/applications/application";
import { resumeAssociationSchema } from "@/schemas/resumes/resume-version";
import { getJobApplicationForEdit } from "@/server/applications/get-job-application-for-edit";
import { updateJobApplication } from "@/server/applications/update-job-application";
import { requireAuthenticatedUser } from "@/server/auth/session";
import { associateResumeVersion } from "@/server/resumes/resume-versions";
import type { ResumeAssociationActionState } from "@/features/resumes/resume-version-state";

export async function updateJobApplicationAction(
  applicationId: string,
  _previousState: ApplicationActionState,
  formData: FormData,
): Promise<ApplicationActionState> {
  const values = getApplicationFormValues(formData);
  const user = await requireAuthenticatedUser();
  const existing = await getJobApplicationForEdit(user.id, applicationId);

  if (existing.status === "not_found") notFound();
  if (existing.status === "error") {
    return { status: "error", message: existing.message, values };
  }

  const validation = createApplicationSchema(new Date(), {
    allowedPastDeadline: existing.values.deadline,
  }).safeParse(values);

  if (!validation.success) {
    return {
      status: "error",
      message: "Correct the highlighted fields and try again.",
      fieldErrors: validation.error.flatten().fieldErrors,
      values,
    };
  }

  const result = await updateJobApplication(
    user.id,
    applicationId,
    validation.data,
  );

  if (result.status === "not_found") notFound();
  if (result.status === "error") {
    return { status: "error", message: result.message, values };
  }

  redirect("/applications");
}

export async function associateResumeVersionAction(
  applicationId: string,
  _previousState: ResumeAssociationActionState,
  formData: FormData,
): Promise<ResumeAssociationActionState> {
  const validation = resumeAssociationSchema.safeParse({
    resumeVersionId: String(formData.get("resumeVersionId") ?? ""),
  });
  if (!validation.success) {
    return { status: "error", message: "Select a valid resume version." };
  }

  const user = await requireAuthenticatedUser();
  const result = await associateResumeVersion(
    user.id,
    applicationId,
    validation.data.resumeVersionId,
  );
  if (!result.success) return { status: "error", message: result.message };

  const outcome = result.resumeVersionId ? "attached" : "removed";
  redirect(
    `/applications/${applicationId}/edit?resumeAssociation=${outcome}#resume-association-title`,
  );
}
