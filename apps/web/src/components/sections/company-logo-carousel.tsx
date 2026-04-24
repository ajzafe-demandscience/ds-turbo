import { cn } from "@workspace/ui/lib/utils";

import { CompanyLogoCarousel } from "@/components/elements/company-logo-carousel";
import { usePageBuilderBlockRoot } from "@/components/page-builder-block-root-context";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PageBuilderBlock, SanityImageProps } from "@/types";

type CompanyLogoCarouselBlockProps = {
  config?: {
    logos?: Array<{
      company?: string | null;
      image?: SanityImageProps | null;
    }> | null;
  } | null;
  sectionId?: string | null;
  isNested?: boolean;
} & Pick<PageBuilderBlock, "_type">;

export function CompanyLogoCarouselBlock({
  config,
  sectionId,
  _type,
  isNested = false,
}: CompanyLogoCarouselBlockProps) {
  const { dataSanity, surfaceStyle } = usePageBuilderBlockRoot();
  const resolvedSectionId = sectionId?.trim() || undefined;

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
    <section
      className={cn(camelCaseToKebabCase(_type), isNested ? "w-full" : undefined)}
      data-sanity={dataSanity}
      id={resolvedSectionId}
      style={surfaceStyle}
    >
      {isNested ? (
        <CompanyLogoCarousel logos={items} />
      ) : (
        <div className="w-full py-10 md:py-14 lg:py-16">
          <CompanyLogoCarousel logos={items} />
        </div>
      )}
    </section>
  );
}
