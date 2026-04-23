import { cn } from "@workspace/ui/lib/utils";

import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PageBuilderBlock } from "@/types";
import { ButtonLinkBlock } from "./button-link";
import { CompanyLogoCarouselBlock } from "./company-logo-carousel";
import { H1Block } from "./h1";
import { HowItWorksCardsBlock } from "./how-it-works-cards";
import { ImageCardBlock } from "./image-card";
import { ImageBlock } from "./image";
import { NewsletterBlock } from "./newsletter";
import { PBlock } from "./p";
import { PardotFormBlock } from "./pardot-form";
import { RichTextBlock } from "./rich-text-block";
import { StatsCounterBlock } from "./stats-counter";
import { TwoColumnsBlock } from "./two-columns";
import { WhatWeDoCardsBlock } from "./what-we-do-cards";
import { WhatYouCanRunCardsBlock } from "./what-you-can-run-cards";

type CTABlockProps = {
  title?: string | null;
  pageBuilder?: PageBuilderBlock[] | null;
} & Pick<PageBuilderBlock, "_type">;

const NESTED_COMPONENTS = {
  buttonLink: ButtonLinkBlock,
  companyLogoCarousel: CompanyLogoCarouselBlock,
  h1: H1Block,
  howItWorksCards: HowItWorksCardsBlock,
  imageBlock: ImageBlock,
  imageCard: ImageCardBlock,
  newsletter: NewsletterBlock,
  p: PBlock,
  pardotForm: PardotFormBlock,
  richTextBlock: RichTextBlock,
  statsCounter: StatsCounterBlock,
  twoColumns: TwoColumnsBlock,
  whatWeDoCards: WhatWeDoCardsBlock,
  whatYouCanRunCards: WhatYouCanRunCardsBlock,
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
      ...(block._type === "pardotForm"
        ? { compact: true, transparent: true }
        : {}),
    };

    // biome-ignore lint/suspicious/noExplicitAny: dynamic block rendering
    return <Component key={key} {...(block as any)} {...extraProps} />;
  });
}

export function CTABlock({ title, pageBuilder, _type }: CTABlockProps) {
  if (!title?.trim() && !pageBuilder?.length) {
    return null;
  }

  return (
    <section
      className={cn(
        camelCaseToKebabCase(_type),
        "container-wrapper py-10 md:py-14"
      )}
    >
      <div className="rounded-[28px] bg-gradient-to-b from-[#101f80] to-[#2f25b0] px-8 py-10 md:px-14 md:py-12 lg:px-20">
        {title ? (
          <h2 className="mb-8 text-center font-semibold text-3xl text-white tracking-tight md:text-5xl">
            {title}
          </h2>
        ) : null}
        <div className="mx-auto max-w-4xl">{renderNestedBlocks(pageBuilder)}</div>
      </div>
    </section>
  );
}
