import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/get-initials";

type CurrentOwnerRowProps = {
  userId?: string;
  name: string;
  email: string;
  image?: string | null;
};

export function CurrentOwnerRow({
  userId,
  name,
  email,
  image,
}: CurrentOwnerRowProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3.5 px-4 py-3.5">
      <Avatar className="size-8">
        <AvatarImage src={image ?? ""} alt="" />
        <AvatarFallback
          colorSeed={userId ?? email}
          className="border border-border/30 text-xs font-medium"
        >
          {getInitials(name || email)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="truncate text-sm font-medium">{name || email}</p>
        <p className="truncate text-xs text-muted-foreground">{email}</p>
      </div>
      <Badge variant="outline" className="shrink-0">
        {t("team:roles.owner")}
      </Badge>
    </div>
  );
}
