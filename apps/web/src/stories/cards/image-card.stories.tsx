import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ImageCardBlock } from "@/components/sections/image-card";
import type { SanityImageProps } from "@/types";

import { mockImages } from "./mocks";

function storyImage(partial: { id: string; alt: string }): SanityImageProps {
  return {
    id: partial.id,
    alt: partial.alt,
    preview: null,
    hotspot: null,
    crop: null,
  };
}

const meta = {
  title: "Cards/Image Card",
  component: ImageCardBlock,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    _type: "imageCard",
    title: "Launch campaigns without the chaos",
    description:
      "Build, edit, and publish high-converting pages in days, not weeks.",
    image: mockImages.card,
    variant: "top",
    blockPosition: "center",
    imageSize: 520,
    backgroundColor: { hex: "#ffffff" },
    href: "/resources/blog",
  },
} satisfies Meta<typeof ImageCardBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TopImage: Story = {};

export const SideBySide: Story = {
  args: {
    image: storyImage({
      id: "placeholder-icon-side",
      alt: "Icon placeholder",
    }),
    imageSize: 96,
    variant: "left",
    title: "Turn attention into pipeline",
    description:
      "Align message, design, and CTA so every visit has a clear next step.",
  },
};

export const RightAlignedBlock: Story = {
  args: {
    image: storyImage({
      id: "placeholder-icon-right",
      alt: "Icon placeholder",
    }),
    imageSize: 96,
    variant: "right",
    blockPosition: "right",
    title: "Scale content without slowing down",
    description:
      "Reusable blocks help teams ship quickly while maintaining consistency.",
  },
};
