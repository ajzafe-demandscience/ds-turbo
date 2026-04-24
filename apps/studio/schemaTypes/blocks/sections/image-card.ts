import { ImageIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import {
  backgroundColorField,
  imageWithAltField,
  sectionIdField,
} from "@/schemaTypes/common";

export const imageCard = defineType({
  name: "imageCard",
  title: "Card Image",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Primary heading shown in the card content.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Optional supporting text shown below the title.",
    }),
    imageWithAltField({
      name: "image",
      title: "Image",
      description: "Main card image with optional hotspot and alt text.",
      validation: (Rule) => Rule.required().error("An image is required"),
    }),
    defineField({
      name: "variant",
      title: "Image Position",
      type: "string",
      description: "Choose where the image appears relative to card content.",
      initialValue: "top",
      options: {
        list: [
          { title: "Top", value: "top" },
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "blockPosition",
      title: "Block Position",
      type: "string",
      description: "Choose how the card is aligned inside the section.",
      initialValue: "center",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "imageSize",
      title: "Image Size (px)",
      type: "number",
      description:
        "Optional image width in pixels. Leave empty to use the image original size.",
      validation: (Rule) =>
        Rule.min(1).warning("Image size should be greater than 0"),
    }),
    defineField({
      name: "url",
      title: "Link URL",
      type: "customUrlOptional",
      description:
        "Optional link destination. If provided, the whole card becomes clickable.",
    }),
    backgroundColorField,
    sectionIdField,
  ],
  preview: {
    select: {
      title: "title",
      variant: "variant",
      blockPosition: "blockPosition",
      media: "image",
    },
    prepare: ({ title, variant, blockPosition, media }) => ({
      title: title || "Card Image",
      subtitle: `Image ${variant || "top"} • Block ${blockPosition || "center"}`,
      media,
    }),
  },
});
