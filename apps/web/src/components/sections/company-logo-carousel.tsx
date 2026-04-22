import { CompanyLogoCarousel } from "@/components/elements/company-logo-carousel";
import type { SanityImageProps } from "@/types";

type CompanyLogoCarouselBlockProps = {
  config?: {
    logos?: Array<{
      company?: string | null;
      image?: SanityImageProps | null;
    }> | null;
  } | null;
  sectionId?: string | null;
  isNested?: boolean;
};

export function CompanyLogoCarouselBlock({
  config,
  sectionId,
  isNested = false,
}: CompanyLogoCarouselBlockProps) {
  const resolvedSectionId = sectionId?.trim() || undefined;
  const sectionClassName = isNested
    ? "w-full"
    : "w-full py-10 md:py-14 lg:py-16";

  const items =
    config?.logos?.flatMap((logo) => {
      const image = logo?.image;
      if (!image?.id) {
        return [];
      }

      return [
        {
          image,
          alt: logo.company?.trim() || image.alt,
        },
      ];
    }) ?? [];

  if (!items.length) {
    return null;
  }

  return (
    <section className={sectionClassName} id={resolvedSectionId}>
      <CompanyLogoCarousel logos={items} />
    </section>
  );
}
