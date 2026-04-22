import { GalleryHorizontalEnd } from "lucide-react";
import { defineField, defineType } from "sanity";

import { backgroundColorField, sectionIdField } from "@/schemaTypes/common";

export const companyLogoCarousel = defineType({
  name: "companyLogoCarousel",
  title: "Company Logo Carousel",
  type: "object",
  icon: GalleryHorizontalEnd,
  fields: [backgroundColorField, sectionIdField],
  preview: {
    prepare: () => ({
      title: "Company Logo Carousel",
      subtitle: "Logos come from Company Logo Carousel in the content list",
    }),
  },
});
