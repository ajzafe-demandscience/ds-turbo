import { SanityImage } from "@/components/elements/sanity-image";
import type { SanityImageProps } from "@/types";

type HowItWorksCardItem = {
  _key: string;
  image?: SanityImageProps | null;
  title?: string | null;
  description?: string | null;
};

export type HowItWorksCardsBlockProps = {
  title?: string | null;
  description?: string | null;
  items?: HowItWorksCardItem[] | null;
  sectionId?: string | null;
  isNested?: boolean;
};

export function HowItWorksCardsBlock({
  title,
  description,
  items,
  sectionId,
  isNested = false,
}: HowItWorksCardsBlockProps) {
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
      <div className="mx-auto max-w-5xl text-center">
        {title ? (
          <h2 className="font-semibold text-3xl tracking-tight md:text-5xl">{title}</h2>
        ) : null}
        {description ? (
          <p className="mx-auto mt-5 max-w-4xl text-lg text-muted-foreground md:text-xl">
            {description}
          </p>
        ) : null}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-6">
        {resolvedItems.map((item) => {
          if (!item.image?.id) {
            return null;
          }

          return (
            <article
              className="w-full max-w-[250px] rounded-2xl bg-card p-5"
              key={item._key}
            >
              <div className="flex justify-center overflow-hidden rounded-xl">
                <SanityImage
                  alt={item.image.alt ?? item.title ?? "How it works item image"}
                  className="h-auto w-full max-h-[350px] object-contain md:max-h-[350px] lg:max-h-none"
                  image={item.image}
                />
              </div>

              {item.title ? (
                <h5 className="mt-5 text-center font-semibold text-[18px] tracking-tight sm:text-left">
                  {item.title}
                </h5>
              ) : null}
              {item.description ? (
                <p className="mt-3 text-center text-lg text-muted-foreground leading-7 sm:text-left">
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
