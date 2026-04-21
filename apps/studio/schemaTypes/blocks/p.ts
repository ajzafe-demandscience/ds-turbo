import { PilcrowIcon } from "lucide-react";
import { defineType } from "sanity";

import { backgroundColorField, sectionIdField } from "@/schemaTypes/common";
import { customRichText } from "@/schemaTypes/definitions/rich-text";

export const p = defineType({
  name: "p",
  title: "P",
  type: "object",
  icon: PilcrowIcon,
  fields: [
    customRichText(["block"], {
      title: "Paragraph Content",
      description: "Paragraph text content with editor support.",
    }),
    backgroundColorField,
    sectionIdField,
  ],
  preview: {
    select: {
      richText: "richText",
    },
    prepare: ({ richText }) => {
      const firstBlock = richText?.find?.((item: { _type?: string }) => item?._type === "block");
      const firstText =
        firstBlock?.children
          ?.filter((child: { text?: string }) => Boolean(child?.text))
          ?.map((child: { text?: string }) => child?.text ?? "")
          ?.join("")
          ?.trim() ?? "";

      return {
        title: firstText || "Paragraph",
        subtitle: "P Block",
      };
    },
  },
});
