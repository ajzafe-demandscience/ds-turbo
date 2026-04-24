"use client";

import type { CSSProperties } from "react";
import { createContext, useContext, useMemo } from "react";

export type PageBuilderBlockRootValue = {
  readonly dataSanity?: string;
  readonly surfaceStyle?: CSSProperties;
};

const PageBuilderBlockRootContext = createContext<
  PageBuilderBlockRootValue | undefined
>(undefined);

export function PageBuilderBlockRootProvider({
  children,
  dataSanity,
  surfaceStyle,
}: {
  readonly children: React.ReactNode;
  readonly dataSanity?: string;
  readonly surfaceStyle?: CSSProperties;
}) {
  const value = useMemo(
    () => ({ dataSanity, surfaceStyle }),
    [dataSanity, surfaceStyle]
  );

  return (
    <PageBuilderBlockRootContext.Provider value={value}>
      {children}
    </PageBuilderBlockRootContext.Provider>
  );
}

export function usePageBuilderBlockRoot(): PageBuilderBlockRootValue {
  return useContext(PageBuilderBlockRootContext) ?? {};
}
