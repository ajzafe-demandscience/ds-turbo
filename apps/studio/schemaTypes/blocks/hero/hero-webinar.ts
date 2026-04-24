import { CalendarClock } from "lucide-react";
import { defineField, defineType } from "sanity";

import { backgroundColorField, sectionIdField } from "@/schemaTypes/common";
import { customRichText } from "@/schemaTypes/definitions/rich-text";
import { createRadioListLayout } from "@/utils/helper";

export const heroWebinar = defineType({
  name: "heroWebinar",
  title: "Hero Webinar",
  icon: CalendarClock,
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
      description: "Main headline for this webinar hero.",
      validation: (Rule) => Rule.required().error("Title is required"),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      description: "Secondary headline shown below the title.",
    }),
    customRichText(["block", "image"], {
      name: "description",
      title: "Description",
      description:
        "Supporting text with formatting, links, and lists as needed.",
    }),
    defineField({
      name: "schedule",
      title: "Schedule",
      type: "object",
      description: "Event timing details for the webinar.",
      fields: [
        defineField({
          name: "date",
          title: "Date",
          type: "string",
          description: "For example: April 24, 2026.",
        }),
        defineField({
          name: "time",
          title: "Time",
          type: "string",
          description: "For example: 1:00 PM ET / 10:00 AM PT.",
        }),
        defineField({
          name: "duration",
          title: "Duration",
          type: "string",
          description: "For example: 45 minutes.",
        }),
      ],
      options: { collapsible: true, collapsed: false },
    }),
    defineField({
      name: "mediaType",
      title: "Pardot form or image",
      type: "string",
      description:
        "Show a hero image, or embed a Pardot form using its public form URL.",
      initialValue: "pardot",
      options: createRadioListLayout(
        [
          { title: "Pardot form", value: "pardot" },
          { title: "Image", value: "image" },
        ],
        { direction: "horizontal" }
      ),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mediaImage",
      title: "Image",
      type: "image",
      description: "Image shown when “Image” is selected above.",
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
      date: "schedule.date",
      time: "schedule.time",
    },
    prepare: ({ title, eyebrow, date, time }) => ({
      title: title || "Hero Webinar",
      subtitle: [eyebrow, [date, time].filter(Boolean).join(" · ")]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});

