import type {
  ApplicationStatus,
  SalaryPeriod,
} from "@/generated/prisma/client";
import type { ValidatedApplicationInput } from "@/schemas/applications/application";

export const GENERIC_APPLICATION_ERROR =
  "We could not save this application. Please try again.";

interface JobApplicationRecord {
  userId: string;
  companyName: string;
  jobTitle: string;
  location?: string;
  salaryMinMinor?: bigint;
  salaryMaxMinor?: bigint;
  salaryCurrency?: string;
  salaryPeriod?: SalaryPeriod;
  jobUrl?: string;
  notes?: string;
  deadline?: Date;
  dateApplied: Date | null;
  status: ApplicationStatus;
}

export interface CreateJobApplicationDependencies {
  createApplication(data: JobApplicationRecord): Promise<void>;
  now?: () => Date;
}

export type CreateJobApplicationInput = ValidatedApplicationInput & {
  dateApplied?: Date;
};

async function createApplication(data: JobApplicationRecord): Promise<void> {
  const { prisma } = await import("@/server/db/client");

  await prisma.jobApplication.create({
    data,
    select: { id: true },
  });
}

const defaultDependencies: CreateJobApplicationDependencies = {
  createApplication,
  now: () => new Date(),
};

function startOfUtcDate(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export async function createJobApplication(
  userId: string,
  input: CreateJobApplicationInput,
  dependencies: CreateJobApplicationDependencies = defaultDependencies,
): Promise<{ success: true } | { success: false; message: string }> {
  try {
    const dateApplied =
      input.dateApplied ??
      (input.status === "SAVED"
        ? null
        : startOfUtcDate(dependencies.now?.() ?? new Date()));

    await dependencies.createApplication({
      userId,
      companyName: input.companyName,
      jobTitle: input.jobTitle,
      location: input.location,
      salaryMinMinor: input.salaryMinMinor,
      salaryMaxMinor: input.salaryMaxMinor,
      salaryCurrency: input.salaryCurrency,
      salaryPeriod: input.salaryPeriod,
      jobUrl: input.jobUrl,
      notes: input.notes,
      deadline: input.deadline,
      dateApplied,
      status: input.status,
    });

    return { success: true };
  } catch {
    return { success: false, message: GENERIC_APPLICATION_ERROR };
  }
}
