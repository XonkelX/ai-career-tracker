import { describe, expect, it } from "vitest";

import {
  formatApplicationDate,
  formatSalaryRange,
} from "./application-formatters";

describe("application list formatters", () => {
  it("formats a salary range using its currency and period", () => {
    expect(
      formatSalaryRange({
        salaryMinMinor: "8500050",
        salaryMaxMinor: "10500000",
        salaryCurrency: "USD",
        salaryPeriod: "ANNUAL",
      }),
    ).toBe("$85,000.50 – $105,000.00 / year");
  });

  it("supports currencies with zero minor digits", () => {
    expect(
      formatSalaryRange({
        salaryMinMinor: "85000",
        salaryMaxMinor: null,
        salaryCurrency: "JPY",
        salaryPeriod: "ANNUAL",
      }),
    ).toBe("From ¥85,000 / year");
  });

  it("handles unknown and malformed currency metadata safely", () => {
    expect(
      formatSalaryRange({
        salaryMinMinor: "8500000",
        salaryMaxMinor: null,
        salaryCurrency: "ZZZ",
        salaryPeriod: null,
      }),
    ).toContain("ZZZ");
    expect(
      formatSalaryRange({
        salaryMinMinor: "8500000",
        salaryMaxMinor: null,
        salaryCurrency: "?",
        salaryPeriod: null,
      }),
    ).toBe("From Currency 85000.00");
  });

  it("formats dates in UTC and safely handles invalid values", () => {
    expect(formatApplicationDate("2026-08-01T00:00:00.000Z")).toBe(
      "Aug 1, 2026",
    );
    expect(formatApplicationDate("invalid")).toBe("Date unavailable");
    expect(formatApplicationDate(null)).toBeNull();
  });
});
