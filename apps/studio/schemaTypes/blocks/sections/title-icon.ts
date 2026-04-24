import { BookTextIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { backgroundColorField, iconField, sectionIdField } from "@/schemaTypes/common";

export const titleIcon = defineType({
  name: "titleIcon",
  title: "Title Icon",
  type: "object",
  icon: BookTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Heading text shown next to the icon.",
      validation: (Rule) => Rule.required().error("A title is required"),
    }),
    iconField,
    defineField({
      name: "textColor",
      title: "Text Color",
      type: "color",
      description: "Optional color for the title and icon text.",
      options: {
        disableAlpha: false,
      },
    }),
    backgroundColorField,
    sectionIdField,
  ],
  preview: {
    select: {
      title: "title",
      icon: "icon",
    },
    prepare: ({ title, icon }) => ({
      title: title || "Title Icon",
      subtitle: icon || "No icon selected",
    }),
  },
});
