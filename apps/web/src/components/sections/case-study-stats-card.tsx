import { cn } from "@workspace/ui/lib/utils";

import { SanityIcon } from "@/components/elements/sanity-icon";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PagebuilderType } from "@/types";

type ColorValue = string | { hex?: string | null } | null | undefined;

type CaseStudyStatsCardProps = PagebuilderType<"caseStudyStatsCard"> & {
  isNested?: boolean;
};

function resolveColor(color: ColorValue): string | undefined {
  const candidate = typeof color === "string" ? color : color?.hex;
  return typeof candidate === "string" && candidate.trim()
    ? candidate.trim()
    : undefined;
}

export function CaseStudyStatsCardBlock({
  title,
  icon,
  description,
  textColor,
  cards,
  backgroundColor,
  sectionId,
  _type,
  isNested = false,
}: CaseStudyStatsCardProps) {
  const resolvedTitle = title?.trim();
  const resolvedDescription = description?.trim();
  const resolvedSectionId = sectionId?.trim() || undefined;
  const resolvedTextColor = resolveColor(textColor);
  const resolvedBackgroundColor = resolveColor(backgroundColor);

  const rows = (cards ?? []).filter((row) => row?.stat?.trim() || row?.title?.trim());
  if (!resolvedTitle && !resolvedDescription && !rows.length) {
    return null;
  }

  const wrapperStyle = {
    backgroundColor: resolvedBackgroundColor ?? "#1769E8",
    color: resolvedTextColor ?? "#FFFFFF",
  };

  return (
    <section
      className={cn(
        camelCaseToKebabCase(_type),
        isNested ? undefined : "container-wrapper py-8 md:py-10"
      )}
      id={resolvedSectionId}
    >
      <article
        className="mx-auto w-full max-w-5xl rounded-[28px] px-8 py-9 md:px-10 md:py-11"
        style={wrapperStyle}
      >
        {resolvedTitle ? (
          <div className="flex items-center justify-between gap-4">
            <p
              className="text-[30px] font-semibold text-inherit"
              style={{ color: resolvedTextColor ?? "#FFFFFF" }}
            >
              {resolvedTitle}
            </p>
            <SanityIcon
              alt={resolvedTitle}
              className="size-8 shrink-0 md:size-9"
              icon={icon}
              style={{ color: resolvedTextColor ?? "#FFFFFF" }}
            />
          </div>
        ) : null}

        {resolvedDescription ? (
          <p
            style={{ color: resolvedTextColor ?? "#FFFFFF", opacity: 0.95 }}
          >
            {resolvedDescription}
          </p>
        ) : null}

        {rows.length ? (
          <div className="mt-8 space-y-4">
            {rows.map((row) => {
              const rowTextColor = resolveColor(row?.textColor) ?? resolvedTextColor ?? "#FFFFFF";
              const rowBackgroundColor = resolveColor(row?.backgroundColor) ?? "#0F56C8";
              const rowStat = row?.stat?.trim();
              const rowTitle = row?.title?.trim();
              const rowDescription = row?.description?.trim();

              return (
                <div
                  className="rounded-[18px] px-6 py-4 md:px-7 md:py-5"
                  key={row?._key ?? `${rowStat}-${rowTitle}`}
                  style={{ backgroundColor: rowBackgroundColor, color: rowTextColor }}
                >
                  <div className="flex flex-wrap items-center gap-4 md:gap-6">
                    {rowStat ? (
                      <p
                        className="m-0 font-semibold text-[36px] leading-none md:min-w-[92px]"
                        style={{ color: rowTextColor }}
                      >
                        {rowStat}
                      </p>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      {rowTitle ? (
                        <h3 className="font-medium text-[30px] leading-tight md:text-[36px]">
                          {rowTitle}
                        </h3>
                      ) : null}
                      {rowDescription ? (
                        <p
                          className="m-0 text-base/7 md:text-lg/8"
                          style={{ color: rowTextColor, opacity: 0.9 }}
                        >
                          {rowDescription}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </article>
    </section>
  );
}
