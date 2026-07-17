import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ProductPreview } from "./product-preview";

describe("ProductPreview", () => {
  it("keeps every controlled panel mounted and hides inactive panels", async () => {
    const user = userEvent.setup();
    render(<ProductPreview />);

    const pipelineTab = screen.getByRole("tab", { name: "Pipeline" });
    const dashboardTab = screen.getByRole("tab", { name: "Dashboard" });
    const resumesTab = screen.getByRole("tab", { name: "Resume versions" });

    for (const tab of [pipelineTab, dashboardTab, resumesTab]) {
      const panelId = tab.getAttribute("aria-controls");
      expect(panelId).toBeTruthy();
      expect(document.getElementById(panelId as string)).toBeInTheDocument();
    }

    const pipelinePanel = screen.getByRole("tabpanel", {
      name: "Pipeline",
    });
    const dashboardPanel = document.getElementById("preview-panel-dashboard");
    const resumesPanel = document.getElementById("preview-panel-resumes");

    expect(pipelinePanel).toBeVisible();
    expect(dashboardPanel).toHaveAttribute("role", "tabpanel");
    expect(resumesPanel).toHaveAttribute("role", "tabpanel");
    expect(dashboardPanel).not.toBeVisible();
    expect(resumesPanel).not.toBeVisible();

    await user.click(dashboardTab);

    expect(pipelinePanel).not.toBeVisible();
    expect(dashboardPanel).toBeVisible();
    expect(resumesPanel).not.toBeVisible();
  });

  it("supports arrow, Home, and End key navigation", async () => {
    const user = userEvent.setup();
    render(<ProductPreview />);

    const pipelineTab = screen.getByRole("tab", { name: "Pipeline" });
    const dashboardTab = screen.getByRole("tab", { name: "Dashboard" });
    const resumesTab = screen.getByRole("tab", { name: "Resume versions" });

    pipelineTab.focus();
    await user.keyboard("{ArrowRight}");
    expect(dashboardTab).toHaveFocus();
    expect(dashboardTab).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowLeft}");
    expect(pipelineTab).toHaveFocus();

    await user.keyboard("{End}");
    expect(resumesTab).toHaveFocus();
    expect(resumesTab).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{Home}");
    expect(pipelineTab).toHaveFocus();
    expect(pipelineTab).toHaveAttribute("aria-selected", "true");
  });
});
