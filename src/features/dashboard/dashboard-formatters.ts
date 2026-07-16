const millisecondsPerDay = 86_400_000;

export function formatDashboardDate(value: string, locale = "en-US"): string {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "Date unavailable";

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

export function formatDashboardUpdateTime(
  value: string,
  locale = "en-US",
): string {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "Update time unavailable";

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(date);
}

export function getDeadlineTiming(
  deadlineValue: string,
  asOfDateValue: string,
): string {
  const deadline = new Date(deadlineValue);
  const asOfDate = new Date(asOfDateValue);
  if (Number.isNaN(deadline.valueOf()) || Number.isNaN(asOfDate.valueOf())) {
    return "Upcoming deadline";
  }

  const days = Math.round(
    (deadline.valueOf() - asOfDate.valueOf()) / millisecondsPerDay,
  );
  if (days <= 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days <= 7) return `Due in ${days} days`;
  return "Upcoming";
}
