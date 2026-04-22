import { HomeIcon } from "@sanity/icons";
import { defineType } from "sanity";

import { pageBuilderField } from "@/schemaTypes/common";
import { GROUPS } from "@/utils/constant";
import { ogFields } from "@/utils/og-fields";
import { seoFields } from "@/utils/seo-fields";

export const homePage = defineType({
  name: "homePage",
  type: "document",
  title: "Home Page",
  icon: HomeIcon,
  description:
    "This is where you build the main page visitors see when they first come to your website. Use page builder sections and SEO/Open Graph settings to control content and sharing metadata.",
  groups: GROUPS,
  fields: [
    pageBuilderField,
    ...seoFields.filter(
      (field) => !["seoNoIndex", "seoHideFromLists"].includes(field.name)
    ),
    ...ogFields,
  ],
  preview: {
    prepare: () => ({
      title: "Home Page",
      media: HomeIcon,
    }),
  },
});
