import { BadgePercentIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { backgroundColorField, sectionIdField } from "@/schemaTypes/common";

export const cardStat = defineType({
  name: "cardStat",
  title: "Card Stat",
  type: "object",
  icon: BadgePercentIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Large text shown on the right side of the card.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Optional supporting text shown below the title.",
    }),
    defineField({
      name: "stat",
      title: "Stat",
      type: "string",
      description:
        "Open text shown as the large value on the left side (for example: 80%).",
    }),
    defineField({
      name: "textColor",
      title: "Text Color",
      type: "color",
      description: "Optional color for the card text content.",
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
      stat: "stat",
    },
    prepare: ({ title, stat }) => ({
      title: title || "Card Stat",
      subtitle: stat || "No stat value",
    }),
  },
});
