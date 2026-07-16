import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ApplicationListItem } from "@/server/applications/list-job-applications";

import {
  ApplicationList,
  ApplicationListError,
  ApplicationListLoading,
} from "./application-list";

const application: ApplicationListItem = {
  id: "application_123",
  companyName: "Acme",
  jobTitle: "Engineer",
  location: "Remote",
  status: "INTERVIEW",
  salaryMinMinor: "8500000",
  salaryMaxMinor: "10500000",
  salaryCurrency: "USD",
  salaryPeriod: "ANNUAL",
  deadline: "2026-08-01T00:00:00.000Z",
  dateApplied: "2026-07-16T00:00:00.000Z",
  createdAt: "2026-07-15T10:00:00.000Z",
  updatedAt: "2026-07-16T11:00:00.000Z",
};

describe("ApplicationList", () => {
  it("renders equivalent essential data and descriptive links in table and card views", () => {
    render(<ApplicationList applications={[application]} />);

    const table = screen.getByRole("table", {
      name: "Your saved job applications",
    });
    expect(within(table).getByText("Engineer")).toBeVisible();
    expect(within(table).getByText("Interview")).toBeVisible();
    expect(within(table).getByText("Deadline")).toBeVisible();
    expect(within(table).getByText("Applied")).toBeVisible();
    expect(within(table).getByText("Created")).toBeVisible();

    const cards = screen.getByRole("list", {
      name: "Your saved job applications",
    });
    expect(within(cards).getByText("Engineer")).toBeVisible();
    expect(within(cards).getByText("Interview")).toBeVisible();
    expect(
      screen.getAllByRole("link", { name: "View Engineer at Acme" }),
    ).toHaveLength(2);
    expect(screen.getByText("1 application")).toBeVisible();
  });

  it("renders an understandable empty state with a creation link", () => {
    render(<ApplicationList applications={[]} />);

    expect(
      screen.getByRole("heading", { name: "No applications yet" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Add your first application" }),
    ).toHaveAttribute("href", "/applications/new");
  });

  it("renders safe error and non-focusing loading states", () => {
    const { rerender } = render(
      <ApplicationListError message="We could not load your applications. Please try again." />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Applications unavailable",
    );

    rerender(<ApplicationListLoading />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading applications",
    );
    expect(document.activeElement).toBe(document.body);
  });
});
