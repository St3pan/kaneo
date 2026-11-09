import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";
import { getPaletteTone } from "@/lib/tone/palette";
import { Avatar, AvatarFallback } from "./avatar";

afterEach(cleanup);

describe("AvatarFallback", () => {
  it("fills the circle with the palette colour of the seed", () => {
    render(
      <Avatar>
        <AvatarFallback colorSeed="user-1">AB</AvatarFallback>
      </Avatar>,
    );

    const fallback = screen.getByText("AB");
    expect(fallback.style.getPropertyValue("--tone")).toBe(
      getPaletteTone("user-1").color,
    );
    expect(fallback).toHaveClass("bg-(--tone)", "text-(--tone-foreground)");
  });

  it("stays neutral without a seed", () => {
    render(
      <Avatar>
        <AvatarFallback>?</AvatarFallback>
      </Avatar>,
    );

    expect(screen.getByText("?")).toHaveClass("bg-muted");
  });
});
