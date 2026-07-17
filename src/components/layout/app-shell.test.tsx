import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppShell } from "./app-shell";
import { NAVIGATION_ITEMS } from "./navigation";

const { mockUsePathname } = vi.hoisted(() => ({
  mockUsePathname: vi.fn(),
}));

const signOutAction = vi.fn(async () => undefined);
const shellUser = { email: "taylor@example.com", name: "Taylor Rivera" };

function renderShell() {
  return render(
    <AppShell signOutAction={signOutAction} user={shellUser}>
      <h1>Page content</h1>
    </AppShell>,
  );
}

vi.mock("next/navigation", () => ({
  usePathname: mockUsePathname,
}));

describe("AppShell", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/applications/new");
    signOutAction.mockClear();
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        media: "(prefers-color-scheme: dark)",
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
  });

  it("uses CareerFlow branding and omits AI navigation from Version 1.0", () => {
    renderShell();

    expect(
      screen.getByRole("link", { name: "CareerFlow dashboard" }),
    ).toHaveAttribute("href", "/dashboard");
    expect(NAVIGATION_ITEMS.map(({ label }) => label)).toEqual([
      "Dashboard",
      "Applications",
      "Resumes",
    ]);
  });

  it("marks nested navigation as active and collapses the desktop sidebar", async () => {
    const user = userEvent.setup();
    renderShell();

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
    renderShell();

    const openButton = screen.getByRole("button", {
      name: "Open navigation menu",
    });
    await user.click(openButton);

    const drawer = screen.getByRole("dialog", {
      name: "CareerFlow",
    });
    const closeButton = within(drawer).getByRole("button", {
      name: "Close navigation menu",
    });

    expect(closeButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(
      within(drawer).getByRole("button", { name: "Sign out Taylor Rivera" }),
    ).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(openButton).toHaveFocus();
  });

  it("exposes working theme and sign-out controls without placeholder actions", () => {
    renderShell();

    expect(
      screen.getByRole("button", { name: "Switch to dark theme" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign out Taylor Rivera" }),
    ).toBeInTheDocument();
  });
});
