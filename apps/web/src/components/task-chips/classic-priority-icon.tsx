import {
  ChevronDown,
  ChevronsUp,
  ChevronUp,
  CircleAlert,
  type LucideIcon,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/cn";

const ICONS: Record<string, { Icon: LucideIcon; tone: string }> = {
  low: {
    Icon: ChevronDown,
    tone: "bg-priority-low text-priority-low-foreground",
  },
  medium: {
    Icon: ChevronUp,
    tone: "bg-priority-medium text-priority-medium-foreground",
  },
  high: {
    Icon: ChevronsUp,
    tone: "bg-priority-high text-priority-high-foreground",
  },
  urgent: {
    Icon: CircleAlert,
    tone: "bg-priority-urgent text-priority-urgent-foreground",
  },
};

const NO_PRIORITY = {
  Icon: Minus,
  tone: "border border-priority-none text-priority-none",
};

type ClassicPriorityIconProps = {
  priority: string | null | undefined;
  className?: string;
};

export function ClassicPriorityIcon({
  priority,
  className,
}: ClassicPriorityIconProps) {
  const { Icon, tone } =
    priority && Object.hasOwn(ICONS, priority) ? ICONS[priority] : NO_PRIORITY;

  return (
    <span
      aria-hidden="true"
      data-slot="priority-icon"
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] [&>svg]:size-3!",
        tone,
        className,
      )}
    >
      <Icon strokeWidth={2.5} />
    </span>
  );
}
