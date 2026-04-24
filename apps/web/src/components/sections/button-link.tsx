"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

import { usePageBuilderBlockRoot } from "@/components/page-builder-block-root-context";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";

type ButtonLinkBlockProps = {
  text?: string | null;
  href?: string | null;
  openInNewTab?: boolean | null;
  style?: "primary" | "whiteOutline" | null;
  linkType?: "url" | "scrollToSection" | null;
  scrollToSectionId?: string | null;
  sectionId?: string | null;
  isNested?: boolean;
  _type: "buttonLink";
};

export function ButtonLinkBlock({
  text,
  href,
  openInNewTab,
  style = "primary",
  linkType = "url",
  scrollToSectionId,
  sectionId,
  _type,
  isNested = false,
}: ButtonLinkBlockProps) {
  const { dataSanity, surfaceStyle } = usePageBuilderBlockRoot();
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
  const useDefaultButtonLinkStyle = !isWhiteOutline;
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
    <section
      className={cn(camelCaseToKebabCase(_type))}
      data-sanity={dataSanity}
      id={resolvedSectionId}
      style={surfaceStyle}
    >
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
            variant={isWhiteOutline ? "outline" : "default"}
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
            variant={isWhiteOutline ? "outline" : "default"}
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
