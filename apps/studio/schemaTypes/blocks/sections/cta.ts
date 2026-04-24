import { LayoutPanelTopIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

const nestedBlockTypes = [
  "h1",
  "buttonLink",
  "imageBlock",
  "imageCard",
  "p",
  "pardotForm",
  "richTextBlock",
  "companyLogoCarousel",
  "howItWorksCards",
  "imageDescriptionCards",
  "speakers",
  "ctaWebinarForm",
  "whatYouCanRunCards",
  "whatWeDoCards",
  "statsCounter",
  "twoColumns",
  "sectionSplit",
  "insightCard",
  "insightHeader",
  "caseStudyStatsCards",
] as const;

export const cta = defineType({
  name: "cta",
  title: "Cta",
  type: "object",
  icon: LayoutPanelTopIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().error("A title is required"),
      description: "Section heading shown above the nested blocks.",
    }),
    defineField({
      name: "pageBuilder",
      title: "Page Builder",
      type: "array",
      validation: (Rule) =>
        Rule.required().min(1).error("Add at least one block"),
      of: nestedBlockTypes.map((type) => defineArrayMember({ type })),
      options: { insertMenu: { views: [{ name: "grid" }] } },
      description:
        "Add one or more blocks that should render inside this section.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      blocks: "pageBuilder",
    },
    prepare: ({ title, blocks }) => ({
      title: title || "Cta",
      subtitle: `${Array.isArray(blocks) ? blocks.length : 0} block(s)`,
    }),
  },
});
