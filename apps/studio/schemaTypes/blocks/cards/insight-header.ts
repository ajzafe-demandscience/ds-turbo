import { Lightbulb } from "lucide-react";
import { defineField, defineType } from "sanity";

import { backgroundColorField, sectionIdField } from "@/schemaTypes/common";

export const insightHeader = defineType({
  name: "insightHeader",
  title: "Insight Header",
  type: "object",
  icon: Lightbulb,
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "string",
      description:
        "Short line shown in the gray callout bar (for example an insight or section intro).",
      validation: (Rule) => Rule.required().error("Text is required"),
    }),
    defineField({
      name: "barBackgroundColor",
      title: "Bar background color",
      type: "color",
      description:
        "Background of the rounded bar. Leave empty for the default light gray.",
      options: {
        disableAlpha: false,
      },
    }),
    defineField({
      name: "barTextColor",
      title: "Bar text color",
      type: "color",
      description: "Color of the text inside the bar. Leave empty for the default dark gray.",
      options: {
        disableAlpha: false,
      },
    }),
    backgroundColorField,
    sectionIdField,
  ],
  preview: {
    select: {
      text: "text",
    },
    prepare: ({ text }) => ({
      title: text?.trim() || "Insight Header",
      subtitle: "Callout bar",
    }),
  },
});
