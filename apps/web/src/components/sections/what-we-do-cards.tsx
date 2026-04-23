import { cn } from "@workspace/ui/lib/utils";

import { SanityImage } from "@/components/elements/sanity-image";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PageBuilderBlock, SanityImageProps } from "@/types";

type WhatWeDoCardItem = {
  _key: string;
  title?: string | null;
  description?: string | null;
  accentImage?: SanityImageProps | null;
};

export type WhatWeDoCardsBlockProps = {
  title?: string | null;
  description?: string | null;
  cards?: WhatWeDoCardItem[] | null;
  featureImage?: SanityImageProps | null;
  featureCaption?: string | null;
  featureLogo?: SanityImageProps | null;
  sectionId?: string | null;
  isNested?: boolean;
} & Pick<PageBuilderBlock, "_type">;

export function WhatWeDoCardsBlock({
  title,
  description,
  cards,
  featureImage,
  featureCaption,
  featureLogo,
  sectionId,
  _type,
  isNested = false,
}: WhatWeDoCardsBlockProps) {
  const resolvedCards = Array.isArray(cards) ? cards : [];
  const resolvedSectionId = sectionId?.trim() || undefined;

  if (!resolvedCards.length && !featureImage?.id) {
    return null;
  }

  return (
    <section
      className={cn(
        camelCaseToKebabCase(_type),
        isNested ? undefined : "container-wrapper py-10 md:py-14"
      )}
      id={resolvedSectionId}
    >
      <div className="mx-auto max-w-4xl text-center">
        {title ? (
          <h2 className="font-semibold text-3xl tracking-tight md:text-5xl">{title}</h2>
        ) : null}
        {description ? (
          <p className="mx-auto mt-5 max-w-3xl text-lg text-muted-foreground md:text-xl">
            {description}
          </p>
        ) : null}
      </div>

      <div className="mt-10 rounded-[28px] bg-[#f2f3f5] p-4 md:p-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            {resolvedCards.map((card) => (
              <article
                className="overflow-hidden rounded-2xl bg-background px-6 py-7 shadow-sm"
                key={card._key}
              >
                {card.title ? (
                  <h3 className="font-semibold text-[#2463eb] text-3xl tracking-tight">
                    {card.title}
                  </h3>
                ) : null}
                {card.description ? (
                  <p className="mt-4 max-w-[32ch] text-foreground/80 text-xl leading-9">
                    {card.description}
                  </p>
                ) : null}
                {card.accentImage?.id ? (
                  <div className="mt-5">
                    <SanityImage
                      alt={card.accentImage.alt ?? card.title ?? "Card accent image"}
                      className="h-auto max-h-16 w-auto object-contain"
                      image={card.accentImage}
                    />
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          <article className="overflow-hidden rounded-2xl bg-background shadow-sm">
            {featureImage?.id ? (
              <SanityImage
                alt={featureImage.alt ?? "Feature image"}
                className="h-auto w-full object-cover"
                image={featureImage}
              />
            ) : null}
            {(featureCaption || featureLogo?.id) ? (
              <div className="space-y-4 px-6 py-5">
                {featureCaption ? (
                  <p className="text-foreground/80 text-xl leading-9">
                    {featureCaption}
                  </p>
                ) : null}
                {featureLogo?.id ? (
                  <SanityImage
                    alt={featureLogo.alt ?? "Feature logo"}
                    className="h-auto max-h-10 w-auto object-contain"
                    image={featureLogo}
                  />
                ) : null}
              </div>
            ) : null}
          </article>
        </div>
      </div>
    </section>
  );
}
