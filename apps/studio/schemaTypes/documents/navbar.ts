import {
  Grid2X2,
  LayoutPanelLeft,
  Link,
  PanelTop,
  Sparkles,
} from "lucide-react";
import { defineField, defineType } from "sanity";

import { lucideIconPreview } from "@/components/icon-preview";
import { buttonsField, iconField } from "@/schemaTypes/common";

const navLinkItem = defineField({
  name: "navLinkItem",
  type: "object",
  icon: Link,
  title: "Simple Link",
  description: "A top-level menu link without a dropdown",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Menu Label",
      description: "Text shown in the top navigation",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      type: "customUrl",
      title: "Destination",
      description: "Where this menu item should link",
      validation: (rule) => rule.required(),
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

const solutionsFeaturedItem = defineField({
  name: "solutionsFeaturedItem",
  type: "object",
  icon: LayoutPanelLeft,
  title: "Featured Item",
  description: "Left-panel item used in the Solutions dropdown",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Title",
      description: "Main heading for this featured item",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "string",
      title: "Description",
      description: "Short supporting text shown below the title",
      validation: (rule) => rule.required().max(140),
    }),
    defineField({
      name: "url",
      type: "customUrl",
      title: "Destination",
      description: "Where this featured item should link",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      externalUrl: "url.external",
      urlType: "url.type",
      internalUrl: "url.internal.slug.current",
      openInNewTab: "url.openInNewTab",
      icon: "icon",
    },
    prepare({ title, icon, externalUrl, urlType, internalUrl, openInNewTab }) {
      const url = urlType === "external" ? externalUrl : internalUrl;
      const newTabIndicator = openInNewTab ? " ↗" : "";
      const truncatedUrl =
        url?.length > 30 ? `${url.substring(0, 30)}...` : url;

      return {
        title: title || "Untitled Link",
        subtitle: `${urlType === "external" ? "External" : "Internal"} • ${truncatedUrl}${newTabIndicator}`,
        media: lucideIconPreview(icon),
      };
    },
  },
});

const solutionsCategoryLink = defineField({
  name: "solutionsCategoryLink",
  type: "object",
  icon: Link,
  title: "Category Link",
  description: "A link listed inside a Solutions category group",
  fields: [
    iconField,
    defineField({
      name: "name",
      type: "string",
      title: "Link Label",
      description: "Text shown for this category link",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "string",
      title: "Description",
      description: "Optional short helper text shown beside the link",
    }),
    defineField({
      name: "iconImage",
      type: "image",
      title: "Icon Image",
      description: "Optional uploaded icon image for this link",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "url",
      type: "customUrl",
      title: "Destination",
      description: "Where this category link should go",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
      icon: "icon",
    },
    prepare({ title, subtitle, icon }) {
      return {
        title: title || "Untitled Category Link",
        subtitle: subtitle || "No description",
        media: lucideIconPreview(icon),
      };
    },
  },
});

const solutionsCategoryGroup = defineField({
  name: "solutionsCategoryGroup",
  type: "object",
  icon: Grid2X2,
  title: "Category Group",
  description: "A grouped list in the right panel of Solutions",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Group Title",
      description: "Heading shown above links in this group",
    }),
    defineField({
      name: "description",
      type: "string",
      title: "Group Description",
      description: "Optional supporting text for this group",
    }),
    defineField({
      name: "iconImage",
      type: "image",
      title: "Icon Image",
      description: "Optional uploaded icon image for this category group",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "url",
      type: "customUrl",
      title: "Group Link",
      description:
        "Optional destination for the group title and description card",
    }),
    defineField({
      name: "links",
      type: "array",
      title: "Group Links",
      validation: (rule) => [rule.required(), rule.unique()],
      description: "Links shown under this group heading",
      of: [solutionsCategoryLink],
    }),
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
      links: "links",
    },
    prepare({ title, description, links = [] }) {
      return {
        title: title || "Untitled Category Group",
        subtitle:
          description ||
          `${links.length} link${links.length === 1 ? "" : "s"}`,
      };
    },
  },
});

