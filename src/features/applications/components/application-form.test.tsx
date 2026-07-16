import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ApplicationForm } from "./application-form";

describe("ApplicationForm", () => {
  const action = vi.fn(async (state) => state);

  it("provides labeled accessible fields and Saved as the default status", () => {
    render(<ApplicationForm action={action} today="2026-07-16" />);

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

  it("populates every editable field for an existing application", () => {
    render(
      <ApplicationForm
        action={action}
        initialValues={{
          companyName: "Acme Corp",
          jobTitle: "Staff Engineer",
          location: "Remote",
          salaryMin: "85000.50",
          salaryMax: "105000",
          salaryCurrency: "USD",
          salaryPeriod: "ANNUAL",
          jobUrl: "https://example.com/jobs/1",
          notes: "Hiring manager interview",
          deadline: "2026-08-01",
          status: "INTERVIEW",
        }}
        statusReadOnly
        submitLabel="Update application"
        today="2026-07-16"
      />,
    );

    expect(screen.getByRole("textbox", { name: "Company" })).toHaveValue(
      "Acme Corp",
    );
    expect(screen.getByRole("textbox", { name: "Job title" })).toHaveValue(
      "Staff Engineer",
    );
    expect(screen.getByLabelText("Location (optional)")).toHaveValue("Remote");
    expect(screen.getByLabelText("Minimum salary")).toHaveValue(85000.5);
    expect(screen.getByLabelText("Maximum salary")).toHaveValue(105000);
    expect(screen.getByLabelText("Currency")).toHaveValue("USD");
    expect(screen.getByLabelText("Salary period")).toHaveValue("ANNUAL");
    expect(screen.getByLabelText("Job URL (optional)")).toHaveValue(
      "https://example.com/jobs/1",
    );
    expect(screen.getByLabelText("Notes (optional)")).toHaveValue(
      "Hiring manager interview",
    );
    expect(screen.getByLabelText("Deadline (optional)")).toHaveValue(
      "2026-08-01",
    );
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveValue(
      "INTERVIEW",
    );
    expect(screen.getByRole("combobox", { name: "Status" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Update application" }),
    ).toBeEnabled();
  });
});
