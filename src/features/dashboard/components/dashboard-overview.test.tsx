import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { DashboardOverview as DashboardOverviewData } from "@/server/dashboard/get-dashboard-overview";

import {
  DashboardError,
  DashboardLoading,
  DashboardOverview,
} from "./dashboard-overview";

const overview: DashboardOverviewData = {
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
      id: "deadline_1",
      companyName: "Acme",
      jobTitle: "Engineer",
      status: "INTERVIEW",
      deadline: "2026-07-16T00:00:00.000Z",
      updatedAt: "2026-07-16T15:30:00.000Z",
    },
  ],
  recentApplications: [
    {
      id: "recent_1",
      companyName: "Northstar",
      jobTitle: "Platform Engineer",
      status: "OFFER",
      updatedAt: "2026-07-16T15:30:00.000Z",
    },
  ],
};

describe("DashboardOverview", () => {
  it("renders textual metrics, status breakdown, deadlines, and recent updates", () => {
    render(<DashboardOverview overview={overview} />);

    const summary = screen
      .getByRole("heading", { name: "Application summary" })
      .closest("section");
    expect(summary).toBeDefined();
    if (!summary) return;
    expect(within(summary).getByText("Total applications")).toBeVisible();
    expect(within(summary).getByText("7")).toBeVisible();
    expect(
      screen.getByLabelText("Interview conversion rate: 60 percent"),
    ).toBeVisible();
    expect(screen.getByText("Due today")).toBeVisible();
    expect(
      screen.getByRole("link", {
        name: "Edit Engineer at Acme, deadline Jul 16, 2026",
      }),
    ).toHaveAttribute("href", "/applications/deadline_1/edit");
    const recentSection = screen
      .getByRole("heading", { name: "Recently updated" })
      .closest("section");
    expect(recentSection).not.toBeNull();
    expect(within(recentSection!).getByText("Offer")).toBeVisible();
    expect(
      within(recentSection!).getByText("Updated Jul 16, 2026, 3:30 PM UTC"),
    ).toBeVisible();
  });

  it("renders a useful empty state", () => {
    render(
      <DashboardOverview
        overview={{
          ...overview,
          counts: {
            total: 0,
            SAVED: 0,
            APPLIED: 0,
            INTERVIEW: 0,
            OFFER: 0,
            REJECTED: 0,
          },
          interviewConversionRate: 0,
          upcomingDeadlines: [],
          recentApplications: [],
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Start tracking your job search" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Add your first application" }),
    ).toHaveAttribute("href", "/applications/new");
  });

  it("renders safe error and non-focusing loading states", () => {
    const { rerender } = render(
      <DashboardError message="We could not load your dashboard. Please try again." />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Dashboard unavailable",
    );

    rerender(<DashboardLoading />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading dashboard");
    expect(document.activeElement).toBe(document.body);
  });
});
