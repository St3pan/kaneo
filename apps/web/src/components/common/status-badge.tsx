import { cn } from "@/lib/cn";
import { getColumnIcon } from "@/lib/column";
import { getStatusTone } from "@/lib/tone/status-tone";
import { toneStyle } from "@/lib/tone/tone";

type StatusBadgeProps = {
  status: string;
  label: string;
  isFinal?: boolean;
  icon?: string | null;
  className?: string;
};

export function StatusBadge({
  status,
  label,
  isFinal,
  icon,
  className,
}: StatusBadgeProps) {
  return (
    <span
      data-slot="status-badge"
      style={toneStyle(getStatusTone(status, isFinal))}
      className={cn(
        "inline-flex h-5 min-w-0 max-w-full items-center gap-1 rounded-[5px] bg-(--tone) px-1.5 font-medium text-(--tone-foreground) text-xs [&_svg]:size-3! [&_svg]:shrink-0",
        className,
      )}
    >
      {getColumnIcon(status, isFinal, icon, false)}
      <span className="truncate">{label}</span>
    </span>
  );
}
