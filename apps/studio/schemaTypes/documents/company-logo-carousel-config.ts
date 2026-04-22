import { GalleryHorizontalEnd } from "lucide-react";
import { defineField, defineType } from "sanity";

import { imageWithAltField } from "@/schemaTypes/common";
import { GROUP, GROUPS } from "@/utils/constant";

const logoItem = defineField({
  name: "logoItem",
  title: "Logo Item",
  type: "object",
  fields: [
    defineField({
      name: "company",
      title: "Company",
      type: "string",
      description: "Company name used as the logo label.",
      validation: (Rule) => Rule.required().error("Company name is required"),
    }),
    imageWithAltField({
      title: "Logo Image",
      description: "Company logo image used in the carousel.",
      validation: (Rule) => Rule.required().error("Logo image is required"),
    }),
  ],
  preview: {
    select: {
      title: "company",
      media: "image",
    },
    prepare: ({ title, media }) => {
      return {
        title: title || "Company",
        subtitle: "Image only",
        media,
      };
    },
  },
});

export const companyLogoCarouselConfig = defineType({
  name: "companyLogoCarouselConfig",
  title: "Company Logo Carousel Config",
  type: "document",
  icon: GalleryHorizontalEnd,
  description:
    "Shared logos for every Company Logo Carousel block on the site. " +
    "Publish this document after changes so the live website (including landing pages) shows the logos.",
  groups: GROUPS,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Trusted by leading companies",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "logos",
      title: "Logos",
      type: "array",
      of: [logoItem],
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) =>
        Rule.required()
          .min(2)
          .error("Please add at least 2 logos for the carousel."),
    }),
  ],
  preview: {
    select: {
      title: "title",
      logos: "logos",
    },
    prepare: ({ title, logos = [] }) => ({
      title: title || "Company Logo Carousel Config",
      subtitle: `${logos.length} logo${logos.length === 1 ? "" : "s"}`,
    }),
  },
});
