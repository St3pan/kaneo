import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";
import { getPriorityIcon } from "./priority";

describe("getPriorityIcon", () => {
  it.each(["urgent", "high", "medium", "low"])(
    "fills the %s square with its priority colour",
    (priority) => {
      const markup = renderToStaticMarkup(getPriorityIcon(priority));
      expect(markup).toContain(`bg-priority-${priority}`);
      expect(markup).toContain(`text-priority-${priority}-foreground`);
    },
  );

  it.each(["no-priority", "", "constructor", "__proto__"])(
    "draws only an outline for %j",
    (priority) => {
      const markup = renderToStaticMarkup(getPriorityIcon(priority));
      expect(markup).toContain("border-priority-none");
      expect(markup).not.toContain("bg-priority-");
    },
  );
});
