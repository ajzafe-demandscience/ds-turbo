import { SanityImage } from "@/components/elements/sanity-image";
import type { SanityImageProps } from "@/types";

type WhatYouCanRunCardItem = {
  _key: string;
  image?: SanityImageProps | null;
  title?: string | null;
  description?: string | null;
};

export type WhatYouCanRunCardsBlockProps = {
  title?: string | null;
  description?: string | null;
  items?: WhatYouCanRunCardItem[] | null;
  sectionId?: string | null;
  isNested?: boolean;
};

export function WhatYouCanRunCardsBlock({
  title,
  description,
  items,
  sectionId,
  isNested = false,
}: WhatYouCanRunCardsBlockProps) {
  const resolvedItems = Array.isArray(items) ? items : [];
  const resolvedSectionId = sectionId?.trim() || undefined;

  if (!resolvedItems.length) {
    return null;
  }

  return (
    <section
      className={isNested ? undefined : "container-wrapper py-10 md:py-14"}
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

      <div className="mt-10 flex flex-wrap justify-center gap-5">
        {resolvedItems.map((item) => {
          if (!item.image?.id) {
            return null;
          }

          return (
            <article
              className="w-full max-w-[240px] rounded-[18px] bg-[#fff] p-5 text-center"
              key={item._key}
            >
              <div className="flex justify-center overflow-hidden rounded-xl">
                <SanityImage
                  alt={item.image.alt ?? item.title ?? "Card icon"}
                  className="h-auto w-auto max-h-[80px] max-w-full object-contain"
                  image={item.image}
                />
              </div>

              {item.title ? (
                <h5 className="mt-4 font-semibold text-[#0066fc] text-[22px] leading-tight tracking-tight">
                  {item.title}
                </h5>
              ) : null}
              {item.description ? (
                <p className="mt-3 text-muted-foreground text-xl leading-8">
                  {item.description}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
