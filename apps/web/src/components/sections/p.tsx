import type { P } from "@workspace/sanity/types";

import { RichText } from "@/components/elements/rich-text";
import { usePageBuilderBlockRoot } from "@/components/page-builder-block-root-context";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { SanityRichTextProps } from "@/types";

export type PBlockProps = Omit<P, "richText"> & {
  richText?: SanityRichTextProps;
  isNested?: boolean;
  isHero?: boolean;
};

export function PBlock({
  richText,
  textColor,
  sectionId,
  _type,
  isNested = false,
  isHero = false,
}: PBlockProps) {
  const { dataSanity, surfaceStyle } = usePageBuilderBlockRoot();

  if (!richText?.length) {
    return null;
  }

  const resolvedSectionId = sectionId?.trim() || undefined;
  const resolvedTextColor =
    typeof textColor === "string" ? textColor : textColor?.hex;
  const textStyle =
    typeof resolvedTextColor === "string" && resolvedTextColor.trim()
      ? { color: resolvedTextColor.trim() }
      : undefined;
  const richTextColorClassName = textStyle
    ? "text-inherit prose-p:text-inherit prose-headings:text-inherit prose-strong:text-inherit prose-a:text-inherit"
    : undefined;

  const body = (
    <div className="max-w-4xl" style={textStyle}>
      <RichText
        className={
          isHero
            ? "text-[#fff] prose-p:text-[#fff] prose-headings:text-[#fff] prose-strong:text-[#fff] prose-a:text-[#fff]"
            : richTextColorClassName
        }
        richText={richText}
      />
    </div>
  );

  return (
    <section
      className={camelCaseToKebabCase(_type)}
      data-sanity={dataSanity}
      id={resolvedSectionId}
      style={surfaceStyle}
    >
      {isNested ? body : <div className="container-wrapper">{body}</div>}
    </section>
  );
}
