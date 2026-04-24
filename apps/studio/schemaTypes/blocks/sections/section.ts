import { Rows3Icon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import { backgroundColorField, sectionIdField } from "@/schemaTypes/common";

const nestedBlockTypes = [
  "h1",
  "buttonLink",
  "imageBlock",
  "imageCard",
  "p",
  "pardotForm",
  "richTextBlock",
  "companyLogoCarousel",
  "howItWorksCards",
  "imageDescriptionCards",
  "speakers",
  "ctaWebinarForm",
  "whatYouCanRunCards",
  "whatWeDoCards",
  "statsCounter",
  "twoColumns",
  "sectionSplit",
  "titleIcon",
  "cardStat",
  "caseStudyStatsCard",
  "caseStudyStatsCards",
  "insightCard",
  "insightHeader",
  "newsletter",
] as const;

export const section = defineType({
  name: "section",
  title: "Section",
  type: "object",
  icon: Rows3Icon,
  description:
    "Heading area with optional eyebrow and text, plus nested content blocks below.",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description:
        "Short label above the title (for example a category or section name).",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Main heading for this section.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "Supporting text shown under the title.",
    }),
    defineField({
      name: "blocks",
      title: "Blocks",
      type: "array",
      description: "Content blocks that appear below the heading.",
      of: nestedBlockTypes.map((type) => defineArrayMember({ type })),
      options: { insertMenu: { views: [{ name: "grid" }] } },
    }),
    backgroundColorField,
    sectionIdField,
  ],
  preview: {
    select: {
      eyebrow: "eyebrow",
      title: "title",
      blocks: "blocks",
    },
    prepare: ({ eyebrow, title, blocks }) => ({
      title: title?.trim() || eyebrow?.trim() || "Section",
      subtitle: `${Array.isArray(blocks) ? blocks.length : 0} nested block(s)`,
    }),
  },
});
