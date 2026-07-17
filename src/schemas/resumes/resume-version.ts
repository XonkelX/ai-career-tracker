import { z } from "zod";

const collapseWhitespace = (value: string) => value.trim().replace(/\s+/g, " ");

const requiredSingleLine = (label: string, maximum: number) =>
  z
    .string()
    .transform(collapseWhitespace)
    .pipe(
      z
        .string()
        .min(1, `${label} is required.`)
        .max(maximum, `${label} must be ${maximum} characters or fewer.`),
    );

const optionalSingleLine = (label: string, maximum: number) =>
  z
    .string()
    .transform(collapseWhitespace)
    .pipe(
      z
        .string()
        .max(maximum, `${label} must be ${maximum} characters or fewer.`),
    )
    .transform((value) => value || undefined);

const optionalMultiline = (label: string, maximum: number) =>
  z
    .string()
    .transform((value) => value.trim())
    .pipe(
      z
        .string()
        .max(maximum, `${label} must be ${maximum} characters or fewer.`),
    )
    .transform((value) => value || undefined);

export const resumeVersionSchema = z.object({
  name: requiredSingleLine("Name", 120),
  versionLabel: requiredSingleLine("Version label", 80),
  description: optionalMultiline("Description", 500),
  sourceFileName: optionalSingleLine("Source filename", 255),
  notes: optionalMultiline("Notes", 5000),
});

export type ResumeVersionInput = z.infer<typeof resumeVersionSchema>;

export const resumeAssociationSchema = z.object({
  resumeVersionId: z
    .string()
    .trim()
    .max(100, "The selected resume is invalid.")
    .transform((value) => value || null),
});
