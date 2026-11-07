import { CheckIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import labelColors from "@/constants/label-colors";
import { cn } from "@/lib/cn";

type LabelColorSwatchesProps = {
  value: string;
  onChange: (value: string) => void;
  labelledBy: string;
};

export function LabelColorSwatches({
  value,
  onChange,
  labelledBy,
}: LabelColorSwatchesProps) {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      className="flex flex-wrap items-center gap-2.5"
    >
      {labelColors.map((color) => {
        const selected = color.value === value;
        const colorName = t(
          `common:modals.createTask.labelColors.${color.key}`,
          {
            defaultValue: color.label,
          },
        );

        return (
          <button
            key={color.value}
            type="button"
            aria-label={colorName}
            aria-pressed={selected}
            title={colorName}
            onClick={() => onChange(color.value)}
            className={cn(
              "flex size-6 cursor-pointer items-center justify-center rounded-full outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover",
              selected &&
                "ring-2 ring-foreground/70 ring-offset-2 ring-offset-popover",
            )}
            style={{ backgroundColor: color.color, color: color.foreground }}
          >
            {selected ? (
              <CheckIcon
                aria-hidden="true"
                className="size-3"
                strokeWidth={3}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
