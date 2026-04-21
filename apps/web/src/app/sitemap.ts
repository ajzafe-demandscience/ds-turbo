import { client } from "@workspace/sanity/client";
import { querySitemapData } from "@workspace/sanity/query";
import type { QuerySitemapDataResult } from "@workspace/sanity/types";
import type { MetadataRoute } from "next";

import { getBaseUrl } from "@/utils";

type Page = QuerySitemapDataResult["slugPages"][number];
type BlogIndexPage = QuerySitemapDataResult["blogIndexPages"][number];
type BlogPostPage = QuerySitemapDataResult["blogPages"][number];

const baseUrl = getBaseUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { slugPages, blogIndexPages, blogPages } =
    await client.fetch(querySitemapData);
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...slugPages.map((page: Page) => ({
      url: `${baseUrl}${page.slug}`,
      lastModified: new Date(page.lastModified ?? new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...blogIndexPages
      .filter((page: BlogIndexPage): page is BlogIndexPage & { slug: string } =>
        Boolean(page.slug)
      )
      .map((page) => ({
        url: `${baseUrl}${page.slug}`,
        lastModified: new Date(page.lastModified ?? new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      })),
    ...blogPages
      .filter((page: BlogPostPage): page is BlogPostPage & { slug: string } =>
        Boolean(page.slug)
      )
      .map((page) => ({
        url: `${baseUrl}${page.slug}`,
        lastModified: new Date(page.lastModified ?? new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.5,
      })),
  ];
}
