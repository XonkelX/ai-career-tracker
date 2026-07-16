import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppShell } from "./app-shell";

const { mockUsePathname } = vi.hoisted(() => ({
  mockUsePathname: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: mockUsePathname,
}));

describe("AppShell", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/applications/new");
  });

  it("marks nested navigation as active and collapses the desktop sidebar", async () => {
    const user = userEvent.setup();
    render(
      <AppShell>
        <h1>Page content</h1>
      </AppShell>,
    );

    expect(screen.getByRole("link", { name: "Applications" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    const collapseButton = screen.getByRole("button", {
      name: "Collapse sidebar",
    });
    expect(collapseButton).toHaveAttribute("aria-expanded", "true");

    await user.click(collapseButton);

    expect(
      screen.getByRole("button", { name: "Expand sidebar" }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("manages focus, traps Tab, and restores focus when Escape closes the drawer", async () => {
    const user = userEvent.setup();
    render(
      <AppShell>
        <h1>Page content</h1>
      </AppShell>,
    );

    const openButton = screen.getByRole("button", {
      name: "Open navigation menu",
    });
    await user.click(openButton);

    const drawer = screen.getByRole("dialog", {
      name: "AI Career Tracker",
    });
    const closeButton = within(drawer).getByRole("button", {
      name: "Close navigation menu",
    });

    expect(closeButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(
      within(drawer).getByRole("link", { name: "Settings" }),
    ).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(openButton).toHaveFocus();
  });

  it("provides placeholder feedback for every keyboard shortcut", async () => {
    const user = userEvent.setup();
    render(
      <AppShell>
        <h1>Page content</h1>
      </AppShell>,
    );

    const status = screen.getByRole("status");

    await user.keyboard("{Control>}k{/Control}");
    expect(status).toHaveTextContent(
      "The command palette is not available in this milestone.",
    );

    await user.keyboard("/");
    expect(status).toHaveTextContent(
      "Search is not available in this milestone.",
    );

    await user.keyboard("?");
    expect(status).toHaveTextContent(
      "Available shortcuts: Control or Command K for commands, slash for search, and question mark for this help.",
    );
  });
});
