import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createApplicationSchema } from "@/schemas/applications/application";

import { getJobApplicationForEdit } from "./get-job-application-for-edit";
import { updateJobApplication } from "./update-job-application";

const runDatabaseTests = process.env.RUN_DATABASE_TESTS === "1";
const testId = randomUUID();
const ownerEmail = `edit-owner-${testId}@example.test`;
const otherEmail = `edit-other-${testId}@example.test`;
let ownerId = "";
let otherId = "";
const ownApplicationId = `${testId}-own`;
const otherApplicationId = `${testId}-other`;
const preservedApplicationId = `${testId}-preserved`;
const originalCreatedAt = new Date("2026-07-01T12:00:00.000Z");
const preservedDateApplied = new Date("2026-07-02T00:00:00.000Z");
let prisma: typeof import("@/server/db/client").prisma;

describe.runIf(runDatabaseTests)(
  "updateJobApplication database ownership",
  () => {
    beforeAll(async () => {
      ({ prisma } = await import("@/server/db/client"));
      const [owner, other] = await Promise.all([
        prisma.user.create({
          data: { email: ownerEmail, name: "Edit Owner" },
          select: { id: true },
        }),
        prisma.user.create({
          data: { email: otherEmail, name: "Other Owner" },
          select: { id: true },
        }),
      ]);
      ownerId = owner.id;
      otherId = other.id;

      await prisma.jobApplication.createMany({
        data: [
          {
            id: ownApplicationId,
            userId: ownerId,
            companyName: "Original Company",
            jobTitle: "Original Role",
            status: "APPLIED",
            createdAt: originalCreatedAt,
          },
          {
            id: otherApplicationId,
            userId: otherId,
            companyName: "Private Company",
            jobTitle: "Private Role",
          },
          {
            id: preservedApplicationId,
            userId: ownerId,
            companyName: "Preserved Company",
            jobTitle: "Preserved Role",
            status: "INTERVIEW",
            dateApplied: preservedDateApplied,
          },
        ],
      });
    });

    afterAll(async () => {
      await prisma.user.deleteMany({
        where: { email: { in: [ownerEmail, otherEmail] } },
      });
      await prisma.$disconnect();
    });

    it("updates the owner's application with normalized salary, URL, and dates", async () => {
      const input = createApplicationSchema(
        new Date("2026-07-16T12:00:00.000Z"),
      ).parse({
        companyName: "Updated Company",
        jobTitle: "Updated Role",
        location: "Remote",
        salaryMin: "85000.50",
        salaryMax: "105000",
        salaryCurrency: "USD",
        salaryPeriod: "ANNUAL",
        jobUrl: "jobs.example.com/updated-role",
        notes: "Updated notes",
        deadline: "2027-08-01",
        status: "APPLIED",
      });

      await expect(
        updateJobApplication(ownerId, ownApplicationId, input),
      ).resolves.toEqual({ status: "success" });

      const updated = await prisma.jobApplication.findUniqueOrThrow({
        where: { id: ownApplicationId },
      });
      expect(updated).toMatchObject({
        companyName: "Updated Company",
        jobTitle: "Updated Role",
        salaryMinMinor: BigInt(8_500_050),
        salaryMaxMinor: BigInt(10_500_000),
        salaryCurrency: "USD",
        salaryPeriod: "ANNUAL",
        jobUrl: "https://jobs.example.com/updated-role",
        deadline: new Date("2027-08-01T00:00:00.000Z"),
        status: "APPLIED",
        createdAt: originalCreatedAt,
      });
      expect(updated.dateApplied).not.toBeNull();
      expect(updated.updatedAt.valueOf()).toBeGreaterThan(
        originalCreatedAt.valueOf(),
      );
    });

    it("does not load or update another user's application", async () => {
      await expect(
        getJobApplicationForEdit(ownerId, otherApplicationId),
      ).resolves.toEqual({ status: "not_found" });

      const input = createApplicationSchema().parse({
        companyName: "Unauthorized Change",
        jobTitle: "Private Role",
        location: "",
        salaryMin: "",
        salaryMax: "",
        salaryCurrency: "",
        salaryPeriod: "",
        jobUrl: "",
        notes: "",
        deadline: "",
        status: "SAVED",
      });
      await expect(
        updateJobApplication(ownerId, otherApplicationId, input),
      ).resolves.toEqual({ status: "not_found" });

      const untouched = await prisma.jobApplication.findUniqueOrThrow({
        where: { id: otherApplicationId },
      });
      expect(untouched.companyName).toBe("Private Company");
    });

    it("preserves an existing dateApplied value", async () => {
      const input = createApplicationSchema().parse({
        companyName: "Preserved Company",
        jobTitle: "Preserved Role",
        location: "",
        salaryMin: "",
        salaryMax: "",
        salaryCurrency: "",
        salaryPeriod: "",
        jobUrl: "",
        notes: "",
        deadline: "",
        status: "SAVED",
      });

      await expect(
        updateJobApplication(ownerId, preservedApplicationId, input),
      ).resolves.toEqual({ status: "success" });
      const updated = await prisma.jobApplication.findUniqueOrThrow({
        where: { id: preservedApplicationId },
        select: { dateApplied: true, status: true },
      });
      expect(updated.dateApplied).toEqual(preservedDateApplied);
      expect(updated.status).toBe("INTERVIEW");
    });
  },
);
