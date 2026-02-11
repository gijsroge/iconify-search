"use client";

import { useDebouncedValue } from "@tanstack/react-pacer";
import * as React from "react";
import type { IconifySearchResponse } from "./iconify.js";
import { getIconUrl } from "./iconify.js";
import { useIconifySearchAll } from "./use-iconify-search.js";

const DEFAULT_DEBOUNCE_MS = 300;

export interface IconifySearchState {
  /** Whether multiple selection is allowed */
  multiple: boolean;
  /** Current raw query string */
  query: string;
  /** Update the search query */
  setQuery: (value: string) => void;
  /** Debounced query used for API calls */
  debouncedQuery: string;
  /** Whether the debouncer is still pending */
  isDebouncing: boolean;
  /** Raw search response from Iconify API */
  data: IconifySearchResponse | undefined;
  /** Whether the initial fetch is loading */
  isLoading: boolean;
  /** Whether a fetch is in progress (including refetch) */
  isFetching: boolean;
  /** Combined: debouncing or fetching */
  isPending: boolean;
  /** Helper to get Iconify CDN URL for an icon */
  getIconUrl: (iconId: string, size?: number) => string;
  /** Selected icon IDs (always an array; max 1 when multiple=false) */
  selectedIcons: string[];
  /** Update selected icons (enforces max 1 when multiple=false) */
  setSelectedIcons: (iconIds: string[]) => void;
  /** Select/replace icon when multiple=false; toggle when multiple=true */
  selectIcon: (iconId: string) => void;
  /** Icons grouped by collection prefix for display */
  groups: Array<{ prefix: string; name: string; icons: string[] }>;
}

export interface IconifySearchPrimitiveProps {
  /** Allow selecting multiple icons. When false, max 1 and selectIcon replaces. */
  multiple?: boolean;
  /** Debounce delay in ms before triggering search */
  debounceMs?: number;
  /** Render function receiving search state */
  children: (state: IconifySearchState) => React.ReactNode;
}

/**
 * Renderless component that interfaces with the Iconify API for icon search.
 * Always uses selectedIcons internally; when multiple=false, enforces max 1.
 * Use this to build custom UI (dialogs, etc.) without duplicating logic.
 */
export function IconifySearchPrimitive({
  multiple = false,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  children,
}: IconifySearchPrimitiveProps): React.ReactElement {
  const [query, setQuery] = React.useState("");
  const [selectedIcons, setSelectedIconsState] = React.useState<string[]>([]);

  const setSelectedIcons = React.useCallback(
    (ids: string[]) => {
      setSelectedIconsState(multiple ? ids : ids.slice(0, 1));
    },
    [multiple],
  );

  const selectIcon = React.useCallback(
    (iconId: string) => {
      if (multiple) {
        setSelectedIconsState((prev) =>
          prev.includes(iconId)
            ? prev.filter((id) => id !== iconId)
            : [...prev, iconId],
        );
      } else {
        setSelectedIconsState([iconId]);
      }
    },
    [multiple],
  );

  const [debouncedQuery, debouncer] = useDebouncedValue(
    query,
    { wait: debounceMs },
    (s) => ({ isPending: s.isPending }),
  );
  const isDebouncing = debouncer.state.isPending ?? false;
  const { data, isLoading, isFetching } = useIconifySearchAll(debouncedQuery);
  const isPending = isDebouncing || isLoading || isFetching;

  const groups = React.useMemo(() => {
    const icons = data?.icons ?? [];
    const deduped = [...new Set(icons)];
    const allCollections: Record<string, { name: string }> = {};
    if (data?.collections) {
      Object.entries(data.collections).forEach(([prefix, info]) => {
        allCollections[prefix] = { name: info.name ?? prefix };
      });
    }
    for (const iconId of selectedIcons) {
      if (!deduped.includes(iconId)) {
        deduped.unshift(iconId);
        const [prefix] = iconId.split(":");
        if (prefix && !allCollections[prefix]) {
          allCollections[prefix] = { name: prefix };
        }
      }
    }
    const byPrefix = new Map<string, string[]>();
    for (const iconId of deduped) {
      const prefix = iconId.split(":")[0] ?? "other";
      if (!byPrefix.has(prefix)) byPrefix.set(prefix, []);
      byPrefix.get(prefix)!.push(iconId);
    }
    return Array.from(byPrefix.entries()).map(([prefix, icons]) => ({
      prefix,
      name: allCollections[prefix]?.name ?? prefix,
      icons,
    }));
  }, [data, selectedIcons]);

  const state: IconifySearchState = {
    multiple,
    query,
    setQuery,
    debouncedQuery,
    isDebouncing,
    data,
    isLoading,
    isFetching,
    isPending,
    getIconUrl,
    selectedIcons,
    setSelectedIcons,
    selectIcon,
    groups,
  };

  return <>{children(state)}</>;
}
