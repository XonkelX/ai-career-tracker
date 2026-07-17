import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ResumeVersionForm } from "./resume-version-form";

describe("ResumeVersionForm", () => {
  it("exposes labeled fields and metadata-only guidance", () => {
    render(<ResumeVersionForm action={vi.fn(async (state) => state)} />);
    expect(screen.getByRole("textbox", { name: "Name" })).toBeRequired();
    expect(
      screen.getByRole("textbox", { name: "Version label" }),
    ).toBeRequired();
    expect(
      screen.getByText("Metadata only. No file will be uploaded."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save resume version" }),
    ).toBeEnabled();
  });

  it("focuses a connected error summary after a failed action", async () => {
    const action = vi.fn(async () => ({
      status: "error" as const,
      message: "Correct the highlighted fields and try again.",
      fieldErrors: { name: ["Name is required."] },
    }));
    render(<ResumeVersionForm action={action} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Save resume version" }),
    );
    const summary = await screen.findByRole("alert");
    await waitFor(() => expect(summary).toHaveFocus());
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute(
      "aria-describedby",
      "name-error",
    );
  });
});
