import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/app/(auth)/sign-in/actions", () => ({
  loginAction: vi.fn(async (state) => state),
}));

import { LoginForm } from "./login-form";

describe("LoginForm", () => {
  it("exposes accessible login controls and a safe callback value", () => {
    const { container } = render(<LoginForm callbackUrl="/applications" />);

    expect(
      screen.getByRole("textbox", { name: "Email address" }),
    ).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "autocomplete",
      "current-password",
    );
    expect(screen.getByRole("button", { name: "Sign in" })).toBeEnabled();
    expect(container.querySelector('input[name="callbackUrl"]')).toHaveValue(
      "/applications",
    );
  });
});
