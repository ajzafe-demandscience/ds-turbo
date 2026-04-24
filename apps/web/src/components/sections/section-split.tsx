import { cn } from "@workspace/ui/lib/utils";

import { usePageBuilderBlockRoot } from "@/components/page-builder-block-root-context";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PagebuilderType, SectionSplitNestedBlock } from "@/types";
import { ButtonLinkBlock } from "./button-link";
import { CardStatBlock } from "./card-stat";
import { CaseStudyStatsCardsBlock } from "./case-study-stats-cards";
import { CaseStudyStatsCardBlock } from "./case-study-stats-card";
import { CompanyLogoCarouselBlock } from "./company-logo-carousel";
import { HowItWorksCardsBlock } from "./how-it-works-cards";
import { ImageDescriptionCardsBlock } from "./image-description-cards";
import { ImageCardBlock } from "./image-card";
import { ImageBlock } from "./image";
import { InsightCardBlock } from "./cards/insight-card";
import { InsightHeaderBlock } from "./insight-header";
import { NewsletterBlock } from "./newsletter";
import { PBlock } from "./p";
import { PardotFormBlock } from "./pardot-form";
import { RichTextBlock } from "./rich-text-block";
import { SpeakersBlock } from "./speakers";
import { StatsCounterBlock } from "./stats-counter";
import { TitleIconBlock } from "./title-icon";
import { TwoColumnsBlock } from "./two-columns";
import { CtaWebinarFormBlock } from "./cta-webinar-form";
import { WhatWeDoCardsBlock } from "./what-we-do-cards";
import { WhatYouCanRunCardsBlock } from "./what-you-can-run-cards";

type SectionSplitBlockProps = PagebuilderType<"sectionSplit"> & {
  isNested?: boolean;
  isWebinarPage?: boolean;
};

const NESTED_COMPONENTS = {
  buttonLink: ButtonLinkBlock,
  cardStat: CardStatBlock,
  insightCard: InsightCardBlock,
  insightHeader: InsightHeaderBlock,
  caseStudyStatsCard: CaseStudyStatsCardBlock,
  caseStudyStatsCards: CaseStudyStatsCardsBlock,
  companyLogoCarousel: CompanyLogoCarouselBlock,
  howItWorksCards: HowItWorksCardsBlock,
  imageDescriptionCards: ImageDescriptionCardsBlock,
  speakers: SpeakersBlock,
  ctaWebinarForm: CtaWebinarFormBlock,
  imageBlock: ImageBlock,
  imageCard: ImageCardBlock,
  newsletter: NewsletterBlock,
  p: PBlock,
  pardotForm: PardotFormBlock,
  richTextBlock: RichTextBlock,
  statsCounter: StatsCounterBlock,
  titleIcon: TitleIconBlock,
  twoColumns: TwoColumnsBlock,
  whatWeDoCards: WhatWeDoCardsBlock,
  whatYouCanRunCards: WhatYouCanRunCardsBlock,
  // biome-ignore lint/suspicious/noExplicitAny: dynamic block rendering
} as const satisfies Record<string, React.ComponentType<any>>;

function renderColumnBlocks(blocks: SectionSplitNestedBlock[] | null | undefined) {
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

export function SectionSplitBlock({
  eyebrow,
  title,
  description,
  leftColumn,
  rightColumn,
  sectionId,
  _type,
  isNested = false,
  isWebinarPage = false,
}: SectionSplitBlockProps) {
  const { dataSanity, surfaceStyle } = usePageBuilderBlockRoot();
  const resolvedSectionId = sectionId?.trim() || undefined;

  const resolvedEyebrow = eyebrow?.trim();
  const resolvedTitle = title?.trim();
  const resolvedDescription = description?.trim();

  const hasHeader = Boolean(resolvedEyebrow || resolvedTitle || resolvedDescription);
  const hasColumns = Boolean(leftColumn?.length || rightColumn?.length);

  if (!hasHeader && !hasColumns) {
    return null;
  }

  const header = hasHeader ? (
    <div className="mb-10 text-center md:mb-12">
      {resolvedEyebrow ? (
        <p className="mb-3 font-medium text-[#0066FC] text-sm uppercase tracking-wide">
          {resolvedEyebrow}
        </p>
      ) : null}
      {resolvedTitle ? (
        <h2
          className={cn(
            "font-semibold tracking-tight",
            isWebinarPage
              ? "!text-[30px] !leading-[1.15]"
              : "text-3xl md:text-5xl"
          )}
        >
          {resolvedTitle}
        </h2>
      ) : null}
      {resolvedDescription ? (
        <p className="mt-4 text-balance text-lg text-muted-foreground md:text-xl">
          {resolvedDescription}
        </p>
      ) : null}
    </div>
  ) : null;

  const columns = (
    <div className="two-column-responsive-padding grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
      <div className="space-y-4">{renderColumnBlocks(leftColumn)}</div>
      <div className="space-y-4">{renderColumnBlocks(rightColumn)}</div>
    </div>
  );

  const inner = (
    <>
      {header}
      {columns}
    </>
  );

  return (
    <section
      className={cn(camelCaseToKebabCase(_type), isNested ? "w-full" : undefined)}
      data-sanity={dataSanity}
      id={resolvedSectionId}
      style={surfaceStyle}
    >
      {isNested ? inner : <div className="container-wrapper py-10 md:py-14">{inner}</div>}
    </section>
  );
}

