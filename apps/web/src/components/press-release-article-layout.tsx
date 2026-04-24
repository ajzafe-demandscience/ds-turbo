import { PageBuilder } from "@/components/pagebuilder";
import { RichText } from "@/components/elements/rich-text";
import { SanityImage } from "@/components/elements/sanity-image";
import type { PageBuilderBlock, SanityImageProps, SanityRichTextProps } from "@/types";

function formatPublishedDate(publishedAt?: string | null) {
  if (!publishedAt) {
    return null;
  }
  const parsed = new Date(publishedAt);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

type PressReleaseArticleLayoutProps = {
  pressRelease: {
    _id: string;
    _type: string;
    title?: string | null;
    publishedAt?: string | null;
    banner?: SanityImageProps | null;
    bannerDescription?: string | null;
    content?: SanityRichTextProps | null;
    pageBuilder?: PageBuilderBlock[] | null;
  };
};

export function PressReleaseArticleLayout({
  pressRelease,
}: PressReleaseArticleLayoutProps) {
  const {
    title,
    publishedAt,
    banner,
    bannerDescription,
    content,
    pageBuilder,
    _id,
    _type,
  } = pressRelease;

  const publishedLabel = formatPublishedDate(publishedAt);

  return (
    <div className="press-release-article-layout bg-white">
      <div className="container mx-auto w-full max-w-[1200px] px-6 pt-24 pb-14 md:pt-28 md:pb-20 lg:pt-32">
        <div className="max-w-4xl">
          <h1 className="hero-page-title text-[#0b143d]">{title}</h1>
          {publishedLabel ? (
            <p className="mt-4 text-sm text-[#0b143d]">{publishedLabel}</p>
          ) : null}
        </div>

        {banner?.id ? (
          <div className="mt-10 overflow-hidden rounded-[2px] bg-white">
            <SanityImage
              alt={banner.alt ?? title ?? ""}
              className="h-auto w-full object-contain"
              image={banner}
              loading="eager"
            />
          </div>
        ) : null}

        {bannerDescription?.trim() ? (
          <p className="mt-3 max-w-4xl text-sm italic leading-relaxed text-[#403f3f]">
            {bannerDescription.trim()}
          </p>
        ) : null}

        {Array.isArray(content) && content.length > 0 ? (
          <div className="mt-10 max-w-4xl">
            <RichText
              className="prose prose-lg max-w-none text-[#403f3f] prose-headings:text-[#0b143d] prose-a:text-[#0066FC] prose-a:no-underline hover:prose-a:underline"
              richText={content}
            />
          </div>
        ) : null}
      </div>

      {Array.isArray(pageBuilder) && pageBuilder.length > 0 ? (
        <PageBuilder id={_id} pageBuilder={pageBuilder} type={_type} />
      ) : null}
    </div>
  );
}

