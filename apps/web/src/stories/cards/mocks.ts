import type { SanityImageProps } from "@/types";

function mockImage(partial: { id: string; alt: string }): SanityImageProps {
  return {
    id: partial.id,
    alt: partial.alt,
    preview: null,
    hotspot: null,
    crop: null,
  };
}

export const mockImages = {
  card: mockImage({
    id: "placeholder-card-image",
    alt: "Dashboard overview with campaign analytics",
  }),
  iconA: mockImage({
    id: "image-31b9f2d6728a4c8f90ad0be12a64ffcc-320x320-png",
    alt: "Icon representing campaign planning",
  }),
  iconB: mockImage({
    id: "image-4a8f0d2a1ee947a0becc014681892341-320x320-png",
    alt: "Icon representing launch workflows",
  }),
  iconC: mockImage({
    id: "image-7410acde2f1c4e4eb6d22cc4f8dc9b90-320x320-png",
    alt: "Icon representing reporting and analytics",
  }),
  feature: mockImage({
    id: "image-5ef1b8cccb8a4e3a93f5d5792314a1e3-1200x1200-png",
    alt: "Team reviewing results in a strategy workshop",
  }),
  logo: mockImage({
    id: "image-c0e1ad2b40924f60a5a07dd93d7410af-600x180-png",
    alt: "Acme Corp logo",
  }),
};
