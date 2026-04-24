import { cn } from "@workspace/ui/lib/utils";

import { usePageBuilderBlockRoot } from "@/components/page-builder-block-root-context";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PagebuilderType } from "@/types";

type ColorValue = string | { hex?: string | null } | null | undefined;

type InsightCardBlockProps = PagebuilderType<"insightCard"> & {
  isNested?: boolean;
};

function resolveColor(color: ColorValue): string | undefined {
  const candidate = typeof color === "string" ? color : color?.hex;
  return typeof candidate === "string" && candidate.trim()
    ? candidate.trim()
    : undefined;
}

export function InsightCardBlock({
  value,
  valueTextColor,
  description,
  backgroundColor,
  sectionId,
  _type,
  isNested = false,
}: InsightCardBlockProps) {
  const { dataSanity, surfaceStyle } = usePageBuilderBlockRoot();

  const resolvedValue = value?.trim();
  const resolvedDescription = description?.trim();
  const resolvedSectionId = sectionId?.trim() || undefined;

  if (!resolvedValue && !resolvedDescription) {
    return null;
  }

  const resolvedBackgroundColor = resolveColor(backgroundColor) ?? "#0F56C8";
  const resolvedValueTextColor = resolveColor(valueTextColor);

  const wrapperStyle = {
    backgroundColor: resolvedBackgroundColor,
  };

  const inner = (
    <article
      className="mx-auto w-full max-w-5xl rounded-[20px] px-8 py-7 text-white md:px-10 md:py-9"
      style={wrapperStyle}
    >
      {resolvedValue ? (
        <p
          className={cn(
            "font-semibold text-[44px] leading-none tracking-tight md:text-[56px]",
            resolvedValueTextColor ? undefined : "text-white",
          )}
          style={resolvedValueTextColor ? { color: resolvedValueTextColor } : undefined}
        >
          {resolvedValue}
        </p>
      ) : null}
      {resolvedDescription ? (
        <p
          className="mt-3 text-base/7 text-white/85 md:text-lg/8"
          style={
            resolvedValueTextColor
              ? { color: resolvedValueTextColor, opacity: 0.85 }
              : undefined
          }
        >
          {resolvedDescription}
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

