"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

type ButtonLinkBlockProps = {
  text?: string | null;
  variant?: "default" | "secondary" | "outline" | "link" | null;
  href?: string | null;
  openInNewTab?: boolean | null;
  style?: "primary" | "whiteOutline" | null;
  linkType?: "url" | "scrollToSection" | null;
  scrollToSectionId?: string | null;
  sectionId?: string | null;
  isNested?: boolean;
};

export function ButtonLinkBlock({
  text,
  variant,
  href,
  openInNewTab,
  style = "primary",
  linkType = "url",
  scrollToSectionId,
  sectionId,
  isNested = false,
}: ButtonLinkBlockProps) {
  const normalizedSectionId = scrollToSectionId?.trim().replace(/^#/, "") || "";
  const resolvedHref =
    linkType === "scrollToSection"
      ? normalizedSectionId
        ? `#${normalizedSectionId}`
        : ""
      : (href ?? "");

  if (!text || !resolvedHref) {
    return null;
  }

  const containerClassName = isNested ? undefined : "container-wrapper";
  const isWhiteOutline = style === "whiteOutline";
  const effectiveVariant = variant ?? "default";
  const useDefaultButtonLinkStyle = !isWhiteOutline && effectiveVariant === "default";
  const resolvedSectionId = sectionId?.trim() || undefined;

  const handleScrollClick = () => {
    if (!normalizedSectionId) {
      return;
    }

    const targetElement = document.getElementById(normalizedSectionId);
    if (!targetElement) {
      return;
    }

    targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${normalizedSectionId}`);
  };

  return (
    <section id={resolvedSectionId}>
      <div className={containerClassName}>
        {linkType === "scrollToSection" ? (
          <Button
            className={cn(
              "w-full !h-auto sm:w-auto !rounded-none",
              !useDefaultButtonLinkStyle && "!rounded-[10px]",
              useDefaultButtonLinkStyle && "button-link-default",
              isWhiteOutline &&
                "border border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
            )}
            onClick={handleScrollClick}
            type="button"
            variant={isWhiteOutline ? "outline" : effectiveVariant}
          >
            {text}
          </Button>
        ) : (
          <Button
            asChild
            className={cn(
              "w-full !h-auto sm:w-auto !rounded-none",
              !useDefaultButtonLinkStyle && "!rounded-[10px]",
              useDefaultButtonLinkStyle && "button-link-default",
              isWhiteOutline &&
                "border border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
            )}
            variant={isWhiteOutline ? "outline" : effectiveVariant}
          >
            <Link
              aria-label={`Navigate to ${text}`}
              href={resolvedHref}
              target={openInNewTab ? "_blank" : "_self"}
              title={`Click to visit ${text}`}
            >
              {text}
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
}
