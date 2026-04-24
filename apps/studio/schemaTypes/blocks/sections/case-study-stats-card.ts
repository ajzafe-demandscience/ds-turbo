import { BadgePercentIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import {
  backgroundColorField,
  iconField,
  sectionIdField,
} from "@/schemaTypes/common";

export const caseStudyStatsCard = defineType({
  name: "caseStudyStatsCard",
  title: "Case Study Stats Card",
  type: "object",
  icon: BadgePercentIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Main heading shown at the top of the card.",
    }),
    iconField,
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Optional supporting text under the heading.",
    }),
    defineField({
      name: "textColor",
      title: "Text Color",
      type: "color",
      description: "Optional color for heading and body text.",
      options: {
        disableAlpha: false,
      },
    }),
    defineField({
      name: "cards",
      title: "Card Stat Items",
      type: "array",
      description: "Add one or more stat rows.",
      validation: (Rule) =>
        Rule.required().min(1).error("Add at least one stat item"),
      of: [
        defineArrayMember({
          type: "object",
          name: "card",
          fields: [
            defineField({
              name: "stat",
              title: "Stat",
              type: "string",
              description: "Open text stat value, for example: 80% or 2.5x.",
              validation: (Rule) => Rule.required().error("A stat value is required"),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              description: "Main text shown to the right of the stat.",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
              description: "Optional secondary line for this stat item.",
            }),
            defineField({
              name: "textColor",
              title: "Text Color",
              type: "color",
              description: "Optional color for this stat row text.",
              options: {
                disableAlpha: false,
              },
            }),
            defineField({
              name: "backgroundColor",
              title: "Background Color",
              type: "color",
              description: "Optional background color for this stat row.",
              options: {
                disableAlpha: false,
              },
            }),
          ],
          preview: {
            select: {
              stat: "stat",
              title: "title",
            },
            prepare: ({ stat, title }) => ({
              title: stat || "Stat",
              subtitle: title || "Card stat item",
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
      cards: "cards",
    },
    prepare: ({ title, cards }) => ({
      title: title || "Case Study Stats Card",
      subtitle: `${Array.isArray(cards) ? cards.length : 0} stat item(s)`,
    }),
  },
});
