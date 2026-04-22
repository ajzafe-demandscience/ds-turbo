import { TextIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { backgroundColorField, sectionIdField } from "@/schemaTypes/common";
import { customRichText } from "@/schemaTypes/definitions/rich-text";
import { createRadioListLayout } from "@/utils/helper";

export const richTextBlock = defineType({
  name: "richTextBlock",
  type: "object",
  icon: TextIcon,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description:
        "The smaller text that sits above the title to provide context",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The large text that is the primary focus of the block",
    }),
    defineField({
      name: "titleAlignment",
      title: "Title Alignment",
      type: "string",
      description: "Choose how the title text should align",
      initialValue: "left",
      options: createRadioListLayout(["left", "center", "right"], {
        direction: "horizontal",
      }),
    }),
    customRichText(["block", "image"]),
    backgroundColorField,
    sectionIdField,
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title || "Rich Text",
      subtitle: "Rich Text Block",
    }),
  },
});
