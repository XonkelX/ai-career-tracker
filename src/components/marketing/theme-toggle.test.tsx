import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { THEME_COLORS } from "@/lib/theme";

import { ThemeToggle } from "./theme-toggle";

function createMatchMedia(matches: boolean): MediaQueryList {
  return {
    matches,
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.cookie = "theme=; path=/; max-age=0";
    document.head
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((element) => element.remove());
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => createMatchMedia(false)),
    );
  });

  it("communicates the next theme and stays synchronized after toggling", async () => {
    const user = userEvent.setup();
    const lightThemeColor = document.createElement("meta");
    lightThemeColor.name = "theme-color";
    lightThemeColor.media = "(prefers-color-scheme: light)";
    document.head.append(lightThemeColor);

    const darkThemeColor = document.createElement("meta");
    darkThemeColor.name = "theme-color";
    darkThemeColor.media = "(prefers-color-scheme: dark)";
    document.head.append(darkThemeColor);

    render(<ThemeToggle initialTheme="light" />);

    const toggle = screen.getByRole("button", {
      name: "Switch to dark theme",
    });

    await user.click(toggle);

    expect(toggle).toHaveAccessibleName("Switch to light theme");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(document.cookie).toContain("theme=dark");
    document.head
      .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      .forEach((element) => {
        expect(element.content).toBe(THEME_COLORS.dark);
      });

    await user.click(toggle);

    expect(toggle).toHaveAccessibleName("Switch to dark theme");
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(document.cookie).toContain("theme=light");
    document.head
      .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      .forEach((element) => {
        expect(element.content).toBe(THEME_COLORS.light);
      });
  });

  it("announces switching to light when dark is initially active", () => {
    document.documentElement.dataset.theme = "dark";

    render(<ThemeToggle initialTheme="dark" />);

    expect(
      screen.getByRole("button", { name: "Switch to light theme" }),
    ).toBeInTheDocument();
  });
});
