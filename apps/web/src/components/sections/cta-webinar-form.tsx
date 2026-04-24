"use client";

import { CalendarDays, Clock, Hourglass } from "lucide-react";
import { PortableText, type PortableTextReactComponents } from "next-sanity";

import { usePageBuilderBlockRoot } from "@/components/page-builder-block-root-context";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PagebuilderType } from "@/types";
import { PardotFormBlock } from "./pardot-form";

type CtaWebinarFormBlockProps = PagebuilderType<"ctaWebinarForm"> & {
  isNested?: boolean;
};

function ScheduleItem({
  icon: Icon,
  value,
}: {
  icon: typeof CalendarDays;
  value: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3 text-white/90">
      <Icon aria-hidden className="h-5 w-5 text-[#7bd4ff]" />
      <p className="text-sm font-semibold leading-none text-white mb-0">{value}</p>
    </div>
  );
}

export function CtaWebinarFormBlock({
  title,
  description,
  schedule,
  pardotFormUrl,
  sectionId,
  _type,
  isNested = false,
}: CtaWebinarFormBlockProps) {
  const { dataSanity, surfaceStyle } = usePageBuilderBlockRoot();
  const resolvedSectionId = sectionId?.trim() || undefined;
  const resolvedTitle = title?.trim();
  const resolvedPardotUrl = pardotFormUrl?.trim() ?? "";

  if (!resolvedTitle && !description?.length) {
    return null;
  }

  const scheduleDate = schedule?.date?.trim() ?? "";
  const scheduleTime = schedule?.time?.trim() ?? "";
  const scheduleDuration = schedule?.duration?.trim() ?? "";
  const hasSchedule = Boolean(scheduleDate || scheduleTime || scheduleDuration);

  const portableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className="text-white text-sm/6 md:text-base/7">{children}</p>
      ),
    },
    marks: {
      link: ({ children, value }) => (
        <a
          className="text-white underline decoration-dotted underline-offset-2"
          href={value?.href}
          rel="noopener"
          target="_blank"
        >
          {children}
        </a>
      ),
    },
  } satisfies Partial<PortableTextReactComponents>;

  const inner = (
    <article className="mx-auto w-full max-w-6xl rounded-[28px] bg-gradient-to-b from-[#101f80] to-[#2f25b0] px-8 py-10 text-center md:px-14 md:py-12 lg:px-20">
      {resolvedTitle ? (
        <h2
          className="mx-auto max-w-3xl font-semibold text-white tracking-tight"
          style={{ fontSize: "30px", lineHeight: 1.15 }}
        >
          {resolvedTitle}
        </h2>
      ) : null}

      {description?.length ? (
        <div className="mx-auto mt-4 max-w-4xl space-y-3 text-white">
          <PortableText components={portableTextComponents} value={description} />
        </div>
      ) : null}

      <div className="mx-auto mt-8 w-full max-w-[760px] rounded-[28px] bg-white px-6 py-8 shadow-[0_18px_60px_rgba(0,0,0,0.35)] md:px-10 md:py-10">
        {resolvedPardotUrl ? (
          <PardotFormBlock
            _key="cta-webinar-form-pardot"
            _type="pardotForm"
            compact
            transparent
            url={resolvedPardotUrl}
          />
        ) : (
          <div className="h-[320px] w-full rounded-2xl bg-white" />
        )}
      </div>

      {hasSchedule ? (
        <div className="mt-8 grid grid-cols-1 justify-items-center gap-y-3 md:grid-cols-3 md:gap-x-10 md:gap-y-0">
          {scheduleDate ? (
            <ScheduleItem icon={CalendarDays} value={scheduleDate} />
          ) : null}
          {scheduleTime ? <ScheduleItem icon={Clock} value={scheduleTime} /> : null}
          {scheduleDuration ? (
            <ScheduleItem icon={Hourglass} value={scheduleDuration} />
          ) : null}
        </div>
      ) : null}
    </article>
  );

  return (
    <section
      className={camelCaseToKebabCase(_type)}
      data-sanity={dataSanity}
      id={resolvedSectionId}
      style={surfaceStyle}
    >
      {isNested ? inner : <div className="container-wrapper py-10 md:py-14">{inner}</div>}
    </section>
  );
}

