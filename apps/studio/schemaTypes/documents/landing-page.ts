import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { LayoutTemplateIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import {
  blogPostSlugField,
  pageBuilderField,
} from "@/schemaTypes/common";
import { GROUP, GROUPS } from "@/utils/constant";
import { ogFields } from "@/utils/og-fields";
import { seoFields } from "@/utils/seo-fields";

export const landingPage = defineType({
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  icon: LayoutTemplateIcon,
  groups: GROUPS,
  orderings: [orderRankOrdering],
  description:
    "A conversion-focused standalone page (campaign or product landing page). Ordered in the Landing Pages list.",
  fields: [
    orderRankField({ type: "landingPage" }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Main heading for this landing page",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) =>
        Rule.required().error("A landing page title is required"),
    }),
    blogPostSlugField({
      group: GROUP.MAIN_CONTENT,
      description:
        "URL segment for this landing page (shown at /demand/{slug} on the site).",
    }),
    pageBuilderField,
    ...seoFields.filter((field) => field.name !== "seoHideFromLists"),
    ...ogFields,
  ],
  preview: {
    select: {
      title: "title",
      media: "pageBuilder.0.image",
      isHidden: "seoHideFromLists",
      slug: "slug.current",
      isPrivate: "seoNoIndex",
      blockCount: "pageBuilder",
    },
    prepare: ({ title, media, slug, isPrivate, isHidden, blockCount }) => {
      let visibility = "🌎 Public";
      if (isPrivate) {
        visibility = "🔒 Private";
      } else if (isHidden) {
        visibility = "🙈 Hidden";
      }

      const blocksInfo = blockCount?.length
        ? `🧱 ${blockCount.length} blocks`
        : "🏗️ No blocks";
      const slugPath = slug ? `/demand/${slug}` : "no slug";

      return {
        title: title || "Untitled Landing Page",
        media,
        subtitle: `🔗 ${slugPath} | ${visibility} | ${blocksInfo}`,
      };
    },
  },
});
