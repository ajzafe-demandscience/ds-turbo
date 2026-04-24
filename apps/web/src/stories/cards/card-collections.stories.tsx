import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { HowItWorksCardsBlock } from "@/components/sections/how-it-works-cards";
import { WhatWeDoCardsBlock } from "@/components/sections/what-we-do-cards";
import { WhatYouCanRunCardsBlock } from "@/components/sections/what-you-can-run-cards";

import { mockImages } from "./mocks";

const meta = {
  title: "Cards/Card Collections",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="space-y-12 py-10">
      <section className="container-wrapper">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border bg-card">
          <img
            alt="Sample campaign dashboard preview"
            className="h-auto w-full object-cover"
            src="https://placehold.co/1400x640/dbeafe/1e3a8a?text=Sample+Image"
          />
          <div className="p-5 md:p-6">
            <h3 className="font-semibold text-2xl tracking-tight">
              Card Collections Overview
            </h3>
            <p className="mt-2 text-muted-foreground">
              Sample visual block for marketing previews.
            </p>
          </div>
        </div>
      </section>

      <HowItWorksCardsBlock
        _type="howItWorksCards"
        columnsPerRow={3}
        description="A simple three-step structure for launch execution."
        items={[
          {
            _key: "how-1",
            title: "Plan",
            description: "Align message, audience, and conversion goals.",
            image: mockImages.iconA,
          },
          {
            _key: "how-2",
            title: "Launch",
            description: "Ship pages and campaigns with reusable blocks.",
            image: mockImages.iconB,
          },
          {
            _key: "how-3",
            title: "Optimize",
            description: "Track performance and iterate weekly.",
            image: mockImages.iconC,
          },
        ]}
        title="How It Works Cards"
      />

      <WhatYouCanRunCardsBlock
        _type="whatYouCanRunCards"
        columnsPerRow={4}
        description="Use-case oriented cards to show capability breadth."
        items={[
          {
            _key: "run-1",
            title: "Product Launches",
            description: "Coordinate GTM pages for new releases.",
            image: mockImages.iconA,
          },
          {
            _key: "run-2",
            title: "ABM Campaigns",
            description: "Create targeted page experiences by segment.",
            image: mockImages.iconB,
          },
          {
            _key: "run-3",
            title: "Event Journeys",
            description: "Build pre and post-event conversion funnels.",
            image: mockImages.iconC,
          },
          {
            _key: "run-4",
            title: "Partner Growth",
            description: "Launch co-branded pages at scale.",
            image: mockImages.iconA,
          },
        ]}
        title="What You Can Run Cards"
      />

      <WhatWeDoCardsBlock
        _type="whatWeDoCards"
        cards={[
          {
            _key: "do-1",
            title: "Messaging Architecture",
            description: "Define narratives that improve conversion quality.",
            accentImage: mockImages.iconA,
          },
          {
            _key: "do-2",
            title: "Campaign Systems",
            description: "Ship repeatable campaign experiences faster.",
            accentImage: mockImages.iconB,
          },
          {
            _key: "do-3",
            title: "Performance Optimization",
            description: "Iterate pages with measurable outcomes.",
            accentImage: mockImages.iconC,
          },
        ]}
        description="Positioning-focused card group with feature spotlight."
        featureCaption="Teams using this pattern reduce launch delays and improve campaign consistency."
        featureImage={mockImages.feature}
        featureLogo={mockImages.logo}
        title="What We Do Cards"
      />
    </div>
  ),
};
