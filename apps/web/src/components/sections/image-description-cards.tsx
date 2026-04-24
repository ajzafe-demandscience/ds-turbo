"use client";

import { cn } from "@workspace/ui/lib/utils";

import { buildSanityImageCdnUrlFromRef } from "@workspace/sanity/image";

import { usePageBuilderBlockRoot } from "@/components/page-builder-block-root-context";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PagebuilderType } from "@/types";

export type ImageDescriptionCardsBlockProps =
  PagebuilderType<"imageDescriptionCards"> & {
    isNested?: boolean;
  };

function clampColumnsPerRow(
  value: number | null | undefined,
  fallback: number,
): number {
  const base =
    typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.min(6, Math.max(2, Math.round(base)));
}

const LG_GRID_COLS: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

export function ImageDescriptionCardsBlock({
  title,
  intro,
  items,
  columnsPerRow,
  sectionId,
  _type,
  isNested = false,
}: ImageDescriptionCardsBlockProps) {
  const { dataSanity, surfaceStyle } = usePageBuilderBlockRoot();
  const resolvedItems = Array.isArray(items) ? items : [];
  const resolvedSectionId = sectionId?.trim() || undefined;
  const colsLg = clampColumnsPerRow(columnsPerRow, 3);
  const lgGridClass = LG_GRID_COLS[colsLg] ?? "lg:grid-cols-3";

  const validItems = resolvedItems.filter((item) => {
    const id = item.image?.id;
    return (
      typeof id === "string" &&
      buildSanityImageCdnUrlFromRef(id) !== null &&
      Boolean(item.description?.trim())
    );
  });

  if (!validItems.length) {
    return null;
  }

  const inner = (
    <>
      {(title?.trim() || intro?.trim()) ? (
        <div className="text-center">
          {title?.trim() ? (
            <h2 className="font-semibold text-3xl tracking-tight md:text-5xl">
              {title.trim()}
            </h2>
          ) : null}
          {intro?.trim() ? (
            <p className="mt-5 text-lg text-muted-foreground md:text-xl">
              {intro.trim()}
            </p>
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          "grid grid-cols-1 gap-6 md:grid-cols-2",
          lgGridClass,
          title?.trim() || intro?.trim() ? "mt-10" : undefined,
        )}
      >
        {validItems.map((item) => {
          const imageId = item.image?.id;
          if (typeof imageId !== "string") {
            return null;
          }
          const src = buildSanityImageCdnUrlFromRef(imageId);
          if (!src) {
            return null;
          }
          const cardTitle = item.title?.trim();
          const altText =
            item.image?.alt?.trim() ||
            cardTitle ||
            item.description?.trim().slice(0, 120) ||
            "Card";

          return (
          <article
            className="flex min-h-0 min-w-0 flex-col rounded-2xl bg-white p-6 shadow-sm"
            key={item._key}
          >
            <div className="flex w-full min-w-0 justify-start">
              <div className="flex max-h-32 max-w-full items-center justify-start">
                <img
                  alt={altText}
                  className="h-auto max-h-32 w-auto max-w-[min(100%,220px)] object-contain object-left"
                  decoding="async"
                  loading="lazy"
                  src={src}
                />
              </div>
            </div>
            {cardTitle ? (
              <h3 className="mt-4 min-w-0 text-left font-semibold text-lg text-neutral-900 leading-snug tracking-tight">
                {cardTitle}
              </h3>
            ) : null}
            {item.description?.trim() ? (
              <p
                className={cn(
                  "min-w-0 text-left text-base text-neutral-700 leading-7",
                  cardTitle ? "mt-2" : "mt-4",
                )}
              >
                {item.description.trim()}
              </p>
            ) : null}
          </article>
          );
        })}
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
      {isNested ? (
        inner
      ) : (
        <div className="container-wrapper py-10 md:py-14">{inner}</div>
      )}
    </section>
  );
}
