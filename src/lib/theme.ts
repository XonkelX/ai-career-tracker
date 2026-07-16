export const THEME_COLORS = {
  light: "#f8fafc",
  dark: "#020617",
} as const;

export type Theme = keyof typeof THEME_COLORS;

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}
