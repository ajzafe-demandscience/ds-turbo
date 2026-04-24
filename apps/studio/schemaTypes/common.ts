import {
  defineField,
  type ImageRule,
  type ImageValue,
  type ValidationBuilder,
} from "sanity";

import {
  BlogSlugFieldComponent,
} from "@/components/slug-field-component";
import { GROUP } from "@/utils/constant";
import { isUnique } from "@/utils/slug";
import {
  cleanSlug,
  createSlugErrorValidator,
  createSlugWarningValidator,
  getDocumentTypeConfig,
} from "@/utils/slug-validation";

const blogPostSlugValidation = {
  documentType: "Blog post",
  requireSlash: false,
  segmentCount: 1,
  sanityDocumentType: "blog",
} as const;

export const richTextField = defineField({
  name: "richText",
  type: "richText",
  description:
    "A text editor that lets you add formatting like bold text, links, and bullet points",
});

export const buttonsField = defineField({
  name: "buttons",
  type: "array",
  of: [{ type: "button" }],
  description:
    "Add one or more clickable buttons that visitors can use to navigate your website",
});

export const pageBuilderField = defineField({
  name: "pageBuilder",
  group: GROUP.MAIN_CONTENT,
  type: "pageBuilder",
  description:
    "Build your page by adding different sections like text, images, and other content blocks",
});

export const sectionIdField = defineField({
  name: "sectionId",
  title: "Section ID",
  type: "string",
  description:
    "Optional unique section ID used by Button Link blocks with 'Scroll to Section' (enter without #, e.g. pricing or contact-form).",
});

export const backgroundColorField = defineField({
  name: "backgroundColor",
  title: "Background Color",
  type: "color",
  description: "Optional background color for this main block section.",
  options: {
    disableAlpha: false,
  },
});

export const iconField = defineField({
  name: "icon",
  title: "Icon",
  type: "lucide-icon",
  description:
    "Choose a small picture symbol to represent this item, like a home icon or shopping cart",
});

export const blogPostSlugField = (
  options: {
    group?: string;
    title?: string;
    description?: string;
  } = {}
) =>
  defineField({
    name: "slug",
    type: "slug",
    title: options.title ?? "Slug",
    description:
      options.description ??
      "URL segment for this post (shown at /resources/blog/{slug} on the site).",
    group: options.group,
    components: {
      field: (props) => BlogSlugFieldComponent(props),
    },
    options: {
      source: "title",
      slugify: (input: string) => cleanSlug(input),
      isUnique,
    },
    validation: (Rule) => [
      Rule.required().error("A slug is required"),
      Rule.custom(createSlugErrorValidator(blogPostSlugValidation)),
      Rule.custom(createSlugWarningValidator(blogPostSlugValidation)).warning(),
    ],
  });

export const documentSlugField = (
  documentType: string,
  options: {
    group?: string;
    description?: string;
    title?: string;
  } = {}
) => {
  const {
    group,
    description = `The web address where people can find your ${documentType} (automatically created from title)`,
    title = "URL",
  } = options;

  return defineField({
    name: "slug",
    type: "slug",
    title,
    description,
    group,
    options: {
      source: "title",
      slugify: (input: string) => cleanSlug(input),
      isUnique,
    },
    validation: (Rule) => {
      const config = getDocumentTypeConfig(documentType);
      return [
        Rule.custom(createSlugErrorValidator(config)),
        Rule.custom(createSlugWarningValidator(config)).warning(),
      ];
    },
  });
};

export const imageWithAltField = ({
  name = "image",
  title = "Image",
  description = "An image, make sure to add an alt text and use the hotspot tool to ensure if image is cropped it highlights the focus point",
  validation,
  group,
}: {
  name?: string;
  title?: string;
  description?: string;
  group?: string;
  validation?: ValidationBuilder<ImageRule, ImageValue>;
} = {}) =>
  defineField({
    name,
    type: "image",
    title,
    description,
    group,
    validation,
    options: {
      hotspot: true,
    },
    fields: [
      defineField({
        name: "alt",
        type: "string",
        title: "Alt Text",
        description:
          "The text that describes the image for screen readers and search engines",
      }),
    ],
  });
