export const GENERIC_APPLICATION_DELETE_ERROR =
  "We could not delete this application. It may already be unavailable.";

interface ApplicationOwnershipPredicate {
  id: string;
  userId: string;
}

export interface DeleteJobApplicationDependencies {
  deleteApplication(args: {
    where: ApplicationOwnershipPredicate;
  }): Promise<{ count: number }>;
}

async function deleteApplication(args: {
  where: ApplicationOwnershipPredicate;
}): Promise<{ count: number }> {
  const { prisma } = await import("@/server/db/client");
  return prisma.jobApplication.deleteMany(args);
}

const defaultDependencies: DeleteJobApplicationDependencies = {
  deleteApplication,
};

export type DeleteJobApplicationResult =
  | { status: "success" }
  | { status: "not_found" }
  | { status: "error"; message: string };

export async function deleteJobApplication(
  userId: string,
  applicationId: string,
  dependencies: DeleteJobApplicationDependencies = defaultDependencies,
): Promise<DeleteJobApplicationResult> {
  try {
    const result = await dependencies.deleteApplication({
      where: { id: applicationId, userId },
    });

    return result.count === 1 ? { status: "success" } : { status: "not_found" };
  } catch {
    return { status: "error", message: GENERIC_APPLICATION_DELETE_ERROR };
  }
}