const solutionsMegaMenuItem = defineField({
  name: "solutionsMegaMenuItem",
  type: "object",
  icon: Sparkles,
  title: "Solutions Mega Menu",
  description: "Special 2-column dropdown used for the Solutions item",
  fields: [
    defineField({
      name: "menuLabel",
      type: "string",
      title: "Top Menu Label",
      initialValue: "Solutions",
      description: "Label shown in the top navigation bar",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      type: "customUrl",
      title: "Top Menu Link",
      description:
        "Optional URL for the top menu label (the dropdown still appears on hover)",
    }),
    defineField({
      name: "rightPanelLabel",
      type: "string",
      title: "Right Panel Label",
      initialValue: "Our Solutions",
      description: "Small heading shown at the top of the right panel",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featuredItems",
      type: "array",
      title: "Left Panel Featured Items",
      description:
        "Primary links for the dark left panel. Recommended 3-4 items.",
      validation: (rule) => [rule.required().min(1).max(4), rule.unique()],
      of: [solutionsFeaturedItem],
    }),
    defineField({
      name: "categoryGroups",
      type: "array",
      title: "Right Panel Category Groups",
      description:
        "Each group shows a heading with related links in the light panel.",
      validation: (rule) => [rule.required(), rule.unique()],
      of: [solutionsCategoryGroup],
    }),
  ],
  preview: {
    select: {
      title: "menuLabel",
      featuredItems: "featuredItems",
      categoryGroups: "categoryGroups",
    },
    prepare({ title, featuredItems = [], categoryGroups = [] }) {
      return {
        title: title || "Solutions",
        subtitle: `Solutions Mega Menu • ${featuredItems.length} featured • ${categoryGroups.length} groups`,
        media: Sparkles,
      };
    },
  },
});

const gridMegaMenuCard = defineField({
  name: "gridMegaMenuCard",
  type: "object",
  icon: Grid2X2,
  title: "Grid Card",
  description: "A card item for non-Solutions mega menus",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Card Title",
      description: "Headline shown in the card",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "string",
      title: "Card Description",
      description: "Short support text shown below the title",
      validation: (rule) => rule.required().max(140),
    }),
    defineField({
      name: "url",
      type: "customUrl",
      title: "Destination",
      description: "Where this card should link",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Untitled Grid Card",
        subtitle: subtitle || "No description",
        media: Grid2X2,
      };
    },
  },
});

const gridMegaMenuItem = defineField({
  name: "gridMegaMenuItem",
  type: "object",
  icon: Grid2X2,
  title: "Grid Mega Menu",
  description:
    "Dropdown layout for items like What We Enable, Why DemandScience, or Resources",
  fields: [
    defineField({
      name: "menuLabel",
      type: "string",
      title: "Top Menu Label",
      description: "Label shown in the top navigation bar",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      type: "customUrl",
      title: "Top Menu Link",
      description:
        "Optional URL for the top menu label (the dropdown still appears on hover)",
    }),
    defineField({
      name: "cards",
      type: "array",
      title: "Cards In This Dropdown",
      description:
        "Cards shown in the grid panel. Recommended 4-6 for best balance.",
      validation: (rule) => [rule.required().min(1).max(9), rule.unique()],
      of: [gridMegaMenuCard],
    }),
    defineField({
      name: "columns",
      type: "number",
      title: "Desktop Columns",
      initialValue: 3,
      description: "Choose how many card columns appear on desktop",
      validation: (rule) => rule.required().min(2).max(3),
    }),
  ],
  preview: {
    select: {
      title: "menuLabel",
      cards: "cards",
      columns: "columns",
    },
    prepare({ title, cards = [], columns }) {
      return {
        title: title || "Untitled Grid Mega Menu",
        subtitle: `Grid Mega Menu • ${cards.length} cards • ${columns || 3} columns`,
        media: Grid2X2,
      };
    },
  },
});

export const navbar = defineType({
  name: "navbar",
  title: "Site Navigation",
  type: "document",
  icon: PanelTop,
  description: "Configure the main navigation structure for your site",
  fields: [
    defineField({
      name: "label",
      type: "string",
      initialValue: "Navbar",
      title: "Navigation Label",
      description:
        "Internal label to identify this navigation configuration in the CMS",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      type: "image",
      title: "Navbar Logo",
      description: "Optional logo override for the navbar",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "menuItems",
      type: "array",
      title: "Navigation Items",
      description:
        "Add top-level items. Use one Solutions Mega Menu, plus simple links or grid mega menus for the rest.",
      of: [navLinkItem, solutionsMegaMenuItem, gridMegaMenuItem],
    }),
    buttonsField,
  ],
  preview: {
    select: {
      title: "label",
    },
    prepare: ({ title }) => ({
      title: title || "Untitled Navigation",
    }),
  },
});
