import { RocketIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import {
  backgroundColorField,
  imageWithAltField,
  sectionIdField,
} from "@/schemaTypes/common";

export const whatYouCanRunCards = defineType({
  name: "whatYouCanRunCards",
  title: "What You Can Run Cards",
  type: "object",
  icon: RocketIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "What You Can Run With Us",
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
      description: "Add one or more cards with icon, title, and description.",
      validation: (Rule) =>
        Rule.required().min(1).error("Add at least one card item"),
      of: [
        defineArrayMember({
          type: "object",
          name: "item",
          fields: [
            imageWithAltField({
              name: "image",
              title: "Icon Image",
              description: "Small icon or illustration shown at the top.",
              validation: (Rule) =>
                Rule.required().error("An icon image is required"),
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
              description: "Supporting text shown below the title.",
            }),
          ],
          preview: {
            select: {
              title: "title",
              media: "image",
            },
            prepare: ({ title, media }) => ({
              title: title || "What You Can Run Item",
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
      title: title || "What You Can Run Cards",
      subtitle: `${Array.isArray(itemsCount) ? itemsCount.length : 0} item(s)`,
    }),
  },
});
