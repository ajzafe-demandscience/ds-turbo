"use client";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronDown } from "lucide-react";
import type { PortableTextBlock } from "next-sanity";
import {
  createContext,
  type FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import slugify from "slugify";

import type { SanityRichTextBlock, SanityRichTextProps } from "@/types";
import { parseChildrenToSlug } from "@/utils";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type TocVariant = "default" | "article";

type TableOfContentProps = {
  richText?: SanityRichTextProps;
  className?: string;
  maxDepth?: number;
  /** Visible heading for the block (default: Table of Contents). */
  title?: string;
  /** When false, the list is always shown (no disclosure). */
  collapsible?: boolean;
  /** `article`: light editorial sidebar; `default`: existing panel style. */
  variant?: TocVariant;
  /** Hide internal heading when rendered externally. */
  showTitle?: boolean;
};

type ProcessedHeading = {
  readonly id: string;
  readonly text: string;
  /** Matches `id` on rendered heading elements in article content. */
  readonly sectionId: string;
  readonly level: number;
  readonly style: HeadingStyle;
  readonly children: ProcessedHeading[];
  readonly isChild: boolean;
  readonly _key?: string;
};

type AnchorProps = {
  readonly heading: ProcessedHeading;
  readonly maxDepth?: number;
  readonly currentDepth?: number;
};

type TableOfContentState = {
  readonly shouldShow: boolean;
  readonly headings: ProcessedHeading[];
  readonly error?: string;
};

type HeadingStyle = "h2" | "h3" | "h4" | "h5" | "h6";

type SanityTextChild = {
  readonly marks?: readonly string[];
  readonly text?: string;
  readonly _type: "span";
  readonly _key: string;
};

type HeadingBlock = Extract<SanityRichTextBlock, { _type: "block" }> & {
  style: HeadingStyle;
  children: readonly SanityTextChild[];
};

// ============================================================================
// CONSTANTS
// ============================================================================

const HEADING_STYLES: Record<HeadingStyle, string> = {
  h2: "pl-0",
  h3: "pl-4",
  h4: "pl-8",
  h5: "pl-12",
  h6: "pl-16",
} as const;

const HEADING_LEVELS: Record<HeadingStyle, number> = {
  h2: 2,
  h3: 3,
  h4: 4,
  h5: 5,
  h6: 6,
} as const;

const SLUGIFY_OPTIONS = {
  lower: true,
  strict: true,
  remove: /[*+~.()'"!:@]/g,
} as const;

const DEFAULT_MAX_DEPTH = 6;
const MIN_HEADINGS_TO_SHOW = 1;

// ============================================================================
// TYPE GUARDS & VALIDATORS
// ============================================================================

function isValidHeadingStyle(style: unknown): style is HeadingStyle {
  return typeof style === "string" && style in HEADING_STYLES;
}

function isValidTextChild(child: unknown): child is SanityTextChild {
  return (
    typeof child === "object" &&
    child !== null &&
    "_type" in child &&
    child._type === "span" &&
    "text" in child &&
    typeof child.text === "string"
  );
}

function hasValidTextChildren(
  children: unknown
): children is readonly SanityTextChild[] {
  return (
    Array.isArray(children) &&
    children.length > 0 &&
    children.every(isValidTextChild)
  );
}

function isHeadingBlock(block: unknown): block is HeadingBlock {
  if (
    typeof block !== "object" ||
    block === null ||
    !("_type" in block) ||
    block._type !== "block"
  ) {
    return false;
  }

  const candidate = block as Record<string, unknown>;

  return (
    isValidHeadingStyle(candidate.style) &&
    hasValidTextChildren(candidate.children)
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function createSlug(text: string): string {
  if (!text?.trim()) {
    return "";
  }

  try {
    return slugify(text.trim(), SLUGIFY_OPTIONS);
  } catch (_error) {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  }
}

function extractTextFromChildren(children: readonly SanityTextChild[]): string {
  try {
    return children
      .map((child) => child.text?.trim() ?? "")
      .filter(Boolean)
      .join(" ")
      .trim();
  } catch (_error) {
    return "";
  }
}

function generateUniqueId(text: string, index: number, _key?: string): string {
  const baseId = _key || createSlug(text) || `heading-${index}`;
  return `toc-${baseId}`;
}

// ============================================================================
// CORE BUSINESS LOGIC
// ============================================================================

function extractHeadingBlocks(richText: SanityRichTextProps): HeadingBlock[] {
  if (!(richText && Array.isArray(richText))) {
    return [];
  }

  try {
    return richText.filter(isHeadingBlock);
  } catch (_error) {
    return [];
  }
}

function createProcessedHeading(
  block: HeadingBlock,
  index: number
): ProcessedHeading | null {
  try {
    const text = extractTextFromChildren(block.children);

    if (!text) {
      return null;
    }

    const sectionId = parseChildrenToSlug(
      block.children as PortableTextBlock["children"]
    );
    if (!sectionId?.trim()) {
      return null;
    }

    const level = HEADING_LEVELS[block.style];
    const id = generateUniqueId(text, index, block._key);

    return {
      id,
      text,
      sectionId,
      level,
      style: block.style,
      children: [],
      isChild: false,
      _key: block._key,
    };
  } catch (_error) {
    return null;
  }
}

function buildHeadingHierarchy(
  flatHeadings: ProcessedHeading[],
  maxDepth: number = DEFAULT_MAX_DEPTH
): ProcessedHeading[] {
  if (flatHeadings.length === 0) {
    return [];
  }

  try {
    const result: ProcessedHeading[] = [];
    const processed = new Set<number>();

    flatHeadings.forEach((heading, index) => {
      if (processed.has(index) || heading.level > maxDepth) {
        return;
      }

      const children = collectChildHeadings(
        flatHeadings,
        index,
        processed,
        maxDepth
      );

      result.push({
        ...heading,
        children,
      });
    });

    return result;
  } catch (_error) {
    return flatHeadings.map((heading) => ({
      ...heading,
      children: [],
    }));
  }
}

function collectChildHeadings(
  headings: ProcessedHeading[],
  parentIndex: number,
  processed: Set<number>,
  maxDepth: number
): ProcessedHeading[] {
  const parentHeading = headings[parentIndex];

  if (!parentHeading || parentHeading.level >= maxDepth) {
    return [];
  }

  const children: ProcessedHeading[] = [];
  const parentLevel = parentHeading.level;

  for (let i = parentIndex + 1; i < headings.length; i++) {
    const currentHeading = headings[i];

    if (!currentHeading || currentHeading.level <= parentLevel) {
      break;
    }

    if (processed.has(i) || currentHeading.level > maxDepth) {
      continue;
    }

    processed.add(i);

    const nestedChildren = collectChildHeadings(
      headings,
      i,
      processed,
      maxDepth
    );

    children.push({
      ...currentHeading,
      children: nestedChildren,
      isChild: true,
    });
  }

  return children;
}

function processHeadingBlocks(
  headingBlocks: HeadingBlock[],
  maxDepth: number = DEFAULT_MAX_DEPTH
): ProcessedHeading[] {
  if (!Array.isArray(headingBlocks) || headingBlocks.length === 0) {
    return [];
  }

  try {
    const processedHeadings = headingBlocks
      .map(createProcessedHeading)
      .filter((heading): heading is ProcessedHeading => heading !== null);

    return buildHeadingHierarchy(processedHeadings, maxDepth);
  } catch (_error) {
    return [];
  }
}

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

function useTableOfContentState(
  richText?: SanityRichTextProps,
  maxDepth: number = DEFAULT_MAX_DEPTH
): TableOfContentState {
  return useMemo(() => {
    try {
      if (!(richText && Array.isArray(richText)) || richText.length === 0) {
        return {
          shouldShow: false,
          headings: [],
        };
      }

      const headingBlocks = extractHeadingBlocks(richText);

      if (headingBlocks.length < MIN_HEADINGS_TO_SHOW) {
        return {
          shouldShow: false,
          headings: [],
        };
      }

      const processedHeadings = processHeadingBlocks(headingBlocks, maxDepth);

      return {
        shouldShow: processedHeadings.length >= MIN_HEADINGS_TO_SHOW,
        headings: processedHeadings,
      };
    } catch (error) {
      return {
        shouldShow: false,
        headings: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }, [richText, maxDepth]);
}

// ============================================================================
// COMPONENTS
// ============================================================================

type TocNavContextValue = {
  activeSectionId: string | null;
  scrollToSection: (sectionId: string) => void;
};

const TocNavContext = createContext<TocNavContextValue | null>(null);

function useTocNav(): TocNavContextValue {
  const ctx = useContext(TocNavContext);
  if (!ctx) {
    throw new Error("TOC navigation context is missing");
  }
  return ctx;
}

function collectSectionIds(headings: ProcessedHeading[]): string[] {
  const ids: string[] = [];
  const walk = (items: ProcessedHeading[]) => {
    for (const h of items) {
      ids.push(h.sectionId);
      if (h.children.length > 0) {
        walk(h.children);
      }
    }
  };
  walk(headings);
  return ids;
}

const TableOfContentAnchor: FC<AnchorProps> = ({
  heading,
  maxDepth = DEFAULT_MAX_DEPTH,
  currentDepth = 1,
}) => {
  const { sectionId, text, children, isChild, id } = heading;
  const { activeSectionId, scrollToSection } = useTocNav();
  const isActive = activeSectionId === sectionId;

  const shouldRenderChildren = useCallback(
    () =>
      Array.isArray(children) && children.length > 0 && currentDepth < maxDepth,
    [children, currentDepth, maxDepth]
  );

  // Don't render if we're at max depth and this is a child
  if (currentDepth > maxDepth) {
    return null;
  }

  // Don't render if text or target id is invalid
  if (!(text?.trim() && sectionId?.trim())) {
    return null;
  }

  const hasChildren = shouldRenderChildren();

  return (
    <li className="m-0 list-none text-[18px]">
      <button
        aria-current={isActive ? "location" : undefined}
        aria-describedby={`${id}-level`}
        className={cn(
          "w-full cursor-pointer border-0 bg-transparent text-left break-words whitespace-normal py-[15px] text-[18px] leading-[32px] text-[#707070] transition-[border-color] duration-300 focus:outline-none",
          isChild &&
            cn(
              "border-l-[5px] border-l-[#eee] pl-[40px] pr-5 hover:border-l-[#0166fc] active:border-l-[#0166fc] focus-visible:border-l-[#0166fc]",
              isActive && "!border-l-[#0166fc]"
            ),
          !isChild &&
            cn(
              "border-l-[5px] border-l-[#eeeeee] px-5 hover:border-l-[#0166fc] active:border-l-[#0166fc] focus-visible:border-l-[#0166fc]",
              isActive && "!border-l-[#0166fc]"
            )
        )}
        type="button"
        onClick={() => scrollToSection(sectionId)}
      >
        {text}
        <span className="sr-only" id={`${id}-level`}>
          Heading level {heading.level}
        </span>
      </button>

      {hasChildren && (
        <ul className="m-0 list-none p-0">
          {children.map((child, index) => (
            <TableOfContentAnchor
              currentDepth={currentDepth + 1}
              heading={child}
              key={child.id || `${child.text}-${index}-${currentDepth}`}
              maxDepth={maxDepth}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export const TableOfContent: FC<TableOfContentProps> = ({
  richText,
  className,
  maxDepth = DEFAULT_MAX_DEPTH,
  title = "Table of Contents",
  collapsible = true,
  variant = "default",
  showTitle = true,
}) => {
  const { shouldShow, headings, error } = useTableOfContentState(
    richText,
    maxDepth
  );

  const sectionIdList = useMemo(
    () => collectSectionIds(headings),
    [headings]
  );

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    setActiveSectionId(sectionId);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (!shouldShow || sectionIdList.length === 0) {
      return;
    }

    const elements = sectionIdList
      .map((sid) => document.getElementById(sid))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) {
      return;
    }

    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const intersecting = entries.filter((e) => e.isIntersecting);
          const first = intersecting[0];
          if (!first) {
            return;
          }
          let best = first;
          let bestScore = Number.POSITIVE_INFINITY;
          for (const entry of intersecting) {
            const top = entry.boundingClientRect.top;
            const score = Math.abs(top - 96);
            if (score < bestScore) {
              bestScore = score;
              best = entry;
            }
          }
          const nextId = (best.target as HTMLElement).id;
          if (nextId) {
            setActiveSectionId(nextId);
          }
        });
      },
      {
        root: null,
        rootMargin: "-80px 0px -55% 0px",
        threshold: [0, 0.01, 0.25, 0.5, 1],
      }
    );

    for (const el of elements) {
      observer.observe(el);
    }
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [shouldShow, sectionIdList]);

  const tocNavValue = useMemo(
    () => ({ activeSectionId, scrollToSection }),
    [activeSectionId, scrollToSection]
  );

  // Early return for error state
  if (error) {
    return null;
  }

  // Early return if nothing to show
  if (!shouldShow || headings.length === 0) {
    return null;
  }

  const navList = (
    <nav aria-label={title}>
      <ul
        className={cn(
          "list-none m-0 p-0 space-y-1 text-sm"
        )}
      >
        {headings.map((heading, index) => (
          <TableOfContentAnchor
            currentDepth={1}
            heading={heading}
            key={heading.id || `${heading.text}-${index}`}
            maxDepth={maxDepth}
          />
        ))}
      </ul>
    </nav>
  );

  return (
    <TocNavContext.Provider value={tocNavValue}>
      <aside
        aria-labelledby="toc-heading"
        className={cn(
          "flex w-full max-w-xs flex-col transition-all duration-200",
          variant === "article"
            ? "bg-transparent"
            : "sticky top-20 rounded-lg border border-zinc-300 bg-gradient-to-b from-zinc-50 to-zinc-100 shadow-sm dark:border-zinc-700 dark:from-zinc-800 dark:to-zinc-900",
          className
        )}
      >
        {collapsible ? (
          <details className="group" open>
            {showTitle && (
              <summary
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-sm p-1 font-semibold text-lg transition-colors duration-200 focus:outline-none",
                  variant === "article"
                    ? "text-[var(--article-ink)] hover:text-[var(--article-accent)] dark:text-zinc-100"
                    : "text-zinc-800 hover:text-blue-600 dark:text-zinc-200 dark:hover:text-blue-400"
                )}
                id="toc-heading"
              >
                <span>{title}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "h-5 w-5 transform transition-transform duration-200",
                    "group-open:rotate-180"
                  )}
                />
              </summary>
            )}
            {navList}
          </details>
        ) : (
          <>
            {showTitle && (
              <h2
                className={cn(
                  "font-semibold text-lg tracking-tight",
                  variant === "article"
                    ? "text-[var(--article-ink)] dark:text-zinc-100"
                    : "text-zinc-800 dark:text-zinc-200"
                )}
                id="toc-heading"
              >
                {title}
              </h2>
            )}
            {navList}
          </>
        )}
      </aside>
    </TocNavContext.Provider>
  );
};
