import { LayoutGridIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import { backgroundColorField, sectionIdField } from "@/schemaTypes/common";

export const caseStudyStatsCards = defineType({
  name: "caseStudyStatsCards",
  title: "Case Study Stats Cards",
  type: "object",
  icon: LayoutGridIcon,
  description:
    "A dark container with a row of stat cards and an optional supporting line under the cards.",
  fields: [
    defineField({
      name: "cards",
      title: "Cards",
      type: "array",
      description:
        "Add 2–4 cards. Each card includes a name, a value, and a description.",
      validation: (Rule) =>
        Rule.required().min(2).max(4).error("Add 2 to 4 cards"),
      of: [
        defineArrayMember({
          type: "object",
          name: "card",
          fields: [
            defineField({
              name: "name",
              title: "Card name",
              type: "string",
              description: "Short label shown above the description.",
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              description: 'Large stat value (for example: "26%" or "$0").',
              validation: (Rule) => Rule.required().error("Value is required"),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 4,
              description: "Supporting copy for this stat card.",
              validation: (Rule) =>
                Rule.required().error("Description is required"),
            }),
          ],
          preview: {
            select: {
              title: "value",
              subtitle: "name",
            },
            prepare: ({ title, subtitle }) => ({
              title: title || "Stat card",
              subtitle: subtitle || "No name",
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "footerText",
      title: "Footer text",
      type: "string",
      description:
        "Optional single sentence shown under the stat cards inside the container.",
    }),
    defineField({
      name: "containerBackgroundColor",
      title: "Container background color",
      type: "color",
      description: "Background color for the outer container.",
      options: {
        disableAlpha: false,
      },
    }),
    defineField({
      name: "cardBackgroundColor",
      title: "Card background color",
      type: "color",
      description: "Background color used for each card.",
      options: {
        disableAlpha: false,
      },
    }),
    defineField({
      name: "textColor",
      title: "Text color",
      type: "color",
      description: "Text color used inside the container and cards.",
      options: {
        disableAlpha: false,
      },
    }),
    backgroundColorField,
    sectionIdField,
  ],
  preview: {
    select: {
      cards: "cards",
      footerText: "footerText",
    },
    prepare: ({ cards, footerText }) => ({
      title: "Case Study Stats Cards",
      subtitle: `${Array.isArray(cards) ? cards.length : 0} card(s)${
        footerText?.trim() ? " · footer text" : ""
      }`,
    }),
  },
});

