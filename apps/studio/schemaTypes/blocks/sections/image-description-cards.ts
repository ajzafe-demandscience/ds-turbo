import { LayoutGrid } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import {
  backgroundColorField,
  imageWithAltField,
  sectionIdField,
} from "@/schemaTypes/common";

export const imageDescriptionCards = defineType({
  name: "imageDescriptionCards",
  title: "Image + description cards",
  type: "object",
  icon: LayoutGrid,
  description:
    "A row of simple cards: each has an image and text. You choose how many cards per row on large screens.",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Optional heading above the card grid.",
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      description: "Optional short text shown under the title.",
    }),
    defineField({
      name: "columnsPerRow",
      title: "Cards per row (large screens)",
      type: "number",
      initialValue: 3,
      description:
        "How many cards appear in one row on large screens (about 1024px and wider). Narrow screens use one column; medium widths use two.",
      validation: (Rule) =>
        Rule.integer()
          .min(2)
          .max(6)
          .error("Enter a whole number from 2 to 6"),
    }),
    defineField({
      name: "items",
      title: "Cards",
      type: "array",
      description:
        "Each card needs an image and a description. An optional title can sit between the image and the text.",
      validation: (Rule) =>
        Rule.required().min(1).error("Add at least one card"),
      of: [
        defineArrayMember({
          type: "object",
          name: "imageDescriptionCardItem",
          fields: [
            imageWithAltField({
              name: "image",
              title: "Image",
              description: "Image or icon shown at the top of the card.",
              validation: (Rule) =>
                Rule.required().error("An image is required"),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              description:
                "Optional short heading shown below the image and above the description.",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 4,
              description: "Body text for this card.",
              validation: (Rule) =>
                Rule.required().error("A description is required"),
            }),
          ],
          preview: {
            select: {
              title: "title",
              description: "description",
              media: "image",
            },
            prepare: ({ title: itemTitle, description, media }) => {
              const trimmedTitle = itemTitle?.trim() ?? "";
              const trimmed = description?.trim() ?? "";
              const short =
                trimmed.length > 60 ? `${trimmed.slice(0, 60)}…` : trimmed;
              return {
                title: trimmedTitle || short || "Card",
                subtitle: trimmedTitle ? short || undefined : undefined,
                media,
              };
            },
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
      title: title?.trim() || "Image + description cards",
      subtitle: `${Array.isArray(items) ? items.length : 0} card(s)`,
    }),
  },
});
