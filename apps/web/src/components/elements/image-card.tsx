import { cn } from "@workspace/ui/lib/utils";
import { SANITY_BASE_URL } from "@workspace/sanity/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import type { SanityImageProps } from "@/types";

type ImageCardVariant = "top" | "left" | "right";

type ImageCardProps = {
  title?: ReactNode;
  description?: ReactNode;
  image?: SanityImageProps | null;
  imageAlt?: string | null;
  href?: string;
  variant?: ImageCardVariant;
  className?: string;
  contentClassName?: string;
  imageClassName?: string;
  imageSize?: number;
  style?: CSSProperties;
};

const VARIANT_LAYOUT_CLASS: Record<ImageCardVariant, string> = {
  top: "flex-col",
  left: "flex-col md:flex-row",
  right: "flex-col md:flex-row-reverse",
};

function resolveSanityImageSrc(imageId: string): string | null {
  if (!imageId.startsWith("image-")) {
    return null;
  }

  const parts = imageId.split("-");
  if (parts.length < 3) {
    return null;
  }

  const extension = parts.at(-1);
  if (!extension) {
    return null;
  }

  const assetPath = `${parts.slice(1, -1).join("-")}.${extension}`;
  return `${SANITY_BASE_URL}${assetPath}?auto=format`;
}

export function ImageCard({
  title,
  description,
  image,
  imageAlt,
  href,
  variant = "top",
  className,
  contentClassName,
  imageClassName,
  imageSize,
  style,
}: ImageCardProps) {
  const resolvedImageSize =
    typeof imageSize === "number" && imageSize > 0 ? imageSize : undefined;
  const imageStyle = resolvedImageSize
    ? { maxWidth: `${resolvedImageSize}px` }
    : undefined;
  const imageSrc = image?.id ? resolveSanityImageSrc(image.id) : null;

  const cardContent = (
    <>
      {image?.id && imageSrc && (
        <div
          className={cn(
            "overflow-visible md:flex-none",
            variant === "left" ? "self-start md:self-center" : "self-center",
            imageClassName,
          )}
        >
          <img
            alt={imageAlt ?? image.alt ?? "Card image"}
            decoding="async"
            loading="lazy"
            src={imageSrc}
            style={imageStyle}
          />
        </div>
      )}

      <div
        className={cn(
          "flex w-full flex-col justify-center gap-2",
          variant === "top" ? "pt-4" : "md:flex-1 md:px-2",
          variant === "left" && "items-start text-left",
          contentClassName,
        )}
      >
        {title ? (
          <h3 className="font-semibold text-xl leading-tight">{title}</h3>
        ) : null}
        {description ? (
          <p className="mb-0 text-muted-foreground text-[18px] leading-6">
            {description}
          </p>
        ) : null}
      </div>
    </>
  );

  const baseClassName = cn(
    "image-card flex items-center gap-4 rounded-[16px] border border-border/60 bg-card p-[18px]",
    VARIANT_LAYOUT_CLASS[variant],
    className,
  );

  if (!href) {
    return (
      <article className={baseClassName} style={style}>
        {cardContent}
      </article>
    );
  }

  return (
    <Link className={baseClassName} href={href} style={style}>
      {cardContent}
    </Link>
  );
}
