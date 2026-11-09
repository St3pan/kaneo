import { describe, expect, it } from "vite-plus/test";
import { hashToIndex } from "./hash-to-index";

describe("hashToIndex", () => {
  it("returns the same index for the same seed", () => {
    expect(hashToIndex("project-1", 10)).toBe(hashToIndex("project-1", 10));
  });

  it("stays inside the requested range", () => {
    for (const seed of ["", "a", "user_42", "Агрохолдинг", "🙂"]) {
      const index = hashToIndex(seed, 10);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(10);
    }
  });

  it("spreads different seeds across the range", () => {
    const seeds = Array.from({ length: 200 }, (_, index) => `seed-${index}`);
    const used = new Set(seeds.map((seed) => hashToIndex(seed, 10)));
    expect(used.size).toBe(10);
  });
});
