import { RichText } from "@/components/elements/rich-text";
import type { PagebuilderType } from "@/types";

export type PBlockProps = PagebuilderType<"p"> & {
  isNested?: boolean;
  isHero?: boolean;
};

export function PBlock({
  richText,
  sectionId,
  isNested = false,
  isHero = false,
}: PBlockProps) {
  if (!richText?.length) {
    return null;
  }

  const sectionClassName = isNested ? undefined : "container-wrapper";
  const resolvedSectionId = sectionId?.trim() || undefined;

  return (
    <section className={sectionClassName} id={resolvedSectionId}>
      <div className="max-w-4xl">
        <RichText
          className={
            isHero
              ? "text-[#fff] prose-p:text-[#fff] prose-headings:text-[#fff] prose-strong:text-[#fff] prose-a:text-[#fff]"
              : undefined
          }
          richText={richText}
        />
      </div>
    </section>
  );
}
