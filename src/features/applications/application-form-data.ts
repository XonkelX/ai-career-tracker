import type { ApplicationFormInput } from "@/schemas/applications/application";

export const APPLICATION_FORM_FIELDS: (keyof ApplicationFormInput)[] = [
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

export function getApplicationFormValues(
  formData: FormData,
): Record<string, string> {
  return Object.fromEntries(
    APPLICATION_FORM_FIELDS.map((field) => {
      const value = formData.get(field);
      return [field, typeof value === "string" ? value : ""];
    }),
  );
}
