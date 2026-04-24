import { env } from "@workspace/env/client";
import type { WrapperProps } from "sanity-image";

import type { QueryImageTypeResult } from "./sanity.types";

type SanityImageData = NonNullable<QueryImageTypeResult>;

// Types
type ImageHotspot = {
  readonly x: number;
  readonly y: number;
};

type ImageCrop = {
  readonly top: number;
  readonly bottom: number;
  readonly left: number;
  readonly right: number;
};

type ProcessedImageData = {
  readonly id: string;
  readonly alt: string;
  readonly preview?: string;
  readonly hotspot?: ImageHotspot;
  readonly crop?: ImageCrop;
};

export type SanityImageProps = {
  readonly image: SanityImageData;
} & Omit<WrapperProps<"img">, "id">;

// Base URL construction
export const SANITY_BASE_URL =
  `https://cdn.sanity.io/images/${env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${env.NEXT_PUBLIC_SANITY_DATASET}/` as const;

/**
 * CDN URL for a Sanity image asset ref (e.g. `image-abc-1200x800-png`).
 * Returns null if `imageRef` is not a standard `image-*` id.
 */
export function buildSanityImageCdnUrlFromRef(imageRef: string): string | null {
  if (!imageRef.startsWith("image-")) {
    return null;
  }

  const parts = imageRef.split("-");
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

// Type guards
function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}

function isValidHotspot(hotspot: unknown): hotspot is ImageHotspot {
  if (!hotspot || typeof hotspot !== "object") {
    return false;
  }
  const h = hotspot as Record<string, unknown>;
  return isValidNumber(h.x) && isValidNumber(h.y);
}

function isValidCrop(crop: unknown): crop is ImageCrop {
  if (!crop || typeof crop !== "object") {
    return false;
  }
  const c = crop as Record<string, unknown>;
  return (
    isValidNumber(c.top) &&
    isValidNumber(c.bottom) &&
    isValidNumber(c.left) &&
    isValidNumber(c.right)
  );
}

// Pure functions for data processing
function extractHotspot(image: SanityImageData): ImageHotspot | undefined {
  if (!isValidHotspot(image?.hotspot)) {
    return;
  }
  return {
    x: image.hotspot.x,
    y: image.hotspot.y,
  };
}

function extractCrop(image: SanityImageData): ImageCrop | undefined {
  if (!isValidCrop(image?.crop)) {
    return;
  }
  return {
    top: image.crop.top,
    bottom: image.crop.bottom,
    left: image.crop.left,
    right: image.crop.right,
  };
}

function hasPreview(preview: unknown): preview is string {
  return typeof preview === "string" && preview.length > 0;
}

// Main image processing function
export function processImageData(
  image: SanityImageData
): ProcessedImageData | null {
  // Early return for invalid image data
  if (!image?.id || typeof image.id !== "string") {
    return null;
  }

  const hotspot = extractHotspot(image);
  const crop = extractCrop(image);
  const preview = hasPreview(image.preview) ? image.preview : undefined;

  return {
    id: image.id,
    alt: image.alt,
    ...(preview && { preview }),
    ...(hotspot && { hotspot }),
    ...(crop && { crop }),
  };
}
