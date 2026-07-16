import { describe, expect, it, vi } from "vitest";

import { createApplicationSchema } from "@/schemas/applications/application";

import {
  createJobApplication,
  GENERIC_APPLICATION_ERROR,
} from "./create-job-application";

const input = createApplicationSchema(
  new Date("2026-07-16T12:00:00.000Z"),
).parse({
  companyName: "Acme",
  jobTitle: "Engineer",
  location: "Remote",
  salaryMin: "85000",
  salaryMax: "105000",
  salaryCurrency: "USD",
  salaryPeriod: "ANNUAL",
  jobUrl: "https://example.com/job",
  notes: "Follow up",
  deadline: "2026-07-20",
  status: "APPLIED",
});

describe("createJobApplication", () => {
  it("creates an application scoped to the authenticated user", async () => {
    const createApplication = vi.fn().mockResolvedValue(undefined);

    await expect(
      createJobApplication("user_123", input, {
        createApplication,
        now: () => new Date("2026-07-16T18:30:00.000Z"),
      }),
    ).resolves.toEqual({ success: true });
    expect(createApplication).toHaveBeenCalledWith({
      userId: "user_123",
      companyName: "Acme",
      jobTitle: "Engineer",
      location: "Remote",
      salaryMinMinor: BigInt(8_500_000),
      salaryMaxMinor: BigInt(10_500_000),
      salaryCurrency: "USD",
      salaryPeriod: "ANNUAL",
      jobUrl: "https://example.com/job",
      notes: "Follow up",
      deadline: new Date("2026-07-20T00:00:00.000Z"),
      dateApplied: new Date("2026-07-16T00:00:00.000Z"),
      status: "APPLIED",
    });
  });

  it("stores null dateApplied for a new Saved application", async () => {
    const createApplication = vi.fn().mockResolvedValue(undefined);

    await createJobApplication(
      "user_123",
      { ...input, status: "SAVED" },
      { createApplication },
    );

    expect(createApplication).toHaveBeenCalledWith(
      expect.objectContaining({ status: "SAVED", dateApplied: null }),
    );
  });

  it("sets dateApplied to the current date for a new Applied application", async () => {
    const createApplication = vi.fn().mockResolvedValue(undefined);

    await createJobApplication("user_123", input, {
      createApplication,
      now: () => new Date("2026-07-16T23:59:59.000Z"),
    });

    expect(createApplication).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "APPLIED",
        dateApplied: new Date("2026-07-16T00:00:00.000Z"),
      }),
    );
  });

  it.each(["INTERVIEW", "OFFER", "REJECTED"] as const)(
    "sets dateApplied for the later %s status",
    async (status) => {
      const createApplication = vi.fn().mockResolvedValue(undefined);

      await createJobApplication(
        "user_123",
        { ...input, status },
        {
          createApplication,
          now: () => new Date("2026-07-16T12:00:00.000Z"),
        },
      );

      expect(createApplication).toHaveBeenCalledWith(
        expect.objectContaining({
          status,
          dateApplied: new Date("2026-07-16T00:00:00.000Z"),
        }),
      );
    },
  );

  it("preserves an explicit internal dateApplied value", async () => {
    const createApplication = vi.fn().mockResolvedValue(undefined);
    const explicitDate = new Date("2026-07-10T00:00:00.000Z");

    await createJobApplication(
      "user_123",
      { ...input, status: "OFFER", dateApplied: explicitDate },
      {
        createApplication,
        now: () => new Date("2026-07-16T12:00:00.000Z"),
      },
    );

    expect(createApplication).toHaveBeenCalledWith(
      expect.objectContaining({ dateApplied: explicitDate }),
    );
  });

  it("returns a generic error for persistence failures", async () => {
    await expect(
      createJobApplication("user_123", input, {
        createApplication: vi
          .fn()
          .mockRejectedValue(new Error("database down")),
        now: () => new Date("2026-07-16T12:00:00.000Z"),
      }),
    ).resolves.toEqual({ success: false, message: GENERIC_APPLICATION_ERROR });
  });
});
