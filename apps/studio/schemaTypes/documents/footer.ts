import { LayoutPanelLeft, Link, PanelBottom } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

const footerColumnLink = defineField({
  name: "footerColumnLink",
  type: "object",
  icon: Link,
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Name",
      description: "Name for the link",
    }),
    defineField({
      name: "url",
      type: "customUrl",
    }),
  ],
  preview: {
    select: {
      title: "name",
      externalUrl: "url.external",
      urlType: "url.type",
      internalUrl: "url.internal.slug.current",
      openInNewTab: "url.openInNewTab",
    },
    prepare({ title, externalUrl, urlType, internalUrl, openInNewTab }) {
      const url = urlType === "external" ? externalUrl : internalUrl;
      const newTabIndicator = openInNewTab ? " ↗" : "";
      const truncatedUrl =
        url?.length > 30 ? `${url.substring(0, 30)}...` : url;

      return {
        title: title || "Untitled Link",
        subtitle: `${urlType === "external" ? "External" : "Internal"} • ${truncatedUrl}${newTabIndicator}`,
        media: Link,
      };
    },
  },
});

const footerNewsletter = defineArrayMember({
  name: "footerNewsletter",
  title: "Newsletter",
  type: "object",
  fields: [
    defineField({
      name: "logo",
      type: "image",
      title: "Logo",
      description: "Logo shown at the top of the newsletter area.",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      title: "Description",
      description: "Short text shown below the logo.",
    }),
    defineField({
      name: "inputPlaceholder",
      type: "string",
      title: "Input Placeholder",
      initialValue: "Enter business email",
      description: "Placeholder text shown in the newsletter input.",
    }),
    defineField({
      name: "buttonLabel",
      type: "string",
      title: "Button Label",
      initialValue: "Sign Up",
      description: "Label shown on the newsletter submit button.",
    }),
    defineField({
      name: "terms",
      type: "richText",
      title: "Terms Text",
      description:
        "Small disclaimer text shown below the signup row. Supports rich text formatting.",
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
        }),
        defineField({
          name: "linkedinIcon",
          title: "LinkedIn Icon",
          type: "image",
          description: "Optional custom icon for LinkedIn.",
          options: { hotspot: true },
        }),
        defineField({
          name: "twitter",
          title: "X URL",
          type: "url",
        }),
        defineField({
          name: "twitterIcon",
          title: "X Icon",
          type: "image",
          description: "Optional custom icon for X (Twitter).",
          options: { hotspot: true },
        }),
        defineField({
          name: "facebook",
          title: "Facebook URL",
          type: "url",
        }),
        defineField({
          name: "facebookIcon",
          title: "Facebook Icon",
          type: "image",
          description: "Optional custom icon for Facebook.",
          options: { hotspot: true },
        }),
      ],
    }),
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

const footerLinks = defineArrayMember({
  name: "footerLinks",
  title: "Links",
  type: "object",
  icon: LayoutPanelLeft,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Title for this links column.",
    }),
    defineField({
      name: "links",
      type: "array",
      title: "Links",
      description: "Links for this column.",
      of: [footerColumnLink],
    }),
  ],
  preview: {
    select: {
      title: "title",
      links: "links",
    },
    prepare: ({ title, links = [] }) => ({
      title: title || "Untitled Links Column",
      subtitle: `${links.length} link${links.length === 1 ? "" : "s"}`,
    }),
  },
});

