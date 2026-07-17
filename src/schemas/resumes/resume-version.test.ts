import { describe, expect, it } from "vitest";

import { resumeAssociationSchema, resumeVersionSchema } from "./resume-version";

describe("resumeVersionSchema", () => {
  it("normalizes single-line whitespace and optional values", () => {
    expect(
      resumeVersionSchema.parse({
        name: "  Software   Engineer Resume ",
        versionLabel: " Frontend   v2 ",
        description: "  Tailored for product teams.  ",
        sourceFileName: " oniel-resume.pdf ",
        notes: "  Used for Acme.\n  ",
      }),
    ).toEqual({
      name: "Software Engineer Resume",
      versionLabel: "Frontend v2",
      description: "Tailored for product teams.",
      sourceFileName: "oniel-resume.pdf",
      notes: "Used for Acme.",
    });
  });

  it("requires a name and version label and enforces length limits", () => {
    const result = resumeVersionSchema.safeParse({
      name: " ",
      versionLabel: "",
      description: "x".repeat(501),
      sourceFileName: "",
      notes: "",
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.flatten().fieldErrors).toMatchObject({
        name: ["Name is required."],
        versionLabel: ["Version label is required."],
        description: ["Description must be 500 characters or fewer."],
      });
  });

  it("maps an empty association to null", () => {
    expect(resumeAssociationSchema.parse({ resumeVersionId: " " })).toEqual({
      resumeVersionId: null,
    });
  });
});
