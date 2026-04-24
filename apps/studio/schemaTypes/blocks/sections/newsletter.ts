import { MailIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import {
  backgroundColorField,
  imageWithAltField,
  sectionIdField,
} from "@/schemaTypes/common";

export const newsletter = defineType({
  name: "newsletter",
  title: "Newsletter",
  type: "object",
  icon: MailIcon,
  fields: [
    imageWithAltField({
      name: "logo",
      title: "Logo",
      description: "Logo shown at the top of the newsletter card.",
      validation: (Rule) => Rule.required().error("A logo image is required"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Short text shown under the logo.",
      validation: (Rule) => Rule.required().error("A description is required"),
    }),
    defineField({
      name: "inputPlaceholder",
      title: "Input Placeholder",
      type: "string",
      initialValue: "Enter business email",
      description: "Placeholder text shown in the email input field.",
    }),
    defineField({
      name: "buttonLabel",
      title: "Button Label",
      type: "string",
      initialValue: "Sign Up",
      description: "Only the submit button label text.",
      validation: (Rule) => Rule.required().error("A button label is required"),
    }),
    defineField({
      name: "terms",
      title: "Terms Text",
      type: "text",
      rows: 4,
      description: "Small disclaimer text shown below the input and button.",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media URLs",
      type: "object",
      fields: [
        defineField({
          name: "linkedin",
          title: "LinkedIn URL",
          type: "url",
          validation: (Rule) =>
            Rule.uri({ scheme: ["http", "https"] }).error(
              "Enter a valid LinkedIn URL",
            ),
        }),
        defineField({
          name: "twitter",
          title: "X URL",
          type: "url",
          validation: (Rule) =>
            Rule.uri({ scheme: ["http", "https"] }).error(
              "Enter a valid X URL",
            ),
        }),
        defineField({
          name: "facebook",
          title: "Facebook URL",
          type: "url",
          validation: (Rule) =>
            Rule.uri({ scheme: ["http", "https"] }).error(
              "Enter a valid Facebook URL",
            ),
        }),
      ],
    }),
    backgroundColorField,
    sectionIdField,
  ],
  preview: {
    select: {
      buttonLabel: "buttonLabel",
    },
    prepare: ({ buttonLabel }) => ({
      title: "Newsletter",
      subtitle: `Button: ${buttonLabel || "Sign Up"}`,
    }),
  },
});
