import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { PlayIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { blogPostSlugField, pageBuilderField } from "@/schemaTypes/common";
import { GROUP, GROUPS } from "@/utils/constant";
import { ogFields } from "@/utils/og-fields";
import { seoFields } from "@/utils/seo-fields";

export const webinar = defineType({
  name: "webinar",
  title: "Webinars",
  type: "document",
  icon: PlayIcon,
  groups: GROUPS,
  orderings: [orderRankOrdering],
  description:
    "A webinar page for the website. Ordered in the Webinars list.",
  fields: [
    orderRankField({ type: "webinar" }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Main heading for this webinar page",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) =>
        Rule.required().error("A webinar title is required"),
    }),
    blogPostSlugField({
      group: GROUP.MAIN_CONTENT,
      description:
        "URL segment for this webinar (shown at /resources/{slug} on the site).",
    }),
    pageBuilderField,
    ...seoFields.filter((field) => field.name !== "seoHideFromLists"),
    ...ogFields,
  ],
  preview: {
    select: {
      title: "title",
      isHidden: "seoHideFromLists",
      slug: "slug.current",
      isPrivate: "seoNoIndex",
      media: "pageBuilder.0.image",
      blockCount: "pageBuilder",
    },
    prepare: ({ title, media, slug, isPrivate, isHidden, blockCount }) => {
      let visibility = "🌎 Public";
      if (isPrivate) {
        visibility = "🔒 Private";
      } else if (isHidden) {
        visibility = "🙈 Hidden";
      }

      const slugPath = slug ? `/resources/${slug}` : "no slug";
      const blocksInfo = blockCount?.length
        ? `🧱 ${blockCount.length} blocks`
        : "🏗️ No blocks";

      return {
        title: title || "Untitled Webinar",
        media,
        subtitle: `🔗 ${slugPath} | ${visibility} | ${blocksInfo}`,
      };
    },
  },
});

