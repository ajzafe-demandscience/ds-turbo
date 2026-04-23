"use client";

import { cn } from "@workspace/ui/lib/utils";

import { SanityImage } from "@/components/elements/sanity-image";
import { useResponsiveChunkColumns } from "@/hooks/use-responsive-chunk-columns";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PagebuilderType } from "@/types";

export type WhatYouCanRunCardsBlockProps = PagebuilderType<"whatYouCanRunCards"> & {
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

export function WhatYouCanRunCardsBlock({
  title,
  description,
  items,
  columnsPerRow,
  sectionId,
  _type,
  isNested = false,
}: WhatYouCanRunCardsBlockProps) {
  const resolvedItems = Array.isArray(items) ? items : [];
  const resolvedSectionId = sectionId?.trim() || undefined;
  const chunkSize = useResponsiveChunkColumns(columnsPerRow, 4);

  const validItems = resolvedItems.filter((item) => Boolean(item.image?.id));

  if (!validItems.length) {
    return null;
  }

  const rows = chunkItems(validItems, chunkSize);

  return (
    <section
      className={cn(
        camelCaseToKebabCase(_type),
        isNested ? undefined : "container-wrapper py-10 md:py-14",
      )}
      id={resolvedSectionId}
    >
      <div className="mx-auto max-w-4xl text-center">
        {title ? (
          <h2 className="font-semibold text-3xl tracking-tight md:text-5xl">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="mx-auto mt-5 max-w-3xl text-lg text-muted-foreground md:text-xl">
            {description}
          </p>
        ) : null}
      </div>

      <div className="mt-10 flex flex-col gap-5">
        {rows.map((row) => (
          <div
            className="flex flex-wrap justify-center gap-5"
            key={row.map((item) => item._key).join("-")}
          >
            {row.map((item) => (
              <article
                className="min-w-0 w-full rounded-[18px] bg-[#fff] p-5 text-center md:w-[calc(50%-0.625rem)] lg:w-auto lg:max-w-[240px]"
                key={item._key}
              >
                <div className="flex justify-center overflow-hidden rounded-xl">
                  <SanityImage
                    alt={item.image?.alt ?? item.title ?? "Card icon"}
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
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
