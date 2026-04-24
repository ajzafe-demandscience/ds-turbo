import { CalendarClock } from "lucide-react";
import { defineField, defineType } from "sanity";

import { backgroundColorField, sectionIdField } from "@/schemaTypes/common";
import { customRichText } from "@/schemaTypes/definitions/rich-text";

export const ctaWebinarForm = defineType({
  name: "ctaWebinarForm",
  title: "CTA Webinar Form",
  type: "object",
  icon: CalendarClock,
  description:
    "A centered webinar CTA with a dark container, a white registration card background, and a schedule row.",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Main heading shown at the top of this block.",
      validation: (Rule) => Rule.required().error("Title is required"),
    }),
    customRichText(["block"], {
      name: "description",
      title: "Description",
      description: "Supporting paragraph shown under the title.",
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
          description: "For example: 12:00 PM ET / 9:00 AM PT.",
        }),
        defineField({
          name: "duration",
          title: "Duration",
          type: "string",
          description: "For example: 45mins.",
        }),
      ],
      options: { collapsible: true, collapsed: false },
    }),
    defineField({
      name: "pardotFormUrl",
      title: "Pardot form URL",
      type: "url",
      description:
        "Pardot form URL for this CTA. The current design only renders the white card container (no embedded inputs).",
    }),
    defineField({
      name: "cardTitle",
      title: "Card title",
      type: "string",
      initialValue: "Register",
      description: "Title shown inside the white card container.",
    }),
    backgroundColorField,
    sectionIdField,
  ],
  preview: {
    select: {
      title: "title",
      cardTitle: "cardTitle",
    },
    prepare: ({ title, cardTitle }) => ({
      title: title || "CTA Webinar Form",
      subtitle: cardTitle ? `Card: ${cardTitle}` : "Webinar CTA",
    }),
  },
});

