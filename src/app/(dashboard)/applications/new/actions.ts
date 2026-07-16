"use server";

import { redirect } from "next/navigation";

import { getApplicationFormValues } from "@/features/applications/application-form-data";
import type { ApplicationActionState } from "@/features/applications/application-state";
import { createApplicationSchema } from "@/schemas/applications/application";
import { createJobApplication } from "@/server/applications/create-job-application";
import { requireAuthenticatedUser } from "@/server/auth/session";

export async function createJobApplicationAction(
  _previousState: ApplicationActionState,
  formData: FormData,
): Promise<ApplicationActionState> {
  const values = getApplicationFormValues(formData);
  const validation = createApplicationSchema().safeParse(values);

  if (!validation.success) {
    return {
      status: "error",
      message: "Correct the highlighted fields and try again.",
      fieldErrors: validation.error.flatten().fieldErrors,
      values,
    };
  }

  const user = await requireAuthenticatedUser();
  const result = await createJobApplication(user.id, validation.data);

  if (!result.success) {
    return { status: "error", message: result.message, values };
  }

  redirect("/applications");
}
