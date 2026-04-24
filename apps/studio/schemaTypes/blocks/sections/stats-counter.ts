import { ChartNoAxesCombinedIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import { backgroundColorField, sectionIdField } from "@/schemaTypes/common";

export const statsCounter = defineType({
  name: "statsCounter",
  title: "Stats Counter",
  type: "object",
  icon: ChartNoAxesCombinedIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Main heading shown at the top of this section.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Optional supporting text shown below the title.",
    }),
    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "text",
      rows: 2,
      description: "Optional text shown below the stats grid.",
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      description:
        "Add one or more statistic items. Values animate from 0 when this section becomes visible on screen.",
      validation: (Rule) =>
        Rule.required().min(1).error("Add at least one statistic item"),
      of: [
        defineArrayMember({
          type: "object",
          name: "item",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "number",
              description: "Final numeric value to animate to (for example: 417).",
              validation: (Rule) =>
                Rule.required()
                  .min(0)
                  .error("A value of 0 or greater is required"),
            }),
            defineField({
              name: "prefix",
              title: "Prefix",
              type: "string",
              description:
                "Optional text shown before the value (for example: $).",
            }),
            defineField({
              name: "suffix",
              title: "Suffix",
              type: "string",
              description:
                "Optional text shown after the value (for example: % or +).",
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "Short line shown below the value.",
              validation: (Rule) =>
                Rule.required().error("A label is required"),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
              description: "Optional supporting line for this statistic.",
            }),
          ],
          preview: {
            select: {
              value: "value",
              label: "label",
              prefix: "prefix",
              suffix: "suffix",
            },
            prepare: ({ value, label, prefix, suffix }) => ({
              title:
                typeof value === "number"
                  ? `${prefix ?? ""}${value}${suffix ?? ""}`
                  : "Stat Item",
              subtitle: label || "Stat label",
            }),
          },
        }),
      ],
    }),
    backgroundColorField,
    sectionIdField,
  ],
  preview: {
    select: {
      title: "title",
      items: "items",
    },
    prepare: ({ title, items }) => ({
      title: title || "Stats Counter",
      subtitle: `${Array.isArray(items) ? items.length : 0} item(s)`,
    }),
  },
});
