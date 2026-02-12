"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { IconifySearchState } from "@gijsroge/iconify-search";
import { IconifySearchPrimitive } from "@gijsroge/iconify-search";
import { useVirtualizer } from "@tanstack/react-virtual";
import { LoaderIcon, SearchIcon } from "lucide-react";
import * as React from "react";

const ICONS_PER_ROW = 8;
const ROW_HEIGHT = 40;
const HEADER_ROW_HEIGHT = 28;

type VirtualRow =
  | { type: "header"; name: string; key: string }
  | { type: "icons"; iconIds: string[]; key: string };

function flattenGroupsToRows(
  groups: Array<{ prefix: string; name: string; icons: string[] }>
): VirtualRow[] {
  const rows: VirtualRow[] = [];
  for (const { prefix, name, icons } of groups) {
    rows.push({ type: "header", name, key: `h-${prefix}` });
    for (let i = 0; i < icons.length; i += ICONS_PER_ROW) {
      rows.push({
        type: "icons",
        iconIds: icons.slice(i, i + ICONS_PER_ROW),
        key: `${prefix}-${i}`,
      });
    }
  }
  return rows;
}

const IconCell = React.memo(function IconCell({
  iconId,
  isSelected,
  selectIcon,
  onClose,
  multiple,
  getIconUrl,
}: {
  iconId: string;
  isSelected: boolean;
  selectIcon: (iconId: string) => void;
  onClose: () => void;
  multiple: boolean;
  getIconUrl: (iconId: string, size?: number) => string;
}) {
  const onSelect = React.useCallback(() => {
    selectIcon(iconId);
    if (!multiple) onClose();
  }, [selectIcon, iconId, multiple, onClose]);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-accent",
        isSelected && "bg-accent"
      )}
    >
      <img
        src={getIconUrl(iconId, 24)}
        alt={iconId.split(":")[1] ?? iconId}
        className="size-6"
        width={24}
        height={24}
      />
    </button>
  );
});

function VirtualizedIconList({
  state,
  setOpen,
}: {
  state: IconifySearchState;
  setOpen: (open: boolean) => void;
}) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const onClose = React.useCallback(() => setOpen(false), [setOpen]);
  const rows = React.useMemo(
    () => flattenGroupsToRows(state.groups),
    [state.groups]
  );

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) =>
      rows[index].type === "header" ? HEADER_ROW_HEIGHT : ROW_HEIGHT,
    overscan: 4,
  });

  const selectedSet = React.useMemo(
    () => new Set(state.selectedIcons),
    [state.selectedIcons]
  );

  return (
    <div
      ref={parentRef}
      className="scroll-fade-y min-h-0 flex-1 overflow-y-auto"
      style={{ contain: "strict" }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          if (row.type === "header") {
            return (
              <div
                key={row.key}
                className="text-muted-foreground absolute left-0 top-0 flex w-full items-center px-2 text-xs font-medium backdrop-blur sm:px-0"
                style={{
                  height: HEADER_ROW_HEIGHT,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.name}
              </div>
            );
          }
          return (
            <div
              key={row.key}
              className="absolute left-0 flex w-full gap-1 flex-wrap"
              style={{
                height: ROW_HEIGHT,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {row.iconIds.map((iconId) => (
                <IconCell
                  key={iconId}
                  iconId={iconId}
                  isSelected={selectedSet.has(iconId)}
                  selectIcon={state.selectIcon}
                  onClose={onClose}
                  multiple={state.multiple}
                  getIconUrl={state.getIconUrl}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface IconifySearchProps {
  /** Allow selecting multiple icons */
  multiple?: boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function IconifySearch({
  multiple = false,
  value,
  defaultValue,
  onValueChange,
  searchValue,
  defaultSearchValue,
  onSearchChange,
}: IconifySearchProps): React.ReactElement | null {
  const [open, setOpen] = React.useState(false);

  return (
    <IconifySearchPrimitive
      debounceMs={300}
      multiple={multiple}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      searchValue={searchValue}
      defaultSearchValue={defaultSearchValue}
      onSearchChange={onSearchChange}
    >
      {(state) => (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              {state.selectedIcons.length > 0 ? (
                <span className="flex items-center gap-2">
                  {state.selectedIcons.slice(0, 3).map((iconId) => (
                    <img
                      key={iconId}
                      src={state.getIconUrl(iconId, 18)}
                      alt=""
                      className="size-4"
                      width={18}
                      height={18}
                    />
                  ))}
                  {state.selectedIcons.length > 3 && (
                    <span className="text-muted-foreground text-xs">
                      +{state.selectedIcons.length - 3}
                    </span>
                  )}
                  {!state.multiple && state.selectedIcons[0] && (
                    <span>
                      {state.selectedIcons[0].split(":")[1] ??
                        state.selectedIcons[0]}
                    </span>
                  )}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <SearchIcon className="size-4" />
                  {state.multiple ? "Pick icons" : "Pick icon"}
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="flex h-[520px] flex-col gap-4 sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Search icons</DialogTitle>
            </DialogHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-4">
              <div className="relative shrink-0">
                <Input
                  placeholder="Search icons..."
                  value={state.query}
                  onChange={(e) => state.setQuery(e.target.value)}
                  className="pr-9"
                />
                {state.isPending && (
                  <LoaderIcon
                    className="text-muted-foreground absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin"
                    aria-hidden
                  />
                )}
              </div>
              {!state.debouncedQuery.trim() ? (
                <div className="scroll-fade-y min-h-0 flex-1">
                  <p className="text-muted-foreground py-8 text-center text-sm">
                    Type to search icons from Iconify
                  </p>
                </div>
              ) : state.isPending && !state.data ? (
                <div className="scroll-fade-y min-h-0 flex-1">
                  <p className="text-muted-foreground py-8 text-center text-sm">
                    Searching...
                  </p>
                </div>
              ) : state.groups.length === 0 ? (
                <div className="scroll-fade-y min-h-0 flex-1">
                  <p className="text-muted-foreground py-8 text-center text-sm">
                    No icons found. Try a different search.
                  </p>
                </div>
              ) : (
                <VirtualizedIconList state={state} setOpen={setOpen} />
              )}
            </div>
            {state.multiple && state.selectedIcons.length > 0 && (
              <div className="flex items-center justify-between gap-4 pt-2 border-t -mx-6 px-6">
                <div className="relative min-w-0 flex-1 overflow-hidden">
                  <div
                    className="flex gap-1 overflow-x-auto pb-1 scrollbar-width:none [&::-webkit-scrollbar]:hidden"
                    style={{
                      maskImage:
                        "linear-gradient(to right, black 70%, transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to right, black 70%, transparent 100%)",
                    }}
                  >
                    {state.selectedIcons.map((iconId) => (
                      <img
                        key={iconId}
                        src={state.getIconUrl(iconId, 24)}
                        alt={iconId.split(":")[1] ?? iconId}
                        className="size-6 shrink-0 rounded"
                        width={16}
                        height={16}
                      />
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={() => state.setSelectedIcons([])}
                >
                  Clear all
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </IconifySearchPrimitive>
  );
}
