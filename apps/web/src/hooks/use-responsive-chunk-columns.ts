import { useSyncExternalStore } from "react";

const MD_MIN_WIDTH_QUERY = "(min-width: 768px)";
const LG_MIN_WIDTH_QUERY = "(min-width: 1024px)";

function clampColumnsPerRow(
  value: number | null | undefined,
  fallbackLg: number,
): number {
  const base =
    typeof value === "number" && Number.isFinite(value) ? value : fallbackLg;
  return Math.min(6, Math.max(2, Math.round(base)));
}

function subscribeBoth(
  md: MediaQueryList,
  lg: MediaQueryList,
  onChange: () => void,
) {
  const listener = () => onChange();
  if (md.addEventListener) {
    md.addEventListener("change", listener);
    lg.addEventListener("change", listener);
    return () => {
      md.removeEventListener("change", listener);
      lg.removeEventListener("change", listener);
    };
  }
  md.addListener(listener);
  lg.addListener(listener);
  return () => {
    md.removeListener(listener);
    lg.removeListener(listener);
  };
}

function subscribeToChunkColumnQueries(onStoreChange: () => void) {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return () => {};
  }
  const md = window.matchMedia(MD_MIN_WIDTH_QUERY);
  const lg = window.matchMedia(LG_MIN_WIDTH_QUERY);
  return subscribeBoth(md, lg, onStoreChange);
}

function readChunkColumns(lgColumns: number): number {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return 1;
  }
  const md = window.matchMedia(MD_MIN_WIDTH_QUERY);
  const lg = window.matchMedia(LG_MIN_WIDTH_QUERY);
  if (!md.matches) {
    return 1;
  }
  if (!lg.matches) {
    return 2;
  }
  return lgColumns;
}

/**
 * Chunk size for funnel-style card rows: 1 below `md`, 2 from `md` to below
 * `lg`, then `columnsPerRowLg` (clamped 2–6) at `lg` and up. Server snapshot
 * is 1 to avoid hydration mismatch. Optional `fallbackLgColumns` applies when
 * the CMS value is missing or invalid (defaults to 3).
 */
export function useResponsiveChunkColumns(
  columnsPerRowLg: number | null | undefined,
  fallbackLgColumns = 3,
): number {
  const lgClamped = clampColumnsPerRow(columnsPerRowLg, fallbackLgColumns);

  return useSyncExternalStore(
    subscribeToChunkColumnQueries,
    () => readChunkColumns(lgClamped),
    () => 1,
  );
}
