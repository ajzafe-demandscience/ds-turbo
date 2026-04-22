import { defineField, defineType } from "sanity";

import { createRadioListLayout } from "@/utils/helper";

const allLinkableTypes = [
  { type: "blog" },
  { type: "blogIndex" },
  { type: "page" },
];

export const customUrlOptional = defineType({
  name: "customUrlOptional",
  type: "object",
  description:
    "Optional link configuration. Leave empty when this content should not link anywhere.",
  fields: [
    defineField({
      name: "type",
      type: "string",
      description:
        "Choose internal for links within your site, or external for links to other websites.",
      options: createRadioListLayout(["internal", "external"]),
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in new tab",
      type: "boolean",
      description:
        "When enabled, clicking this link will open the destination in a new browser tab.",
      initialValue: () => false,
      hidden: ({ parent }) => !parent?.type,
    }),
    defineField({
      name: "external",
      type: "string",
      title: "URL",
      description:
        "Enter a full URL like https://example.com or a relative path like /about.",
      hidden: ({ parent }) => parent?.type !== "external",
    }),
    defineField({
      name: "href",
      type: "string",
      description: "Internal helper field for the resolved URL.",
      initialValue: () => "#",
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "internal",
      type: "reference",
      description: "Select a page from this site.",
      options: { disableNew: true },
      hidden: ({ parent }) => parent?.type !== "internal",
      to: allLinkableTypes,
    }),
  ],
  preview: {
    select: {
      externalUrl: "external",
      urlType: "type",
      internalUrl: "internal.slug.current",
      openInNewTab: "openInNewTab",
    },
    prepare({ externalUrl, urlType, internalUrl, openInNewTab }) {
      if (!urlType) {
        return {
          title: "Optional Link",
          subtitle: "Not configured",
        };
      }
      const url = urlType === "external" ? externalUrl : `${internalUrl}`;
      const newTabIndicator = openInNewTab ? " ↗" : "";
      return {
        title: `${urlType === "external" ? "External" : "Internal"} Link`,
        subtitle: `${url}${newTabIndicator}`,
      };
    },
  },
});
