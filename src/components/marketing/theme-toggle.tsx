"use client";

import { useSyncExternalStore } from "react";

import { THEME_COLORS, type Theme } from "@/lib/theme";

import { MoonIcon, SunIcon } from "./icons";

const THEME_CHANGE_EVENT = "careerflow:theme-change";

function getResolvedTheme(): Theme {
  const explicitTheme = document.documentElement.dataset.theme;

  if (explicitTheme === "light" || explicitTheme === "dark") {
    return explicitTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function subscribeToTheme(onStoreChange: () => void) {
  const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
  colorScheme.addEventListener("change", onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);

  return () => {
    colorScheme.removeEventListener("change", onStoreChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
  };
}

function updateThemeColor(theme: Theme) {
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((element) => {
      element.content = THEME_COLORS[theme];
    });
}

export function ThemeToggle({ initialTheme }: { initialTheme?: Theme }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getResolvedTheme,
    () => initialTheme ?? "light",
  );
  const nextTheme = theme === "dark" ? "light" : "dark";

  function handleToggle() {
    document.documentElement.dataset.theme = nextTheme;
    document.cookie = `theme=${nextTheme}; path=/; max-age=31536000; samesite=lax`;
    updateThemeColor(nextTheme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  return (
    <button
      aria-label={`Switch to ${nextTheme} theme`}
      className="border-border bg-surface text-secondary hover:border-border-strong hover:text-primary grid size-11 place-items-center rounded-lg border transition-colors duration-150"
      onClick={handleToggle}
      type="button"
    >
      <MoonIcon className="theme-icon-dark size-[18px]" />
      <SunIcon className="theme-icon-light size-[18px]" />
    </button>
  );
}
