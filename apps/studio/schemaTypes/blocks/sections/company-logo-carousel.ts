import { GalleryHorizontalEnd } from "lucide-react";
import { defineType } from "sanity";

import { backgroundColorField, sectionIdField } from "@/schemaTypes/common";

export const companyLogoCarousel = defineType({
  name: "companyLogoCarousel",
  title: "Company Carousel",
  type: "object",
  icon: GalleryHorizontalEnd,
  fields: [backgroundColorField, sectionIdField],
  preview: {
    prepare: () => ({
      title: "Company Carousel",
      subtitle: "Logos come from Company Carousel Config in the content list",
    }),
  },
});
