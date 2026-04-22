import { cn } from "@workspace/ui/lib/utils";
import type { SanityImageProps } from "@/types";
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
};

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
  isNested = false,
}: ImageCardBlockProps) {
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

  return (
    <section className={isNested ? undefined : "container-wrapper"} id={resolvedSectionId}>
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
    </section>
  );
}
