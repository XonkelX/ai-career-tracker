"use client";

import { MoonIcon, SunIcon } from "./icons";

type Theme = "light" | "dark";

function getResolvedTheme(): Theme {
  const explicitTheme = document.documentElement.dataset.theme;

  if (explicitTheme === "light" || explicitTheme === "dark") {
    return explicitTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  function handleToggle() {
    const nextTheme = getResolvedTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.cookie = `theme=${nextTheme}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <button
      aria-label="Toggle color theme"
      className="border-border bg-surface text-secondary hover:border-border-strong hover:text-primary grid size-11 place-items-center rounded-lg border transition-colors duration-150"
      onClick={handleToggle}
      type="button"
    >
      <MoonIcon className="theme-icon-dark size-[18px]" />
      <SunIcon className="theme-icon-light size-[18px]" />
    </button>
  );
}
