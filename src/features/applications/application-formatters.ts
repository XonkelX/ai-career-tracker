import type { ApplicationListItem } from "@/server/applications/list-job-applications";

const salaryPeriodSuffixes = {
  HOURLY: "hour",
  MONTHLY: "month",
  ANNUAL: "year",
} as const;

function getMinorDigits(currency: string): number {
  try {
    return (
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).resolvedOptions().maximumFractionDigits ?? 2
    );
  } catch {
    return 2;
  }
}

function decimalFromMinorUnits(value: bigint, minorDigits: number): string {
  const isNegative = value < BigInt(0);
  const absoluteValue = isNegative ? -value : value;
  const digits = absoluteValue.toString().padStart(minorDigits + 1, "0");
  const whole = minorDigits ? digits.slice(0, -minorDigits) : digits;
  const fraction = minorDigits ? `.${digits.slice(-minorDigits)}` : "";

  return `${isNegative ? "-" : ""}${whole}${fraction}`;
}

function formatMinorUnits(
  value: string,
  currency: string | null,
  locale: string,
): string {
  const normalizedCurrency = currency?.trim().toUpperCase() ?? "";
  const hasCurrencyCode = /^[A-Z]{3}$/.test(normalizedCurrency);
  const minorDigits = hasCurrencyCode ? getMinorDigits(normalizedCurrency) : 2;
  const minorValue = BigInt(value);
  const scale = 10 ** minorDigits;

  if (
    hasCurrencyCode &&
    minorValue <= BigInt(Number.MAX_SAFE_INTEGER) &&
    minorValue >= BigInt(Number.MIN_SAFE_INTEGER)
  ) {
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: normalizedCurrency,
      }).format(Number(minorValue) / scale);
    } catch {
      // Fall through to the exact code-prefixed representation.
    }
  }

  const amount = decimalFromMinorUnits(minorValue, minorDigits);
  return `${hasCurrencyCode ? normalizedCurrency : "Currency"} ${amount}`;
}

export function formatSalaryRange(
  application: Pick<
    ApplicationListItem,
    "salaryMinMinor" | "salaryMaxMinor" | "salaryCurrency" | "salaryPeriod"
  >,
  locale = "en-US",
): string | null {
  const { salaryMinMinor, salaryMaxMinor, salaryCurrency, salaryPeriod } =
    application;
  if (!salaryMinMinor && !salaryMaxMinor) return null;

  try {
    const minimum = salaryMinMinor
      ? formatMinorUnits(salaryMinMinor, salaryCurrency, locale)
      : null;
    const maximum = salaryMaxMinor
      ? formatMinorUnits(salaryMaxMinor, salaryCurrency, locale)
      : null;
    const range =
      minimum && maximum
        ? minimum === maximum
          ? minimum
          : `${minimum} – ${maximum}`
        : minimum
          ? `From ${minimum}`
          : `Up to ${maximum}`;
    const period = salaryPeriod
      ? ` / ${salaryPeriodSuffixes[salaryPeriod]}`
      : "";

    return `${range}${period}`;
  } catch {
    return "Salary available";
  }
}

export function formatApplicationDate(
  value: string | null,
  locale = "en-US",
): string | null {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "Date unavailable";

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}
