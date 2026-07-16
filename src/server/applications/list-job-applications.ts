import type {
  ApplicationStatus,
  SalaryPeriod,
} from "@/generated/prisma/client";

export const GENERIC_APPLICATION_LIST_ERROR =
  "We could not load your applications. Please try again.";

export function normalizeApplicationSearch(search: string): string {
  return search.trim().replace(/\s+/g, " ");
}

interface ApplicationSearchCondition {
  OR?: [
    { companyName: { contains: string; mode: "insensitive" } },
    { jobTitle: { contains: string; mode: "insensitive" } },
  ];
}

interface ApplicationListWhere extends ApplicationSearchCondition {
  userId: string;
}

interface JobApplicationListRecord {
  id: string;
  companyName: string;
  jobTitle: string;
  location: string | null;
  status: ApplicationStatus;
  salaryMinMinor: bigint | null;
  salaryMaxMinor: bigint | null;
  salaryCurrency: string | null;
  salaryPeriod: SalaryPeriod | null;
  deadline: Date | null;
  dateApplied: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationListItem {
  id: string;
  companyName: string;
  jobTitle: string;
  location: string | null;
  status: ApplicationStatus;
  salaryMinMinor: string | null;
  salaryMaxMinor: string | null;
  salaryCurrency: string | null;
  salaryPeriod: SalaryPeriod | null;
  deadline: string | null;
  dateApplied: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListJobApplicationsDependencies {
  findApplications(query: {
    where: ApplicationListWhere;
    orderBy: [
      { deadline: { sort: "asc"; nulls: "last" } },
      { updatedAt: "desc" },
    ];
  }): Promise<JobApplicationListRecord[]>;
}

async function findApplications(query: {
  where: ApplicationListWhere;
  orderBy: [
    { deadline: { sort: "asc"; nulls: "last" } },
    { updatedAt: "desc" },
  ];
}): Promise<JobApplicationListRecord[]> {
  const { prisma } = await import("@/server/db/client");

  return prisma.jobApplication.findMany({
    ...query,
    select: {
      id: true,
      companyName: true,
      jobTitle: true,
      location: true,
      status: true,
      salaryMinMinor: true,
      salaryMaxMinor: true,
      salaryCurrency: true,
      salaryPeriod: true,
      deadline: true,
      dateApplied: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

const defaultDependencies: ListJobApplicationsDependencies = {
  findApplications,
};

function serializeApplication(
  application: JobApplicationListRecord,
): ApplicationListItem {
  return {
    ...application,
    salaryMinMinor: application.salaryMinMinor?.toString() ?? null,
    salaryMaxMinor: application.salaryMaxMinor?.toString() ?? null,
    deadline: application.deadline?.toISOString() ?? null,
    dateApplied: application.dateApplied?.toISOString() ?? null,
    createdAt: application.createdAt.toISOString(),
    updatedAt: application.updatedAt.toISOString(),
  };
}

export async function listJobApplications(
  userId: string,
  search = "",
  dependencies: ListJobApplicationsDependencies = defaultDependencies,
): Promise<
  | { success: true; applications: ApplicationListItem[] }
  | { success: false; message: string }
> {
  try {
    const normalizedSearch = normalizeApplicationSearch(search);
    const searchCondition: ApplicationSearchCondition = normalizedSearch
      ? {
          OR: [
            {
              companyName: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
            {
              jobTitle: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};

    const applications = await dependencies.findApplications({
      where: { userId, ...searchCondition },
      orderBy: [
        { deadline: { sort: "asc", nulls: "last" } },
        { updatedAt: "desc" },
      ],
    });
    return {
      success: true,
      applications: applications.map(serializeApplication),
    };
  } catch {
    return { success: false, message: GENERIC_APPLICATION_LIST_ERROR };
  }
}
