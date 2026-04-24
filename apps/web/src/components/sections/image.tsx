import Link from "next/link";

import { SanityImage } from "@/components/elements/sanity-image";
import { usePageBuilderBlockRoot } from "@/components/page-builder-block-root-context";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { SanityImageProps } from "@/types";

export type ImageBlockProps = {
  readonly _type: "imageBlock";
  image?: SanityImageProps | null;
  href?: string | null;
  openInNewTab?: boolean | null;
  sectionId?: string | null;
  isNested?: boolean;
};

export function ImageBlock({
  image,
  href,
  openInNewTab,
  sectionId,
  _type,
  isNested = false,
}: ImageBlockProps) {
  const { dataSanity, surfaceStyle } = usePageBuilderBlockRoot();

  if (!image?.id) {
    return null;
  }

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

  const frame = (
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
  );

  return (
    <section
      className={camelCaseToKebabCase(_type)}
      data-sanity={dataSanity}
      id={resolvedSectionId}
      style={surfaceStyle}
    >
      {isNested ? frame : <div className="container-wrapper">{frame}</div>}
    </section>
  );
}
