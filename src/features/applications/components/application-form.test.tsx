import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/(dashboard)/applications/new/actions", () => ({
  createJobApplicationAction: vi.fn(async (state) => state),
}));

import { ApplicationForm } from "./application-form";

describe("ApplicationForm", () => {
  it("provides labeled accessible fields and Saved as the default status", () => {
    render(<ApplicationForm today="2026-07-16" />);

    expect(screen.getByRole("textbox", { name: "Company" })).toBeRequired();
    expect(screen.getByRole("textbox", { name: "Job title" })).toBeRequired();
    expect(screen.getByLabelText("Job URL (optional)")).toHaveAttribute(
      "autocomplete",
      "url",
    );
    expect(screen.getByLabelText("Deadline (optional)")).toHaveAttribute(
      "min",
      "2026-07-16",
    );
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveValue(
      "SAVED",
    );
    expect(
      screen.getByRole("button", { name: "Save application" }),
    ).toBeEnabled();
  });
});
