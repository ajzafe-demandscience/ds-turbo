import { LinkIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { backgroundColorField, sectionIdField } from "@/schemaTypes/common";
import { createRadioListLayout } from "@/utils/helper";

export const buttonLink = defineType({
  name: "buttonLink",
  title: "Button Link",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "style",
      title: "Button Style",
      type: "string",
      initialValue: "primary",
      options: createRadioListLayout(
        [
          { title: "Primary", value: "primary" },
          { title: "White Outline", value: "whiteOutline" },
        ],
        {
          direction: "horizontal",
        }
      ),
      validation: (Rule) => Rule.required().error("A button style is required"),
    }),
    defineField({
      name: "linkType",
      title: "Link Type",
      type: "string",
      initialValue: "url",
      options: createRadioListLayout(
        [
          { title: "URL", value: "url" },
          { title: "Scroll to Section", value: "scrollToSection" },
        ],
        {
          direction: "horizontal",
        }
      ),
      validation: (Rule) => Rule.required().error("A link type is required"),
    }),
    defineField({
      name: "scrollToSectionId",
      title: "Target Section",
      type: "string",
      description:
        "ID of the section to scroll to (without #), e.g. pricing or contact-form. This should match the Section ID on the target block.",
      hidden: ({ parent }) => parent?.linkType !== "scrollToSection",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as
            | {
                linkType?: string;
              }
            | undefined;
          if (parent?.linkType === "scrollToSection" && !value?.trim()) {
            return "Section ID is required when using Scroll to Section";
          }
          return true;
        }),
    }),
    defineField({
      name: "text",
      title: "Button Text",
      type: "string",
      validation: (Rule) => Rule.required().error("Button text is required"),
    }),
    defineField({
      name: "variant",
      title: "Button Variant",
      type: "string",
      initialValue: "default",
      options: createRadioListLayout(
        [
          { title: "Default", value: "default" },
          { title: "Secondary", value: "secondary" },
          { title: "Outline", value: "outline" },
          { title: "Link", value: "link" },
        ],
        {
          direction: "horizontal",
        }
      ),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      hidden: ({ parent }) => parent?.linkType !== "url",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as
            | {
                linkType?: string;
              }
            | undefined;
          if (parent?.linkType !== "url") {
            return true;
          }
          if (!value) {
            return "URL is required when Link Type is URL";
          }
          return true;
        }),
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in new tab",
      type: "boolean",
      initialValue: false,
      hidden: ({ parent }) => parent?.linkType !== "url",
    }),
    backgroundColorField,
    sectionIdField,
  ],
  preview: {
    select: {
      text: "text",
      variant: "variant",
      style: "style",
      linkType: "linkType",
      sectionId: "scrollToSectionId",
      openInNewTab: "openInNewTab",
    },
    prepare: ({ text, variant, style, linkType, sectionId, openInNewTab }) => ({
      title: text || "Untitled Button Link",
      subtitle: `Button Link • ${style ?? variant ?? "primary"} • ${
        linkType === "scrollToSection" ? `#${sectionId || "missing-id"}` : "URL"
      }${openInNewTab ? " ↗" : ""}`,
    }),
  },
});
