import { BadgePercentIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { backgroundColorField, sectionIdField } from "@/schemaTypes/common";

export const insightCard = defineType({
  name: "insightCard",
  title: "Insight Card",
  type: "object",
  icon: BadgePercentIcon,
  fields: [
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      description: 'Main value shown prominently (for example: "87%").',
      validation: (Rule) => Rule.required().error("A value is required"),
    }),
    defineField({
      name: "valueTextColor",
      title: "Value Text Color",
      type: "color",
      description: "Optional color for the value text.",
      options: {
        disableAlpha: false,
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Supporting text shown under the value.",
    }),
    backgroundColorField,
    sectionIdField,
  ],
  preview: {
    select: {
      value: "value",
      description: "description",
    },
    prepare: ({ value, description }) => ({
      title: value || "Insight Card",
      subtitle: description || "No description",
    }),
  },
});

