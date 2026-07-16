import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ApplicationFilterForm } from "./application-search-form";

describe("ApplicationFilterForm", () => {
  it("renders accessible controls with the complete current URL state", () => {
    render(
      <ApplicationFilterForm
        state={{
          search: "Platform Engineer",
          status: "INTERVIEW",
          salary: "with-salary",
          deadline: "upcoming",
        }}
      />,
    );

    const form = screen.getByRole("search");
    expect(form).toHaveAttribute("action", "/applications");
    expect(form).toHaveAttribute("method", "get");
    expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue(
      "Platform Engineer",
    );
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveValue(
      "INTERVIEW",
    );
    expect(
      screen.getByRole("combobox", { name: "Salary availability" }),
    ).toHaveValue("with-salary");
    expect(
      screen.getByRole("combobox", { name: "Deadline timing" }),
    ).toHaveValue("upcoming");
    expect(
      screen.getByRole("button", { name: "Apply filters" }),
    ).toHaveAttribute("type", "submit");
    expect(
      screen.getByRole("link", { name: "Clear all search and filters" }),
    ).toHaveAttribute("href", "/applications");
  });

  it("provides every allowed status as visible text", () => {
    render(
      <ApplicationFilterForm
        state={{ search: "", status: null, salary: "any", deadline: "any" }}
      />,
    );

    const status = screen.getByRole("combobox", { name: "Status" });
    expect(status).toHaveTextContent(
      "All statusesSavedAppliedInterviewOfferRejected",
    );
  });

  it("does not render a redundant clear-all link without active criteria", () => {
    render(
      <ApplicationFilterForm
        state={{ search: "", status: null, salary: "any", deadline: "any" }}
      />,
    );

    expect(
      screen.queryByRole("link", { name: "Clear all search and filters" }),
    ).toBeNull();
  });

  it("resets native controls when canonical URL state remounts the form", () => {
    const { rerender } = render(
      <ApplicationFilterForm
        key="active"
        state={{
          search: "Acme",
          status: "APPLIED",
          salary: "with-salary",
          deadline: "upcoming",
        }}
      />,
    );

    rerender(
      <ApplicationFilterForm
        key="cleared"
        state={{ search: "", status: null, salary: "any", deadline: "any" }}
      />,
    );

    expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue("");
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveValue("");
    expect(
      screen.getByRole("combobox", { name: "Salary availability" }),
    ).toHaveValue("any");
    expect(
      screen.getByRole("combobox", { name: "Deadline timing" }),
    ).toHaveValue("any");
  });
});
