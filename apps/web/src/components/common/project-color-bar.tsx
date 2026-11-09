import { cn } from "@/lib/cn";
import { getPaletteTone } from "@/lib/tone/palette";

type ProjectColorBarProps = {
  projectId: string;
  className?: string;
};

export function ProjectColorBar({
  projectId,
  className,
}: ProjectColorBarProps) {
  return (
    <span
      aria-hidden="true"
      data-slot="project-color-bar"
      style={{ backgroundColor: getPaletteTone(projectId).color }}
      className={cn(
        "pointer-events-none absolute inset-y-1.5 left-0 w-[3px] rounded-full",
        className,
      )}
    />
  );
}
