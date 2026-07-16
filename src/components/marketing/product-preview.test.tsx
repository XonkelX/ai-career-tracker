import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ProductPreview } from "./product-preview";

describe("ProductPreview", () => {
  it("keeps every controlled panel mounted and hides inactive panels", async () => {
    const user = userEvent.setup();
    render(<ProductPreview />);

    const pipelineTab = screen.getByRole("tab", { name: "Pipeline" });
    const resumeTab = screen.getByRole("tab", { name: "Resume match" });
    const interviewTab = screen.getByRole("tab", { name: "Interview prep" });

    for (const tab of [pipelineTab, resumeTab, interviewTab]) {
      const panelId = tab.getAttribute("aria-controls");
      expect(panelId).toBeTruthy();
      expect(document.getElementById(panelId as string)).toBeInTheDocument();
    }

    const pipelinePanel = screen.getByRole("tabpanel", {
      name: "Pipeline",
    });
    const resumePanel = document.getElementById("preview-panel-resume");
    const interviewPanel = document.getElementById("preview-panel-interview");

    expect(pipelinePanel).toBeVisible();
    expect(resumePanel).toHaveAttribute("role", "tabpanel");
    expect(interviewPanel).toHaveAttribute("role", "tabpanel");
    expect(resumePanel).not.toBeVisible();
    expect(interviewPanel).not.toBeVisible();

    await user.click(resumeTab);

    expect(pipelinePanel).not.toBeVisible();
    expect(resumePanel).toBeVisible();
    expect(interviewPanel).not.toBeVisible();
  });

  it("supports arrow, Home, and End key navigation", async () => {
    const user = userEvent.setup();
    render(<ProductPreview />);

    const pipelineTab = screen.getByRole("tab", { name: "Pipeline" });
    const resumeTab = screen.getByRole("tab", { name: "Resume match" });
    const interviewTab = screen.getByRole("tab", { name: "Interview prep" });

    pipelineTab.focus();
    await user.keyboard("{ArrowRight}");
    expect(resumeTab).toHaveFocus();
    expect(resumeTab).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowLeft}");
    expect(pipelineTab).toHaveFocus();

    await user.keyboard("{End}");
    expect(interviewTab).toHaveFocus();
    expect(interviewTab).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{Home}");
    expect(pipelineTab).toHaveFocus();
    expect(pipelineTab).toHaveAttribute("aria-selected", "true");
  });
});
