import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CardStatBlock } from "@/components/sections/card-stat";

const meta = {
  title: "Cards/Card Stat",
  component: CardStatBlock,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    _type: "cardStat",
    title: "Increase in qualified leads",
    description: "Measured over the first 60 days post-launch.",
    stat: "2.4x",
    backgroundColor: { hex: "#0f56c8" },
    textColor: { hex: "#ffffff" },
  },
} satisfies Meta<typeof CardStatBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LightTheme: Story = {
  args: {
    backgroundColor: { hex: "#f3f7ff" },
    textColor: { hex: "#1f3c88" },
    title: "Faster campaign publishing cycle",
    description: "From approved brief to live page.",
    stat: "43%",
  },
};
