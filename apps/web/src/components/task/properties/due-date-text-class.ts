import type { DueDateStatus } from "@/lib/due-date-status";

export const dueDateTextClass: Record<DueDateStatus, string> = {
  overdue: "text-destructive-foreground",
  "due-soon": "text-link",
  "far-future": "",
  "no-due-date": "",
};

export const dueDateChipClass: Record<DueDateStatus, string> = {
  overdue: "rounded-[4px] bg-due-overdue px-1.5 text-due-overdue-foreground",
  "due-soon": "rounded-[4px] bg-due-soon px-1.5 text-due-soon-foreground",
  "far-future": "",
  "no-due-date": "",
};
