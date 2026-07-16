import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  formatApplicationDate,
  formatSalaryRange,
} from "@/features/applications/application-formatters";

import { listJobApplications } from "./list-job-applications";

const runDatabaseTests = process.env.RUN_DATABASE_TESTS === "1";
const testId = randomUUID();
const ownerEmail = `list-owner-${testId}@example.test`;
const otherEmail = `list-other-${testId}@example.test`;
const emptyEmail = `list-empty-${testId}@example.test`;
let ownerId = "";
let emptyUserId = "";
let prisma: typeof import("@/server/db/client").prisma;

describe.runIf(runDatabaseTests)(
  "listJobApplications database isolation",
  () => {
    beforeAll(async () => {
      ({ prisma } = await import("@/server/db/client"));
      const [owner, otherUser, emptyUser] = await Promise.all([
        prisma.user.create({
          data: { email: ownerEmail, name: "List Owner" },
          select: { id: true },
        }),
        prisma.user.create({
          data: { email: otherEmail, name: "Other Owner" },
          select: { id: true },
        }),
        prisma.user.create({
          data: { email: emptyEmail, name: "Empty Owner" },
          select: { id: true },
        }),
      ]);
      ownerId = owner.id;
      emptyUserId = emptyUser.id;

      await prisma.jobApplication.createMany({
        data: [
          {
            id: `${testId}-deadline-two-older`,
            userId: owner.id,
            companyName: "Deadline Two Older",
            jobTitle: "Engineer",
            deadline: new Date("2026-08-02T00:00:00.000Z"),
            updatedAt: new Date("2026-07-20T12:00:00.000Z"),
          },
          {
            id: `${testId}-deadline-one`,
            userId: owner.id,
            companyName: "Deadline One",
            jobTitle: "Principal Platform Engineer",
            deadline: new Date("2026-08-01T00:00:00.000Z"),
            dateApplied: new Date("2026-07-16T00:00:00.000Z"),
            salaryMinMinor: BigInt(8_500_050),
            salaryMaxMinor: BigInt(10_500_000),
            salaryCurrency: "USD",
            salaryPeriod: "ANNUAL",
            updatedAt: new Date("2026-07-19T12:00:00.000Z"),
          },
          {
            id: `${testId}-deadline-two-newer`,
            userId: owner.id,
            companyName: "Deadline Two Newer",
            jobTitle: "Engineer",
            deadline: new Date("2026-08-02T00:00:00.000Z"),
            updatedAt: new Date("2026-07-21T12:00:00.000Z"),
          },
          {
            id: `${testId}-no-deadline`,
            userId: owner.id,
            companyName: "No Deadline",
            jobTitle: "Engineer",
            deadline: null,
            updatedAt: new Date("2026-07-30T12:00:00.000Z"),
          },
          {
            id: `${testId}-other-user`,
            userId: otherUser.id,
            companyName: "Other User Company",
            jobTitle: "Private Role",
            deadline: new Date("2026-07-01T00:00:00.000Z"),
          },
        ],
      });
    });

    afterAll(async () => {
      await prisma.user.deleteMany({
        where: { email: { in: [ownerEmail, otherEmail, emptyEmail] } },
      });
      await prisma.$disconnect();
    });

    it("returns only the authenticated user's applications in deadline order", async () => {
      const result = await listJobApplications(ownerId);

      expect(result.success).toBe(true);
      if (!result.success) return;

      expect(result.applications.map(({ companyName }) => companyName)).toEqual(
        [
          "Deadline One",
          "Deadline Two Newer",
          "Deadline Two Older",
          "No Deadline",
        ],
      );
      expect(
        result.applications.some(
          ({ companyName }) => companyName === "Other User Company",
        ),
      ).toBe(false);
    });

    it("returns an empty result for a user with no applications", async () => {
      await expect(listJobApplications(emptyUserId)).resolves.toEqual({
        success: true,
        applications: [],
      });
    });

    it("searches company and job title with normalized partial case-insensitive matching", async () => {
      const companyResult = await listJobApplications(
        ownerId,
        "  DEADLINE   two  ",
      );
      expect(companyResult.success).toBe(true);
      if (!companyResult.success) return;
      expect(
        companyResult.applications.map(({ companyName }) => companyName),
      ).toEqual(["Deadline Two Newer", "Deadline Two Older"]);

      const titleResult = await listJobApplications(ownerId, "platform eng");
      expect(titleResult.success).toBe(true);
      if (!titleResult.success) return;
      expect(
        titleResult.applications.map(({ companyName }) => companyName),
      ).toEqual(["Deadline One"]);
    });

    it("keeps searches user-scoped and returns an empty result for no matches", async () => {
      await expect(
        listJobApplications(ownerId, "Private Role"),
      ).resolves.toEqual({
        success: true,
        applications: [],
      });
      await expect(
        listJobApplications(ownerId, "Definitely Missing"),
      ).resolves.toEqual({ success: true, applications: [] });
    });

    it("treats an empty normalized search as the unfiltered ordered list", async () => {
      const result = await listJobApplications(ownerId, "   ");
      expect(result.success).toBe(true);
      if (!result.success) return;

      expect(result.applications.map(({ companyName }) => companyName)).toEqual(
        [
          "Deadline One",
          "Deadline Two Newer",
          "Deadline Two Older",
          "No Deadline",
        ],
      );
    });

    it("serializes and formats salary and date values from PostgreSQL", async () => {
      const result = await listJobApplications(ownerId);
      expect(result.success).toBe(true);
      if (!result.success) return;

      const application = result.applications[0];
      expect(application).toBeDefined();
      if (!application) return;

      expect(application.salaryMinMinor).toBe("8500050");
      expect(formatSalaryRange(application)).toBe(
        "$85,000.50 – $105,000.00 / year",
      );
      expect(formatApplicationDate(application.deadline)).toBe("Aug 1, 2026");
      expect(formatApplicationDate(application.dateApplied)).toBe(
        "Jul 16, 2026",
      );
    });
  },
);
