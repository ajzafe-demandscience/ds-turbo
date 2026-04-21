import { TagIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  description:
    "Reusable blog category similar to WordPress categories. Only blog posts reference this type.",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Category name shown in blog categorization",
      validation: (Rule) =>
        Rule.required().error("A category title is required"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Optional internal note describing when to use this category",
    }),
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
    },
    prepare: ({ title, description }) => ({
      title: title || "Untitled Category",
      subtitle: description || "Blog category",
    }),
  },
});
