import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "@/lib/constants/application-status";

export const SALARY_FILTER_VALUES = [
  "any",
  "with-salary",
  "without-salary",
] as const;
export const DEADLINE_FILTER_VALUES = [
  "any",
  "upcoming",
  "overdue",
  "no-deadline",
] as const;

export type SalaryFilter = (typeof SALARY_FILTER_VALUES)[number];
export type DeadlineFilter = (typeof DEADLINE_FILTER_VALUES)[number];

export interface ApplicationListUrlState {
  search: string;
  status: ApplicationStatus | null;
  salary: SalaryFilter;
  deadline: DeadlineFilter;
}

type QueryValue = string | string[] | undefined;

export interface ApplicationListSearchParams {
  search?: QueryValue;
  status?: QueryValue;
  salary?: QueryValue;
  deadline?: QueryValue;
}

function firstValue(value: QueryValue): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export function normalizeApplicationSearch(search: string): string {
  return search.trim().replace(/\s+/g, " ");
}

function normalizeStatus(value: string): ApplicationStatus | null {
  const normalized = value.trim().toUpperCase();
  return APPLICATION_STATUSES.includes(normalized as ApplicationStatus)
    ? (normalized as ApplicationStatus)
    : null;
}

function normalizeSalary(value: string): SalaryFilter {
  const normalized = value.trim().toLowerCase();
  return SALARY_FILTER_VALUES.includes(normalized as SalaryFilter)
    ? (normalized as SalaryFilter)
    : "any";
}

function normalizeDeadline(value: string): DeadlineFilter {
  const normalized = value.trim().toLowerCase();
  return DEADLINE_FILTER_VALUES.includes(normalized as DeadlineFilter)
    ? (normalized as DeadlineFilter)
    : "any";
}

export function parseApplicationListUrlState(
  params: ApplicationListSearchParams,
): ApplicationListUrlState {
  return {
    search: normalizeApplicationSearch(firstValue(params.search)),
    status: normalizeStatus(firstValue(params.status)),
    salary: normalizeSalary(firstValue(params.salary)),
    deadline: normalizeDeadline(firstValue(params.deadline)),
  };
}

export function buildApplicationListSearchParams(
  state: ApplicationListUrlState,
): URLSearchParams {
  const params = new URLSearchParams();
  if (state.search) params.set("search", state.search);
  if (state.status) params.set("status", state.status);
  if (state.salary !== "any") params.set("salary", state.salary);
  if (state.deadline !== "any") params.set("deadline", state.deadline);
  return params;
}

export function applicationListUrlNeedsNormalization(
  raw: ApplicationListSearchParams,
  normalized: ApplicationListUrlState,
): boolean {
  const rawSupportedParams = new URLSearchParams();
  for (const key of ["search", "status", "salary", "deadline"] as const) {
    const value = raw[key];
    if (value !== undefined) rawSupportedParams.set(key, firstValue(value));
  }

  return (
    rawSupportedParams.toString() !==
    buildApplicationListSearchParams(normalized).toString()
  );
}

export function hasActiveApplicationCriteria(
  state: ApplicationListUrlState,
): boolean {
  return Boolean(
    state.search ||
    state.status ||
    state.salary !== "any" ||
    state.deadline !== "any",
  );
}

export function hasActiveApplicationFilters(
  state: ApplicationListUrlState,
): boolean {
  return Boolean(
    state.status || state.salary !== "any" || state.deadline !== "any",
  );
}
