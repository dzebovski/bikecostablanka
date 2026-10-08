"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

/** A link that reports an analytics event when clicked. */
export function TrackedLink({
  href,
  event,
  params,
  className,
  children,
}: {
  href: string;
  event: string;
  params?: Record<string, string | number>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={className} data-event={event} onClick={() => track(event, params)}>
      {children}
    </Link>
  );
}
