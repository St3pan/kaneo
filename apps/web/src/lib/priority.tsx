import { Minus } from "lucide-react";
import { ClassicPriorityIcon } from "@/components/task-chips/classic-priority-icon";
import { PriorityGlyph } from "@/components/task-chips/priority-glyph";
import { useUserPreferencesStore } from "@/store/user-preferences";

const PRIORITIES = new Set(["low", "medium", "high", "urgent"]);

function NoPriorityIcon() {
  const iconStyle = useUserPreferencesStore((state) => state.priorityIconStyle);

  if (iconStyle === "classic") return <ClassicPriorityIcon priority={null} />;
  return <Minus className="size-3.5 text-muted-foreground" />;
}

export function getPriorityIcon(priority: string) {
  if (!PRIORITIES.has(priority)) return <NoPriorityIcon />;
  return <PriorityGlyph priority={priority} />;
}
