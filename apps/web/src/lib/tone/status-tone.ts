import { hashToIndex } from "./hash-to-index";
import { PALETTE_SIZE, paletteTones } from "./palette";
import type { Tone } from "./tone";

const toDo: Tone = {
  color: "var(--status-todo)",
  foreground: "var(--status-todo-foreground)",
};

const done: Tone = {
  color: "var(--status-done)",
  foreground: "var(--status-done-foreground)",
};

const openColumnTones = paletteTones.slice(0, PALETTE_SIZE - 1);

const statusTones: Record<string, Tone> = {
  "to-do": toDo,
  "in-progress": {
    color: "var(--status-in-progress)",
    foreground: "var(--status-in-progress-foreground)",
  },
  "in-review": {
    color: "var(--status-in-review)",
    foreground: "var(--status-in-review-foreground)",
  },
  done,
  archived: done,
};

export function getStatusTone(
  status: string | null | undefined,
  isFinal = false,
): Tone {
  const key = status ?? "";
  if (Object.hasOwn(statusTones, key)) return statusTones[key];
  if (isFinal) return done;
  return openColumnTones[hashToIndex(key, openColumnTones.length)];
}
