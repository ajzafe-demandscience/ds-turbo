import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CaseStudyStatsCardBlock } from "@/components/sections/case-study-stats-card";

const meta = {
  title: "Cards/Case Study Stats Card",
  component: CaseStudyStatsCardBlock,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    _key: "story-case-study-stats",
    _type: "caseStudyStatsCard",
    title: "Campaign Performance Uplift",
    description:
      "Results after consolidating campaign experiences into reusable blocks.",
    icon: "badge-percent",
    textColor: { _type: "color", hex: "#ffffff" },
    backgroundColor: { _type: "color", hex: "#1769E8" },
    cards: [
      {
        _key: "stat-row-1",
        _type: "card",
        stat: "+124%",
        title: "Marketing qualified leads",
        description: "Quarter-over-quarter increase.",
        backgroundColor: { _type: "color", hex: "#0f56c8" },
      },
      {
        _key: "stat-row-2",
        _type: "card",
        stat: "-36%",
        title: "Cost per acquisition",
        description: "Lower spend with better conversion flow.",
        backgroundColor: { _type: "color", hex: "#0f56c8" },
      },
      {
        _key: "stat-row-3",
        _type: "card",
        stat: "3.1x",
        title: "Launch velocity",
        description: "More campaign pages shipped per month.",
        backgroundColor: { _type: "color", hex: "#0f56c8" },
      },
    ],
  },
} satisfies Meta<typeof CaseStudyStatsCardBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const DarkBlueTheme: Story = {
  args: {
    backgroundColor: { _type: "color", hex: "#0f2b7a" },
    cards: [
      {
        _key: "dark-row-1",
        _type: "card",
        stat: "+78%",
        title: "Marketing-sourced pipeline",
        description: "Year-over-year increase.",
        backgroundColor: { _type: "color", hex: "#153a9d" },
      },
      {
        _key: "dark-row-2",
        _type: "card",
        stat: "+39%",
        title: "Landing-page conversion rate",
        description: "Across paid and organic programs.",
        backgroundColor: { _type: "color", hex: "#153a9d" },
      },
      {
        _key: "dark-row-3",
        _type: "card",
        stat: "-28%",
        title: "Cost per opportunity",
        description: "Higher conversion efficiency at lower CAC.",
        backgroundColor: { _type: "color", hex: "#153a9d" },
      },
    ],
  },
};
