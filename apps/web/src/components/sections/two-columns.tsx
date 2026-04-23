import { cn } from "@workspace/ui/lib/utils";

import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PageBuilderBlock, PagebuilderType } from "@/types";
import { ButtonLinkBlock } from "./button-link";
import { CaseStudyStatsCardBlock } from "./case-study-stats-card";
import { CardStatBlock } from "./card-stat";
import { CompanyLogoCarouselBlock } from "./company-logo-carousel";
import { H1Block } from "./h1";
import { ImageCardBlock } from "./image-card";
import { HeroBlock } from "./hero";
import { ImageBlock } from "./image";
import { PBlock } from "./p";
import { PardotFormBlock } from "./pardot-form";
import { RichTextBlock } from "./rich-text-block";
import { TitleIconBlock } from "./title-icon";

type TwoColumnsBlockProps = PagebuilderType<"twoColumns"> & {
  isNested?: boolean;
};

type ColumnColorValue =
  | string
  | {
      hex?: string | null;
    }
  | null
  | undefined;

function resolveColorValue(color: ColumnColorValue): string | undefined {
  if (typeof color === "string") {
    return color;
  }

  if (color && typeof color === "object" && "hex" in color) {
    const hex = color.hex;
    return typeof hex === "string" ? hex : undefined;
  }

  return undefined;
}

const NESTED_COMPONENTS = {
  companyLogoCarousel: CompanyLogoCarouselBlock,
  hero: HeroBlock,
  h1: H1Block,
  buttonLink: ButtonLinkBlock,
  cardStat: CardStatBlock,
  caseStudyStatsCard: CaseStudyStatsCardBlock,
  imageBlock: ImageBlock,
  imageCard: ImageCardBlock,
  p: PBlock,
  pardotForm: PardotFormBlock,
  richTextBlock: RichTextBlock,
  titleIcon: TitleIconBlock,
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
  title,
  description,
  leftColumn,
  rightColumn,
  leftColumnBackgroundColor,
  rightColumnBackgroundColor,
  sectionId,
  _type,
  isNested = false,
}: TwoColumnsBlockProps) {
  const resolvedSectionId = sectionId?.trim() || undefined;
  const resolvedLeftColumnBackgroundColor = resolveColorValue(
    leftColumnBackgroundColor as ColumnColorValue
  );
  const resolvedRightColumnBackgroundColor = resolveColorValue(
    rightColumnBackgroundColor as ColumnColorValue
  );

  const grid = (
    <div className="two-column-responsive-padding grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
      <div
        className={cn(
          "space-y-4 rounded-[24px]",
          resolvedLeftColumnBackgroundColor?.trim() ? "p-4 md:p-6" : undefined,
        )}
        style={
          resolvedLeftColumnBackgroundColor?.trim()
            ? { backgroundColor: resolvedLeftColumnBackgroundColor.trim() }
            : undefined
        }
      >
        {renderNestedBlocks(leftColumn)}
      </div>
      <div
        className={cn(
          "space-y-4 rounded-[24px]",
          resolvedRightColumnBackgroundColor?.trim()
            ? "p-4 md:p-6"
            : undefined,
        )}
        style={
          resolvedRightColumnBackgroundColor?.trim()
            ? { backgroundColor: resolvedRightColumnBackgroundColor.trim() }
            : undefined
        }
      >
        {renderNestedBlocks(rightColumn)}
      </div>
    </div>
  );

  return (
    <section className={cn(camelCaseToKebabCase(_type), "py-10")} id={resolvedSectionId}>
      {title ? (
        <div className="mx-auto w-full max-w-[1200px] px-6 text-center">
          <h2 className="font-semibold text-3xl tracking-tight md:text-5xl">
            {title}
          </h2>
        </div>
      ) : null}
      {description ? (
        <div className="mx-auto mt-5 w-full max-w-[1200px] px-6 text-center">
          <p className="text-lg text-muted-foreground md:text-xl">{description}</p>
        </div>
      ) : null}
      {isNested ? (
        grid
      ) : (
        <div className="container-wrapper">{grid}</div>
      )}
    </section>
  );
}
