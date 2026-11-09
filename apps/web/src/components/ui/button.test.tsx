import { describe, expect, it } from "vite-plus/test";
import { buttonVariants } from "./button";

describe("buttonVariants", () => {
  it("paints create actions green", () => {
    const classes = buttonVariants({ variant: "create" }).split(" ");
    expect(classes).toEqual(
      expect.arrayContaining(["bg-create", "text-create-foreground"]),
    );
    expect(classes).not.toContain("ring-create-tint");
  });

  it("gives round create icon buttons a light green halo", () => {
    const classes = buttonVariants({ variant: "create", size: "icon" }).split(
      " ",
    );
    expect(classes).toEqual(
      expect.arrayContaining(["rounded-full", "ring-3", "ring-create-tint"]),
    );
  });
});
