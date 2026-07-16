import { z } from "zod";

const databaseUrlSchema = z
  .string({ error: "DATABASE_URL is required." })
  .trim()
  .min(1, "DATABASE_URL is required.")
  .refine((value) => {
    try {
      const protocol = new URL(value).protocol;

      return protocol === "postgresql:" || protocol === "postgres:";
    } catch {
      return false;
    }
  }, "DATABASE_URL must be a valid PostgreSQL connection URL.");

const databaseEnvironmentSchema = z.object({
  DATABASE_URL: databaseUrlSchema,
});

export type DatabaseEnvironment = z.infer<typeof databaseEnvironmentSchema>;

export function parseDatabaseEnvironment(
  environment: Record<string, string | undefined>,
): DatabaseEnvironment {
  const result = databaseEnvironmentSchema.safeParse(environment);

  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(" ");

    throw new Error(`Invalid database environment: ${message}`);
  }

  return result.data;
}

export function getDatabaseEnvironment(): DatabaseEnvironment {
  return parseDatabaseEnvironment(process.env);
}
