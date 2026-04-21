import { SanityImage } from "@/components/elements/sanity-image";
import type { SanityImageProps } from "@/types";

export type ImageBlockProps = {
  image?: SanityImageProps | null;
  sectionId?: string | null;
  isNested?: boolean;
};

export function ImageBlock({
  image,
  sectionId,
  isNested = false,
}: ImageBlockProps) {
  if (!image?.id) {
    return null;
  }

  const sectionClassName = isNested ? undefined : "container-wrapper";
  const resolvedSectionId = sectionId?.trim() || undefined;

  return (
    <section className={sectionClassName} id={resolvedSectionId}>
      <div className="overflow-hidden rounded-2xl">
        <SanityImage alt={image.alt ?? "Image block"} image={image} />
      </div>
    </section>
  );
}