const footerCopyrightLink = defineField({
  name: "footerCopyrightLink",
  title: "Copyright Link",
  type: "object",
  icon: Link,
  fields: [
    defineField({
      name: "label",
      type: "string",
      title: "Label",
      description: "Link label shown in the copyright row.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      type: "customUrl",
      title: "URL",
      description: "Destination for this copyright link.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "label",
      externalUrl: "url.external",
      urlType: "url.type",
      internalUrl: "url.internal.slug.current",
      openInNewTab: "url.openInNewTab",
    },
    prepare({ title, externalUrl, urlType, internalUrl, openInNewTab }) {
      const url = urlType === "external" ? externalUrl : internalUrl;
      const newTabIndicator = openInNewTab ? " ↗" : "";

      return {
        title: title || "Untitled Copyright Link",
        subtitle: `${urlType === "external" ? "External" : "Internal"} • ${url}${newTabIndicator}`,
        media: Link,
      };
    },
  },
});

const footerCopyright = defineArrayMember({
  name: "footerCopyright",
  title: "Copyright",
  type: "object",
  icon: PanelBottom,
  fields: [
    defineField({
      name: "copyrightText",
      type: "string",
      title: "Copyright Text",
      description:
        "Main copyright copy shown on the left side of the footer bottom row.",
      initialValue: "©2026 DemandScience US, LLC All Rights Reserved",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "links",
      type: "array",
      title: "Copyright Links",
      description: "Policy and legal links shown on the right side.",
      of: [footerCopyrightLink],
      initialValue: [
        {
          _type: "footerCopyrightLink",
          label: "Privacy Rights & Do Not Sell My Information",
          url: {
            _type: "customUrl",
            type: "external",
            external: "https://demandscience.com/privacy-policy/",
            openInNewTab: false,
          },
        },
        {
          _type: "footerCopyrightLink",
          label: "Privacy Policy",
          url: {
            _type: "customUrl",
            type: "external",
            external: "https://demandscience.com/privacy-policy/",
            openInNewTab: false,
          },
        },
        {
          _type: "footerCopyrightLink",
          label: "Terms & Conditions",
          url: {
            _type: "customUrl",
            type: "external",
            external: "https://demandscience.com/terms-and-conditions/",
            openInNewTab: false,
          },
        },
        {
          _type: "footerCopyrightLink",
          label: "IAB Addendum",
          url: {
            _type: "customUrl",
            type: "external",
            external: "https://demandscience.com/iab-addendum/",
            openInNewTab: false,
          },
        },
        {
          _type: "footerCopyrightLink",
          label: "DTA",
          url: {
            _type: "customUrl",
            type: "external",
            external: "https://demandscience.com/dta/",
            openInNewTab: false,
          },
        },
        {
          _type: "footerCopyrightLink",
          label: "DPA",
          url: {
            _type: "customUrl",
            type: "external",
            external: "https://demandscience.com/dpa/",
            openInNewTab: false,
          },
        },
        {
          _type: "footerCopyrightLink",
          label: "Cookie Preferences",
          url: {
            _type: "customUrl",
            type: "external",
            external: "https://demandscience.com/",
            openInNewTab: false,
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "copyrightText",
      links: "links",
    },
    prepare: ({ title, links = [] }) => ({
      title: title || "Copyright",
      subtitle: `${links.length} legal link${links.length === 1 ? "" : "s"}`,
    }),
  },
});

const footerMegaMenu = defineArrayMember({
  name: "footerMegaMenu",
  title: "Footer Mega Menu",
  type: "object",
  icon: LayoutPanelLeft,
  fields: [
    defineField({
      name: "columnsPerRow",
      title: "Columns per row (optional)",
      type: "number",
      description:
        "Optional fixed number of link columns per row on desktop. Leave empty to auto-wrap based on content width.",
      validation: (rule) => rule.integer().min(1).max(6),
    }),
    defineField({
      name: "pageBuilder",
      type: "array",
      title: "Page Builder (Columns)",
      description:
        "Add Newsletter and Links blocks. Newsletter is usually first, followed by one or more Links blocks.",
      of: [footerNewsletter, footerLinks],
    }),
  ],
  preview: {
    select: {
      blocks: "pageBuilder",
      columnsPerRow: "columnsPerRow",
    },
    prepare: ({ blocks = [], columnsPerRow }) => ({
      title: "Footer Mega Menu",
      subtitle: `${blocks.length} block(s)${
        columnsPerRow ? ` • ${columnsPerRow} per row` : " • auto-wrap"
      }`,
    }),
  },
});

export const footer = defineType({
  name: "footer",
  type: "document",
  title: "Footer",
  description: "Footer content for your website",
  fields: [
    defineField({
      name: "title",
      type: "string",
      initialValue: "Footer",
      title: "Title",
      description: "Internal title used to identify this footer in the CMS",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pageBuilder",
      type: "array",
      title: "Page Builder",
      description:
        "Optional footer layout sections. Use Footer Mega Menu for newsletter + links and Copyright for the legal row.",
      of: [
        footerMegaMenu,
        footerCopyright,
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title || "Untitled Footer",
      media: PanelBottom,
    }),
  },
});
