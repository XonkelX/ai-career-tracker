import { describe, expect, it } from "vitest";

import { createApplicationSchema } from "./application";

const schema = createApplicationSchema(new Date("2026-07-16T12:00:00.000Z"));

const validInput = {
  companyName: "  Acme Corp  ",
  jobTitle: "  Senior Engineer  ",
  location: "  Remote  ",
  salaryMin: "85000.50",
  salaryMax: "105000",
  salaryCurrency: " usd ",
  salaryPeriod: "ANNUAL",
  jobUrl: "jobs.example.com/roles/123",
  notes: "  Follow up next week.  ",
  deadline: "2026-07-20",
  status: "SAVED",
};

describe("applicationSchema", () => {
  it("normalizes application fields and converts salary to minor units", () => {
    expect(schema.parse(validInput)).toMatchObject({
      companyName: "Acme Corp",
      jobTitle: "Senior Engineer",
      location: "Remote",
      salaryMinMinor: BigInt(8_500_050),
      salaryMaxMinor: BigInt(10_500_000),
      salaryCurrency: "USD",
      salaryPeriod: "ANNUAL",
      jobUrl: "https://jobs.example.com/roles/123",
      notes: "Follow up next week.",
      deadline: new Date("2026-07-20T00:00:00.000Z"),
      status: "SAVED",
    });
  });

  it("defaults status to Saved and removes blank optional fields", () => {
    const result = schema.parse({
      companyName: "Acme",
      jobTitle: "Engineer",
      location: "",
      salaryMin: "",
      salaryMax: "",
      salaryCurrency: "",
      salaryPeriod: "",
      jobUrl: "",
      notes: "",
      deadline: "",
    });

    expect(result.status).toBe("SAVED");
    expect(result.location).toBeUndefined();
    expect(result.salaryMinMinor).toBeUndefined();
    expect(result.jobUrl).toBeUndefined();
    expect(result.deadline).toBeUndefined();
  });

  it.each([
    ["companyName", { companyName: "" }],
    ["jobTitle", { jobTitle: "" }],
  ] as const)("requires %s", (field, override) => {
    const result = schema.safeParse({ ...validInput, ...override });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors[field]).toBeDefined();
    }
  });

  it("rejects deadlines in the past and impossible calendar dates", () => {
    for (const deadline of ["2026-07-15", "2026-02-30"]) {
      const result = schema.safeParse({ ...validInput, deadline });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.deadline).toBeDefined();
      }
    }
  });

  it("rejects a maximum salary below the minimum", () => {
    const result = schema.safeParse({
      ...validInput,
      salaryMin: "120000",
      salaryMax: "100000",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.salaryMax).toContain(
        "Maximum salary must be greater than or equal to minimum salary.",
      );
    }
  });

  it("rejects salary values outside PostgreSQL bigint range", () => {
    const result = schema.safeParse({
      ...validInput,
      salaryMin: "99999999999999999999",
      salaryMax: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.salaryMin).toContain(
        "Salary amount is too large.",
      );
    }
  });

  it("requires salary metadata and enforces currency minor digits", () => {
    const missingMetadata = schema.safeParse({
      ...validInput,
      salaryCurrency: "",
      salaryPeriod: "",
    });
    expect(missingMetadata.success).toBe(false);
    if (!missingMetadata.success) {
      expect(
        missingMetadata.error.flatten().fieldErrors.salaryCurrency,
      ).toBeDefined();
      expect(
        missingMetadata.error.flatten().fieldErrors.salaryPeriod,
      ).toBeDefined();
    }

    const invalidPrecision = schema.safeParse({
      ...validInput,
      salaryMin: "100.50",
      salaryCurrency: "JPY",
    });
    expect(invalidPrecision.success).toBe(false);
    if (!invalidPrecision.success) {
      expect(
        invalidPrecision.error.flatten().fieldErrors.salaryMin,
      ).toBeDefined();
    }
  });

  it.each(["javascript:alert(1)", "not a url", "ftp://example.com/job"])(
    "rejects unsafe or invalid job URL %s",
    (jobUrl) => {
      const result = schema.safeParse({ ...validInput, jobUrl });
      expect(result.success).toBe(false);
    },
  );
});
