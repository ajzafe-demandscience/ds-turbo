import type { PageBuilderBlock, PagebuilderType } from "@/types";
import { ButtonLinkBlock } from "./button-link";
import { CompanyLogoCarouselBlock } from "./company-logo-carousel";
import { CTABlock } from "./cta";
import { FaqAccordion } from "./faq-accordion";
import { FeatureCardsWithIcon } from "./feature-cards-with-icon";
import { H1Block } from "./h1";
import { HeroBlock } from "./hero";
import { ImageBlock } from "./image";
import { ImageLinkCards } from "./image-link-cards";
import { PBlock } from "./p";
import { PardotFormBlock } from "./pardot-form";
import { RichTextBlock } from "./rich-text-block";
import { SubscribeNewsletter } from "./subscribe-newsletter";

type TwoColumnsBlockProps = PagebuilderType<"twoColumns"> & {
  isNested?: boolean;
};

const NESTED_COMPONENTS = {
  cta: CTABlock,
  companyLogoCarousel: CompanyLogoCarouselBlock,
  faqAccordion: FaqAccordion,
  hero: HeroBlock,
  h1: H1Block,
  buttonLink: ButtonLinkBlock,
  imageBlock: ImageBlock,
  p: PBlock,
  pardotForm: PardotFormBlock,
  featureCardsIcon: FeatureCardsWithIcon,
  subscribeNewsletter: SubscribeNewsletter,
  imageLinkCards: ImageLinkCards,
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
  isNested = false,
}: TwoColumnsBlockProps) {
  const resolvedSectionId = sectionId?.trim() || undefined;

  const grid = (
    <div className="two-column-responsive-padding grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
      <div className="space-y-8">{renderNestedBlocks(leftColumn)}</div>
      <div className="space-y-8">{renderNestedBlocks(rightColumn)}</div>
    </div>
  );

  return (
    <section id={resolvedSectionId}>
      {isNested ? (
        grid
      ) : (
        <div className="container-wrapper">{grid}</div>
      )}
    </section>
  );
}
