"use client";

import { cn } from "@workspace/ui/lib/utils";

import { usePageBuilderBlockRoot } from "@/components/page-builder-block-root-context";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PagebuilderType } from "@/types";

type ColorValue = string | { hex?: string | null } | null | undefined;

type CaseStudyStatsCardsBlockProps = PagebuilderType<"caseStudyStatsCards"> & {
  isNested?: boolean;
};

function resolveColor(color: ColorValue): string | undefined {
  const candidate = typeof color === "string" ? color : color?.hex;
  return typeof candidate === "string" && candidate.trim()
    ? candidate.trim()
    : undefined;
}

export function CaseStudyStatsCardsBlock({
  cards,
  footerText,
  containerBackgroundColor,
  cardBackgroundColor,
  textColor,
  sectionId,
  _type,
  isNested = false,
}: CaseStudyStatsCardsBlockProps) {
  const { dataSanity, surfaceStyle } = usePageBuilderBlockRoot();
  const resolvedSectionId = sectionId?.trim() || undefined;

  const resolvedCards = (cards ?? [])
    .map((card) => ({
      key: card?._key ?? "",
      name: card?.name?.trim() ?? "",
      value: card?.value?.trim() ?? "",
      description: card?.description?.trim() ?? "",
    }))
    .filter((card) => Boolean(card.value && card.description));

  if (!resolvedCards.length) {
    return null;
  }

  const resolvedContainerBg =
    resolveColor(containerBackgroundColor) ?? "#0B1D66";
  const resolvedCardBg = resolveColor(cardBackgroundColor) ?? "#2D6BFF";
  const resolvedText = resolveColor(textColor) ?? "#FFFFFF";
  const resolvedFooterText = footerText?.trim();

  const inner = (
    <article
      className="mx-auto w-full max-w-6xl rounded-[28px] px-6 py-7 md:px-8 md:py-8"
      style={{ backgroundColor: resolvedContainerBg, color: resolvedText }}
    >
      <div
        className={cn(
          "grid gap-4 md:gap-5",
          resolvedCards.length === 2
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-3"
        )}
      >
        {resolvedCards.map((card) => (
          <div
            className="rounded-[16px] px-6 py-6 md:px-7 md:py-7"
            key={card.key || `${card.value}-${card.name}`}
            style={{ backgroundColor: resolvedCardBg, color: resolvedText }}
          >
            <p className="text-[48px] font-light leading-none text-inherit tracking-tight md:text-[56px]">
              {card.value}
            </p>
            {card.name ? (
              <p className="mt-3 text-sm font-medium text-white/90">
                {card.name}
              </p>
            ) : null}
            <p className="mt-3 text-sm/6 text-white/90 md:text-base/7">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {resolvedFooterText ? (
        <p className="mt-7 text-center text-sm/6 text-white/85 md:mt-8 md:text-base/7">
          {resolvedFooterText}
        </p>
      ) : null}
    </article>
  );

  return (
    <section
      className={camelCaseToKebabCase(_type)}
      data-sanity={dataSanity}
      id={resolvedSectionId}
      style={surfaceStyle}
    >
      {isNested ? inner : <div className="container-wrapper py-8 md:py-10">{inner}</div>}
    </section>
  );
}

