import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/(dashboard)/resumes/actions", () => ({
  deleteResumeVersionAction: vi.fn().mockResolvedValue({ status: "idle" }),
}));

import { ResumeVersionList } from "./resume-version-list";

describe("ResumeVersionList", () => {
  it("renders a useful empty state", () => {
    render(<ResumeVersionList items={[]} />);
    expect(screen.getByText("No resume versions yet")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Add resume version" }),
    ).toHaveAttribute("href", "/resumes/new");
  });

  it("shows the same essential metadata and actions in responsive presentations", () => {
    render(
      <ResumeVersionList
        items={[
          {
            id: "rv_1",
            name: "Engineering Resume",
            versionLabel: "Frontend v2",
            version: 2,
            description: "React-focused",
            sourceFileName: "frontend.pdf",
            notes: null,
            applicationCount: 3,
            createdAt: "2026-07-16T00:00:00.000Z",
          },
        ]}
      />,
    );
    expect(
      screen.getAllByText("Engineering Resume").length,
    ).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("frontend.pdf")).toHaveLength(2);
    expect(
      screen.getAllByRole("link", {
        name: "Edit Engineering Resume, Frontend v2",
      }),
    ).toHaveLength(2);
    expect(
      screen.getAllByRole("button", {
        name: "Delete Engineering Resume, Frontend v2",
      }),
    ).toHaveLength(2);
  });
});
