import { describe, expect, it, vi } from "vitest";

import { createApplicationSchema } from "@/schemas/applications/application";

import {
  GENERIC_APPLICATION_UPDATE_ERROR,
  updateJobApplication,
} from "./update-job-application";

const input = createApplicationSchema(
  new Date("2026-07-16T12:00:00.000Z"),
).parse({
  companyName: "Acme",
  jobTitle: "Staff Engineer",
  location: "Remote",
  salaryMin: "85000.50",
  salaryMax: "105000",
  salaryCurrency: "USD",
  salaryPeriod: "ANNUAL",
  jobUrl: "jobs.example.com/role",
  notes: "Follow up",
  deadline: "2026-08-01",
  status: "APPLIED",
});

describe("updateJobApplication", () => {
  it("updates by application ID and user ID without writing createdAt", async () => {
    const findApplication = vi
      .fn()
      .mockResolvedValue({ dateApplied: null, status: "APPLIED" });
    const updateApplication = vi.fn().mockResolvedValue({ count: 1 });

    await expect(
      updateJobApplication("user_123", "application_123", input, {
        findApplication,
        updateApplication,
        now: () => new Date("2026-07-16T20:00:00.000Z"),
      }),
    ).resolves.toEqual({ status: "success" });

    const where = { id: "application_123", userId: "user_123" };
    expect(findApplication).toHaveBeenCalledWith(where);
    expect(updateApplication).toHaveBeenCalledWith({
      where,
      data: {
        companyName: "Acme",
        jobTitle: "Staff Engineer",
        location: "Remote",
        salaryMinMinor: BigInt(8_500_050),
        salaryMaxMinor: BigInt(10_500_000),
        salaryCurrency: "USD",
        salaryPeriod: "ANNUAL",
        jobUrl: "https://jobs.example.com/role",
        notes: "Follow up",
        deadline: new Date("2026-08-01T00:00:00.000Z"),
        dateApplied: new Date("2026-07-16T00:00:00.000Z"),
        status: "APPLIED",
      },
    });
    expect(updateApplication.mock.calls[0]?.[0].data).not.toHaveProperty(
      "createdAt",
    );
    expect(updateApplication.mock.calls[0]?.[0].data).not.toHaveProperty(
      "updatedAt",
    );
  });

  it("preserves trusted status and dateApplied when client status is tampered", async () => {
    const existingDate = new Date("2026-07-10T00:00:00.000Z");
    const updateApplication = vi.fn().mockResolvedValue({ count: 1 });

    await updateJobApplication(
      "user_123",
      "application_123",
      { ...input, status: "SAVED" },
      {
        findApplication: vi.fn().mockResolvedValue({
          dateApplied: existingDate,
          status: "INTERVIEW",
        }),
        updateApplication,
      },
    );

    expect(updateApplication).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          dateApplied: existingDate,
          status: "INTERVIEW",
        }),
      }),
    );
  });

  it("returns not found and does not update an unowned application", async () => {
    const updateApplication = vi.fn();

    await expect(
      updateJobApplication("user_123", "private_application", input, {
        findApplication: vi.fn().mockResolvedValue(null),
        updateApplication,
      }),
    ).resolves.toEqual({ status: "not_found" });
    expect(updateApplication).not.toHaveBeenCalled();
  });

  it("treats a disappeared record as not found", async () => {
    await expect(
      updateJobApplication("user_123", "application_123", input, {
        findApplication: vi
          .fn()
          .mockResolvedValue({ dateApplied: null, status: "APPLIED" }),
        updateApplication: vi.fn().mockResolvedValue({ count: 0 }),
      }),
    ).resolves.toEqual({ status: "not_found" });
  });

  it("returns a generic error for persistence failures", async () => {
    await expect(
      updateJobApplication("user_123", "application_123", input, {
        findApplication: vi
          .fn()
          .mockResolvedValue({ dateApplied: null, status: "APPLIED" }),
        updateApplication: vi
          .fn()
          .mockRejectedValue(new Error("sensitive database error")),
      }),
    ).resolves.toEqual({
      status: "error",
      message: GENERIC_APPLICATION_UPDATE_ERROR,
    });
  });
});
