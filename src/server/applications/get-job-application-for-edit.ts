import type { ApplicationActionState } from "@/features/applications/application-state";
import { getCurrencyMinorDigits } from "@/schemas/applications/application";

export const GENERIC_APPLICATION_LOAD_ERROR =
  "We could not load this application. Please try again.";

interface EditableApplicationRecord {
  resumeVersionId: string | null;
  companyName: string;
  jobTitle: string;
  location: string | null;
  salaryMinMinor: bigint | null;
  salaryMaxMinor: bigint | null;
  salaryCurrency: string | null;
  salaryPeriod: "HOURLY" | "MONTHLY" | "ANNUAL" | null;
  jobUrl: string | null;
  notes: string | null;
  deadline: Date | null;
  status: "SAVED" | "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";
}

export interface GetJobApplicationForEditDependencies {
  findApplication(query: {
    where: { id: string; userId: string };
  }): Promise<EditableApplicationRecord | null>;
}

async function findApplication(query: {
  where: { id: string; userId: string };
}): Promise<EditableApplicationRecord | null> {
  const { prisma } = await import("@/server/db/client");

  return prisma.jobApplication.findFirst({
    ...query,
    select: {
      companyName: true,
      jobTitle: true,
      location: true,
      salaryMinMinor: true,
      salaryMaxMinor: true,
      salaryCurrency: true,
      salaryPeriod: true,
      jobUrl: true,
      notes: true,
      deadline: true,
      status: true,
      resumeVersionId: true,
    },
  });
}

const defaultDependencies: GetJobApplicationForEditDependencies = {
  findApplication,
};

function minorUnitsToFormValue(
  value: bigint | null,
  currency: string | null,
): string {
  if (value === null) return "";

  const minorDigits = currency ? (getCurrencyMinorDigits(currency) ?? 2) : 2;
  if (minorDigits === 0) return value.toString();

  const digits = value.toString().padStart(minorDigits + 1, "0");
  return `${digits.slice(0, -minorDigits)}.${digits.slice(-minorDigits)}`;
}

export type EditableApplicationValues = NonNullable<
  ApplicationActionState["values"]
>;

export type GetJobApplicationForEditResult =
  | {
      status: "success";
      values: EditableApplicationValues;
      resumeVersionId: string | null;
    }
  | { status: "not_found" }
  | { status: "error"; message: string };

export async function getJobApplicationForEdit(
  userId: string,
  applicationId: string,
  dependencies: GetJobApplicationForEditDependencies = defaultDependencies,
): Promise<GetJobApplicationForEditResult> {
  try {
    const application = await dependencies.findApplication({
      where: { id: applicationId, userId },
    });
    if (!application) return { status: "not_found" };

    return {
      status: "success",
      resumeVersionId: application.resumeVersionId,
      values: {
        companyName: application.companyName,
        jobTitle: application.jobTitle,
        location: application.location ?? "",
        salaryMin: minorUnitsToFormValue(
          application.salaryMinMinor,
          application.salaryCurrency,
        ),
        salaryMax: minorUnitsToFormValue(
          application.salaryMaxMinor,
          application.salaryCurrency,
        ),
        salaryCurrency: application.salaryCurrency ?? "",
        salaryPeriod: application.salaryPeriod ?? "",
        jobUrl: application.jobUrl ?? "",
        notes: application.notes ?? "",
        deadline: application.deadline?.toISOString().slice(0, 10) ?? "",
        status: application.status,
      },
    };
  } catch {
    return { status: "error", message: GENERIC_APPLICATION_LOAD_ERROR };
  }
}
