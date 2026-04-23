"use client";

import { cn } from "@workspace/ui/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PageBuilderBlock } from "@/types";

type StatsCounterItem = {
  _key: string;
  value?: number | null;
  prefix?: string | null;
  suffix?: string | null;
  label?: string | null;
  description?: string | null;
};

export type StatsCounterBlockProps = {
  title?: string | null;
  description?: string | null;
  footerText?: string | null;
  items?: StatsCounterItem[] | null;
  sectionId?: string | null;
  isNested?: boolean;
} & Pick<PageBuilderBlock, "_type">;

const DEFAULT_DURATION_MS = 1600;

function easeOutCubic(progress: number): number {
  return 1 - (1 - progress) ** 3;
}

function CounterValue({
  value,
  isVisible,
}: {
  value: number;
  isVisible: boolean;
}) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    let animationFrameId = 0;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / DEFAULT_DURATION_MS, 1);
      const easedProgress = easeOutCubic(progress);
      const nextValue = Math.round(value * easedProgress);
      setCurrentValue(nextValue);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(animate);
      }
    };

    animationFrameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, value]);

  return <>{currentValue.toLocaleString()}</>;
}

export function StatsCounterBlock({
  title,
  description,
  footerText,
  items,
  sectionId,
  _type,
  isNested = false,
}: StatsCounterBlockProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasBecomeVisible, setHasBecomeVisible] = useState(false);
  const resolvedSectionId = sectionId?.trim() || undefined;

  const resolvedItems = useMemo(
    () =>
      (Array.isArray(items) ? items : []).filter(
        (item): item is StatsCounterItem & { value: number } =>
          typeof item.value === "number" && Number.isFinite(item.value)
      ),
    [items]
  );

  useEffect(() => {
    if (hasBecomeVisible || !sectionRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasBecomeVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasBecomeVisible]);

  if (!resolvedItems.length) {
    return null;
  }

  return (
    <section
      className={cn(
        camelCaseToKebabCase(_type),
        isNested ? undefined : "container-wrapper py-10 md:py-14"
      )}
      id={resolvedSectionId}
      ref={sectionRef}
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          {title ? (
            <h2 className="font-semibold text-3xl tracking-tight md:text-5xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mx-auto mt-5 max-w-3xl text-lg text-muted-foreground md:text-xl">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-10 grid grid-cols-1 divide-y md:grid-cols-3 md:divide-y-0">
          {resolvedItems.map((item, index) => (
            <article
              className={`px-6 py-8 text-center md:relative ${
                index < resolvedItems.length - 1
                  ? "md:after:absolute md:after:inset-y-0 md:after:right-0 md:after:w-px md:after:bg-border"
                  : ""
              }`}
              key={item._key}
            >
              <p
                className="tracking-tight"
                style={{
                  color: "#0066fc",
                  fontSize: "80px",
                  fontWeight: 400,
                  lineHeight: 1,
                }}
              >
                {item.prefix ?? ""}
                <CounterValue isVisible={hasBecomeVisible} value={item.value} />
                {item.suffix ?? ""}
              </p>
              {item.label ? (
                <h5
                  className="mt-4 text-lg"
                  style={{ color: "#0066fc", fontWeight: 600 }}
                >
                  {item.label}
                </h5>
              ) : null}
              {item.description ? (
                <p className="mt-3 text-muted-foreground text-sm">{item.description}</p>
              ) : null}
            </article>
          ))}
        </div>

        {footerText ? (
          <p className="mt-10 text-center text-lg text-muted-foreground">
            {footerText}
          </p>
        ) : null}
      </div>
    </section>
  );
}
