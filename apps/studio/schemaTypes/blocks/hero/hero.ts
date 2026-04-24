import { Star } from "lucide-react";
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
] as const;

export const hero = defineType({
  name: "hero",
  title: "Hero",
  icon: Star,
  type: "object",
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
      title: "Hero",
      subtitle: `Left: ${leftCount?.length ?? 0} • Right: ${rightCount?.length ?? 0}`,
    }),
  },
});
