import { cn } from "@workspace/ui/lib/utils";

import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PagebuilderType } from "@/types";

export type H1BlockProps = PagebuilderType<"h1">;

export function H1Block({ text, sectionId, _type }: H1BlockProps) {
  if (!text?.trim()) {
    return null;
  }

  const resolvedSectionId = sectionId?.trim() || undefined;

  return (
    <section className={cn(camelCaseToKebabCase(_type))} id={resolvedSectionId}>
      <h1 className="hero-page-title max-w-3xl text-white">
        {text}
      </h1>
    </section>
  );
}
