import { Users } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import {
  backgroundColorField,
  imageWithAltField,
  sectionIdField,
} from "@/schemaTypes/common";

export const speakers = defineType({
  name: "speakers",
  title: "Speakers",
  type: "object",
  icon: Users,
  description:
    "A speakers section with a heading and a list of speaker profiles.",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: "Short label above the title (for example: YOUR SPEAKERS).",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Main heading for this section.",
      validation: (Rule) => Rule.required().error("A title is required"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "Supporting text shown under the title.",
    }),
    defineField({
      name: "partnersLabel",
      title: "Partners label",
      type: "string",
      initialValue: "Partners:",
      description: "Short label shown before the partner list.",
    }),
    defineField({
      name: "partners",
      title: "Partners",
      type: "array",
      description:
        "Optional list of partner names (you can include notes like “(Host)”).",
      of: [
        defineArrayMember({
          type: "string",
          name: "partner",
        }),
      ],
    }),
    defineField({
      name: "speakers",
      title: "Speakers",
      type: "array",
      description: "Add one or more speaker profiles.",
      validation: (Rule) =>
        Rule.required().min(1).error("Add at least one speaker"),
      of: [
        defineArrayMember({
          type: "object",
          name: "speaker",
          fields: [
            imageWithAltField({
              name: "photo",
              title: "Photo",
              description:
                "Optional speaker photo. If omitted, the website shows a neutral placeholder.",
            }),
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              description: "Speaker’s full name.",
              validation: (Rule) => Rule.required().error("Name is required"),
            }),
            defineField({
              name: "role",
              title: "Role",
              type: "string",
              description: "For example: CEO, DemandScience.",
            }),
            defineField({
              name: "company",
              title: "Company",
              type: "string",
              description: "Optional company name if you want it separate.",
            }),
            defineField({
              name: "bio",
              title: "Bio",
              type: "text",
              rows: 6,
              description: "Optional speaker bio paragraph(s).",
            }),
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "role",
              media: "photo",
            },
            prepare: ({ title, subtitle, media }) => ({
              title: title || "Speaker",
              subtitle: subtitle || "",
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
      speakers: "speakers",
    },
    prepare: ({ title, speakers }) => ({
      title: title || "Speakers",
      subtitle: `${Array.isArray(speakers) ? speakers.length : 0} speaker(s)`,
    }),
  },
});

