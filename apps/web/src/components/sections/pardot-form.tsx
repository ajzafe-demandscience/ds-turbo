import { cn } from "@workspace/ui/lib/utils";
import type { PardotForm } from "@workspace/sanity/types";
import Script from "next/script";

import { usePageBuilderBlockRoot } from "@/components/page-builder-block-root-context";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";

type PardotResizerWindow = Window & {
  iFrameResize?: () => void;
};

export type PardotFormBlockProps = PardotForm & {
  _key?: string;
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
  const { dataSanity, surfaceStyle } = usePageBuilderBlockRoot();
  const iframeUrl = pardotUrl ?? url;

  if (!iframeUrl) {
    return null;
  }

  const wrapperClassName = transparent
    ? "overflow-hidden rounded-2xl border-0 bg-transparent p-0 shadow-none"
    : compact
      ? "overflow-hidden rounded-2xl border border-white/20 bg-background/95 p-6 shadow-sm"
      : "overflow-hidden rounded-2xl border bg-background p-6 shadow-sm";

  const resolvedSectionId = sectionId?.trim() || undefined;

  const iframeBlock = (
    <div className={wrapperClassName}>
      <iframe
        className="min-h-[302px] w-full"
        loading="lazy"
        src={iframeUrl}
        title="Pardot Form"
      />
    </div>
  );

  return (
    <div className={cn(camelCaseToKebabCase(_type), "contents")}>
      <Script
        onLoad={() => {
          (window as PardotResizerWindow).iFrameResize?.();
        }}
        src={IFRAME_RESIZER_SRC}
      />
      <section
        className={camelCaseToKebabCase(_type)}
        data-sanity={dataSanity}
        id={resolvedSectionId}
        style={surfaceStyle}
      >
        {compact ? (
          iframeBlock
        ) : (
          <div className="container-wrapper">{iframeBlock}</div>
        )}
      </section>
    </div>
  );
}
