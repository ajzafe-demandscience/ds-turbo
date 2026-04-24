import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CaseStudyStatsCardBlock } from "@/components/sections/case-study-stats-card";

const meta = {
  title: "Cards/Case Study Stats Card",
  component: CaseStudyStatsCardBlock,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    _type: "caseStudyStatsCard",
    title: "Campaign Performance Uplift",
    description:
      "Results after consolidating campaign experiences into reusable blocks.",
    icon: "badge-percent",
    textColor: { hex: "#ffffff" },
    backgroundColor: { hex: "#1769E8" },
    cards: [
      {
        _key: "stat-row-1",
        stat: "+124%",
        title: "Marketing qualified leads",
        description: "Quarter-over-quarter increase.",
        backgroundColor: { hex: "#0f56c8" },
      },
      {
        _key: "stat-row-2",
        stat: "-36%",
        title: "Cost per acquisition",
        description: "Lower spend with better conversion flow.",
        backgroundColor: { hex: "#0f56c8" },
      },
      {
        _key: "stat-row-3",
        stat: "3.1x",
        title: "Launch velocity",
        description: "More campaign pages shipped per month.",
        backgroundColor: { hex: "#0f56c8" },
      },
    ],
  },
} satisfies Meta<typeof CaseStudyStatsCardBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkBlueTheme: Story = {
  args: {
    backgroundColor: { hex: "#0f2b7a" },
    cards: [
      {
        _key: "dark-row-1",
        stat: "+78%",
        title: "Marketing-sourced pipeline",
        description: "Year-over-year increase.",
        backgroundColor: { hex: "#153a9d" },
      },
      {
        _key: "dark-row-2",
        stat: "+39%",
        title: "Landing-page conversion rate",
        description: "Across paid and organic programs.",
        backgroundColor: { hex: "#153a9d" },
      },
      {
        _key: "dark-row-3",
        stat: "-28%",
        title: "Cost per opportunity",
        description: "Higher conversion efficiency at lower CAC.",
        backgroundColor: { hex: "#153a9d" },
      },
    ],
  },
};
