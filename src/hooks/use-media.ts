"use client";

import { useSyncExternalStore } from "react";

/** `matchMedia` as React state; false during server rendering. */
export function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const DESKTOP = "(min-width: 1024px)";
