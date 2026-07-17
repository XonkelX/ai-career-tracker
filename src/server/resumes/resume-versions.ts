import type { ResumeVersionInput } from "@/schemas/resumes/resume-version";

export const GENERIC_RESUME_ERROR =
  "We could not save this resume version. Please try again.";
export const GENERIC_RESUME_LOAD_ERROR =
  "We could not load your resume versions. Please try again.";
export const GENERIC_RESUME_DELETE_ERROR =
  "We could not delete this resume version. Please try again.";
export const GENERIC_ASSOCIATION_ERROR =
  "We could not update the resume association. Please try again.";

export interface ResumeVersionListItem {
  id: string;
  name: string;
  versionLabel: string;
  version: number;
  description: string | null;
  sourceFileName: string | null;
  notes: string | null;
  applicationCount: number;
  createdAt: string;
}

export interface ResumeVersionOption {
  id: string;
  name: string;
  versionLabel: string;
  version: number;
}

export type ResumeVersionValues = Record<keyof ResumeVersionInput, string>;

export type ResumeMutationResult =
  | { success: true; id: string }
  | { success: false; kind: "not_found" | "error"; message: string };

export async function listResumeVersions(
  userId: string,
): Promise<
  | { status: "success"; items: ResumeVersionListItem[] }
  | { status: "error"; message: string }
> {
  try {
    const { prisma } = await import("@/server/db/client");
    const versions = await prisma.resumeVersion.findMany({
      where: { resume: { userId } },
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        versionLabel: true,
        version: true,
        description: true,
        sourceFileName: true,
        notes: true,
        createdAt: true,
        resume: { select: { name: true } },
        _count: { select: { applications: true } },
      },
    });

    return {
      status: "success",
      items: versions.map((item) => ({
        id: item.id,
        name: item.resume.name,
        versionLabel: item.versionLabel,
        version: item.version,
        description: item.description,
        sourceFileName: item.sourceFileName,
        notes: item.notes,
        applicationCount: item._count.applications,
        createdAt: item.createdAt.toISOString(),
      })),
    };
  } catch {
    return { status: "error", message: GENERIC_RESUME_LOAD_ERROR };
  }
}

export async function listResumeVersionOptions(
  userId: string,
): Promise<
  { status: "success"; options: ResumeVersionOption[] } | { status: "error" }
> {
  try {
    const { prisma } = await import("@/server/db/client");
    const versions = await prisma.resumeVersion.findMany({
      where: { resume: { userId } },
      orderBy: [{ resume: { name: "asc" } }, { version: "desc" }],
      select: {
        id: true,
        versionLabel: true,
        version: true,
        resume: { select: { name: true } },
      },
    });

    return {
      status: "success",
      options: versions.map((item) => ({
        id: item.id,
        name: item.resume.name,
        versionLabel: item.versionLabel,
        version: item.version,
      })),
    };
  } catch {
    return { status: "error" };
  }
}

export async function createResumeVersion(
  userId: string,
  input: ResumeVersionInput,
): Promise<ResumeMutationResult> {
  try {
    const { prisma } = await import("@/server/db/client");
    const id = await prisma.$transaction(async (tx) => {
      let resume = await tx.resume.findUnique({
        where: { userId_name: { userId, name: input.name } },
        select: {
          id: true,
          versions: {
            orderBy: { version: "desc" },
            take: 1,
            select: { version: true },
          },
        },
      });

      if (!resume) {
        resume = await tx.resume.create({
          data: { userId, name: input.name },
          select: { id: true, versions: { select: { version: true } } },
        });
      }

      const created = await tx.resumeVersion.create({
        data: {
          resumeId: resume.id,
          version: (resume.versions[0]?.version ?? 0) + 1,
          versionLabel: input.versionLabel,
          description: input.description,
          sourceFileName: input.sourceFileName,
          notes: input.notes,
        },
        select: { id: true },
      });
      return created.id;
    });

    return { success: true, id };
  } catch {
    return { success: false, kind: "error", message: GENERIC_RESUME_ERROR };
  }
}

export async function getResumeVersionForEdit(
  userId: string,
  resumeVersionId: string,
): Promise<
  | { status: "success"; values: ResumeVersionValues }
  | { status: "not_found" }
  | { status: "error"; message: string }
