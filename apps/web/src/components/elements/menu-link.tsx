import Link from "next/link";

import type { MenuLinkProps } from "@/types";
import { SanityIcon } from "./sanity-icon";

export function MenuLink({
  name,
  href,
  description,
  icon,
  onClick,
  showTitleArrow,
  titleClassName,
  descriptionClassName,
  linkClassName,
}: MenuLinkProps) {
  if (!href) return null;

  return (
    <Link
      className={`group/menu-item flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent ${linkClassName || ""}`}
      href={href}
      onClick={onClick}
    >
      {icon && (
        <SanityIcon
          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
          icon={icon}
        />
      )}
      <div className="grid flex-1 gap-1">
        <div
          className={`flex items-center justify-between gap-2 font-medium leading-none transition-colors duration-200 ${titleClassName || "group-hover/menu-item:text-accent-foreground"}`}
        >
          {name}
          {showTitleArrow ? (
            <svg
              aria-hidden="true"
              className="size-[18px] shrink-0 text-white transition-colors duration-200 group-hover/menu-item:text-[#d52c5a]"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Open link</title>
              <line x1="7" x2="17" y1="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          ) : null}
        </div>
        {description && (
          <div
            className={`line-clamp-2 text-muted-foreground text-sm ${descriptionClassName || ""}`}
          >
            {description}
          </div>
        )}
      </div>
    </Link>
  );
}
