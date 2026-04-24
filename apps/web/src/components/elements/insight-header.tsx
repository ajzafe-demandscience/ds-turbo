import { cn } from "@workspace/ui/lib/utils";

const DEFAULT_BAR_BG = "#E5E5E5";
const DEFAULT_BAR_TEXT = "#333333";

export type InsightHeaderProps = {
  readonly text: string;
  readonly barBackgroundColor?: string;
  readonly barTextColor?: string;
  readonly className?: string;
};

/**
 * Full-width callout bar: rounded pill, centered bold label (e.g. insight intro line).
 */
export function InsightHeader({
  text,
  barBackgroundColor,
  barTextColor,
  className,
}: InsightHeaderProps) {
  const resolvedText = text.trim();
  if (!resolvedText) {
    return null;
  }

  const bg = barBackgroundColor?.trim() || DEFAULT_BAR_BG;
  const fg = barTextColor?.trim() || DEFAULT_BAR_TEXT;

  return (
    <div className={cn("w-full", className)}>
      <p
        className="rounded-2xl px-6 py-4 text-center font-semibold text-base leading-snug tracking-tight md:px-8 md:py-5 md:text-lg"
        style={{ backgroundColor: bg, color: fg }}
      >
        {resolvedText}
      </p>
    </div>
  );
}
