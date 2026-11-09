import { useDroppable } from "@dnd-kit/core";
import { cva } from "class-variance-authority";
import { memo, useState } from "react";
import { getStatusTone } from "@/lib/tone/status-tone";
import { toneStyle } from "@/lib/tone/tone";
import { useBackgroundStore } from "@/store/background";
import type { ProjectWithTasks } from "@/types/project";
import ColumnDropzone from "./column-dropzone";
import { ColumnHeader } from "./column-header";
import { ColumnSortHint } from "./column-sort-hint";

type ColumnProps = {
  column: ProjectWithTasks["columns"][number];
  activeTaskId: string | null;
  sortHint?: string;
  disableDragDrop?: boolean;
  disableSorting?: boolean;
  disableCollectionActions?: boolean;
  animateEntries?: boolean;
};

export const columnVariants = cva(
  "group relative flex h-full min-h-0 w-full flex-col rounded-xl border-t-3 border-t-(--tone) transition-colors duration-150",
  {
    defaultVariants: {
      isDropzoneOver: false,
      backgroundImage: false,
    },
    variants: {
      isDropzoneOver: {
        true: "",
        false: "",
      },
      backgroundImage: {
        true: "before:content-[''] before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] before:pointer-events-none",
        false: "",
      },
    },
    compoundVariants: [
      {
        isDropzoneOver: false,
        backgroundImage: false,
        class: "border bg-board-column",
      },
      {
        isDropzoneOver: true,
        backgroundImage: false,
        class: "border bg-primary-tint border-ring/40 ring-2 ring-ring/30",
      },
      {
        isDropzoneOver: false,
        backgroundImage: true,
        class: "border bg-board-column",
      },
      {
        isDropzoneOver: true,
        backgroundImage: true,
        class: "border bg-primary-tint ring-2 ring-ring/60",
      },
    ],
  },
);

function Column({
  column,
  activeTaskId,
  sortHint,
  disableDragDrop = false,
  disableSorting = false,
  disableCollectionActions = false,
  animateEntries = true,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", column },
  });
  const { background } = useBackgroundStore();
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(
    null,
  );

  return (
    <div
      ref={setNodeRef}
      style={toneStyle(getStatusTone(column.id, column.isFinal))}
      className={columnVariants({
        isDropzoneOver: isOver,
        backgroundImage: !!background,
      })}
    >
      <div className="shrink-0 pt-1 pr-2 pl-3">
        <ColumnHeader
          column={column}
          disableCollectionActions={disableCollectionActions}
        />
      </div>
      <div
        ref={setScrollElement}
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-1.5 pt-1.5 pb-1.5 [-webkit-overflow-scrolling:touch]"
      >
        <ColumnDropzone
          scrollElement={scrollElement}
          column={column}
          activeTaskId={activeTaskId}
          disableDragDrop={disableDragDrop}
          disableSorting={disableSorting}
          animateEntries={animateEntries}
        />
      </div>
      {sortHint && <ColumnSortHint label={sortHint} />}
    </div>
  );
}

export default memo(Column);
