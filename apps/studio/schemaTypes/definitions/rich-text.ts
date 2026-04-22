import { ImageIcon, LinkIcon } from "@sanity/icons";
import { AlignCenter } from "lucide-react";
import { createElement, type ReactNode } from "react";
import {
  type ConditionalProperty,
  defineArrayMember,
  defineField,
  defineType,
} from "sanity";

function AlignCenterIcon() {
  return createElement(AlignCenter, { size: 16, strokeWidth: 2.2 });
}

function CenterTextDecorator(props: { children: ReactNode }) {
  return createElement(
    "span",
    { style: { display: "inline-block", width: "100%", textAlign: "center" } },
    props.children
  );
}

const richTextMembers = [
  defineArrayMember({
    name: "block",
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "Text Center", value: "center" },
      { title: "H2", value: "h2" },
      { title: "H3", value: "h3" },
      { title: "H4", value: "h4" },
      { title: "H5", value: "h5" },
      { title: "H6", value: "h6" },
      { title: "Inline", value: "inline" },
    ],
    lists: [
      { title: "Numbered", value: "number" },
      { title: "Bullet", value: "bullet" },
    ],
    marks: {
      annotations: [
        {
          name: "customLink",
          type: "object",
          title: "Internal/External Link",
          icon: LinkIcon,
          fields: [
            defineField({
              name: "customLink",
              type: "customUrl",
            }),
          ],
        },
      ],
      decorators: [
        { title: "Strong", value: "strong" },
        { title: "Emphasis", value: "em" },
        { title: "Code", value: "code" },
        {
          title: "Align Center",
          value: "centerText",
          icon: AlignCenterIcon,
          component: CenterTextDecorator,
        },
      ],
    },
  }),
  defineArrayMember({
    name: "image",
    title: "Image",
    type: "image",
    icon: ImageIcon,
    options: {
      hotspot: true,
    },
    fields: [
      defineField({
        name: "caption",
        type: "string",
        title: "Caption Text",
      }),
    ],
  }),
];

export const richText = defineType({
  name: "richText",
  type: "array",
  of: richTextMembers,
});

export const memberTypes = richTextMembers.map((member) => member.name);

type Type = NonNullable<(typeof memberTypes)[number]>;

export const customRichText = (
  type: Type[],
  options?: {
    name?: string;
    title?: string;
    group?: string[] | string;
    description?: string;
    hidden?: ConditionalProperty;
  }
) => {
  const { name, description, hidden } = options ?? {};
  const customMembers = richTextMembers.filter(
    (member) => member.name && type.includes(member.name)
  );
  return defineField({
    ...options,
    name: name ?? "richText",
    type: "array",
    description: description ?? "",
    hidden,
    of: customMembers,
  });
};
