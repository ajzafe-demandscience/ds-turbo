import type { QueryBlogSlugPageDataResult } from "@workspace/sanity/types";
import Link from "next/link";

import { RichText } from "@/components/elements/rich-text";
import { SanityImage } from "@/components/elements/sanity-image";
import { TableOfContent } from "@/components/elements/table-of-content";

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

function estimateReadTime(richText: unknown[] | null | undefined): number {
  if (!richText?.length) return 0;
  let wordCount = 0;
  for (const block of richText) {
    if (
      typeof block !== "object" ||
      block === null ||
      !("_type" in block) ||
      (block as Record<string, unknown>)._type !== "block"
    )
      continue;
    const children = (block as Record<string, unknown>).children;
    if (!Array.isArray(children)) continue;
    for (const child of children) {
      if (typeof child === "object" && child !== null && "text" in child) {
        const text = String((child as Record<string, unknown>).text ?? "");
        wordCount += text.split(/\s+/).filter(Boolean).length;
      }
    }
  }
  return Math.max(1, Math.ceil(wordCount / 250));
}

type BlogArticleLayoutProps = {
  article: NonNullable<QueryBlogSlugPageDataResult>;
};

export function BlogArticleLayout({ article }: BlogArticleLayoutProps) {
  const {
    title,
    description,
    image,
    richText,
    authors,
    publishedAt,
    sectionLabel,
  } = article;

  const dateLine = formatPublishedDate(publishedAt);
  const authorName = authors?.name;
  const trimmedSection = sectionLabel?.trim();
  const eyebrowText = trimmedSection ?? "Blog";
  const eyebrowIsBlogLink = !trimmedSection;
  const readTime = estimateReadTime(richText);

  return (
    <>
      <section className="article-hero-surface">
        <div className="container mx-auto w-full max-w-[1200px] px-4 pt-10 pb-12 md:px-6 md:pt-14 md:pb-16 lg:pt-16 lg:pb-20">
          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-10">
            <div className="text-white">
              <div className="mb-6 inline-flex">
                {eyebrowIsBlogLink ? (
                  <Link
                    className="article-hero-eyebrow"
                    href="/resources/blog"
                    prefetch={false}
                  >
                    {eyebrowText}
                  </Link>
                ) : (
                  <span className="article-hero-eyebrow">{eyebrowText}</span>
                )}
              </div>

              <h1 className="max-w-3xl text-balance text-[50px] font-bold leading-[1.08] tracking-tight text-white">
                {title}
              </h1>

              {(authorName ?? dateLine) ? (
                <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-base text-white/80">
                  {authors?.image?.id ? (
                    <SanityImage
                      alt={authors.image.alt ?? authorName ?? "Author"}
                      className="size-[32px] shrink-0 !m-0 !rounded-[25px] object-cover object-center"
                      height={32}
                      image={authors.image}
                      width={32}
                    />
                  ) : null}
                  {authorName ? (
                    <span className="font-semibold text-white">{authorName}</span>
                  ) : null}
                  {authorName && dateLine ? (
                    <span aria-hidden className="text-white/45">
                      •
                    </span>
                  ) : null}
                  {dateLine ? (
                    <time dateTime={publishedAt ?? undefined}>{dateLine}</time>
                  ) : null}
                  {readTime > 0 && (
                    <>
                      <span aria-hidden className="text-white/45">
                        •
                      </span>
                      <span>
                        {readTime} {readTime === 1 ? "minute" : "minutes"} read
                      </span>
                    </>
                  )}
                </div>
              ) : null}
            </div>

            {image?.id ? (
              <div className="article-hero-image-shell justify-self-start md:justify-self-end">
                <SanityImage
                  alt={title ?? ""}
                  className="h-full w-full object-cover"
                  image={image}
                  loading="eager"
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <div className="border-b bg-white dark:bg-background">
        <div className="container mx-auto max-w-[1200px] px-4 py-14 md:px-6 md:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,65%)_minmax(0,35%)] lg:gap-12">
            <article className="min-w-0">
              {description ? (
                <p className="mb-10 max-w-3xl text-balance text-[1.2rem] italic leading-relaxed text-[var(--article-ink-muted)] md:text-[1.35rem]">
                  {description}
                </p>
              ) : null}
              <RichText
                className="article-body-prose prose prose-lg max-w-none text-slate-700 dark:prose-invert prose-headings:font-semibold prose-headings:text-[var(--article-ink)] prose-h2:border-[color:rgb(11_20_61_/_0.12)] prose-h2:text-[1.95rem] prose-h3:text-[1.45rem] prose-a:text-[var(--article-accent)] prose-a:no-underline hover:prose-a:underline prose-strong:text-[var(--article-ink)] dark:prose-headings:text-foreground"
                richText={richText}
              />
            </article>
            <div className="hidden lg:block">
              <div className="scrollbar-thin sticky top-20 max-h-[calc(100vh-5.25rem)] overflow-y-auto p-4">
                <h2 className="mb-4 toc-title font-semibold tracking-tight">
                  Chapters
                </h2>
                <TableOfContent
                  collapsible={false}
                  richText={richText ?? []}
                  title="Chapters"
                  showTitle={false}
                  variant="article"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
