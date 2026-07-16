import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { getDashboardOverview } from "./get-dashboard-overview";

const runDatabaseTests = process.env.RUN_DATABASE_TESTS === "1";
const testId = randomUUID();
const ownerEmail = `dashboard-owner-${testId}@example.test`;
const otherEmail = `dashboard-other-${testId}@example.test`;
const emptyEmail = `dashboard-empty-${testId}@example.test`;
const savedOnlyEmail = `dashboard-saved-${testId}@example.test`;
let ownerId = "";
let emptyUserId = "";
let savedOnlyUserId = "";
let prisma: typeof import("@/server/db/client").prisma;

function startOfUtcDate(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function addDays(date: Date, days: number): Date {
  return new Date(date.valueOf() + days * 86_400_000);
}

describe.runIf(runDatabaseTests)(
  "getDashboardOverview database isolation",
  () => {
    beforeAll(async () => {
      ({ prisma } = await import("@/server/db/client"));
      const [owner, other, empty, savedOnly] = await Promise.all([
        prisma.user.create({
          data: { email: ownerEmail, name: "Dashboard Owner" },
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
        prisma.user.create({
          data: { email: savedOnlyEmail, name: "Saved Owner" },
          select: { id: true },
        }),
      ]);
      ownerId = owner.id;
      emptyUserId = empty.id;
      savedOnlyUserId = savedOnly.id;
      const today = startOfUtcDate(new Date());

      await prisma.jobApplication.createMany({
        data: [
          {
            id: `${testId}-saved-today`,
            userId: ownerId,
            companyName: "Deadline Today",
            jobTitle: "Role 1",
            status: "SAVED",
            deadline: today,
            updatedAt: addDays(today, 1),
          },
          {
            id: `${testId}-saved-tomorrow`,
            userId: ownerId,
            companyName: "Deadline Tomorrow",
            jobTitle: "Role 2",
            status: "SAVED",
            deadline: addDays(today, 1),
            updatedAt: addDays(today, 2),
          },
          {
            id: `${testId}-applied-three`,
            userId: ownerId,
            companyName: "Deadline Three",
            jobTitle: "Role 3",
            status: "APPLIED",
            deadline: addDays(today, 2),
            updatedAt: addDays(today, 3),
          },
          {
            id: `${testId}-applied-four`,
            userId: ownerId,
            companyName: "Deadline Four",
            jobTitle: "Role 4",
            status: "APPLIED",
            deadline: addDays(today, 3),
            updatedAt: addDays(today, 4),
          },
          {
            id: `${testId}-interview-five`,
            userId: ownerId,
            companyName: "Deadline Five",
            jobTitle: "Role 5",
            status: "INTERVIEW",
            deadline: addDays(today, 4),
            updatedAt: addDays(today, 5),
          },
          {
            id: `${testId}-offer-six`,
            userId: ownerId,
            companyName: "Deadline Six",
            jobTitle: "Role 6",
            status: "OFFER",
            deadline: addDays(today, 5),
            updatedAt: addDays(today, 6),
          },
          {
            id: `${testId}-rejected-past`,
            userId: ownerId,
            companyName: "Past Deadline",
            jobTitle: "Role 7",
            status: "REJECTED",
            deadline: addDays(today, -1),
            updatedAt: addDays(today, 7),
          },
          {
            id: `${testId}-private`,
            userId: other.id,
            companyName: "Private Company",
            jobTitle: "Private Role",
            status: "OFFER",
            deadline: today,
            updatedAt: addDays(today, 20),
          },
          {
            id: `${testId}-saved-only`,
            userId: savedOnly.id,
            companyName: "Saved Only",
            jobTitle: "Saved Role",
            status: "SAVED",
            updatedAt: today,
          },
        ],
      });
    });

    afterAll(async () => {
      await prisma.user.deleteMany({
        where: {
          email: { in: [ownerEmail, otherEmail, emptyEmail, savedOnlyEmail] },
        },
      });
      await prisma.$disconnect();
    });

    it("returns accurate user-scoped counts and documented conversion", async () => {
      const result = await getDashboardOverview(ownerId);
      expect(result.success).toBe(true);
      if (!result.success) return;

      expect(result.overview.counts).toEqual({
        total: 7,
        SAVED: 2,
        APPLIED: 2,
        INTERVIEW: 1,
        OFFER: 1,
        REJECTED: 1,
      });
      expect(result.overview.interviewConversionRate).toBe(60);
      expect(
        result.overview.recentApplications.some(
          ({ companyName }) => companyName === "Private Company",
        ),
      ).toBe(false);
    });

    it("excludes past deadlines and returns the earliest five", async () => {
      const result = await getDashboardOverview(ownerId);
      expect(result.success).toBe(true);
      if (!result.success) return;

      expect(
        result.overview.upcomingDeadlines.map(({ companyName }) => companyName),
      ).toEqual([
        "Deadline Today",
        "Deadline Tomorrow",
        "Deadline Three",
        "Deadline Four",
        "Deadline Five",
      ]);
      expect(result.overview.upcomingDeadlines).toHaveLength(5);
    });

    it("returns the five most recently updated applications", async () => {
      const result = await getDashboardOverview(ownerId);
      expect(result.success).toBe(true);
      if (!result.success) return;

      expect(
        result.overview.recentApplications.map(
          ({ companyName }) => companyName,
        ),
      ).toEqual([
        "Past Deadline",
        "Deadline Six",
        "Deadline Five",
        "Deadline Four",
        "Deadline Three",
      ]);
      expect(result.overview.recentApplications).toHaveLength(5);
    });

    it("returns an empty overview and zero conversion without submitted records", async () => {
      const [emptyResult, savedOnlyResult] = await Promise.all([
        getDashboardOverview(emptyUserId),
        getDashboardOverview(savedOnlyUserId),
      ]);
      expect(emptyResult).toMatchObject({
        success: true,
        overview: { counts: { total: 0 }, interviewConversionRate: 0 },
      });
      expect(savedOnlyResult).toMatchObject({
        success: true,
        overview: {
          counts: { total: 1, SAVED: 1 },
          interviewConversionRate: 0,
        },
      });
    });
  },
);
