import type { CSSProperties } from "react";

export type Tone = {
  color: string;
  foreground: string;
};

export function toneStyle(tone: Tone): CSSProperties {
  return {
    "--tone": tone.color,
    "--tone-foreground": tone.foreground,
  } as CSSProperties;
}
