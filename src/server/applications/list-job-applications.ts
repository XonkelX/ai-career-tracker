import type {
  ApplicationStatus,
  SalaryPeriod,
} from "@/generated/prisma/client";
import type {
  DeadlineFilter,
  SalaryFilter,
} from "@/features/applications/application-list-filters";
import { normalizeApplicationSearch } from "@/features/applications/application-list-filters";

export const GENERIC_APPLICATION_LIST_ERROR =
  "We could not load your applications. Please try again.";

type ApplicationFilterCondition =
  | {
      OR: [
        { companyName: { contains: string; mode: "insensitive" } },
        { jobTitle: { contains: string; mode: "insensitive" } },
      ];
    }
  | { status: ApplicationStatus }
  | {
      OR: [
        { salaryMinMinor: { not: null } },
        { salaryMaxMinor: { not: null } },
      ];
    }
  | { AND: [{ salaryMinMinor: null }, { salaryMaxMinor: null }] }
  | { deadline: { gte: Date } }
  | { deadline: { lt: Date } }
  | { deadline: null };

interface ApplicationListWhere {
  userId: string;
  AND?: ApplicationFilterCondition[];
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

function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function buildSalaryCondition(
  salary: SalaryFilter,
): ApplicationFilterCondition | null {
  if (salary === "with-salary") {
    return {
      OR: [
        { salaryMinMinor: { not: null } },
        { salaryMaxMinor: { not: null } },
      ],
    };
  }
  if (salary === "without-salary") {
    return {
      AND: [{ salaryMinMinor: null }, { salaryMaxMinor: null }],
    };
  }
  return null;
}

function buildDeadlineCondition(
  deadline: DeadlineFilter,
  today: Date,
): ApplicationFilterCondition | null {
  if (deadline === "upcoming") return { deadline: { gte: today } };
  if (deadline === "overdue") return { deadline: { lt: today } };
  if (deadline === "no-deadline") return { deadline: null };
  return null;
}

export interface ListJobApplicationsOptions {
  asOf?: Date;
  search?: string;
  status?: ApplicationStatus | null;
  salary?: SalaryFilter;
  deadline?: DeadlineFilter;
}

export async function listJobApplications(
  userId: string,
  options: ListJobApplicationsOptions = {},
  dependencies: ListJobApplicationsDependencies = defaultDependencies,
): Promise<
  | { success: true; applications: ApplicationListItem[] }
  | { success: false; message: string }
> {
  try {
    const normalizedSearch = normalizeApplicationSearch(options.search ?? "");
    const conditions: ApplicationFilterCondition[] = [];
    if (normalizedSearch) {
      conditions.push({
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
      });
    }
    if (options.status) conditions.push({ status: options.status });

    const salaryCondition = buildSalaryCondition(options.salary ?? "any");
    if (salaryCondition) conditions.push(salaryCondition);

    const deadlineCondition = buildDeadlineCondition(
      options.deadline ?? "any",
      startOfUtcDay(options.asOf ?? new Date()),
    );
    if (deadlineCondition) conditions.push(deadlineCondition);

    const applications = await dependencies.findApplications({
      where: {
        userId,
        ...(conditions.length > 0 ? { AND: conditions } : {}),
      },
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
