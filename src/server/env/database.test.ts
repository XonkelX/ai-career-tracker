import { describe, expect, it } from "vitest";

import { parseDatabaseEnvironment } from "./database";

describe("parseDatabaseEnvironment", () => {
  it("accepts PostgreSQL connection URLs", () => {
    expect(
      parseDatabaseEnvironment({
        DATABASE_URL:
          "postgresql://app:password@database.example.com:5432/career_tracker?schema=public",
      }),
    ).toEqual({
      DATABASE_URL:
        "postgresql://app:password@database.example.com:5432/career_tracker?schema=public",
    });
  });

  it.each([undefined, "", "mysql://localhost/database", "not-a-url"])(
    "rejects an invalid DATABASE_URL value: %s",
    (databaseUrl) => {
      expect(() =>
        parseDatabaseEnvironment({ DATABASE_URL: databaseUrl }),
      ).toThrow("Invalid database environment");
    },
  );
});
