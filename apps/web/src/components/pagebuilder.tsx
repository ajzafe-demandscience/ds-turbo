"use client";

import { useOptimistic } from "@sanity/visual-editing/react";
import { env } from "@workspace/env/client";
import { cn } from "@workspace/ui/lib/utils";
import { createDataAttribute } from "next-sanity";
import { useCallback, useMemo } from "react";

import type { PageBuilderBlock, PageBuilderBlockTypes } from "@/types";
import { PageBuilderBlockRootProvider } from "./page-builder-block-root-context";
import { CaseStudyStatsCardsBlock } from "./sections/case-study-stats-cards";
import { CaseStudyStatsCardBlock } from "./sections/case-study-stats-card";
import { CardStatBlock } from "./sections/card-stat";
import { CompanyLogoCarouselBlock } from "./sections/company-logo-carousel";
import { CtaWebinarFormBlock } from "./sections/cta-webinar-form";
import { HowItWorksCardsBlock } from "./sections/how-it-works-cards";
import { ImageDescriptionCardsBlock } from "./sections/image-description-cards";
import { HeroBlock } from "./sections/hero";
import { HeroWebinarBlock } from "./sections/hero-webinar";
import { CTABlock } from "./sections/cta";
import { ImageCardBlock } from "./sections/image-card";
import { ImageBlock } from "./sections/image";
import { InsightCardBlock } from "./sections/cards/insight-card";
import { InsightHeaderBlock } from "./sections/insight-header";
import { PBlock } from "./sections/p";
import { PardotFormBlock } from "./sections/pardot-form";
import { RichTextBlock } from "./sections/rich-text-block";
import { SpeakersBlock } from "./sections/speakers";
import { SectionBlock } from "./sections/section";
import { SectionSplitBlock } from "./sections/section-split";
import { StatsCounterBlock } from "./sections/stats-counter";
import { TitleIconBlock } from "./sections/title-icon";
import { TwoColumnsBlock } from "./sections/two-columns";
import { NewsletterBlock } from "./sections/newsletter";
import { WhatWeDoCardsBlock } from "./sections/what-we-do-cards";
import { WhatYouCanRunCardsBlock } from "./sections/what-you-can-run-cards";

export type PageBuilderProps = {
  readonly pageBuilder?: PageBuilderBlock[];
  readonly id: string;
  readonly type: string;
};

type ExtendedPageBuilderBlockTypes =
  | PageBuilderBlockTypes
  | "imageBlock"
  | "imageCard"
  | "p"
  | "pardotForm"
  | "cardStat"
  | "insightCard"
  | "insightHeader"
  | "caseStudyStatsCard"
  | "caseStudyStatsCards"
  | "companyLogoCarousel"
  | "ctaWebinarForm"
  | "speakers"
  | "cta"
  | "howItWorksCards"
  | "imageDescriptionCards"
  | "statsCounter"
  | "titleIcon"
  | "newsletter"
  | "whatWeDoCards"
  | "whatYouCanRunCards"
  | "section"
  | "sectionSplit"
  | "heroWebinar";

type SanityDataAttributeConfig = {
  readonly id: string;
  readonly type: string;
  readonly path: string;
};

type SanityColorValue = {
  hex?: string;
};

// Strongly typed component mapping with proper component signatures
const BLOCK_COMPONENTS = {
  companyLogoCarousel: CompanyLogoCarouselBlock,
  cardStat: CardStatBlock,
  insightCard: InsightCardBlock,
  insightHeader: InsightHeaderBlock,
  caseStudyStatsCard: CaseStudyStatsCardBlock,
  caseStudyStatsCards: CaseStudyStatsCardsBlock,
  ctaWebinarForm: CtaWebinarFormBlock,
  speakers: SpeakersBlock,
  cta: CTABlock,
  howItWorksCards: HowItWorksCardsBlock,
  imageDescriptionCards: ImageDescriptionCardsBlock,
  statsCounter: StatsCounterBlock,
  titleIcon: TitleIconBlock,
  newsletter: NewsletterBlock,
  whatYouCanRunCards: WhatYouCanRunCardsBlock,
  whatWeDoCards: WhatWeDoCardsBlock,
  hero: HeroBlock,
  heroWebinar: HeroWebinarBlock,
  imageBlock: ImageBlock,
  imageCard: ImageCardBlock,
  p: PBlock,
  pardotForm: PardotFormBlock,
  richTextBlock: RichTextBlock,
  section: SectionBlock,
  sectionSplit: SectionSplitBlock,
  twoColumns: TwoColumnsBlock,
  // biome-ignore lint/suspicious/noExplicitAny: <any is used to allow for dynamic component rendering>
} as const satisfies Record<ExtendedPageBuilderBlockTypes, React.ComponentType<any>>;

