import { Heading1Icon } from "lucide-react";
import { defineField, defineType } from "sanity";
import { backgroundColorField, sectionIdField } from "@/schemaTypes/common";

export const h1 = defineType({
  name: "h1",
  title: "H1",
  type: "object",
  icon: Heading1Icon,
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "string",
      description: "Main H1 heading text",
      validation: (Rule) => Rule.required().error("H1 text is required"),
    }),
    backgroundColorField,
    sectionIdField,
  ],
  preview: {
    select: {
      title: "text",
    },
    prepare: ({ title }) => ({
      title: title || "Untitled H1",
      subtitle: "H1 Block",
    }),
  },
});
