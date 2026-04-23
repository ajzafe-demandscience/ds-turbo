import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";

type TitleIconProps = {
  title: string;
  icon: ReactNode;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
};

export function TitleIcon({
  title,
  icon,
  className,
  iconClassName,
  titleClassName,
  as = "h2",
}: TitleIconProps) {
  const Component = as;

  return (
    <Component
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <span className={cn("shrink-0", iconClassName)}>{icon}</span>
      <span className={titleClassName}>{title}</span>
    </Component>
  );
}
