import { describe, expect, it } from "vite-plus/test";
import { paletteTones } from "./palette";
import { getStatusTone } from "./status-tone";

describe("getStatusTone", () => {
  it("gives the default columns their own status colours", () => {
    expect(getStatusTone("to-do").color).toBe("var(--status-todo)");
    expect(getStatusTone("in-progress").color).toBe(
      "var(--status-in-progress)",
    );
    expect(getStatusTone("in-review").color).toBe("var(--status-in-review)");
    expect(getStatusTone("done").color).toBe("var(--status-done)");
    expect(getStatusTone("archived").color).toBe("var(--status-done)");
  });

  it("uses the done colour for any final column", () => {
    expect(getStatusTone("shipped", true).color).toBe("var(--status-done)");
  });

  it("takes other columns from the palette, the same way every time", () => {
    const tone = getStatusTone("waiting-for-driver");
    expect(paletteTones).toContain(tone);
    expect(getStatusTone("waiting-for-driver")).toBe(tone);
  });

  it("keeps grey for final columns only", () => {
    const grey = paletteTones[paletteTones.length - 1];
    const slugs = [
      "погодження",
      "закупівля-матеріалів",
      "очікує-водія",
      "planned",
      ...Array.from({ length: 300 }, (_, index) => `column-${index}`),
    ];

    for (const slug of slugs) {
      expect(getStatusTone(slug)).not.toBe(grey);
    }
    expect(getStatusTone("погодження", true).color).toBe("var(--status-done)");
  });

  it("copes with a missing status", () => {
    expect(paletteTones).toContain(getStatusTone(undefined));
    expect(getStatusTone(null, true).color).toBe("var(--status-done)");
  });

  it("ignores inherited object keys", () => {
    expect(paletteTones).toContain(getStatusTone("constructor"));
    expect(paletteTones).toContain(getStatusTone("__proto__"));
  });
});
