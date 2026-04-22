import { LayoutGridIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import {
  backgroundColorField,
  imageWithAltField,
  sectionIdField,
} from "@/schemaTypes/common";

export const whatWeDoCards = defineType({
  name: "whatWeDoCards",
  title: "What We Do Cards",
  type: "object",
  icon: LayoutGridIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "What We Do",
      description: "Main heading shown at the top of this section.",
      validation: (Rule) => Rule.required().error("A title is required"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Optional supporting text shown below the title.",
    }),
    defineField({
      name: "cards",
      title: "Left Column Cards",
      type: "array",
      description:
        "Add card items for the left side. Two cards are recommended to match the design.",
      validation: (Rule) =>
        Rule.required().min(1).max(2).error("Add 1 to 2 cards"),
      of: [
        defineArrayMember({
          type: "object",
          name: "card",
          fields: [
            defineField({
              name: "title",
              title: "Card Title",
              type: "string",
              description: "Short title displayed in blue.",
              validation: (Rule) =>
                Rule.required().error("A card title is required"),
            }),
            defineField({
              name: "description",
              title: "Card Description",
              type: "text",
              rows: 3,
              description: "Supporting text displayed below the card title.",
              validation: (Rule) =>
                Rule.required().error("A card description is required"),
            }),
            imageWithAltField({
              name: "accentImage",
              title: "Card Accent Image",
              description:
                "Optional small image shown at the bottom-left of the card.",
            }),
          ],
          preview: {
            select: {
              title: "title",
              media: "accentImage",
            },
            prepare: ({ title, media }) => ({
              title: title || "What We Do Card",
              media,
            }),
          },
        }),
      ],
    }),
    imageWithAltField({
      name: "featureImage",
      title: "Right Column Main Image",
      description: "Primary image shown at the top of the right card.",
      validation: (Rule) => Rule.required().error("A feature image is required"),
    }),
    defineField({
      name: "featureCaption",
      title: "Right Column Caption",
      type: "string",
      description: "Text shown below the right column main image.",
    }),
    imageWithAltField({
      name: "featureLogo",
      title: "Right Column Logo",
      description: "Optional logo shown below the right column caption.",
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
      title: title || "What We Do Cards",
      subtitle: `${Array.isArray(cards) ? cards.length : 0} card(s)`,
    }),
  },
});
