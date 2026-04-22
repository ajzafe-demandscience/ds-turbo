import { BlocksIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import {
  backgroundColorField,
  imageWithAltField,
  sectionIdField,
} from "@/schemaTypes/common";

export const howItWorksCards = defineType({
  name: "howItWorksCards",
  title: "How It Works Cards",
  type: "object",
  icon: BlocksIcon,
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
      name: "items",
      title: "Items",
      type: "array",
      description:
        "Add one or more cards with an image, title, and supporting description.",
      validation: (Rule) =>
        Rule.required().min(1).error("Add at least one card item"),
      of: [
        defineArrayMember({
          type: "object",
          name: "item",
          fields: [
            imageWithAltField({
              name: "image",
              title: "Image",
              description: "Image shown at the top of this card.",
              validation: (Rule) =>
                Rule.required().error("An image is required"),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              description: "Short card title.",
              validation: (Rule) =>
                Rule.required().error("A title is required"),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              description: "Short supporting text for this card.",
            }),
          ],
          preview: {
            select: {
              title: "title",
              media: "image",
            },
            prepare: ({ title, media }) => ({
              title: title || "How It Works Item",
              media,
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
      itemsCount: "items",
    },
    prepare: ({ title, itemsCount }) => ({
      title: title || "How It Works Cards",
      subtitle: `${Array.isArray(itemsCount) ? itemsCount.length : 0} item(s)`,
    }),
  },
});
