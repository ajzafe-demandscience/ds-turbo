import { Badge } from "@workspace/ui/components/badge";

import { RichText } from "@/components/elements/rich-text";
import type { PagebuilderType } from "@/types";

export type RichTextBlockProps = PagebuilderType<"richTextBlock"> & {
  isNested?: boolean;
  isHero?: boolean;
};

export function RichTextBlock({
  richText,
  title,
  eyebrow,
  titleAlignment,
  sectionId,
  isNested = false,
  isHero = false,
}: RichTextBlockProps) {
  const containerClassName = isNested ? undefined : "section-container-md6";
  const resolvedSectionId = sectionId?.trim() || undefined;
  const resolvedTitleAlignment = titleAlignment ?? "left";
  const sectionClassName = isNested
    ? "mt-0 mb-9 md:mt-0 md:mb-9"
    : "mt-6 mb-9 md:mt-6 md:mb-9 py-6";
  const titleAlignmentClass =
    resolvedTitleAlignment === "left"
      ? "text-left"
      : resolvedTitleAlignment === "right"
        ? "text-right"
        : "text-center";
  const contentAlignmentClass =
    resolvedTitleAlignment === "left"
      ? "items-start"
      : resolvedTitleAlignment === "right"
        ? "items-end"
        : "items-center";

  return (
    <section className={sectionClassName} id={resolvedSectionId}>
      <div className={containerClassName}>
        <div className={contentAlignmentClass ? `flex w-full flex-col ${contentAlignmentClass}` : "flex w-full flex-col"}>
          <div
            className={
              isHero
                ? "flex w-full flex-col items-start space-y-4 text-left sm:space-y-6"
                : `flex w-full flex-col space-y-4 sm:space-y-6 ${contentAlignmentClass} ${titleAlignmentClass}`
            }
          >
            {eyebrow &&
              (isHero ? (
                <p className="font-bold text-[18px] text-white">{eyebrow}</p>
              ) : (
                <Badge variant="secondary">{eyebrow}</Badge>
              ))}
            {title && (
              isHero ? (
                <h1 className="hero-page-title text-white">{title}</h1>
              ) : (
                <h2
                  className={`w-full font-semibold text-3xl md:text-5xl ${titleAlignmentClass}`}
                >
                  {title}
                </h2>
              )
            )}
          </div>
        </div>
        <div className="mx-auto mt-4">
          <RichText richText={richText} />
        </div>
      </div>
    </section>
  );
}
