"use client";

import { cn } from "@workspace/ui/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

import { SanityImage } from "@/components/elements/sanity-image";
import type { SanityImageProps } from "@/types";

type CompanyLogoItem = {
  image: SanityImageProps;
  alt?: string | null;
  href?: string;
  openInNewTab?: boolean;
};

type CompanyLogoCarouselProps = {
  logos: CompanyLogoItem[];
  className?: string;
};

export function CompanyLogoCarousel({
  logos,
  className,
}: CompanyLogoCarouselProps) {
  const repeatedLogos = useMemo(() => {
    if (!logos.length) {
      return [];
    }

    const minimumSlides = 18;
    if (logos.length >= minimumSlides) {
      return logos;
    }

    const repeatCount = Math.ceil(minimumSlides / logos.length);
    return Array.from({ length: repeatCount }).flatMap(() => logos);
  }, [logos]);
  const marqueeLogos = useMemo(
    () => [...repeatedLogos, ...repeatedLogos],
    [repeatedLogos]
  );
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const measureSlide = () => {
      const firstSlide = trackRef.current?.querySelector<HTMLElement>(
        "[data-carousel-slide='true']"
      );
      if (!firstSlide) {
        return;
      }

      const nextWidth = firstSlide.getBoundingClientRect().width;
      if (nextWidth > 0) {
        setSlideWidth(nextWidth);
      }
    };

    measureSlide();
    globalThis.addEventListener("resize", measureSlide);

    return () => {
      globalThis.removeEventListener("resize", measureSlide);
    };
  }, [marqueeLogos]);

  useEffect(() => {
    if (!slideWidth || isPaused || !repeatedLogos.length) {
      return;
    }

    const intervalId = globalThis.setInterval(() => {
      setIsAnimating(true);
      setActiveIndex((previousIndex) => previousIndex + 1);
    }, 5000);

    return () => {
      globalThis.clearInterval(intervalId);
    };
  }, [isPaused, repeatedLogos.length, slideWidth]);

  useEffect(() => {
    if (activeIndex < repeatedLogos.length) {
      return;
    }

    const timeoutId = globalThis.setTimeout(() => {
      setIsAnimating(false);
      setActiveIndex(0);
    }, 700);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [activeIndex, repeatedLogos.length]);

  useEffect(() => {
    if (isAnimating) {
      return;
    }

    const timeoutId = globalThis.setTimeout(() => {
      setIsAnimating(true);
    }, 50);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [isAnimating]);

  if (!repeatedLogos.length) {
    return null;
  }

  return (
    <section
      className={cn("company-logo-carousel w-full overflow-x-clip", className)}
    >
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

        <div
          className="w-full max-w-full overflow-hidden"
          onMouseEnter={() => {
            setIsPaused(true);
          }}
          onMouseLeave={() => {
            setIsPaused(false);
          }}
        >
          <div
            className="flex w-max items-center will-change-transform"
            ref={trackRef}
            style={{
              transform: `translateX(-${activeIndex * slideWidth}px)`,
              transition: isAnimating ? "transform 2000ms ease-in-out" : "none",
            }}
          >
            {marqueeLogos.map((logo, logoIndex) => {
              const imageAlt = logo.alt ?? logo.image.alt ?? "Company logo";
              const content = (
                <SanityImage
                  alt={imageAlt}
                  className="h-[70px] w-auto max-w-[180px] rounded-none object-contain opacity-80 transition-opacity duration-200 hover:opacity-100"
                  image={logo.image}
                />
              );

              return (
                <div
                  className="min-w-0 flex-[0_0_180px] px-6 md:flex-[0_0_220px]"
                  data-carousel-slide="true"
                  key={`${logo.image.id}-${logoIndex}`}
                >
                  {logo.href ? (
                    <a
                      aria-label={imageAlt}
                      className="flex items-center justify-center"
                      href={logo.href}
                      rel={logo.openInNewTab ? "noreferrer" : undefined}
                      target={logo.openInNewTab ? "_blank" : "_self"}
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="flex items-center justify-center">
                      {content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
