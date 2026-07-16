import { describe, expect, it, vi } from "vitest";

import { normalizeApplicationSearch } from "@/features/applications/application-list-filters";

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

    await listJobApplications("user_123", {}, { findApplications });

    expect(findApplications).toHaveBeenCalledWith({
      where: { userId: "user_123" },
      orderBy: [
        { deadline: { sort: "asc", nulls: "last" } },
        { updatedAt: "desc" },
      ],
    });
  });

  it("normalizes whitespace and builds a case-insensitive company-or-title search", async () => {
    const findApplications = vi.fn().mockResolvedValue([]);

    await listJobApplications(
      "user_123",
      { search: "  Acme   Labs  " },
      {
        findApplications,
      },
    );

    expect(normalizeApplicationSearch("  Acme   Labs  ")).toBe("Acme Labs");
    expect(findApplications).toHaveBeenCalledWith({
      where: {
        userId: "user_123",
        AND: [
          {
            OR: [
              {
                companyName: {
                  contains: "Acme Labs",
                  mode: "insensitive",
                },
              },
              {
                jobTitle: {
                  contains: "Acme Labs",
                  mode: "insensitive",
                },
              },
            ],
          },
        ],
      },
      orderBy: [
        { deadline: { sort: "asc", nulls: "last" } },
        { updatedAt: "desc" },
      ],
    });
  });

  it("omits search predicates for a whitespace-only search", async () => {
    const findApplications = vi.fn().mockResolvedValue([]);

    await listJobApplications(
      "user_123",
      { search: " \t " },
      {
        findApplications,
      },
    );

    expect(findApplications).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user_123" } }),
    );
  });

  it("combines search, status, salary, and deadline filters through AND", async () => {
    const findApplications = vi.fn().mockResolvedValue([]);

    await listJobApplications(
      "user_123",
      {
        asOf: new Date("2026-07-16T18:30:00.000Z"),
        search: "platform",
        status: "INTERVIEW",
        salary: "with-salary",
        deadline: "upcoming",
      },
      { findApplications },
    );

    expect(findApplications).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId: "user_123",
          AND: [
            {
              OR: [
                {
                  companyName: {
                    contains: "platform",
                    mode: "insensitive",
                  },
                },
                {
                  jobTitle: {
                    contains: "platform",
                    mode: "insensitive",
                  },
                },
              ],
            },
            { status: "INTERVIEW" },
            {
              OR: [
                { salaryMinMinor: { not: null } },
                { salaryMaxMinor: { not: null } },
              ],
            },
            { deadline: { gte: new Date("2026-07-16T00:00:00.000Z") } },
          ],
        },
      }),
    );
  });

  it.each([
    [
      "without-salary" as const,
      { AND: [{ salaryMinMinor: null }, { salaryMaxMinor: null }] },
    ],
  ])("builds the %s salary predicate", async (salary, expected) => {
    const findApplications = vi.fn().mockResolvedValue([]);
    await listJobApplications("user_123", { salary }, { findApplications });
    expect(findApplications).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user_123", AND: [expected] },
      }),
    );
  });

  it.each([
    [
      "overdue" as const,
      { deadline: { lt: new Date("2026-07-16T00:00:00.000Z") } },
    ],
    ["no-deadline" as const, { deadline: null }],
  ])("builds the %s deadline predicate", async (deadline, expected) => {
    const findApplications = vi.fn().mockResolvedValue([]);
    await listJobApplications(
      "user_123",
      { asOf: new Date("2026-07-16T23:59:59.000Z"), deadline },
      { findApplications },
    );
    expect(findApplications).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user_123", AND: [expected] },
      }),
    );
  });

  it("serializes BigInt and Date values before returning view data", async () => {
    const result = await listJobApplications(
      "user_123",
      {},
      {
        findApplications: vi.fn().mockResolvedValue([record]),
      },
    );

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
      listJobApplications(
        "user_123",
        {},
        {
          findApplications: vi
            .fn()
            .mockRejectedValue(new Error("database detail")),
        },
      ),
    ).resolves.toEqual({
      success: false,
      message: GENERIC_APPLICATION_LIST_ERROR,
    });
  });
});
