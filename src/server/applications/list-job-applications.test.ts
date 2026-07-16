import { describe, expect, it, vi } from "vitest";

import {
  GENERIC_APPLICATION_LIST_ERROR,
  listJobApplications,
} from "./list-job-applications";

const record = {
  id: "application_123",
  companyName: "Acme",
  jobTitle: "Engineer",
  location: "Remote",
  status: "APPLIED" as const,
  salaryMinMinor: BigInt(8_500_000),
  salaryMaxMinor: BigInt(10_500_000),
  salaryCurrency: "USD",
  salaryPeriod: "ANNUAL" as const,
  deadline: new Date("2026-08-01T00:00:00.000Z"),
  dateApplied: new Date("2026-07-16T00:00:00.000Z"),
  createdAt: new Date("2026-07-15T10:00:00.000Z"),
  updatedAt: new Date("2026-07-16T11:00:00.000Z"),
};

describe("listJobApplications", () => {
  it("builds a user-scoped null-last query with the required ordering", async () => {
    const findApplications = vi.fn().mockResolvedValue([record]);

    await listJobApplications("user_123", { findApplications });

    expect(findApplications).toHaveBeenCalledWith({
      where: { userId: "user_123" },
      orderBy: [
        { deadline: { sort: "asc", nulls: "last" } },
        { updatedAt: "desc" },
      ],
    });
  });

  it("serializes BigInt and Date values before returning view data", async () => {
    const result = await listJobApplications("user_123", {
      findApplications: vi.fn().mockResolvedValue([record]),
    });

    expect(result).toEqual({
      success: true,
      applications: [
        {
          ...record,
          salaryMinMinor: "8500000",
          salaryMaxMinor: "10500000",
          deadline: "2026-08-01T00:00:00.000Z",
          dateApplied: "2026-07-16T00:00:00.000Z",
          createdAt: "2026-07-15T10:00:00.000Z",
          updatedAt: "2026-07-16T11:00:00.000Z",
        },
      ],
    });
  });

  it("returns a safe generic result for query failures", async () => {
    await expect(
      listJobApplications("user_123", {
        findApplications: vi
          .fn()
          .mockRejectedValue(new Error("database detail")),
      }),
    ).resolves.toEqual({
      success: false,
      message: GENERIC_APPLICATION_LIST_ERROR,
    });
  });
});
