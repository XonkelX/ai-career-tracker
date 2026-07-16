import { describe, expect, it } from "vitest";

import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
} from "./application-status";

describe("application statuses", () => {
  it("provides a user-facing label for every status", () => {
    expect(
      APPLICATION_STATUSES.every((status) => APPLICATION_STATUS_LABELS[status]),
    ).toBe(true);
  });
});
