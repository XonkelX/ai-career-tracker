const DEFAULT_CALLBACK_URL = "/dashboard";

export function getSafeCallbackUrl(value: unknown, baseUrl?: string): string {
  if (typeof value !== "string") return DEFAULT_CALLBACK_URL;

  let decodedValue: string;
  try {
    decodedValue = decodeURIComponent(value);
  } catch {
    return DEFAULT_CALLBACK_URL;
  }

  if (
    decodedValue.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(decodedValue)
  ) {
    return DEFAULT_CALLBACK_URL;
  }

  if (decodedValue.startsWith("/") && !decodedValue.startsWith("//")) {
    return value;
  }

  if (!baseUrl) return DEFAULT_CALLBACK_URL;

  try {
    const base = new URL(baseUrl);
    const target = new URL(decodedValue);

    if (target.origin !== base.origin) return DEFAULT_CALLBACK_URL;

    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return DEFAULT_CALLBACK_URL;
  }
}
