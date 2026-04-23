"use client";
import {
  processImageData,
  SANITY_BASE_URL,
  type SanityImageProps,
} from "@workspace/sanity/image";
import { cn } from "@workspace/ui/lib/utils";
import { type ElementType, memo } from "react";
import {
  SanityImage as BaseSanityImage,
  type WrapperProps,
} from "sanity-image";

// Image wrapper component
const ImageWrapper = <T extends ElementType = "img">(
  props: WrapperProps<T>
) => <BaseSanityImage baseUrl={SANITY_BASE_URL} {...props} />;

// Main component
function SanityImageUnmemorized({
  image,
  className,
  ...props
}: SanityImageProps) {
  const processedImageData = processImageData(image);

  // Early return for invalid image data
  if (!processedImageData) {
    return null;
  }

  return (
    <ImageWrapper
      {...props}
      {...processedImageData}
      className={cn("sanity-image", className)}
    />
  );
}

export const SanityImage = memo(SanityImageUnmemorized);
