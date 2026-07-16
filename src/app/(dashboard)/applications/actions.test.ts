import { beforeEach, describe, expect, it, vi } from "vitest";

const { deleteJobApplication, requireAuthenticatedUser, revalidatePath } =
  vi.hoisted(() => ({
    deleteJobApplication: vi.fn(),
    requireAuthenticatedUser: vi.fn(),
    revalidatePath: vi.fn(),
  }));

vi.mock("next/cache", () => ({ revalidatePath }));
vi.mock("@/server/auth/session", () => ({ requireAuthenticatedUser }));
vi.mock("@/server/applications/delete-job-application", () => ({
  deleteJobApplication,
  GENERIC_APPLICATION_DELETE_ERROR:
    "We could not delete this application. It may already be unavailable.",
}));

import { deleteJobApplicationAction } from "./actions";

describe("deleteJobApplicationAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAuthenticatedUser.mockResolvedValue({ id: "user_123" });
  });

  it("uses the authenticated user and revalidates after success", async () => {
    deleteJobApplication.mockResolvedValue({ status: "success" });

    await expect(
      deleteJobApplicationAction(
        "application_123",
        { status: "idle" },
        new FormData(),
      ),
    ).resolves.toEqual({
      status: "success",
      applicationId: "application_123",
      message: "Application deleted.",
    });
    expect(deleteJobApplication).toHaveBeenCalledWith(
      "user_123",
      "application_123",
    );
    expect(revalidatePath).toHaveBeenCalledWith("/applications");
  });

  it.each(["not_found", "error"])(
    "returns the same safe message for %s",
    async (status) => {
      deleteJobApplication.mockResolvedValue({ status });

      await expect(
        deleteJobApplicationAction(
          "application_123",
          { status: "idle" },
          new FormData(),
        ),
      ).resolves.toEqual({
        status: "error",
        message:
          "We could not delete this application. It may already be unavailable.",
      });
      expect(revalidatePath).not.toHaveBeenCalled();
    },
  );
});
