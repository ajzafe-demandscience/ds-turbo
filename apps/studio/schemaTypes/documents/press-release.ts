import { NewspaperIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import {
  blogPostSlugField,
  imageWithAltField,
  pageBuilderField,
} from "@/schemaTypes/common";
import { GROUP, GROUPS } from "@/utils/constant";
import { ogFields } from "@/utils/og-fields";
import { seoFields } from "@/utils/seo-fields";

export const pressRelease = defineType({
  name: "pressRelease",
  title: "Press Release",
  type: "document",
  icon: NewspaperIcon,
  groups: GROUPS,
  description: "A press release page for publishing announcements and updates.",
  fields: [
    defineField({
      name: "publishedAt",
      type: "datetime",
      title: "Published date",
      description: "Date shown beneath the title on the page.",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) =>
        Rule.required().error("A published date is required"),
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Main heading for this press release",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) =>
        Rule.required().error("A press release title is required"),
    }),
    blogPostSlugField({
      group: GROUP.MAIN_CONTENT,
      description:
        "URL segment for this press release (used on the site routing).",
    }),
    imageWithAltField({
      name: "banner",
      title: "Banner",
      description:
        "Hero/banner image used at the top of the press release page (include alt text).",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("A banner image is required"),
    }),
    defineField({
      name: "bannerDescription",
      type: "text",
      title: "Banner Description",
      description: "Short supporting text displayed near the banner area",
      rows: 3,
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) =>
        Rule.required().error("A banner description is required"),
    }),
    defineField({
      name: "content",
      type: "richText",
      title: "Content",
      description: "Main WYSIWYG body content for this press release",
      group: GROUP.MAIN_CONTENT,
    }),
    pageBuilderField,
    ...seoFields.filter((field) => field.name !== "seoHideFromLists"),
    ...ogFields,
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      media: "banner",
      publishedAt: "publishedAt",
    },
    prepare: ({ title, slug, media, publishedAt }) => {
      const dateLabel = publishedAt ? `📅 ${publishedAt}` : "📅 no date";
      return {
        title: title || "Untitled Press Release",
        subtitle: `🔗 ${slug || "no-slug"} | ${dateLabel}`,
        media,
      };
    },
  },
});

