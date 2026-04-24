import { Columns2Icon } from "lucide-react";
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
  "titleIcon",
  "cardStat",
  "caseStudyStatsCard",
  "caseStudyStatsCards",
  "insightCard",
  "insightHeader",
  "newsletter",
] as const;

export const sectionSplit = defineType({
  name: "sectionSplit",
  title: "Section Split",
  type: "object",
  icon: Columns2Icon,
  description:
    "Section heading area with two columns of nested content blocks underneath.",
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
      name: "leftColumn",
      title: "Left Column",
      type: "array",
      description: "Blocks shown in the left column.",
      of: nestedBlockTypes.map((type) => defineArrayMember({ type })),
      options: { insertMenu: { views: [{ name: "grid" }] } },
    }),
    defineField({
      name: "rightColumn",
      title: "Right Column",
      type: "array",
      description: "Blocks shown in the right column.",
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
      leftColumn: "leftColumn",
      rightColumn: "rightColumn",
    },
    prepare: ({ eyebrow, title, leftColumn, rightColumn }) => ({
      title: title?.trim() || eyebrow?.trim() || "Section Split",
      subtitle: `Left: ${leftColumn?.length ?? 0} • Right: ${rightColumn?.length ?? 0}`,
    }),
  },
});

