import { Plus } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function SectionAddButton({
  className,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "flex size-6.5 shrink-0 items-center justify-center rounded-full text-create outline-none transition-colors hover:bg-create-tint focus-visible:bg-create-tint disabled:pointer-events-none disabled:opacity-50 data-popup-open:bg-create-tint",
        className,
      )}
      {...props}
    >
      <Plus className="size-3.5" />
    </button>
  );
}
