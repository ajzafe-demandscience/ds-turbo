import { defineArrayMember, defineType } from "sanity";

import { pageBuilderBlocks } from "@/schemaTypes/blocks/index";

const COMPONENT_BLOCK_NAMES = new Set([
  "buttonLink",
  "h1",
  "imageBlock",
  "p",
  "pardotForm",
]);

const componentBlockTypes = pageBuilderBlocks
  .map(({ name }) => name)
  .filter((name) => COMPONENT_BLOCK_NAMES.has(name));

const sectionBlockTypes = pageBuilderBlocks
  .map(({ name }) => name)
  .filter((name) => !COMPONENT_BLOCK_NAMES.has(name));

export const pagebuilderBlockTypes = pageBuilderBlocks.map(({ name }) =>
  defineArrayMember({
    type: name,
  })
);

export const pageBuilder = defineType({
  name: "pageBuilder",
  type: "array",
  of: pagebuilderBlockTypes,
  options: {
    insertMenu: {
      groups: [
        {
          name: "sections",
          title: "Sections",
          of: sectionBlockTypes,
        },
        {
          name: "components",
          title: "Components",
          of: componentBlockTypes,
        },
      ],
      views: [
        {
          name: "grid",
          previewImageUrl: (schemaTypeName) => {
            const kebabCaseName = schemaTypeName
              .replace(/([a-z])([A-Z])/g, "$1-$2")
              .toLowerCase();
            const filePath = `/static/thumbnails/preview-${kebabCaseName}.png`;
            return filePath;
          },
        },
      ],
    },
  },
});
