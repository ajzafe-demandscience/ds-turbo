import { CircleDashedIcon } from "lucide-react";
import { defineField, defineType } from "sanity";
import { backgroundColorField, sectionIdField } from "@/schemaTypes/common";

export const pardotForm = defineType({
  name: "pardotForm",
  title: "Pardot Form",
  type: "object",
  icon: CircleDashedIcon,
  fields: [
    defineField({
      name: "url",
      title: "Form URL",
      type: "url",
      description: "Public Pardot form URL to embed in this section.",
      validation: (Rule) =>
        Rule.required()
          .uri({
            allowRelative: false,
            scheme: ["http", "https"],
          })
          .error("A valid Pardot form URL is required"),
    }),
    backgroundColorField,
    sectionIdField,
  ],
  preview: {
    select: {
      url: "url",
    },
    prepare: ({ url }) => ({
      title: "Pardot Form",
      subtitle: url || "No URL configured",
    }),
  },
});
