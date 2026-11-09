import icons from "@/constants/project-icons";
import { cn } from "@/lib/cn";
import { getPaletteTone } from "@/lib/tone/palette";
import { toneStyle } from "@/lib/tone/tone";

type ProjectIconTileProps = {
  projectId: string;
  icon?: string | null;
  className?: string;
};

export function ProjectIconTile({
  projectId,
  icon,
  className,
}: ProjectIconTileProps) {
  const Icon =
    icon && Object.hasOwn(icons, icon)
      ? icons[icon as keyof typeof icons]
      : icons.Layout;

  return (
    <span
      aria-hidden="true"
      data-slot="project-icon-tile"
      style={toneStyle(getPaletteTone(projectId))}
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded-[5px] bg-(--tone) text-(--tone-foreground) [&>svg]:size-3.5!",
        className,
      )}
    >
      <Icon />
    </span>
  );
}
