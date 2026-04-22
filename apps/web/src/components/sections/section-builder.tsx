import type { PageBuilderBlock } from "@/types";
import { ButtonLinkBlock } from "./button-link";
import { CompanyLogoCarouselBlock } from "./company-logo-carousel";
import { H1Block } from "./h1";
import { HowItWorksCardsBlock } from "./how-it-works-cards";
import { ImageCardBlock } from "./image-card";
import { ImageBlock } from "./image";
import { PBlock } from "./p";
import { PardotFormBlock } from "./pardot-form";
import { RichTextBlock } from "./rich-text-block";
import { StatsCounterBlock } from "./stats-counter";
import { TwoColumnsBlock } from "./two-columns";
import { WhatWeDoCardsBlock } from "./what-we-do-cards";
import { WhatYouCanRunCardsBlock } from "./what-you-can-run-cards";

type SectionBuilderBlockProps = {
  title?: string | null;
  pageBuilder?: PageBuilderBlock[] | null;
};

const NESTED_COMPONENTS = {
  buttonLink: ButtonLinkBlock,
  companyLogoCarousel: CompanyLogoCarouselBlock,
  h1: H1Block,
  howItWorksCards: HowItWorksCardsBlock,
  imageBlock: ImageBlock,
  imageCard: ImageCardBlock,
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

export function SectionBuilderBlock({ title, pageBuilder }: SectionBuilderBlockProps) {
  if (!title?.trim() && !pageBuilder?.length) {
    return null;
  }

  return (
    <section className="container-wrapper py-10 md:py-14">
      {title ? (
        <h2 className="mb-8 text-center font-semibold text-3xl tracking-tight md:text-5xl">
          {title}
        </h2>
      ) : null}
      <div>{renderNestedBlocks(pageBuilder)}</div>
    </section>
  );
}
