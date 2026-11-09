import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";
import { getPaletteTone } from "@/lib/tone/palette";
import { ProjectColorBar } from "./project-color-bar";

afterEach(cleanup);

describe("ProjectColorBar", () => {
  it("draws a separate rounded bar in the project colour", () => {
    const { container } = render(<ProjectColorBar projectId="project-1" />);
    const bar = container.querySelector(
      '[data-slot="project-color-bar"]',
    ) as HTMLElement;

    expect(bar.style.backgroundColor).toBe(getPaletteTone("project-1").color);
    expect(bar).toHaveClass("absolute", "w-[3px]", "rounded-full");
    expect(bar).toHaveAttribute("aria-hidden", "true");
  });
});
