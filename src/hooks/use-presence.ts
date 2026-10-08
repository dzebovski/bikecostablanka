"use client";

import { useEffect, useState } from "react";

/** Keeps an element mounted for its exit animation. */
export function usePresence(open: boolean, exitMs: number) {
  const [mounted, setMounted] = useState(open);
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setMounted(true);
  }
  useEffect(() => {
    if (open || !mounted) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setMounted(false), reduced ? Math.min(exitMs, 140) : exitMs);
    return () => window.clearTimeout(timer);
  }, [open, mounted, exitMs]);
  return { mounted, state: open ? "open" : "closing" } as const;
}
