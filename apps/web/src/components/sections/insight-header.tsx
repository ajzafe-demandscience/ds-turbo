import { cn } from "@workspace/ui/lib/utils";

import { InsightHeader } from "@/components/elements/insight-header";
import { usePageBuilderBlockRoot } from "@/components/page-builder-block-root-context";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PagebuilderType } from "@/types";

type ColorValue = string | { hex?: string | null } | null | undefined;

type InsightHeaderBlockProps = PagebuilderType<"insightHeader"> & {
  isNested?: boolean;
};

function resolveColor(color: ColorValue): string | undefined {
  const candidate = typeof color === "string" ? color : color?.hex;
  return typeof candidate === "string" && candidate.trim()
    ? candidate.trim()
    : undefined;
}

export function InsightHeaderBlock({
  text,
  barBackgroundColor,
  barTextColor,
  sectionId,
  _type,
  isNested = false,
}: InsightHeaderBlockProps) {
  const { dataSanity, surfaceStyle } = usePageBuilderBlockRoot();
  const resolvedSectionId = sectionId?.trim() || undefined;
  const resolvedText = text?.trim() ?? "";
  const barBg = resolveColor(barBackgroundColor);
  const barFg = resolveColor(barTextColor);

  if (!resolvedText) {
    return null;
  }

  const inner = (
    <InsightHeader
      barBackgroundColor={barBg}
      barTextColor={barFg}
      text={resolvedText}
    />
  );

  return (
    <section
      className={cn(camelCaseToKebabCase(_type))}
      data-sanity={dataSanity}
      id={resolvedSectionId}
      style={surfaceStyle}
    >
      {isNested ? (
        inner
      ) : (
        <div className="container-wrapper py-6 md:py-8">{inner}</div>
      )}
    </section>
  );
}
