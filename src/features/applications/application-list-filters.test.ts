import { describe, expect, it } from "vitest";

import {
  applicationListUrlNeedsNormalization,
  buildApplicationListSearchParams,
  hasActiveApplicationCriteria,
  parseApplicationListUrlState,
} from "./application-list-filters";

describe("application list URL filters", () => {
  it("normalizes supported values and repeated search whitespace", () => {
    const state = parseApplicationListUrlState({
      search: "  Platform   Engineer ",
      status: " interview ",
      salary: " WITH-SALARY ",
      deadline: " UPCOMING ",
    });

    expect(state).toEqual({
      search: "Platform Engineer",
      status: "INTERVIEW",
      salary: "with-salary",
      deadline: "upcoming",
    });
    expect(buildApplicationListSearchParams(state).toString()).toBe(
      "search=Platform+Engineer&status=INTERVIEW&salary=with-salary&deadline=upcoming",
    );
    expect(hasActiveApplicationCriteria(state)).toBe(true);
  });

  it("safely normalizes unsupported values to unfiltered defaults", () => {
    const raw = {
      status: "administrator",
      salary: "high-paying",
      deadline: "next-month",
    };
    const state = parseApplicationListUrlState(raw);

    expect(state).toEqual({
      search: "",
      status: null,
      salary: "any",
      deadline: "any",
    });
    expect(buildApplicationListSearchParams(state).toString()).toBe("");
    expect(applicationListUrlNeedsNormalization(raw, state)).toBe(true);
    expect(hasActiveApplicationCriteria(state)).toBe(false);
  });

  it("removes explicit empty and any values from the canonical URL", () => {
    const raw = { search: "", status: "", salary: "any", deadline: "any" };
    const state = parseApplicationListUrlState(raw);

    expect(applicationListUrlNeedsNormalization(raw, state)).toBe(true);
    expect(buildApplicationListSearchParams(state).toString()).toBe("");
  });
});
