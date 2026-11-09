"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";

import { cn } from "@/lib/cn";
import { resolveAvatarSrc } from "@/lib/resolve-avatar-src";
import { getPaletteTone } from "@/lib/tone/palette";
import { toneStyle } from "@/lib/tone/tone";

function Avatar({ className, ...props }: AvatarPrimitive.Root.Props) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "inline-flex size-8 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-card align-middle font-medium text-xs",
        className,
      )}
      data-slot="avatar"
      {...props}
    />
  );
}

function AvatarImage({
  className,
  src,
  ...props
}: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      className={cn("size-full object-cover", className)}
      data-slot="avatar-image"
      src={typeof src === "string" ? resolveAvatarSrc(src) : src}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  colorSeed,
  ...props
}: AvatarPrimitive.Fallback.Props & { colorSeed?: string | null }) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "flex size-full items-center justify-center rounded-full",
        colorSeed ? "bg-(--tone) text-(--tone-foreground)" : "bg-muted",
        className,
      )}
      data-slot="avatar-fallback"
      style={colorSeed ? toneStyle(getPaletteTone(colorSeed)) : undefined}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
