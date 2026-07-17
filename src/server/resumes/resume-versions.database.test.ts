import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  associateResumeVersion,
  createResumeVersion,
  deleteResumeVersion,
  getResumeVersionForEdit,
  listResumeVersions,
  updateResumeVersion,
} from "./resume-versions";

const runDatabaseTests = process.env.RUN_DATABASE_TESTS === "1";
const testId = randomUUID();
const ownerEmail = `resume-owner-${testId}@example.test`;
const otherEmail = `resume-other-${testId}@example.test`;
let ownerId = "";
let otherId = "";
let applicationId = "";
let otherApplicationId = "";
let firstVersionId = "";
let secondVersionId = "";
let otherVersionId = "";
let prisma: typeof import("@/server/db/client").prisma;

const firstInput = {
  name: "Software Engineer Resume",
  versionLabel: "Frontend v1",
  description: "React-focused resume",
  sourceFileName: "oniel-frontend.pdf",
  notes: "Primary version",
};

describe.runIf(runDatabaseTests)("resume version database lifecycle", () => {
  beforeAll(async () => {
    ({ prisma } = await import("@/server/db/client"));
    const [owner, other] = await Promise.all([
      prisma.user.create({ data: { email: ownerEmail }, select: { id: true } }),
      prisma.user.create({ data: { email: otherEmail }, select: { id: true } }),
    ]);
    ownerId = owner.id;
    otherId = other.id;
    const [application, otherApplication] = await Promise.all([
      prisma.jobApplication.create({
        data: { userId: ownerId, companyName: "Acme", jobTitle: "Engineer" },
        select: { id: true },
      }),
      prisma.jobApplication.create({
        data: { userId: otherId, companyName: "Private", jobTitle: "Engineer" },
        select: { id: true },
      }),
    ]);
    applicationId = application.id;
    otherApplicationId = otherApplication.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [ownerEmail, otherEmail] } },
    });
    await prisma.$disconnect();
  });

  it("creates numbered versions and lists only the owner's records", async () => {
    const first = await createResumeVersion(ownerId, firstInput);
    expect(first.success).toBe(true);
    if (first.success) firstVersionId = first.id;
    const second = await createResumeVersion(ownerId, {
      ...firstInput,
      versionLabel: "Frontend v2",
      sourceFileName: undefined,
    });
    expect(second.success).toBe(true);
    if (second.success) secondVersionId = second.id;
    const other = await createResumeVersion(otherId, {
      ...firstInput,
      name: "Private Resume",
    });
    if (other.success) otherVersionId = other.id;

    const result = await listResumeVersions(ownerId);
    expect(result.status).toBe("success");
    if (result.status === "success") {
      expect(result.items.map((item) => item.id)).toEqual(
        expect.arrayContaining([firstVersionId, secondVersionId]),
      );
      expect(result.items).toHaveLength(2);
      expect(result.items.map((item) => item.version).sort()).toEqual([1, 2]);
      expect(result.items.some((item) => item.id === otherVersionId)).toBe(
        false,
      );
    }
  });

  it("renames the shared family while keeping each version label independent", async () => {
    await expect(
      updateResumeVersion(ownerId, firstVersionId, {
        ...firstInput,
        name: "Engineering Resume",
        versionLabel: "Platform v1",
      }),
    ).resolves.toEqual({ success: true, id: firstVersionId });

    const editedVersion = await getResumeVersionForEdit(
      ownerId,
      firstVersionId,
    );
    const siblingVersion = await getResumeVersionForEdit(
      ownerId,
      secondVersionId,
    );
    expect(editedVersion).toMatchObject({
      status: "success",
      values: { name: "Engineering Resume", versionLabel: "Platform v1" },
    });
    expect(siblingVersion).toMatchObject({
      status: "success",
      values: { name: "Engineering Resume", versionLabel: "Frontend v2" },
    });
  });

  it("treats unowned records as not found", async () => {
    await expect(
      getResumeVersionForEdit(ownerId, otherVersionId),
    ).resolves.toEqual({ status: "not_found" });
    const rejected = await updateResumeVersion(ownerId, otherVersionId, {
      ...firstInput,
      name: "Stolen",
    });
    expect(rejected).toMatchObject({ success: false, kind: "not_found" });
  });

  it("associates only mutually owned records and removes an association safely", async () => {
    await expect(
      associateResumeVersion(ownerId, applicationId, firstVersionId),
    ).resolves.toEqual({ success: true, resumeVersionId: firstVersionId });
    await expect(
      associateResumeVersion(ownerId, applicationId, otherVersionId),
    ).resolves.toMatchObject({ success: false });
    await expect(
      associateResumeVersion(ownerId, otherApplicationId, firstVersionId),
    ).resolves.toMatchObject({ success: false });
    await expect(
      associateResumeVersion(ownerId, applicationId, null),
    ).resolves.toEqual({ success: true, resumeVersionId: null });
    expect(
      (
        await prisma.jobApplication.findUniqueOrThrow({
          where: { id: applicationId },
        })
      ).resumeVersionId,
    ).toBeNull();
  });

  it("deleting a version detaches applications and removes an empty parent", async () => {
    await associateResumeVersion(ownerId, applicationId, firstVersionId);
    await expect(
      deleteResumeVersion(ownerId, otherVersionId),
    ).resolves.toMatchObject({ success: false, kind: "not_found" });
    await expect(deleteResumeVersion(ownerId, firstVersionId)).resolves.toEqual(
      { success: true, id: firstVersionId },
    );
    expect(
      (
        await prisma.jobApplication.findUniqueOrThrow({
          where: { id: applicationId },
        })
      ).resumeVersionId,
    ).toBeNull();
    await expect(
      deleteResumeVersion(ownerId, secondVersionId),
    ).resolves.toEqual({ success: true, id: secondVersionId });
    expect(await prisma.resume.count({ where: { userId: ownerId } })).toBe(0);
    await expect(listResumeVersions(ownerId)).resolves.toEqual({
      status: "success",
      items: [],
    });
  });
});
