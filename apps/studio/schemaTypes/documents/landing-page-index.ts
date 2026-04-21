import { defineField, defineType } from "sanity";

import { documentSlugField, pageBuilderField } from "@/schemaTypes/common";
import { GROUP, GROUPS } from "@/utils/constant";
import { ogFields } from "@/utils/og-fields";
import { seoFields } from "@/utils/seo-fields";

export const landingPageIndex = defineType({
  name: "landingPageIndex",
  type: "document",
  title: "Landing Pages Listing Page",
  description:
    "Main listing page for landing pages with optional featured items and page-builder content.",
  groups: GROUPS,
  fields: [
    defineField({
      name: "title",
      type: "string",
      description:
        "Main heading displayed at the top of the landing pages listing",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "description",
      type: "text",
      description:
        "Short summary shown on the landing pages listing to explain what visitors can find.",
      group: GROUP.MAIN_CONTENT,
    }),
    documentSlugField("page", {
      group: GROUP.MAIN_CONTENT,
      title: "Slug",
    }),
    defineField({
      name: "displayFeaturedLandingPages",
      title: "Display Featured Landing Pages",
      description:
        "When enabled, this will take top items from the ordered list and feature them first.",
      type: "string",
      options: {
        list: [
          { title: "Yes", value: "yes" },
          { title: "No", value: "no" },
        ],
        layout: "radio",
      },
      initialValue: "yes",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "featuredLandingPagesCount",
      title: "Number of Featured Landing Pages",
      description: "Select number of landing pages to display as featured.",
      type: "string",
      options: {
        list: [
          { title: "1", value: "1" },
          { title: "2", value: "2" },
          { title: "3", value: "3" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "1",
      hidden: ({ parent }) => parent?.displayFeaturedLandingPages !== "yes",
      group: GROUP.MAIN_CONTENT,
    }),
    pageBuilderField,
    ...seoFields.filter(
      (field) => !["seoNoIndex", "seoHideFromLists"].includes(field.name)
    ),
    ...ogFields,
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      isPrivate: "seoNoIndex",
      isHidden: "seoHideFromLists",
      featuredCount: "featuredLandingPagesCount",
    },
    prepare: ({ title, slug, isPrivate, isHidden, featuredCount }) => {
      let visibility = "🌎 Public";
      if (isPrivate) {
        visibility = "🔒 Private";
      } else if (isHidden) {
        visibility = "🙈 Hidden";
      }

      const featuredInfo = featuredCount
        ? `⭐ Featured: ${featuredCount}`
        : "⭐ Featured: 0";
      const slugPath = slug || "no-slug";

      return {
        title: title || "Untitled Landing Page Index",
        subtitle: `🔗 ${slugPath} | ${visibility} | ${featuredInfo}`,
      };
    },
  },
});
