import { cn } from "@workspace/ui/lib/utils";

import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PageBuilderBlock, PagebuilderType } from "@/types";
import { ButtonLinkBlock } from "./button-link";
import { H1Block } from "./h1";
import { ImageCardBlock } from "./image-card";
import { ImageBlock } from "./image";
import { PBlock } from "./p";
import { PardotFormBlock } from "./pardot-form";
import { RichTextBlock } from "./rich-text-block";

type HeroBlockProps = PagebuilderType<"hero"> & {
  isNested?: boolean;
  isHomePage?: boolean;
};

const NESTED_COMPONENTS = {
  h1: H1Block,
  buttonLink: ButtonLinkBlock,
  imageBlock: ImageBlock,
  imageCard: ImageCardBlock,
  p: PBlock,
  pardotForm: PardotFormBlock,
  richTextBlock: RichTextBlock,
  // biome-ignore lint/suspicious/noExplicitAny: dynamic block rendering
} as const satisfies Record<string, React.ComponentType<any>>;

function renderNestedBlocks(blocks: PageBuilderBlock[] | null | undefined) {
  if (!blocks?.length) {
    return null;
  }

  return blocks.map((block) => {
    const key = `${block._type}-${block._key}`;
    const Component =
      NESTED_COMPONENTS[block._type as keyof typeof NESTED_COMPONENTS];

    if (!Component) {
      return null;
    }

    const extraProps = {
      isNested: true,
      ...(block._type === "p" ? { isHero: true } : {}),
      ...(block._type === "richTextBlock" ? { isHero: true } : {}),
      ...(block._type === "pardotForm" ? { compact: true } : {}),
    };

    // biome-ignore lint/suspicious/noExplicitAny: dynamic block rendering
    return <Component key={key} {...(block as any)} {...extraProps} />;
  });
}

export function HeroBlock({
  leftColumn,
  rightColumn,
  sectionId,
  _type,
  isNested = false,
  isHomePage = false,
}: HeroBlockProps) {
  const containerClassName = isNested
    ? "w-full px-0 pt-10 pb-12 md:pt-14 md:pb-16 lg:pt-16 lg:pb-20"
    : cn(
        "hero-surface-container",
        isHomePage && "pt-24 md:pt-28 lg:pt-32",
      );

  const resolvedSectionId = sectionId?.trim() || "hero";

  return (
    <section
      className={cn(camelCaseToKebabCase(_type), "article-hero-surface")}
      id={resolvedSectionId}
    >
      <div className={containerClassName}>
        <div className="two-column-responsive-padding grid items-center gap-8 md:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]">
          <div className="space-y-8">{renderNestedBlocks(leftColumn)}</div>
          <div className="space-y-8 lg:justify-self-end">
            {renderNestedBlocks(rightColumn)}
          </div>
        </div>
      </div>
    </section>
  );
}
