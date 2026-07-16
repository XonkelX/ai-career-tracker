"use server";

import { redirect } from "next/navigation";

import type { ApplicationActionState } from "@/features/applications/application-state";
import {
  createApplicationSchema,
  type ApplicationFormInput,
} from "@/schemas/applications/application";
import { createJobApplication } from "@/server/applications/create-job-application";
import { requireAuthenticatedUser } from "@/server/auth/session";

const APPLICATION_FIELDS: (keyof ApplicationFormInput)[] = [
  "companyName",
  "jobTitle",
  "location",
  "salaryMin",
  "salaryMax",
  "salaryCurrency",
  "salaryPeriod",
  "jobUrl",
  "notes",
  "deadline",
  "status",
];

function getFormValues(formData: FormData): Record<string, string> {
  return Object.fromEntries(
    APPLICATION_FIELDS.map((field) => {
      const value = formData.get(field);
      return [field, typeof value === "string" ? value : ""];
    }),
  );
}

export async function createJobApplicationAction(
  _previousState: ApplicationActionState,
  formData: FormData,
): Promise<ApplicationActionState> {
  const values = getFormValues(formData);
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
