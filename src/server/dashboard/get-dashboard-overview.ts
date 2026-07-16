import type { ApplicationStatus } from "@/generated/prisma/client";
import { APPLICATION_STATUSES } from "@/lib/constants/application-status";

export const GENERIC_DASHBOARD_ERROR =
  "We could not load your dashboard. Please try again.";

interface StatusCountRecord {
  status: ApplicationStatus;
  _count: { _all: number };
}

interface DashboardApplicationRecord {
  id: string;
  companyName: string;
  jobTitle: string;
  status: ApplicationStatus;
  deadline?: Date | null;
  updatedAt: Date;
}

interface DashboardApplicationItem {
  id: string;
  companyName: string;
  jobTitle: string;
  status: ApplicationStatus;
  deadline?: string | null;
  updatedAt: string;
}

export interface DashboardOverview {
  asOfDate: string;
  counts: Record<ApplicationStatus, number> & { total: number };
  interviewConversionRate: number;
  upcomingDeadlines: DashboardApplicationItem[];
  recentApplications: DashboardApplicationItem[];
}

export interface GetDashboardOverviewDependencies {
  countByStatus(query: {
    by: ["status"];
    where: { userId: string };
    _count: { _all: true };
  }): Promise<StatusCountRecord[]>;
  findUpcoming(query: {
    where: { userId: string; deadline: { gte: Date } };
    orderBy: [{ deadline: "asc" }, { updatedAt: "desc" }];
    take: 5;
  }): Promise<DashboardApplicationRecord[]>;
  findRecent(query: {
    where: { userId: string };
    orderBy: { updatedAt: "desc" };
    take: 5;
  }): Promise<DashboardApplicationRecord[]>;
  now?: () => Date;
}

async function countByStatus(query: {
  by: ["status"];
  where: { userId: string };
  _count: { _all: true };
}): Promise<StatusCountRecord[]> {
  const { prisma } = await import("@/server/db/client");
  const result = await prisma.jobApplication.groupBy({
    by: ["status"],
    where: query.where,
    _count: { _all: true },
  });

  return result;
}

async function findUpcoming(query: {
  where: { userId: string; deadline: { gte: Date } };
  orderBy: [{ deadline: "asc" }, { updatedAt: "desc" }];
  take: 5;
}): Promise<DashboardApplicationRecord[]> {
  const { prisma } = await import("@/server/db/client");
  return prisma.jobApplication.findMany({
    ...query,
    select: {
      id: true,
      companyName: true,
      jobTitle: true,
      status: true,
      deadline: true,
      updatedAt: true,
    },
  });
}

async function findRecent(query: {
  where: { userId: string };
  orderBy: { updatedAt: "desc" };
  take: 5;
}): Promise<DashboardApplicationRecord[]> {
  const { prisma } = await import("@/server/db/client");
  return prisma.jobApplication.findMany({
    ...query,
    select: {
      id: true,
      companyName: true,
      jobTitle: true,
      status: true,
      updatedAt: true,
    },
  });
}

const defaultDependencies: GetDashboardOverviewDependencies = {
  countByStatus,
  findUpcoming,
  findRecent,
  now: () => new Date(),
};

function startOfUtcDate(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function serializeApplication(
  application: DashboardApplicationRecord,
): DashboardApplicationItem {
  return {
    ...application,
    deadline: application.deadline?.toISOString() ?? null,
    updatedAt: application.updatedAt.toISOString(),
  };
}

function buildCounts(
  groupedCounts: StatusCountRecord[],
): DashboardOverview["counts"] {
  const counts = Object.fromEntries(
    APPLICATION_STATUSES.map((status) => [status, 0]),
  ) as Record<ApplicationStatus, number>;

  for (const group of groupedCounts) counts[group.status] = group._count._all;

  return {
    ...counts,
    total: APPLICATION_STATUSES.reduce(
      (total, status) => total + counts[status],
      0,
    ),
  };
}

/**
 * Submitted = APPLIED + INTERVIEW + OFFER + REJECTED.
 * Reached interview = INTERVIEW + OFFER + REJECTED.
 * The displayed rate is reached/submitted, rounded to the nearest whole
 * percent, and is 0 when there are no submitted applications.
 */
export function calculateInterviewConversionRate(
  counts: Pick<
    DashboardOverview["counts"],
    "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED"
  >,
): number {
  const submitted =
    counts.APPLIED + counts.INTERVIEW + counts.OFFER + counts.REJECTED;
  if (submitted === 0) return 0;

  const reachedInterview = counts.INTERVIEW + counts.OFFER + counts.REJECTED;
  return Math.round((reachedInterview / submitted) * 100);
}

export async function getDashboardOverview(
  userId: string,
  dependencies: GetDashboardOverviewDependencies = defaultDependencies,
): Promise<
  | { success: true; overview: DashboardOverview }
  | { success: false; message: string }
> {
  try {
    const today = startOfUtcDate(dependencies.now?.() ?? new Date());
    const [groupedCounts, upcomingDeadlines, recentApplications] =
      await Promise.all([
        dependencies.countByStatus({
          by: ["status"],
          where: { userId },
          _count: { _all: true },
        }),
        dependencies.findUpcoming({
          where: { userId, deadline: { gte: today } },
          orderBy: [{ deadline: "asc" }, { updatedAt: "desc" }],
          take: 5,
        }),
        dependencies.findRecent({
          where: { userId },
          orderBy: { updatedAt: "desc" },
          take: 5,
        }),
      ]);
    const counts = buildCounts(groupedCounts);

    return {
      success: true,
      overview: {
        asOfDate: today.toISOString(),
        counts,
        interviewConversionRate: calculateInterviewConversionRate(counts),
        upcomingDeadlines: upcomingDeadlines.map(serializeApplication),
        recentApplications: recentApplications.map(serializeApplication),
      },
    };
  } catch {
    return { success: false, message: GENERIC_DASHBOARD_ERROR };
  }
}
