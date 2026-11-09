import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";
import { StatusBadge } from "./status-badge";

afterEach(cleanup);

describe("StatusBadge", () => {
  it("fills the badge with the status colour and keeps the label", () => {
    render(<StatusBadge status="in-progress" label="In progress" />);

    const badge = screen
      .getByText("In progress")
      .closest('[data-slot="status-badge"]') as HTMLElement;
    expect(badge.style.getPropertyValue("--tone")).toBe(
      "var(--status-in-progress)",
    );
    expect(badge.style.getPropertyValue("--tone-foreground")).toBe(
      "var(--status-in-progress-foreground)",
    );
    expect(badge.querySelector("svg")?.getAttribute("style")).toBeNull();
  });

  it("treats a custom final column as done", () => {
    render(<StatusBadge status="shipped" label="Shipped" isFinal />);

    const badge = screen
      .getByText("Shipped")
      .closest('[data-slot="status-badge"]') as HTMLElement;
    expect(badge.style.getPropertyValue("--tone")).toBe("var(--status-done)");
  });
});
