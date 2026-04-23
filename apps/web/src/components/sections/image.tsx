import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

import { SanityImage } from "@/components/elements/sanity-image";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PageBuilderBlock, SanityImageProps } from "@/types";

export type ImageBlockProps = {
  image?: SanityImageProps | null;
  href?: string | null;
  openInNewTab?: boolean | null;
  sectionId?: string | null;
  isNested?: boolean;
} & Pick<PageBuilderBlock, "_type">;

export function ImageBlock({
  image,
  href,
  openInNewTab,
  sectionId,
  _type,
  isNested = false,
}: ImageBlockProps) {
  if (!image?.id) {
    return null;
  }

  const sectionClassName = isNested ? undefined : "container-wrapper";
  const resolvedSectionId = sectionId?.trim() || undefined;
  const resolvedHref = href?.trim() || undefined;
  const imageClassName = [
    isNested ? "mx-auto h-auto w-auto max-h-[420px] lg:max-h-none" : "",
    resolvedHref ? "transition-all duration-300 ease-in-out" : "",
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  const imageElement = (
    <SanityImage
      alt={image.alt ?? "Image block"}
      className={imageClassName}
      image={image}
    />
  );

  const frameClassName = [
    "rounded-2xl",
    isNested ? "flex justify-center" : "",
    resolvedHref
      ? "overflow-visible pt-0.5 pb-3"
      : "overflow-hidden",
  ]
    .filter(Boolean)
    .join(" ");

  const linkClassName = [
    "group inline-block cursor-pointer rounded-2xl",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    "focus-visible:outline-foreground/40",
  ].join(" ");

  const linkHoverFrameClassName = [
    "overflow-hidden rounded-2xl translate-y-0 shadow-none",
    "transition-all duration-300 ease-in-out",
    "group-hover:-translate-y-[2px] group-hover:shadow-[0_10px_25px_rgba(0,0,0,0.2)]",
  ].join(" ");

  return (
    <section
      className={cn(camelCaseToKebabCase(_type), sectionClassName)}
      id={resolvedSectionId}
    >
      <div className={frameClassName}>
        {resolvedHref ? (
          <Link
            className={linkClassName}
            href={resolvedHref}
            rel={openInNewTab ? "noopener noreferrer" : undefined}
            target={openInNewTab ? "_blank" : "_self"}
          >
            <div className={linkHoverFrameClassName}>{imageElement}</div>
          </Link>
        ) : (
          imageElement
        )}
      </div>
    </section>
  );
}
