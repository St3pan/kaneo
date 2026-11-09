import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";
import { getInitials } from "@/lib/get-initials";

type DirectoryAvatarProps = {
  id?: string | null;
  name: string;
  image: string | null | undefined;
  className?: string;
};

export function DirectoryAvatar({
  id,
  name,
  image,
  className,
}: DirectoryAvatarProps) {
  return (
    <Avatar className={cn("size-7 border bg-muted", className)}>
      {image ? <AvatarImage src={image} alt={name} /> : null}
      <AvatarFallback
        colorSeed={id ?? name}
        className="text-[10px] font-semibold"
      >
        {getInitials(name, "?")}
      </AvatarFallback>
    </Avatar>
  );
}