/**
 * Helper function to create consistent Sanity data attributes
 */
function createSanityDataAttribute(config: SanityDataAttributeConfig): string {
  return createDataAttribute({
    id: config.id,
    baseUrl: env.NEXT_PUBLIC_SANITY_STUDIO_URL,
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET,
    type: config.type,
    path: config.path,
  }).toString();
}

/**
 * Error fallback component for unknown block types
 */
function UnknownBlockError({
  blockType,
  blockKey,
}: {
  blockType: string;
  blockKey: string;
}) {
  return (
    <div
      aria-label={`Unknown block type: ${blockType}`}
      className={cn(
        "unknown-block-error flex items-center justify-center rounded-lg border-2 border-muted-foreground/20 border-dashed bg-muted p-8 text-center text-muted-foreground"
      )}
      key={`${blockType}-${blockKey}`}
      role="alert"
    >
      <div className="space-y-2">
        <p>Component not found for block type:</p>
        <code className="rounded bg-background px-2 py-1 font-mono text-sm">
          {blockType}
        </code>
      </div>
    </div>
  );
}

/**
 * Hook to handle optimistic updates for page builder blocks
 */
function useOptimisticPageBuilder(
  initialBlocks: PageBuilderBlock[],
  documentId: string
) {
  // biome-ignore lint/suspicious/noExplicitAny: <any is used to allow for dynamic component rendering>
  return useOptimistic<PageBuilderBlock[], any>(
    initialBlocks,
    (currentBlocks, action) => {
      if (action.id === documentId && action.document?.pageBuilder) {
        return action.document.pageBuilder;
      }
      return currentBlocks;
    }
  );
}

/**
 * Custom hook for block component rendering logic
 */
function useBlockRenderer(id: string, type: string) {
  const createBlockDataAttribute = useCallback(
    (blockKey: string) =>
      createSanityDataAttribute({
        id,
        type,
        path: `pageBuilder[_key=="${blockKey}"]`,
      }),
    [id, type]
  );

  const renderBlock = useCallback(
    (block: PageBuilderBlock, _index: number) => {
      const Component =
        BLOCK_COMPONENTS[block._type as keyof typeof BLOCK_COMPONENTS];

      if (!Component) {
        return (
          <UnknownBlockError
            blockKey={block._key}
            blockType={block._type}
            key={`${block._type}-${block._key}`}
          />
        );
      }

      const backgroundColorValue =
        "backgroundColor" in block
          ? (block as { backgroundColor?: string | SanityColorValue | null })
              .backgroundColor
          : undefined;

      const resolvedBackgroundColor =
        typeof backgroundColorValue === "string"
          ? backgroundColorValue
          : backgroundColorValue?.hex;

      const blockStyle =
        typeof resolvedBackgroundColor === "string" &&
        resolvedBackgroundColor.trim()
          ? { backgroundColor: resolvedBackgroundColor.trim() }
          : undefined;

      // biome-ignore lint/suspicious/noExplicitAny: dynamic page builder block props
      const blockProps = block as any;

      return (
        <PageBuilderBlockRootProvider
          dataSanity={createBlockDataAttribute(block._key)}
          key={`${block._type}-${block._key}`}
          surfaceStyle={blockStyle}
        >
          <Component
            {...blockProps}
            {...(block._type === "hero" ? { isHomePage: type === "homePage" } : {})}
            {...(["section", "sectionSplit"].includes(block._type)
              ? { isWebinarPage: type === "webinar" }
              : {})}
          />
        </PageBuilderBlockRootProvider>
      );
    },
    [createBlockDataAttribute, type]
  );

  return { renderBlock };
}

/**
 * PageBuilder component for rendering dynamic content blocks from Sanity CMS
 */
export function PageBuilder({
  pageBuilder: initialBlocks = [],
  id,
  type,
}: PageBuilderProps) {
  const blocks = useOptimisticPageBuilder(initialBlocks, id);
  const { renderBlock } = useBlockRenderer(id, type);

  const containerDataAttribute = useMemo(
    () => createSanityDataAttribute({ id, type, path: "pageBuilder" }),
    [id, type]
  );

  if (!blocks.length) {
    return null;
  }

  return (
    <main className="page-builder" data-sanity={containerDataAttribute}>
      {blocks.map(renderBlock)}
    </main>
  );
}
