import { cn } from "@workspace/ui/lib/utils";
import { buildSanityImageCdnUrlFromRef } from "@workspace/sanity/image";
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

const PLACEHOLDER_IMAGE_URL =
  "https://placehold.co/960x640/e5e7eb/64748b?text=Image+Placeholder";
const PLACEHOLDER_ICON_URL =
  "https://placehold.co/128x128/e2e8f0/475569?text=Icon";

const VARIANT_LAYOUT_CLASS: Record<ImageCardVariant, string> = {
  top: "flex-col",
  left: "flex-col md:flex-row",
  right: "flex-col md:flex-row-reverse",
};

function resolvePlaceholderSrc(imageId?: string): string {
  if (typeof imageId === "string" && imageId.startsWith("placeholder-icon")) {
    return PLACEHOLDER_ICON_URL;
  }
  return PLACEHOLDER_IMAGE_URL;
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
  const imageSrc = image?.id ? buildSanityImageCdnUrlFromRef(image.id) : null;

  const cardContent = (
    <>
      {image?.id && (
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
            src={imageSrc ?? resolvePlaceholderSrc(image?.id)}
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
