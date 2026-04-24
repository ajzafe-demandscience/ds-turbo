import { cn } from "@workspace/ui/lib/utils";

import { usePageBuilderBlockRoot } from "@/components/page-builder-block-root-context";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PagebuilderType, SectionNestedBlock } from "@/types";
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
import { SectionSplitBlock } from "./section-split";
import { WhatWeDoCardsBlock } from "./what-we-do-cards";
import { WhatYouCanRunCardsBlock } from "./what-you-can-run-cards";

type SectionBlockProps = PagebuilderType<"section"> & {
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
  sectionSplit: SectionSplitBlock,
  whatWeDoCards: WhatWeDoCardsBlock,
  whatYouCanRunCards: WhatYouCanRunCardsBlock,
  // biome-ignore lint/suspicious/noExplicitAny: dynamic block rendering
} as const satisfies Record<string, React.ComponentType<any>>;

function renderNestedBlocks(blocks: SectionNestedBlock[] | null | undefined) {
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

export function SectionBlock({
  eyebrow,
  title,
  description,
  blocks,
  sectionId,
  _type,
  isNested = false,
  isWebinarPage = false,
}: SectionBlockProps) {
  const { dataSanity, surfaceStyle } = usePageBuilderBlockRoot();
  const resolvedSectionId = sectionId?.trim() || undefined;
  const hasHeader =
    Boolean(eyebrow?.trim()) ||
    Boolean(title?.trim()) ||
    Boolean(description?.trim());
  const hasBlocks = Boolean(blocks?.length);

  if (!hasHeader && !hasBlocks) {
    return null;
  }

  const inner = (
    <>
      {hasHeader ? (
        <div className="mb-10 text-center md:mb-12">
          {eyebrow?.trim() ? (
            <p className="mb-3 font-medium text-[#0066FC] text-sm uppercase tracking-wide">
              {eyebrow.trim()}
            </p>
          ) : null}
          {title?.trim() ? (
            <h2
              className={cn(
                "font-semibold tracking-tight",
                isWebinarPage
                  ? "!text-[30px] !leading-[1.15]"
                  : "text-3xl md:text-5xl"
              )}
            >
              {title.trim()}
            </h2>
          ) : null}
          {description?.trim() ? (
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              {description.trim()}
            </p>
          ) : null}
        </div>
      ) : null}
      {hasBlocks ? (
        <div className="flex flex-col gap-8 md:gap-10">
          {renderNestedBlocks(blocks)}
        </div>
      ) : null}
    </>
  );

  return (
    <section
      className={camelCaseToKebabCase(_type)}
      data-sanity={dataSanity}
      id={resolvedSectionId}
      style={surfaceStyle}
    >
      {isNested ? (
        inner
      ) : (
        <div className="container-wrapper py-10 md:py-14">{inner}</div>
      )}
    </section>
  );
}
