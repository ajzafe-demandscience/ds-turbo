import { cn } from "@workspace/ui/lib/utils";
import Script from "next/script";

import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PagebuilderType } from "@/types";

type PardotResizerWindow = Window & {
  iFrameResize?: () => void;
};

export type PardotFormBlockProps = PagebuilderType<"pardotForm"> & {
  pardotUrl?: string | null;
  compact?: boolean;
  transparent?: boolean;
};

const IFRAME_RESIZER_SRC =
  "https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.2.11/iframeResizer.min.js?v=111";

export function PardotFormBlock({
  url,
  pardotUrl,
  sectionId,
  _type,
  compact = false,
  transparent = false,
}: PardotFormBlockProps) {
  const iframeUrl = pardotUrl ?? url;
  if (!iframeUrl) {
    return null;
  }

  const wrapperClassName = transparent
    ? "overflow-hidden rounded-2xl border-0 bg-transparent p-0 shadow-none"
    : compact
      ? "overflow-hidden rounded-2xl border border-white/20 bg-background/95 p-6 shadow-sm"
      : "overflow-hidden rounded-2xl border bg-background p-6 shadow-sm";

  const sectionClassName = compact
    ? undefined
    : "container-wrapper";
  const resolvedSectionId = sectionId?.trim() || undefined;

  return (
    <div className={cn(camelCaseToKebabCase(_type), "contents")}>
      <Script
        onLoad={() => {
          (window as PardotResizerWindow).iFrameResize?.();
        }}
        src={IFRAME_RESIZER_SRC}
      />
      <section className={sectionClassName} id={resolvedSectionId}>
        <div className={wrapperClassName}>
          <iframe
            className="min-h-[302px] w-full"
            loading="lazy"
            src={iframeUrl}
            title="Pardot Form"
          />
        </div>
      </section>
    </div>
  );
}
