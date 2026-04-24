import { Columns2Icon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { backgroundColorField, sectionIdField } from "@/schemaTypes/common";

const nestedBlockTypes = [
  "hero",
  "h1",
  "buttonLink",
  "cardStat",
  "caseStudyStatsCard",
  "caseStudyStatsCards",
  "insightCard",
  "insightHeader",
  "imageDescriptionCards",
  "speakers",
  "ctaWebinarForm",
  "imageBlock",
  "imageCard",
  "p",
  "pardotForm",
  "companyLogoCarousel",
  "titleIcon",
  "richTextBlock",
] as const;

export const twoColumns = defineType({
  name: "twoColumns",
  title: "Split Content",
  type: "object",
  icon: Columns2Icon,
  description:
    "Two-column container where each column can include other page builder components.",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Section title shown above the split content columns.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Optional description shown below the title.",
    }),
    defineField({
      name: "leftColumn",
      title: "Left Column",
      type: "array",
      of: nestedBlockTypes.map((type) => defineArrayMember({ type })),
      options: { insertMenu: { views: [{ name: "grid" }] } },
    }),
    defineField({
      name: "rightColumn",
      title: "Right Column",
      type: "array",
      of: nestedBlockTypes.map((type) => defineArrayMember({ type })),
      options: { insertMenu: { views: [{ name: "grid" }] } },
    }),
    defineField({
      name: "leftColumnBackgroundColor",
      title: "Left Column Background Color",
      type: "color",
      description: "Optional background color for the left column.",
      options: {
        disableAlpha: false,
      },
    }),
    defineField({
      name: "rightColumnBackgroundColor",
      title: "Right Column Background Color",
      type: "color",
      description: "Optional background color for the right column.",
      options: {
        disableAlpha: false,
      },
    }),
    backgroundColorField,
    sectionIdField,
  ],
  preview: {
    select: {
      title: "title",
      leftCount: "leftColumn",
      rightCount: "rightColumn",
    },
    prepare: ({ title, leftCount, rightCount }) => ({
      title: title || "Split Content",
      subtitle: `Left: ${leftCount?.length ?? 0} • Right: ${rightCount?.length ?? 0}`,
    }),
  },
});
