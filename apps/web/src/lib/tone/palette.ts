import { hashToIndex } from "./hash-to-index";
import type { Tone } from "./tone";

export const PALETTE_SIZE = 10;

export const paletteTones: Tone[] = Array.from(
  { length: PALETTE_SIZE },
  (_, index) => ({
    color: `var(--palette-${index + 1})`,
    foreground: `var(--palette-${index + 1}-foreground)`,
  }),
);

export function getPaletteTone(seed: string): Tone {
  return paletteTones[hashToIndex(seed, PALETTE_SIZE)];
}
