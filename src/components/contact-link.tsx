"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
import { contact, type ContactChannel } from "@/lib/contact";

/** WhatsApp or email link to the host; renders nothing when the contact value is missing. */
export function ContactLink({
  channel,
  source,
  className,
  children,
}: {
  channel: ContactChannel;
  source: string;
  className?: string;
  children: ReactNode;
}) {
  const href = contact[channel];
  if (!href) return null;
  return (
    <a
      href={href}
      className={className}
      data-event="contact_host"
      data-channel={channel}
      target={channel === "whatsapp" ? "_blank" : undefined}
      rel={channel === "whatsapp" ? "noopener" : undefined}
      onClick={() => track("contact_host", { channel, source })}
    >
      {children}
    </a>
  );
}
