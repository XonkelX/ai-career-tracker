import { describe, expect, it } from "vitest";

import {
  formatDashboardDate,
  formatDashboardUpdateTime,
  getDeadlineTiming,
} from "./dashboard-formatters";

describe("dashboard formatters", () => {
  it("formats dates and update times consistently in UTC", () => {
    expect(formatDashboardDate("2026-07-16T00:00:00.000Z")).toBe(
      "Jul 16, 2026",
    );
    expect(formatDashboardUpdateTime("2026-07-16T15:30:00.000Z")).toBe(
      "Jul 16, 2026, 3:30 PM UTC",
    );
  });

  it.each([
    ["2026-07-16T00:00:00.000Z", "Due today"],
    ["2026-07-17T00:00:00.000Z", "Due tomorrow"],
    ["2026-07-20T00:00:00.000Z", "Due in 4 days"],
    ["2026-08-01T00:00:00.000Z", "Upcoming"],
  ])("labels deadline %s as %s", (deadline, label) => {
    expect(getDeadlineTiming(deadline, "2026-07-16T00:00:00.000Z")).toBe(label);
  });
});
