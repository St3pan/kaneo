import { CheckCircle2, Circle } from "lucide-react";
import columnIcons, {
  DEFAULT_COLUMN_ICON_NAMES,
} from "@/constants/column-icons";
import { getStatusTone } from "@/lib/tone/status-tone";

export const getColumnIcon = (
  columnId: string,
  isFinal?: boolean,
  iconName?: string | null,
  tinted = true,
) => {
  const resolvedIconName =
    iconName ||
    (Object.hasOwn(DEFAULT_COLUMN_ICON_NAMES, columnId)
      ? DEFAULT_COLUMN_ICON_NAMES[
          columnId as keyof typeof DEFAULT_COLUMN_ICON_NAMES
        ]
      : undefined);
  const Icon =
    typeof resolvedIconName === "string" &&
    Object.hasOwn(columnIcons, resolvedIconName) &&
    columnIcons[resolvedIconName as keyof typeof columnIcons];
  const style = tinted
    ? { color: getStatusTone(columnId, isFinal).color }
    : undefined;

  if (Icon) {
    return <Icon className="w-4 h-4" style={style} />;
  }

  return isFinal ? (
    <CheckCircle2 className="w-4 h-4" style={style} />
  ) : (
    <Circle className="w-4 h-4" style={style} />
  );
};
