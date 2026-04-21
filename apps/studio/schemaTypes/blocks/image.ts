import { ImageIcon } from "lucide-react";
import { defineField, defineType } from "sanity";
import { backgroundColorField, sectionIdField } from "@/schemaTypes/common";

export const imageBlock = defineType({
  name: "imageBlock",
  title: "Image",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().error("An image is required"),
    }),
    backgroundColorField,
    sectionIdField,
  ],
  preview: {
    select: {
      media: "image",
    },
    prepare: ({ media }) => ({
      title: "Image",
      subtitle: "Image Block",
      media,
    }),
  },
});
