import { describe, expect, it, vi } from "vitest";

import {
  calculateInterviewConversionRate,
  GENERIC_DASHBOARD_ERROR,
  getDashboardOverview,
  type GetDashboardOverviewDependencies,
} from "./get-dashboard-overview";

function dependencies(
  overrides: Partial<GetDashboardOverviewDependencies> = {},
): GetDashboardOverviewDependencies {
  return {
    countByStatus: vi.fn().mockResolvedValue([]),
    findUpcoming: vi.fn().mockResolvedValue([]),
    findRecent: vi.fn().mockResolvedValue([]),
    now: () => new Date("2026-07-16T18:30:00.000Z"),
    ...overrides,
  };
}

describe("getDashboardOverview", () => {
  it("uses three bounded user-scoped queries with the required ordering", async () => {
    const deps = dependencies();

    await getDashboardOverview("user_123", deps);

    expect(deps.countByStatus).toHaveBeenCalledWith({
      by: ["status"],
      where: { userId: "user_123" },
      _count: { _all: true },
    });
    expect(deps.findUpcoming).toHaveBeenCalledWith({
      where: {
        userId: "user_123",
        deadline: { gte: new Date("2026-07-16T00:00:00.000Z") },
      },
      orderBy: [{ deadline: "asc" }, { updatedAt: "desc" }],
      take: 5,
    });
    expect(deps.findRecent).toHaveBeenCalledWith({
      where: { userId: "user_123" },
      orderBy: { updatedAt: "desc" },
      take: 5,
    });
  });

  it("builds status metrics, conversion, and serialization-safe lists", async () => {
    const application = {
      id: "application_123",
      companyName: "Acme",
      jobTitle: "Engineer",
      status: "INTERVIEW" as const,
      deadline: new Date("2026-07-18T00:00:00.000Z"),
      updatedAt: new Date("2026-07-16T15:30:00.000Z"),
    };
    const result = await getDashboardOverview(
      "user_123",
      dependencies({
        countByStatus: vi.fn().mockResolvedValue([
          { status: "SAVED", _count: { _all: 2 } },
          { status: "APPLIED", _count: { _all: 2 } },
          { status: "INTERVIEW", _count: { _all: 1 } },
          { status: "OFFER", _count: { _all: 1 } },
          { status: "REJECTED", _count: { _all: 1 } },
        ]),
        findUpcoming: vi.fn().mockResolvedValue([application]),
        findRecent: vi.fn().mockResolvedValue([application]),
      }),
    );

    expect(result).toEqual({
      success: true,
      overview: {
        asOfDate: "2026-07-16T00:00:00.000Z",
        counts: {
          total: 7,
          SAVED: 2,
          APPLIED: 2,
          INTERVIEW: 1,
          OFFER: 1,
          REJECTED: 1,
        },
        interviewConversionRate: 60,
        upcomingDeadlines: [
          {
            ...application,
            deadline: "2026-07-18T00:00:00.000Z",
            updatedAt: "2026-07-16T15:30:00.000Z",
          },
        ],
        recentApplications: [
          {
            ...application,
            deadline: "2026-07-18T00:00:00.000Z",
            updatedAt: "2026-07-16T15:30:00.000Z",
          },
        ],
      },
    });
  });

  it("keeps the documented conversion definition stable", () => {
    expect(
      calculateInterviewConversionRate({
        APPLIED: 2,
        INTERVIEW: 1,
        OFFER: 1,
        REJECTED: 1,
      }),
    ).toBe(60);
    expect(
      calculateInterviewConversionRate({
        APPLIED: 0,
        INTERVIEW: 0,
        OFFER: 0,
        REJECTED: 0,
      }),
    ).toBe(0);
  });

  it("returns a safe generic error when any query fails", async () => {
    await expect(
      getDashboardOverview(
        "user_123",
        dependencies({
          countByStatus: vi
            .fn()
            .mockRejectedValue(new Error("sensitive database detail")),
        }),
      ),
    ).resolves.toEqual({
      success: false,
      message: GENERIC_DASHBOARD_ERROR,
    });
  });
});
