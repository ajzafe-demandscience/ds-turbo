import { Star } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import { backgroundColorField, sectionIdField } from "@/schemaTypes/common";
import { customRichText } from "@/schemaTypes/definitions/rich-text";
import { createRadioListLayout } from "@/utils/helper";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  icon: Star,
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description:
        "Short line above the headline (for example a category or label).",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Main headline for this hero.",
      validation: (Rule) => Rule.required().error("Title is required"),
    }),
    customRichText(["block", "image"], {
      name: "description",
      title: "Description",
      description:
        "Supporting text with formatting, links, and lists as needed.",
    }),
    defineField({
      name: "buttons",
      title: "Button links",
      type: "array",
      description: "Optional calls-to-action shown below the description.",
      of: [defineArrayMember({ type: "buttonLink" })],
    }),
    defineField({
      name: "mediaType",
      title: "Image or Pardot form",
      type: "string",
      description:
        "Show a hero image, or embed a Pardot form using its public form URL.",
      initialValue: "image",
      options: createRadioListLayout(
        [
          { title: "Image", value: "image" },
          { title: "Pardot form", value: "pardot" },
        ],
        { direction: "horizontal" }
      ),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mediaImage",
      title: "Image",
      type: "image",
      description: "Image shown below the text when “Image” is selected above.",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType !== "image",
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
          description:
            "Describe the image for screen readers and SEO. Shown when the image cannot load.",
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { mediaType?: string } | undefined;
          if (parent?.mediaType === "image" && !value?.asset) {
            return "Upload an image when Image is selected";
          }
          return true;
        }),
    }),
    defineField({
      name: "pardotFormUrl",
      title: "Pardot form URL",
      type: "url",
      description:
        "Public Pardot form URL to embed when “Pardot form” is selected above.",
      hidden: ({ parent }) => parent?.mediaType !== "pardot",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { mediaType?: string } | undefined;
          if (parent?.mediaType !== "pardot") {
            return true;
          }
          if (!value || typeof value !== "string") {
            return "A valid Pardot form URL is required";
          }
          try {
            const parsed = new URL(value);
            if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
              return "URL must use http or https";
            }
            return true;
          } catch {
            return "Enter a valid URL";
          }
        }),
    }),
    backgroundColorField,
    sectionIdField,
  ],
  preview: {
    select: {
      title: "title",
      eyebrow: "eyebrow",
      mediaType: "mediaType",
    },
    prepare: ({ title, eyebrow, mediaType }) => ({
      title: title || "Hero",
      subtitle: [eyebrow, mediaType].filter(Boolean).join(" · ") || "Hero",
    }),
  },
});
