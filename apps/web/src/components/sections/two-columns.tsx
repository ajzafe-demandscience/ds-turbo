import { cn } from "@workspace/ui/lib/utils";

import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PageBuilderBlock, PagebuilderType } from "@/types";
import { ButtonLinkBlock } from "./button-link";
import { CompanyLogoCarouselBlock } from "./company-logo-carousel";
import { H1Block } from "./h1";
import { ImageCardBlock } from "./image-card";
import { HeroBlock } from "./hero";
import { ImageBlock } from "./image";
import { PBlock } from "./p";
import { PardotFormBlock } from "./pardot-form";
import { RichTextBlock } from "./rich-text-block";

type TwoColumnsBlockProps = PagebuilderType<"twoColumns"> & {
  isNested?: boolean;
};

const NESTED_COMPONENTS = {
  companyLogoCarousel: CompanyLogoCarouselBlock,
  hero: HeroBlock,
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
      ...(block._type === "pardotForm" ? { compact: true } : {}),
    };

    // biome-ignore lint/suspicious/noExplicitAny: dynamic block rendering
    return <Component key={key} {...(block as any)} {...extraProps} />;
  });
}

export function TwoColumnsBlock({
  leftColumn,
  rightColumn,
  sectionId,
  _type,
  isNested = false,
}: TwoColumnsBlockProps) {
  const resolvedSectionId = sectionId?.trim() || undefined;

  const grid = (
    <div className="two-column-responsive-padding grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
      <div className="space-y-4">{renderNestedBlocks(leftColumn)}</div>
      <div className="space-y-4">{renderNestedBlocks(rightColumn)}</div>
    </div>
  );

  return (
    <section className={cn(camelCaseToKebabCase(_type), "py-10")} id={resolvedSectionId}>
      {isNested ? (
        grid
      ) : (
        <div className="container-wrapper">{grid}</div>
      )}
    </section>
  );
}
