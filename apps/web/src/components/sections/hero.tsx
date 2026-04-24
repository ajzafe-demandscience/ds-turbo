import { cn } from "@workspace/ui/lib/utils";

import { usePageBuilderBlockRoot } from "@/components/page-builder-block-root-context";
import { RichText } from "@/components/elements/rich-text";
import { SanityImage } from "@/components/elements/sanity-image";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PagebuilderType, SanityImageProps } from "@/types";
import { ButtonLinkBlock } from "./button-link";
import { PardotFormBlock } from "./pardot-form";

type HeroBlockProps = PagebuilderType<"hero"> & {
  isNested?: boolean;
  isHomePage?: boolean;
};

export function HeroBlock({
  eyebrow,
  title,
  description,
  buttons,
  mediaType,
  mediaImage,
  pardotFormUrl,
  sectionId,
  _type,
  isNested = false,
}: HeroBlockProps) {
  const { dataSanity, surfaceStyle } = usePageBuilderBlockRoot();
  const containerClassName = isNested
    ? "w-full px-0 pt-10 pb-12 md:pt-14 md:pb-16 lg:pt-16 lg:pb-20"
    : "hero-surface-container pt-24 md:pt-28 lg:pt-32";

  const resolvedSectionId = sectionId?.trim() || "hero";
  const resolvedMediaType =
    mediaType === "pardot" ? "pardot" : "image";
  const imageForDisplay = mediaImage as SanityImageProps | null | undefined;

  const showImage =
    resolvedMediaType === "image" && Boolean(imageForDisplay?.id);
  const showPardot =
    resolvedMediaType === "pardot" && Boolean(pardotFormUrl?.trim());
  const hasMediaColumn = showImage || showPardot;
  const resolvedPardotUrl = pardotFormUrl?.trim() ?? "";

  const mediaColumn =
    showImage && imageForDisplay?.id ? (
      <div className="flex w-full justify-center lg:justify-end">
        <div className="w-full max-w-[420px] overflow-hidden rounded-2xl sm:max-w-[480px] lg:max-w-[560px] xl:max-w-[640px]">
          <SanityImage
            alt={imageForDisplay.alt ?? title?.trim() ?? "Hero image"}
            className="h-auto w-full object-contain object-center"
            image={imageForDisplay}
            loading="eager"
          />
        </div>
      </div>
    ) : showPardot ? (
      <div className="flex w-full justify-center lg:justify-end">
        <div className="w-full max-w-[520px] rounded-[28px] bg-white px-6 py-7 shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:px-8 sm:py-8">
          <h2 className="mb-5 text-center font-semibold text-3xl text-slate-900 tracking-tight">
            Register
          </h2>
          <PardotFormBlock
            _key="hero-pardot-embed"
            _type="pardotForm"
            compact
            transparent
            url={resolvedPardotUrl}
          />
        </div>
      </div>
    ) : null;

  return (
    <section
      className={cn(camelCaseToKebabCase(_type), "article-hero-surface")}
      data-sanity={dataSanity}
      id={resolvedSectionId}
      style={surfaceStyle}
    >
      <div className={containerClassName}>
        <div
          className={cn(
            "two-column-responsive-padding grid items-center gap-8 md:gap-10",
            hasMediaColumn
              ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]"
              : "mx-auto max-w-4xl"
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-6 text-left text-white md:gap-8",
              hasMediaColumn ? undefined : "col-span-full"
            )}
          >
            {eyebrow?.trim() ? (
              <div className="inline-flex">
                <span className="article-hero-eyebrow">{eyebrow.trim()}</span>
              </div>
            ) : null}

            {title?.trim() ? (
              <h1 className="hero-page-title max-w-3xl text-white">
                {title.trim()}
              </h1>
            ) : null}

            {description?.length ? (
              <div className="max-w-2xl">
                <RichText
                  className="text-[#fff] prose-p:text-[#fff] prose-headings:text-[#fff] prose-strong:text-[#fff] prose-a:text-[#fff] prose-li:text-[#fff]"
                  richText={description}
                />
              </div>
            ) : null}

            {buttons?.length ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                {buttons.map((button) => (
                  <ButtonLinkBlock
                    key={button._key}
                    {...button}
                    _type="buttonLink"
                    isNested
                  />
                ))}
              </div>
            ) : null}
          </div>

          {hasMediaColumn ? mediaColumn : null}
        </div>
      </div>
    </section>
  );
}
