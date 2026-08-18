import type {ReactNode} from "react";

import {Link} from "@/i18n/navigation";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "text" | "light";
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "solid",
  className = "",
}: ButtonLinkProps) {
  return (
    <Link className={`button button--${variant} ${className}`} href={href}>
      <span>{children}</span>
      <span aria-hidden="true" className="button__arrow">
        ↗
      </span>
    </Link>
  );
}
