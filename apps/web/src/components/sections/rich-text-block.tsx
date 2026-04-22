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
  sectionId,
  isNested = false,
  isHero = false,
}: RichTextBlockProps) {
  const containerClassName = isNested ? undefined : "section-container-md6";
  const resolvedSectionId = sectionId?.trim() || undefined;

  return (
    <section className="mt-6 mb-9 md:mt-6 md:mb-9" id={resolvedSectionId}>
      <div className={containerClassName}>
        <div className="flex w-full flex-col items-center">
          <div
            className={
              isHero
                ? "flex w-full flex-col items-start space-y-4 text-left sm:space-y-6"
                : "flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center"
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
                <h2 className="font-semibold text-3xl md:text-5xl">{title}</h2>
              )
            )}
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-4xl">
          <RichText richText={richText} />
        </div>
      </div>
    </section>
  );
}
