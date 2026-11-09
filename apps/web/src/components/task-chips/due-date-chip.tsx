import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import TaskDueDatePopover from "@/components/task/task-due-date-popover";
import { cn } from "@/lib/cn";
import { type DueDateStatus, getDueDateStatus } from "@/lib/due-date-status";
import { formatDateMedium } from "@/lib/format";
import { getRelativeDueDate } from "@/lib/relative-due-date";
import type Task from "@/types/task";
import { formatRelativeDueDate } from "./format-relative-due-date";
import { stopCardEvents } from "./stop-card-events";
import { taskChipClass } from "./task-chip-class";

const solidChipClass: Partial<Record<DueDateStatus, string>> = {
  overdue:
    "border-transparent bg-due-overdue font-medium text-due-overdue-foreground hover:border-transparent hover:bg-due-overdue/90 data-popup-open:border-transparent data-popup-open:bg-due-overdue",
  "due-soon":
    "border-transparent bg-due-soon font-medium text-due-soon-foreground hover:border-transparent hover:bg-due-soon/90 data-popup-open:border-transparent data-popup-open:bg-due-soon",
};

type DueDateChipProps = {
  task: Task;
  isCompleted?: boolean;
};

export function DueDateChip({ task, isCompleted = false }: DueDateChipProps) {
  const { t } = useTranslation();
  if (!task.dueDate) return null;

  const relative = getRelativeDueDate(task.dueDate);
  const solid = solidChipClass[getDueDateStatus(task.dueDate, isCompleted)];

  return (
    <TaskDueDatePopover task={task}>
      <button
        type="button"
        title={t("tasks:due.fullDate", {
          date: formatDateMedium(task.dueDate),
        })}
        className={cn(taskChipClass, solid)}
        {...stopCardEvents}
      >
        <Calendar className={cn(!solid && "text-chip-icon")} />
        {formatRelativeDueDate(relative, task.dueDate, t)}
      </button>
    </TaskDueDatePopover>
  );
}
