import { Columns2Icon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { backgroundColorField, sectionIdField } from "@/schemaTypes/common";

const nestedBlockTypes = [
  "hero",
  "h1",
  "buttonLink",
  "imageBlock",
  "p",
  "pardotForm",
  "cta",
  "featureCardsIcon",
  "faqAccordion",
  "imageLinkCards",
  "richTextBlock",
  "subscribeNewsletter",
] as const;

export const twoColumns = defineType({
  name: "twoColumns",
  title: "Two Columns",
  type: "object",
  icon: Columns2Icon,
  description:
    "Two-column container where each column can include other page builder components.",
  fields: [
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
    backgroundColorField,
    sectionIdField,
  ],
  preview: {
    select: {
      leftCount: "leftColumn",
      rightCount: "rightColumn",
    },
    prepare: ({ leftCount, rightCount }) => ({
      title: "Two Columns",
      subtitle: `Left: ${leftCount?.length ?? 0} • Right: ${rightCount?.length ?? 0}`,
    }),
  },
});
