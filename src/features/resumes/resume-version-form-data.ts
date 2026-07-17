const fields = [
  "name",
  "versionLabel",
  "description",
  "sourceFileName",
  "notes",
] as const;

export function getResumeVersionFormValues(formData: FormData) {
  return Object.fromEntries(
    fields.map((field) => [field, String(formData.get(field) ?? "")]),
  ) as Record<(typeof fields)[number], string>;
}
