import { Logger } from "@workspace/logger";
import { client } from "@workspace/sanity/client";
import { sanityFetch } from "@workspace/sanity/live";
import {
  queryPressReleasePaths,
  queryPressReleaseSlugPageData,
} from "@workspace/sanity/query";
import { notFound } from "next/navigation";

import { PressReleaseArticleLayout } from "@/components/press-release-article-layout";
import { getSEOMetadata } from "@/lib/seo";

const logger = new Logger("PressReleaseSlug");

async function fetchPressReleaseSlugPageData(slug: string) {
  return await sanityFetch({
    query: queryPressReleaseSlugPageData,
    params: { slug },
  });
}

async function fetchPressReleasePaths() {
  try {
    const slugs = await client.fetch(queryPressReleasePaths);

    if (!Array.isArray(slugs) || slugs.length === 0) {
      return [];
    }

    const paths: { slug: string }[] = [];
    for (const slug of slugs) {
      if (!slug) {
        continue;
      }
      const raw = String(slug);
      const segment = raw.includes("/")
        ? (raw.split("/").filter(Boolean).at(-1) ?? raw)
        : raw;
      if (segment) {
        paths.push({ slug: segment });
      }
    }
    return paths;
  } catch (error) {
    logger.error("Error fetching press release paths", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugString = `/press-releases/${slug}`;
  const { data } = await fetchPressReleaseSlugPageData(slug);
  return getSEOMetadata({
    title: data?.title ?? data?.seoTitle,
    description:
      (data && "bannerDescription" in data ? data.bannerDescription : null) ??
      data?.seoDescription,
    slug: slugString,
    contentId: data?._id,
    contentType: data?._type,
    pageType: "article",
  });
}

export async function generateStaticParams() {
  const paths = await fetchPressReleasePaths();
  return paths;
}

export const dynamicParams = true;

export default async function PressReleaseSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await fetchPressReleaseSlugPageData(slug);
  if (!data) {
    return notFound();
  }
  return (
    <main>
      <PressReleaseArticleLayout pressRelease={data} />
    </main>
  );
}

