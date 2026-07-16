import type {
  ApplicationStatus,
  SalaryPeriod,
} from "@/generated/prisma/client";
import type { ValidatedApplicationInput } from "@/schemas/applications/application";

export const GENERIC_APPLICATION_UPDATE_ERROR =
  "We could not update this application. Please try again.";

interface ApplicationOwnershipPredicate {
  id: string;
  userId: string;
}

interface ApplicationUpdateData {
  companyName: string;
  jobTitle: string;
  location: string | null;
  salaryMinMinor: bigint | null;
  salaryMaxMinor: bigint | null;
  salaryCurrency: string | null;
  salaryPeriod: SalaryPeriod | null;
  jobUrl: string | null;
  notes: string | null;
  deadline: Date | null;
  dateApplied: Date | null;
  status: ApplicationStatus;
}

export interface UpdateJobApplicationDependencies {
  findApplication(where: ApplicationOwnershipPredicate): Promise<{
    dateApplied: Date | null;
    status: ApplicationStatus;
  } | null>;
  updateApplication(args: {
    where: ApplicationOwnershipPredicate;
    data: ApplicationUpdateData;
  }): Promise<{ count: number }>;
  now?: () => Date;
}

async function findApplication(where: ApplicationOwnershipPredicate) {
  const { prisma } = await import("@/server/db/client");
  return prisma.jobApplication.findFirst({
    where,
    select: { dateApplied: true, status: true },
  });
}

async function updateApplication(args: {
  where: ApplicationOwnershipPredicate;
  data: ApplicationUpdateData;
}) {
  const { prisma } = await import("@/server/db/client");
  return prisma.jobApplication.updateMany(args);
}

const defaultDependencies: UpdateJobApplicationDependencies = {
  findApplication,
  updateApplication,
  now: () => new Date(),
};

function startOfUtcDate(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export type UpdateJobApplicationResult =
  | { status: "success" }
  | { status: "not_found" }
  | { status: "error"; message: string };

export async function updateJobApplication(
  userId: string,
  applicationId: string,
  input: ValidatedApplicationInput,
  dependencies: UpdateJobApplicationDependencies = defaultDependencies,
): Promise<UpdateJobApplicationResult> {
  const where = { id: applicationId, userId };

  try {
    const existing = await dependencies.findApplication(where);
    if (!existing) return { status: "not_found" };

    const dateApplied =
      existing.dateApplied ??
      (existing.status === "SAVED"
        ? null
        : startOfUtcDate(dependencies.now?.() ?? new Date()));

    const result = await dependencies.updateApplication({
      where,
      data: {
        companyName: input.companyName,
        jobTitle: input.jobTitle,
        location: input.location ?? null,
        salaryMinMinor: input.salaryMinMinor ?? null,
        salaryMaxMinor: input.salaryMaxMinor ?? null,
        salaryCurrency: input.salaryCurrency ?? null,
        salaryPeriod: input.salaryPeriod ?? null,
        jobUrl: input.jobUrl ?? null,
        notes: input.notes ?? null,
        deadline: input.deadline ?? null,
        dateApplied,
        status: existing.status,
      },
    });

    return result.count === 1 ? { status: "success" } : { status: "not_found" };
  } catch {
    return { status: "error", message: GENERIC_APPLICATION_UPDATE_ERROR };
  }
}
