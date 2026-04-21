import Script from "next/script";

import type { PagebuilderType } from "@/types";

type PardotResizerWindow = Window & {
  iFrameResize?: () => void;
};

export type PardotFormBlockProps = PagebuilderType<"pardotForm"> & {
  pardotUrl?: string | null;
  compact?: boolean;
};

const IFRAME_RESIZER_SRC =
  "https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.2.11/iframeResizer.min.js?v=111";

export function PardotFormBlock({
  url,
  pardotUrl,
  sectionId,
  compact = false,
}: PardotFormBlockProps) {
  const iframeUrl = pardotUrl ?? url;
  if (!iframeUrl) {
    return null;
  }

  const wrapperClassName = compact
    ? "overflow-hidden rounded-2xl border border-white/20 bg-background/95 p-6 shadow-sm"
    : "overflow-hidden rounded-2xl border bg-background p-6 shadow-sm";

  const sectionClassName = compact
    ? undefined
    : "container-wrapper";
  const resolvedSectionId = sectionId?.trim() || undefined;

  return (
    <>
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
    </>
  );
}
