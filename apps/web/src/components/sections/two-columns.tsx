import { cn } from "@workspace/ui/lib/utils";

import { usePageBuilderBlockRoot } from "@/components/page-builder-block-root-context";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PagebuilderType, TwoColumnNestedBlock } from "@/types";
import { ButtonLinkBlock } from "./button-link";
import { CaseStudyStatsCardsBlock } from "./case-study-stats-cards";
import { CaseStudyStatsCardBlock } from "./case-study-stats-card";
import { CardStatBlock } from "./card-stat";
import { CompanyLogoCarouselBlock } from "./company-logo-carousel";
import { ImageCardBlock } from "./image-card";
import { ImageDescriptionCardsBlock } from "./image-description-cards";
import { HeroBlock } from "./hero";
import { ImageBlock } from "./image";
import { InsightCardBlock } from "./cards/insight-card";
import { InsightHeaderBlock } from "./insight-header";
import { PBlock } from "./p";
import { PardotFormBlock } from "./pardot-form";
import { RichTextBlock } from "./rich-text-block";
import { SpeakersBlock } from "./speakers";
import { TitleIconBlock } from "./title-icon";
import { SectionSplitBlock } from "./section-split";
import { CtaWebinarFormBlock } from "./cta-webinar-form";

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
  imageDescriptionCards: ImageDescriptionCardsBlock,
  hero: HeroBlock,
  buttonLink: ButtonLinkBlock,
  cardStat: CardStatBlock,
  insightCard: InsightCardBlock,
  insightHeader: InsightHeaderBlock,
  caseStudyStatsCard: CaseStudyStatsCardBlock,
  caseStudyStatsCards: CaseStudyStatsCardsBlock,
  speakers: SpeakersBlock,
  ctaWebinarForm: CtaWebinarFormBlock,
  imageBlock: ImageBlock,
  imageCard: ImageCardBlock,
  p: PBlock,
  pardotForm: PardotFormBlock,
  richTextBlock: RichTextBlock,
  sectionSplit: SectionSplitBlock,
  titleIcon: TitleIconBlock,
  // biome-ignore lint/suspicious/noExplicitAny: dynamic block rendering
} as const satisfies Record<string, React.ComponentType<any>>;

function renderNestedBlocks(blocks: TwoColumnNestedBlock[] | null | undefined) {
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
  const { dataSanity, surfaceStyle } = usePageBuilderBlockRoot();
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

  const header =
    title || description ? (
      <>
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
      </>
    ) : null;

  return (
    <section
      className={camelCaseToKebabCase(_type)}
      data-sanity={dataSanity}
      id={resolvedSectionId}
      style={surfaceStyle}
    >
      {isNested ? (
        <>
          {header}
          {grid}
        </>
      ) : (
        <div className="container-wrapper py-10">
          {header}
          {grid}
        </div>
      )}
    </section>
  );
}
