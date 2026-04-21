import { Mail } from "lucide-react";
import { defineField, defineType } from "sanity";

import { backgroundColorField, sectionIdField } from "@/schemaTypes/common";
import { customRichText } from "@/schemaTypes/definitions/rich-text";

export const subscribeNewsletter = defineType({
  name: "subscribeNewsletter",
  title: "Subscribe Newsletter",
  type: "object",
  icon: Mail,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    customRichText(["block"], {
      name: "subTitle",
      title: "SubTitle",
    }),
    customRichText(["block"], {
      name: "helperText",
      title: "Helper Text",
    }),
    backgroundColorField,
    sectionIdField,
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title ?? "Untitled",
      subtitle: "Subscribe Newsletter",
    }),
  },
});
