import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";
import { getPaletteTone } from "@/lib/tone/palette";
import { ProjectIconTile } from "./project-icon-tile";

afterEach(cleanup);

describe("ProjectIconTile", () => {
  it("colours the tile from the project id", () => {
    const { container } = render(
      <ProjectIconTile projectId="project-1" icon="Layout" />,
    );
    const tile = container.querySelector(
      '[data-slot="project-icon-tile"]',
    ) as HTMLElement;

    expect(tile.style.getPropertyValue("--tone")).toBe(
      getPaletteTone("project-1").color,
    );
  });

  it("falls back to the default icon for unknown or inherited names", () => {
    for (const icon of ["missing", "constructor", null]) {
      const { container } = render(
        <ProjectIconTile projectId="p" icon={icon} />,
      );
      expect(container.querySelector("svg")).not.toBeNull();
      cleanup();
    }
  });
});
