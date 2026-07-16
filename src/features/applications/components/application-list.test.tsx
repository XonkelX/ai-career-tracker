import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { ApplicationListItem } from "@/server/applications/list-job-applications";

vi.mock("@/app/(dashboard)/applications/actions", () => ({
  deleteJobApplicationAction: vi.fn().mockResolvedValue({ status: "idle" }),
}));

import {
  ApplicationList,
  ApplicationListError,
  ApplicationListLoading,
} from "./application-list";

const application: ApplicationListItem = {
  id: "application_123",
  companyName: "Acme",
  jobTitle: "Engineer",
  location: "Remote",
  status: "INTERVIEW",
  salaryMinMinor: "8500000",
  salaryMaxMinor: "10500000",
  salaryCurrency: "USD",
  salaryPeriod: "ANNUAL",
  deadline: "2026-08-01T00:00:00.000Z",
  dateApplied: "2026-07-16T00:00:00.000Z",
  createdAt: "2026-07-15T10:00:00.000Z",
  updatedAt: "2026-07-16T11:00:00.000Z",
};

describe("ApplicationList", () => {
  it("renders equivalent essential data and descriptive links in table and card views", () => {
    render(<ApplicationList applications={[application]} />);

    const table = screen.getByRole("table", {
      name: "Your saved job applications",
    });
    expect(within(table).getByRole("rowheader")).toHaveTextContent("Engineer");
    expect(within(table).getByText("Interview")).toBeVisible();
    expect(within(table).getByText("Deadline")).toBeVisible();
    expect(within(table).getByText("Applied")).toBeVisible();
    expect(within(table).getByText("Created")).toBeVisible();

    const cards = screen.getByRole("list", {
      name: "Your saved job applications",
    });
    expect(within(cards).getByRole("listitem")).toHaveTextContent("Engineer");
    expect(within(cards).getByText("Interview")).toBeVisible();
    expect(
      screen.getAllByRole("link", { name: "View Engineer at Acme" }),
    ).toHaveLength(2);
    expect(screen.getByText("1 application")).toBeVisible();
  });

  it("renders an understandable empty state with a creation link", () => {
    render(<ApplicationList applications={[]} />);

    expect(
      screen.getByRole("heading", { name: "No applications yet" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Add your first application" }),
    ).toHaveAttribute("href", "/applications/new");
  });

  it("renders safe error and non-focusing loading states", () => {
    const { rerender } = render(
      <ApplicationListError message="We could not load your applications. Please try again." />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Applications unavailable",
    );

    rerender(<ApplicationListLoading />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading applications",
    );
    expect(document.activeElement).toBe(document.body);
  });

  it("names the delete dialog, traps focus, and restores the trigger on cancel", async () => {
    const user = userEvent.setup();
    render(<ApplicationList applications={[application]} />);
    const trigger = screen.getAllByRole("button", {
      name: "Delete Engineer at Acme",
    })[0];
    expect(trigger).toBeDefined();
    if (!trigger) return;

    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Delete application?" });
    expect(dialog).toHaveTextContent("Engineer");
    expect(dialog).toHaveTextContent("Acme");
    expect(dialog).toHaveTextContent("cannot be undone");
    const cancel = within(dialog).getByRole("button", { name: "Cancel" });
    const confirm = within(dialog).getByRole("button", {
      name: "Delete application",
    });
    expect(cancel).toHaveFocus();

    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(confirm).toHaveFocus();
    await user.tab();
    expect(cancel).toHaveFocus();

    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps the dialog open and focuses an accessible server error", async () => {
    const user = userEvent.setup();
    const deleteAction = vi.fn().mockResolvedValue({
      status: "error",
      message:
        "We could not delete this application. It may already be unavailable.",
    });
    render(
      <ApplicationList
        applications={[application]}
        deleteAction={deleteAction}
      />,
    );

    await user.click(
      screen.getAllByRole("button", { name: "Delete Engineer at Acme" })[0]!,
    );
    const dialog = screen.getByRole("dialog", { name: "Delete application?" });
    await user.click(
      within(dialog).getByRole("button", { name: "Delete application" }),
    );

    const error = await within(dialog).findByRole("alert");
    expect(error).toHaveTextContent("could not delete");
    expect(error).toHaveFocus();
    expect(dialog).toBeInTheDocument();
  });

  it("removes a deleted application, announces success, and renders empty state", async () => {
    const user = userEvent.setup();
    const deleteAction = vi.fn().mockImplementation(async (applicationId) => ({
      status: "success",
      applicationId,
      message: "Application deleted.",
    }));
    render(
      <ApplicationList
        applications={[application]}
        deleteAction={deleteAction}
      />,
    );

    await user.click(
      screen.getAllByRole("button", { name: "Delete Engineer at Acme" })[0]!,
    );
    await user.click(
      within(
        screen.getByRole("dialog", { name: "Delete application?" }),
      ).getByRole("button", { name: "Delete application" }),
    );

    expect(
      await screen.findByRole("heading", { name: "No applications yet" }),
    ).toBeVisible();
    const announcement = screen.getByRole("status");
    expect(announcement).toHaveTextContent("Engineer at Acme was deleted");
    expect(announcement).toHaveFocus();
  });

  it("disables controls while pending to prevent duplicate submissions", async () => {
    const user = userEvent.setup();
    let resolveAction:
      ((state: { status: "error"; message: string }) => void) | undefined;
    const deleteAction = vi.fn(
      () =>
        new Promise<{ status: "error"; message: string }>((resolve) => {
          resolveAction = resolve;
        }),
    );
    render(
      <ApplicationList
        applications={[application]}
        deleteAction={deleteAction}
      />,
    );

    await user.click(
      screen.getAllByRole("button", { name: "Delete Engineer at Acme" })[0]!,
    );
    const dialog = screen.getByRole("dialog", { name: "Delete application?" });
    const confirm = within(dialog).getByRole("button", {
      name: "Delete application",
    });
    await user.click(confirm);

    expect(
      within(dialog).getByRole("button", { name: "Deleting application…" }),
    ).toBeDisabled();
    expect(
      within(dialog).getByRole("button", { name: "Cancel" }),
    ).toBeDisabled();
    expect(deleteAction).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveAction?.({
        status: "error",
        message:
          "We could not delete this application. It may already be unavailable.",
      });
    });
    expect(await within(dialog).findByRole("alert")).toBeVisible();
  });
});
