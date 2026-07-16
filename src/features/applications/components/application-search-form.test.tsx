import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ApplicationSearchForm } from "./application-search-form";

describe("ApplicationSearchForm", () => {
  it("renders an accessible GET search form with the current query", () => {
    render(<ApplicationSearchForm searchTerm="Platform Engineer" />);

    const form = screen.getByRole("search");
    expect(form).toHaveAttribute("action", "/applications");
    expect(form).toHaveAttribute("method", "get");
    expect(
      screen.getByRole("searchbox", { name: "Search applications" }),
    ).toHaveValue("Platform Engineer");
    expect(screen.getByRole("button", { name: "Search" })).toHaveAttribute(
      "type",
      "submit",
    );
    expect(screen.getByRole("link", { name: "Clear" })).toHaveAttribute(
      "href",
      "/applications",
    );
  });

  it("does not render a redundant clear link without an active search", () => {
    render(<ApplicationSearchForm searchTerm="" />);

    expect(screen.queryByRole("link", { name: "Clear" })).toBeNull();
  });
});
