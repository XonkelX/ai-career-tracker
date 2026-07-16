import { describe, expect, it, vi } from "vitest";

import {
  deleteJobApplication,
  GENERIC_APPLICATION_DELETE_ERROR,
} from "./delete-job-application";

describe("deleteJobApplication", () => {
  it("deletes with both application ID and user ID in the predicate", async () => {
    const deleteApplication = vi.fn().mockResolvedValue({ count: 1 });

    await expect(
      deleteJobApplication("user_123", "application_123", {
        deleteApplication,
      }),
    ).resolves.toEqual({ status: "success" });
    expect(deleteApplication).toHaveBeenCalledWith({
      where: { id: "application_123", userId: "user_123" },
    });
  });

  it.each(["missing", "unowned"])(
    "returns the same not-found result for a %s application",
    async () => {
      await expect(
        deleteJobApplication("user_123", "application_123", {
          deleteApplication: vi.fn().mockResolvedValue({ count: 0 }),
        }),
      ).resolves.toEqual({ status: "not_found" });
    },
  );

  it("does not expose database errors", async () => {
    await expect(
      deleteJobApplication("user_123", "application_123", {
        deleteApplication: vi
          .fn()
          .mockRejectedValue(new Error("sensitive constraint details")),
      }),
    ).resolves.toEqual({
      status: "error",
      message: GENERIC_APPLICATION_DELETE_ERROR,
    });
  });
});
