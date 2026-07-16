import { describe, expect, it } from "vitest";

import { getSafeCallbackUrl } from "./callback-url";

describe("getSafeCallbackUrl", () => {
  it("accepts internal application paths", () => {
    expect(getSafeCallbackUrl("/applications?status=APPLIED")).toBe(
      "/applications?status=APPLIED",
    );
  });

  it("normalizes same-origin absolute callback URLs from Auth.js", () => {
    expect(
      getSafeCallbackUrl(
        "http://localhost:3000/applications?status=APPLIED#results",
        "http://localhost:3000",
      ),
    ).toBe("/applications?status=APPLIED#results");
  });

  it("rejects absolute callback URLs from a different origin", () => {
    expect(
      getSafeCallbackUrl(
        "https://attacker.example/dashboard",
        "https://career.example",
      ),
    ).toBe("/dashboard");
  });

  it.each([
    undefined,
    "https://attacker.example",
    "//attacker.example",
    "/\\attacker.example",
    "/%2f%2fattacker.example",
    "/%5cattacker.example",
    "/dashboard\nSet-Cookie: unsafe=1",
  ])("falls back for unsafe callback value %s", (value) => {
    expect(getSafeCallbackUrl(value)).toBe("/dashboard");
  });
});
