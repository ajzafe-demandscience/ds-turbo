import { cn } from "@workspace/ui/lib/utils";
import { CalendarDays, Clock, Hourglass } from "lucide-react";

import { usePageBuilderBlockRoot } from "@/components/page-builder-block-root-context";
import { RichText } from "@/components/elements/rich-text";
import { SanityImage } from "@/components/elements/sanity-image";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PagebuilderType, SanityImageProps } from "@/types";
import { PardotFormBlock } from "./pardot-form";

type HeroWebinarBlockProps = PagebuilderType<"heroWebinar"> & {
  isNested?: boolean;
};

function ScheduleItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-white/90">
      <Icon aria-hidden className="h-5 w-5 text-[#7bd4ff]" />
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <dt className="text-sm font-medium text-white/80">{label}</dt>
        <dd className="text-sm font-semibold text-white">{value}</dd>
      </div>
    </div>
  );
}

export function HeroWebinarBlock({
  eyebrow,
  title,
  subtitle,
  description,
  schedule,
  mediaType,
  mediaImage,
  pardotFormUrl,
  sectionId,
  _type,
  isNested = false,
}: HeroWebinarBlockProps) {
  const { dataSanity, surfaceStyle } = usePageBuilderBlockRoot();
  const containerClassName = isNested
    ? "w-full px-0 pt-10 pb-12 md:pt-14 md:pb-16 lg:pt-16 lg:pb-20"
    : "hero-surface-container pt-24 md:pt-28 lg:pt-32";

  const resolvedSectionId = sectionId?.trim() || "hero";
  const resolvedMediaType =
    mediaType === "image" ? "image" : "pardot";

  const imageForDisplay = mediaImage as SanityImageProps | null | undefined;
  const showImage =
    resolvedMediaType === "image" && Boolean(imageForDisplay?.id);
  const showPardot =
    resolvedMediaType === "pardot" && Boolean(pardotFormUrl?.trim());
  const hasMediaColumn = showImage || showPardot;

  const scheduleDate = schedule?.date?.trim() ?? "";
  const scheduleTime = schedule?.time?.trim() ?? "";
  const scheduleDuration = schedule?.duration?.trim() ?? "";
  const hasSchedule = Boolean(
    scheduleDate || scheduleTime || scheduleDuration
  );

  const mediaColumn =
    showImage && imageForDisplay?.id ? (
      <div className="flex w-full justify-center lg:justify-end">
        <div className="w-full max-w-[520px] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:max-w-[560px]">
          <SanityImage
            alt={imageForDisplay.alt ?? title?.trim() ?? "Webinar image"}
            className="h-auto w-full object-contain object-center"
            image={imageForDisplay}
            loading="eager"
          />
        </div>
      </div>
    ) : showPardot ? (
      <div className="flex w-full justify-center lg:justify-end">
        <div className="w-full max-w-[520px] rounded-[28px] bg-white px-6 py-7 shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:px-8 sm:py-8">
          <PardotFormBlock
            _key="hero-webinar-pardot-embed"
            _type="pardotForm"
            compact
            transparent
            url={pardotFormUrl?.trim() ?? ""}
          />
        </div>
      </div>
    ) : null;

  return (
    <section
      className={cn(camelCaseToKebabCase(_type), "article-hero-surface")}
      data-sanity={dataSanity}
      id={resolvedSectionId}
      style={surfaceStyle}
    >
      <div className={containerClassName}>
        <div
          className={cn(
            "two-column-responsive-padding grid items-start gap-10 md:gap-12",
            hasMediaColumn
              ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]"
              : "mx-auto max-w-4xl"
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-5 text-left text-white md:gap-7",
              hasMediaColumn ? undefined : "col-span-full"
            )}
          >
            {eyebrow?.trim() ? (
              <div className="inline-flex">
                <span className="article-hero-eyebrow">{eyebrow.trim()}</span>
              </div>
            ) : null}

            {title?.trim() ? (
              <h1 className="hero-page-title max-w-3xl text-white">
                {title.trim()}
              </h1>
            ) : null}

            {subtitle?.trim() ? (
              <p className="max-w-2xl text-lg text-white/90 md:text-xl mb-0">
                {subtitle.trim()}
              </p>
            ) : null}

            {description?.length ? (
              <div className="max-w-2xl">
                <RichText
                  className="text-white/90 prose-p:text-white/90 prose-headings:text-white prose-strong:text-white prose-a:text-white prose-li:text-white/90"
                  richText={description}
                />
              </div>
            ) : null}

            {hasSchedule ? (
              <dl className="flex max-w-2xl flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-3">
                {scheduleDate ? (
                  <ScheduleItem icon={CalendarDays} label="" value={scheduleDate} />
                ) : null}
                {scheduleTime ? (
                  <ScheduleItem icon={Clock} label="" value={scheduleTime} />
                ) : null}
                {scheduleDuration ? (
                  <ScheduleItem icon={Hourglass} label="" value={scheduleDuration} />
                ) : null}
              </dl>
            ) : null}
          </div>

          {hasMediaColumn ? mediaColumn : null}
        </div>
      </div>
    </section>
  );
}

