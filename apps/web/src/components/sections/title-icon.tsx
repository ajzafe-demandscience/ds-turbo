import { cn } from "@workspace/ui/lib/utils";

import { TitleIcon as TitleIconElement } from "@/components/elements/title-icon";
import { SanityIcon } from "@/components/elements/sanity-icon";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PagebuilderType } from "@/types";

type TitleIconBlockProps = PagebuilderType<"titleIcon"> & {
  isNested?: boolean;
};

export function TitleIconBlock({
  title,
  icon,
  textColor,
  sectionId,
  _type,
  isNested = false,
}: TitleIconBlockProps) {
  const resolvedTitle = title?.trim();
  if (!resolvedTitle) {
    return null;
  }

  const resolvedSectionId = sectionId?.trim() || undefined;
  const resolvedTextColor =
    typeof textColor === "string" ? textColor : textColor?.hex;
  const textStyle =
    typeof resolvedTextColor === "string" && resolvedTextColor.trim()
      ? { color: resolvedTextColor.trim() }
      : undefined;

  return (
    <section
      className={cn(camelCaseToKebabCase(_type), isNested ? undefined : "container-wrapper")}
      id={resolvedSectionId}
    >
      <div style={textStyle}>
        <TitleIconElement
          icon={
            <SanityIcon
              alt={resolvedTitle}
              className="size-5"
              icon={icon}
              style={textStyle}
            />
          }
          titleClassName={textStyle ? "text-inherit" : undefined}
          title={resolvedTitle}
          className={textStyle ? "text-inherit" : undefined}
          iconClassName={textStyle ? "text-inherit" : undefined}
        />
      </div>
    </section>
  );
}
