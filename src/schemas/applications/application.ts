import { z } from "zod";

import { APPLICATION_STATUSES } from "@/lib/constants/application-status";

export const SALARY_PERIODS = ["HOURLY", "MONTHLY", "ANNUAL"] as const;
const MAX_POSTGRES_BIGINT = BigInt("9223372036854775807");

const optionalTrimmedString = (maximum: number, message: string) =>
  z
    .string()
    .trim()
    .max(maximum, message)
    .transform((value) => value || undefined);

function normalizeUrl(value: string): string | undefined {
  const trimmedValue = value.trim();
  if (!trimmedValue) return undefined;

  const candidate = /^[a-z][a-z\d+.-]*:/i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export function getCurrencyMinorDigits(currency: string): number | undefined {
  try {
    const options = new Intl.NumberFormat("en", {
      style: "currency",
      currency,
    }).resolvedOptions();
    return options.maximumFractionDigits;
  } catch {
    return undefined;
  }
}

function amountToMinorUnits(
  value: string | undefined,
  minorDigits: number,
): bigint | undefined {
  if (!value) return undefined;

  const [whole, fraction = ""] = value.split(".");
  const paddedFraction = fraction.padEnd(minorDigits, "0");
  return BigInt(`${whole}${paddedFraction}`);
}

function isValidDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
  );
}

const salaryAmountSchema = optionalTrimmedString(
  30,
  "Salary amount is too large.",
).superRefine((value, context) => {
  if (value && !/^\d+(?:\.\d+)?$/.test(value)) {
    context.addIssue({
      code: "custom",
      message: "Enter a non-negative salary amount.",
    });
  }
});

const baseApplicationSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, "Enter a company name.")
    .max(200, "Company name must be 200 characters or fewer."),
  jobTitle: z
    .string()
    .trim()
    .min(1, "Enter a job title.")
    .max(200, "Job title must be 200 characters or fewer."),
  location: optionalTrimmedString(
    200,
    "Location must be 200 characters or fewer.",
  ),
  salaryMin: salaryAmountSchema,
  salaryMax: salaryAmountSchema,
  salaryCurrency: z
    .string()
    .trim()
    .toUpperCase()
    .max(3, "Use a three-letter currency code.")
    .transform((value) => value || undefined),
  salaryPeriod: z
    .union([z.enum(SALARY_PERIODS), z.literal("")])
    .transform((value) => value || undefined),
  jobUrl: z
    .string()
    .trim()
    .max(2_048, "Job URL is too long.")
    .transform((value, context) => {
      const normalizedUrl = normalizeUrl(value);
      if (value && !normalizedUrl) {
        context.addIssue({
          code: "custom",
          message: "Enter a valid HTTP or HTTPS URL.",
        });
        return z.NEVER;
      }
      return normalizedUrl;
    }),
  notes: optionalTrimmedString(10_000, "Notes are too long."),
  deadline: z
    .string()
    .trim()
    .refine(
      (value) => !value || isValidDateOnly(value),
      "Enter a valid deadline.",
    )
    .transform((value) => value || undefined),
  status: z.enum(APPLICATION_STATUSES).default("SAVED"),
});

export function createApplicationSchema(
  today = new Date(),
  options: { allowedPastDeadline?: string } = {},
) {
  const todayValue = today.toISOString().slice(0, 10);

  return baseApplicationSchema
    .superRefine((data, context) => {
      const hasSalary = Boolean(data.salaryMin || data.salaryMax);
      const minorDigits = data.salaryCurrency
        ? getCurrencyMinorDigits(data.salaryCurrency)
        : undefined;

      if (hasSalary && !data.salaryCurrency) {
        context.addIssue({
          code: "custom",
          path: ["salaryCurrency"],
          message: "Enter a currency when adding salary information.",
        });
      } else if (data.salaryCurrency && minorDigits === undefined) {
        context.addIssue({
          code: "custom",
          path: ["salaryCurrency"],
          message: "Enter a valid ISO 4217 currency code.",
        });
      }

      if (hasSalary && !data.salaryPeriod) {
        context.addIssue({
          code: "custom",
          path: ["salaryPeriod"],
          message: "Select a salary period.",
        });
      }

      if (minorDigits !== undefined) {
        for (const [field, amount] of [
          ["salaryMin", data.salaryMin],
          ["salaryMax", data.salaryMax],
        ] as const) {
          const fractionLength = amount?.split(".")[1]?.length ?? 0;
          if (amount && fractionLength > minorDigits) {
            context.addIssue({
              code: "custom",
              path: [field],
              message: `${data.salaryCurrency} supports at most ${minorDigits} decimal places.`,
            });
          }
        }

        const minimum = amountToMinorUnits(data.salaryMin, minorDigits);
        const maximum = amountToMinorUnits(data.salaryMax, minorDigits);
        for (const [field, amount] of [
          ["salaryMin", minimum],
          ["salaryMax", maximum],
        ] as const) {
          if (amount !== undefined && amount > MAX_POSTGRES_BIGINT) {
            context.addIssue({
              code: "custom",
              path: [field],
              message: "Salary amount is too large.",
            });
          }
        }
        if (
          minimum !== undefined &&
          maximum !== undefined &&
          minimum > maximum
        ) {
          context.addIssue({
            code: "custom",
            path: ["salaryMax"],
            message:
              "Maximum salary must be greater than or equal to minimum salary.",
          });
        }
      }

      if (
        data.deadline &&
        data.deadline < todayValue &&
        data.deadline !== options.allowedPastDeadline
      ) {
        context.addIssue({
          code: "custom",
          path: ["deadline"],
          message: "Deadline cannot be in the past.",
        });
      }
    })
    .transform((data) => {
      const minorDigits = data.salaryCurrency
        ? getCurrencyMinorDigits(data.salaryCurrency)
        : 0;

      return {
        ...data,
        salaryMinMinor: amountToMinorUnits(data.salaryMin, minorDigits ?? 0),
        salaryMaxMinor: amountToMinorUnits(data.salaryMax, minorDigits ?? 0),
        deadline: data.deadline
          ? new Date(`${data.deadline}T00:00:00.000Z`)
          : undefined,
      };
    });
}

export type ApplicationFormInput = z.input<typeof baseApplicationSchema>;
export type ValidatedApplicationInput = z.output<
  ReturnType<typeof createApplicationSchema>
>;
