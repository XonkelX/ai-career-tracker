import { describe, expect, it, vi } from "vitest";

import {
  GENERIC_APPLICATION_LOAD_ERROR,
  getJobApplicationForEdit,
} from "./get-job-application-for-edit";

const record = {
  resumeVersionId: "resume_version_123",
  companyName: "Acme",
  jobTitle: "Engineer",
  location: "Remote",
  salaryMinMinor: BigInt(8_500_050),
  salaryMaxMinor: BigInt(10_500_000),
  salaryCurrency: "USD",
  salaryPeriod: "ANNUAL" as const,
  jobUrl: "https://example.com/job",
  notes: "Follow up",
  deadline: new Date("2026-08-01T00:00:00.000Z"),
  status: "INTERVIEW" as const,
};

describe("getJobApplicationForEdit", () => {
  it("loads an editable application with an ownership-scoped predicate", async () => {
    const findApplication = vi.fn().mockResolvedValue(record);

    await expect(
      getJobApplicationForEdit("user_123", "application_123", {
        findApplication,
      }),
    ).resolves.toEqual({
      status: "success",
      resumeVersionId: "resume_version_123",
      values: {
        companyName: "Acme",
        jobTitle: "Engineer",
        location: "Remote",
        salaryMin: "85000.50",
        salaryMax: "105000.00",
        salaryCurrency: "USD",
        salaryPeriod: "ANNUAL",
        jobUrl: "https://example.com/job",
        notes: "Follow up",
        deadline: "2026-08-01",
        status: "INTERVIEW",
      },
    });
    expect(findApplication).toHaveBeenCalledWith({
      where: { id: "application_123", userId: "user_123" },
    });
  });

  it("returns not found without distinguishing missing and unowned records", async () => {
    await expect(
      getJobApplicationForEdit("user_123", "private_application", {
        findApplication: vi.fn().mockResolvedValue(null),
      }),
    ).resolves.toEqual({ status: "not_found" });
  });

  it("returns a generic error when loading fails", async () => {
    await expect(
      getJobApplicationForEdit("user_123", "application_123", {
        findApplication: vi.fn().mockRejectedValue(new Error("database down")),
      }),
    ).resolves.toEqual({
      status: "error",
      message: GENERIC_APPLICATION_LOAD_ERROR,
    });
  });
});
