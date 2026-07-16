import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/(auth)/sign-up/actions", () => ({
  registerUserAction: vi.fn(async (state) => state),
}));

import { RegistrationForm } from "./registration-form";

describe("RegistrationForm", () => {
  it("exposes labeled registration fields and password requirements", () => {
    render(<RegistrationForm />);

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute(
      "autocomplete",
      "name",
    );
    expect(
      screen.getByRole("textbox", { name: "Email address" }),
    ).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "autocomplete",
      "new-password",
    );
    expect(screen.getByLabelText("Confirm password")).toBeRequired();
    expect(screen.getByText("At least 12 characters")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Create account" }),
    ).toBeEnabled();
  });
});
