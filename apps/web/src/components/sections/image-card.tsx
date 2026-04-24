import { cn } from "@workspace/ui/lib/utils";

import { usePageBuilderBlockRoot } from "@/components/page-builder-block-root-context";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PageBuilderBlock, SanityImageProps } from "@/types";
import { ImageCard } from "../elements/image-card";

type SanityColorValue = {
  hex?: string;
};

export type ImageCardBlockProps = {
  title?: string | null;
  description?: string | null;
  image?: SanityImageProps | null;
  href?: string | null;
  variant?: "top" | "left" | "right" | null;
  blockPosition?: "left" | "center" | "right" | null;
  imageSize?: number | null;
  backgroundColor?: string | SanityColorValue | null;
  sectionId?: string | null;
  isNested?: boolean;
} & Pick<PageBuilderBlock, "_type">;

export function ImageCardBlock({
  title,
  description,
  image,
  href,
  variant,
  blockPosition,
  imageSize,
  backgroundColor,
  sectionId,
  _type,
  isNested = false,
}: ImageCardBlockProps) {
  const { dataSanity, surfaceStyle } = usePageBuilderBlockRoot();
  const resolvedSectionId = sectionId?.trim() || undefined;
  const resolvedHref = href?.trim() || undefined;
  const resolvedBackgroundColor =
    typeof backgroundColor === "string" ? backgroundColor : backgroundColor?.hex;
  const cardStyle =
    typeof resolvedBackgroundColor === "string" &&
    resolvedBackgroundColor.trim()
      ? { backgroundColor: resolvedBackgroundColor.trim() }
      : undefined;
  const cardWrapperClassName = cn(
    "w-full",
    blockPosition === "left" && "mr-auto max-w-4xl",
    (!blockPosition || blockPosition === "center") && "mx-auto max-w-4xl",
    blockPosition === "right" && "ml-auto max-w-4xl",
  );

  const card = (
    <div className={cardWrapperClassName}>
      <ImageCard
        description={description ?? undefined}
        href={resolvedHref}
        image={image}
        imageSize={imageSize ?? undefined}
        style={cardStyle}
        title={title ?? undefined}
        variant={variant ?? "top"}
      />
    </div>
  );

  return (
    <section
      className={camelCaseToKebabCase(_type)}
      data-sanity={dataSanity}
      id={resolvedSectionId}
      style={surfaceStyle}
    >
      {isNested ? card : <div className="container-wrapper">{card}</div>}
    </section>
  );
}
