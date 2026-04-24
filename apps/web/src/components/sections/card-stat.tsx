import { cn } from "@workspace/ui/lib/utils";

import { usePageBuilderBlockRoot } from "@/components/page-builder-block-root-context";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PageBuilderBlock } from "@/types";

type SanityColorValue = {
  hex?: string;
};

export type CardStatBlockProps = {
  title?: string | null;
  description?: string | null;
  stat?: string | null;
  textColor?: string | SanityColorValue | null;
  backgroundColor?: string | SanityColorValue | null;
  sectionId?: string | null;
  isNested?: boolean;
} & Pick<PageBuilderBlock, "_type">;

export function CardStatBlock({
  title,
  description,
  stat,
  textColor,
  backgroundColor,
  sectionId,
  _type,
  isNested = false,
}: CardStatBlockProps) {
  const { dataSanity, surfaceStyle } = usePageBuilderBlockRoot();
  const resolvedSectionId = sectionId?.trim() || undefined;
  const resolvedBackgroundColor =
    typeof backgroundColor === "string" ? backgroundColor : backgroundColor?.hex;
  const resolvedTextColor =
    typeof textColor === "string" ? textColor : textColor?.hex;

  const cardStyle =
    typeof resolvedBackgroundColor === "string" &&
    resolvedBackgroundColor.trim()
      ? { backgroundColor: resolvedBackgroundColor.trim() }
      : { backgroundColor: "#0f56c8" };
  const textStyle =
    typeof resolvedTextColor === "string" && resolvedTextColor.trim()
      ? { color: resolvedTextColor.trim() }
      : undefined;

  const resolvedTitle = title?.trim();
  const resolvedDescription = description?.trim();
  const resolvedStat = stat?.trim();

  if (!resolvedTitle && !resolvedStat && !resolvedDescription) {
    return null;
  }

  const inner = (
    <div
      className="mx-auto w-full max-w-5xl rounded-[16px] px-6 py-4 text-white md:px-8 md:py-5"
      style={cardStyle}
    >
      <div className="flex flex-wrap items-center gap-3 md:gap-6">
        {resolvedStat ? (
          <p
            className="font-semibold text-4xl leading-none tracking-tight md:text-5xl"
            style={textStyle}
          >
            {resolvedStat}
          </p>
        ) : null}
        <div className="min-w-0">
          {resolvedTitle ? (
            <h3
              className="font-medium text-2xl leading-tight md:text-3xl"
              style={textStyle}
            >
              {resolvedTitle}
            </h3>
          ) : null}
          {resolvedDescription ? (
            <p
              className={cn(
                "mt-1 text-sm/6 md:text-base/7",
                textStyle ? undefined : "text-white/85"
              )}
              style={
                textStyle
                  ? { color: resolvedTextColor?.trim(), opacity: 0.85 }
                  : undefined
              }
            >
              {resolvedDescription}
            </p>
          ) : null}
        </div>
      </div>
    </div>
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
        <div className="container-wrapper py-8 md:py-10">{inner}</div>
      )}
    </section>
  );
}
