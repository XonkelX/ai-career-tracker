import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ApplicationResumeAssociation } from "./application-resume-association";

describe("ApplicationResumeAssociation", () => {
  it("renders only supplied owned options and preserves the current selection", () => {
    render(
      <ApplicationResumeAssociation
        action={vi.fn(async (state) => state)}
        currentResumeVersionId="rv_1"
        options={[
          {
            id: "rv_1",
            name: "Engineering Resume",
            versionLabel: "Frontend v2",
            version: 2,
          },
        ]}
      />,
    );
    expect(
      screen.getByRole("combobox", { name: "Resume version" }),
    ).toHaveValue("rv_1");
    expect(
      screen.getByRole("option", {
        name: "Engineering Resume — Frontend v2 (Version 2)",
      }),
    ).toBeInTheDocument();
  });

  it("offers creation help when no versions are available", () => {
    render(
      <ApplicationResumeAssociation
        action={vi.fn(async (state) => state)}
        currentResumeVersionId={null}
        options={[]}
      />,
    );
    expect(screen.getByRole("link", { name: "Add one" })).toHaveAttribute(
      "href",
      "/resumes/new",
    );
  });

  it("disables association controls when options cannot be loaded", () => {
    render(
      <ApplicationResumeAssociation
        action={vi.fn(async (state) => state)}
        currentResumeVersionId={null}
        options={[]}
        optionsError
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "could not load your resume versions",
    );
    expect(
      screen.getByRole("combobox", { name: "Resume version" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Save association" }),
    ).toBeDisabled();
  });
});
