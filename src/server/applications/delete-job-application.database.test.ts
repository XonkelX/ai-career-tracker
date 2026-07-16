import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { deleteJobApplication } from "./delete-job-application";
import { listJobApplications } from "./list-job-applications";

const runDatabaseTests = process.env.RUN_DATABASE_TESTS === "1";
const testId = randomUUID();
const ownerEmail = `delete-owner-${testId}@example.test`;
const otherEmail = `delete-other-${testId}@example.test`;
const ownApplicationId = `${testId}-own`;
const otherApplicationId = `${testId}-other`;
let ownerId = "";
let otherId = "";
let aiArtifactId = "";
let retainedActivityId = "";
let prisma: typeof import("@/server/db/client").prisma;

describe.runIf(runDatabaseTests)(
  "deleteJobApplication database ownership and cascades",
  () => {
    beforeAll(async () => {
      ({ prisma } = await import("@/server/db/client"));
      const [owner, other] = await Promise.all([
        prisma.user.create({
          data: { email: ownerEmail, name: "Delete Owner" },
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
            companyName: "Owned Company",
            jobTitle: "Owned Role",
          },
          {
            id: otherApplicationId,
            userId: otherId,
            companyName: "Private Company",
            jobTitle: "Private Role",
          },
        ],
      });
      const artifact = await prisma.aiArtifact.create({
        data: {
          userId: ownerId,
          applicationId: ownApplicationId,
          type: "COVER_LETTER",
          status: "COMPLETED",
          sourceSnapshot: { test: true },
          output: { text: "Test output" },
        },
        select: { id: true },
      });
      aiArtifactId = artifact.id;
      await prisma.activity.createMany({
        data: [
          {
            userId: ownerId,
            applicationId: ownApplicationId,
            type: "APPLICATION_CREATED",
          },
          {
            userId: ownerId,
            applicationId: ownApplicationId,
            aiArtifactId,
            type: "AI_ARTIFACT_CREATED",
          },
        ],
      });
      const retainedActivity = await prisma.activity.create({
        data: {
          userId: ownerId,
          aiArtifactId,
          type: "AI_ARTIFACT_CREATED",
        },
        select: { id: true },
      });
      retainedActivityId = retainedActivity.id;
    });

    afterAll(async () => {
      await prisma.user.deleteMany({
        where: { email: { in: [ownerEmail, otherEmail] } },
      });
      await prisma.$disconnect();
    });

    it("deletes an owned application, cascades related records, and empties its list", async () => {
      const before = await listJobApplications(ownerId);
      expect(before).toMatchObject({ success: true });
      if (before.success) expect(before.applications).toHaveLength(1);

      await expect(
        deleteJobApplication(ownerId, ownApplicationId),
      ).resolves.toEqual({ status: "success" });

      const [
        application,
        artifactCount,
        activityCount,
        retainedActivity,
        after,
      ] = await Promise.all([
        prisma.jobApplication.findUnique({
          where: { id: ownApplicationId },
        }),
        prisma.aiArtifact.count({ where: { id: aiArtifactId } }),
        prisma.activity.count({
          where: { applicationId: ownApplicationId },
        }),
        prisma.activity.findUnique({
          where: { id: retainedActivityId },
          select: { aiArtifactId: true, applicationId: true },
        }),
        listJobApplications(ownerId),
      ]);
      expect(application).toBeNull();
      expect(artifactCount).toBe(0);
      expect(activityCount).toBe(0);
      expect(retainedActivity).toEqual({
        aiArtifactId: null,
        applicationId: null,
      });
      expect(after).toEqual({ success: true, applications: [] });
    });

    it("handles a duplicate deletion safely", async () => {
      await expect(
        deleteJobApplication(ownerId, ownApplicationId),
      ).resolves.toEqual({ status: "not_found" });
    });

    it("treats missing and unowned applications equivalently", async () => {
      const [missing, unowned] = await Promise.all([
        deleteJobApplication(ownerId, `${testId}-missing`),
        deleteJobApplication(ownerId, otherApplicationId),
      ]);
      expect(missing).toEqual({ status: "not_found" });
      expect(unowned).toEqual({ status: "not_found" });

      const otherApplication = await prisma.jobApplication.findUniqueOrThrow({
        where: { id: otherApplicationId },
      });
      expect(otherApplication.companyName).toBe("Private Company");
    });
  },
);
