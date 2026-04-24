"use client";

import { SanityImage } from "@/components/elements/sanity-image";
import { usePageBuilderBlockRoot } from "@/components/page-builder-block-root-context";
import { useResponsiveChunkColumns } from "@/hooks/use-responsive-chunk-columns";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PagebuilderType } from "@/types";

export type HowItWorksCardsBlockProps = PagebuilderType<"howItWorksCards"> & {
  isNested?: boolean;
};

function chunkItems<T>(items: T[], size: number): T[][] {
  if (size < 1) {
    return [items];
  }
  const rows: T[][] = [];
  let i = 0;
  while (i < items.length) {
    rows.push(items.slice(i, i + size));
    i += size;
  }
  return rows;
}

export function HowItWorksCardsBlock({
  title,
  description,
  items,
  columnsPerRow,
  sectionId,
  _type,
  isNested = false,
}: HowItWorksCardsBlockProps) {
  const { dataSanity, surfaceStyle } = usePageBuilderBlockRoot();
  const resolvedItems = Array.isArray(items) ? items : [];
  const resolvedSectionId = sectionId?.trim() || undefined;
  const chunkSize = useResponsiveChunkColumns(columnsPerRow);

  const validItems = resolvedItems.filter((item) => Boolean(item.image?.id));

  if (!validItems.length) {
    return null;
  }

  const rows = chunkItems(validItems, chunkSize);

  const inner = (
    <>
      <div className="text-center">
        {title ? (
          <h2 className="font-semibold text-3xl tracking-tight md:text-5xl">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="mt-5 text-lg text-muted-foreground md:text-xl">
            {description}
          </p>
        ) : null}
      </div>

      <div className="mt-10 flex flex-col gap-6">
        {rows.map((row) => (
          <div
            className="flex flex-wrap justify-center gap-6"
            key={row.map((item) => item._key).join("-")}
          >
            {row.map((item) => (
              <article
                className="min-w-0 w-full rounded-2xl bg-card p-3 lg:w-auto lg:max-w-[250px]"
                key={item._key}
              >
                <div className="flex justify-center overflow-hidden rounded-xl md:justify-start lg:justify-center">
                  <SanityImage
                    alt={
                      item.image?.alt ??
                      item.title ??
                      "How it works item image"
                    }
                    className="h-auto w-auto max-h-[250px] object-contain lg:max-h-none"
                    image={item.image}
                  />
                </div>

                {item.title ? (
                  <h5 className="mt-5 text-center font-semibold text-[18px] tracking-tight md:text-left">
                    {item.title}
                  </h5>
                ) : null}
                {item.description ? (
                  <p className="mt-3 text-center text-lg text-muted-foreground leading-7 md:text-left">
                    {item.description}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <section
      className={camelCaseToKebabCase(_type)}
      data-sanity={dataSanity}
      id={resolvedSectionId}
      style={surfaceStyle}
    >
      {isNested ? inner : (
        <div className="container-wrapper py-10 md:py-14">{inner}</div>
      )}
    </section>
  );
}