> {
  try {
    const { prisma } = await import("@/server/db/client");
    const version = await prisma.resumeVersion.findFirst({
      where: { id: resumeVersionId, resume: { userId } },
      select: {
        versionLabel: true,
        description: true,
        sourceFileName: true,
        notes: true,
        resume: { select: { name: true } },
      },
    });
    if (!version) return { status: "not_found" };

    return {
      status: "success",
      values: {
        name: version.resume.name,
        versionLabel: version.versionLabel,
        description: version.description ?? "",
        sourceFileName: version.sourceFileName ?? "",
        notes: version.notes ?? "",
      },
    };
  } catch {
    return { status: "error", message: GENERIC_RESUME_LOAD_ERROR };
  }
}

export async function updateResumeVersion(
  userId: string,
  resumeVersionId: string,
  input: ResumeVersionInput,
): Promise<ResumeMutationResult> {
  try {
    const { prisma } = await import("@/server/db/client");
    const result = await prisma.$transaction(async (tx) => {
      const owned = await tx.resumeVersion.findFirst({
        where: { id: resumeVersionId, resume: { userId } },
        select: { resumeId: true },
      });
      if (!owned) return null;

      const resumeUpdate = await tx.resume.updateMany({
        where: { id: owned.resumeId, userId },
        data: { name: input.name },
      });
      const versionUpdate = await tx.resumeVersion.updateMany({
        where: { id: resumeVersionId, resume: { userId } },
        data: {
          versionLabel: input.versionLabel,
          description: input.description,
          sourceFileName: input.sourceFileName,
          notes: input.notes,
        },
      });
      return resumeUpdate.count === 1 && versionUpdate.count === 1;
    });

    if (!result) {
      return {
        success: false,
        kind: "not_found",
        message: GENERIC_RESUME_ERROR,
      };
    }
    return { success: true, id: resumeVersionId };
  } catch {
    return { success: false, kind: "error", message: GENERIC_RESUME_ERROR };
  }
}

export async function deleteResumeVersion(
  userId: string,
  resumeVersionId: string,
): Promise<ResumeMutationResult> {
  try {
    const { prisma } = await import("@/server/db/client");
    const deleted = await prisma.$transaction(async (tx) => {
      const owned = await tx.resumeVersion.findFirst({
        where: { id: resumeVersionId, resume: { userId } },
        select: { resumeId: true },
      });
      if (!owned) return false;

      const result = await tx.resumeVersion.deleteMany({
        where: { id: resumeVersionId, resume: { userId } },
      });
      if (result.count !== 1) return false;

      await tx.resume.deleteMany({
        where: { id: owned.resumeId, userId, versions: { none: {} } },
      });
      return true;
    });

    if (!deleted) {
      return {
        success: false,
        kind: "not_found",
        message: GENERIC_RESUME_DELETE_ERROR,
      };
    }
    return { success: true, id: resumeVersionId };
  } catch {
    return {
      success: false,
      kind: "error",
      message: GENERIC_RESUME_DELETE_ERROR,
    };
  }
}

export async function associateResumeVersion(
  userId: string,
  applicationId: string,
  resumeVersionId: string | null,
): Promise<
  | { success: true; resumeVersionId: string | null }
  | { success: false; message: string }
> {
  try {
    const { prisma } = await import("@/server/db/client");
    const application = await prisma.jobApplication.findFirst({
      where: { id: applicationId, userId },
      select: { id: true },
    });
    if (!application)
      return { success: false, message: GENERIC_ASSOCIATION_ERROR };

    if (resumeVersionId) {
      const resumeVersion = await prisma.resumeVersion.findFirst({
        where: { id: resumeVersionId, resume: { userId } },
        select: { id: true },
      });
      if (!resumeVersion) {
        return { success: false, message: GENERIC_ASSOCIATION_ERROR };
      }
    }

    const updated = await prisma.jobApplication.updateMany({
      where: { id: applicationId, userId },
      data: { resumeVersionId },
    });
    if (updated.count !== 1) {
      return { success: false, message: GENERIC_ASSOCIATION_ERROR };
    }
    return { success: true, resumeVersionId };
  } catch {
    return { success: false, message: GENERIC_ASSOCIATION_ERROR };
  }
}
