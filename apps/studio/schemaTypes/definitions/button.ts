import { Command } from "lucide-react";
import { defineField, defineType } from "sanity";

import { capitalize, createRadioListLayout } from "@/utils/helper";

const buttonVariants = ["default", "secondary", "outline", "link"];

export const button = defineType({
  name: "button",
  title: "Button",
  type: "object",
  icon: Command,
  fields: [
    defineField({
      name: "variant",
      type: "string",
      description:
        "Choose the button's visual style - default is solid, secondary is less prominent, outline has a border, and link looks like regular text",
      initialValue: () => "default",
      options: createRadioListLayout(buttonVariants, {
        direction: "horizontal",
      }),
    }),
    defineField({
      name: "text",
      title: "Button Text",
      type: "string",
      description:
        "The text that appears on the button, like 'Learn More' or 'Get Started'",
    }),
    defineField({
      name: "url",
      title: "Url",
      type: "customUrl",
      description:
        "Where the button links to - can be an internal page or external website",
    }),
    defineField({
      name: "items",
      title: "Dropdown Items",
      type: "array",
      description:
        "Optional dropdown links shown under this button in the navbar. Leave empty for a regular button.",
      of: [
        defineField({
          name: "item",
          title: "Dropdown Item",
          type: "object",
          fields: [
            defineField({
              name: "text",
              title: "Item Text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "Url",
              type: "customUrl",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "text",
              externalUrl: "url.external",
              urlType: "url.type",
              internalUrl: "url.internal.slug.current",
              openInNewTab: "url.openInNewTab",
            },
            prepare: ({
              title,
              externalUrl,
              urlType,
              internalUrl,
              openInNewTab,
            }) => {
              const url = urlType === "external" ? externalUrl : internalUrl;
              const newTabIndicator = openInNewTab ? " ↗" : "";

              return {
                title: title || "Untitled Dropdown Item",
                subtitle: `${urlType === "external" ? "External" : "Internal"} • ${url}${newTabIndicator}`,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "text",
      variant: "variant",
      externalUrl: "url.external",
      urlType: "url.type",
      internalUrl: "url.internal.slug.current",
      openInNewTab: "url.openInNewTab",
      items: "items",
    },
    prepare: ({
      title,
      variant,
      externalUrl,
      urlType,
      internalUrl,
      openInNewTab,
      items = [],
    }) => {
      const url = urlType === "external" ? externalUrl : internalUrl;
      const newTabIndicator = openInNewTab ? " ↗" : "";

      return {
        title: title || "Untitled Button",
        subtitle: `${capitalize(variant ?? "default")} • ${url}${newTabIndicator}${items.length ? ` • ${items.length} dropdown item(s)` : ""}`,
      };
    },
  },
});
