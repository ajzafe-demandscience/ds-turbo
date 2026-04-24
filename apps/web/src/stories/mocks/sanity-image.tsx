import { cn } from "@workspace/ui/lib/utils";

type StorybookSanityImageProps = {
  alt?: string;
  className?: string;
  image?: {
    id?: string;
  } | null;
};

const PLACEHOLDER_IMAGE_URL =
  "https://placehold.co/960x640/e5e7eb/64748b?text=Image+Placeholder";
const PLACEHOLDER_ICON_URL =
  "https://placehold.co/128x128/e2e8f0/475569?text=Icon";

function resolvePlaceholderSrc(imageId?: string): string {
  if (typeof imageId === "string" && imageId.startsWith("image-")) {
    if (imageId.includes("-320x320-") || imageId.includes("-600x180-")) {
      return PLACEHOLDER_ICON_URL;
    }
  }
  if (typeof imageId === "string" && imageId.startsWith("placeholder-icon")) {
    return PLACEHOLDER_ICON_URL;
  }
  return PLACEHOLDER_IMAGE_URL;
}

export function SanityImage({
  alt,
  className,
  image,
}: StorybookSanityImageProps) {
  return (
    <img
      alt={alt ?? "Placeholder image"}
      className={cn("sanity-image-storybook", className)}
      decoding="async"
      loading="lazy"
      src={resolvePlaceholderSrc(image?.id)}
    />
  );
}
